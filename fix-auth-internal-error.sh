#!/bin/bash

echo "🚨 FIXING auth/internal-error - STEP BY STEP"
echo "============================================"

echo ""
echo "The auth/internal-error confirms that the Google Cloud Console"
echo "OAuth 2.0 client is NOT properly configured. Let's fix this!"
echo ""

echo "🔧 STEP 1: CHECK GOOGLE CLOUD CONSOLE OAUTH CLIENT"
echo "=================================================="
echo ""

echo "1. 🌐 Go to Google Cloud Console Credentials:"
echo "   👉 https://console.cloud.google.com/apis/credentials?project=last-35eb7"
echo ""

echo "2. 🔍 Check if you see an OAuth 2.0 Client ID:"
echo "   - Look for 'OAuth 2.0 Client IDs' section"
echo "   - Should have a client with type 'Web client'"
echo ""

echo "3. 📝 If NO OAuth client exists:"
echo "   - Click 'CREATE CREDENTIALS'"
echo "   - Select 'OAuth client ID'"
echo "   - Choose 'Web application'"
echo "   - Name: 'EDTECH_AI_Web_Client'"
echo ""

echo "4. 🔧 If OAuth client EXISTS, click on it and verify:"
echo ""

echo "   A. Authorized JavaScript origins should include:"
echo "      - https://last-35eb7.firebaseapp.com"
echo "      - http://localhost:9002"
echo "      - https://fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev"
echo ""

echo "   B. Authorized redirect URIs should include:"
echo "      - https://last-35eb7.firebaseapp.com/__/auth/handler"
echo "      - http://localhost:9002/__/auth/handler"
echo "      - https://fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev/__/auth/handler"
echo ""

echo "🔧 STEP 2: CONFIGURE OAUTH CONSENT SCREEN"
echo "=========================================="
echo ""

echo "1. 🌐 Go to OAuth Consent Screen:"
echo "   👉 https://console.cloud.google.com/apis/credentials/consent?project=last-35eb7"
echo ""

echo "2. 📝 Fill out required fields:"
echo "   - User Type: External"
echo "   - App name: EDTECH AI"
echo "   - User support email: [Your email]"
echo "   - Developer contact information: [Your email]"
echo ""

echo "3. 👥 ADD TEST USERS (CRITICAL):"
echo "   - Go to 'Test users' section"
echo "   - Click 'ADD USERS'"
echo "   - Add your email address"
echo "   - Save changes"
echo ""

echo "🔧 STEP 3: UPDATE FIREBASE CONSOLE"
echo "=================================="
echo ""

echo "1. 🌐 Go to Firebase Authentication Providers:"
echo "   👉 https://console.firebase.google.com/project/last-35eb7/authentication/providers"
echo ""

echo "2. 🔧 Click on Google provider:"
echo "   - Status: Should be 'Enabled'"
echo "   - Web SDK configuration: Should be 'Yes'"
echo ""

echo "3. 🔑 Copy credentials from Google Cloud Console:"
echo "   - Go back to Google Cloud Console OAuth client"
echo "   - Copy the 'Client ID'"
echo "   - Copy the 'Client Secret'"
echo "   - Paste them in Firebase Console Google provider"
echo "   - Save changes"
echo ""

echo "🔧 STEP 4: VERIFY AUTHORIZED DOMAINS"
echo "===================================="
echo ""

echo "1. 🌐 Go to Firebase Authentication Settings:"
echo "   👉 https://console.firebase.google.com/project/last-35eb7/authentication/settings"
echo ""

echo "2. 📝 Check 'Authorized domains' section includes:"
echo "   - localhost"
echo "   - 127.0.0.1"
echo "   - fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev"
echo ""

echo "3. ➕ If missing, click 'Add domain' and add them"
echo ""

echo "🔧 STEP 5: ENABLE REQUIRED APIS"
echo "==============================="
echo ""

echo "1. 🌐 Go to Google Cloud Console API Library:"
echo "   👉 https://console.cloud.google.com/apis/library?project=last-35eb7"
echo ""

echo "2. 🔍 Search for and enable these APIs:"
echo "   - 'Google+ API' (or 'Google Identity')"
echo "   - 'Identity and Access Management (IAM) API'"
echo ""

echo "🧪 STEP 6: TEST CONFIGURATION"
echo "=============================="
echo ""

echo "1. 🚀 Start development server:"
echo "   npm run dev"
echo ""

echo "2. 🌐 Open browser with DevTools:"
echo "   http://localhost:9002/login"
echo ""

echo "3. 🔍 Try Google Sign-In and check console:"
echo "   - Should NOT see auth/internal-error"
echo "   - Google popup should open"
echo "   - Authentication should complete"
echo ""

echo "🚨 COMMON MISTAKES THAT CAUSE auth/internal-error:"
echo "================================================="
echo ""

echo "❌ Mistake 1: No OAuth client exists"
echo "   Fix: Create OAuth 2.0 Client ID in Google Cloud Console"
echo ""

echo "❌ Mistake 2: Missing redirect URIs"
echo "   Fix: Add https://last-35eb7.firebaseapp.com/__/auth/handler"
echo ""

echo "❌ Mistake 3: Client ID mismatch"
echo "   Fix: Copy exact Client ID from Google Cloud to Firebase"
echo ""

echo "❌ Mistake 4: OAuth consent screen not configured"
echo "   Fix: Configure app name and add test users"
echo ""

echo "❌ Mistake 5: Test user not added"
echo "   Fix: Add your email as test user in OAuth consent screen"
echo ""

echo "❌ Mistake 6: Required APIs not enabled"
echo "   Fix: Enable Google+ API and IAM API"
echo ""

echo "🎯 CRITICAL CHECKLIST:"
echo "======================"
echo ""

echo "Before testing, ensure:"
echo "□ OAuth 2.0 Client ID exists in Google Cloud Console"
echo "□ Redirect URIs include Firebase auth handler"
echo "□ OAuth consent screen is configured"
echo "□ Your email is added as test user"
echo "□ Firebase Google provider has correct Client ID"
echo "□ Required APIs are enabled"
echo ""

echo "📞 IMMEDIATE HELP:"
echo "=================="
echo ""

echo "If you need help with any step:"
echo "1. Share screenshot of Google Cloud Console OAuth client"
echo "2. Share screenshot of OAuth consent screen"
echo "3. Share screenshot of Firebase Google provider settings"
echo "4. Confirm your email is added as test user"
echo ""

echo "🎉 ONCE CONFIGURED CORRECTLY:"
echo "============================"
echo ""

echo "The auth/internal-error will disappear immediately!"
echo "Google OAuth will work perfectly!"
echo "You'll be able to sign in with Google!"
echo ""

echo "🚀 START WITH STEP 1 - CHECK OAUTH CLIENT EXISTS!"
