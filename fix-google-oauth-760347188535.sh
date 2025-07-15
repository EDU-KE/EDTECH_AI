#!/bin/bash

echo "🔥 Google OAuth Configuration Checker for Project: last-35eb7"
echo "============================================================="
echo "Provider ID: project-760347188535"
echo ""

# Check current environment
echo "📍 Current Environment:"
echo "Project ID: ${NEXT_PUBLIC_FIREBASE_PROJECT_ID:-'Not set in env'}"
echo "Domain: $(echo $CODESPACE_NAME.preview.app.github.dev 2>/dev/null || echo 'localhost')"

echo ""
echo "🔗 Direct Links to Fix Configuration:"
echo "1. Firebase Authentication: https://console.firebase.google.com/project/last-35eb7/authentication/providers"
echo "2. Google OAuth Settings: https://console.firebase.google.com/project/last-35eb7/authentication/settings"
echo "3. Google Cloud Console: https://console.cloud.google.com/apis/credentials?project=last-35eb7"

echo ""
echo "✅ Quick Fix Steps:"
echo "1. Open: https://console.firebase.google.com/project/last-35eb7/authentication/providers"
echo "2. Find 'Google' in the list"
echo "3. Click on it and toggle 'Enable' if not already enabled"
echo "4. Ensure the OAuth client ID matches: project-760347188535"
echo "5. Add these authorized domains:"
echo "   - localhost"
echo "   - $(echo $CODESPACE_NAME.preview.app.github.dev 2>/dev/null || echo 'your-codespace-domain')"

echo ""
echo "🚀 Test the fix:"
echo "1. Save changes in Firebase Console"
echo "2. Restart your app: npm run dev"
echo "3. Try Google sign-in again"

echo ""
echo "📧 Working Alternative:"
echo "Email/password authentication is working fine - users can sign up/login with email"
