#!/bin/bash

# Firebase OAuth Configuration Helper Script
# This script helps configure authorized domains for OAuth

echo "🔧 Firebase OAuth Configuration Helper"
echo "======================================"
echo ""

PROJECT_ID="last-35eb7"
CURRENT_DOMAIN="localhost"

echo "📋 Current Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Current Domain: $CURRENT_DOMAIN"
echo "  Current Port: 9004"
echo ""

echo "🔗 To fix the 403 error, you need to:"
echo ""
echo "1. Go to Firebase Console:"
echo "   https://console.firebase.google.com/project/$PROJECT_ID/authentication/providers"
echo ""
echo "2. Click on 'Google' provider"
echo ""
echo "3. In the 'Authorized domains' section, add:"
echo "   - localhost"
echo "   - 127.0.0.1"
echo ""
echo "4. If using Codespaces, also add your Codespace domain:"
echo "   - $(hostname).github.dev"
echo "   - $(hostname)-9004.app.github.dev"
echo ""
echo "5. Click 'Save'"
echo ""

echo "🌐 Google Cloud Console (Alternative method):"
echo "   https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo ""
echo "   In OAuth 2.0 Client IDs, add to 'Authorized redirect URIs':"
echo "   - http://localhost:9004/__/auth/handler"
echo "   - https://localhost:9004/__/auth/handler"
echo ""

echo "✅ After making these changes, refresh your browser and try again."
