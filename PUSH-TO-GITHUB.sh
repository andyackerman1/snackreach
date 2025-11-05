#!/bin/bash

# SnackReach GitHub Push Script
# Run this after creating your GitHub repository

echo "🚀 Pushing SnackReach to GitHub..."
echo ""

# Your GitHub username
GITHUB_USER="andyackerman1"
REPO_NAME="snackreach"

echo "Step 1: Adding remote repository..."
git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git 2>/dev/null || echo "Remote already exists or will be set manually"

echo ""
echo "Step 2: Setting main branch..."
git branch -M main

echo ""
echo "Step 3: Pushing to GitHub..."
echo "You'll need to enter your GitHub credentials..."
git push -u origin main

echo ""
echo "✅ Done! Your code is now on GitHub!"
echo ""
echo "Repository URL: https://github.com/$GITHUB_USER/$REPO_NAME"




