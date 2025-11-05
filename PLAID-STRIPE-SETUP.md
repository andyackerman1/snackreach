# Plaid and Stripe Integration Setup Guide

This guide will help you set up Plaid (bank verification) and Stripe (payments) integrations for SnackReach.

## Prerequisites

- Node.js installed
- Stripe account (sign up at https://stripe.com)
- Plaid account (sign up at https://plaid.com)

## Step 1: Install Dependencies

The required packages are already in `package.json`. Make sure they're installed:

```bash
cd backend
npm install
```

This will install:
- `stripe` - Stripe payment processing
- `plaid` - Plaid bank verification

## Step 2: Get Your API Keys

### Stripe Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Sign in or create an account
3. Copy your **Secret Key** (starts with `sk_test_` for test mode)
4. Copy your **Publishable Key** (starts with `pk_test_` for test mode)

**Note:** For production, use `sk_live_` and `pk_live_` keys instead.

### Plaid Keys

1. Go to https://dashboard.plaid.com/developers/keys
2. Sign in or create an account
3. Copy your **Client ID**
4. Copy your **Secret Key** (for Sandbox environment)

**Note:** Start with Sandbox keys for testing. When ready for production, switch to Development or Production keys.

## Step 3: Create .env File

1. Copy the example file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Open `.env` in a text editor

3. Fill in your keys:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE

# Plaid
PLAID_ENV=sandbox
PLAID_CLIENT_ID=YOUR_PLAID_CLIENT_ID_HERE
PLAID_SECRET=YOUR_PLAID_SECRET_HERE

# Other settings
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=3000
NODE_ENV=development
```

## Step 4: Test the Configuration

1. Start your server:
   ```bash
   cd backend
   node server.js
   ```

2. Look for these messages:
   - ✅ Stripe initialized successfully
   - ✅ Plaid initialized successfully (sandbox environment)

3. If you see warnings, check that:
   - Your `.env` file is in the `backend` directory
   - All keys are correct (no extra spaces or quotes)
   - Packages are installed (`npm install`)

## Step 5: Test the Integrations

### Test Stripe

1. Visit your owner dashboard: http://localhost:3000/owner-dashboard.html
2. Go to "Banking Info" tab
3. Try adding a credit card
4. The form should work without errors

### Test Plaid

1. Visit your owner dashboard: http://localhost:3000/owner-dashboard.html
2. Go to "Banking Info" tab
3. Click "Connect Bank Account"
4. You should see Plaid Link open (for testing, use Plaid's test credentials)

## Production Deployment (Railway)

For Railway deployment:

1. Go to your Railway project dashboard
2. Click on your service → Variables
3. Add these environment variables:
   - `STRIPE_SECRET_KEY` (use live key: `sk_live_...`)
   - `STRIPE_PUBLISHABLE_KEY` (use live key: `pk_live_...`)
   - `PLAID_CLIENT_ID` (use production credentials)
   - `PLAID_SECRET` (use production credentials)
   - `PLAID_ENV=production` (for live environment)
   - `JWT_SECRET` (generate a strong random string)
   - `PORT` (Railway sets this automatically)

4. Redeploy your service

## Troubleshooting

### "Stripe not configured" warning

- Check that `STRIPE_SECRET_KEY` is set in `.env`
- Make sure the key starts with `sk_test_` or `sk_live_`
- Verify the `.env` file is in the `backend` directory
- Restart the server after changing `.env`

### "Plaid not configured" warning

- Check that `PLAID_CLIENT_ID` and `PLAID_SECRET` are set in `.env`
- Make sure they're not the placeholder values
- Verify the `.env` file is in the `backend` directory
- Restart the server after changing `.env`

### "Package not found" errors

Run:
```bash
cd backend
npm install stripe plaid
```

### Plaid Link doesn't open

- Check browser console for errors (F12)
- Verify Plaid keys are correct
- Make sure you're using Sandbox keys for testing
- Check that the `/api/plaid/create-link-token` endpoint is working

## Security Notes

⚠️ **IMPORTANT:**

- Never commit your `.env` file to git (it's in `.gitignore`)
- Use test keys for development
- Use production keys only on Railway/production servers
- Keep your secret keys secure
- Rotate keys if they're ever exposed

## Support

If you encounter issues:
1. Check the server console for error messages
2. Check browser console (F12) for frontend errors
3. Verify all environment variables are set correctly
4. Make sure packages are installed

