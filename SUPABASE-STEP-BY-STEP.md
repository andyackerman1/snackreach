# Supabase Setup - Step by Step Instructions

Follow these exact steps to set up Supabase for your SnackReach app.

---

## Step 1: Install Supabase Package

Open your terminal and run:

```bash
cd /Users/andy.ackerman/snackconnect/backend
npm install
```

**What this does:** Installs the `@supabase/supabase-js` package needed to connect to Supabase.

**Expected output:** You should see packages being installed. Wait for it to finish.

---

## Step 2: Open Supabase Dashboard

1. Open your web browser
2. Go to: https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu
3. Log in with your Supabase account (if prompted)

**What this does:** Takes you to your Supabase project dashboard.

---

## Step 3: Open SQL Editor

1. In the Supabase dashboard, look at the **left sidebar**
2. Click on **"SQL Editor"** (it has a database icon)
3. Click the **"New query"** button (top right)

**What this does:** Opens the SQL editor where you'll paste the database schema.

---

## Step 4: Copy the SQL Schema

1. On your computer, open this file:
   ```
   /Users/andy.ackerman/snackconnect/backend/supabase-schema.sql
   ```
2. Select **ALL** the text in that file (Cmd+A on Mac, Ctrl+A on Windows)
3. **Copy** it (Cmd+C on Mac, Ctrl+C on Windows)

**What this does:** Gets the SQL code that creates all the database tables.

---

## Step 5: Paste and Run SQL

1. Go back to the Supabase SQL Editor (in your browser)
2. **Paste** the SQL code into the editor (Cmd+V or Ctrl+V)
3. Click the **"Run"** button (or press `Ctrl+Enter` on Windows, `Cmd+Enter` on Mac)

**What this does:** Creates all the database tables (users, messages, orders, etc.)

**Expected result:** You should see a success message like "Success. No rows returned"

---

## Step 6: Verify Tables Were Created

1. In the Supabase dashboard, click **"Table Editor"** in the left sidebar
2. You should see a list of tables including:
   - `users`
   - `messages`
   - `orders`
   - `products`
   - And more...

**What this does:** Confirms that the database tables were created successfully.

**If you don't see tables:** Go back to Step 5 and make sure you clicked "Run"

---

## Step 7: Test Your Server (Optional - Migrate Existing Data First)

If you have existing user data in `backend/data/database.json`, migrate it:

1. Open terminal
2. Run:
   ```bash
   cd /Users/andy.ackerman/snackconnect/backend
   node migrate-to-supabase.js
   ```

**What this does:** Moves your existing user account(s) from JSON file to Supabase.

**Expected output:** You should see messages like "✅ Successfully migrated X users"

**Note:** If you don't have existing data, skip this step.

---

## Step 8: Start Your Server

1. Open terminal
2. Run:
   ```bash
   cd /Users/andy.ackerman/snackconnect/backend
   node server.js
   ```

**What this does:** Starts your backend server with Supabase connection.

**Expected output:** You should see:
```
✅ Supabase connected successfully
✅ Supabase database ready (X users in database)
Server running on port 3000
```

**If you see errors:** Make sure you completed Steps 1-5 first.

---

## Step 9: Test Registration

1. Keep your server running (from Step 8)
2. Open a **new terminal window**
3. Run this command:
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

**What this does:** Creates a test account in Supabase.

**Expected output:** You should see a JSON response with a token and user info.

---

## Step 10: View Accounts in Supabase

1. Go back to your browser
2. Go to: https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu
3. Click **"Table Editor"** in the left sidebar
4. Click on **"users"** table
5. You should see your test account!

**What this does:** Shows you that accounts are being stored in Supabase.

**You can see:**
- Name
- Email
- Company Name
- User Type
- Created Date
- And more!

---

## Step 11: Test Database Status Endpoint

1. Open your browser
2. Go to: http://localhost:3000/api/database-status
3. You should see JSON with account information

**What this does:** Verifies the database status endpoint is working with Supabase.

**Expected output:** JSON showing:
```json
{
  "databaseType": "Supabase PostgreSQL",
  "totalAccounts": 1,
  "accounts": [...]
}
```

---

## ✅ You're Done!

Your accounts are now stored in Supabase! You can:

- ✅ View all accounts in Supabase Dashboard
- ✅ Register new users (they go to Supabase)
- ✅ Login users (from Supabase)
- ✅ Manage accounts in Supabase Table Editor

---

## Quick Reference

**Supabase Dashboard:**
https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu

**View Accounts:**
1. Dashboard → Table Editor → users

**Test Server:**
```bash
cd backend
node server.js
```

**Test Registration:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "password": "test123",
    "companyName": "Test Co",
    "userType": "startup"
  }'
```

---

## Troubleshooting

### "Table doesn't exist" Error
- **Fix:** Go back to Step 5 and make sure you ran the SQL

### "Connection failed" Error
- **Fix:** Make sure your internet is working
- **Fix:** Check that Supabase project is active in dashboard

### "npm install" Fails
- **Fix:** Make sure you're in the `backend` directory
- **Fix:** Check you have Node.js installed: `node --version`

### Server Won't Start
- **Fix:** Make sure you completed Step 1 (npm install)
- **Fix:** Make sure you completed Step 5 (ran SQL schema)
- **Fix:** Check terminal for error messages

### Can't See Accounts in Supabase
- **Fix:** Make sure you completed Step 5 (ran SQL schema)
- **Fix:** Make sure you created a test account (Step 9)
- **Fix:** Refresh the Supabase dashboard page

---

## Need Help?

If you get stuck at any step:

1. **Check the error message** - What does it say?
2. **Verify previous steps** - Did you complete all steps before this one?
3. **Check the guides:**
   - `SUPABASE-SETUP-GUIDE.md` - Detailed guide
   - `VIEW-ACCOUNTS-SUPABASE.md` - How to view accounts

---

## Summary Checklist

- [ ] Step 1: Installed npm packages
- [ ] Step 2: Opened Supabase dashboard
- [ ] Step 3: Opened SQL Editor
- [ ] Step 4: Copied SQL schema
- [ ] Step 5: Pasted and ran SQL
- [ ] Step 6: Verified tables created
- [ ] Step 7: Migrated existing data (if needed)
- [ ] Step 8: Started server
- [ ] Step 9: Tested registration
- [ ] Step 10: Viewed accounts in Supabase
- [ ] Step 11: Tested database status endpoint

Once all boxes are checked, you're all set! 🎉



