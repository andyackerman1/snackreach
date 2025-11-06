# Railway Deployment Guide

This guide shows you how to ensure your backend is running on Railway (not localhost).

## Current Status

✅ **Code is pushed to Git** - Railway will auto-deploy from your GitHub repository
✅ **Backend is configured** - Server.js is ready for Railway deployment
✅ **Database persists** - Accounts stored in `backend/data/database.json` on Railway

## Railway Setup Steps

### Step 1: Verify Railway Project

1. **Go to Railway Dashboard:**
   - https://railway.app/
   - Sign in to your account
   - Select your SnackReach project

2. **Check Your Service:**
   - You should see a service running your backend
   - Check deployment status (should be "Active")

### Step 2: Verify Environment Variables

**In Railway Dashboard → Your Service → Variables, make sure you have:**

```
JWT_SECRET=your-secret-key-here
NODE_ENV=production
PORT=3000
```

**Optional but recommended:**
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@snackreach.com
BASE_URL=https://your-railway-domain.up.railway.app
```

### Step 3: Check Railway URL

1. **Get Your Railway Domain:**
   - Railway Dashboard → Your Service → Settings
   - Look for "Public Domain" or "Custom Domain"
   - Your backend URL will be: `https://your-domain.up.railway.app`

2. **Test Your Backend:**
   - Visit: `https://your-domain.up.railway.app/api/health`
   - Should return: `{"status":"ok","message":"SnackReach API is running"}`

### Step 4: Verify Deployment

**Check Railway Logs:**
1. Railway Dashboard → Your Service → Deployments
2. Click on latest deployment
3. Check logs for:
   - ✅ `Server running on port 3000`
   - ✅ `Database created for permanent storage`
   - ✅ `Email service configured` (if email vars set)

### Step 5: Update Frontend (if needed)

**Your frontend files automatically detect Railway:**
- They check `window.location.hostname`
- If it contains `railway.app`, uses `/api` (relative path)
- Otherwise uses full Railway URL

**If frontend is on Railway too:**
- No changes needed - it will auto-detect

**If frontend is local/served separately:**
- Update API URLs in your HTML files to use your Railway domain
- Or use the auto-detection code (already included)

## Testing Railway Backend

### Test Account Creation:
1. Go to: `https://your-railway-domain.up.railway.app/signup.html`
2. Create a test account
3. Check Railway logs for: `✅ User account permanently saved`

### Test Admin Dashboard:
1. Go to: `https://your-railway-domain.up.railway.app/admin-dashboard.html`
2. Login with: `snackreach1@gmail.com` / `Greylock21`
3. Should see all accounts created on Railway

### Test API Directly:
```bash
curl https://your-railway-domain.up.railway.app/api/health
```

## Database on Railway

**Accounts are stored in:**
- `backend/data/database.json` on Railway's persistent storage
- This file persists across deployments
- All accounts are permanently saved

**To view accounts on Railway:**
- Use the admin dashboard (web interface)
- Or check Railway logs for account counts

## Troubleshooting

### Backend Not Running on Railway

1. **Check Deployment Status:**
   - Railway Dashboard → Deployments
   - Look for failed deployments
   - Check error messages

2. **Check Logs:**
   - Railway Dashboard → Your Service → Logs
   - Look for errors or warnings

3. **Common Issues:**
   - Missing `NODE_ENV=production`
   - Port conflicts (Railway sets PORT automatically)
   - Missing dependencies (check `package.json`)

### Accounts Not Showing

1. **Check Database:**
   - Railway logs should show: `✅ Total users permanently saved: X`
   - Verify accounts were created on Railway (not local)

2. **Check Admin Login:**
   - Make sure you're logged in as admin
   - Check browser console for errors

3. **Check API Connection:**
   - Browser console → Network tab
   - Check if `/api/admin/all-accounts` returns 200

### Railway URL Not Working

1. **Check Service Status:**
   - Railway Dashboard → Service should be "Active"

2. **Check Public Domain:**
   - Settings → Public Domain should be enabled
   - Copy the exact URL

3. **Test Health Endpoint:**
   - `https://your-domain.up.railway.app/api/health`
   - Should return JSON response

## Quick Check Commands

**Check if code is pushed:**
```bash
cd /Users/andy.ackerman/snackconnect
git status
git log --oneline -1
```

**Check Railway deployment:**
- Go to Railway Dashboard
- Check latest deployment timestamp
- Should match your last git push

## Important Notes

✅ **Railway auto-deploys** from your GitHub repository
✅ **Database persists** on Railway's file system
✅ **Accounts are permanent** - never deleted automatically
✅ **Local and Railway** use separate databases
✅ **Frontend auto-detects** Railway vs local environment

## Next Steps

1. ✅ Verify code is pushed to GitHub
2. ✅ Check Railway dashboard for active deployment
3. ✅ Test your Railway backend URL
4. ✅ Create test account on Railway
5. ✅ Verify in admin dashboard

Your backend should be running on Railway automatically after you push to GitHub!

