# GitHub Authentication Help

## Current Status

Your code is committed and ready to push, but you need to:

1. **Create the repository on GitHub first** (if not already created)
2. **Authenticate** when pushing

## Step 1: Create Repository on GitHub

I've opened the page for you. If it didn't open:
- Go to: https://github.com/new

Fill in:
- **Repository name:** `snackreach`
- **Description:** "B2B marketplace connecting snack startups with office spaces"
- **Public** or **Private** (your choice)
- **DO NOT** check "Initialize with README"
- Click **"Create repository"**

## Step 2: Push Your Code

After creating the repository, run:

```bash
cd /Users/andy.ackerman/snackconnect
git push -u origin main
```

### Authentication Options:

**Option A: Username + Password**
- Username: `andyackerman1`
- Password: Your GitHub password (if you have 2FA, you'll need a token)

**Option B: Personal Access Token (Recommended)**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: "SnackReach Push"
4. Select scope: **repo** (check the box)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. When pushing, use:
   - Username: `andyackerman1`
   - Password: **paste the token**

## Alternative: Use SSH (More Secure)

If you prefer SSH authentication:

```bash
# Change remote to SSH
git remote set-url origin git@github.com:andyackerman1/snackreach.git

# Then push
git push -u origin main
```

## Quick Commands

Once repository is created:

```bash
cd /Users/andy.ackerman/snackconnect
git remote add origin https://github.com/andyackerman1/snackreach.git
git branch -M main
git push -u origin main
```

## Need Help?

Let me know if:
- You need help creating the repository
- You get authentication errors
- You want to set up SSH keys instead

