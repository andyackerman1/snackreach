# Connect SnackReach to Clerk - Step by Step

Follow these steps to connect your SnackReach app to Clerk. This will take about 5 minutes.

---

## ✅ Step 1: Get Your Clerk Secret Key (2 minutes)

### 1.1: Go to Clerk Dashboard
Open your browser and go to: **https://dashboard.clerk.com**

### 1.2: Sign In or Sign Up
- If you don't have an account, click **"Sign Up"** (top right)
- Sign up with email or GitHub
- If you already have an account, click **"Sign In"**

### 1.3: Create or Select Application
- If this is your first time, click **"Create Application"**
- Name it: **"SnackReach"** (or any name you like)
- Click **"Create"**
- If you already have an application, select it from the list

### 1.4: Get Your Secret Key
1. In the left sidebar, click **"API Keys"**
2. You'll see two keys:
   - **Publishable Key** (starts with `pk_`) - for frontend
   - **Secret Key** (starts with `sk_`) - for backend
3. Click the **👁️ eye icon** next to "Secret Key" to reveal it
4. **Copy the Secret Key** - it looks like: `sk_test_abc123xyz...`

✅ **Done with Step 1!** You have your Clerk secret key.

---

## ✅ Step 2: Add Key to Your Backend (1 minute)

### 2.1: Open Your Backend Directory
Open your terminal and run:
```bash
cd /Users/andy.ackerman/snackconnect/backend
```

### 2.2: Check if .env File Exists
```bash
ls -la .env
```

If you see the file, it exists. If you see "No such file", we'll create it.

### 2.3: Add Your Clerk Key

**Option A: If .env file exists**
```bash
echo "CLERK_SECRET_KEY=sk_test_your_key_here" >> .env
```
Then edit the file and replace `sk_test_your_key_here` with your actual key.

**Option B: If .env file doesn't exist**
```bash
echo "CLERK_SECRET_KEY=sk_test_your_key_here" > .env
```
Then edit the file and replace `sk_test_your_key_here` with your actual key.

**Or use a text editor:**
1. Open the file: `nano .env` (or use your favorite editor)
2. Add this line:
   ```
   CLERK_SECRET_KEY=sk_test_your_actual_key_here
   ```
3. Replace `sk_test_your_actual_key_here` with your actual Clerk secret key
4. Save the file

### 2.4: Verify It's Set
```bash
cat .env | grep CLERK
```

You should see: `CLERK_SECRET_KEY=sk_test_...`

✅ **Done with Step 2!** Your Clerk key is in the .env file.

---

## ✅ Step 3: Test the Connection (30 seconds)

### 3.1: Run the Setup Check
```bash
cd /Users/andy.ackerman/snackconnect/backend
node check-clerk-setup.js
```

### 3.2: Check the Output

**✅ If you see:**
```
✅ CLERK_SECRET_KEY found in .env
✅ Clerk client initialized successfully
🎉 Setup looks good! Your server should work with Clerk.
```

**Then you're done!** Clerk is connected.

**❌ If you see errors:**
- Make sure your key starts with `sk_`
- Make sure there are no extra spaces in the .env file
- Make sure the key is on one line

✅ **Done with Step 3!** Clerk is connected.

---

## ✅ Step 4: Start Your Server (1 minute)

### 4.1: Start the Server
```bash
cd /Users/andy.ackerman/snackconnect/backend
node server.js
```

### 4.2: Look for This Message
You should see in the logs:
```
✅ Clerk initialized successfully
```

If you see this, **everything is working!** 🎉

### 4.3: Test User Registration

Open a new terminal window and run:
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

**Expected response:**
```json
{
  "message": "User registered successfully. Please sign in.",
  "user": {
    "id": "user_2abc123...",
    "email": "test@example.com",
    "name": "Test User",
    "companyName": "Test Company",
    "userType": "office"
  }
}
```

### 4.4: Verify in Clerk Dashboard
1. Go back to https://dashboard.clerk.com
2. Click **"Users"** in the left sidebar
3. You should see your test user! 🎉

✅ **Done with Step 4!** Your app is connected to Clerk!

---

## ✅ Step 5: Verify Everything Works

### 5.1: Check Database Status
```bash
curl http://localhost:3000/api/database-status
```

You should see:
```json
{
  "databaseType": "Clerk",
  "totalAccounts": 1,
  "accounts": [
    {
      "id": "user_2abc123...",
      "email": "test@example.com",
      "userType": "office",
      "companyName": "Test Company"
    }
  ]
}
```

### 5.2: Check Server Logs
When you registered the user, you should have seen:
```
📝 Creating user in Clerk: test@example.com
✅ User created in Clerk: user_2abc123...
✅ All user data stored in Clerk metadata (no Supabase needed)
```

---

## 🎉 You're All Set!

Your SnackReach app is now connected to Clerk! 

### What's Working:
- ✅ User registration → Creates users in Clerk
- ✅ All user data → Stored in Clerk metadata
- ✅ User authentication → Handled by Clerk
- ✅ Profile management → All in Clerk

### Next Steps (Optional):
1. **Set up Clerk frontend components** (if you want to use Clerk's UI)
2. **Configure webhooks** (for notifications when users are created/updated)
3. **Customize user metadata** (add more fields as needed)

---

## Troubleshooting

### Problem: "Clerk not configured"
**Solution:** Make sure your `.env` file has `CLERK_SECRET_KEY=sk_test_...` and restart your server.

### Problem: "Error creating Clerk user"
**Solution:** 
- Check your Clerk key is correct
- Make sure you have internet connection
- Check Clerk dashboard for any account limits

### Problem: User not appearing in Clerk
**Solution:**
- Check server logs for errors
- Verify the registration request was successful
- Check Clerk dashboard → Users

### Need Help?
- Check server logs for error messages
- Verify Clerk key: `node backend/check-clerk-setup.js`
- See full documentation: `CLERK-ONLY-SETUP.md`

---

## Summary

You've successfully:
1. ✅ Got your Clerk secret key
2. ✅ Added it to your .env file
3. ✅ Tested the connection
4. ✅ Started your server
5. ✅ Created a test user
6. ✅ Verified it's working

**Your SnackReach app is now fully connected to Clerk!** 🚀


