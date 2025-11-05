# 🚀 SnackReach Setup Guide

## Quick Start (3 Steps)

### Step 1: Install Node.js (One-time setup)

**Option A - Download from website:**
1. Go to: https://nodejs.org/
2. Click "Download Node.js (LTS)" - the green button
3. Open the downloaded file and follow the installer
4. Restart your terminal after installation

**Option B - Using Homebrew (if you have it):**
```bash
brew install node
```

**Verify installation:**
```bash
node --version
npm --version
```

### Step 2: Start the Backend

**Easy way (using the script):**
```bash
cd /Users/andy.ackerman/snackconnect/backend
./start.sh
```

**Or manually:**
```bash
cd /Users/andy.ackerman/snackconnect/backend
npm install
npm start
```

You should see:
```
🚀 SnackReach API server running on http://localhost:3000
```

### Step 3: Open the Frontend

1. Open `index.html` in your browser
   - Double-click the file, or
   - Right-click → Open With → Your Browser

2. The website will automatically connect to the backend at `http://localhost:3000`

## ✅ Verify Backend is Running

Open in your browser:
```
http://localhost:3000/api/health
```

You should see:
```json
{"status":"ok","message":"SnackReach API is running"}
```

## 🎯 What You Can Do Now

1. **Sign Up** - Create a new account (snack company or office)
2. **Login** - Access your dashboard
3. **Manage Profile** - Update your information
4. **Discover** - Find offices (if snack company) or products (if office)
5. **Message** - Connect with other users
6. **Manage Subscription** - Update or cancel your $2/month plan

## 📍 Backend Links

- **API Base:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/api/health
- **All Endpoints:** See `backend/README.md`

## 🛑 Stop the Server

Press `Ctrl+C` in the terminal where the server is running

## ❓ Troubleshooting

**Port already in use?**
- Change port in `backend/server.js` line 11:
  ```javascript
  const PORT = process.env.PORT || 3001; // Change 3000 to 3001
  ```

**Can't find npm?**
- Make sure Node.js is installed
- Restart your terminal after installing Node.js
- Try: `/usr/local/bin/npm` or `/opt/homebrew/bin/npm`

**Server won't start?**
- Make sure you're in the backend directory
- Run `npm install` first
- Check for error messages in the terminal

## 📞 Need Help?

The backend creates a database file at:
`backend/data/database.json`

All your data is stored there locally!




