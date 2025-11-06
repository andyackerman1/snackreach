# Verify Clerk Key in Railway - Step by Step

The error says Clerk isn't configured. Let's verify the key is set correctly.

---

## Step 1: Check Railway Variables

1. **Go to Railway Dashboard:** https://railway.app
2. **Your Project → Your Service → "Variables" tab**
3. **Look for `CLERK_SECRET_KEY` in the list**

**What to check:**
- ✅ Is it there?
- ✅ Is the name exactly: `CLERK_SECRET_KEY` (case-sensitive, no spaces)
- ✅ Does the value start with: `sk_test_` or `sk_live_`?

---

## Step 2: Common Issues

### Issue 1: Variable Name Wrong
**Wrong:**
- `clerk_secret_key` (lowercase)
- `CLERK_SECRET_KEY ` (extra space)
- `CLERK_SECRET` (missing _KEY)

**Correct:**
- `CLERK_SECRET_KEY` (exactly like this)

### Issue 2: Value Wrong
**Wrong:**
- Missing `sk_test_` at the start
- Extra spaces before/after
- Missing characters

**Correct:**
- `sk_test_aLyrgzZK7cp8xSAyrhHCzxrPS5dfsYOVWN7Yi64OQe`

### Issue 3: Variable Not Saved
- Make sure you clicked "Add" or "Save"
- Check it appears in the variables list

---

## Step 3: Redeploy After Adding Variable

**Important:** After adding/changing a variable, Railway needs to redeploy!

1. **Railway Dashboard → Your Service → "Deployments" tab**
2. **Click "..." menu (three dots) on latest deployment**
3. **Click "Redeploy"**

OR Railway should auto-redeploy when you add a variable (wait 1-2 minutes).

---

## Step 4: Verify It's Working

**After redeploy, test:**
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

## Step 5: Check Railway Logs

1. **Railway Dashboard → Your Service → "Logs" tab**
2. **Look for:**
   - ✅ `✅ Clerk initialized successfully` (GOOD!)
   - ❌ `⚠️ Clerk not configured` (BAD - key missing/wrong)

---

## Quick Checklist

- [ ] Variable name is exactly: `CLERK_SECRET_KEY`
- [ ] Value is: `sk_test_aLyrgzZK7cp8xSAyrhHCzxrPS5dfsYOVWN7Yi64OQe`
- [ ] Variable is saved (appears in list)
- [ ] Railway redeployed after adding variable
- [ ] Logs show "Clerk initialized successfully"

---

## If Still Not Working

**Check Railway Logs:**
- Copy any error messages
- Look for "Clerk" in the logs
- Check if variable is being read

**Double-check variable:**
- Go to Variables tab
- Click on `CLERK_SECRET_KEY` to edit
- Make sure value is correct (no extra spaces)
- Save again

---

**The variable must be named exactly `CLERK_SECRET_KEY` and Railway must redeploy!** 🔧


