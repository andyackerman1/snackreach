# Fix Railway to Store Users in Clerk

## Current Problem

Railway is using the **old JSON database** instead of Clerk. This is because `CLERK_SECRET_KEY` is not set in Railway.

**Check:** https://snackreach-production.up.railway.app/api/database-status
- Currently shows: `"databaseType": "database.json"` ❌
- Should show: `"databaseType": "Clerk"` ✅

---

## The Fix (2 Steps)

### Step 1: Add Clerk Key to Railway

1. **Go to Railway Dashboard:** https://railway.app
2. **Select your project**
3. **Select your service** (backend service)
4. **Click "Variables" tab**
5. **Click "+ New Variable"**
6. **Add:**
   - **Name:** `CLERK_SECRET_KEY`
   - **Value:** `sk_test_aLyrgzZK7cp8xSAyrhHCzxrPS5dfsYOVWN7Yi64OQe`
7. **Click "Add"**

✅ Railway will automatically redeploy (takes 1-2 minutes)

---

### Step 2: Verify It's Fixed

After Railway redeploys, check:

**Test 1: Database Status**
```
https://snackreach-production.up.railway.app/api/database-status
```

**Should now show:**
```json
{
  "databaseType": "Clerk",
  "message": "✅ All user data lives in Clerk metadata",
  "clerkConfigured": true
}
```

**Test 2: Create Test User**
1. Go to: `https://snackreach-production.up.railway.app/signup.html`
2. Create a test account
3. Should work with Clerk!

**Test 3: Verify in Clerk**
1. Go to: https://dashboard.clerk.com → Users
2. You should see your Railway user!

---

## How to Check Railway Logs

1. Railway Dashboard → Your Service → **"Logs"** tab
2. Look for:
   - ✅ `✅ Clerk initialized successfully` (GOOD!)
   - ❌ `⚠️ Clerk not configured` (BAD - key not set)

---

## Before vs After

**BEFORE (Current):**
- ❌ Uses JSON database file
- ❌ Users stored in `/app/backend/data/database.json`
- ❌ Not using Clerk

**AFTER (Fixed):**
- ✅ Uses Clerk
- ✅ Users stored in Clerk metadata
- ✅ All data in Clerk Dashboard

---

## Quick Checklist

- [ ] Go to Railway Dashboard
- [ ] Add `CLERK_SECRET_KEY` variable
- [ ] Wait for redeploy (1-2 minutes)
- [ ] Check: `/api/database-status` should show "Clerk"
- [ ] Test signup on Railway
- [ ] Verify user in Clerk Dashboard

---

## That's It!

Once you add `CLERK_SECRET_KEY` to Railway, everything will work! 🚀


