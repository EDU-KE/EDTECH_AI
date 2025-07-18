#!/bin/bash

echo "🔧 Fixing Firebase Auth Configuration"
echo "==================================="

# Get current domain
DOMAIN=$(echo "${CODESPACE_NAME}-3000.githubpreview.dev")
echo "📝 Current domain: $DOMAIN"

# Check Firebase configuration
if [ ! -f ".env.local" ]; then
    echo "❌ Missing .env.local file"
    echo "Creating .env.local with Firebase configuration..."
    
    cat > .env.local << EOL
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
EOL

    echo "✅ Created .env.local template"
    echo "⚠️ Please fill in the actual values from Firebase Console"
fi

echo "📋 Next steps:"
echo "1. Go to Firebase Console: https://console.firebase.google.com"
echo "2. Add this domain to authorized domains: $DOMAIN"
echo "3. Fill in the .env.local file with your Firebase configuration"
echo "4. Restart the development server"
echo ""
echo "🌐 To add authorized domain:"
echo "1. Open Firebase Console"
echo "2. Go to Authentication > Settings"
echo "3. Add domain: $DOMAIN"
echo ""
echo "🔄 After configuration:"
echo "1. Run: npm run dev"
echo "2. Open: https://$DOMAIN"
echo "3. Try Google sign-in again"
