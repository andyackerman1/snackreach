# 🚀 INSTALL NODE.JS AND START SERVER

## Step 1: Install Node.js

**You MUST install Node.js first!** The server won't run without it.

1. **Go to:** https://nodejs.org/
2. **Click:** "Download Node.js (LTS)" - the green button
3. **Install:** Run the downloaded installer (.pkg file on Mac)
4. **Restart:** Close and reopen your Terminal app

## Step 2: Verify Installation

Open Terminal and type:
```bash
node --version
```

You should see something like: `v18.17.0` or higher

If you see an error, Node.js isn't installed yet. Go back to Step 1.

## Step 3: Start the Server

Once Node.js is installed, run these commands in Terminal:

```bash
cd /Users/andy.ackerman/snackconnect/backend
npm install
node server.js
```

You should see:
```
🚀 SnackReach API server running on port 3000
🌐 Main site: http://localhost:3000/
```

## Step 4: Open Browser

Once you see the server running message, open your browser and go to:
**http://localhost:3000**

## Troubleshooting

### "command not found: node"
→ Node.js isn't installed. Go to Step 1.

### "npm: command not found"
→ Node.js isn't installed. Go to Step 1.

### "Port 3000 is already in use"
→ Another program is using port 3000. Close it or use:
```bash
lsof -ti:3000 | xargs kill -9
```

### "Cannot find module"
→ Run `npm install` again in the backend folder

## Alternative: Use Railway Production Site

If you don't want to install Node.js locally, you can use the production site:
**https://snackreach-production.up.railway.app/**

This works without installing anything on your computer!

