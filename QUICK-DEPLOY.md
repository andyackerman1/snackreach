# 🚀 Quick Deploy Guide - Make SnackReach Public

Follow these simple steps to make your site live!

## Step 1: Deploy Frontend (5 minutes)

### Option A: Netlify Drag & Drop (Easiest)

1. Go to **[netlify.com](https://netlify.com)** and create a free account
2. Log in to Netlify
3. On the dashboard, find the area that says "Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"
4. Open Finder on your Mac
5. Navigate to `/Users/andy.ackerman/snackconnect`
6. **Select all files EXCEPT the `backend` folder:**
   - index.html
   - signup.html
   - snack-dashboard.html
   - office-dashboard.html
   - owner-login.html
   - owner-signup.html
   - owner-dashboard.html
   - styles.css
   - script.js
   - js/ folder
   - netlify.toml
7. **Drag them onto Netlify**
8. Wait 30 seconds - your site is now live!
9. Netlify will give you a URL like: `amazing-site-123.netlify.app`

### Option B: GitHub + Netlify (Recommended)

1. Create account at **[github.com](https://github.com)**
2. Create a new repository (click "New" → name it "snackreach")
3. Upload your files (except `backend` folder) to the repository
4. Go to Netlify → Add new site → Import from Git
5. Connect GitHub and select your repository
6. Deploy!

## Step 2: Deploy Backend (10 minutes)

1. Go to **[render.com](https://render.com)** and create a free account
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account (or choose "Public Git repository")
4. If using GitHub:
   - Select your repository
   - Root Directory: `backend`
   - Name: `snackreach-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Click **"Create Web Service"**
6. Wait 5-10 minutes for deployment
7. **Copy your backend URL** - it will look like: `snackreach-backend.onrender.com`

## Step 3: Connect Frontend to Backend (2 minutes)

1. Open `js/api.js` in a text editor
2. Find line 10 that says:
   ```javascript
   const PRODUCTION_API_URL = 'https://your-backend-url.onrender.com/api';
   ```
3. Replace `your-backend-url.onrender.com` with your actual Render URL
4. Save the file
5. **Re-deploy to Netlify:**
   - If you used drag & drop: drag the updated `js/api.js` file again
   - If you used GitHub: commit and push the change (Netlify will auto-deploy)

## Step 4: Test It! 🎉

1. Visit your Netlify URL
2. Try signing up
3. Test login
4. Check if everything works!

## That's It!

Your site is now public! You can:
- Share your Netlify URL with anyone
- Add a custom domain later (both services support this)
- Update your site by re-uploading files

## Need Help?

- **Frontend not working?** Check Netlify deployment logs
- **Backend not connecting?** Check Render service logs and verify API URL is correct
- **API errors?** Open browser console (F12) to see errors

## Free Tier Notes

- **Netlify:** Unlimited bandwidth, 100GB per month
- **Render:** Free tier may sleep after 15 min of inactivity (first request will be slow)
- Both provide free SSL certificates (HTTPS)

Good luck! 🚀

