#!/bin/bash

echo "🔍 Verifying Firebase Auth Setup"
echo "==============================="

# Check environment variables
echo "📋 Checking environment variables..."
env_vars=(
  "NEXT_PUBLIC_FIREBASE_API_KEY"
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
)

for var in "${env_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing $var"
  else
    echo "✅ $var is set"
  fi
done

# Check domain configuration
echo -e "\n📡 Checking domain configuration..."
CURRENT_DOMAIN=$(echo "${CODESPACE_NAME:-localhost}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-localhost}")
echo "Current domain: $CURRENT_DOMAIN"

# Check Firebase files
echo -e "\n📁 Checking Firebase initialization files..."
FILES_TO_CHECK=(
  "src/lib/firebase.ts"
  "src/lib/google-auth.ts"
  "src/app/head.tsx"
)

for file in "${FILES_TO_CHECK[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ Missing $file"
  fi
done

echo -e "\n🔧 Next steps:"
echo "1. Verify these domains are added to Firebase Console:"
echo "   - localhost"
echo "   - 127.0.0.1"
echo "   - $CURRENT_DOMAIN"
echo "   - *.githubpreview.dev"
echo "2. Clear browser cache and cookies"
echo "3. Try authentication in a private/incognito window"
echo "4. Check browser console for detailed error messages"
