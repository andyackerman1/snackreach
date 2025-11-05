# How to Console Test - Step by Step

## Step 1: Open Browser Console

### Chrome / Edge / Brave:
- Press **F12** OR
- Press **Ctrl+Shift+J** (Windows) or **Cmd+Option+J** (Mac) OR
- Right-click page → "Inspect" → Click "Console" tab

### Firefox:
- Press **F12** OR
- Press **Ctrl+Shift+K** (Windows) or **Cmd+Option+K** (Mac)

### Safari (Mac):
- Press **Cmd+Option+C** OR
- Safari menu → Develop → Show JavaScript Console

## Step 2: Find the Console Tab

Once DevTools opens, you'll see tabs like:
- Elements / Inspector
- Console ← **CLICK THIS ONE**
- Network
- Sources
etc.

## Step 3: Type Test Commands

Click in the console (where you can type), then type:

### Test 1: Click the button programmatically
```javascript
document.getElementById('tab-btn-accounts').click()
```
Press Enter. Do you see an alert?

### Test 2: Check if button exists
```javascript
document.getElementById('tab-btn-accounts')
```
Press Enter. Should show: `<button id="tab-btn-accounts">...`

### Test 3: Check if functions are defined
```javascript
typeof window.showAccounts
```
Press Enter. Should show: `"function"`

### Test 4: Check all functions
```javascript
console.log(window.showAccounts, window.showBanking, window.showSettings)
```
Press Enter. Should show: `ƒ() { ... }` for each

### Test 5: Check button styles
```javascript
window.getComputedStyle(document.getElementById('tab-btn-accounts')).pointerEvents
```
Press Enter. Should show: `"auto"`

## Step 4: What to Look For

### ✅ Good Signs:
- No red errors
- Functions show as "function"
- Button click triggers alert
- pointerEvents shows "auto"

### ❌ Bad Signs:
- Red error messages
- Functions show as "undefined"
- Button click does nothing
- pointerEvents shows "none"

## Step 5: Report Back

Tell me:
1. Do you see any red errors?
2. What does `typeof window.showAccounts` show?
3. Does `document.getElementById('tab-btn-accounts').click()` trigger an alert?

