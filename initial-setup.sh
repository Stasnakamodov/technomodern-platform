#!/bin/bash

# Initial Production Setup Script
# Server: 155.212.164.197

set -e

echo "🚀 Starting initial production setup..."

SERVER_IP="155.212.164.197"
SERVER_USER="root"
SERVER_PASSWORD="Pizda333"
GITHUB_REPO="https://github.com/Stasnakamodov/technomodern-platform.git"
APP_DIR="/root/technomodern-platform"

echo "📡 Connecting to production server..."

REMOTE_SETUP=$(cat <<'ENDSSH'
set -e

echo "📦 Step 1: Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "✅ Node.js version:"
node --version
npm --version

echo "🔧 Step 2: Installing PM2 globally..."
npm install -g pm2

echo "📂 Step 3: Cloning repository..."
cd /root
if [ -d "technomodern-platform" ]; then
    echo "⚠️  Directory exists, removing..."
    rm -rf technomodern-platform
fi

git clone https://github.com/Stasnakamodov/technomodern-platform.git
cd technomodern-platform

echo "🔑 Step 4: Setting up environment variables..."
cat > .env.local <<'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key

# Yandex Vision API
YANDEX_VISION_API_KEY=your_yandex_vision_key
YANDEX_VISION_FOLDER_ID=your_folder_id

# Optional: Pexels API
PEXELS_API_KEY=your_pexels_key
EOF

echo "⚠️  IMPORTANT: Edit .env.local with your actual API keys!"
echo "📝 Run: nano /root/technomodern-platform/.env.local"

echo "📦 Step 5: Installing dependencies..."
npm install --legacy-peer-deps

echo "🏗️  Step 6: Building application..."
npm run build

echo "🚀 Step 7: Starting application with PM2..."
pm2 start npm --name "technomodern" -- start
pm2 save
pm2 startup

echo ""
echo "✅ Initial setup completed!"
echo "⚠️  Don't forget to:"
echo "   1. Edit .env.local with your API keys"
echo "   2. Restart the app: pm2 restart technomodern"
echo ""
echo "📊 Application status:"
pm2 status
ENDSSH
)

sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$REMOTE_SETUP"

echo ""
echo "✅ Initial setup completed!"
echo "🌐 Server: http://$SERVER_IP"
echo ""
echo "⚠️  NEXT STEPS:"
echo "   1. SSH to server: ssh root@$SERVER_IP"
echo "   2. Edit .env.local: nano /root/technomodern-platform/.env.local"
echo "   3. Add your API keys (Supabase, Telegram, etc.)"
echo "   4. Restart app: pm2 restart technomodern"
