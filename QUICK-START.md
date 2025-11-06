# Quick Start - Get Clerk Working in 5 Minutes

Don't worry, I'll walk you through this step by step. It's easier than you think!

## What You Need

1. A Clerk account (free) - I'll help you create it
2. Your Clerk secret key - I'll show you where to get it
3. Add it to your backend - I'll help you do this

---

## Let's Do This Together

### Step 1: Get Your Clerk Key (2 minutes)

**Option A: If you DON'T have a Clerk account yet:**

1. Open: https://dashboard.clerk.com
2. Click **"Sign Up"** (top right)
3. Sign up with email or GitHub
4. Click **"Create Application"**
5. Name it: "SnackConnect" (or anything)
6. Click **"Create"**
7. On the left, click **"API Keys"**
8. Find **"Secret Key"** - click the 👁️ eye icon
9. **Copy the key** (starts with `sk_`)

**Option B: If you ALREADY have a Clerk account:**

1. Go to: https://dashboard.clerk.com
2. Select your application
3. Click **"API Keys"** (left sidebar)
4. Find **"Secret Key"** - click the 👁️ eye icon
5. **Copy the key** (starts with `sk_`)

---

### Step 2: Tell Me Your Key

Once you have your key, let me know and I'll help you add it to your backend.

Or if you want to do it yourself:

1. Go to your backend folder: `cd snackconnect/backend`
2. Create a file called `.env` (if it doesn't exist)
3. Add this line (replace with your actual key):

```
CLERK_SECRET_KEY=sk_test_your_actual_key_here
```

---

### Step 3: Test It

Run this command to check if it works:

```bash
cd snackconnect/backend
node check-clerk-setup.js
```

If you see ✅ green checkmarks, you're done!

---

## That's It!

Once your key is set, your server will automatically use Clerk when you restart it.

**Need help?** Just tell me:
- "I don't have a Clerk account" → I'll help you create one
- "I have my key" → I'll help you add it
- "It's not working" → I'll help you debug

Let's start! Do you have a Clerk account yet?



