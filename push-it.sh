#!/bin/bash

echo "🚀 Pushing SnackReach to GitHub..."
echo ""
echo "You'll be asked for your GitHub credentials:"
echo "  Username: andyackerman1"
echo "  Password: [paste your token here]"
echo ""
echo "Starting push..."
echo ""

cd /Users/andy.ackerman/snackconnect
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Your code is now on GitHub!"
    echo ""
    echo "Repository: https://github.com/andyackerman1/snackreach"
    echo ""
    echo "Next: I'll help you deploy it to the web!"
else
    echo ""
    echo "❌ Push failed. Make sure you:"
    echo "  1. Created the repository on GitHub"
    echo "  2. Used the correct token"
    echo ""
fi

