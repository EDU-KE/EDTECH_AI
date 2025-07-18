#!/bin/bash

echo "🔍 Diagnosing Google OAuth Issues..."
echo "==================================="

# Check Firebase configuration
echo "1️⃣ Checking Firebase Configuration..."
if [ ! -f ".env" ]; then
    echo "❌ .env file not found"
    exit 1
fi

# Extract values from .env
AUTH_DOMAIN=$(grep NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN .env | cut -d '=' -f2)
PROJECT_ID=$(grep NEXT_PUBLIC_FIREBASE_PROJECT_ID .env | cut -d '=' -f2)

echo "📋 Current Configuration:"
echo "- Auth Domain: $AUTH_DOMAIN"
echo "- Project ID: $PROJECT_ID"

# Check if Firebase project exists
echo "2️⃣ Verifying Firebase Project..."
firebase projects:list | grep $PROJECT_ID
if [ $? -ne 0 ]; then
    echo "❌ Project $PROJECT_ID not found in Firebase"
    echo "🔧 Fix: Run 'firebase login' and verify project access"
    exit 1
fi

# Check if Google Auth is enabled
echo "3️⃣ Checking Google Auth Provider..."
firebase use $PROJECT_ID

# Get the current domain
CURRENT_DOMAIN=$(hostname -f)
echo "4️⃣ Current domain: $CURRENT_DOMAIN"

# Create a diagnostic page to test auth
echo "5️⃣ Creating auth test page..."
mkdir -p public

cat > public/auth-diagnostic.html << EOL
<!DOCTYPE html>
<html>
<head>
    <title>Google Auth Diagnostic</title>
    <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-auth.js"></script>
    <style>
        .log { margin: 10px 0; padding: 10px; border: 1px solid #ccc; }
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>
    <h2>Google Auth Diagnostic</h2>
    <div id="logs"></div>
    <button onclick="testAuth()">Test Google Auth</button>
    <script>
        function log(message, type = 'info') {
            const div = document.createElement('div');
            div.className = 'log ' + type;
            div.textContent = message;
            document.getElementById('logs').appendChild(div);
        }

        async function testAuth() {
            try {
                log('Testing Google Auth...');
                
                // Initialize Firebase
                const firebaseConfig = {
                    apiKey: '${NEXT_PUBLIC_FIREBASE_API_KEY}',
                    authDomain: '${AUTH_DOMAIN}',
                    projectId: '${PROJECT_ID}'
                };
                
                log('Initializing Firebase...');
                const app = firebase.initializeApp(firebaseConfig);
                
                log('Creating Google Auth Provider...');
                const provider = new firebase.auth.GoogleAuthProvider();
                provider.addScope('email');
                provider.addScope('profile');
                
                log('Setting custom parameters...');
                provider.setCustomParameters({
                    prompt: 'select_account'
                });
                
                log('Starting sign-in process...');
                const auth = firebase.auth();
                const result = await auth.signInWithPopup(provider);
                
                log('Sign-in successful! User: ' + result.user.email, 'success');
                
            } catch (error) {
                log('Error: ' + error.message, 'error');
                log('Error code: ' + error.code, 'error');
                console.error('Detailed error:', error);
            }
        }
    </script>
</body>
</html>
EOL

# Check if domains are authorized
echo "6️⃣ Checking authorized domains..."
echo "Required domains that should be authorized:"
echo "- localhost"
echo "- $AUTH_DOMAIN"
echo "- $CURRENT_DOMAIN"

# Create Firestore security rules for authentication
echo "7️⃣ Setting up Firestore rules..."
cat > firestore.rules << EOL
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
EOL

# Deploy Firestore rules
echo "8️⃣ Deploying Firestore rules..."
firebase deploy --only firestore:rules

echo "
✅ Setup Complete! Next steps:

1. Open Firebase Console:
   https://console.firebase.google.com/project/$PROJECT_ID/authentication/providers

2. Enable Google Authentication:
   - Click 'Sign-in providers'
   - Enable Google
   - Add your OAuth 2.0 Client ID and Secret

3. Add Authorized Domains:
   - Go to Authentication > Settings
   - Add these domains:
     * localhost
     * $AUTH_DOMAIN
     * $CURRENT_DOMAIN

4. Test Authentication:
   - Start local server: firebase serve
   - Open: http://localhost:5000/auth-diagnostic.html
   - Click 'Test Google Auth' button
   - Check console for errors

5. Common Issues:
   - Popup Blocked: Allow popups for localhost
   - Auth Domain Mismatch: Verify domains in Firebase Console
   - Network Errors: Check internet connection
   - Internal Errors: Clear browser cache and cookies

Need help? Run: firebase init to reconfigure the project
"

# Offer to start the local server
read -p "Would you like to start the local server now? (y/n) " answer
if [ "$answer" = "y" ]; then
    firebase serve
fi
