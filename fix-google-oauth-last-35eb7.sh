#!/bin/bash

echo "🔧 Google OAuth Configuration Fix for Project: last-35eb7"
echo "========================================================"
echo ""

echo "🔍 CURRENT STATUS:"
echo "✅ Firebase Project: last-35eb7"
echo "✅ Provider ID: project-760347188535"
echo "✅ Environment variables configured"
echo "❌ Google OAuth provider not enabled"
echo ""

echo "🎯 EXACT SOLUTION:"
echo ""
echo "1. 📱 OPEN FIREBASE CONSOLE:"
echo "   https://console.firebase.google.com/project/last-35eb7/authentication/providers"
echo ""

echo "2. 🔧 ENABLE GOOGLE AUTHENTICATION:"
echo "   • Look for 'Google' in the Sign-in providers list"
echo "   • Click on the Google provider"
echo "   • Toggle the 'Enable' switch to ON"
echo "   • Click 'Save' or 'Done'"
echo ""

echo "3. 🌐 ADD AUTHORIZED DOMAINS:"
echo "   Go to: https://console.firebase.google.com/project/last-35eb7/authentication/settings"
echo "   Add these domains to the 'Authorized domains' list:"
echo "   • localhost (for development)"
echo "   • 127.0.0.1 (for local testing)"
echo "   • fictional-space-guide-x556vjvrxwx53p4gp.github.dev (your Codespace)"
echo ""

echo "4. 🔄 REFRESH & TEST:"
echo "   • Refresh your browser"
echo "   • Try Google sign-in again"
echo ""

echo "⚡ ALTERNATIVE - EMAIL/PASSWORD:"
echo "   Your email/password authentication is working!"
echo "   Users can sign up/in while you configure Google OAuth."
echo ""

echo "📞 SUPPORT LINKS:"
echo "   • Firebase Console: https://console.firebase.google.com/project/last-35eb7"
echo "   • Google Cloud Console: https://console.cloud.google.com"
echo "   • Firebase Auth Docs: https://firebase.google.com/docs/auth"
echo ""

echo "🚀 Your app is running at: http://127.0.0.1:9002"
