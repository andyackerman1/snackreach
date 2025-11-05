# 🚂 Deploy SnackReach to Railway

Railway will give you a public domain automatically! Here's how to set it up:

## Step 1: Connect GitHub to Railway

1. **Go to:** https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access GitHub
5. Select repository: **snackreach**
6. Click **"Deploy Now"**

## Step 2: Configure Backend Service

Railway will detect your backend. Configure it:

1. Railway will create a service automatically
2. Click on the service
3. Go to **"Settings"** tab
4. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install` (or leave default)
   - **Start Command:** `node server.js`
5. Save

## Step 3: Get Your Public Domain

1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Railway will give you a domain like: `snackreach-backend.up.railway.app`
4. **Copy this URL** - this is your backend!

## Step 4: Update Frontend API URL

Once you have your Railway backend URL, I'll update `js/api.js` to point to it!

## Step 5: Deploy Frontend (Optional - Railway can host it too!)

You can either:
- **Option A:** Keep frontend on Netlify (easier)
- **Option B:** Deploy frontend to Railway too (all in one place)

If you want frontend on Railway:
1. Create another service in the same project
2. Set Root Directory: `.` (root)
3. Build Command: (leave empty - static site)
4. Start Command: (leave empty)
5. Generate domain for frontend too

## Quick Commands After Railway Setup

Once Railway gives you the backend URL, I'll update the code:

```bash
# Update API URL in js/api.js
# Push to GitHub
# Railway will auto-deploy!
```

## Your Railway Dashboard

- **Dashboard:** https://railway.app/dashboard
- **Your Project:** Will show after you create it

Let me know when Railway is set up and I'll help connect everything! 🚀




