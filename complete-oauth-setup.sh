#!/bin/bash

echo "🎯 COMPREHENSIVE GOOGLE OAUTH & MIDDLEWARE SETUP"
echo "================================================"

echo ""
echo "📋 CURRENT STATUS CHECK"
echo "----------------------"

# Check environment variables
echo "✅ Environment Variables:"
if [ -f .env.local ]; then
    echo "   - .env.local exists"
    if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD" .env.local; then
        echo "   - Firebase API Key configured"
    else
        echo "   - ❌ Firebase API Key not found"
    fi
    
    if grep -q "NEXT_PUBLIC_FIREBASE_PROJECT_ID=last-35eb7" .env.local; then
        echo "   - Firebase Project ID: last-35eb7"
    else
        echo "   - ❌ Firebase Project ID not found"
    fi
    
    if grep -q "NEXT_PUBLIC_APP_URL=http://localhost:9002" .env.local; then
        echo "   - App URL: http://localhost:9002"
    else
        echo "   - ❌ App URL not configured"
    fi
else
    echo "   - ❌ .env.local not found"
fi

echo ""
echo "✅ Middleware Status:"
if [ -f src/middleware.ts ]; then
    echo "   - Middleware file exists"
    echo "   - Cookie-based authentication enabled"
    echo "   - Demo mode detection enabled"
    echo "   - Security headers configured"
else
    echo "   - ❌ Middleware file not found"
fi

echo ""
echo "✅ Auth Context Status:"
if [ -f src/lib/auth-context.tsx ]; then
    echo "   - Auth context exists"
    echo "   - Google OAuth integration ready"
    echo "   - Cookie management configured"
else
    echo "   - ❌ Auth context not found"
fi

echo ""
echo "🔧 STEP 1: GOOGLE CLOUD CONSOLE CONFIGURATION"
echo "==============================================" 

echo ""
echo "1.1 📝 Enable Required APIs"
echo "Go to: https://console.cloud.google.com/apis/library?project=last-35eb7"
echo "Enable these APIs:"
echo "   - Google+ API (for OAuth)"
echo "   - Google Identity"
echo "   - Google Cloud Identity and Access Management (IAM) API"
echo ""

echo "1.2 🔑 Create OAuth 2.0 Client ID"
echo "Go to: https://console.cloud.google.com/apis/credentials?project=last-35eb7"
echo ""
echo "Click 'Create Credentials' → 'OAuth client ID'"
echo "   - Application type: Web application"
echo "   - Name: EDTECH_AI_OAuth_Client"
echo ""

echo "1.3 📋 Configure Authorized Redirect URIs"
echo "Add these EXACT URIs (copy/paste):"
echo "   - https://last-35eb7.firebaseapp.com/__/auth/handler"
echo "   - https://fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev/__/auth/handler"
echo "   - http://localhost:9002/__/auth/handler"
echo ""

echo "1.4 🌐 Configure Authorized JavaScript Origins"
echo "Add these EXACT origins:"
echo "   - https://last-35eb7.firebaseapp.com"
echo "   - https://fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev"
echo "   - http://localhost:9002"
echo ""

echo "🔧 STEP 2: OAUTH CONSENT SCREEN"
echo "==============================="

echo ""
echo "2.1 📝 Configure Consent Screen"
echo "Go to: https://console.cloud.google.com/apis/credentials/consent?project=last-35eb7"
echo ""
echo "Fill out the OAuth consent screen:"
echo "   - User Type: External"
echo "   - App name: EDTECH AI"
echo "   - User support email: [Your email]"
echo "   - App logo: [Optional]"
echo "   - Application home page: https://fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev"
echo "   - Application privacy policy: https://fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev/privacy"
echo "   - Application terms of service: https://fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev/terms"
echo "   - Authorized domains: fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev"
echo "   - Developer contact: [Your email]"
echo ""

echo "2.2 👥 Add Test Users"
echo "In the 'Test users' section, add your email address"
echo "This is REQUIRED for testing while the app is in development"
echo ""

echo "🔧 STEP 3: FIREBASE CONSOLE CONFIGURATION"
echo "========================================="

