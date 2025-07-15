#!/bin/bash

echo "🔍 OAUTH CLIENT VERIFICATION CHECKLIST"
echo "======================================"

echo ""
echo "Since you're getting auth/internal-error, let's verify each step:"
echo ""

echo "✅ STEP 1: GOOGLE CLOUD CONSOLE OAUTH CLIENT"
echo "=============================================="
echo ""

echo "Go to: https://console.cloud.google.com/apis/credentials?project=last-35eb7"
echo ""

echo "Check these items:"
echo "□ OAuth 2.0 Client ID exists (Web application type)"
echo "□ Authorized JavaScript origins include:"
echo "   - https://last-35eb7.firebaseapp.com"
echo "   - http://localhost:9002"
echo "□ Authorized redirect URIs include:"
echo "   - https://last-35eb7.firebaseapp.com/__/auth/handler"
echo "   - http://localhost:9002/__/auth/handler"
echo ""

echo "✅ STEP 2: OAUTH CONSENT SCREEN"
echo "==============================="
echo ""

echo "Go to: https://console.cloud.google.com/apis/credentials/consent?project=last-35eb7"
echo ""

echo "Check these items:"
echo "□ App name is configured (e.g., 'EDTECH AI')"
echo "□ User support email is set"
echo "□ Developer contact information is set"
echo "□ Your email is added as test user"
echo "□ App status allows testing"
echo ""

echo "✅ STEP 3: FIREBASE GOOGLE PROVIDER"
echo "==================================="
echo ""

echo "Go to: https://console.firebase.google.com/project/last-35eb7/authentication/providers"
echo ""

echo "Check these items:"
echo "□ Google provider is enabled"
echo "□ Web SDK configuration is enabled"
echo "□ Client ID matches Google Cloud Console"
echo "□ Client Secret is configured"
echo ""

echo "✅ STEP 4: FIREBASE AUTHORIZED DOMAINS"
echo "======================================"
echo ""

echo "Go to: https://console.firebase.google.com/project/last-35eb7/authentication/settings"
echo ""

echo "Check these items:"
echo "□ localhost is in authorized domains"
echo "□ 127.0.0.1 is in authorized domains"
echo "□ fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev is in authorized domains"
echo ""

echo "🚨 MOST COMMON ISSUE:"
echo "===================="
echo ""

echo "Based on auth/internal-error, the issue is likely:"
echo "❌ OAuth 2.0 Client ID doesn't exist OR"
echo "❌ Redirect URIs are missing OR"
echo "❌ Test user not added OR"
echo "❌ Client ID mismatch between Google Cloud and Firebase"
echo ""

echo "🎯 IMMEDIATE ACTION:"
echo "==================="
echo ""

echo "1. First, verify OAuth client exists:"
echo "   https://console.cloud.google.com/apis/credentials?project=last-35eb7"
echo ""

echo "2. If it exists, check redirect URIs include:"
echo "   https://last-35eb7.firebaseapp.com/__/auth/handler"
echo ""

echo "3. If missing, add the redirect URI and save"
echo ""

echo "4. Verify you're added as test user:"
echo "   https://console.cloud.google.com/apis/credentials/consent?project=last-35eb7"
echo ""

echo "5. Test again: npm run dev → http://localhost:9002/login"
echo ""

echo "📞 WHAT TO CHECK RIGHT NOW:"
echo "==========================="
echo ""

echo "Please verify:"
echo "1. Does OAuth 2.0 Client ID exist in Google Cloud Console?"
echo "2. Are the redirect URIs configured correctly?"
echo "3. Is your email added as test user?"
echo "4. Does the Client ID match between Google Cloud and Firebase?"
echo ""

echo "🎉 RESULT:"
echo "=========="
echo ""

echo "Once you fix the OAuth client configuration,"
echo "the auth/internal-error will disappear immediately!"
echo ""

echo "The most common fix is adding the redirect URI:"
echo "https://last-35eb7.firebaseapp.com/__/auth/handler"
