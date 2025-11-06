# Clerk Integration - Step by Step Guide

Follow these steps to connect your users to Clerk database.

## Prerequisites Checklist

Before starting, make sure you have:
- [ ] A Clerk account (or create one at https://dashboard.clerk.com)
- [ ] Access to your Supabase dashboard
- [ ] Access to your Railway/backend environment variables
- [ ] Your backend server is running

---

## Step 1: Create Clerk Account & Application

1. Go to **https://dashboard.clerk.com**
2. Sign up for a free account (or log in if you have one)
3. Click **"Create Application"**
4. Enter your application name (e.g., "SnackConnect")
5. Choose your authentication methods (Email/Password is already set up)
6. Click **"Create Application"**

---

## Step 2: Get Your Clerk Secret Key

1. In your Clerk dashboard, go to **"API Keys"** in the left sidebar
2. You'll see two keys:
   - **Publishable Key** (starts with `pk_`) - For frontend
   - **Secret Key** (starts with `sk_`) - For backend
3. Click the **eye icon** next to "Secret Key" to reveal it
4. **Copy the Secret Key** - You'll need this in the next step
5. Keep this tab open - you'll need it again later

**Example:** `sk_test_abc123xyz...`

---

## Step 3: Add Clerk Secret Key to Backend

### For Local Development:

1. Open your terminal
2. Navigate to your backend directory:
   ```bash
   cd /Users/andy.ackerman/snackconnect/backend
   ```
3. Check if `.env` file exists:
   ```bash
   ls -la .env
   ```
4. If it exists, open it. If not, create it:
   ```bash
   touch .env
   ```
5. Open the `.env` file in your editor
6. Add this line (replace with your actual key):
   ```env
   CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
   ```
7. Save the file

### For Railway Production:

1. Go to **Railway Dashboard** (https://railway.app)
2. Select your project
3. Select your service (backend)
4. Click on **"Variables"** tab
5. Click **"+ New Variable"**
6. Enter:
   - **Variable Name:** `CLERK_SECRET_KEY`
   - **Value:** Your Clerk secret key (from Step 2)
7. Click **"Add"**
8. Railway will automatically redeploy your service

---

## Step 4: Update Supabase Database Schema

You need to add a `clerk_id` column to your `users` table to link Clerk users to Supabase.

1. Go to **Supabase Dashboard** (https://supabase.com/dashboard)
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New Query"**
5. Paste this SQL:

```sql
-- Add clerk_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Make clerk_id unique (one Clerk user = one Supabase record)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_clerk_id_unique ON users(clerk_id) WHERE clerk_id IS NOT NULL;
```

6. Click **"Run"** (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

---

## Step 5: Restart Your Backend Server

### Local Development:

1. Stop your server if it's running (Ctrl+C)
2. Restart it:
   ```bash
   cd /Users/andy.ackerman/snackconnect/backend
   node server.js
   ```
3. Look for this message in the logs:
   ```
   ✅ Clerk initialized successfully
   ```
4. If you see this, Clerk is configured correctly!

### Railway Production:

Railway automatically restarts when you add environment variables. Check your Railway logs to see:
```
✅ Clerk initialized successfully
```

---

## Step 6: Test User Registration

Test that Clerk is working by creating a test user:

### Option A: Using curl (Terminal)

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

### Option B: Using Postman/Thunder Client

1. Create a new POST request
2. URL: `http://localhost:3000/api/register`
3. Headers: `Content-Type: application/json`
4. Body (JSON):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123456",
  "companyName": "Test Company",
  "userType": "office"
}
```

### Expected Response:

```json
{
  "message": "User registered successfully. Please sign in.",
  "user": {
    "id": "user_2abc123...",
    "email": "test@example.com",
    "name": "Test User",
    "companyName": "Test Company",
    "userType": "office"
  },
  "clerkUserId": "user_2abc123..."
}
```

### Check Server Logs:

You should see:
```
📝 Creating user in Clerk: test@example.com
✅ User created in Clerk: user_2abc123...
✅ User synced to Supabase: user_2abc123...
```

### Verify in Clerk Dashboard:

1. Go back to Clerk Dashboard
2. Click **"Users"** in the left sidebar
3. You should see your test user listed!

### Verify in Supabase:

1. Go to Supabase Dashboard
2. Click **"Table Editor"** in the left sidebar
3. Select the **"users"** table
4. You should see your test user with a `clerk_id` column populated!

---

## Step 7: Configure Clerk Webhook (Optional but Recommended)

Webhooks automatically sync user data when users are created/updated/deleted in Clerk.

### 7.1: Get Your Backend URL

**Local Development:**
- Use a tool like **ngrok** to expose your local server:
  ```bash
  ngrok http 3000
  ```
- Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

**Railway Production:**
- Your URL is: `https://your-app-name.railway.app`
- Or check your Railway dashboard for the public URL

### 7.2: Add Webhook in Clerk

1. Go to Clerk Dashboard
2. Click **"Webhooks"** in the left sidebar
3. Click **"+ Add Endpoint"**
4. Enter your webhook URL:
   - **Local:** `https://your-ngrok-url.ngrok.io/api/clerk-webhook`
   - **Production:** `https://your-railway-url.railway.app/api/clerk-webhook`
5. Under **"Events"**, select:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
6. Click **"Create"**
7. Copy the **"Signing Secret"** (starts with `whsec_`)

### 7.3: Add Webhook Secret to Backend

**Local Development (.env file):**
```env
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Railway:**
Add as a new environment variable:
- **Name:** `CLERK_WEBHOOK_SECRET`
- **Value:** Your webhook signing secret

### 7.4: Test Webhook

1. Create a new user (use Step 6)
2. Check your server logs - you should see:
   ```
   📥 Clerk webhook received: user.created user_2abc123...
   ✅ Clerk user synced to Supabase: user_2abc123...
   ```

---

## Step 8: Update Frontend (Optional)

If you want to use Clerk's pre-built sign-in/sign-up components:

### 8.1: Install Clerk Frontend SDK

```bash
cd /Users/andy.ackerman/snackconnect
npm install @clerk/clerk-react
```

### 8.2: Get Publishable Key

1. Go to Clerk Dashboard → **API Keys**
2. Copy the **Publishable Key** (starts with `pk_`)

### 8.3: Update Your Frontend

Wrap your app with ClerkProvider:

```javascript
import { ClerkProvider } from '@clerk/clerk-react';

const publishableKey = "pk_test_your_publishable_key_here";

function App() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      {/* Your app components */}
    </ClerkProvider>
  );
}
```

Then use Clerk's components:
```javascript
import { SignIn, SignUp } from '@clerk/clerk-react';

// In your login page
<SignIn />

// In your signup page
<SignUp />
```

---

## Verification Checklist

After completing all steps, verify everything works:

- [ ] ✅ Clerk secret key is set in environment variables
- [ ] ✅ Server logs show: `✅ Clerk initialized successfully`
- [ ] ✅ Supabase `users` table has `clerk_id` column
- [ ] ✅ Test user registration works
- [ ] ✅ User appears in Clerk Dashboard → Users
- [ ] ✅ User appears in Supabase Table Editor with `clerk_id`
- [ ] ✅ Webhook is configured (if you set it up)
- [ ] ✅ Webhook events appear in server logs

---

## Troubleshooting

### Problem: "Clerk not configured" in logs

**Solution:**
- Check that `CLERK_SECRET_KEY` is in your `.env` file (local) or Railway variables
- Make sure the key starts with `sk_`
- Restart your server after adding the variable

### Problem: "Error creating Clerk user"

**Solution:**
- Check your Clerk secret key is correct
- Verify you have internet connection
- Check Clerk dashboard for any account limits

### Problem: User not syncing to Supabase

**Solution:**
- Verify Supabase `users` table has `clerk_id` column (Step 4)
- Check server logs for sync errors
- Verify Supabase connection is working (check other Supabase queries)

### Problem: Webhook not working

**Solution:**
- Verify webhook URL is correct and accessible
- Check webhook is enabled in Clerk dashboard
- Check server logs for webhook errors
- Verify `CLERK_WEBHOOK_SECRET` is set (optional for now)

---

## What Happens Next?

Once set up:

1. **New User Signs Up:**
   - User created in Clerk ✅
   - User data synced to Supabase ✅
   - Welcome email sent (if configured) ✅

2. **User Signs In:**
   - Clerk handles authentication ✅
   - Session token generated ✅
   - User can access protected routes ✅

3. **User Updates Profile:**
   - Updates stored in Supabase ✅
   - Synced via webhook (if configured) ✅

4. **All Existing Features Work:**
   - Your existing API endpoints work ✅
   - Both Clerk and JWT tokens supported ✅
   - Backward compatible ✅

---

## Need Help?

- **Clerk Documentation:** https://clerk.com/docs
- **Clerk Dashboard:** https://dashboard.clerk.com
- **Your Integration Guide:** See `CLERK-INTEGRATION-GUIDE.md`

---

## Summary

You're now using Clerk for authentication! Here's what changed:

✅ **Before:** Users stored in Supabase only with JWT tokens  
✅ **After:** Users stored in Clerk + synced to Supabase  
✅ **Result:** Better authentication + all your existing features still work

Users can now:
- Sign up securely through Clerk
- Sign in with Clerk sessions
- Have their data automatically synced to Supabase
- Access all your existing features



