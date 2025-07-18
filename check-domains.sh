#!/bin/bash

echo "🔍 Firebase Auth Domain Verification"
echo "=================================="

# Get current domain
CURRENT_DOMAIN=$(echo "${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-githubpreview.dev}")
AUTH_DOMAIN="last-35eb7.firebaseapp.com"

echo "Current domain: $CURRENT_DOMAIN"
echo "Firebase Auth Domain: $AUTH_DOMAIN"

# Verify Firebase configuration
echo -e "\n📋 Verifying Firebase Configuration..."
env_vars=(
  "NEXT_PUBLIC_FIREBASE_API_KEY"
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
)

for var in "${env_vars[@]}"; do
  value="${!var}"
  if [ -n "$value" ] && [ "$value" != "your_api_key" ] && [ "$value" != "your_auth_domain" ] && [ "$value" != "your_project_id" ]; then
    echo "✅ $var: Configured correctly"
  else
    echo "❌ $var: Missing or invalid"
  fi
done

echo -e "\n🌐 Required Authorized Domains:"
echo "1. localhost"
echo "2. 127.0.0.1"
echo "3. $CURRENT_DOMAIN"
echo "4. *.githubpreview.dev"

echo -e "\n📝 Next Steps:"
echo "1. Go to Firebase Console: https://console.firebase.google.com/project/last-35eb7/authentication/settings"
echo "2. Add the above domains if not already present"
echo "3. Clear browser cache and cookies"
echo "4. Try signing in using an incognito window"
