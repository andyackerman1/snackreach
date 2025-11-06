# Exact Locations: Connect SnackReach to Supabase Table

You have the table created. Now follow these exact steps to connect your project.

---

## Step 1: Open Terminal on Your Computer

**WHERE TO GO:**
- **On Mac:** 
  - Click the **Finder icon** (smiley face in dock)
  - Click **Applications** in left sidebar
  - Open **Utilities** folder
  - Double-click **Terminal**
  
- **On Windows:**
  - Click **Start Menu** (Windows icon)
  - Type: `cmd`
  - Press Enter
  - **Command Prompt** opens

**WHAT YOU SEE:** A black or white window with text cursor

---

## Step 2: Navigate to Your Project Folder in Terminal

**IN TERMINAL WINDOW:**
Type this EXACT command:
```bash
cd /Users/andy.ackerman/snackconnect/backend
```

**Press Enter** on your keyboard.

**WHAT HAPPENS:** Terminal changes to the backend folder

**VERIFY YOU'RE IN RIGHT PLACE:**
Type this command:
```bash
pwd
```
Press Enter.

**YOU SHOULD SEE:**
```
/Users/andy.ackerman/snackconnect/backend
```

If you see this, you're in the right place! ✅

---

## Step 3: Check if Files Exist

**IN TERMINAL WINDOW:**
Type this command:
```bash
ls
```

**Press Enter.**

**YOU SHOULD SEE:**
- `package.json`
- `server.js`
- `supabase.js`
- `node_modules` (folder)
- Other files

**IF YOU DON'T SEE THESE:**
- You're in the wrong folder
- Go back to Step 2 and make sure you typed the path correctly

---

## Step 4: Install the Supabase Package

**IN TERMINAL WINDOW:**
Type this EXACT command:
```bash
npm install
```

**Press Enter.**

**WHAT HAPPENS:**
- You'll see text scrolling
- Packages being downloaded
- Takes 1-2 minutes

**WHEN IT'S DONE:**
- Text stops scrolling
- You see your terminal prompt again (like `%` or `$`)
- Should see message like: `added 245 packages`

**DON'T CLOSE TERMINAL** - keep it open!

---

## Step 5: Verify Supabase Package Installed

**IN TERMINAL WINDOW:**
Type this command:
```bash
ls node_modules/@supabase
```

**Press Enter.**

**YOU SHOULD SEE:**
- `supabase-js` (folder name)

**IF YOU SEE "No such file":**
- Go back to Step 4
- Run `npm install` again
- Wait for it to finish

---

## Step 6: Start Your Server

**IN THE SAME TERMINAL WINDOW:**
Type this EXACT command:
```bash
node server.js
```

**Press Enter.**

**WHAT YOU SHOULD SEE:**
```
🔌 Connecting to Supabase...
✅ Supabase connected successfully
✅ Supabase database ready (0 users in database)
Server running on port 3000
```

**IMPORTANT:**
- Keep this terminal window open
- Don't close it
- The server is now running
- You'll see messages here when accounts are created

**IF YOU SEE ERRORS:**
- Make sure you completed Step 4 (npm install)
- Make sure you created the users table in Supabase
- Check what the error message says

---

## Step 7: Open a NEW Terminal Window

**WHERE TO GO:**
- **On Mac:**
  - Press `Cmd + N` (Command + N) in Terminal
  - OR: Click **Terminal** menu → **New Window**
  - OR: Open Terminal again (repeat Step 1)

- **On Windows:**
  - Press `Windows + R`
  - Type: `cmd`
  - Press Enter

