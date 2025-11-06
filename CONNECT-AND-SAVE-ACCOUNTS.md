# How to Connect Supabase and Save Accounts - Step by Step

The connection code is already in your project! You just need to do these steps:

---

## Step 1: Install the Package

Open Terminal and run:

```bash
cd /Users/andy.ackerman/snackconnect/backend
npm install
```

**Wait for it to finish** (takes 1-2 minutes)

**What this does:** Installs the Supabase package so your server can connect to Supabase.

---

## Step 2: Start Your Server

In the same terminal, run:

```bash
node server.js
```

**What you should see:**
```
✅ Supabase connected successfully
✅ Supabase database ready (0 users in database)
Server running on port 3000
```

**If you see errors:** Make sure you completed Step 1 first.

**Keep this terminal window open** - your server is now running!

---

## Step 3: Create a Test Account

Open a **NEW terminal window** (keep the server running in the first one).

In the new terminal, run this command:

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

**What this does:** Creates a test account and saves it to Supabase.

**Expected output:** You should see JSON with a token and user info.

---

## Step 4: Check If Account Was Saved

Go to Supabase Dashboard:

1. Open: https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu
2. Click **"Table Editor"** (left sidebar)
3. Click **"users"** table
4. **You should see your test account!** ✅

**If you see the account:** Everything is working! 🎉

**If you don't see the account:** Check the server terminal for error messages.

---

## Step 5: Test Login

In your terminal (same one you used for registration), test login:

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Expected output:** JSON with a token - login works!

---

## That's It! You're Connected!

Now:
- ✅ Accounts are saved to Supabase
- ✅ Users can register
- ✅ Users can log in
- ✅ You can view accounts in Supabase Dashboard

---

## How It Works

**Your project is already connected because:**

1. ✅ We added Supabase URL and key to `backend/supabase.js`
2. ✅ We updated `server.js` to use Supabase
3. ✅ Registration endpoint saves to Supabase
4. ✅ Login endpoint reads from Supabase

**You just needed to:**
- Install the package (Step 1)
- Start the server (Step 2)
- Create accounts (Step 3)

---

## Viewing Accounts

**To view accounts anytime:**

1. Go to: https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu
2. Click **"Table Editor"**
3. Click **"users"**
4. See all accounts!

---

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
- **Fix:** Run `npm install` in the backend folder
- Make sure you're in: `/Users/andy.ackerman/snackconnect/backend`

### "Table 'users' does not exist"
- **Fix:** Make sure you created the table in Supabase (previous steps)
- Check Supabase Dashboard → Table Editor → users table exists

### "Connection failed"
- **Fix:** Check your internet connection
- **Fix:** Verify Supabase project is active in dashboard
- **Fix:** Check server logs for specific error

### "Port 3000 already in use"
- **Fix:** Another server is running
- **Fix:** Close other terminal windows with servers
- **Fix:** Or change port in server.js

### Account Created But Not Showing in Supabase
- **Fix:** Refresh Supabase dashboard
- **Fix:** Check server terminal for errors
- **Fix:** Verify table name is exactly `users` (lowercase)

---

## Quick Reference

**Start Server:**
```bash
cd /Users/andy.ackerman/snackconnect/backend
node server.js
```

**Create Account:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your@email.com",
    "password": "yourpassword",
    "companyName": "Your Company",
    "userType": "startup"
  }'
```

**View Accounts:**
- Supabase Dashboard → Table Editor → users

---

## Next Steps

Once accounts are saving:

1. **Test from your website:**
   - Go to your signup page
   - Create an account
   - Check Supabase - it should appear!

2. **Deploy to Railway:**
   - Push to Railway
   - Accounts will save to Supabase from Railway too!

3. **Manage Accounts:**
   - View in Supabase Dashboard
   - Edit directly in Table Editor if needed

---

## Summary

✅ **Connection is already done** - code is in your project  
✅ **Install package:** `npm install`  
✅ **Start server:** `node server.js`  
✅ **Create account:** Use `/api/register` endpoint  
✅ **View accounts:** Supabase Dashboard → Table Editor → users  

**You're all set!** Accounts will now save to Supabase automatically! 🎉



