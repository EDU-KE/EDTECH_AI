#!/bin/bash

echo "🔍 TESTING FIREBASE GOOGLE AUTH SYSTEM"
echo "======================================"

echo ""
echo "Since you've confirmed OAuth is set up correctly, let's test our system:"
echo ""

echo "1. 🚀 Starting development server..."
npm run dev &
SERVER_PID=$!

echo "   Server PID: $SERVER_PID"
echo "   Waiting for server to start..."
sleep 8

echo ""
echo "2. 🧪 Testing Firebase Configuration..."
echo ""

# Test if server is running
if curl -s http://localhost:9002 > /dev/null; then
    echo "   ✅ Server is running"
else
    echo "   ❌ Server failed to start"
    exit 1
fi

echo ""
echo "3. 🔍 Now test Google OAuth in browser:"
echo ""

echo "   A. Open: http://localhost:9002/login"
echo "   B. Open DevTools (F12)"
echo "   C. In console, run: diagnoseGoogleAuthError()"
echo "   D. Try Google Sign-In and share the console output"
echo ""

echo "4. 🔧 What to look for in console:"
echo ""

echo "   ✅ Firebase configuration logs"
echo "   ✅ Google provider setup"
echo "   ✅ Detailed error analysis"
echo "   ✅ Configuration checks"
echo ""

echo "5. 📊 Common system issues that cause auth/internal-error:"
echo ""

echo "   ❌ Firebase not properly initialized"
echo "   ❌ Google provider not configured in Firebase"
echo "   ❌ Environment variables not loading"
echo "   ❌ Import path issues"
echo "   ❌ Auth domain mismatch"
echo ""

echo "6. 🎯 Expected console output:"
echo ""

echo "   If OAuth is configured correctly but system has issues:"
echo "   - You'll see specific Firebase configuration details"
echo "   - Error will show exact cause of auth/internal-error"
echo "   - We can then fix the system code"
echo ""

echo "📞 READY FOR TESTING:"
echo "===================="
echo ""

echo "👉 Go to: http://localhost:9002/login"
echo "🔍 Open DevTools console"
echo "🧪 Run: diagnoseGoogleAuthError()"
echo "📋 Share the console output"
echo ""

echo "Press Enter to stop the server..."
read -r

echo "🛑 Stopping server..."
kill $SERVER_PID
echo "✅ Server stopped"
