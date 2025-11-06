# Step-by-Step: Link Backend to Your Site

Follow these steps to ensure accounts are created, stored permanently, and appear in the admin dashboard.

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (check with `node --version`)
- ✅ Backend folder exists at `snackconnect/backend/`
- ✅ All files are in place

---

## STEP 1: Install Backend Dependencies

**Open Terminal and run:**

```bash
cd /Users/andy.ackerman/snackconnect/backend
npm install
```

**What this does:**
- Installs all required packages (express, bcrypt, jwt, etc.)
- Creates `node_modules/` folder

**Expected output:**
```
added 150 packages in 10s
```

---

## STEP 2: Start the Backend Server

**In the same terminal, run:**

```bash
node server.js
```

**What this does:**
- Starts the backend server on port 3000
- Creates database file at `backend/data/database.json`
- Server listens for requests

**Expected output:**
```
✅ Data directory ready: /path/to/backend/data
✅ New database created for permanent storage: /path/to/database.json
Server running on http://localhost:3000
✅ Email service configured successfully
```

**Keep this terminal open!** The server must stay running.

---

## STEP 3: Verify Database File Created

**Open a new terminal window and check:**

```bash
cd /Users/andy.ackerman/snackconnect/backend
ls -la data/
cat data/database.json
```

**What you should see:**
- File `database.json` exists
- Contains: `{"users":[], "messages":[], ...}`

**If file doesn't exist:**
- Go back to Step 2 and make sure server started successfully
- Check for error messages in the server terminal

---

## STEP 4: Test Account Creation (Local)

**Open your browser and go to:**

```
http://localhost:3000/signup.html
```

**OR if you have the file locally:**

- Open `snackconnect/signup.html` in your browser
- The page will automatically connect to `http://localhost:3000/api`

**Create a test account:**
1. Fill out the signup form
2. Click "Sign Up"
3. You should see a success message

**Check the server terminal - you should see:**
```
Registration request received: { name: '...', email: '...' }
✅ User account permanently saved: user@example.com
✅ Database now contains: 1 total accounts
```

---

## STEP 5: Verify Account in Database

**In a new terminal, check the database:**

```bash
cd /Users/andy.ackerman/snackconnect/backend
cat data/database.json | grep -A 10 "email"
```

**What you should see:**
- Your account data with email, name, companyName, etc.
- Password is hashed (not visible)

**OR open the file:**
```bash
open data/database.json
```

You should see your account in the `users` array.

---

## STEP 6: Access Admin Dashboard

**Open your browser and go to:**

```
http://localhost:3000/admin-dashboard.html
```

**OR if you have the file locally:**

- Open `snackconnect/admin-dashboard.html` in your browser

**Login with admin credentials:**
- **Email:** `snackreach1@gmail.com`
- **Password:** `Greylock21`

**Click "Login"**

---

## STEP 7: View Accounts in Admin Dashboard

**After logging in:**

1. You should see the dashboard
2. Click "All Accounts" or wait for it to load
3. You should see your test account in the table

**If accounts don't appear:**

1. **Check browser console (F12):**
   - Look for errors in Console tab
   - Check Network tab for failed requests

2. **Check server terminal:**
   - Should see: `Admin accounts request received`
   - Should see: `✅ Total users in database: 1`

3. **Click "Refresh" button** in admin dashboard

---

## STEP 8: Test Persistence (Restart Server)

**To verify accounts persist:**

1. **Stop the server:**
   - Go to terminal where server is running
   - Press `Ctrl + C`

2. **Restart the server:**
   ```bash
   cd /Users/andy.ackerman/snackconnect/backend
   node server.js
   ```

3. **Check server logs:**
   ```
   ✅ Existing database loaded: /path/to/database.json
   ✅ Permanent accounts found: 1
   ```

4. **Refresh admin dashboard:**
   - Account should still be there!

---

## STEP 9: Set Up Railway (Production)

**For production deployment:**

### 9a. Push to GitHub
```bash
cd /Users/andy.ackerman/snackconnect
git add .
git commit -m "Ready for Railway deployment"
git push
```

### 9b. Configure Railway

1. **Go to Railway Dashboard:**
   - https://railway.app/
   - Select your project

2. **Add Environment Variables:**
   - Go to: Project → Variables
   - Add these:
     ```
     JWT_SECRET=your-secret-key-here
     NODE_ENV=production
     PORT=3000
     ```

3. **Railway Auto-Deploys:**
   - Railway will automatically deploy from GitHub
   - Watch deployment logs

### 9c. Get Your Railway URL

1. **In Railway dashboard:**
   - Go to your service
   - Click "Settings"
   - Note your domain (e.g., `snackreach-production.up.railway.app`)

2. **Update frontend files:**
   - Replace `snackreach-production.up.railway.app` with your actual Railway domain
   - Or use relative paths (they auto-detect)

---

## STEP 10: Test on Railway

1. **Create account on Railway:**
   - Go to: `https://your-railway-domain.up.railway.app/signup.html`
   - Create a test account

2. **Check admin dashboard on Railway:**
   - Go to: `https://your-railway-domain.up.railway.app/admin-dashboard.html`
   - Login with admin credentials
   - Should see your account

---

## Troubleshooting

### Problem: Server won't start

**Check:**
```bash
cd backend
node --version  # Should be v14 or higher
npm install     # Reinstall dependencies
```

**Error: Port 3000 already in use**
```bash
# Find what's using port 3000
lsof -i :3000
# Kill it or change PORT in server.js
```

### Problem: Accounts not saving

**Check:**
1. Server terminal shows: `✅ Database written successfully`
2. File permissions: `chmod 755 backend/data/`
3. Database file exists: `ls -la backend/data/database.json`

### Problem: Admin dashboard shows "No accounts"

**Check:**
1. You're logged in as admin (check localStorage)
2. Server is running
3. Browser console for errors
4. Network tab shows successful API call
5. Database file has accounts: `cat backend/data/database.json`

### Problem: Can't connect to backend

**Check:**
1. Server is running (`node server.js`)
2. No firewall blocking port 3000
3. Correct API URL in browser console
4. CORS is enabled (it is by default)

---

## Quick Reference Commands

**Start server:**
```bash
cd /Users/andy.ackerman/snackconnect/backend
node server.js
```

**Check database:**
```bash
cat backend/data/database.json
```

**View accounts count:**
```bash
cat backend/data/database.json | grep -c "email"
```

**Check server logs:**
- Look at terminal where `node server.js` is running

**Reset database (if needed):**
```bash
rm backend/data/database.json
# Restart server - it will create a new one
```

---

## Summary

✅ **Step 1:** Install dependencies (`npm install`)
✅ **Step 2:** Start server (`node server.js`)
✅ **Step 3:** Verify database file exists
✅ **Step 4:** Create test account via signup page
✅ **Step 5:** Verify account in database file
✅ **Step 6:** Login to admin dashboard
✅ **Step 7:** View accounts in admin dashboard
✅ **Step 8:** Test persistence (restart server)
✅ **Step 9:** Deploy to Railway (production)
✅ **Step 10:** Test on Railway

**Once complete, accounts will:**
- ✅ Be created when users sign up
- ✅ Be saved permanently to database
- ✅ Appear in admin dashboard
- ✅ Persist across server restarts
- ✅ Work on both local and Railway

---

## Need Help?

Check these files for more details:
- `BACKEND-CONNECTION-GUIDE.md` - Detailed technical guide
- Server logs - Check terminal where server is running
- Browser console - Press F12, check Console tab
- Network tab - Press F12, check Network tab for API calls

