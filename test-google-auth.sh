#!/bin/bash

echo "🚀 Starting Firebase emulators and testing Google Auth..."
echo "====================================================="

# Start Firebase emulators in the background
echo "🔄 Starting Firebase emulators..."
firebase emulators:start &
EMULATOR_PID=$!

# Wait for emulators to start
echo "⏳ Waiting for emulators to initialize..."
sleep 10

# Check if auth emulator is running
nc -z localhost 9099
if [ $? -eq 0 ]; then
    echo "✅ Auth emulator is running on port 9099"
else
    echo "❌ Auth emulator failed to start"
    exit 1
fi

echo "
🔧 Testing environment:
- Auth Emulator: http://localhost:9099
- Hosting: http://localhost:5000
- Firestore: http://localhost:8080
"

# Create a simple HTML file to test Google Auth
cat > public/auth-test.html << EOL
<!DOCTYPE html>
<html>
<head>
    <title>Google Auth Test</title>
    <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-auth.js"></script>
</head>
<body>
    <h2>Google Auth Test Page</h2>
    <button id="googleSignIn">Sign in with Google</button>
    <div id="userInfo"></div>

    <script>
        // Your Firebase config from .env
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

        document.getElementById('googleSignIn').addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    document.getElementById('userInfo').textContent = 
                        JSON.stringify(result.user, null, 2);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    document.getElementById('userInfo').textContent = 
                        'Error: ' + error.message;
                });
        });
    </script>
</body>
</html>
EOL

echo "
✅ Test page created at public/auth-test.html
🌐 Open http://localhost:5000/auth-test.html to test Google Sign-in

📋 Troubleshooting:
1. Make sure Google Auth is enabled in Firebase Console
2. Check browser console for errors
3. Verify authorized domains include localhost
4. Check if emulators are running properly

Press Ctrl+C to stop the emulators when done testing.
"

# Wait for the emulator process
wait $EMULATOR_PID
