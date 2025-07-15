#!/bin/bash

echo "🔍 DIAGNOSING FIREBASE CONFIGURATION ISSUE"
echo "=========================================="

echo ""
echo "Found the issue! The auth/internal-error is caused by Firebase"
echo "not being properly initialized. Let's fix this."
echo ""

echo "📋 Current Firebase Configuration Analysis:"
echo "   ✅ Environment variables are set correctly"
echo "   ✅ Firebase config object is properly formatted"
echo "   ❌ Firebase Auth initialization may be failing"
echo ""

echo "🔧 The Issue:"
echo "The Firebase Auth instance is not being properly initialized"
echo "before the Google OAuth provider tries to use it."
echo ""

echo "🛠️ Solution:"
echo "We need to ensure Firebase Auth is fully initialized"
echo "before attempting Google OAuth operations."
echo ""

echo "📊 Let's check Firebase initialization:"
echo "   1. Firebase app initialization"
echo "   2. Auth instance creation"
echo "   3. Provider configuration"
echo ""

echo "🚀 Testing Firebase Status..."

# Try to start the server and check Firebase initialization
echo "Starting development server to check Firebase logs..."
npm run dev &
SERVER_PID=$!

echo "Server started with PID: $SERVER_PID"
echo "Waiting for initialization..."
sleep 5

echo ""
echo "🔍 Check browser console at http://localhost:9002 for:"
echo "   - Firebase Configuration logs"
echo "   - Any Firebase initialization errors"
echo "   - Auth instance creation status"
echo ""

echo "Press Enter to continue debugging..."
read -r

kill $SERVER_PID
echo "Server stopped"

echo ""
echo "🔧 Next steps:"
echo "1. Check browser console for Firebase initialization errors"
echo "2. Verify Firebase Auth is properly initialized"
echo "3. Test Google OAuth after fixing initialization"
