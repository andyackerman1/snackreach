# Test Your Local Server

Since Railway isn't working, let's test everything locally first.

---

## Step 1: Start Your Local Server

Open Terminal and run:

```bash
cd /Users/andy.ackerman/snackconnect/backend
node server.js
```

**Keep this terminal window open!** You should see:
```
✅ Clerk initialized successfully
🚀 SnackReach API server running on port 3000
```

---

## Step 2: Test in Your Browser

### Test 1: Health Check
Open your browser and go to:
```
http://localhost:3000/api/health
```

Should show: `{"status":"ok","message":"SnackReach API is running"}`

### Test 2: Homepage
```
http://localhost:3000/
```

Should show your SnackReach homepage.

### Test 3: Signup Page
```
http://localhost:3000/signup.html
```

Should show the signup form.

### Test 4: Login Page
```
http://localhost:3000/login.html
```

Should show the login form.

---

## Step 3: Test User Registration

1. Go to: `http://localhost:3000/signup.html`
2. Fill out the form:
   - Choose "Food Startup" or "Office Manager"
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "test123456"
   - Company: "Test Company"
   - Accept terms
3. Click "Create Account"
4. Should redirect to dashboard!

---

## Step 4: Verify in Clerk

1. Go to: https://dashboard.clerk.com
2. Click "Users"
3. You should see your test user!

---

## Step 5: Test Login

1. Go to: `http://localhost:3000/login.html`
2. Enter: `test@example.com` / `test123456`
3. Click "Sign In"
4. Should redirect to dashboard!

---

## If Local Works But Railway Doesn't

The issue is likely:
1. **Clerk key not set in Railway** - Add `CLERK_SECRET_KEY` to Railway variables
2. **Railway service not running** - Check Railway dashboard
3. **Wrong Railway URL** - Verify your actual Railway domain

---

## Quick Local Test Commands

Open a **new terminal window** (keep server running) and run:

```bash
# Test health
curl http://localhost:3000/api/health

# Test database status
curl http://localhost:3000/api/database-status

# Test registration
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456",
    "companyName": "Test Company",
    "userType": "office"
  }'
```

---

## Your Local Server URLs

- **Homepage:** http://localhost:3000/
- **Signup:** http://localhost:3000/signup.html
- **Login:** http://localhost:3000/login.html
- **API Health:** http://localhost:3000/api/health
- **API Status:** http://localhost:3000/api/database-status

---

**Start your local server and test these URLs!** 🚀


