# How to View Stored Accounts on Railway

Here are all the ways you can view accounts stored on your Railway server:

## Method 1: Database Status Endpoint (Easiest) ⭐

**No login required** - Shows account count and basic info.

### In Browser:
Visit this URL (replace with your Railway domain):
```
https://your-railway-url.railway.app/api/database-status
```

**Example:**
```
https://snackreach-production.up.railway.app/api/database-status
```

**What you'll see:**
```json
{
  "databasePath": "/app/backend/data/database.json",
  "databaseExists": true,
  "databaseFileExists": true,
  "totalAccounts": 3,
  "accounts": [
    {
      "id": "1234567890",
      "email": "user@example.com",
      "userType": "startup",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "environment": "production",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

### Using curl (Terminal):
```bash
curl https://your-railway-url.railway.app/api/database-status
```

---

## Method 2: Admin Dashboard (Full Details) ⭐⭐⭐

**Best option** - Shows all account details in a nice table.

### Steps:
1. **Go to your admin dashboard:**
   ```
   https://your-railway-url.railway.app/admin-dashboard.html
   ```

2. **Log in with admin credentials:**
   - Email: `snackreach1@gmail.com`
   - Password: `Greylock21`

3. **Click "All Accounts" tab** - You'll see:
   - Name
   - Email
   - Company Name
   - User Type
   - Phone
   - Created Date
   - All account details

---

## Method 3: Admin API Endpoint (Programmatic Access)

**For developers** - Get full account data via API.

### Step 1: Get Admin Token
```bash
curl -X POST https://your-railway-url.railway.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "snackreach1@gmail.com",
    "password": "Greylock21"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Step 2: View All Accounts
```bash
curl -X GET https://your-railway-url.railway.app/api/admin/all-accounts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response shows full account details:**
```json
{
  "accounts": [
    {
      "id": "1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "companyName": "Example Corp",
      "phone": "123-456-7890",
      "userType": "startup",
      "subscription": { ... },
      "paymentMethods": [ ... ],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 3
}
```

---

## Method 4: Railway Dashboard (View Logs)

**See account creation activity** in real-time.

### Steps:
1. Go to [railway.app](https://railway.app)
2. Select your service
3. Click **"Logs"** tab
4. You'll see account creation messages:
   ```
   📝 Adding new user to database: user@example.com startup
   ✅ VERIFIED: User account permanently saved: user@example.com
   ✅ VERIFIED: Database now contains: 3 total accounts
   ```

---

## Method 5: Railway CLI (Advanced)

**Access the database file directly** (if Railway CLI is installed).

### Install Railway CLI:
```bash
npm i -g @railway/cli
railway login
```

### Connect to Your Service:
```bash
railway link  # Select your project
railway shell  # Opens shell in your Railway service
```

### View Database File:
```bash
cat /app/backend/data/database.json
```

Or pretty-print:
```bash
cat /app/backend/data/database.json | python3 -m json.tool
```

---

## Method 6: Download Database File (Backup)

**Save a copy** of your database file for backup/analysis.

### Using Railway CLI:
```bash
railway shell
cat /app/backend/data/database.json > database-backup.json
# Then download via Railway dashboard or use railway pull
```

### Or via API:
The `/api/database-status` endpoint shows you the data, which you can copy and save.

---

## Quick Reference

| Method | Ease | Details Shown | Login Required |
|--------|------|---------------|----------------|
| **Database Status** | ⭐⭐⭐ | Basic (email, type) | No |
| **Admin Dashboard** | ⭐⭐⭐ | Full details | Yes |
| **Admin API** | ⭐⭐ | Full details | Yes (token) |
| **Railway Logs** | ⭐⭐ | Activity only | Railway account |
| **Railway CLI** | ⭐ | Raw JSON file | Railway account |

---

## Finding Your Railway URL

If you don't know your Railway URL:

1. Go to [railway.app](https://railway.app)
2. Select your project/service
3. Click **"Settings"** → **"Domains"**
4. You'll see your Railway domain (e.g., `your-app.up.railway.app`)

Or check your deployment logs for the domain.

---

## Troubleshooting

### "Database file not found"
- Check if Railway volume is mounted
- See `ACCOUNT-STORAGE-FIX.md` for volume setup

### "No accounts showing"
- Check `/api/database-status` to verify accounts exist
- Verify you're using the correct Railway URL
- Check Railway logs for errors

### "Admin login not working"
- Verify admin credentials: `snackreach1@gmail.com` / `Greylock21`
- Check if admin account exists in database
- Check Railway logs for authentication errors

---

## Recommended: Use Admin Dashboard

**For regular viewing**, use the **Admin Dashboard** (Method 2):
- ✅ Easy to use
- ✅ Shows all details
- ✅ Nice table format
- ✅ Can manage accounts from there

**For quick checks**, use **Database Status** (Method 1):
- ✅ No login needed
- ✅ Quick account count
- ✅ Verify storage is working

---

## Example: View Accounts Now

### Quick Check (No Login):
```
https://your-railway-url.railway.app/api/database-status
```

### Full View (With Login):
```
https://your-railway-url.railway.app/admin-dashboard.html
```

Login: `snackreach1@gmail.com` / `Greylock21`

---

## Need Help?

If you can't see accounts:
1. Check `/api/database-status` - does it show accounts?
2. Check Railway logs - any errors?
3. Verify volume is mounted (Settings → Volumes)
4. Check if backend is running (Railway dashboard)

Your accounts are stored in: `/app/backend/data/database.json` on Railway (inside the mounted volume).



