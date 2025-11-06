# Clerk Integration Guide

This guide explains how to connect users to Clerk database in your SnackConnect application.

## Overview

Your application now supports **Clerk** for authentication, with automatic synchronization to Supabase for storing additional user metadata. This hybrid approach gives you:

- ✅ **Clerk**: Handles authentication (signup, login, password management, sessions)
- ✅ **Supabase**: Stores additional business data (company info, subscriptions, payment methods)

## Architecture

```
User Registration
    ↓
Clerk (Authentication) → Creates user account
    ↓
Supabase (Metadata) → Stores business data linked to Clerk user ID
    ↓
Webhook Sync → Keeps Clerk and Supabase in sync
```

## Setup Instructions

### Step 1: Get Your Clerk API Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Sign up or log in to your account
3. Create a new application (or use existing)
4. Go to **API Keys** in the sidebar
5. Copy your **Secret Key** (starts with `sk_`)

### Step 2: Add Clerk Secret Key to Environment Variables

**Local Development:**
1. Create or edit `.env` file in the `backend/` directory
2. Add:
```env
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

**Railway Production:**
1. Go to your Railway project dashboard
2. Select your service
3. Go to **Variables** tab
4. Add new variable:
   - **Key:** `CLERK_SECRET_KEY`
   - **Value:** Your Clerk secret key (from Step 1)

### Step 3: Update Supabase Schema (Add Clerk ID Column)

Your Supabase `users` table needs a `clerk_id` column to link Clerk users:

```sql
-- Add clerk_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Make clerk_id unique (one Clerk user = one Supabase record)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_clerk_id_unique ON users(clerk_id) WHERE clerk_id IS NOT NULL;
```

Run this SQL in your Supabase SQL Editor.

### Step 4: Configure Clerk Webhook (Optional but Recommended)

Webhooks automatically sync user data between Clerk and Supabase:

1. Go to Clerk Dashboard → **Webhooks**
2. Click **Add Endpoint**
3. Set webhook URL to: `https://your-railway-url.railway.app/api/clerk-webhook`
4. Select events to listen for:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
5. Copy the **Signing Secret** (you'll need this for webhook verification)
6. Add to your `.env`:
```env
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Note:** Webhook verification is recommended for production. The current implementation accepts webhooks but doesn't verify signatures (add this for production).

## How It Works

### User Registration

When a user signs up:

1. **Clerk** creates the user account (handles password hashing, email verification, etc.)
2. User metadata is stored in Clerk's `publicMetadata` and `privateMetadata`
3. User data is automatically synced to **Supabase** for additional business data
4. Welcome email is sent (if configured)

**Registration Flow:**
```
POST /api/register
    ↓
Create user in Clerk
    ↓
Sync to Supabase (async)
    ↓
Return user info
```

### User Authentication

Your authentication middleware supports **both Clerk and JWT tokens**:

1. **Clerk Session Token** (preferred): Users authenticate via Clerk's frontend components
2. **JWT Token** (fallback): Legacy JWT tokens still work for backward compatibility

**Authentication Flow:**
```
Request with Authorization header
    ↓
Try Clerk token verification
    ↓
If valid → Get user from Clerk + Supabase
    ↓
If invalid → Try JWT fallback
    ↓
Set req.userId, req.userType, etc.
```

### User Profile

The `/api/profile` endpoint works with both Clerk and JWT:

- **Clerk users**: Gets data from Clerk + Supabase
- **JWT users**: Gets data from Supabase only

## API Endpoints

### Registration (Clerk)

```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "companyName": "My Company",
  "phone": "123-456-7890",
  "userType": "startup"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please sign in.",
  "user": {
    "id": "user_2abc123...",
    "email": "john@example.com",
    "name": "John Doe",
    "companyName": "My Company",
    "userType": "startup"
  },
  "clerkUserId": "user_2abc123..."
}
```

**Note:** After registration, users need to sign in through Clerk's frontend components to get a session token.

### Profile (Works with Clerk)

```http
GET /api/profile
Authorization: Bearer <clerk_session_token>
```

**Response:**
```json
{
  "user": {
    "id": "user_2abc123...",
    "clerkId": "user_2abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "companyName": "My Company",
    "userType": "startup",
    "phone": "123-456-7890",
    "subscription": {...},
    "paymentMethods": [...]
  }
}
```

### Clerk Webhook

```http
POST /api/clerk-webhook
```

This endpoint receives webhooks from Clerk and syncs user data to Supabase automatically.

## Frontend Integration

### Option 1: Use Clerk's Frontend Components (Recommended)

Install Clerk's React/Next.js components:

```bash
npm install @clerk/clerk-react
```

Then wrap your app:

```javascript
import { ClerkProvider } from '@clerk/clerk-react';

