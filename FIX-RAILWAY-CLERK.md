# Fix Railway to Use Clerk

Railway is currently using the old database system. Here's how to fix it.

---

## The Problem

Railway doesn't have `CLERK_SECRET_KEY` set, so it's using the old JSON database instead of Clerk.

---

## The Solution

### Step 1: Add Clerk Key to Railway (REQUIRED)

1. Go to **Railway Dashboard**: https://railway.app
2. Select your **project**
3. Select your **service** (the one running your backend)
4. Click **"Variables"** tab (or "Environment" tab)
5. Click **"+ New Variable"** or **"Add Variable"**
6. Add this:
   - **Variable Name:** `CLERK_SECRET_KEY`
   - **Value:** `sk_test_aLyrgzZK7cp8xSAyrhHCzxrPS5dfsYOVWN7Yi64OQe`
7. Click **"Add"** or **"Save"**

✅ **Railway will automatically redeploy** when you add the variable (takes 1-2 minutes)

---

### Step 2: Verify It's Working

After Railway redeploys:

1. **Check Health:**
   ```
   https://snackreach-production.up.railway.app/api/health
   ```
   Should show: `{"status":"ok"}`

2. **Check Database Status:**
   ```
   https://snackreach-production.up.railway.app/api/database-status
   ```
   Should show:
   ```json
   {
     "databaseType": "Clerk",
     "message": "All user data lives in Clerk metadata"
   }
   ```

3. **Test Signup:**
   - Go to: `https://snackreach-production.up.railway.app/signup.html`
   - Create a test account
   - Should work with Clerk!

4. **Verify in Clerk:**
   - Go to: https://dashboard.clerk.com → Users
   - You should see your Railway user!

---

## How to Check Railway Logs

1. Go to Railway Dashboard
2. Select your service
3. Click **"Logs"** tab
4. Look for:
   - ✅ `Clerk initialized successfully` (good!)
   - ❌ `Clerk not configured` (bad - key not set)

---

## Current Status Check

**Before adding the key:**
- Railway uses old JSON database
- `/api/database-status` shows JSON file info
- Users NOT stored in Clerk

**After adding the key:**
- Railway uses Clerk
- `/api/database-status` shows Clerk users
- All users stored in Clerk ✅

---

## Quick Checklist

- [ ] Go to Railway Dashboard
- [ ] Add `CLERK_SECRET_KEY` variable
- [ ] Wait for redeploy (1-2 minutes)
- [ ] Test: `https://snackreach-production.up.railway.app/api/database-status`
- [ ] Should show Clerk, not JSON database
- [ ] Test signup on Railway
- [ ] Verify user in Clerk Dashboard

---

## If It Still Doesn't Work

1. **Check Railway Logs:**
   - Railway Dashboard → Your Service → Logs
   - Look for Clerk errors

2. **Verify Key is Set:**
   - Railway Dashboard → Variables
   - Make sure `CLERK_SECRET_KEY` is there
   - Make sure value starts with `sk_`

3. **Check Railway Service Status:**
   - Make sure service is running (green status)

4. **Test Health Endpoint:**
   - `https://snackreach-production.up.railway.app/api/health`
   - Should return OK

---

**The main fix: Add `CLERK_SECRET_KEY` to Railway variables!** 🚀


