# Backend Connection Guide - Linking Your Site to the Backend

This guide explains how to connect your frontend (website) to the backend so that accounts are created and stored permanently, and appear in the admin dashboard.

## How It Works

### 1. Backend Database Storage
- **Location**: `backend/data/database.json`
- **Storage**: All accounts are permanently saved to this file
- **Persistence**: Accounts persist across server restarts
- **Works on**: Both local development and Railway production

### 2. Frontend-to-Backend Connection
Your frontend pages automatically detect the environment and connect to the correct backend:

**Local Development:**
- Backend URL: `http://localhost:3000/api`
- Frontend: Opens from `file://` or `http://localhost:3000`

**Railway Production:**
- Backend URL: `https://snackreach-production.up.railway.app/api` (or your Railway domain)
- Frontend: Served from Railway

## How Accounts Are Created and Stored

### Step-by-Step Flow:

1. **User Signs Up** (`signup.html`)
   - User fills out registration form
   - Frontend sends POST request to `/api/register`
   - Backend receives request at `backend/server.js`

2. **Backend Processes Registration**
   - Validates user data
   - Hashes password (bcrypt)
   - Creates user object with:
     ```json
     {
       "id": "unique-id",
       "name": "User Name",
       "email": "user@example.com",
       "password": "hashed-password",
       "companyName": "Company",
       "userType": "startup" | "office",
       "createdAt": "2024-01-15T10:30:00.000Z"
     }
     ```

3. **Account Saved to Database**
   - User added to `db.users[]` array
   - Saved to `backend/data/database.json`
   - File is written atomically (prevents corruption)
   - Database persists permanently

4. **Account Appears in Admin Dashboard**
   - Admin dashboard calls `/api/admin/all-accounts`
   - Backend reads from `database.json`
   - Returns all users
   - Admin dashboard displays them in table

## Configuration

### Local Development Setup

1. **Start Backend Server:**
   ```bash
   cd backend
   npm install
   node server.js
   ```
   Server runs on `http://localhost:3000`

2. **Open Frontend:**
   - Open `signup.html` in browser (or serve via `http://localhost:3000`)
   - Or use a local server: `python3 -m http.server 8000`

3. **Database Location:**
   - Local: `backend/data/database.json`
   - Check this file to see all stored accounts

### Railway Production Setup

1. **Railway Configuration:**
   - Backend is deployed on Railway
   - Database file: `backend/data/database.json` (persists on Railway)
   - Frontend should be served from Railway or your domain

2. **Environment Variables (Railway):**
   Set these in Railway dashboard:
   ```
   JWT_SECRET=your-secret-key
   PORT=3000
   NODE_ENV=production
   ```

3. **Frontend Connection:**
   - Frontend automatically detects Railway domain
   - Uses Railway API URL: `https://your-railway-domain.up.railway.app/api`

## Frontend API Detection

Your frontend pages automatically detect the correct backend URL:

```javascript
const API_BASE_URL = (() => {
    const hostname = window.location.hostname;
    if (hostname.includes('railway.app')) {
        return '/api';  // Railway - relative path
    } else if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return 'https://snackreach-production.up.railway.app/api';  // Production
    } else {
        return 'http://localhost:3000/api';  // Local development
    }
})();
```

## Admin Dashboard Connection

### How Admin Dashboard Gets Accounts:

1. **Admin Logs In** (`admin-dashboard.html`)
   - Uses credentials: `snackreach1@gmail.com` / `Greylock21`
   - Gets JWT token

2. **Dashboard Loads Accounts**
   - Calls: `GET /api/admin/all-accounts`
   - Requires: `Authorization: Bearer <token>`
   - Backend reads from `database.json`
   - Returns all users

3. **Accounts Displayed**
   - Shows in table with:
     - Name
     - Email
     - Company
     - User Type
     - Created Date

## Troubleshooting

### Accounts Not Showing in Admin Dashboard

1. **Check Backend is Running:**
   ```bash
   # Local
   cd backend
   node server.js
   
   # Railway
   Check Railway deployment logs
   ```

2. **Check Database File:**
   ```bash
   # Local
   cat backend/data/database.json
   
   # Railway
   Check Railway logs for database path
   ```

3. **Check API Connection:**
   - Open browser console (F12)
   - Check for errors in Network tab
   - Verify API URL is correct

4. **Check Admin Login:**
   - Make sure you're logged in as admin
   - Token should be in localStorage
   - Check browser console for auth errors

### Accounts Not Persisting

1. **Check Database Path:**
   - Local: `backend/data/database.json`
   - Railway: Should be in persistent storage

2. **Check File Permissions:**
   ```bash
   # Local
   ls -la backend/data/
   chmod 755 backend/data/
   ```

3. **Check Server Logs:**
   - Look for: `✅ Database written successfully`
   - Look for: `✅ Total users permanently saved: X`

### Backend Not Connecting

1. **Check CORS:**
   - Backend has CORS enabled
   - Should allow requests from your frontend domain

2. **Check Port:**
   - Local: Port 3000
   - Railway: Uses Railway's assigned port

3. **Check Environment:**
   - Make sure `NODE_ENV` is set correctly
   - Railway: `NODE_ENV=production`
   - Local: Can be `development` or unset

## Testing the Connection

### Test Account Creation:

1. **Sign Up:**
   - Go to `signup.html`
   - Create a test account
   - Check console for success message

2. **Verify in Database:**
   ```bash
   # Local
   cat backend/data/database.json | grep -A 5 "email"
   ```

3. **Check Admin Dashboard:**
   - Log in to admin dashboard
   - Click "All Accounts" tab
   - Should see your test account

### Test API Directly:

```bash
# Get all accounts (requires admin token)
curl -X GET http://localhost:3000/api/admin/all-accounts \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Database File Structure

```json
{
  "users": [
    {
      "id": "1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "password": "$2a$10$hashed...",
      "companyName": "Example Corp",
      "userType": "office",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "messages": [],
  "loginActivity": []
}
```

## Key Points

✅ **Accounts are permanently stored** in `backend/data/database.json`
✅ **Backend must be running** for accounts to be created/viewed
✅ **Frontend automatically detects** local vs Railway environment
✅ **Admin dashboard reads from same database** as signup
✅ **All accounts persist** across server restarts
✅ **Works on both local and Railway** with same code

## Next Steps

1. **Start Backend:**
   ```bash
   cd backend
   node server.js
   ```

2. **Create Test Account:**
   - Go to signup page
   - Register a new account

3. **View in Admin:**
   - Log in to admin dashboard
   - See your account in the list

4. **Verify Persistence:**
   - Restart backend server
   - Check admin dashboard again
   - Account should still be there

