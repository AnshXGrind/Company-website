#!/usr/bin/env bash
# Quick helper to start text-generation-webui via docker-compose
# Place your model files (GGUF/ggml) in ./models relative to this folder before starting.
set -e
cd "$(dirname "$0")"

echo "Starting local model (text-generation-webui) via docker compose..."
if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required. Install Docker Desktop or Docker Engine first."
  exit 1
fi

docker compose up -d

echo "Started. Web UI should be available at http://localhost:7860"
echo "Set LOCAL_MODEL_URL to http://localhost:7860/api/generate in your .env to enable server-side AI via the local model."
