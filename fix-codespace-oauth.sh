#!/bin/bash

echo "🔧 GitHub Codespace OAuth Fix"
echo "============================="
echo ""

CODESPACE_DOMAIN="$CODESPACE_NAME.github.dev"
PROJECT_ID="last-35eb7"

echo "📋 Your Codespace Configuration:"
echo "  Codespace Name: $CODESPACE_NAME" 
echo "  Codespace Domain: $CODESPACE_DOMAIN"
echo "  App URL: https://$CODESPACE_DOMAIN:9004"
echo ""

echo "🔗 STEP 1: Fix Firebase Authorized Domains"
echo "Go to: https://console.firebase.google.com/project/$PROJECT_ID/authentication/providers"
echo ""
echo "Click 'Google' provider and add these domains:"
echo "  ✅ $CODESPACE_DOMAIN"
echo "  ✅ localhost (for local development)"
echo ""

echo "🔗 STEP 2: Fix Google Cloud OAuth Settings"  
echo "Go to: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo ""
echo "Find your OAuth 2.0 Client ID and add these Authorized redirect URIs:"
echo "  ✅ https://$CODESPACE_DOMAIN:9004/__/auth/handler"
echo "  ✅ http://localhost:9004/__/auth/handler"
echo "  ✅ https://localhost:9004/__/auth/handler"
echo ""

echo "🔗 STEP 3: Update OAuth Consent Screen (if needed)"
echo "Go to: https://console.cloud.google.com/apis/credentials/consent?project=$PROJECT_ID"
echo ""
echo "Add authorized domain: $CODESPACE_DOMAIN"
echo ""

echo "⚡ QUICK ACCESS LINKS:"
echo "  Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID"
echo "  Google Cloud Console: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo "  Your App: https://$CODESPACE_DOMAIN:9004"
echo ""

echo "✅ After making these changes:"
echo "  1. Wait 5-10 minutes for changes to propagate"
echo "  2. Clear browser cache/cookies for the domain"
echo "  3. Try Google sign-in again"
