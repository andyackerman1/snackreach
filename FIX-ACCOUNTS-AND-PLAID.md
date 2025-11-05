# Quick Fix: Accounts Not Showing & Plaid Not Working

## Issue 1: Accounts Not Showing

### Step 1: Check Railway Logs
1. Go to Railway: https://railway.com
2. Open your project
3. Click on your backend service
4. Click "Logs" tab
5. Look for messages like:
   - `Get all accounts request - userId: ...`
   - `Total users in database: X`
   - `Returning X accounts`

### Step 2: Check Browser Console
1. Open owner dashboard: https://snackreach-production.up.railway.app/owner-dashboard.html
2. Press F12 to open console
3. Click "All Accounts" tab
4. Look for messages:
   - `API Base URL: ...`
   - `Loading accounts from: ...`
   - `Accounts loaded: X accounts`
   - Any error messages

### Step 3: Verify You're Logged In as Owner
1. Check if you're logged in:
   - Open browser console (F12)
   - Type: `localStorage.getItem('snackreach_token')`
   - Should show a token (long string)
   - Type: `localStorage.getItem('snackreach_user_type')`
   - Should show: `"owner"`

2. If not logged in:
   - Go to: https://snackreach-production.up.railway.app/owner-login.html
   - Log in with your owner credentials

### Step 4: Check if Owner Account Exists
If you can't log in, the owner account might not exist on Railway. Check Railway logs when you try to log in.

## Issue 2: Plaid Not Working

### The Error You're Seeing
```
Plaid not configured. Please set PLAID_CLIENT_ID and PLAID_SECRET environment variables.
```

### Fix: Add Variables to Railway

1. **Go to Railway Dashboard:**
   - Visit: https://railway.com
   - Open your project
   - Click on your backend service

2. **Open Variables:**
   - Click "Variables" tab (or "Settings" → "Variables")

3. **Add These Variables:**

   **Variable 1:**
   ```
   Name: PLAID_CLIENT_ID
   Value: [Your Plaid Client ID from https://dashboard.plaid.com/developers/keys]
   ```

   **Variable 2:**
   ```
   Name: PLAID_SECRET
   Value: [Your Plaid Secret from https://dashboard.plaid.com/developers/keys]
   ```

   **Variable 3:**
   ```
   Name: PLAID_ENV
   Value: sandbox
   ```

4. **Railway will auto-redeploy** after you add variables

5. **Check Logs:**
   - After redeploy, check Railway logs
   - Should see: `✅ Plaid initialized successfully (sandbox environment)`

## Getting Your Plaid Keys

1. Go to: https://dashboard.plaid.com/developers/keys
2. Sign up or log in
3. Copy your **Client ID**
4. Copy your **Secret** (for Sandbox environment)
5. Paste into Railway variables

## Testing

1. **Test Accounts:**
   - Go to owner dashboard
   - Click "All Accounts" tab
   - Should see all registered users
   - Check console for account count

2. **Test Plaid:**
   - Go to owner dashboard
   - Click "Banking Info" tab
   - Click "Connect Bank Account"
   - Should open Plaid Link (not show error)

## Still Not Working?

### Check Railway Logs for:
- "Get all accounts request" - Shows if request is reaching server
- "Total users in database: X" - Shows how many accounts exist
- "Owner authenticated" - Confirms you're logged in as owner
- "Plaid initialized successfully" - Confirms Plaid is configured

### Common Issues:
- **No accounts showing:** Owner account doesn't exist on Railway, or you're not logged in
- **Plaid error:** Environment variables not set in Railway
- **403 error:** Not logged in as owner, or token expired

## Quick Diagnostic Commands

Open browser console (F12) and run:

```javascript
// Check if logged in
console.log('Token:', localStorage.getItem('snackreach_token'));
console.log('User Type:', localStorage.getItem('snackreach_user_type'));

// Check API URL
console.log('API URL:', window.API_BASE_URL);

// Manually try to load accounts
fetch(window.API_BASE_URL + '/admin/all-accounts', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('snackreach_token'),
        'Content-Type': 'application/json'
    }
})
.then(r => r.json())
.then(data => console.log('Accounts:', data))
.catch(err => console.error('Error:', err));
```

