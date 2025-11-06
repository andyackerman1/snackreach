# How to View Accounts in Supabase Dashboard

Now that your accounts are stored in Supabase, here's how to view them!

## Quick Access

**Your Supabase Dashboard:**
https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu

## Method 1: Table Editor (Easiest) ⭐

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu
   - Log in with your Supabase account

2. **Open Table Editor:**
   - Click **"Table Editor"** in the left sidebar

3. **View Users Table:**
   - Click on **"users"** table
   - You'll see all accounts in a nice table!

4. **What You Can See:**
   - Name
   - Email
   - Company Name
   - User Type (startup/office)
   - Phone
   - Created Date
   - Last Login
   - Subscription Info
   - And more!

5. **Filter & Search:**
   - Use the search bar to find specific users
   - Click column headers to sort
   - Use filters to narrow down results

## Method 2: SQL Editor

1. **Go to SQL Editor:**
   - Click **"SQL Editor"** in left sidebar
   - Click **"New query"**

2. **Run Query:**
   ```sql
   SELECT * FROM users ORDER BY created_at DESC;
   ```

3. **See Results:**
   - All users displayed in a table
   - Can export to CSV if needed

## Method 3: API Endpoint

Visit this URL (replace with your Railway domain):
```
https://your-railway-url.railway.app/api/database-status
```

Returns JSON with all account information.

## Method 4: Supabase API (Direct)

You can also query directly using Supabase API:

```bash
curl 'https://pplhyetnwyywucdxwkbu.supabase.co/rest/v1/users?select=*' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwbGh5ZXRud3l5d3VjZHh3a2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzODYzODEsImV4cCI6MjA3Nzk2MjM4MX0.UkypAjm_eXDjiPUH59fh4T5hYgCg3F9H2aFP4aR2-4o"
```

## What You Can Do in Supabase Dashboard

### View All Accounts
- Table Editor → users table
- See everything in one place

### Edit Accounts (Manually)
- Click on any row in Table Editor
- Edit fields directly
- Click "Save" when done

### Filter Accounts
- Use search bar to find specific emails
- Filter by user_type (startup/office)
- Sort by created date

### Export Data
- Click "Export" button
- Download as CSV
- Great for backups or reports

### View Account Details
- Click on any user row
- See all their information:
  - Subscription details
  - Payment methods
  - Card info
  - Created date
  - Last login

## Quick Reference

| Method | Ease | Best For |
|--------|------|----------|
| **Table Editor** | ⭐⭐⭐ | Daily viewing |
| **SQL Editor** | ⭐⭐ | Advanced queries |
| **API Endpoint** | ⭐⭐ | Programmatic access |
| **Supabase API** | ⭐ | Direct API calls |

## Recommended: Use Table Editor

**For regular viewing**, use the **Table Editor**:
- ✅ Easy to use
- ✅ Nice visual table
- ✅ Can edit directly
- ✅ Search and filter
- ✅ Export options

## Your Supabase Project

**URL:** https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu

**Quick Links:**
- Table Editor: Dashboard → Table Editor → users
- SQL Editor: Dashboard → SQL Editor
- API Docs: Dashboard → API → Auto-generated docs

## Security Note

The Supabase Dashboard is secure - only you (project owner) can access it. Users cannot see other users' accounts. They can only see their own data through your app's API.

## Need Help?

- **Can't see accounts?** - Make sure you ran the SQL schema (see SUPABASE-SETUP-GUIDE.md)
- **Table not found?** - Run the SQL in `backend/supabase-schema.sql`
- **No data showing?** - Create a test account via `/api/register` endpoint

Your accounts are now in Supabase and you can view them anytime! 🎉



