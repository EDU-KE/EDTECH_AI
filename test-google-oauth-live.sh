#!/bin/bash

echo "🚀 TESTING GOOGLE OAUTH AFTER FULL SETUP"
echo "========================================="

echo ""
echo "📋 Starting comprehensive test..."
echo ""

# Kill any existing processes on port 9002
echo "🔧 Cleaning up existing processes..."
lsof -ti:9002 | xargs kill -9 2>/dev/null || true

echo ""
echo "🔥 Starting Next.js development server..."
echo "   This will run in the background"
echo "   URL: http://localhost:9002"
echo ""

# Start the development server in the background
npm run dev &
SERVER_PID=$!

echo "   Server PID: $SERVER_PID"
echo ""

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is running
if curl -s http://localhost:9002 > /dev/null; then
    echo "✅ Server is running!"
else
    echo "❌ Server failed to start"
    exit 1
fi

echo ""
echo "🧪 TESTING STEPS:"
echo "=================="
echo ""

echo "1. 🌐 Open your browser and navigate to:"
echo "   http://localhost:9002/login"
echo ""

echo "2. 👀 Open Browser DevTools (F12) and monitor:"
echo "   - Console tab (for errors)"
echo "   - Network tab (for failed requests)"
echo "   - Application tab → Cookies (for auth cookies)"
echo ""

echo "3. 🔍 Try Google Sign-In and check for these common errors:"
echo ""

echo "   ❌ auth/internal-error:"
echo "      → OAuth client not configured in Google Cloud Console"
echo "      → Go to: https://console.cloud.google.com/apis/credentials?project=last-35eb7"
echo "      → Create OAuth 2.0 Client ID if missing"
echo ""

echo "   ❌ auth/popup-blocked:"
echo "      → Browser is blocking popups"
echo "      → Allow popups for localhost:9002"
echo ""

echo "   ❌ auth/popup-closed-by-user:"
echo "      → You closed the popup"
echo "      → Try again and complete the sign-in"
echo ""

echo "   ❌ auth/unauthorized-domain:"
echo "      → Domain not authorized in Firebase"
echo "      → Go to: https://console.firebase.google.com/project/last-35eb7/authentication/settings"
echo "      → Add localhost to authorized domains"
echo ""

echo "   ❌ auth/invalid-oauth-client:"
echo "      → OAuth client configuration issue"
echo "      → Check redirect URIs in Google Cloud Console"
echo ""

echo "4. 🔧 If Google Sign-In works, verify:"
echo "   - Cookies are set (auth-token, user-role, session-expiry)"
echo "   - You're redirected to /dashboard"
echo "   - Dashboard is accessible without further authentication"
echo ""

echo "5. 🛡️ Test protected routes:"
echo "   - http://localhost:9002/dashboard"
echo "   - http://localhost:9002/profile"
echo "   - http://localhost:9002/settings"
echo ""

echo "📊 EXPECTED BEHAVIOR:"
echo "===================="
echo ""
echo "✅ Google Sign-In button is visible and clickable"
echo "✅ Clicking opens Google OAuth popup"
echo "✅ User can authenticate with Google account"
echo "✅ After authentication, cookies are set"
echo "✅ User is redirected to dashboard"
echo "✅ Protected routes are accessible"
echo "✅ No auth/internal-error in console"
echo ""

echo "🚨 TROUBLESHOOTING:"
echo "=================="
echo ""

echo "If you see auth/internal-error:"
echo "1. Check Google Cloud Console OAuth client configuration"
echo "2. Verify redirect URIs include: https://last-35eb7.firebaseapp.com/__/auth/handler"
echo "3. Ensure OAuth consent screen is configured"
echo "4. Add your email as test user in OAuth consent screen"
echo ""

echo "If popup doesn't open:"
echo "1. Check if browser is blocking popups"
echo "2. Allow popups for localhost:9002"
echo "3. Try incognito mode"
echo ""

echo "If authentication succeeds but routes are protected:"
echo "1. Check if cookies are set in DevTools"
echo "2. Verify middleware is recognizing cookies"
echo "3. Check console for middleware errors"
echo ""

echo "📞 IMMEDIATE HELP:"
echo "=================="
echo ""

echo "🔍 To debug in browser console:"
echo "   - Type: testGoogleOAuth()"
echo "   - This will show detailed error information"
echo ""

echo "🛠️ To check Firebase connection:"
echo "   - Open browser console"
echo "   - Look for Firebase initialization logs"
echo "   - Check for any Firebase-related errors"
echo ""

echo "📋 Configuration Links:"
echo "   - Google Cloud Console: https://console.cloud.google.com/apis/credentials?project=last-35eb7"
echo "   - OAuth Consent Screen: https://console.cloud.google.com/apis/credentials/consent?project=last-35eb7"
echo "   - Firebase Console: https://console.firebase.google.com/project/last-35eb7/authentication/providers"
echo ""

echo "⚡ NEXT STEPS:"
echo "============="
echo ""
echo "1. Open http://localhost:9002/login in your browser"
echo "2. Open DevTools (F12)"
echo "3. Try Google Sign-In"
echo "4. Share the exact error message if it fails"
echo "5. Check the configuration links above if needed"
echo ""

echo "🎯 MOST COMMON ISSUE:"
echo "The auth/internal-error typically means the OAuth client"
echo "is not properly configured in Google Cloud Console."
echo "Double-check the OAuth client setup!"
echo ""

echo "💡 TIP:"
echo "If everything was set up correctly, Google OAuth should work"
echo "immediately. The most common issue is missing redirect URIs"
echo "or the OAuth consent screen not being configured properly."
echo ""

echo "🔧 To stop the server later:"
echo "   kill $SERVER_PID"
echo ""

echo "📞 Server is running at: http://localhost:9002"
echo "🎉 Ready for testing!"

# Wait for user input to stop server
echo ""
echo "Press Enter to stop the server..."
read -r

echo "🛑 Stopping server..."
kill $SERVER_PID
echo "✅ Server stopped"
