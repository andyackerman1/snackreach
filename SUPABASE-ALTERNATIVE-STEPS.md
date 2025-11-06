# Supabase Setup - Alternative Steps (If Steps 2 & 3 Don't Exist)

If you can't find "SQL Editor" in your Supabase dashboard, here are alternative ways to create the database tables.

---

## Option 1: Use Supabase SQL Editor (Different Location)

### Try These Locations for SQL Editor:

1. **Top Navigation Bar:**
   - Look for "SQL Editor" button at the top of the page
   - Or "Editor" in the top menu

2. **Left Sidebar - Different Names:**
   - Look for "SQL" (instead of "SQL Editor")
   - Or "Database" → "SQL Editor"
   - Or "Tools" → "SQL Editor"
   - Or "Query" or "Query Editor"

3. **Database Section:**
   - Click "Database" in left sidebar
   - Then look for "SQL Editor" or "Query" tab

4. **API Section:**
   - Sometimes SQL Editor is under "API" → "SQL"

---

## Option 2: Use Table Editor to Create Tables Manually

If SQL Editor doesn't exist, create tables manually:

### Step 1: Create Users Table

1. In Supabase Dashboard, click **"Table Editor"** (or "Tables")
2. Click **"New Table"** or **"Create Table"**
3. Name it: `users`
4. Add these columns one by one:

| Column Name | Type | Options |
|------------|------|---------|
| `id` | text | Primary Key, Not Null |
| `name` | text | Not Null |
| `email` | text | Not Null, Unique |
| `password` | text | Not Null |
| `company_name` | text | Not Null |
| `phone` | text | Nullable |
| `user_type` | text | Not Null |
| `card_info` | jsonb | Default: `{}` |
| `subscription` | jsonb | Default: `{"status": "active", "plan": "premium", "price": 2.00, "billingCycle": "monthly"}` |
| `payment_methods` | jsonb | Default: `[]` |
| `created_at` | timestamptz | Default: `now()` |
| `last_login` | timestamptz | Nullable |
| `updated_at` | timestamptz | Default: `now()` |

5. Click **"Save"** or **"Create"**

---

## Option 3: Use Supabase CLI (Command Line)

If you have Supabase CLI installed:

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Login:**
   ```bash
   supabase login
   ```

3. **Link to your project:**
   ```bash
   supabase link --project-ref pplhyetnwyywucdxwkbu
   ```

4. **Run SQL:**
   ```bash
   supabase db execute --file backend/supabase-schema.sql
   ```

---

## Option 4: Use Direct API Call

You can create tables using the Supabase REST API:

1. **Get your service role key** from Supabase Dashboard:
   - Go to Settings → API
   - Copy the "service_role" key (NOT the anon key)

2. **Use curl or Postman** to execute SQL:

```bash
curl -X POST 'https://pplhyetnwyywucdxwkbu.supabase.co/rest/v1/rpc/exec_sql' \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "CREATE TABLE users (...)"}'
```

---

## Option 5: Use pgAdmin or Database Tool

If you have access to PostgreSQL connection string:

1. **Get connection string** from Supabase:
   - Settings → Database → Connection String
   - Copy the "Connection string" (URI format)

2. **Use pgAdmin or any PostgreSQL client:**
   - Connect using the connection string
   - Open SQL Query tool
   - Paste the SQL from `backend/supabase-schema.sql`
   - Execute

---

## Option 6: Create Tables One at a Time via API

Use the Supabase Management API to create tables programmatically.

---

## Quick Check: What Do You See?

When you open your Supabase dashboard at:
https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu

**What options do you see in the left sidebar?**

Please tell me what you see, and I'll give you exact steps for your dashboard version.

Common options might be:
- Table Editor
- Database
- SQL
- API
- Authentication
- Storage
- Settings

---

## Simplest Solution: Create Users Table Only

If you just want to get started quickly, create ONLY the users table:

### Using Table Editor (Most Common):

1. Go to Supabase Dashboard
2. Click **"Table Editor"** (or "Tables")
3. Click **"New Table"** or **"+"** button
4. Name: `users`
5. Add these columns (minimum required):

**Required Columns:**
- `id` (text, Primary Key)
- `name` (text)
- `email` (text, Unique)
- `password` (text)
- `company_name` (text)
- `user_type` (text)
- `created_at` (timestamp, Default: now())

6. Click Save

**This will let registration and login work!** You can add other tables later.

---

## Need Help?

**Tell me:**
1. What do you see when you open the Supabase dashboard?
2. What options are in the left sidebar?
3. Can you see "Table Editor" or "Tables"?

With that info, I can give you exact steps for your dashboard version.



