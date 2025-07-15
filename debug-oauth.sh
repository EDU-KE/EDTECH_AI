#!/bin/bash

echo "🔍 DEBUGGING GOOGLE OAUTH AFTER SETUP"
echo "======================================"

echo ""
echo "📋 VERIFYING CURRENT CONFIGURATION"
echo "----------------------------------"

echo ""
echo "1. 🔧 Environment Variables:"
if [ -f .env.local ]; then
    echo "   ✅ .env.local exists"
    
    # Check Firebase config
    if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD" .env.local; then
        echo "   ✅ Firebase API Key: $(grep NEXT_PUBLIC_FIREBASE_API_KEY .env.local | cut -d'=' -f2 | cut -c1-20)..."
    else
        echo "   ❌ Firebase API Key missing"
    fi
    
    if grep -q "NEXT_PUBLIC_FIREBASE_PROJECT_ID=last-35eb7" .env.local; then
        echo "   ✅ Firebase Project ID: last-35eb7"
    else
        echo "   ❌ Firebase Project ID missing"
    fi
    
    if grep -q "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=last-35eb7.firebaseapp.com" .env.local; then
        echo "   ✅ Firebase Auth Domain: last-35eb7.firebaseapp.com"
    else
        echo "   ❌ Firebase Auth Domain missing"
    fi
    
    # Check if demo mode is disabled
    if grep -q "^DEMO_MODE=true" .env.local; then
        echo "   ⚠️  Demo mode is ENABLED - this will block Google OAuth"
    else
        echo "   ✅ Demo mode is disabled"
    fi
    
    echo "   ✅ App URL: $(grep NEXT_PUBLIC_APP_URL .env.local | cut -d'=' -f2)"
else
    echo "   ❌ .env.local not found"
fi

