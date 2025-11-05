# 🚀 Push SnackReach to GitHub - Quick Start

## ✅ What I've Done

I've already:
- ✅ Initialized git repository
- ✅ Created initial commit
- ✅ Prepared all files
- ✅ Set up .gitignore

## 📋 Next Steps (5 minutes)

### Step 1: Create GitHub Repository

1. Go to: **https://github.com/new**
2. Repository name: `snackreach`
3. Description: "B2B marketplace connecting snack startups with office spaces"
4. Choose **Public** (for free Netlify hosting)
5. **DO NOT** check "Initialize with README"
6. Click **"Create repository"**

### Step 2: Push Your Code

**Option A: Run the script I created**
```bash
cd /Users/andy.ackerman/snackconnect
./PUSH-TO-GITHUB.sh
```

**Option B: Manual commands**
```bash
cd /Users/andy.ackerman/snackconnect
git remote add origin https://github.com/andyackerman1/snackreach.git
git branch -M main
git push -u origin main
```

You'll be prompted for your GitHub username and password/token.

### Step 3: Done!

Your code is now on GitHub at:
**https://github.com/andyackerman1/snackreach**

## 🔐 GitHub Authentication

If you get authentication errors:
1. Use a **Personal Access Token** instead of password
2. Create one: https://github.com/settings/tokens
3. Select "repo" scope
4. Use token as password when pushing

## 🎯 After Pushing

Once code is on GitHub:
1. Connect to Netlify (auto-deploy from GitHub)
2. Connect to Render (auto-deploy from GitHub)
3. Updates automatically deploy!

## Need Help?

Just ask and I'll guide you through any step! 🚀