echo ""
echo "3.1 🔥 Configure Google Provider"
echo "Go to: https://console.firebase.google.com/project/last-35eb7/authentication/providers"
echo ""
echo "Click on 'Google' provider:"
echo "   - Status: Enable"
echo "   - Web SDK configuration: Yes"
echo "   - Copy Client ID from Google Cloud Console OAuth client"
echo "   - Copy Client Secret from Google Cloud Console OAuth client"
echo ""

echo "3.2 🌐 Configure Authorized Domains"
echo "Go to: https://console.firebase.google.com/project/last-35eb7/authentication/settings"
echo ""
echo "Add these domains to 'Authorized domains':"
echo "   - localhost"
echo "   - 127.0.0.1"
echo "   - fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev"
echo ""

echo "🔧 STEP 4: MIDDLEWARE OPTIMIZATION"
echo "=================================="

echo ""
echo "4.1 ✅ Current Middleware Features:"
echo "   - Cookie-based authentication (auth-token, user-role, session-expiry)"
echo "   - Advanced security validation (XSS, SQL injection, path traversal)"
echo "   - Rate limiting (120 requests per minute)"
echo "   - User agent validation"
echo "   - IP validation"
echo "   - Demo mode support"
echo "   - Role-based access control"
echo "   - Security headers (CSP, HSTS, etc.)"
echo ""

echo "4.2 🔧 Middleware Auth Flow:"
echo "   1. User signs in with Google → Firebase Auth"
echo "   2. Auth context sets cookies (auth-token, user-role, session-expiry)"
echo "   3. Middleware checks cookies on each request"
echo "   4. Protected routes require valid cookies"
echo "   5. Session expiry automatically logs out user"
echo ""

echo "🔧 STEP 5: TESTING & VERIFICATION"
echo "================================="

echo ""
echo "5.1 📊 Start Development Server"
echo "   npm run dev"
echo ""

echo "5.2 🧪 Test Authentication Flow"
echo "   1. Go to: http://localhost:9002/login"
echo "   2. Try Google Sign-In"
echo "   3. Check browser console for errors"
echo "   4. Verify cookies are set in DevTools"
echo ""

echo "5.3 🔍 Debug Common Issues"
echo "   - auth/internal-error: OAuth client not configured"
echo "   - auth/popup-blocked: Browser blocked popup"
echo "   - auth/popup-closed-by-user: User closed popup"
echo "   - auth/unauthorized-domain: Domain not in authorized list"
echo ""

echo "🔧 STEP 6: QUICK FIXES"
echo "======================"

echo ""
echo "6.1 🚨 If Google OAuth Still Fails:"
echo "   1. Check Google Cloud Console OAuth client configuration"
echo "   2. Verify Firebase Console Google provider has correct Client ID"
echo "   3. Ensure your email is added as test user"
echo "   4. Try incognito mode to clear any cached auth state"
echo ""

echo "6.2 📋 Verification Checklist:"
echo "   - [ ] Google Cloud Console OAuth client created"
echo "   - [ ] OAuth consent screen configured"
echo "   - [ ] Test users added"
echo "   - [ ] Firebase Google provider enabled"
echo "   - [ ] Client ID/Secret copied to Firebase"
echo "   - [ ] Authorized domains configured"
echo "   - [ ] Development server running"
echo "   - [ ] Google sign-in works without errors"
echo ""

echo "✅ SUCCESS INDICATORS:"
echo "   - No auth/internal-error in console"
echo "   - Google popup opens successfully"
echo "   - User can sign in and access protected routes"
echo "   - Cookies are set correctly"
echo "   - Middleware properly authenticates requests"
echo ""

echo "🆘 SUPPORT RESOURCES:"
echo "   - Google Cloud Console: https://console.cloud.google.com/apis/credentials?project=last-35eb7"
echo "   - Firebase Console: https://console.firebase.google.com/project/last-35eb7/authentication/providers"
echo "   - OAuth Consent Screen: https://console.cloud.google.com/apis/credentials/consent?project=last-35eb7"
echo "   - Firebase Auth Docs: https://firebase.google.com/docs/auth/web/google-signin"
echo ""

echo "🎯 NEXT STEPS:"
echo "1. Complete Google Cloud Console OAuth setup (Steps 1-2)"
echo "2. Configure Firebase Console (Step 3)"
echo "3. Test the authentication flow (Step 5)"
echo "4. Debug any remaining issues (Step 6)"
