# Simple 3-Step Setup - Easiest Way Possible

## Step 1: Create Users Table in Supabase

1. Go to: https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu
2. Click **"Table Editor"** (left sidebar)
3. Click **"New Table"**
4. Name: `users`
5. Add these 7 columns:

| Column Name | Type | Options |
|------------|------|---------|
| id | text | ✅ Primary Key, ✅ Not Null |
| name | text | ✅ Not Null |
| email | text | ✅ Not Null, ✅ Unique |
| password | text | ✅ Not Null |
| company_name | text | ✅ Not Null |
| user_type | text | ✅ Not Null |
| created_at | timestamptz | Default: `now()` |

6. Click **"Save"**

---

## Step 2: Install Package

```bash
cd /Users/andy.ackerman/snackconnect/backend
npm install
```

---

## Step 3: Test It

```bash
cd /Users/andy.ackerman/snackconnect/backend
node server.js
```

Then create a test account - it will save to Supabase!

---

**That's it!** Users can now create accounts, log in, and you can view them in Supabase.



