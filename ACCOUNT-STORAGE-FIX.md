# Account Storage Fix Guide

## Problem: Accounts Not Being Stored

If accounts are not persisting, here's how to fix it:

## Quick Diagnosis

### 1. Check Database Status

**Local:**
```bash
curl http://localhost:3000/api/database-status
```

**Railway:**
```bash
curl https://your-railway-url.railway.app/api/database-status
```

This will show you:
- Total accounts in database
- Database file location
- When database was last modified
- All account details

### 2. Check Server Logs

When someone signs up, you should see:
```
📝 Adding new user to database: email@example.com startup
📝 Current database users count BEFORE save: 1
💾 Saving to database...
💾 Database write completed
🔍 Verifying account was saved...
✅ VERIFIED: User account permanently saved: email@example.com
```

If you see `❌ CRITICAL ERROR: User account NOT found after save!`, there's a storage issue.

## Common Issues & Fixes

### Issue 1: Railway Ephemeral Filesystem

**Problem:** Railway's filesystem is ephemeral by default - files are lost on restart.

**Solution:** Railway needs persistent storage. Check if your Railway service has a volume attached.

**How to Fix:**

1. Go to Railway dashboard
2. Select your service
3. Go to "Settings" → "Volumes"
4. Add a volume:
   - **Mount Path:** `/app/backend/data`
   - **Name:** `database-storage`
5. Redeploy your service

**Verify:**
- After redeploy, check `/api/database-status`
- Create a test account
- Restart the service
- Check again - account should still be there

### Issue 2: Database File Permissions

**Problem:** Server can't write to database file.

**Fix:**
- Database directory is automatically created with proper permissions
- If issues persist, check Railway logs for permission errors

### Issue 3: Database File Not Being Created

**Problem:** Database initialization fails silently.

**Fix:**
- Check server startup logs for database initialization messages
- Should see: `✅ Database initialized successfully`
- Should see: `📊 Current accounts in database: X`

## Verification Steps

### Step 1: Test Account Creation

1. Sign up a new account
2. Check server logs for:
   ```
   ✅ VERIFIED: User account permanently saved: email@example.com
   ✅ VERIFIED: Database now contains: X total accounts
   ```
3. If you see errors, copy them and check the fixes above

### Step 2: Verify Persistence

**Local:**
```bash
# Check database file
cat backend/data/database.json

# Should see your accounts in JSON format
```

**Railway:**
1. Check `/api/database-status` endpoint
2. Should show all accounts
3. Restart service
4. Check again - accounts should still be there

### Step 3: Check Admin Dashboard

1. Go to admin dashboard
2. Should see all accounts listed
3. If empty, check:
   - Is admin dashboard pointing to correct backend URL?
   - Are you checking local vs Railway?
   - Check `/api/database-status` directly

## Database Location

**Local:** `backend/data/database.json`
**Railway:** `/app/backend/data/database.json` (if volume mounted)

## What the Code Does

1. **Registration:** When user signs up:
   - Account added to `db.users` array
   - Database saved with `writeDB()`
   - Immediately verified by reading back
   - Logs confirm save success

2. **Persistence:** Accounts are saved to JSON file:
   - Never automatically deleted
   - Preserved across server restarts
   - Works on both local and Railway (with volume)

3. **Verification:** Multiple checks ensure accounts are saved:
   - Write verification (reads back immediately)
   - File existence check
   - Account count verification
   - Diagnostic endpoint for manual checking

## Still Not Working?

1. **Check Railway Logs:**
   - Railway dashboard → Your service → Logs
   - Look for database errors or warnings

2. **Test Database Endpoint:**
   - Visit: `https://your-railway-url.railway.app/api/database-status`
   - Should show all accounts

3. **Check File System:**
   - Railway may need volume mount for persistence
   - See "Issue 1" above

4. **Restart Server:**
   - Sometimes a restart fixes initialization issues
   - Accounts should persist after restart if storage is working

## Need Help?

If accounts still aren't storing:
1. Share the output of `/api/database-status`
2. Share server logs from account creation
3. Check if Railway volume is mounted
4. Verify database file exists and is writable

