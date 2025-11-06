# SQL Commands to Run in Supabase SQL Editor

You're in the SQL Editor. Run these commands in order:

---

## Step 1: Disable Row Level Security (Required First!)

**Copy and paste this into the SQL Editor:**

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

**Click "Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)

**Expected result:** "Success. No rows returned"

**This allows accounts to be saved to Supabase.**

---

## Step 2: Verify Table Exists (Optional Check)

**Run this to check if users table exists:**

```sql
SELECT * FROM users LIMIT 5;
```

**Expected result:**
- If table exists: Shows rows (or empty if no accounts)
- If table doesn't exist: Error message

---

## Step 3: Check Current Accounts (After Creating Some)

**Run this to see all accounts:**

```sql
SELECT id, email, name, company_name, user_type, created_at 
FROM users 
ORDER BY created_at DESC;
```

**This shows all accounts in the database.**

---

## Step 4: Create Test Account Directly (Optional)

**If you want to create an account directly in SQL:**

```sql
INSERT INTO users (id, name, email, password, company_name, user_type, created_at)
VALUES (
  '1234567890',
  'Test User',
  'test@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: test123
  'Test Company',
  'startup',
  NOW()
);
```

**Note:** The password hash above is for "test123". For production, use your server's registration endpoint which properly hashes passwords.

---

## Complete Setup SQL (If Table Doesn't Exist)

**If you need to create the table, run this:**

```sql
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    company_name TEXT NOT NULL,
    phone TEXT,
    user_type TEXT NOT NULL CHECK (user_type IN ('startup', 'office')),
    card_info JSONB DEFAULT '{}',
    subscription JSONB DEFAULT '{"status": "active", "plan": "premium", "price": 2.00, "billingCycle": "monthly"}',
    payment_methods JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

---

## Quick Reference: What to Run Right Now

**In your SQL Editor, run this ONE command:**

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

**Then:**
1. Start your server: `node server.js`
2. Create account via API
3. Run this to see accounts:
   ```sql
   SELECT * FROM users;
   ```

---

## After Running SQL

1. **Go back to Table Editor:**
   - Click "Table Editor" in left sidebar
   - Click "users" table
   - You should see accounts!

2. **Or stay in SQL Editor:**
   - Run: `SELECT * FROM users;`
   - See accounts in results

---

## Troubleshooting

### "Table 'users' does not exist"
- Run the "Complete Setup SQL" above to create the table

### "Permission denied"
- You're already logged in, this shouldn't happen
- Make sure you're in the right project

### "RLS is already disabled"
- That's fine! It means it's already set up correctly

---

## Summary

**Right now in SQL Editor, run:**
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

**Then create accounts via your server, and they'll appear in Supabase!**



