#!/bin/bash

# Comprehensive Auth Diagnostic Script
echo "🔍 Auth Diagnostic - Full System Check"
echo "======================================"
echo ""

echo "📊 FIREBASE CONSOLE STATUS (according to user):"
echo "✅ Email/Password: Enabled"
echo "✅ Google: Enabled"
echo "✅ Anonymous: Enabled"
echo ""

echo "🔍 ENVIRONMENT ANALYSIS:"
echo "Current Codespace: ${CODESPACE_NAME}"
echo "Current Domain: ${CODESPACE_NAME}-3000.githubpreview.dev"
echo ""

echo "📋 FIREBASE CONFIGURATION CHECK:"
if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    echo "API Key: $(grep NEXT_PUBLIC_FIREBASE_API_KEY .env.local | cut -d'=' -f2 | cut -c1-20)..."
    echo "Project ID: $(grep NEXT_PUBLIC_FIREBASE_PROJECT_ID .env.local | cut -d'=' -f2)"
    echo "Auth Domain: $(grep NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN .env.local | cut -d'=' -f2)"
else
    echo "❌ .env.local file missing"
fi
echo ""

echo "🔍 POTENTIAL ISSUES TO CHECK:"
echo ""
echo "1. 🌐 AUTHORIZED DOMAINS:"
echo "   Check if these domains are added to Firebase Console:"
echo "   - localhost"
echo "   - 127.0.0.1"
echo "   - ${CODESPACE_NAME}-3000.githubpreview.dev"
echo "   - ${CODESPACE_NAME}-3000.app.github.dev"
echo "   Go to: https://console.firebase.google.com/project/last-35eb7/authentication/settings"
echo ""

echo "2. 🔧 GOOGLE OAUTH CONSENT SCREEN:"
echo "   Check if OAuth consent screen is properly configured:"
echo "   - Go to: https://console.cloud.google.com/apis/credentials/consent"
echo "   - Make sure app is published or you're in test users"
echo "   - Check if support email is configured"
echo ""

echo "3. 🔑 OAUTH CLIENT ID:"
echo "   Verify OAuth 2.0 client ID is properly configured:"
echo "   - Go to: https://console.cloud.google.com/apis/credentials"
echo "   - Check if client ID matches Firebase configuration"
echo ""

echo "4. 📱 BROWSER ISSUES:"
echo "   Try these troubleshooting steps:"
echo "   - Clear browser cache and cookies"
echo "   - Disable browser extensions"
echo "   - Try incognito/private mode"
echo "   - Check browser console for errors"
echo ""

echo "5. 🔄 DEMO MODE CHECK:"
echo "   The system might be incorrectly detecting demo mode"
echo "   This would disable all Firebase authentication"
echo ""

echo "📋 IMMEDIATE ACTIONS:"
echo "1. Open Firebase Console authorized domains"
echo "2. Add your Codespace domain: ${CODESPACE_NAME}-3000.githubpreview.dev"
echo "3. Test Google sign-in in browser console"
echo "4. Check for any JavaScript errors"
echo ""

echo "🔧 TESTING COMMANDS:"
echo "1. Start dev server: npm run dev"
echo "2. Open: https://${CODESPACE_NAME}-3000.githubpreview.dev/login"
echo "3. Open browser console (F12)"
echo "4. Try Google sign-in and watch for errors"
echo ""

echo "🆘 IF STILL NOT WORKING:"
echo "- Check Google Cloud Console OAuth settings"
echo "- Verify Firebase project billing is enabled"
echo "- Try creating a new OAuth client ID"
echo "- Test with a different Google account"
echo ""

echo "📞 SUPPORT LINKS:"
echo "• Firebase: https://console.firebase.google.com/project/last-35eb7"
echo "• Google Cloud: https://console.cloud.google.com/apis/credentials"
echo "• OAuth Consent: https://console.cloud.google.com/apis/credentials/consent"
