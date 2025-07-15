#!/bin/bash

# Get Authorized Domains for Firebase
echo "🔧 Firebase Authorized Domains Setup"
echo "===================================="
echo ""

echo "📋 Your Firebase Project Details:"
echo "Project ID: last-35eb7"
echo "Current Codespace: ${CODESPACE_NAME}"
echo ""

echo "🌐 Domains to Add to Firebase Console:"
echo "1. localhost"
echo "2. 127.0.0.1"
echo "3. ${CODESPACE_NAME}-3000.githubpreview.dev"
echo "4. ${CODESPACE_NAME}-3000.app.github.dev"
echo "5. ${CODESPACE_NAME}-9002.githubpreview.dev"
echo "6. ${CODESPACE_NAME}-9002.app.github.dev"
echo ""

echo "🔗 Direct Link to Firebase Console:"
echo "https://console.firebase.google.com/project/last-35eb7/authentication/settings"
echo ""

echo "📋 Steps to Add Domains:"
echo "1. Click the link above"
echo "2. Scroll to 'Authorized domains' section"
echo "3. Click 'Add domain' button"
echo "4. Add each domain from the list above"
echo "5. Click 'Save' after each addition"
echo ""

echo "🚀 Current Development Server Info:"
echo "Port: 9002 (as configured in package.json)"
echo "URL: https://${CODESPACE_NAME}-9002.githubpreview.dev"
echo ""

echo "✅ Environment Status:"
echo "Firebase Config: $([ -n "$NEXT_PUBLIC_FIREBASE_API_KEY" ] && echo "Present" || echo "Missing")"
echo "DeepSeek API: $([ -n "$DEEPSEEK_API_KEY" ] && echo "Present" || echo "Missing")"
echo "Demo Mode: $([ -n "$DEMO_MODE" ] && echo "Enabled" || echo "Disabled")"
echo ""

echo "🎯 Next Steps:"
echo "1. Add the domains listed above to Firebase Console"
echo "2. Start development server: npm run dev"
echo "3. Test authentication on the login page"
echo "4. Google sign-in should work without domain errors"
