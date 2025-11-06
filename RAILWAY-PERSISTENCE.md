# Railway Database Persistence Setup

## Critical: Railway Ephemeral Filesystem

**Railway's filesystem is ephemeral by default** - this means files are deleted when the service restarts or redeploys.

## Solution: Add Persistent Volume

### Step 1: Add Volume in Railway Dashboard

1. Go to [Railway Dashboard](https://railway.app)
2. Select your SnackReach service
3. Click **"Settings"** tab
4. Scroll to **"Volumes"** section
5. Click **"Add Volume"**
6. Configure:
   - **Name:** `database-storage`
   - **Mount Path:** `/app/backend/data`
   - **Size:** 1GB (or more if needed)
7. Click **"Create"**

### Step 2: Verify Volume is Mounted

After adding the volume:

1. Check Railway logs for:
   ```
   ✅ Data directory ready: /app/backend/data
   ✅ Database initialized successfully
   ```

2. Test account creation:
   - Create a test account
   - Check `/api/database-status`
   - Should show the account

3. Restart service:
   - Railway dashboard → Service → Settings → Restart
   - Wait for restart
   - Check `/api/database-status` again
   - Account should still be there

### Step 3: Verify Database Location

The database is stored at:
- **Local:** `backend/data/database.json`
- **Railway (with volume):** `/app/backend/data/database.json`

The code automatically:
- Creates the `data` directory if it doesn't exist
- Creates `database.json` if it doesn't exist
- Saves all accounts to this file
- Preserves existing accounts on startup

## Alternative: Use Railway Database (PostgreSQL)

If volumes don't work, you can use Railway's PostgreSQL:

1. Add PostgreSQL service in Railway
2. Get connection string from Railway
3. Update code to use PostgreSQL instead of JSON file

**Note:** This requires code changes. The current JSON file approach works fine with a volume.

## Quick Test

After setting up the volume:

```bash
# Test database endpoint
curl https://your-railway-url.railway.app/api/database-status

# Should show:
# - databaseFileExists: true
# - totalAccounts: X
# - accounts: [...]
```

## Troubleshooting

### Volume Not Working?

1. **Check mount path:**
   - Must be exactly: `/app/backend/data`
   - Not `/app/data` or `/backend/data`

2. **Check service restart:**
   - Volume mounts only apply after restart
   - Restart service after adding volume

3. **Check logs:**
   - Should see database initialization messages
   - Should see database path: `/app/backend/data/database.json`

### Accounts Still Not Persisting?

1. **Verify volume is mounted:**
   - Railway dashboard → Service → Volumes
   - Should show: `database-storage` mounted at `/app/backend/data`

2. **Check database endpoint:**
   - Visit: `https://your-url.railway.app/api/database-status`
   - Check `databaseFileExists` and `totalAccounts`

3. **Check server logs:**
   - Look for account save verification messages
   - Should see: `✅ VERIFIED: User account permanently saved`

## Current Status

Your code is correctly configured to:
- ✅ Save accounts to `backend/data/database.json`
- ✅ Preserve accounts on server restart (if volume is mounted)
- ✅ Verify accounts are saved after registration
- ✅ Log all database operations

**The only missing piece is the Railway volume mount.**

Once you add the volume, accounts will persist permanently! 🎉

