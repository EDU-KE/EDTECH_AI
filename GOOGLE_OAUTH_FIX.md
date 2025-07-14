# 🔧 Fix Google OAuth "auth/internal-error" 

## Problem
You're getting `Firebase: Error (auth/internal-error)` when trying to sign in with Google.

## Root Cause
This error typically occurs when:
1. ✅ **Firestore rules are too restrictive** (FIXED - we updated the rules)
2. ❌ **Google OAuth provider is not enabled in Firebase Console**
3. ❌ **Current domain is not authorized in Firebase**

## Solution Steps

### 1. Enable Google OAuth Provider
1. Open Firebase Console: https://console.firebase.google.com/project/last-35eb7/authentication/providers
2. Click on "Google" provider
3. Toggle "Enable" to ON
4. Add a support email (your email address)
5. Click "Save"

### 2. Add Authorized Domains
1. Go to: https://console.firebase.google.com/project/last-35eb7/authentication/settings
2. Scroll down to "Authorized domains"
3. Click "Add domain" and add these domains:
   - `localhost` (for local development)
   - Your current Codespace domain (check browser URL)
   - `*.app.github.dev` (for all GitHub Codespaces)

### 3. Get Your Current Domain
Your current domain should be something like:
```
[codespace-name]-9002.app.github.dev
```

Check your browser's address bar to get the exact domain.

### 4. Test the Fix
After completing steps 1-3:
1. Save all changes in Firebase Console
2. Refresh your application
3. Try Google sign-in again

## Quick Checks

### ✅ Firestore Rules (COMPLETED)
- Updated rules to allow initial user creation
- Added `hasRoleInToken()` helper function
- Fixed chicken-and-egg problem with new users

### ❓ Google OAuth Provider Status
Run this in browser console to check:
```javascript
console.log('Auth domain:', window.location.hostname);
```

### ❓ Firebase Console Links
- Authentication providers: https://console.firebase.google.com/project/last-35eb7/authentication/providers
- Authorized domains: https://console.firebase.google.com/project/last-35eb7/authentication/settings

## Expected Error Messages After Fix
- ✅ "Sign in was cancelled" (user cancelled)
- ✅ "Authentication will continue with redirect" (popup blocked)
- ❌ "auth/internal-error" (should be gone)

## Still Having Issues?
1. Check browser console for detailed error logs
2. Verify the exact domain in your browser URL
3. Make sure Google provider is enabled in Firebase Console
4. Ensure your domain is in the authorized domains list
