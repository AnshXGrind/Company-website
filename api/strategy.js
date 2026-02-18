import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  // CORS headers — allows same-origin requests from Vercel deployment
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, companySize, bottleneck, techStack } = req.body;

    if (!companySize || !bottleneck) {
      return res.status(400).json({ error: "companySize and bottleneck are required." });
    }

    // ── Supabase Client (server-side only, service role key never exposed) ─────
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // ── Groq System Prompt ─────────────────────────────────────────────────────
    const systemPrompt = `
You are a senior Enterprise AI Automation Consultant.

Your task:
Generate a structured automation strategy for a business based on provided inputs.

Tone:
- Professional
- Enterprise-level
- No emojis
- No fluff
- No hype language

Output Format (Strict JSON):
Return ONLY valid JSON — no markdown, no code fences, no explanation outside the JSON.

{
  "diagnosis": "2-3 sentence analysis of the operational bottleneck",
  "system": "Specific automation system architecture recommendation",
  "hoursSaved": "Realistic numeric weekly hours saved as a string (e.g. '15-20')",
  "timeline": "Implementation duration as a string (e.g. '3-4 weeks')",
  "plan": {
    "week1": "Specific deliverable",
    "week2": "Specific deliverable",
    "week3": "Specific deliverable",
    "week4": "Specific deliverable or handover"
  },
  "nextStep": "One sentence encouraging booking a strategy call — professional tone, no exclamation marks"
}
`;

    const userPrompt = `
Business Inputs:

Company Size: ${companySize}
Primary Bottleneck: ${bottleneck}
Current Tech Stack: ${Array.isArray(techStack) && techStack.length > 0 ? techStack.join(", ") : "Not specified"}
`;

    // ── Call Groq (LLaMA 3) ────────────────────────────────────────────────────
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt.trim() },
          { role: "user",   content: userPrompt.trim() },
        ],
        temperature: 0.4,
        max_tokens: 700,
        response_format: { type: "json_object" },
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq error:", errText);
      return res.status(502).json({ error: "Upstream model error. Try again shortly." });
    }

    const groqData = await groqRes.json();
    const rawContent = groqData.choices?.[0]?.message?.content ?? "{}";

    // Parse structured JSON from model
    let strategy;
    try {
      strategy = JSON.parse(rawContent);
    } catch {
      // Fallback: return raw content if JSON parse fails
      strategy = { raw: rawContent };
    }

    // ── Store Lead in Supabase ─────────────────────────────────────────────────
    const { error: dbError } = await supabase.from("leads").insert([
      {
        name:         name    || null,
        email:        email   || null,
        company_size: companySize,
        bottleneck,
        tech_stack:   Array.isArray(techStack) ? techStack : [],
        ai_response:  rawContent,
        status:       "new",
      },
    ]);

    if (dbError) {
      // Log but do not block response — Supabase write failure must not break UX
      console.error("Supabase insert error:", dbError.message);
    }

    return res.status(200).json({ result: strategy });
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
