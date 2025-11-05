#!/bin/bash

echo "🚀 Starting SnackReach Server..."
echo ""

# Change to backend directory
cd "$(dirname "$0")/backend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating one..."
    echo "PORT=3000" > .env
    echo "JWT_SECRET=snackreach_secret_key_2024" >> .env
    echo "✅ Created .env file with default values"
    echo ""
fi

echo "🔧 Starting server on port 3000..."
echo "🌐 Server will be available at: http://localhost:3000"
echo "📡 API will be available at: http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
node server.js

