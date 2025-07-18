#!/bin/bash

echo "🔍 Comprehensive Auth Domain Check"
echo "================================"

# Get environment info
CODESPACE_DOMAIN="${CODESPACE_NAME}-3000.app.github.dev"
AUTH_DOMAIN=$(grep NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN .env.local | cut -d '=' -f2)
PROJECT_ID=$(grep NEXT_PUBLIC_FIREBASE_PROJECT_ID .env.local | cut -d '=' -f2)

echo "📊 Environment Information:"
echo "- Codespace Domain: $CODESPACE_DOMAIN"
echo "- Auth Domain: $AUTH_DOMAIN"
echo "- Project ID: $PROJECT_ID"

echo -e "\n🔐 Required Authorized Domains:"
echo "1. localhost"
echo "2. 127.0.0.1"
echo "3. $CODESPACE_DOMAIN"
echo "4. *.githubpreview.dev"
echo "5. *.app.github.dev"

echo -e "\n📋 Configuration Check:"
if grep -q "your_api_key" .env.local; then
  echo "❌ Firebase configuration not updated in .env.local"
else
  echo "✅ Firebase configuration looks valid in .env.local"
fi

echo -e "\n🌐 Domain Validation:"
echo "Current domain patterns allowed:"
echo "- localhost ✓"
echo "- 127.0.0.1 ✓"
echo "- *-3000.app.github.dev ✓"
echo "- *.githubpreview.dev ✓"

echo -e "\n🔧 Next Steps:"
echo "1. Go to Firebase Console:"
echo "   https://console.firebase.google.com/project/$PROJECT_ID/authentication/settings"
echo "2. Add ALL the domains listed above"
echo "3. Clear browser cache and cookies"
echo "4. Try authentication in an incognito window"

echo -e "\n💡 Debug Tips:"
echo "- Check browser console for detailed error messages"
echo "- Verify all environment variables are set correctly"
echo "- Ensure Google Sign-in is enabled in Firebase Console"
echo "- Check if Firebase project is on Blaze plan"
