#!/bin/bash

echo "🔍 Checking Google Auth Configuration..."
echo "======================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI is installed"
fi

# Check if we're logged in to Firebase
firebase projects:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Not logged in to Firebase. Please login:"
    firebase login
else
    echo "✅ Firebase login verified"
fi

# Get the project ID from .env file
PROJECT_ID=$(grep NEXT_PUBLIC_FIREBASE_PROJECT_ID .env | cut -d '=' -f2)
echo "📂 Project ID: $PROJECT_ID"

# Check if Google Auth is enabled
echo "🔍 Checking Google Auth provider status..."
firebase use $PROJECT_ID
firebase apps:list --json | grep "googleAuthEnabled"

# Check authorized domains
echo "🌐 Checking authorized domains..."
CURRENT_DOMAIN=$(curl -s ipinfo.io/ip)
echo "Current IP: $CURRENT_DOMAIN"

# Print helpful information
echo "
🔧 To enable Google Auth, follow these steps:

1. Go to Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID/authentication/providers
2. Click on Google provider
3. Enable it if not already enabled
4. Add authorized domains:
   - localhost
   - $PROJECT_ID.firebaseapp.com
   - $CURRENT_DOMAIN
   
5. Configure OAuth consent screen:
   - Go to https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID
   - Set up OAuth consent screen if not done
   - Add authorized JavaScript origins

6. Update authorized domains in Firebase:
   firebase hosting:sites:list
   firebase hosting:channel:deploy preview_channel
"

# Check if emulators are running
nc -z localhost 9099 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Firebase Auth emulator is running"
else
    echo "ℹ️ Firebase Auth emulator is not running"
    echo "To start emulators, run: firebase emulators:start"
fi

echo "
📋 Next steps:
1. Run 'firebase init' if not already initialized
2. Enable Google Authentication in Firebase Console
3. Add all development domains to authorized domains
4. Test authentication flow with emulators first
"
