# Fix Clerk Key in Railway - Exact Steps

Railway shows Clerk is NOT configured. Let's fix it step by step.

---

## The Problem

Railway is returning: `"clerkConfigured": false`

This means the `CLERK_SECRET_KEY` variable is either:
- Not set
- Wrong name
- Wrong value
- Railway hasn't redeployed

---

## Fix It - Step by Step

### Step 1: Go to Railway Variables

1. **Open:** https://railway.app
2. **Your Project → Your Service**
3. **Click "Variables" tab** (at the top)

---

### Step 2: Check if Variable Exists

**Look in the variables list for:**
- `CLERK_SECRET_KEY`

**If you see it:**
- Click on it to edit
- Check the value is exactly: `sk_test_aLyrgzZK7cp8xSAyrhHCzxrPS5dfsYOVWN7Yi64OQe`
- Make sure there are NO spaces before or after
- Click "Save"

**If you DON'T see it:**
- Click "+ New Variable" or "Add Variable"
- Name: `CLERK_SECRET_KEY` (exactly, case-sensitive)
- Value: `sk_test_aLyrgzZK7cp8xSAyrhHCzxrPS5dfsYOVWN7Yi64OQe`
- Click "Add"

---

### Step 3: Verify Variable Name

**Must be EXACTLY:**
```
CLERK_SECRET_KEY
```

**Common mistakes:**
- ❌ `clerk_secret_key` (lowercase)
- ❌ `CLERK_SECRET_KEY ` (space at end)
- ❌ `CLERK_SECRET` (missing _KEY)
- ❌ `CLERK_SECRET_KEY` with extra spaces

**Correct:**
- ✅ `CLERK_SECRET_KEY` (exactly like this)

---

### Step 4: Verify Variable Value

**Must be EXACTLY:**
```
sk_test_aLyrgzZK7cp8xSAyrhHCzxrPS5dfsYOVWN7Yi64OQe
```

**Check:**
- ✅ Starts with `sk_test_`
- ✅ No spaces before or after
- ✅ All characters are there

---

### Step 5: Force Railway to Redeploy

**After adding/editing the variable:**

1. **Go to "Deployments" tab**
2. **Click "..." menu (three dots) on the latest deployment**
3. **Click "Redeploy"** or **"Deploy Latest Commit"**

**OR wait 1-2 minutes** - Railway should auto-redeploy when you add a variable.

---

### Step 6: Check Railway Logs

1. **Railway Dashboard → Your Service → "Logs" tab**
2. **Look for:**
   - ✅ `✅ Clerk initialized successfully` = WORKING!
   - ❌ `⚠️ Clerk not configured` = NOT WORKING

**If you see the error:**
- Variable name is wrong, OR
- Variable value is wrong, OR
- Variable not saved properly

---

## Quick Test

**After redeploy, check:**
```
https://snackreach-production.up.railway.app/api/database-status
```

**Should show:**
```json
{
  "clerkConfigured": true,
  "databaseType": "Clerk"
}
```

---

## Most Common Issues

1. **Variable name has typo** → Check it's exactly `CLERK_SECRET_KEY`
2. **Variable not saved** → Make sure you clicked "Add" or "Save"
3. **Railway didn't redeploy** → Manually trigger redeploy
4. **Extra spaces in value** → Copy-paste the exact value

---

## Copy-Paste This Exactly

**Variable Name:**
```
CLERK_SECRET_KEY
```

**Variable Value:**
```
sk_test_aLyrgzZK7cp8xSAyrhHCzxrPS5dfsYOVWN7Yi64OQe
```

---

**Check Railway Variables tab and make sure it's set exactly right!** 🔧


