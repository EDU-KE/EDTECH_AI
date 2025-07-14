#!/bin/bash

echo "🔧 Localhost OAuth Configuration"
echo "==============================="
echo ""

PROJECT_ID="last-35eb7"
APP_URL="http://localhost:9002"

echo "📋 Current Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  App URL: $APP_URL"
echo "  Login URL: $APP_URL/login"
echo ""

echo "🔗 STEP 1: Configure Firebase Authorized Domains"
echo "Go to: https://console.firebase.google.com/project/$PROJECT_ID/authentication/providers"
echo ""
echo "Click 'Google' provider and ensure these domains are added:"
echo "  ✅ localhost"
echo "  ✅ 127.0.0.1"
echo ""

echo "🔗 STEP 2: Configure Google Cloud OAuth Settings"  
echo "Go to: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo ""
echo "Find your OAuth 2.0 Client ID and add these Authorized redirect URIs:"
echo "  ✅ http://localhost:9002/__/auth/handler"
echo "  ✅ http://localhost:3000/__/auth/handler (for future default port)"
echo "  ✅ https://localhost:9002/__/auth/handler"
echo ""

echo "⚡ QUICK ACCESS LINKS:"
echo "  🏠 Your App: $APP_URL"
echo "  🔐 Login Page: $APP_URL/login"
echo "  🔥 Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID"
echo "  ☁️  Google Cloud Console: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo ""

echo "✅ Notes for localhost development:"
echo "  • No propagation delay for localhost"
echo "  • Clear browser cache if you had previous OAuth errors"
echo "  • Localhost should work immediately after configuration"
echo ""

echo "🚀 Your system is ready at: $APP_URL"
