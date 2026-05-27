#!/bin/bash
# Deploy MrTube backend + frontend
# Run this on your Ubuntu server

echo "=== Pulling latest code ==="
git pull origin main

echo "=== Restarting Docker containers ==="
docker compose down
docker compose up -d --build

echo "=== Done ==="
docker compose ps
