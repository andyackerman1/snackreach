# Test Railway with Clerk - Quick Guide

Here's how to test if Railway is now using Clerk.

---

## Test 1: Check Database Status (Easiest)

**Open in your browser:**
```
https://snackreach-production.up.railway.app/api/database-status
```

### ✅ If Working (Clerk):
You should see:
```json
{
  "databaseType": "Clerk",
  "clerkConfigured": true,
  "message": "✅ All user data lives in Clerk metadata",
  "totalAccounts": 0
}
```

### ❌ If Not Working (Old System):
You'll see:
```json
{
  "databaseType": "Clerk (NOT CONFIGURED)",
  "clerkConfigured": false,
  "message": "⚠️ Clerk is not configured..."
}
```

---

## Test 2: Create a Test User

1. **Go to signup page:**
   ```
   https://snackreach-production.up.railway.app/signup.html
   ```

2. **Fill out the form:**
   - Choose "Food Startup" or "Office Manager"
   - Name: "Railway Test User"
   - Email: "railwaytest@example.com" (use a unique email)
   - Password: "test123456"
   - Company: "Test Company"
   - Accept terms

3. **Click "Create Account"**

### ✅ If Working:
- Account created successfully
- You're redirected to dashboard
- No errors

### ❌ If Not Working:
- Error message appears
- Might say "Clerk is required but not configured"
- Account not created

---

## Test 3: Verify in Clerk Dashboard

1. **Go to:** https://dashboard.clerk.com
2. **Click "Users"** in left sidebar
3. **Look for your test user:**
   - Email: `railwaytest@example.com`
   - Should have metadata: `userType`, `companyName`

### ✅ If Working:
- User appears in Clerk Dashboard
- Has all the metadata you entered

### ❌ If Not Working:
- User doesn't appear in Clerk
- Or user appears but without metadata

---

## Test 4: Check Railway Logs

1. **Go to Railway Dashboard**
2. **Select your service**
3. **Click "Logs" tab**
4. **Look for these messages:**

### ✅ If Working:
```
✅ Clerk initialized successfully
📝 Creating user in Clerk: railwaytest@example.com
✅ User created in Clerk: user_2abc123...
✅ All user data stored in Clerk metadata
```

### ❌ If Not Working:
```
⚠️ Clerk not configured. Set CLERK_SECRET_KEY in .env
```

---

## Quick Test Checklist

- [ ] `/api/database-status` shows `"databaseType": "Clerk"`
- [ ] Can create account on Railway signup page
- [ ] User appears in Clerk Dashboard
- [ ] Railway logs show "Clerk initialized successfully"
- [ ] No error messages when signing up

---

## All Tests Pass? ✅

If all tests pass, Railway is using Clerk! 🎉

---

## Tests Fail? ❌

If tests fail:
1. Check Railway Variables - is `CLERK_SECRET_KEY` set?
2. Check Railway Logs - any Clerk errors?
3. Wait a bit - Railway might still be redeploying

---

## Quick Test URLs

**Database Status:**
```
https://snackreach-production.up.railway.app/api/database-status
```

**Health Check:**
```
https://snackreach-production.up.railway.app/api/health
```

**Signup:**
```
https://snackreach-production.up.railway.app/signup.html
```

**Login:**
```
https://snackreach-production.up.railway.app/login.html
```

---

**Start with Test 1 - it's the quickest way to check!** 🚀


