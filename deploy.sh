#!/bin/bash
# Deployment-Skript für Tauben-Scanner Backend
# Usage: ./deploy.sh "commit message"

set -e  # Exit on error

COMMIT_MSG="${1:-Update backend}"

echo "🚀 Starting deployment..."
echo ""

# Step 1: Git
echo "📦 Step 1: Git commit and push..."
git add -A
git commit -m "$COMMIT_MSG" || echo "Nothing to commit"
git pull --rebase origin main
git push origin main
echo "✅ Code pushed"
echo ""

# Step 2: Docker Build & Restart
echo "🐳 Step 2: Building and restarting Docker container..."
docker compose up -d --build api
echo "✅ Container restarted"
echo ""

# Step 3: Verify
echo "🔍 Step 3: Checking container status..."
sleep 2
docker ps --format "table {{.Names}}\t{{.Status}}" | grep tauben-api || echo "⚠️ Container not found"
echo ""

# Step 4: Show logs
echo "📋 Step 4: Recent logs..."
docker logs --tail 10 tauben-api 2>&1 | head -10
echo ""

echo "🎉 Deployment complete!"
echo "Check full logs: docker logs -f tauben-api"
