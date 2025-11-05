# Quick Plaid Setup for Railway

## Option 1: Automated Setup (Recommended)

Run this command from the project directory:

```bash
cd /Users/andy.ackerman/snackconnect
node setup-plaid-railway.js
```

The script will:
- ✅ Check Railway login (will prompt you to login if needed)
- ✅ Ask for your Plaid credentials
- ✅ Automatically set all environment variables
- ✅ Verify the setup

## Option 2: Manual Setup via Railway Web

If you prefer to use the Railway web interface:

1. **Get Plaid Credentials:**
   - Go to: https://dashboard.plaid.com/developers/keys
   - Copy your **Client ID** and **Secret Key** (use Sandbox for testing)

2. **Add to Railway:**
   - Go to: https://railway.app/
   - Select your project → Your service → **Variables** tab
   - Click **New Variable** and add:
     - `PLAID_CLIENT_ID` = (your client ID)
     - `PLAID_SECRET` = (your secret key)
     - `PLAID_ENV` = `sandbox`

3. **Verify:**
   - Railway will auto-redeploy
   - Check logs for: `✅ Plaid initialized successfully`

## Getting Plaid Credentials

If you don't have Plaid credentials yet:

1. **Sign up for Plaid:**
   - Go to: https://dashboard.plaid.com/signup
   - Create a free account

2. **Get API Keys:**
   - After signing up, go to: https://dashboard.plaid.com/developers/keys
   - You'll see:
     - **Client ID** (copy this)
     - **Sandbox Secret** (click "Show" and copy this)
   
3. **Use these in the setup script or Railway web interface**

## Need Help?

- Check `RAILWAY-PLAID-SETUP.md` for detailed instructions
- Railway logs will show errors if something is wrong
- Make sure you're using Sandbox keys for testing

