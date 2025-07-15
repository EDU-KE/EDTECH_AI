#!/bin/bash

echo "🔧 FIXING GOOGLE OAUTH INTERNAL ERROR"
echo "====================================="

echo ""
echo "🎯 STEP 1: Configure Google Cloud Console OAuth 2.0 Client"
echo "------------------------------------------------------------"

echo ""
echo "1. Go to Google Cloud Console Credentials:"
echo "   https://console.cloud.google.com/apis/credentials?project=last-35eb7"
echo ""

echo "2. If no OAuth 2.0 Client ID exists, click 'Create Credentials' → 'OAuth client ID'"
echo "   - Application type: Web application"
echo "   - Name: EDTECH_AI_Web_Client"
echo ""

echo "3. Configure Authorized redirect URIs:"
echo "   - https://last-35eb7.firebaseapp.com/__/auth/handler"
echo "   - https://fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev"
echo "   - http://localhost:9002"
echo ""

echo "4. Configure Authorized JavaScript origins:"
echo "   - https://last-35eb7.firebaseapp.com"
echo "   - https://fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev"
echo "   - http://localhost:9002"
echo ""

echo "🎯 STEP 2: Configure OAuth Consent Screen"
echo "--------------------------------------------"

echo ""
echo "1. Go to OAuth consent screen:"
echo "   https://console.cloud.google.com/apis/credentials/consent?project=last-35eb7"
echo ""

echo "2. If not configured, click 'CONFIGURE CONSENT SCREEN'"
echo "   - User Type: External (for testing)"
echo "   - App name: EDTECH AI"
echo "   - User support email: Your email"
echo "   - Developer contact information: Your email"
echo ""

echo "3. Add Test Users (if app is in Testing mode):"
echo "   - Add your email address as a test user"
echo "   - Add any other email addresses you want to test with"
echo ""

echo "🎯 STEP 3: Update Firebase Console Google Provider"
echo "----------------------------------------------------"

echo ""
echo "1. Go to Firebase Console Authentication:"
echo "   https://console.firebase.google.com/project/last-35eb7/authentication/providers"
echo ""

echo "2. Click on Google provider to edit"
echo "3. Ensure Web SDK configuration is present"
echo "4. If Client ID is empty, copy it from Google Cloud Console OAuth client"
echo ""

echo "🎯 STEP 4: Test the Configuration"
echo "-----------------------------------"

echo ""
echo "1. Start the development server:"
echo "   npm run dev"
echo ""

echo "2. Go to: http://localhost:9002"
echo "3. Try Google Sign-In"
echo "4. Check browser console for any remaining errors"
echo ""

echo "🔍 VERIFICATION CHECKLIST:"
echo "- [ ] Google Cloud Console OAuth 2.0 client created"
echo "- [ ] Redirect URIs configured correctly"
echo "- [ ] OAuth consent screen configured"
echo "- [ ] Test users added (if in Testing mode)"
echo "- [ ] Firebase Google provider has correct Client ID"
echo "- [ ] Firebase authorized domains include localhost and Codespace URLs"
echo ""

echo "⚠️  IMPORTANT NOTES:"
echo "- OAuth consent screen must be published OR you must be added as test user"
echo "- Client ID in Firebase Console must match Google Cloud Console OAuth client"
echo "- Redirect URIs must include the Firebase auth handler URL"
echo ""

echo "🆘 If still having issues:"
echo "1. Check Network tab in browser dev tools during sign-in"
echo "2. Verify the OAuth client ID matches between Firebase and Google Cloud Console"
echo "3. Ensure your email is added as a test user in OAuth consent screen"
echo "4. Try signing in with a different browser or incognito mode"
echo ""

echo "✅ Once configured, Google OAuth should work without auth/internal-error!"
