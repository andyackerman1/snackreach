# Exact Steps: Where to Install the Package

## Step 1: Open Terminal

### On Mac:
1. Press `Cmd + Space` (Command key + Spacebar)
2. Type "Terminal"
3. Press Enter
4. Terminal window opens

### On Windows:
1. Press `Windows key + R`
2. Type "cmd"
3. Press Enter
4. Command Prompt opens

---

## Step 2: Navigate to the Backend Folder

Type this EXACT command and press Enter:

```bash
cd /Users/andy.ackerman/snackconnect/backend
```

**What this does:** Changes directory to the backend folder where package.json is located.

**Expected result:** Your terminal prompt should show something like:
```
/Users/andy.ackerman/snackconnect/backend %
```
or
```
/Users/andy.ackerman/snackconnect/backend$
```

---

## Step 3: Verify You're in the Right Place

Type this command and press Enter:

```bash
ls
```

**On Windows, use:**
```bash
dir
```

**What you should see:**
- `package.json` ← This file must be here!
- `server.js`
- `supabase.js`
- Other files...

**If you don't see `package.json`:**
- You're in the wrong folder
- Go back to Step 2 and make sure you typed the path correctly

---

## Step 4: Install the Package

Type this EXACT command and press Enter:

```bash
npm install
```

**What this does:** Installs all packages listed in package.json, including the new Supabase package.

**Expected output:** You'll see something like:
```
npm WARN deprecated ...
added 245 packages in 15s
```

**Wait for it to finish!** This may take 30 seconds to 2 minutes.

**When it's done:** You should see your terminal prompt again (no errors).

---

## Step 5: Verify Installation

Type this command:

```bash
ls node_modules/@supabase
```

**What you should see:**
- `supabase-js` folder

**This confirms:** Supabase package was installed successfully!

---

## Alternative: Install from Finder/Files

### On Mac:
1. Open **Finder**
2. Navigate to: `/Users/andy.ackerman/snackconnect/backend`
3. Right-click on the `backend` folder
4. Select **"New Terminal at Folder"** (if available)
5. Terminal opens in that folder
6. Type: `npm install`

### On Windows:
1. Open **File Explorer**
2. Navigate to: `C:\Users\andy.ackerman\snackconnect\backend` (or wherever your project is)
3. In the address bar, type: `cmd` and press Enter
4. Command Prompt opens in that folder
5. Type: `npm install`

---

## Visual Guide

### Your Folder Structure Should Look Like This:
```
snackconnect/
├── backend/
│   ├── package.json  ← This file must be here!
│   ├── server.js
│   ├── supabase.js
│   └── node_modules/  ← This folder is created after npm install
│       └── @supabase/
│           └── supabase-js/
└── (other files...)
```

### You Need to Be Here:
```
✅ /Users/andy.ackerman/snackconnect/backend
```

### NOT Here:
```
❌ /Users/andy.ackerman/snackconnect
❌ /Users/andy.ackerman
❌ /Users
```

---

## Complete Command Sequence

Copy and paste these commands ONE AT A TIME:

```bash
cd /Users/andy.ackerman/snackconnect/backend
```

Press Enter, then:

```bash
npm install
```

Press Enter and wait for it to finish.

---

## Troubleshooting

### "No such file or directory"
- **Problem:** The path is wrong
- **Fix:** Check that the folder exists: `ls /Users/andy.ackerman/snackconnect/backend`
- **Fix:** Navigate step by step:
  ```bash
  cd /Users/andy.ackerman
  cd snackconnect
  cd backend
  ```

### "package.json not found"
- **Problem:** You're not in the backend folder
- **Fix:** Use `pwd` (Mac/Linux) or `cd` (Windows) to see where you are
- **Fix:** Navigate to the correct folder (Step 2)

### "npm: command not found"
- **Problem:** Node.js/npm is not installed
- **Fix:** Install Node.js from: https://nodejs.org/
- **Fix:** After installing, restart your terminal

### "Permission denied"
- **Problem:** Need admin permissions
- **Fix:** On Mac/Linux, don't use `sudo` - npm install should work without it
- **Fix:** If needed, check folder permissions

---

## Quick Check: Are You Ready?

Before running `npm install`, verify:

1. ✅ You're in Terminal/Command Prompt
2. ✅ You've navigated to: `/Users/andy.ackerman/snackconnect/backend`
3. ✅ You can see `package.json` file (use `ls` or `dir`)
4. ✅ You have internet connection (npm needs to download packages)

If all 4 are ✅, you're ready to run `npm install`!

---

## Summary

**Where to install:** In the `backend` folder

**Full path:** `/Users/andy.ackerman/snackconnect/backend`

**Command to navigate:**
```bash
cd /Users/andy.ackerman/snackconnect/backend
```

**Command to install:**
```bash
npm install
```

That's it! The package will be installed in the `backend` folder.



