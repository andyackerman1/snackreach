# EASIEST Way to Set Up Supabase - Just 3 Steps

This is the simplest way to get user accounts working. No SQL needed!

---

## Step 1: Create the Users Table Manually

### 1.1: Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu

### 1.2: Find "Table Editor"
- Look in the **left sidebar**
- Click on **"Table Editor"** (or "Tables" or "Database")

### 1.3: Create New Table
- Click **"New Table"** button (or "+" button)
- Name it: `users`
- Click **"Create"** or **"Save"**

### 1.4: Add Columns (One by One)

Click **"Add Column"** for each of these:

**Column 1: id**
- Name: `id`
- Type: `text`
- Check ✅: Primary Key
- Check ✅: Not Null

**Column 2: name**
- Name: `name`
- Type: `text`
- Check ✅: Not Null

**Column 3: email**
- Name: `email`
- Type: `text`
- Check ✅: Not Null
- Check ✅: Unique

**Column 4: password**
- Name: `password`
- Type: `text`
- Check ✅: Not Null

**Column 5: company_name**
- Name: `company_name`
- Type: `text`
- Check ✅: Not Null

**Column 6: user_type**
- Name: `user_type`
- Type: `text`
- Check ✅: Not Null

**Column 7: created_at**
- Name: `created_at`
- Type: `timestamptz` (or "timestamp with time zone")
- Default: `now()`

**Column 8: subscription**
- Name: `subscription`
- Type: `jsonb`
- Default: `{"status": "active", "plan": "premium", "price": 2.00, "billingCycle": "monthly"}`

### 1.5: Save Table
- Click **"Save"** or **"Create Table"**

**Done!** Your users table is ready.

---

## Step 2: Install Package (If Not Done)

Open Terminal and run:

```bash
cd /Users/andy.ackerman/snackconnect/backend
npm install
```

Wait for it to finish.

---

## Step 3: Test It

### 3.1: Start Server
```bash
cd /Users/andy.ackerman/snackconnect/backend
node server.js
```

You should see: `✅ Supabase connected successfully`

### 3.2: Create Test Account

In a NEW terminal window:

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

### 3.3: Check It Worked

Go back to Supabase Dashboard:
1. Click **"Table Editor"**
2. Click **"users"** table
3. You should see your test account!

---

## That's It!

You now have:
- ✅ Users can create accounts
- ✅ Users can log in
- ✅ Accounts stored in Supabase
- ✅ You can view all accounts in Supabase Dashboard

---

## Summary: What You Just Did

1. Created `users` table in Supabase (manually)
2. Installed npm package
3. Tested registration

**Total time: 5-10 minutes**

---

## Need Help?

**If you can't find "Table Editor":**
- Look for "Tables" or "Database" in sidebar
- Or tell me what you see and I'll help

**If table creation fails:**
- Make sure you're logged into Supabase
- Check you're in the right project
- Try refreshing the page

**If registration doesn't work:**
- Check server is running
- Check you see the table in Supabase
- Check server logs for errors

---

## What You Can Do Now

1. **View Accounts:** Supabase Dashboard → Table Editor → users
2. **Register Users:** Use `/api/register` endpoint
3. **Login Users:** Use `/api/login` endpoint
4. **Manage Accounts:** Edit directly in Supabase Table Editor

**You're all set!** 🎉