function App() {
  return (
    <ClerkProvider publishableKey="pk_test_your_publishable_key">
      {/* Your app */}
    </ClerkProvider>
  );
}
```

Users can then sign in/up using Clerk's `<SignIn />` and `<SignUp />` components.

### Option 2: Use Clerk REST API

If you prefer your own UI, use Clerk's REST API:

```javascript
// Sign in
const response = await fetch('https://api.clerk.dev/v1/tokens', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CLERK_SECRET_KEY}`
  },
  body: JSON.stringify({
    strategy: 'password',
    identifier: email,
    password: password
  })
});

const { sessionToken } = await response.json();
// Use sessionToken in Authorization header
```

## Data Storage

### Clerk Stores:
- User authentication data
- Email addresses
- Password (hashed)
- Public metadata (userType, companyName)
- Private metadata (phone)

### Supabase Stores:
- All Clerk data (synced)
- Additional business data:
  - Subscription details
  - Payment methods
  - Card info
  - Orders
  - Messages

## Migration from JWT to Clerk

Your system supports **both** Clerk and JWT tokens:

1. **New users** → Use Clerk (automatic)
2. **Existing users** → Can still use JWT tokens (backward compatible)
3. **Gradual migration** → Users can migrate to Clerk when they next sign in

## Troubleshooting

### Clerk Not Working

1. **Check environment variable:**
   ```bash
   echo $CLERK_SECRET_KEY
   ```
   Should show your secret key (starts with `sk_`)

2. **Check server logs:**
   - Should see: `✅ Clerk initialized successfully`
   - If not, check that `CLERK_SECRET_KEY` is set correctly

3. **Test registration:**
   ```bash
   curl -X POST http://localhost:3000/api/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","password":"test123","companyName":"Test Co","userType":"office"}'
   ```

### Webhook Not Syncing

1. Check webhook URL in Clerk dashboard
2. Check server logs for webhook events:
   ```
   📥 Clerk webhook received: user.created user_2abc123...
   ✅ Clerk user synced to Supabase: user_2abc123...
   ```

3. Verify Supabase has `clerk_id` column:
   ```sql
   SELECT clerk_id FROM users LIMIT 1;
   ```

### Users Not Appearing in Supabase

1. Check if webhook is configured
2. Check server logs for sync errors
3. Manually sync: The registration endpoint syncs to Supabase automatically

## Security Notes

1. **Never expose `CLERK_SECRET_KEY`** in frontend code
2. **Use Clerk's publishable key** (`pk_`) in frontend
3. **Verify webhook signatures** in production (add this to webhook handler)
4. **Use HTTPS** for webhook endpoints in production

## Next Steps

1. ✅ Set up Clerk account and get API keys
2. ✅ Add `CLERK_SECRET_KEY` to environment variables
3. ✅ Update Supabase schema (add `clerk_id` column)
4. ✅ Configure Clerk webhook (optional)
5. ✅ Update frontend to use Clerk components (recommended)
6. ✅ Test user registration and authentication

## Summary

You now have a **hybrid authentication system**:
- **Clerk** handles all authentication (signup, login, sessions)
- **Supabase** stores additional business data
- **Webhooks** keep everything in sync automatically
- **Backward compatible** with existing JWT tokens

Users registered through Clerk will have their data automatically synced to Supabase, and you can access all user data through your existing API endpoints!



