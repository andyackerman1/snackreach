# Supabase Setup Guide - Complete Migration

Your SnackReach backend is now set up to use Supabase! Follow these steps to complete the setup.

## Step 1: Install Supabase Package

Run this in your backend directory:

```bash
cd backend
npm install
```

This will install `@supabase/supabase-js` package.

## Step 2: Create Database Tables in Supabase

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu
   - Log in with your Supabase account

2. **Open SQL Editor:**
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New query"**

3. **Run the Schema SQL:**
   - Open the file: `backend/supabase-schema.sql`
   - Copy all the SQL code
   - Paste it into the Supabase SQL Editor
   - Click **"Run"** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

4. **Verify Tables Created:**
   - Go to **"Table Editor"** in the left sidebar
   - You should see these tables:
     - `users`
     - `snack_companies`
     - `offices`
     - `products`
     - `orders`
     - `messages`
     - `login_activity`
     - `password_reset_tokens`

## Step 3: Migrate Existing Data (Optional)

If you have existing user data in `backend/data/database.json`, migrate it:

```bash
cd backend
node migrate-to-supabase.js
```

This will:
- Read your existing JSON database
- Move all users to Supabase
- Move all other data (messages, orders, etc.)

**Note:** This is safe to run multiple times - it uses `upsert` so it won't create duplicates.

## Step 4: Set Environment Variables (Optional)

If you want to use environment variables instead of hardcoded values:

1. **Create/Update `.env` file in `backend/` directory:**
   ```env
   SUPABASE_URL=https://pplhyetnwyywucdxwkbu.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwbGh5ZXRud3l5d3VjZHh3a2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzODYzODEsImV4cCI6MjA3Nzk2MjM4MX0.UkypAjm_eXDjiPUH59fh4T5hYgCg3F9H2aFP4aR2-4o
   ```

2. **On Railway:**
   - Go to Railway Dashboard
   - Your service → Settings → Variables
   - Add the same environment variables

## Step 5: Test the Setup

### Test 1: Start Your Server

```bash
cd backend
node server.js
```

You should see:
```
✅ Supabase connected successfully
✅ Supabase database ready (X users in database)
```

### Test 2: Register a New User

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "companyName": "Test Company",
    "userType": "startup"
  }'
```

### Test 3: Check Database Status

```bash
curl http://localhost:3000/api/database-status
```

Should show your accounts from Supabase.

### Test 4: View Accounts in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu
2. Click **"Table Editor"** → **"users"**
3. You should see all your accounts!

## Step 6: View Accounts in Supabase Dashboard

### Method 1: Table Editor (Easiest)

1. Go to Supabase Dashboard
2. Click **"Table Editor"** in left sidebar
3. Click **"users"** table
4. See all accounts in a nice table view!

### Method 2: SQL Editor

```sql
SELECT * FROM users ORDER BY created_at DESC;
```

### Method 3: API Endpoint

```
https://your-railway-url.railway.app/api/database-status
```

## What's Been Updated

✅ **Registration** - Now saves to Supabase  
✅ **Login** - Now reads from Supabase  
✅ **Profile** - Now uses Supabase  
✅ **Profile Update** - Now updates Supabase  
✅ **Database Status** - Now shows Supabase data  

## Remaining Endpoints to Update

Some endpoints still need to be updated to use Supabase. They currently have placeholder code. The main ones that work are:

- ✅ `/api/register` - Registration
- ✅ `/api/login` - Login
- ✅ `/api/profile` (GET) - Get profile
- ✅ `/api/profile` (PUT) - Update profile
- ✅ `/api/database-status` - Database status

Other endpoints (like messages, orders, etc.) may still reference the old JSON file system. They'll be updated as needed.

## Troubleshooting

### "Table doesn't exist" Error

- Make sure you ran the SQL schema in Step 2
- Check Supabase Dashboard → Table Editor to verify tables exist

### "Connection failed" Error

- Verify your Supabase URL and key are correct
- Check your internet connection
- Check Supabase dashboard - is your project active?

### "User not found" After Migration

- Run the migration script again: `node migrate-to-supabase.js`
- Check Supabase Table Editor to see if users are there

### Old Data Still Showing

- Clear your browser cache
- Restart your server
- Check Supabase directly - it's the source of truth now

## Benefits of Supabase

✅ **View all accounts** in Supabase Dashboard  
✅ **Automatic backups** - Supabase handles it  
✅ **Production-ready** - PostgreSQL database  
✅ **Scalable** - Handles thousands of users  
✅ **Real-time** - Can add real-time features later  
✅ **Free tier** - Good for starting out  

## Next Steps

1. ✅ Run the SQL schema (Step 2)
2. ✅ Test registration/login
3. ✅ View accounts in Supabase Dashboard
4. 🎉 You're done! Accounts are now stored in Supabase!

## Need Help?

- Check Supabase logs: Dashboard → Logs
- Check server logs when running locally
- Verify tables exist in Supabase Table Editor

Your accounts are now stored in Supabase and you can view them anytime in the Supabase Dashboard! 🚀



