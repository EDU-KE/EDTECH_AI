#!/bin/bash

echo "🔥 Firebase Google OAuth Configuration Checker"
echo "=============================================="

# Check if Firebase CLI is installed
if command -v firebase >/dev/null 2>&1; then
    echo "✅ Firebase CLI is installed"
    
    # Check if user is logged in
    if firebase projects:list >/dev/null 2>&1; then
        echo "✅ Firebase CLI is authenticated"
        
        # Check current project
        echo ""
        echo "📋 Current Firebase project info:"
        firebase use
        
        echo ""
        echo "🔍 Checking authentication providers..."
        echo "To configure Google OAuth:"
        echo "1. Run: firebase open auth"
        echo "2. Go to Sign-in methods"
        echo "3. Enable Google provider"
        echo "4. Configure OAuth consent screen if needed"
        
    else
        echo "❌ Firebase CLI not authenticated"
        echo "Run: firebase login"
    fi
else
    echo "❌ Firebase CLI not installed"
    echo "Install with: npm install -g firebase-tools"
fi

echo ""
echo "🌐 Current environment variables:"
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${NEXT_PUBLIC_FIREBASE_PROJECT_ID:-'Not set'}"
echo "NEXT_PUBLIC_FIREBASE_API_KEY: ${NEXT_PUBLIC_FIREBASE_API_KEY:0:10}... (truncated)"

echo ""
echo "📝 Quick fixes:"
echo "1. Enable Google in Firebase Console: https://console.firebase.google.com/project/${NEXT_PUBLIC_FIREBASE_PROJECT_ID:-'your-project'}/authentication/providers"
echo "2. Add authorized domains (localhost for development)"
echo "3. Restart your development server: npm run dev"

echo ""
echo "🚀 For immediate testing, use email/password authentication in the app"
