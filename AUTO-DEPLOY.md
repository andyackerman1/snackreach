# 🚀 Auto-Deploy Your Site - I'll Guide You!

Your code is on GitHub! Now let's make it live on the web.

## Step 1: Deploy Frontend (Netlify) - 2 minutes

1. Go to: **https://app.netlify.com**
2. Click **"Sign up"** (or login if you have an account)
3. Click **"Add new site"** → **"Import an existing project"**
4. Click **"Deploy with GitHub"**
5. Authorize Netlify to access GitHub
6. Select repository: **snackreach**
7. Build settings:
   - **Base directory:** (leave empty)
   - **Build command:** (leave empty - no build needed)
   - **Publish directory:** (leave empty)
8. Click **"Deploy site"**
9. Wait 1-2 minutes
10. **Copy your site URL** - it will look like: `snackreach-123.netlify.app`

## Step 2: Deploy Backend (Render) - 5 minutes

1. Go to: **https://dashboard.render.com**
2. Click **"Sign up"** (or login)
3. Click **"New +"** → **"Web Service"**
4. Click **"Connect GitHub"**
5. Authorize Render to access GitHub
6. Select repository: **snackreach**
7. Settings:
   - **Name:** `snackreach-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`
8. Click **"Create Web Service"**
9. Wait 5-10 minutes for deployment
10. **Copy your backend URL** - it will look like: `snackreach-backend.onrender.com`

## Step 3: Connect Frontend to Backend - 1 minute

1. Go back to your Netlify site
2. Click **"Site settings"** → **"Build & deploy"** → **"Environment variables"**
3. Add variable:
   - **Key:** `REACT_APP_API_URL` (or just update the code)
4. Actually, easier: Update `js/api.js` with your Render URL
5. Push to GitHub (I can help with this)

## Quick Links

- **Netlify:** https://app.netlify.com
- **Render:** https://dashboard.render.com
- **Your GitHub Repo:** https://github.com/andyackerman1/snackreach

Let me know when you've deployed and I'll help connect everything!




