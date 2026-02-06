const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const upload = multer({ dest: path.join(__dirname, 'uploads') });

const PORT = process.env.PORT || 3000;
const HF_API_KEY = process.env.HF_API_KEY || '';
const MODEL = process.env.MODEL || 'tiiuae/falcon-7b-instruct';
const MODEL_SOURCE = process.env.MODEL_SOURCE || 'hf'; // 'hf' or 'self'
const LOCAL_MODEL_URL = process.env.LOCAL_MODEL_URL || '';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging: write combined logs to access.log and also to console
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// Rate limiting: basic protection for API endpoints
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false });
app.use('/api/', limiter);

// Serve static site from project root
app.use(express.static(path.join(__dirname)));

// Simple leads storage (append to JSON file)
function saveLead(record) {
  const file = path.join(__dirname, 'leads.json');
  let arr = [];
  try { arr = JSON.parse(fs.readFileSync(file)); } catch (e) { arr = []; }
  arr.push(record);
  fs.writeFileSync(file, JSON.stringify(arr, null, 2));
}

async function callHuggingFace(prompt) {
  if (!HF_API_KEY) throw new Error('Missing HF_API_KEY');

  const url = `https://api-inference.huggingface.co/models/${MODEL}`;
  const payload = { inputs: prompt, parameters: { max_new_tokens: 300, temperature: 0.2 } };

  const resp = await axios.post(url, payload, { headers: { Authorization: `Bearer ${HF_API_KEY}` }, timeout: 60000 });

  const data = resp.data;
  if (Array.isArray(data) && data.length && data[0].generated_text) return data[0].generated_text;
  if (data.generated_text) return data.generated_text;
  if (typeof data === 'string') return data;
  return JSON.stringify(data);
}

// Generic local model caller. Expects LOCAL_MODEL_URL to accept POST {inputs,parameters}
async function callLocalModel(prompt) {
  if (!LOCAL_MODEL_URL) throw new Error('Missing LOCAL_MODEL_URL');
  const payload = { inputs: prompt, parameters: { max_new_tokens: 300, temperature: 0.2 } };
  const resp = await axios.post(LOCAL_MODEL_URL, payload, { timeout: 60000 });
  const data = resp.data;
  // Try common response shapes
  if (data && typeof data === 'object') {
    if (data.generated_text) return data.generated_text;
    if (Array.isArray(data) && data[0] && data[0].generated_text) return data[0].generated_text;
    if (data.output) return data.output;
  }
  if (typeof data === 'string') return data;
  return JSON.stringify(data);
}

app.post('/api/submit', upload.single('attachment'), async (req, res) => {
  try {
    const fields = req.body || {};
    // Honeypot
    if (fields._gotcha) return res.status(400).json({ ok: false, error: 'spam' });

    const lead = {
      first_name: fields.first_name || '',
      last_name: fields.last_name || '',
      email: fields.email || '',
      message: fields.message || '',
      form_type: fields.form_type || '',
      ip: req.ip,
      timestamp: new Date().toISOString(),
      attachment: req.file ? req.file.filename : null
    };

    // Save lead locally
    try { saveLead(lead); } catch (e) { /* ignore save errors */ }

    const consent = !!fields.ai_consent;
    if (consent) {
      const prompt = `You are a helpful assistant. Given the contact submission below, classify the intent (one of: inquiry, pricing, support, partnership, other) and priority (low, medium, high). Then produce a concise, professional email reply subject and body addressed to the sender. Respond ONLY in JSON with keys: intent, priority, subject, body.\n\nSubmission:\nName: ${lead.first_name} ${lead.last_name}\nEmail: ${lead.email}\nMessage: ${lead.message}`;

      try {
        let generated;
        if (MODEL_SOURCE === 'self' && LOCAL_MODEL_URL) {
          generated = await callLocalModel(prompt);
        } else if (HF_API_KEY) {
          generated = await callHuggingFace(prompt);
        } else {
          // No AI backend configured
          return res.json({ ok: true, ai: null, warning: 'No AI backend configured' });
        }

        // Try to parse JSON from generated text
        let parsed = null;
        try { parsed = JSON.parse(generated); } catch (e) { parsed = { subject: 'Draft reply', body: generated }; }

        return res.json({ ok: true, ai: parsed });
      } catch (err) {
        console.error('AI generation error', err.message || err);
        return res.json({ ok: true, ai: null, warning: 'AI generation failed' });
      }
    }

    // No AI consent or no HF key — return success
    return res.json({ ok: true, ai: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'server_error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
