# Setting Up Plaid on Railway

This guide will walk you through setting up Plaid bank verification on your Railway deployment.

## 🚀 Quick Setup (Automated)

If you have your Plaid credentials ready, use the automated script:

```bash
cd snackconnect
node setup-plaid-railway.js
```

This script will:
1. Check if you're logged into Railway (login if needed)
2. Prompt for your Plaid credentials
3. Automatically set all environment variables

## Manual Setup

## Step 1: Get Your Plaid API Keys

1. **Sign in to Plaid Dashboard**
   - Go to https://dashboard.plaid.com/
   - Sign in or create a free account

2. **Navigate to API Keys**
   - Once logged in, go to: https://dashboard.plaid.com/developers/keys
   - Or click: **Team Settings** → **Keys** → **API Keys**

3. **Copy Your Credentials**
   - **Client ID**: Copy this value (it's a long string)
   - **Secret Key**: Click "Show" next to the secret and copy it
     - For testing: Use the **Sandbox** secret key
     - For production: Use the **Development** or **Production** secret key

## Step 2: Add Environment Variables to Railway

1. **Open Your Railway Project**
   - Go to https://railway.app/
   - Select your SnackReach project
   - Click on your service (the one running your backend)

2. **Navigate to Variables**
   - Click on the **Variables** tab (or **Settings** → **Variables**)

3. **Add Plaid Variables**
   Click **New Variable** and add each of these:

   ### Required Variables:
   
   **Variable Name:** `PLAID_CLIENT_ID`
   **Value:** Paste your Plaid Client ID
   
   **Variable Name:** `PLAID_SECRET`
   **Value:** Paste your Plaid Secret Key
   
   **Variable Name:** `PLAID_ENV`
   **Value:** 
   - For testing: `sandbox`
   - For production: `development` or `production`

## Step 3: Verify the Setup

1. **Redeploy Your Service**
   - Railway will automatically redeploy when you add environment variables
   - Or manually trigger a redeploy if needed

2. **Check the Logs**
   - Go to your service → **Deployments** → Click on the latest deployment
   - Look for this message in the logs:
     ```
     ✅ Plaid initialized successfully (sandbox environment)
     ```
   - If you see a warning instead, double-check your keys

3. **Test the Integration**
   - Visit your Railway site
   - Go to the dashboard and try connecting a bank account
   - The Plaid Link should open successfully

## Environment Values Quick Reference

### For Testing (Sandbox):
```
PLAID_ENV=sandbox
PLAID_CLIENT_ID=your_client_id_from_plaid_dashboard
PLAID_SECRET=your_sandbox_secret_key
```

### For Production:
```
PLAID_ENV=development
PLAID_CLIENT_ID=your_client_id_from_plaid_dashboard
PLAID_SECRET=your_development_or_production_secret
```

## Troubleshooting

### "Plaid not configured" in logs
- ✅ Check that `PLAID_CLIENT_ID` is set in Railway variables
- ✅ Check that `PLAID_SECRET` is set in Railway variables
- ✅ Verify the keys don't have extra spaces or quotes
- ✅ Make sure you copied the full secret key (they're long!)
- ✅ Redeploy after adding variables

### Plaid Link doesn't open
- Check browser console (F12) for errors
- Verify the `/api/plaid/create-link-token` endpoint is accessible
- Make sure you're using the correct environment (sandbox for testing)

### "Invalid credentials" error
- Double-check your Client ID and Secret are correct
- Make sure you're using the secret key that matches your environment:
  - Sandbox secret for `PLAID_ENV=sandbox`
  - Development secret for `PLAID_ENV=development`
  - Production secret for `PLAID_ENV=production`

## Security Notes

⚠️ **Important:**
- Never share your secret keys publicly
- Use Sandbox keys for testing
- Only use Production keys when you're ready to go live
- Railway securely stores your environment variables - they won't be exposed in logs

## Need Help?

If you're having trouble:
1. Check Railway deployment logs for error messages
2. Verify your Plaid account is active and in good standing
3. Make sure you're using the correct environment (sandbox vs production)
4. Contact Plaid support if you have issues with your API keys

