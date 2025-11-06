# Railway Production - Quick Start Guide

## Your Railway Production Domain

### Database Location on Railway

**Production Path:** `/app/backend/data/database.json`

**⚠️ CRITICAL:** Railway's filesystem is **ephemeral** - files are deleted when service restarts!

## The Problem: Accounts Disappear on Railway

### Without Persistent Volume:
```
User Signs Up → Account Created → Service Restarts → ❌ Account Deleted
```

### With Persistent Volume:
```
User Signs Up → Account Created → Service Restarts → ✅ Account Persists
```

## Quick Fix: Add Persistent Volume (5 Minutes)

### Step 1: Railway Dashboard
1. Go to [railway.app](https://railway.app)
2. Select your **SnackReach** service
3. Click **"Settings"** tab

### Step 2: Add Volume
1. Scroll to **"Volumes"** section
2. Click **"Add Volume"**
3. Enter:
   - **Name:** `database-storage`
   - **Mount Path:** `/app/backend/data`
   - **Size:** 1GB
4. Click **"Create"**

### Step 3: Restart Service
1. Still in **Settings**
2. Click **"Restart"** button
3. Wait for service to restart (~30 seconds)

### Step 4: Verify It Works
1. Visit your Railway site
2. Sign up a test account
3. Check: `https://your-railway-url.railway.app/api/database-status`
4. Should show your account!

## Authentication on Railway Production

### ✅ Works Exactly Like Local!

**No changes needed!** Your authentication system works identically:

- ✅ JWT tokens (same)
- ✅ Password hashing (same)
- ✅ Protected routes (same)
- ✅ User storage (same database.json)

### How It Works:

```
User on Railway Site
    ↓
POST /api/register → Account Saved → JWT Token Generated
    ↓
POST /api/login → Password Verified → JWT Token Generated
    ↓
GET /api/profile → Token Validated → User Data Retrieved
```

## Test Your Railway Production

### Test 1: Check Database Status

Visit in browser:
```
https://your-railway-url.railway.app/api/database-status
```

**Should show:**
```json
{
  "databasePath": "/app/backend/data/database.json",
  "databaseFileExists": true,
  "totalAccounts": 0,
  "environment": "production"
}
```

### Test 2: Create Account

1. Visit: `https://your-railway-url.railway.app/signup.html`
2. Sign up with test email
3. Check `/api/database-status` again
4. Should show: `"totalAccounts": 1`

### Test 3: Verify Persistence

1. Restart service in Railway dashboard
2. Check `/api/database-status` again
3. Account should still be there! ✅

## Database Location Comparison

| Environment | Path | Persistent? |
|-------------|------|------------|
| **Local** | `backend/data/database.json` | ✅ Always |
| **Railway (no volume)** | `/app/backend/data/database.json` | ❌ No |
| **Railway (with volume)** | `/app/backend/data/database.json` | ✅ Yes |

## Railway Logs to Check

### Good Signs (Volume Working):
```
✅ Data directory ready: /app/backend/data
✅ Database initialized successfully
📊 Current accounts in database: 1
💾 Database location: /app/backend/data/database.json
```

### Bad Signs (No Volume):
```
✅ Database initialized successfully
⚠️  NOTE: This is a NEW database file
📊 Current accounts in database: 0
```

## Current Status

**Local:** ✅ Working perfectly  
**Railway:** ⚠️ Needs volume mount for persistence

## Summary

**Your Railway Production:**
- ✅ Authentication works (JWT, bcrypt)
- ✅ Database path: `/app/backend/data/database.json`
- ⚠️ **Needs:** Persistent volume mount
- ✅ **Once volume added:** Works exactly like local!

**Quick Action:**
1. Add volume: `/app/backend/data`
2. Restart service
3. Test account creation
4. Done! 🎉

Your authentication system is production-ready - just needs the volume mount!



