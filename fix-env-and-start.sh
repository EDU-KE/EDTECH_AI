#!/bin/bash

# Fix Environment Variables and Start Dev Server
echo "🔧 Fixing Environment Variables and Starting Dev Server"
echo "======================================================"
echo ""

echo "📋 Current Environment Status:"
echo "NODE_ENV: $NODE_ENV"
echo "NEXT_PUBLIC_FIREBASE_API_KEY: $([ -n "$NEXT_PUBLIC_FIREBASE_API_KEY" ] && echo "Present" || echo "Missing")"
echo ""

echo "🔍 Checking .env.local file..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    echo "Content preview:"
    head -5 .env.local
else
    echo "❌ .env.local file missing"
    echo "Creating .env.local file..."
    
    cat > .env.local << 'EOF'
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD05R5TMWg9QcWqkEVZnw-STsZgzY_Xe9k
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=last-35eb7.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=last-35eb7
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=last-35eb7.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=760347188535
NEXT_PUBLIC_FIREBASE_APP_ID=1:760347188535:web:7b0a5b17d87aa38b430eb2
NODE_ENV=development
EOF
    
    echo "✅ Created .env.local file"
fi

echo ""
echo "🔄 Loading environment variables explicitly..."
set -a
source .env.local
set +a

echo "📋 Environment Variables After Loading:"
echo "NEXT_PUBLIC_FIREBASE_API_KEY: $([ -n "$NEXT_PUBLIC_FIREBASE_API_KEY" ] && echo "Present" || echo "Missing")"
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID: $NEXT_PUBLIC_FIREBASE_PROJECT_ID"
echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: $NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"

echo ""
echo "🚀 Starting Next.js Dev Server..."
echo "This will start the server on port 9002"
echo "Access your app at: https://fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev"
echo ""
echo "🔧 After the server starts:"
echo "1. Go to the login page"
echo "2. Open browser console (F12)"
echo "3. Try Google sign-in"
echo "4. Check if demo mode banner is gone"
echo ""

# Start the dev server
npm run dev
