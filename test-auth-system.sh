#!/bin/bash

echo "🔍 Testing Google Authentication System..."
echo "========================================"

# Check environment variables
echo "1️⃣ Checking Firebase Configuration..."
if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY=.*your_api_key_here" .env; then
    echo "❌ Firebase API key not configured"
    exit 1
else
    echo "✅ Firebase API key configured"
fi

# Check if Firebase project is accessible
echo -e "\n2️⃣ Checking Firebase Project Access..."
firebase projects:list | grep last-35eb7 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Firebase project accessible"
else
    echo "❌ Firebase project not accessible"
    exit 1
fi

# Start emulators and test server
echo -e "\n3️⃣ Starting Firebase emulators..."
firebase emulators:start --only auth,firestore &
EMULATOR_PID=$!

# Wait for emulators to start
sleep 5

# Create test page
echo -e "\n4️⃣ Creating test page..."
mkdir -p public
cat > public/test-auth.html << EOL
<!DOCTYPE html>
<html>
<head>
    <title>Auth Test</title>
    <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-auth.js"></script>
    <script>
        const firebaseConfig = {
            apiKey: "${NEXT_PUBLIC_FIREBASE_API_KEY}",
            authDomain: "${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}",
            projectId: "${NEXT_PUBLIC_FIREBASE_PROJECT_ID}",
            storageBucket: "${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}",
            messagingSenderId: "${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}",
            appId: "${NEXT_PUBLIC_FIREBASE_APP_ID}"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        
        // Connect to auth emulator
        if (location.hostname === "localhost") {
            firebase.auth().useEmulator('http://localhost:9099');
        }

        function testPopupSignIn() {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    console.log('Popup sign-in successful:', result.user.email);
                    document.getElementById('status').textContent = '✅ Popup sign-in successful';
                })
                .catch((error) => {
                    console.error('Popup sign-in error:', error);
                    document.getElementById('status').textContent = '❌ Error: ' + error.message;
                    // Try redirect if popup fails
                    if (error.code === 'auth/popup-blocked') {
                        testRedirectSignIn();
                    }
                });
        }

        function testRedirectSignIn() {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithRedirect(provider)
                .catch((error) => {
                    console.error('Redirect sign-in error:', error);
                    document.getElementById('status').textContent = '❌ Error: ' + error.message;
                });
        }

        // Check for redirect result
        firebase.auth().getRedirectResult()
            .then((result) => {
                if (result.user) {
                    console.log('Redirect sign-in successful:', result.user.email);
                    document.getElementById('status').textContent = '✅ Redirect sign-in successful';
                }
            })
            .catch((error) => {
                console.error('Redirect result error:', error);
            });
    </script>
</head>
<body>
    <h2>Google Auth Test</h2>
    <button onclick="testPopupSignIn()">Test Popup Sign-in</button>
    <button onclick="testRedirectSignIn()">Test Redirect Sign-in</button>
    <div id="status"></div>
</body>
</html>
EOL

# Start the development server
echo -e "\n5️⃣ Starting development server..."
npm run dev &
DEV_SERVER_PID=$!

# Wait for server to start
sleep 5

echo -e "\n✅ Test environment ready!"
echo "
📋 Test Instructions:
1. Open http://localhost:3000/test-auth.html
2. Try both Popup and Redirect sign-in buttons
3. Check browser console for detailed logs
4. Verify user creation in Firestore

🔍 Watch for these errors:
- Popup blocked: Browser is blocking popups
- Unauthorized domain: Domain not added in Firebase Console
- Configuration error: Firebase config issues
- Network error: Connection problems

Press Ctrl+C to stop the test servers
"

# Wait for user to finish testing
wait $EMULATOR_PID
