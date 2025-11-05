# How to Start the Local Server

## Prerequisites

You need Node.js installed on your computer. If you don't have it:

1. **Install Node.js:**
   - Go to https://nodejs.org/
   - Download and install the LTS version (v18 or later)
   - Restart your terminal after installation

2. **Verify Installation:**
   ```bash
   node --version
   npm --version
   ```

## Starting the Server

### Option 1: Use the Start Script (Easiest)

```bash
cd /Users/andy.ackerman/snackconnect
./start-server.sh
```

### Option 2: Manual Start

1. **Install dependencies (first time only):**
   ```bash
   cd /Users/andy.ackerman/snackconnect/backend
   npm install
   ```

2. **Start the server:**
   ```bash
   cd /Users/andy.ackerman/snackconnect/backend
   node server.js
   ```

3. **Or use npm:**
   ```bash
   cd /Users/andy.ackerman/snackconnect/backend
   npm start
   ```

## Server URLs

Once the server is running, you can access:

- **Main Site:** http://localhost:3000/
- **Login:** http://localhost:3000/login.html
- **Signup:** http://localhost:3000/signup.html
- **Owner Login:** http://localhost:3000/owner-login.html
- **API:** http://localhost:3000/api/health

## Troubleshooting

### Port Already in Use

If you get "Port 3000 is already in use":
```bash
# Find what's using port 3000
lsof -ti:3000

# Kill the process (replace PID with the number from above)
kill -9 PID
```

### Dependencies Not Installing

If `npm install` fails:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Server Won't Start

Check the error messages in the terminal. Common issues:
- Missing dependencies: Run `npm install` again
- Port conflict: Use a different port by setting `PORT=8080` in `.env`
- Database errors: Check that the `backend/data` directory exists and is writable

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

