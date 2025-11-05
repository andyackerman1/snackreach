# Push to GitHub with Personal Access Token

## Quick Steps

### 1. Create Personal Access Token

1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name: `SnackReach Push`
4. Expiration: Choose your preference (90 days, 1 year, etc.)
5. Select scope: **✅ repo** (check the box)
6. Click **"Generate token"** at bottom
7. **COPY THE TOKEN** - you won't see it again!

### 2. Push Your Code

Run in Terminal:
```bash
cd /Users/andy.ackerman/snackconnect
git push -u origin main
```

When prompted:
- **Username:** `andyackerman1`
- **Password:** Paste your Personal Access Token (not your GitHub password)

### 3. Done!

Your code will push to GitHub and you'll see:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/andyackerman1/snackreach.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## Alternative: Use SSH (More Secure)

If you prefer SSH:

```bash
# Set up SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy your public key
cat ~/.ssh/id_ed25519.pub

# Add it to GitHub: https://github.com/settings/keys

# Change remote to SSH
cd /Users/andy.ackerman/snackconnect
git remote set-url origin git@github.com:andyackerman1/snackreach.git

# Push
git push -u origin main
```

## Need Help?

If you get errors, let me know what they say!

