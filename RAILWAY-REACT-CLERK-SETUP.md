# Setting Clerk Publishable Key on Railway

## Step-by-Step Instructions

### 1. Get Your Production Clerk Key

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **API Keys** in the sidebar
4. Copy your **Publishable Key** (starts with `pk_live_...` for production)

### 2. Set Environment Variable on Railway

**Option A: Via Railway Dashboard (Recommended)**

1. Go to [Railway Dashboard](https://railway.app)
2. Select your project
3. Click on your service (the one running your React app)
4. Go to the **Variables** tab
5. Click **+ New Variable**
6. Add:
   - **Variable Name**: `VITE_CLERK_PUBLISHABLE_KEY`
   - **Value**: `pk_live_your_actual_key_here` (replace with your real key)
7. Click **Add**
8. Railway will automatically redeploy your service

**Option B: Via Railway CLI**

```bash
railway variables set VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_key_here
```

### 3. Verify the Variable is Set

1. In Railway Dashboard → Your Service → Variables tab
2. You should see `VITE_CLERK_PUBLISHABLE_KEY` listed
3. The value should start with `pk_live_...`

### 4. Important Notes

- **VITE_ prefix is required** - Vite only exposes environment variables that start with `VITE_` to the client
- **Production vs Test Keys**:
  - `pk_test_...` - For development/testing
  - `pk_live_...` - For production
- **Automatic Redeploy** - Railway will redeploy when you add/update variables
- **Check Logs** - After redeploy, check Railway logs to ensure the app starts correctly

### 5. Testing

After Railway redeploys:
1. Visit your Railway app URL
2. Check browser console for any Clerk errors
3. Try logging in - it should work with your production Clerk instance

## Troubleshooting

**If Clerk doesn't work:**
- Verify the key starts with `pk_live_` (not `pk_test_`)
- Check Railway logs for errors
- Ensure the variable name is exactly `VITE_CLERK_PUBLISHABLE_KEY` (case-sensitive)
- Make sure Railway has redeployed after adding the variable

**If you see "Missing Clerk publishable key":**
- The environment variable isn't being loaded
- Check that it's set in Railway Variables
- Verify the variable name matches exactly
- Restart/redeploy the service

