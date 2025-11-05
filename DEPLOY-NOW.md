# 🚀 Deploy SnackReach - 3 Simple Steps

I've prepared everything for you! Follow these 3 steps:

## Step 1: Deploy Frontend (2 minutes)

1. Go to: **https://app.netlify.com/drop**
2. Drag your entire `snackconnect` folder onto the page
   - **Important:** Make sure you're in the `/Users/andy.ackerman/snackconnect` folder
   - Drag the folder from Finder
3. Wait 30 seconds - you'll get a URL like: `amazing-site-123.netlify.app`
4. **Copy that URL** - that's your frontend!

## Step 2: Deploy Backend (5 minutes)

1. Go to: **https://dashboard.render.com** and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** (or skip if you don't have GitHub)
4. If no GitHub:
   - Click **"Public Git repository"**
   - You'll need to create a GitHub repo (see below)
5. Or use **"Manual Deploy"**:
   - Upload your `backend` folder
   - Set Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Click **"Create Web Service"**
6. Wait 5-10 minutes
7. **Copy your backend URL** - it will look like: `snackreach-backend.onrender.com`

## Step 3: Connect Them (1 minute)

1. Open `js/api.js` in a text editor
2. Find line 10 that says: `const PRODUCTION_API_URL = 'https://your-backend-url.onrender.com/api';`
3. Replace `your-backend-url.onrender.com` with your actual Render URL
4. Save the file
5. Re-drag `js/api.js` to Netlify (it will auto-update)

## That's It! 🎉

Your site is now public! Share your Netlify URL with anyone.

## Need GitHub? (Optional but recommended)

If you want to use GitHub for easier updates:

1. Go to **github.com** and create account
2. Create new repository called "snackreach"
3. I can help you push the code (just ask!)

## Quick Links

- **Netlify:** https://app.netlify.com/drop
- **Render:** https://dashboard.render.com
- **GitHub:** https://github.com (optional)

Your files are ready! Just drag and drop! 🚀

