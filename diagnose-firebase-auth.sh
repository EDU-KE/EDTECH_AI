#!/bin/bash

echo "🔍 DIAGNOSING FIREBASE AUTH/INTERNAL-ERROR"
echo "=========================================="

echo ""
echo "Let me check the actual Firebase configuration and auth implementation:"
echo ""

echo "1. 🔧 Firebase Configuration Check:"
echo "   Environment variables from .env.local:"
echo "   - API Key: $(grep NEXT_PUBLIC_FIREBASE_API_KEY .env.local | cut -d'=' -f2 | cut -c1-20)..."
echo "   - Auth Domain: $(grep NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN .env.local | cut -d'=' -f2)"
echo "   - Project ID: $(grep NEXT_PUBLIC_FIREBASE_PROJECT_ID .env.local | cut -d'=' -f2)"
echo ""

echo "2. 🔍 Checking Firebase Auth Implementation:"
echo ""

# Check if Firebase is properly initialized with auth domain
if grep -q "authDomain.*firebaseapp.com" .env.local; then
    echo "   ✅ Firebase Auth Domain configured correctly"
else
    echo "   ❌ Firebase Auth Domain issue detected"
fi

# Check if Google provider is being properly initialized
if grep -q "GoogleAuthProvider" src/lib/google-auth.ts; then
    echo "   ✅ Google Auth Provider imported"
else
    echo "   ❌ Google Auth Provider not found"
fi

# Check if signInWithPopup is being used correctly
if grep -q "signInWithPopup.*auth.*provider" src/lib/google-auth.ts; then
    echo "   ✅ signInWithPopup implemented"
else
    echo "   ❌ signInWithPopup issue detected"
fi

echo ""
echo "3. 🚨 LIKELY ISSUE - AUTH DOMAIN MISMATCH:"
echo ""

echo "The auth/internal-error often occurs when:"
echo "❌ Firebase Auth Domain doesn't match Google OAuth configuration"
echo "❌ Google OAuth client is configured for wrong domain"
echo "❌ Firebase app initialization is using wrong auth domain"
echo ""

echo "4. 🔧 CHECKING CURRENT FIREBASE INITIALIZATION:"
echo ""

# Check current Firebase config
echo "Current Firebase config in firebase.ts:"
grep -A 10 "firebaseConfig = {" src/lib/firebase.ts | head -8

echo ""
echo "5. 🎯 POTENTIAL FIXES:"
echo ""

echo "Fix 1: Verify Auth Domain Match"
echo "   - Firebase Auth Domain: $(grep NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN .env.local | cut -d'=' -f2)"
echo "   - Google OAuth must be configured for same domain"
echo "   - Check Google Cloud Console OAuth client authorized domains"
echo ""

echo "Fix 2: Check Firebase App Initialization"
echo "   - Ensure Firebase app is properly initialized with auth domain"
echo "   - Check for any initialization errors in browser console"
echo ""

echo "Fix 3: Verify Google Provider Setup"
echo "   - GoogleAuthProvider must use same auth domain as Firebase"
echo "   - Check if provider is properly configured with scopes"
echo ""

echo "6. 🧪 TESTING PROCEDURE:"
echo ""

echo "Test 1: Check Firebase initialization"
echo "   - Start: npm run dev"
echo "   - Open browser console"
echo "   - Look for Firebase initialization logs"
echo "   - Check for any Firebase errors"
echo ""

echo "Test 2: Test Google Provider directly"
echo "   - In browser console, type: testGoogleOAuth()"
echo "   - This will show specific error details"
echo ""

echo "Test 3: Check auth domain in network requests"
echo "   - Open DevTools Network tab"
echo "   - Try Google sign-in"
echo "   - Check if requests are going to correct auth domain"
echo ""

echo "7. 🔧 IMMEDIATE ACTIONS:"
echo ""

echo "Action 1: Verify environment variables are loaded"
echo "   - Check if NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is available in browser"
echo "   - Open browser console and type: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
echo ""

echo "Action 2: Check Firebase app status"
echo "   - In browser console, type: firebase.apps[0].options"
echo "   - Verify auth domain matches your project"
echo ""

echo "Action 3: Test Google OAuth client configuration"
echo "   - Ensure OAuth client authorized domains include:"
echo "     - $(grep NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN .env.local | cut -d'=' -f2)"
echo "     - localhost:9002"
echo ""

echo "🎯 MOST LIKELY CAUSE:"
echo "The auth/internal-error suggests Firebase can't communicate with Google OAuth"
echo "This is usually due to auth domain mismatch or incorrect OAuth client setup"
echo ""

echo "📞 NEXT STEPS:"
echo "1. Start dev server: npm run dev"
echo "2. Check browser console for Firebase errors"
echo "3. Test Google OAuth with testGoogleOAuth()"
echo "4. Share any specific error messages you see"
