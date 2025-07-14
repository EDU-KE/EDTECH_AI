#!/bin/bash

echo "🔧 Firebase Google OAuth Configuration Script"
echo "=============================================="
echo ""

# Check if logged in to Firebase
echo "1. Checking Firebase login status..."
if ! firebase list &>/dev/null; then
    echo "❌ You need to login to Firebase first:"
    echo "   Run: firebase login"
    exit 1
fi

echo "✅ Firebase CLI is authenticated"
echo ""

# Get current project
PROJECT_ID=$(firebase use | grep -o 'last-35eb7' || echo "")

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Firebase project not set. Setting up project..."
    firebase use last-35eb7
    PROJECT_ID="last-35eb7"
fi

echo "📍 Current Firebase project: $PROJECT_ID"
echo ""

# Check authorized domains
echo "2. Checking authorized domains..."
echo "   In Firebase Console, you need to add these domains:"
echo "   - localhost (for local development)"
echo "   - *.app.github.dev (for GitHub Codespaces)"
echo "   - *.github.dev (for GitHub Codespaces)"
echo ""

# Instructions for setting up Google OAuth
echo "3. Setting up Google OAuth Provider:"
echo "   🌐 Open: https://console.firebase.google.com/project/$PROJECT_ID/authentication/providers"
echo ""
echo "   📋 Follow these steps:"
echo "   a) Click on 'Google' provider"
echo "   b) Enable the Google provider"
echo "   c) Add your project support email"
echo "   d) Click 'Save'"
echo ""

echo "4. Adding Authorized Domains:"
echo "   🌐 Open: https://console.firebase.google.com/project/$PROJECT_ID/authentication/settings"
echo ""
echo "   📋 In the 'Authorized domains' section, add:"
echo "   - localhost"
echo "   - $CODESPACE_NAME-9002.app.github.dev (if using GitHub Codespaces)"
echo "   - $(echo $CODESPACE_NAME | cut -d'-' -f1-2)-9002.app.github.dev"
echo ""

# Get current domain
if [ ! -z "$CODESPACE_NAME" ]; then
    CURRENT_DOMAIN="$CODESPACE_NAME-9002.app.github.dev"
    echo "   ⚡ Your current Codespace domain: $CURRENT_DOMAIN"
    echo "   📋 Make sure to add this exact domain to Firebase authorized domains!"
fi

echo ""
echo "5. Testing the configuration:"
echo "   After completing the above steps, try signing in with Google again."
echo ""

echo "🔍 Common issues and solutions:"
echo "   - 'auth/internal-error': Usually means Firestore rules are too restrictive"
echo "   - 'auth/unauthorized-domain': Domain not added to Firebase authorized domains"
echo "   - 'auth/popup-blocked': Browser blocking popup, will fallback to redirect"
echo ""

echo "✅ Configuration script completed!"
echo "   Please follow the manual steps above in Firebase Console."