**WHAT YOU HAVE NOW:**
- Terminal 1: Server running (don't close!)
- Terminal 2: New terminal for commands

---

## Step 8: Navigate to Backend Folder in NEW Terminal

**IN THE NEW TERMINAL WINDOW:**
Type this command:
```bash
cd /Users/andy.ackerman/snackconnect/backend
```

**Press Enter.**

---

## Step 9: Create a Test Account

**IN THE NEW TERMINAL WINDOW:**
Copy this ENTIRE command (all lines):

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

**Paste it into Terminal** (right-click → Paste, or Cmd+V / Ctrl+V)

**Press Enter.**

**WHAT YOU SHOULD SEE:**
JSON response like:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGci...",
  "user": {
    "id": "1234567890",
    "name": "Test User",
    "email": "test@example.com",
    ...
  }
}
```

**IF YOU SEE ERRORS:**
- Make sure Terminal 1 (server) is still running
- Make sure you're in the NEW terminal window
- Check the error message

---

## Step 10: Check Server Terminal

**LOOK AT TERMINAL 1** (where server is running)

**YOU SHOULD SEE:**
```
📝 Adding new user to Supabase: test@example.com startup
✅ VERIFIED: User account saved to Supabase: test@example.com
✅ Account ID: 1234567890
```

**This confirms the account was saved to Supabase!**

---

## Step 11: View Account in Supabase Dashboard

**WHERE TO GO:**
1. Open your web browser (Chrome, Safari, Firefox, etc.)
2. Go to this URL: https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu
3. Log in if prompted

**IN SUPABASE DASHBOARD:**
1. Look at the **left sidebar**
2. Click on **"Table Editor"** (it has a table icon)
3. Click on **"users"** table (should be in the list)
4. **You should see your test account!** ✅

**WHAT YOU'LL SEE:**
- A table with columns: id, name, email, company_name, user_type, etc.
- Your test account row with all the information

**IF YOU DON'T SEE THE ACCOUNT:**
- Wait 10 seconds and refresh the page (F5 or Cmd+R)
- Check Terminal 1 for error messages
- Make sure table name is exactly `users` (lowercase)

---

## Step 12: Test Login (Optional)

**IN TERMINAL 2** (the new terminal window):

Type this command:
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Press Enter.**

**YOU SHOULD SEE:**
- JSON with a token
- `"message": "Login successful"`

**This confirms login works and reads from Supabase!**

---

## ✅ You're Connected!

**What you've done:**
- ✅ Installed Supabase package
- ✅ Started server (connected to Supabase)
- ✅ Created test account (saved to Supabase)
- ✅ Verified account in Supabase dashboard
- ✅ Tested login (reads from Supabase)

**Your project is now connected!** All new accounts will automatically save to Supabase.

---

## Visual Guide: Where to Go

### Terminal Window 1 (Server):
```
Terminal 1
├── Location: /Users/andy.ackerman/snackconnect/backend
├── Command: node server.js
└── Status: Running (keep open!)
```

### Terminal Window 2 (Commands):
```
Terminal 2
├── Location: /Users/andy.ackerman/snackconnect/backend
├── Commands: curl commands to test
└── Status: For running test commands
```

### Browser (Supabase Dashboard):
```
Browser
├── URL: https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu
├── Navigation: Table Editor → users
└── Purpose: View accounts
```

---

## Quick Reference: Where to Go

**To Install Package:**
- WHERE: Terminal Window
- FOLDER: `/Users/andy.ackerman/snackconnect/backend`
- COMMAND: `npm install`

**To Start Server:**
- WHERE: Terminal Window (same one)
- FOLDER: `/Users/andy.ackerman/snackconnect/backend`
- COMMAND: `node server.js`
- KEEP OPEN: Yes!

**To Create Account:**
- WHERE: NEW Terminal Window
- FOLDER: `/Users/andy.ackerman/snackconnect/backend`
- COMMAND: `curl -X POST http://localhost:3000/api/register ...`

**To View Accounts:**
- WHERE: Web Browser
- URL: https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu
- NAVIGATION: Table Editor → users

---

## Troubleshooting: Where to Check

**If package won't install:**
- WHERE: Terminal Window
- CHECK: Are you in `/Users/andy.ackerman/snackconnect/backend`?
- COMMAND: `pwd` to check location

**If server won't start:**
- WHERE: Terminal Window (where you ran `node server.js`)
- CHECK: Error messages shown
- COMMON: "Cannot find module" = need to run `npm install`

**If account doesn't appear in Supabase:**
- WHERE: Browser (Supabase Dashboard)
- CHECK: Table Editor → users table
- CHECK: Terminal 1 (server) for error messages
- FIX: Refresh Supabase page (F5)

---

## Summary

**3 Places You'll Be Working:**

1. **Terminal Window 1:**
   - Install package: `npm install`
   - Start server: `node server.js`
   - Keep running!

2. **Terminal Window 2:**
   - Create accounts: `curl` commands
   - Test login: `curl` commands

3. **Web Browser:**
   - View accounts: Supabase Dashboard → Table Editor → users

**That's it!** Follow these exact locations and you'll be connected! 🎉



