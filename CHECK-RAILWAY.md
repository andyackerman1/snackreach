# Quick Check: Is Your Backend Running on Railway?

## Step 1: Find Your Railway URL

1. Go to: https://railway.app/
2. Sign in to your account
3. Select your **SnackReach** project
4. Click on your **service** (the one running the backend)
5. Go to **Settings** tab
6. Look for **Public Domain** or **Custom Domain**
7. Copy the URL (e.g., `snackreach-production.up.railway.app`)

## Step 2: Test Your Railway Backend

**Open in browser or use curl:**
```
https://your-railway-domain.up.railway.app/api/health
```

**Should return:**
```json
{"status":"ok","message":"SnackReach API is running"}
```

## Step 3: Check Railway Deployment

1. **Railway Dashboard** → Your Service → **Deployments**
2. **Latest deployment** should show:
   - Status: ✅ **Active** or **Deployed**
   - Timestamp: Recent (should match your last git push)
   - Logs should show: `🚀 SnackReach API server running`

## Step 4: Verify Accounts on Railway

1. **Sign up on Railway:**
   - Go to: `https://your-railway-domain.up.railway.app/signup.html`
   - Create a test account

2. **Check admin dashboard on Railway:**
   - Go to: `https://your-railway-domain.up.railway.app/admin-dashboard.html`
   - Login: `snackreach1@gmail.com` / `Greylock21`
   - Should see your account

## Important Notes

⚠️ **Local and Railway use SEPARATE databases:**
- Local accounts: `~/snackconnect/backend/data/database.json`
- Railway accounts: Stored on Railway's server
- They don't share data!

✅ **Railway auto-deploys:**
- Every time you push to GitHub, Railway deploys automatically
- Check Railway dashboard for deployment status

✅ **Your code is already pushed:**
- All latest changes are in GitHub
- Railway should have them deployed

## If Railway Isn't Working

1. **Check Railway Dashboard:**
   - Is the service running?
   - Are there any errors in logs?
   - Is deployment active?

2. **Check Environment Variables:**
   - Railway → Service → Variables
   - Should have: `JWT_SECRET`, `NODE_ENV`, `PORT`

3. **Check Railway Logs:**
   - Railway → Service → Logs
   - Look for errors or startup messages

## Your Railway Backend URL

Once you find your Railway domain, your backend will be at:
- **API:** `https://your-domain.up.railway.app/api`
- **Signup:** `https://your-domain.up.railway.app/signup.html`
- **Admin:** `https://your-domain.up.railway.app/admin-dashboard.html`

All accounts created on Railway will be stored permanently on Railway's server!

