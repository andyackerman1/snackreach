# Fix RLS and Find Accounts in Supabase

## Issue: Row Level Security (RLS) is Blocking Inserts

Supabase has security enabled by default. We need to disable it or create a policy.

---

## Where to Find Accounts in Supabase

### Exact Location:

1. **Open Browser:**
   - Go to: https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu

2. **Click in Left Sidebar:**
   - Click **"Table Editor"** (has a table/grid icon)

3. **Click on Table:**
   - Click **"users"** table

4. **See Accounts:**
   - You'll see a table with all your accounts

**If you don't see "Table Editor":**
- Look for **"Database"** → **"Tables"**
- Or look for **"Schema"** section

---

## Fix: Disable Row Level Security (RLS)

### Option 1: Disable RLS via SQL Editor (Easiest)

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu

2. **Click "SQL Editor"** in left sidebar

3. **Click "New query"**

4. **Copy and paste this SQL:**
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ```

5. **Click "Run"** (or press Ctrl+Enter / Cmd+Enter)

6. **You should see:** "Success. No rows returned"

**Now RLS is disabled and accounts can be created!**

---

### Option 2: Disable RLS via Table Editor

1. **Go to Supabase Dashboard**
2. **Click "Table Editor"**
3. **Click "users" table**
4. **Look for "Settings" or "Policies" tab**
5. **Find "Row Level Security"**
6. **Toggle it OFF** or **Disable**

---

### Option 3: Create Insert Policy (Better for Production)

1. **Go to SQL Editor**
2. **Run this SQL:**
   ```sql
   -- Allow inserts for authenticated users
   CREATE POLICY "Allow public inserts" ON users
   FOR INSERT
   WITH CHECK (true);
   
   -- Allow reads for authenticated users
   CREATE POLICY "Allow public reads" ON users
   FOR SELECT
   USING (true);
   ```

This allows inserts and reads while keeping RLS enabled.

---

## After Fixing RLS: Create Test Account

### Method 1: Via Server (Recommended)

1. **Make sure server is running:**
   ```bash
   cd /Users/andy.ackerman/snackconnect/backend
   node server.js
   ```

2. **In NEW terminal, create account:**
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

### Method 2: Directly in Supabase (After RLS is disabled)

1. **Go to Table Editor**
2. **Click "users" table**
3. **Click "Insert" or "New Row"**
4. **Fill in the fields:**
   - id: `1234567890` (any number as text)
   - name: `Test User`
   - email: `test@example.com`
   - password: `$2a$10$...` (hashed password - use server to create)
   - company_name: `Test Company`
   - user_type: `startup`
   - created_at: (leave blank, auto-fills)

5. **Click "Save"**

---

## Verify Accounts Are There

### Step 1: Check Table Editor

1. Go to Supabase Dashboard
2. Click **"Table Editor"**
3. Click **"users"** table
4. **You should see your accounts!**

### Step 2: Use SQL Query (Alternative)

1. Click **"SQL Editor"**
2. Run this query:
   ```sql
   SELECT * FROM users;
   ```
3. **See all accounts in results**

---

## Quick Checklist

- [ ] Disabled RLS: `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`
- [ ] Server running: `node server.js`
- [ ] Created test account via `/api/register`
- [ ] Checked Supabase Dashboard → Table Editor → users
- [ ] Accounts visible! ✅

---

## Summary

**To find accounts:**
1. Supabase Dashboard → Table Editor → users

**To fix RLS issue:**
1. SQL Editor → Run: `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`

**Then create accounts and they'll appear in Table Editor!**



