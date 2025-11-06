# Railway Production Setup - Database & Authentication

## Your Railway Production Environment

### Database Location on Railway

**Production Path:** `/app/backend/data/database.json`

**Important:** Railway's filesystem is **ephemeral by default** - this means files are deleted when:
- Service restarts
- Service redeploys
- Service updates

**Your accounts will be lost unless you add persistent storage!**

## Critical: Add Persistent Volume

### Step 1: Add Volume in Railway Dashboard

1. Go to [Railway Dashboard](https://railway.app)
2. Select your **SnackReach** service
3. Click **"Settings"** tab
4. Scroll to **"Volumes"** section
5. Click **"Add Volume"**
6. Configure:
   - **Name:** `database-storage`
   - **Mount Path:** `/app/backend/data`
   - **Size:** 1GB (or more if needed)
7. Click **"Create"**

### Step 2: Restart Service

After adding the volume:
1. Go to **Settings** → **Restart**
2. Wait for service to restart
3. Verify database persists

### Step 3: Verify It's Working

**Test account creation:**
1. Sign up a new account on your Railway site
2. Check logs for: `✅ VERIFIED: User account permanently saved`
3. Restart service
4. Check again - account should still be there

**Check database status:**
```bash
curl https://your-railway-url.railway.app/api/database-status
```

Should show:
```json
{
  "databasePath": "/app/backend/data/database.json",
  "databaseFileExists": true,
  "totalAccounts": 1,
  "environment": "production"
}
```

## Authentication on Railway Production

### ✅ Your Authentication Works on Railway!

**No changes needed!** Your authentication system works the same on Railway as locally:

1. **JWT Tokens** - Same system
2. **Password Hashing** - Same bcrypt
3. **Protected Routes** - Same middleware
4. **User Storage** - Same database.json

### How It Works on Railway

```
User on Railway Site
    ↓
Signs Up → Account Saved → JWT Token Generated
    ↓
Signs In → Token Validated → Access Granted
    ↓
Data Stored → /app/backend/data/database.json
```

## Database Persistence on Railway

### Without Volume (Current State - NOT Persistent)

**Problem:**
- Files deleted on restart
- Accounts lost on redeploy
- No permanent storage

**What happens:**
1. User signs up → Account created
2. Service restarts → **Account deleted** ❌
3. User can't log in → **Account doesn't exist**

### With Volume (Persistent - What You Need)

**Solution:**
- Files persist across restarts
- Accounts saved permanently
- Data survives redeploys

**What happens:**
1. User signs up → Account created
2. Service restarts → **Account still exists** ✅
3. User can log in → **Account persists**

## Verify Railway Database Status

### Method 1: API Endpoint

Visit in browser or use curl:
```
https://your-railway-url.railway.app/api/database-status
```

**Response shows:**
- Database file path
- Whether file exists
- Total accounts stored
- Environment (production)
- Last modified time

### Method 2: Railway Logs

1. Go to Railway Dashboard
2. Select your service
3. Click **"Logs"** tab
4. Look for:
   ```
   ✅ Database initialized successfully
   📊 Current accounts in database: X
   💾 Database location: /app/backend/data/database.json
   ```

### Method 3: Server Logs on Signup

When user signs up, logs show:
```
📝 Adding new user to database: email@example.com
💾 Saving to database...
✅ VERIFIED: User account permanently saved
✅ VERIFIED: Database now contains: X total accounts
```

## Setting Up Railway Production

### Complete Setup Checklist

- [ ] **Add Persistent Volume**
  - Name: `database-storage`
  - Mount: `/app/backend/data`
  
- [ ] **Verify Volume Mounted**
  - Check logs for database path
  - Should see: `/app/backend/data/database.json`

- [ ] **Test Account Creation**
  - Sign up test account
  - Check `/api/database-status`
  - Restart service
  - Verify account still exists

- [ ] **Verify Authentication**
  - Test login
  - Test protected routes
  - Check JWT tokens working

## Environment Variables on Railway

### Required Variables

Make sure these are set in Railway:

1. **JWT_SECRET** - Secret key for tokens
2. **PORT** - Server port (Railway sets automatically)
3. **NODE_ENV** - Set to "production"

### Optional Variables

- **STRIPE_SECRET_KEY** - For payments
- **PLAID_CLIENT_ID** - For bank linking
- **PLAID_SECRET** - For bank linking
- **EMAIL_USER** - For welcome emails
- **EMAIL_PASSWORD** - For welcome emails

### How to Set Variables

1. Railway Dashboard → Your Service
2. **Settings** → **Variables**
3. Add each variable
4. Redeploy service

## Database Location Comparison

| Environment | Database Path | Persistent? |
|-------------|---------------|-------------|
| **Local** | `backend/data/database.json` | ✅ Yes (always) |
| **Railway (no volume)** | `/app/backend/data/database.json` | ❌ No (ephemeral) |
| **Railway (with volume)** | `/app/backend/data/database.json` | ✅ Yes (persistent) |

## Troubleshooting Railway Production

### Issue: Accounts Not Persisting

**Symptoms:**
- Users sign up successfully
- After restart, accounts disappear
- Users can't log in

**Solution:**
- Add persistent volume (see Step 1 above)
- Verify volume is mounted
- Test account creation after restart

### Issue: Database Not Found

**Symptoms:**
- `/api/database-status` shows `databaseFileExists: false`
- Server logs show database errors

**Solution:**
- Check volume mount path: `/app/backend/data`
- Verify volume is mounted
- Check server logs for initialization errors

### Issue: Permission Errors

**Symptoms:**
- Server logs show "EACCES" or permission errors
- Database file not created

**Solution:**
- Railway handles permissions automatically
- If issues persist, check volume mount
- Restart service after adding volume

## Quick Test for Railway Production

### Test Script

1. **Create test account:**
   ```
   Visit: https://your-railway-url.railway.app/signup.html
   Sign up with test email
   ```

2. **Check database status:**
   ```
   Visit: https://your-railway-url.railway.app/api/database-status
   Should show: totalAccounts: 1
   ```

3. **Restart service:**
   ```
   Railway Dashboard → Settings → Restart
   ```

4. **Check again:**
   ```
   Visit: https://your-railway-url.railway.app/api/database-status
   Should still show: totalAccounts: 1 (if volume mounted)
   ```

## Summary

### Railway Production Database

- **Location:** `/app/backend/data/database.json`
- **Persistence:** Requires volume mount
- **Authentication:** Works same as local (JWT)

### Critical Steps

1. ✅ **Add Volume** - Mount `/app/backend/data`
2. ✅ **Restart Service** - Apply volume mount
3. ✅ **Test Persistence** - Create account, restart, verify

### Current Status

- **Local:** ✅ Database working and persistent
- **Railway:** ⚠️ Needs volume mount for persistence

**Once you add the volume, Railway production will work exactly like local!**

## Need Help?

If accounts still aren't persisting on Railway:

1. Check Railway logs for errors
2. Verify volume is mounted (Settings → Volumes)
3. Test `/api/database-status` endpoint
4. Share logs if issues persist

Your authentication system is production-ready! Just need the volume mount for persistence.



