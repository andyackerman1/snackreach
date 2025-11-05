# SnackReach Deployment Guide

This guide will help you deploy SnackReach to make it publicly accessible on the internet.

## Deployment Options

### Option 1: Quick Deploy (Recommended for Beginners)

#### Frontend (Website Pages) - Netlify (FREE)

1. **Go to [netlify.com](https://netlify.com)** and sign up for a free account
2. **Drag and drop method:**
   - Go to your SnackReach folder in Finder
   - Drag the entire folder (except the `backend` folder) onto Netlify's dashboard
   - Your site will be live in seconds!

3. **Git method (recommended):**
   - Create a GitHub account at github.com (if you don't have one)
   - Create a new repository
   - Upload your files (except `backend` folder)
   - Connect the repository to Netlify
   - Netlify will auto-deploy on every update

Your site will get a free URL like: `your-site-name.netlify.app`

#### Backend (API) - Render (FREE)

1. **Go to [render.com](https://render.com)** and sign up
2. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (or upload manually)
   - Select the `backend` folder
   - Build command: `cd backend && npm install`
   - Start command: `cd backend && node server.js`
   - Environment: Node
   - Click "Create Web Service"

3. **Get your backend URL:**
   - Render will give you a URL like: `your-backend.onrender.com`
   - Copy this URL

4. **Update frontend API URLs:**
   - In your Netlify site, update all API calls from `http://localhost:3000/api` to `https://your-backend.onrender.com/api`
   - Update these files:
     - `signup.html`
     - `snack-dashboard.html`
     - `office-dashboard.html`
     - `owner-dashboard.html`
     - `owner-login.html`
     - `owner-signup.html`
     - `js/api.js`

### Option 2: GitHub Pages (FREE - Frontend Only)

1. Create a GitHub repository
2. Upload your frontend files
3. Go to Settings → Pages
4. Select main branch
5. Your site will be at: `yourusername.github.io/repository-name`

**Note:** GitHub Pages only hosts static files, so your backend will need to be hosted separately.

### Option 3: Vercel (FREE - Frontend)

1. Go to [vercel.com](https://vercel.com)
2. Import your project
3. Deploy automatically

## Updating API URLs

After deploying the backend, you need to update all API URLs in your frontend files:

1. Find all instances of: `http://localhost:3000/api`
2. Replace with: `https://your-backend-url.onrender.com/api`

### Files to Update:
- `signup.html` - Line ~277
- `snack-dashboard.html` - Multiple locations
- `office-dashboard.html` - Multiple locations
- `owner-dashboard.html` - Line ~316
- `owner-login.html` - Check for API calls
- `owner-signup.html` - Check for API calls
- `js/api.js` - Update API_BASE_URL

## Quick Deployment Steps

### Step 1: Deploy Frontend (5 minutes)

1. Go to [netlify.com](https://netlify.com)
2. Sign up/login
3. Drag your `snackconnect` folder (without backend) onto Netlify
4. Wait for deployment
5. Get your site URL

### Step 2: Deploy Backend (10 minutes)

1. Go to [render.com](https://render.com)
2. Sign up/login
3. New → Web Service
4. Connect GitHub or upload backend folder
5. Settings:
   - Build: `npm install`
   - Start: `node server.js`
   - Environment: Node
6. Get your backend URL

### Step 3: Update Frontend URLs (5 minutes)

1. In your local files, find/replace: `http://localhost:3000/api`
2. Replace with: `https://your-backend.onrender.com/api`
3. Re-deploy frontend to Netlify

### Step 4: Test Everything

1. Visit your Netlify site
2. Try signing up
3. Test login
4. Check if backend API works

## Important Notes

- **Free tiers have limits:** Render free tier may sleep after inactivity, causing a delay on first request
- **HTTPS is automatic:** Both Netlify and Render provide free SSL certificates
- **Domain names:** You can add a custom domain later (both services support this)
- **Database:** The current setup uses a JSON file. For production, consider using a proper database (MongoDB, PostgreSQL, etc.)

## Troubleshooting

### Backend not responding?
- Check Render dashboard for logs
- Verify the backend URL is correct
- Make sure CORS is enabled in `server.js`

### Frontend can't connect to backend?
- Check API URLs are updated
- Verify backend is running (check Render dashboard)
- Check browser console for errors

### Site not loading?
- Check Netlify deployment logs
- Verify all files uploaded correctly
- Check file paths are correct

## Need Help?

If you run into issues, check:
1. Browser console (F12) for errors
2. Netlify deployment logs
3. Render service logs
4. Network tab to see API calls

Good luck with your deployment! 🚀

