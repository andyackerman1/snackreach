#!/bin/bash

# Railway Plaid Setup Script
# This script helps you set Plaid environment variables on Railway

echo "🚂 Railway Plaid Setup Helper"
echo "=============================="
echo ""
echo "This script will help you set Plaid environment variables on Railway."
echo ""
echo "Requirements:"
echo "1. You need your Plaid API credentials"
echo "   - Get them from: https://dashboard.plaid.com/developers/keys"
echo "2. You need to be logged into Railway CLI"
echo ""
echo ""

# Check if Railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "⚠️  Railway CLI not found."
    echo ""
    echo "Installing Railway CLI locally..."
    npm install -g @railway/cli 2>/dev/null || {
        echo ""
        echo "❌ Could not install Railway CLI automatically."
        echo ""
        echo "Please install it manually:"
        echo "  npm install -g @railway/cli"
        echo ""
        echo "Or use the Railway web interface:"
        echo "  1. Go to https://railway.app/"
        echo "  2. Select your project"
        echo "  3. Go to Variables tab"
        echo "  4. Add these variables:"
        echo "     - PLAID_CLIENT_ID"
        echo "     - PLAID_SECRET"
        echo "     - PLAID_ENV=sandbox"
        exit 1
    }
fi

echo "✅ Railway CLI found"
echo ""

# Check if logged in
echo "Checking Railway login status..."
railway whoami &> /dev/null || {
    echo "⚠️  Not logged into Railway. Logging in..."
    railway login
}

echo "✅ Logged into Railway"
echo ""

# Prompt for Plaid credentials
echo "Enter your Plaid credentials:"
echo ""
read -p "PLAID_CLIENT_ID: " PLAID_CLIENT_ID
read -p "PLAID_SECRET: " PLAID_SECRET
read -p "PLAID_ENV (sandbox/development/production) [sandbox]: " PLAID_ENV
PLAID_ENV=${PLAID_ENV:-sandbox}

echo ""
echo "Setting environment variables on Railway..."
echo ""

# Set variables
railway variables set PLAID_CLIENT_ID="$PLAID_CLIENT_ID" || {
    echo "❌ Failed to set PLAID_CLIENT_ID"
    exit 1
}

railway variables set PLAID_SECRET="$PLAID_SECRET" || {
    echo "❌ Failed to set PLAID_SECRET"
    exit 1
}

railway variables set PLAID_ENV="$PLAID_ENV" || {
    echo "❌ Failed to set PLAID_ENV"
    exit 1
}

echo ""
echo "✅ Successfully set Plaid environment variables!"
echo ""
echo "Your Railway service will automatically redeploy."
echo "Check the logs to verify: '✅ Plaid initialized successfully'"
echo ""

