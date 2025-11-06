# Clear Step-by-Step: Connect Project to Supabase

Follow these exact steps in order. Don't skip any step.

---

## Step 1: Open Terminal

**On Mac:**
- Press `Cmd + Space` (Command key + Spacebar)
- Type: `Terminal`
- Press Enter

**On Windows:**
- Press `Windows key + R`
- Type: `cmd`
- Press Enter

---

## Step 2: Navigate to Backend Folder

In Terminal, type this EXACT command:

```bash
cd /Users/andy.ackerman/snackconnect/backend
```

Press Enter.

**Check you're in the right place:**
Type this command:
```bash
pwd
```
Press Enter.

**You should see:**
```
/Users/andy.ackerman/snackconnect/backend
```

If you see something different, try the `cd` command again.

---

## Step 3: Verify Files Are There

Type this command:
```bash
ls
```
Press Enter.

**You should see:**
- `package.json`
- `server.js`
- `supabase.js`
- Other files...

**If you don't see these files:**
- You're in the wrong folder
- Go back to Step 2

---

## Step 4: Install Supabase Package

Type this EXACT command:
```bash
npm install
```

Press Enter.

**Wait for it to finish.** This takes 1-2 minutes.

**You'll see lines like:**
```
added 245 packages in 15s
```

**When you see your terminal prompt again** (the `$` or `%`), it's done.

---

## Step 5: Verify Supabase Package Installed

Type this command:
```bash
ls node_modules/@supabase
```

Press Enter.

**You should see:**
- `supabase-js` folder

**If you see "No such file":**
- Go back to Step 4 and run `npm install` again
- Make sure you're in the backend folder

---

## Step 6: Check Supabase Connection File

Type this command:
```bash
cat supabase.js
```

Press Enter.

**You should see:**
- Your Supabase URL: `https://pplhyetnwyywucdxwkbu.supabase.co`
- Your Supabase key

**If you see an error:**
- The file doesn't exist
- We need to create it

---

## Step 7: Start Your Server

Type this EXACT command:
```bash
node server.js
```

Press Enter.

**What you should see:**
```
🔌 Connecting to Supabase...
✅ Supabase connected successfully
✅ Supabase database ready (0 users in database)
Server running on port 3000
```

**If you see errors:**
- Make sure you completed Step 4 (npm install)
- Make sure you created the users table in Supabase
- Check the error message and tell me what it says

**Keep this terminal window open!** Your server is now running.

---

## Step 8: Open a NEW Terminal Window

**Don't close the server terminal!**

**Open a NEW terminal window** (repeat Step 1).

**In the NEW terminal, navigate to backend folder again:**
```bash
cd /Users/andy.ackerman/snackconnect/backend
```

Press Enter.

---

## Step 9: Create a Test Account

In the NEW terminal window, type this EXACT command:

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

Press Enter.

**What you should see:**
JSON response with:
- `"message": "User registered successfully"`
- `"token": "..."` (a long string)
- `"user": {...}` (user information)

**If you see an error:**
- Make sure the server is still running (Step 7)
- Make sure you're using the NEW terminal window
- Check the error message

---

## Step 10: Check Server Terminal

Look at the terminal where your server is running (from Step 7).

**You should see messages like:**
```
📝 Adding new user to Supabase: test@example.com startup
✅ VERIFIED: User account saved to Supabase: test@example.com
```

**This confirms the account was saved!**

---

## Step 11: Verify Account in Supabase

1. **Open your web browser**
2. **Go to:** https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu
3. **Click:** "Table Editor" (in left sidebar)
4. **Click:** "users" table
5. **You should see your test account!** ✅

**If you see the account:**
- ✅ Everything is working!
- ✅ Your project is connected!
- ✅ Accounts are saving to Supabase!

**If you don't see the account:**
- Wait 10 seconds and refresh the page
- Check the server terminal for errors
- Make sure the table name is exactly `users` (lowercase)

---

## Step 12: Test Login

In your NEW terminal window (from Step 8), type:

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

Press Enter.

**You should see:**
- JSON with a token
- `"message": "Login successful"`

**This confirms login works!**

---

## ✅ You're Done!

Your project is now connected to Supabase!

**What works now:**
- ✅ Users can create accounts → saved to Supabase
- ✅ Users can log in → reads from Supabase
- ✅ You can view accounts → Supabase Dashboard

---

## Quick Reference

**Start Server:**
```bash
cd /Users/andy.ackerman/snackconnect/backend
node server.js
```

**Create Account (in new terminal):**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your@email.com",
    "password": "yourpassword",
    "companyName": "Your Company",
    "userType": "startup"
  }'
```

**View Accounts:**
- Browser → https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu
- Click "Table Editor" → "users"

---

## Troubleshooting

### Step 4: "npm: command not found"
- **Problem:** Node.js not installed
- **Fix:** Install Node.js from https://nodejs.org/
- **Fix:** Restart terminal after installing

### Step 4: "Permission denied"
- **Problem:** Folder permissions
- **Fix:** Make sure you're in the correct folder
- **Fix:** Don't use `sudo`

### Step 7: "Cannot find module '@supabase/supabase-js'"
- **Problem:** Package not installed
- **Fix:** Go back to Step 4, run `npm install` again
- **Fix:** Make sure you're in the backend folder

### Step 7: "Table 'users' does not exist"
- **Problem:** Table not created in Supabase
- **Fix:** Go back to Supabase and create the users table
- **Fix:** Make sure table name is exactly `users` (lowercase)

### Step 7: "Port 3000 already in use"
- **Problem:** Another server running
- **Fix:** Close other terminal windows
- **Fix:** Or find and close the process using port 3000

### Step 9: "Connection refused"
- **Problem:** Server not running
- **Fix:** Make sure Step 7 is still running (server terminal)
- **Fix:** Check server terminal for errors

### Step 11: Account not showing in Supabase
- **Problem:** Account not saved
- **Fix:** Check server terminal for errors
- **Fix:** Refresh Supabase dashboard
- **Fix:** Verify table name is `users` (not `Users` or `USERS`)

---

## Checklist

Before you start, make sure:
- [ ] You created the `users` table in Supabase (previous steps)
- [ ] You have Terminal/Command Prompt open
- [ ] You know where your project folder is

After completing all steps:
- [ ] Step 1: Terminal opened
- [ ] Step 2: Navigated to backend folder
- [ ] Step 3: Verified files exist
- [ ] Step 4: Installed npm package
- [ ] Step 5: Verified package installed
- [ ] Step 6: Checked supabase.js file
- [ ] Step 7: Started server (still running)
- [ ] Step 8: Opened new terminal
- [ ] Step 9: Created test account
- [ ] Step 10: Checked server terminal
- [ ] Step 11: Verified account in Supabase
- [ ] Step 12: Tested login

**If all checked, you're connected!** 🎉

---

## Summary

**The connection is automatic!** Once you:
1. Install the package (Step 4)
2. Start the server (Step 7)
3. Create accounts (Step 9)

**Everything is connected!** Accounts automatically save to Supabase.

No additional configuration needed - it's all set up in the code already!



