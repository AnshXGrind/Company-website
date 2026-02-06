Self-hosting Llama 4 Scout / Maverick (overview)

This folder contains guidance and scripts to run an open model locally and expose a small HTTP inference endpoint that the server can call via `LOCAL_MODEL_URL`.

Options:
- Docker Compose with text-generation-webui (oobabooga) — simplest for many models.
- Direct llama.cpp / ggml server — lightweight, recommended for CPU inference with quantized weights.

This README shows a quick Docker Compose approach using `oobabooga/text-generation-webui` which supports many open models (you'll need to download a compatible Llama 4 Scout/Maverick quantized model or a compatible ggml file).

1) Prepare a models directory and place your ggml model there (example: `models/llama-4-scout`)

2) Start with Docker Compose (below in `docker-compose.yml`):

   - It will run the web UI on port 7860 and provide an API at `/api/generate` suitable for simple POST requests with `{inputs, parameters}`. Adjust `LOCAL_MODEL_URL` in your `.env` to `http://localhost:7860/api/generate`.

3) Model files: obtaining Llama 4 Scout/Maverick weights may require following the model provider's licensing and download instructions. The webui accepts many model formats (ggml, GGUF). Place the model file in `./models/` and point the webui to it.

4) Example quick-start (Linux/macOS):

   ```bash
   # create models dir and download model (follow provider instructions)
   mkdir -p ~/launcify_models
   # place model files in ~/launcify_models

   # start docker-compose
   docker compose up -d

   # after container starts, open http://localhost:7860
   # set LOCAL_MODEL_URL in .env to http://localhost:7860/api/generate
   ```

Notes:
- Running large models requires a GPU for good latency. There are CPU-only quantized options but expect slow responses.
- This is a template; adapt based on the model format you obtain.

