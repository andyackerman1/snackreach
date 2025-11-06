# Connect Railway to Supabase - Complete Setup

Your Railway deployment needs to connect to Supabase. Here's how to set it up.

---

## Step 1: Set Environment Variables on Railway

### Go to Railway Dashboard:

1. **Open Railway:**
   - Go to: https://railway.app
   - Log in to your account

2. **Select Your Project:**
   - Click on your SnackReach project/service

3. **Go to Variables:**
   - Click **"Variables"** tab (or **"Settings"** → **"Variables"**)

4. **Add These Environment Variables:**

Click **"New Variable"** for each:

**Variable 1:**
- **Name:** `SUPABASE_URL`
- **Value:** `https://pplhyetnwyywucdxwkbu.supabase.co`
- Click **"Add"**

**Variable 2:**
- **Name:** `SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwbGh5ZXRud3l5d3VjZHh3a2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzODYzODEsImV4cCI6MjA3Nzk2MjM4MX0.UkypAjm_eXDjiPUH59fh4T5hYgCg3F9H2aFP4aR2-4o`
- Click **"Add"**

**Variable 3 (if not already set):**
- **Name:** `JWT_SECRET`
- **Value:** `snackreach_secret_key_2024` (or your secret)
- Click **"Add"**

---

## Step 2: Verify Supabase Connection Code

The code is already set up! Your `backend/supabase.js` will use these environment variables automatically.

**Railway will:**
- Read `SUPABASE_URL` from environment variables
- Read `SUPABASE_ANON_KEY` from environment variables
- Connect to Supabase automatically

---

## Step 3: Deploy/Redeploy on Railway

After adding environment variables:

1. **Railway will auto-deploy** (if connected to GitHub)
   - OR click **"Deploy"** or **"Redeploy"** button

2. **Wait for deployment to complete**
   - Check **"Deployments"** tab
   - Wait for green checkmark ✅

3. **Check logs:**
   - Click **"Logs"** tab
   - You should see:
     ```
     ✅ Supabase connected successfully
     ✅ Supabase database ready
     Server running on port...
     ```

---

## Step 4: Test Railway Connection to Supabase

### Get Your Railway URL:

1. **In Railway Dashboard:**
   - Go to **"Settings"** → **"Domains"**
   - Copy your Railway URL (e.g., `your-app.up.railway.app`)

### Test Registration:

Use your Railway URL instead of localhost:

```bash
curl -X POST https://YOUR-RAILWAY-URL.railway.app/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "companyName": "Test Company",
    "userType": "startup"
  }'
```

**Replace `YOUR-RAILWAY-URL` with your actual Railway domain.**

---

## Step 5: Verify Account in Supabase

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu

2. **Click "Table Editor"** → **"users"**

3. **You should see the account created from Railway!** ✅

---

## Step 6: Disable RLS in Supabase (If Not Done)

In Supabase SQL Editor, run:

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

**This must be done for accounts to save from Railway!**

---

## Quick Checklist

- [ ] Added `SUPABASE_URL` to Railway Variables
- [ ] Added `SUPABASE_ANON_KEY` to Railway Variables
- [ ] Added `JWT_SECRET` to Railway Variables (if needed)
- [ ] Redeployed Railway service
- [ ] Disabled RLS in Supabase SQL Editor
- [ ] Tested registration via Railway URL
- [ ] Verified account in Supabase Dashboard

---

## How It Works

**Railway Deployment:**
1. Reads `SUPABASE_URL` and `SUPABASE_ANON_KEY` from environment variables
2. Connects to Supabase when server starts
3. All `/api/register` requests save to Supabase
4. All `/api/login` requests read from Supabase

**No localhost needed!** Everything works on Railway.

---

## Troubleshooting

### "Cannot connect to Supabase" on Railway
- **Fix:** Check environment variables are set correctly
- **Fix:** Verify variable names are exactly: `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- **Fix:** Check Railway logs for connection errors

### "RLS policy violation" error
- **Fix:** Run `ALTER TABLE users DISABLE ROW LEVEL SECURITY;` in Supabase SQL Editor
- **Fix:** Make sure you ran it in the correct Supabase project

### Accounts not appearing in Supabase
- **Fix:** Check Railway logs - are there errors?
- **Fix:** Verify RLS is disabled
- **Fix:** Check Railway deployment is successful
- **Fix:** Test with Railway URL, not localhost

### "Environment variable not found"
- **Fix:** Make sure variables are added in Railway
- **Fix:** Redeploy Railway service after adding variables
- **Fix:** Check variable names match exactly (case-sensitive)

---

## Summary

**What to do:**
1. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Railway Variables
2. Disable RLS in Supabase SQL Editor
3. Redeploy Railway
4. Test with Railway URL (not localhost)

**Then:** All accounts created on Railway will save to Supabase! 🚀

---

## Your Railway URL

**Find it:**
- Railway Dashboard → Your Service → Settings → Domains

**Use it for:**
- Testing registration: `https://YOUR-URL.railway.app/api/register`
- Testing login: `https://YOUR-URL.railway.app/api/login`
- Checking status: `https://YOUR-URL.railway.app/api/database-status`

**Everything should use Railway URL, not localhost!**



