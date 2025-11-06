# Railway + Clerk Setup Guide

Your code is already set up to work on Railway! Here's what you need to do.

---

## ✅ What's Already Configured

1. **Frontend** - Automatically detects Railway URLs
2. **Backend** - Uses Railway's PORT environment variable
3. **API URLs** - Frontend automatically uses correct URLs on Railway

---

## 🔧 What You Need to Do for Railway

### Step 1: Add Clerk Secret Key to Railway

1. Go to **Railway Dashboard** (https://railway.app)
2. Select your project
3. Select your service (backend)
4. Click **"Variables"** tab
5. Click **"+ New Variable"**
6. Add:
   - **Variable Name:** `CLERK_SECRET_KEY`
   - **Value:** `sk_test_aLyrgzZK7cp8xSAyrhHCzxrPS5dfsYOVWN7Yi64OQe`
7. Click **"Add"**

Railway will automatically redeploy your service.

---

### Step 2: Verify Railway URL

1. In Railway Dashboard, go to your service
2. Click **"Settings"** tab
3. Find your **Public Domain** (looks like: `your-app-name.railway.app`)
4. Copy this URL - you'll need it for Clerk webhook

---

### Step 3: Configure Clerk Webhook (Optional but Recommended)

1. Go to **Clerk Dashboard** → **Webhooks**
2. Click **"+ Add Endpoint"**
3. Enter your Railway webhook URL:
   ```
   https://your-railway-url.railway.app/api/clerk-webhook
   ```
   (Replace `your-railway-url` with your actual Railway domain)
4. Select events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
5. Click **"Create"**

---

## ✅ That's It!

Once you add `CLERK_SECRET_KEY` to Railway:
- ✅ Your backend will use Clerk
- ✅ Users can sign up on Railway
- ✅ All data stored in Clerk
- ✅ Everything works automatically

---

## Test on Railway

After deploying:

1. Go to your Railway URL: `https://your-app.railway.app`
2. Go to signup page: `https://your-app.railway.app/signup.html`
3. Create a test account
4. Check Clerk Dashboard → Users
5. You should see your user!

---

## Current Status

**Frontend:** ✅ Ready for Railway (auto-detects Railway URLs)  
**Backend:** ✅ Ready for Railway (uses PORT from Railway)  
**Clerk:** ⚠️ Need to add `CLERK_SECRET_KEY` to Railway variables

---

## Quick Checklist

- [ ] Add `CLERK_SECRET_KEY` to Railway environment variables
- [ ] Deploy to Railway (happens automatically when you add variables)
- [ ] Test signup on Railway URL
- [ ] Verify user appears in Clerk Dashboard
- [ ] (Optional) Configure Clerk webhook for Railway URL

---

## Need Help?

If something doesn't work on Railway:
1. Check Railway logs for errors
2. Verify `CLERK_SECRET_KEY` is set in Railway
3. Check that your Railway service is running
4. Test the health endpoint: `https://your-app.railway.app/api/health`


