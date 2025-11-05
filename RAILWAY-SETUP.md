# Railway Setup Guide - Fix Missing Accounts and Plaid

## Problem 1: Accounts Not Showing

### Why This Happens
- Accounts are created on Railway's production database
- Owner dashboard needs to authenticate and fetch from the same database
- Authentication token might be invalid or expired

### Solution

1. **Make sure you're logged in as owner on production:**
   - Go to: `https://snackreach-production.up.railway.app/owner-login.html`
   - Log in with your owner credentials
   - You should see a success message

2. **Check the browser console (F12):**
   - Look for: `API Base URL: https://snackreach-production.up.railway.app/api`
   - Look for: `Accounts loaded: X accounts`
   - If you see errors, note what they say

3. **Verify owner account exists:**
   - The owner account must be created in the Railway database
   - Check if you can log in - if not, the owner account might not exist on production

## Problem 2: Plaid Not Working

### The Error
```
Plaid not configured. Please set PLAID_CLIENT_ID and PLAID_SECRET environment variables.
```

### Solution: Add Environment Variables to Railway

1. **Go to Railway Dashboard:**
   - Visit: https://railway.com/project/YOUR_PROJECT_ID
   - Click on your service (the one running the backend)

2. **Open Variables Tab:**
   - Click on "Variables" tab
   - Or click "Settings" → "Variables"

3. **Add Plaid Variables:**
   Click "New Variable" and add these one by one:

   **Variable 1:**
   - Name: `PLAID_CLIENT_ID`
   - Value: `your_plaid_client_id_here` (get from https://dashboard.plaid.com/developers/keys)

   **Variable 2:**
   - Name: `PLAID_SECRET`
   - Value: `your_plaid_secret_here` (get from https://dashboard.plaid.com/developers/keys)

   **Variable 3:**
   - Name: `PLAID_ENV`
   - Value: `sandbox` (for testing) or `production` (for live)

4. **Add Stripe Variables (if not already set):**
   
   **Variable 4:**
   - Name: `STRIPE_SECRET_KEY`
   - Value: `sk_test_your_key_here` (get from https://dashboard.stripe.com/apikeys)

   **Variable 5:**
   - Name: `STRIPE_PUBLISHABLE_KEY`
   - Value: `pk_test_your_key_here` (get from https://dashboard.stripe.com/apikeys)

5. **Redeploy:**
   - After adding variables, Railway will automatically redeploy
   - Or click "Deploy" → "Redeploy" to force a restart

6. **Verify:**
   - Check Railway logs - you should see:
     - `✅ Plaid initialized successfully (sandbox environment)`
     - `✅ Stripe initialized successfully`
   - No more warnings about missing configuration

## Getting Your API Keys

### Plaid Keys (Bank Verification)
1. Go to: https://dashboard.plaid.com/developers/keys
2. Sign up or log in
3. Copy your **Client ID** and **Secret** (Sandbox keys for testing)
4. Paste into Railway variables

### Stripe Keys (Payments)
1. Go to: https://dashboard.stripe.com/apikeys
2. Sign up or log in
3. Copy your **Secret Key** (starts with `sk_test_`)
4. Copy your **Publishable Key** (starts with `pk_test_`)
5. Paste into Railway variables

## Testing After Setup

1. **Test Plaid:**
   - Go to owner dashboard
   - Click "Banking Info" tab
   - Click "Connect Bank Account"
   - Should open Plaid Link (not show error)

2. **Test Accounts:**
   - Go to owner dashboard
   - Click "All Accounts" tab
   - Should see all registered users
   - Check browser console (F12) for any errors

## Troubleshooting

### Still Not Working?

1. **Check Railway Logs:**
   - Go to Railway → Your Service → Logs
   - Look for error messages
   - Check if Plaid/Stripe initialized successfully

2. **Verify Variables:**
   - Make sure variable names are EXACTLY: `PLAID_CLIENT_ID`, `PLAID_SECRET`, etc.
   - No extra spaces or typos
   - Values should be your actual keys (not placeholder text)

3. **Check Authentication:**
   - Make sure you're logged in as owner
   - Token should be in localStorage (check browser console)
   - If token is missing, log in again

4. **Database Issues:**
   - Accounts are stored in Railway's database
   - If accounts aren't showing, check:
     - Are you logged in as owner?
     - Is the API endpoint correct?
     - Check browser console for errors

## Quick Checklist

- [ ] Plaid keys added to Railway variables
- [ ] Stripe keys added to Railway variables
- [ ] Railway service redeployed after adding variables
- [ ] Logged in as owner on production site
- [ ] Browser console shows no errors
- [ ] Railway logs show "✅ Plaid initialized successfully"
- [ ] Railway logs show "✅ Stripe initialized successfully"

