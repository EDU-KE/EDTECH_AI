#!/bin/bash

# Google OAuth Configuration Script for Firebase
# This script helps configure Google OAuth for your Firebase project

echo "🔧 Google OAuth Configuration for Firebase"
echo "Project ID: last-35eb7"
echo "Auth Domain: last-35eb7.firebaseapp.com"
echo ""

echo "📋 Step 1: Enable Google Sign-In in Firebase Console"
echo "1. Go to: https://console.firebase.google.com/project/last-35eb7/authentication/providers"
echo "2. Click on 'Google' provider"
echo "3. Toggle 'Enable' switch"
echo "4. Add your project support email"
echo "5. Click 'Save'"
echo ""

echo "📋 Step 2: Configure Authorized Domains"
echo "1. Go to: https://console.firebase.google.com/project/last-35eb7/authentication/settings"
echo "2. In 'Authorized domains' section, add:"
echo "   - localhost (for local development)"

# Get current Codespace URL if available
if [ -n "$CODESPACE_NAME" ]; then
    echo "   - ${CODESPACE_NAME}-3000.githubpreview.dev (for Codespace)"
    echo "   - ${CODESPACE_NAME}-3000.app.github.dev (alternative Codespace URL)"
fi

echo ""
echo "📋 Step 3: Test Google OAuth"
echo "After completing steps 1-2, you can test Google OAuth in your application"
echo ""

echo "🔍 Current Environment:"
echo "- Firebase Config: ✅ Configured"
echo "- Project ID: last-35eb7"
echo "- Auth Domain: last-35eb7.firebaseapp.com"

if [ -n "$CODESPACE_NAME" ]; then
    echo "- Codespace: ${CODESPACE_NAME}"
    echo "- Codespace URL: https://${CODESPACE_NAME}-3000.githubpreview.dev"
fi

echo ""
echo "💡 Tips:"
echo "- Make sure you're logged into Google with the account you want to use"
echo "- Clear browser cache if you encounter issues"
echo "- Check browser console for any error messages"
echo ""

echo "🚀 After configuration, Google Sign-In should work seamlessly!"
