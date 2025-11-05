# Tab Click Diagnostic Guide

## What I've Done

1. **Moved functions to `<head>`** - Functions are defined before any HTML loads
2. **Added `alert()` debugging** - You'll see an alert when you click a tab (if clicks work)
3. **Added explicit `window.showX()` calls** - Using `window.showAccounts()` instead of just `showAccounts()`
4. **Added inline styles** - `pointer-events: auto !important`, `z-index: 9999`, `position: relative`
5. **Added `return false`** - Prevents any default behavior

## What to Check

### If you see the alert when clicking:
✅ **Clicks ARE working** - The problem is with the tab switching logic, not the buttons

### If you DON'T see the alert:
❌ **Clicks are being blocked** - Something is covering the buttons or JavaScript is disabled

## Possible Reasons Tabs Aren't Clickable

### 1. **CSS Overlay Blocking Clicks**
- The navbar has `z-index: 1000` and `position: fixed`
- If navbar is too tall, it might cover buttons
- **Check:** Inspect element on a button, see if anything is above it

### 2. **JavaScript Not Loading**
- If external scripts fail, functions won't be defined
- **Check:** Open browser console (F12), look for errors in red

### 3. **Content Security Policy (CSP)**
- Some browsers block inline onclick handlers
- **Check:** Console might show CSP errors

### 4. **Browser Extensions**
- Ad blockers or privacy extensions might block JavaScript
- **Try:** Disable extensions temporarily

### 5. **CSS pointer-events**
- Something might have `pointer-events: none` on parent elements
- **Check:** Inspect button, see computed styles

## Quick Test

Open browser console (F12) and type:
```javascript
document.getElementById('tab-btn-accounts').click()
```

If this works, the button is fine but onclick isn't firing.
If this doesn't work, the button might be hidden or blocked.

## What the Alert Tells Us

- **Alert appears** = JavaScript is working, onclick is firing
- **No alert** = Either JavaScript is blocked, or clicks aren't reaching the button
- **Error in alert** = JavaScript error in the function (check the error message)

