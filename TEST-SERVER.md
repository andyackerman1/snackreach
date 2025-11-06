# How to Test Your Server

Simple steps to test that everything is working.

---

## Step 1: Start Your Server

Open Terminal and run:
```bash
cd /Users/andy.ackerman/snackconnect/backend
node server.js
```

You should see:
```
✅ Clerk initialized successfully
🚀 SnackReach API server running on port 3000
```

**Keep this terminal window open** - your server is running!

---

## Step 2: Test in Your Browser

### Test 1: Health Check
Open your browser and go to:
```
http://localhost:3000/api/health
```

You should see:
```json
{"status":"ok","message":"SnackReach API is running"}
```

### Test 2: Database Status
Go to:
```
http://localhost:3000/api/database-status
```

You should see your Clerk users listed.

### Test 3: Homepage
Go to:
```
http://localhost:3000/
```

You should see your SnackReach homepage.

### Test 4: Signup Page
Go to:
```
http://localhost:3000/signup.html
```

You should see the signup form.

### Test 5: Login Page
Go to:
```
http://localhost:3000/login.html
```

You should see the login form.

---

## Step 3: Test User Registration

### Option A: Use Your Website
1. Go to: `http://localhost:3000/signup.html`
2. Fill out the form:
   - Choose "Food Startup" or "Office Manager"
   - Enter your name
   - Enter an email (like `test@example.com`)
   - Enter a password (at least 6 characters)
   - Enter company name
   - Accept terms
3. Click "Create Account"
4. You should be redirected to your dashboard!

### Option B: Use Terminal (curl)
Open a **new terminal window** (keep server running) and run:

```bash
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

You should see:
```json
{
  "message": "User registered successfully. Please sign in.",
  "user": {
    "id": "user_2abc123...",
    "email": "test@example.com",
    ...
  }
}
```

---

## Step 4: Verify in Clerk Dashboard

1. Go to: **https://dashboard.clerk.com**
2. Click **"Users"** in the left sidebar
3. You should see your test user!

---

## Step 5: Test Login

1. Go to: `http://localhost:3000/login.html`
2. Enter the email and password you used to sign up
3. Click "Sign In"
4. You should be redirected to your dashboard!

---

## Quick Test Checklist

- [ ] Server starts without errors
- [ ] `/api/health` returns OK
- [ ] `/api/database-status` shows Clerk connection
- [ ] Homepage loads
- [ ] Signup page loads
- [ ] Login page loads
- [ ] Can create a test account
- [ ] User appears in Clerk Dashboard
- [ ] Can log in with test account

---

## If Something Doesn't Work

### Server won't start?
- Check that you're in the right directory: `cd /Users/andy.ackerman/snackconnect/backend`
- Check for error messages in the terminal

### Can't access pages?
- Make sure server is running (you should see "🚀 SnackReach API server running")
- Try: `http://localhost:3000` (not 3001 or other ports)

### Registration fails?
- Check server logs in the terminal
- Make sure Clerk key is set in `.env` file
- Check that all required fields are filled

### Login doesn't work?
- Make sure you created the account first
- Check that email/password are correct
- Check browser console for errors (F12 → Console)

---

## That's It!

If all tests pass, your server is working perfectly! 🎉


