# Troubleshooting Admin Login

## Common Issues

### 1. "Invalid Credentials" Error

**Check:**
- Email must be exactly: `snackreach1@gmail.com` (case-sensitive)
- Password must be exactly: `Greylock21` (case-sensitive)
- No extra spaces before or after

**Try:**
1. Copy and paste the credentials exactly
2. Check browser console (F12) for detailed error messages
3. Verify the server has the latest code deployed

### 2. "Connection Error" Error

**Local (localhost:3000):**
- Make sure the server is running: `cd backend && node server.js`
- Check if port 3000 is in use
- Try: `http://localhost:3000/api/health` - should return `{"status":"ok"}`

**Railway:**
- Wait a few minutes after pushing code for Railway to deploy
- Check Railway logs for deployment status
- Verify the Railway URL is correct

### 3. Testing the Login Endpoint

**Local:**
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"snackreach1@gmail.com","password":"Greylock21"}'
```

Should return: `{"message":"Admin login successful","token":"..."}`

**Railway:**
```bash
curl -X POST https://snackreach-production.up.railway.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"snackreach1@gmail.com","password":"Greylock21"}'
```

## Quick Fixes

### If Local Server Won't Start:
1. Check if port 3000 is free: `lsof -i :3000`
2. Kill existing process if needed: `kill -9 <PID>`
3. Restart: `cd backend && node server.js`

### If Railway Not Working:
1. Check Railway dashboard → Deployments
2. Look for errors in Railway logs
3. Make sure environment variables aren't overriding credentials:
   - Remove `ADMIN_EMAIL` and `ADMIN_PASSWORD` if you want to use defaults

### Check Browser Console:
- Open browser DevTools (F12)
- Look at Console tab for error messages
- Look at Network tab to see if API calls are being made
- Check if CORS errors appear

## Correct Credentials

**Email:** `snackreach1@gmail.com`  
**Password:** `Greylock21`

## Verify Server is Running

**Health Check:**
- Local: `http://localhost:3000/api/health`
- Railway: `https://snackreach-production.up.railway.app/api/health`

Should return: `{"status":"ok","message":"SnackReach API is running"}`