echo ""
echo "2. 📁 Critical Files Check:"
critical_files=(
    "src/lib/firebase.ts"
    "src/lib/google-auth.ts"
    "src/lib/auth-context.tsx"
    "src/middleware.ts"
    "src/app/login/page.tsx"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file exists"
    else
        echo "   ❌ $file missing"
    fi
done

echo ""
echo "3. 🔍 Google OAuth Integration Check:"

# Check if Google auth service has the right imports
if grep -q "GoogleAuthProvider" src/lib/google-auth.ts; then
    echo "   ✅ Google auth service has GoogleAuthProvider"
else
    echo "   ❌ Google auth service missing GoogleAuthProvider"
fi

# Check if auth context imports Google auth
if grep -q "from.*google-auth" src/lib/auth-context.tsx; then
    echo "   ✅ Auth context imports Google auth service"
else
    echo "   ❌ Auth context missing Google auth import"
fi

# Check if login page has Google sign-in button
if [ -f "src/app/login/page.tsx" ]; then
    if grep -q -i "google" src/app/login/page.tsx; then
        echo "   ✅ Login page has Google sign-in option"
    else
        echo "   ❌ Login page missing Google sign-in"
    fi
else
    echo "   ❌ Login page not found"
fi

echo ""
echo "4. 🍪 Cookie Configuration Check:"

# Check if setAuthCookies function exists and is used
if grep -q "setAuthCookies" src/lib/auth-context.tsx; then
    echo "   ✅ setAuthCookies function exists"
    
    # Check if it's called in Google sign-in
    if grep -A 20 "signInWithGoogle" src/lib/auth-context.tsx | grep -q "setAuthCookies"; then
        echo "   ✅ Google sign-in calls setAuthCookies"
    else
        echo "   ❌ Google sign-in doesn't call setAuthCookies"
    fi
else
    echo "   ❌ setAuthCookies function missing"
fi

echo ""
echo "5. 🔧 Middleware Integration Check:"

# Check if middleware validates the right cookies
if grep -q "auth-token" src/middleware.ts; then
    echo "   ✅ Middleware checks auth-token cookie"
else
    echo "   ❌ Middleware missing auth-token validation"
fi

if grep -q "user-role" src/middleware.ts; then
    echo "   ✅ Middleware checks user-role cookie"
else
    echo "   ❌ Middleware missing user-role validation"
fi

echo ""
echo "6. 🚨 COMMON ISSUES TO CHECK:"
echo ""

echo "   A. Google Cloud Console OAuth Client:"
echo "      - Go to: https://console.cloud.google.com/apis/credentials?project=last-35eb7"
echo "      - Verify OAuth 2.0 Client ID exists"
echo "      - Check Authorized redirect URIs include: https://last-35eb7.firebaseapp.com/__/auth/handler"
echo "      - Check Authorized JavaScript origins include: https://last-35eb7.firebaseapp.com"
echo ""

echo "   B. OAuth Consent Screen:"
echo "      - Go to: https://console.cloud.google.com/apis/credentials/consent?project=last-35eb7"
echo "      - Verify app is configured"
echo "      - Check if your email is added as test user"
echo "      - Verify app status (should be 'Testing' with you as test user)"
echo ""

echo "   C. Firebase Console:"
echo "      - Go to: https://console.firebase.google.com/project/last-35eb7/authentication/providers"
echo "      - Verify Google provider is enabled"
echo "      - Check if Client ID matches Google Cloud Console"
echo "      - Verify authorized domains include localhost"
echo ""

echo "7. 🧪 TESTING STEPS:"
echo ""

echo "   1. Start development server:"
echo "      npm run dev"
echo ""

echo "   2. Open browser with DevTools:"
echo "      http://localhost:9002/login"
echo ""

echo "   3. Monitor these tabs in DevTools:"
echo "      - Console tab (for errors)"
echo "      - Network tab (for failed requests)"
echo "      - Application tab (for cookies)"
echo ""

echo "   4. Try Google Sign-In and check for:"
echo "      - auth/internal-error (OAuth client not configured)"
echo "      - auth/popup-blocked (browser blocked popup)"
echo "      - auth/popup-closed-by-user (user closed popup)"
echo "      - auth/unauthorized-domain (domain not authorized)"
echo ""

echo "8. 🔍 SPECIFIC ERROR DEBUGGING:"
echo ""

echo "   If you see 'auth/internal-error':"
echo "   - OAuth client not properly configured"
echo "   - Client ID mismatch between Google Cloud and Firebase"
echo "   - Missing redirect URIs"
echo ""

echo "   If you see 'auth/popup-blocked':"
echo "   - Browser is blocking popups"
echo "   - Allow popups for localhost:9002"
echo ""

echo "   If you see 'auth/unauthorized-domain':"
echo "   - Domain not in Firebase authorized domains"
echo "   - Add localhost and 127.0.0.1 to authorized domains"
echo ""

echo "   If popup opens but fails:"
echo "   - Check if you're added as test user in OAuth consent screen"
echo "   - Verify OAuth consent screen is properly configured"
echo ""

echo "9. 📊 MANUAL VERIFICATION STEPS:"
echo ""

echo "   A. Test Firebase connection:"
echo "      - Open browser console"
echo "      - Go to http://localhost:9002"
echo "      - Check for Firebase initialization logs"
echo ""

echo "   B. Test Google Auth service:"
echo "      - In browser console, type: testGoogleOAuth()"
echo "      - This should show detailed error information"
echo ""

echo "   C. Check cookies after successful login:"
echo "      - DevTools → Application → Cookies"
echo "      - Look for: auth-token, user-role, session-expiry"
echo ""

echo "10. 🆘 NEXT STEPS:"
echo ""

echo "    1. Run this debugging script: ./debug-oauth.sh"
echo "    2. Start dev server: npm run dev"
echo "    3. Test login with DevTools open"
echo "    4. Share the exact error messages you see"
echo "    5. Check the specific configuration items listed above"
echo ""

echo "🎯 MOST LIKELY ISSUES:"
echo "   1. OAuth client redirect URIs not configured correctly"
echo "   2. Test user not added to OAuth consent screen"
echo "   3. Client ID mismatch between Google Cloud and Firebase"
echo "   4. Browser blocking popups"
echo "   5. Authorized domains not including localhost"
echo ""

echo "📞 IMMEDIATE HELP:"
echo "   - Check browser console for exact error message"
echo "   - Verify OAuth client configuration one more time"
echo "   - Try incognito mode to clear any cached auth state"
echo "   - Ensure you're added as test user in OAuth consent screen"
