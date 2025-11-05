#!/bin/bash
# Verify that all key files are synced to git

echo "=== SnackReach Sync Verification ==="
echo ""

echo "✅ Frontend HTML Pages:"
git ls-files | grep "\.html$" | grep -v "test\|diagnostic" | while read file; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (MISSING)"
    fi
done

echo ""
echo "✅ Backend Files:"
git ls-files backend/ | grep -E "\.(js|json|toml)$" | while read file; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (MISSING)"
    fi
done

echo ""
echo "✅ JavaScript Files:"
git ls-files js/ | grep "\.js$" | while read file; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (MISSING)"
    fi
done

echo ""
echo "✅ CSS Files:"
git ls-files | grep "\.css$" | while read file; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (MISSING)"
    fi
done

echo ""
echo "=== Git Status ==="
git status --short | head -5
echo "..."

echo ""
echo "=== Latest Commit ==="
git log -1 --oneline

echo ""
echo "✅ All key files should be in git and synced with Railway"

