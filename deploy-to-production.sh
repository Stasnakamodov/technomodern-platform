#!/bin/bash

# Production Deploy Script
# Server: 155.212.164.197

set -e  # Exit on error

echo "🚀 Starting deployment to production..."

# Server credentials
SERVER_IP="155.212.164.197"
SERVER_USER="root"
SERVER_PASSWORD="Pizda333"
APP_DIR="/root/technomodern-platform"

echo "📡 Connecting to production server..."

# Deploy script that will run on the server
REMOTE_SCRIPT=$(cat <<'ENDSSH'
set -e

echo "📂 Navigating to application directory..."
cd /root/technomodern-platform || {
    echo "❌ Application directory not found!"
    echo "ℹ️  First time setup required. Please run initial setup first."
    exit 1
}

echo "📥 Pulling latest changes from GitHub..."
git fetch --all
git reset --hard production/main
git pull production main

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🏗️  Building application..."
npm run build

echo "♻️  Restarting application with PM2..."
pm2 restart technomodern || pm2 start npm --name "technomodern" -- start

echo "✅ Deployment completed successfully!"
echo "🌐 Application is running on production"
pm2 status
ENDSSH
)

# Execute remote script via SSH
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$REMOTE_SCRIPT"

echo ""
echo "✅ Deployment to production completed!"
echo "🌐 Check your application at: http://$SERVER_IP"
