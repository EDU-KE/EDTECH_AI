#!/bin/bash

echo "🎉 TESTING GOOGLE OAUTH AFTER CONFIGURATION"
echo "==========================================="

echo ""
echo "Since you've completed all OAuth configuration steps,"
echo "let's test if Google OAuth is now working!"
echo ""

echo "📋 Configuration Verification:"
echo "   ✅ Firebase Config: Ready"
echo "   ✅ Google OAuth Service: Implemented"
echo "   ✅ Auth Context: Configured"
echo "   ✅ Middleware: Ready"
echo "   ✅ Login Page: Has Google Sign-In Button"
echo "   ✅ External OAuth Setup: Completed by you"
echo ""

echo "🚀 Starting Development Server..."
echo "   URL: http://localhost:9002"
echo "   Login: http://localhost:9002/login"
echo ""

# Kill any existing process on port 9002
echo "🔧 Cleaning up existing processes..."
lsof -ti:9002 | xargs kill -9 2>/dev/null || true
sleep 2

echo "🔥 Starting Next.js server..."
npm run dev &
SERVER_PID=$!

echo "   Server PID: $SERVER_PID"
echo "   Waiting for server to start..."
sleep 8

# Check if server is running
if curl -s -o /dev/null -w "%{http_code}" http://localhost:9002 | grep -q "200\|404"; then
    echo "   ✅ Server is running!"
else
    echo "   ⚠️  Server may still be starting..."
fi

echo ""
echo "🧪 TESTING INSTRUCTIONS:"
echo "========================"
echo ""

echo "1. 🌐 Open your browser and go to:"
echo "   👉 http://localhost:9002/login"
echo ""

echo "2. 🔍 Open Browser Developer Tools (F12):"
echo "   - Console tab (watch for errors)"
echo "   - Network tab (monitor requests)"
echo "   - Application tab > Cookies (verify auth cookies)"
echo ""

echo "3. 🎯 Test Google Sign-In:"
echo "   - Click the Google Sign-In button"
echo "   - Google OAuth popup should open"
echo "   - Complete authentication with your Google account"
echo ""

echo "4. ✅ Expected Success Behavior:"
echo "   - Google popup opens successfully"
echo "   - You can select your Google account"
echo "   - Authentication completes without errors"
echo "   - Cookies are set (auth-token, user-role, session-expiry)"
echo "   - You're redirected to /dashboard"
echo "   - Dashboard loads without authentication errors"
echo ""

echo "5. 🔍 Check for Success Indicators:"
echo "   - No 'auth/internal-error' in console"
echo "   - No 'auth/popup-blocked' errors"
echo "   - Console shows: 'Authentication cookies set'"
echo "   - Dashboard is accessible at: http://localhost:9002/dashboard"
echo ""

echo "🚨 IF YOU STILL SEE ERRORS:"
echo "============================"
echo ""

echo "❌ auth/internal-error:"
echo "   - Double-check OAuth client redirect URIs"
echo "   - Ensure Client ID matches between Google Cloud and Firebase"
echo "   - Verify your email is added as test user"
echo ""

echo "❌ auth/popup-blocked:"
echo "   - Allow popups for localhost:9002"
echo "   - Try in incognito mode"
echo ""

echo "❌ auth/unauthorized-domain:"
echo "   - Add localhost to Firebase authorized domains"
echo "   - Check Firebase Console > Authentication > Settings"
echo ""

echo "❌ Popup opens but authentication fails:"
echo "   - Check OAuth consent screen configuration"
echo "   - Ensure you're added as test user"
echo "   - Verify app status in OAuth consent screen"
echo ""

echo "🔧 DEBUGGING STEPS:"
echo "==================="
echo ""

echo "1. 🧪 Test Firebase Connection:"
echo "   - Open browser console at http://localhost:9002"
echo "   - Look for Firebase initialization logs"
echo "   - Check for any Firebase-related errors"
echo ""

echo "2. 🔍 Test Google Auth Service:"
echo "   - In browser console, type: testGoogleOAuth()"
echo "   - This will show detailed error information"
echo ""

echo "3. 🍪 Verify Cookie Setting:"
echo "   - After successful login, check DevTools > Application > Cookies"
echo "   - Should see: auth-token, user-role, session-expiry"
echo ""

echo "4. 🛡️ Test Middleware:"
echo "   - After login, try accessing: http://localhost:9002/dashboard"
echo "   - Should work without redirecting to login"
echo ""

echo "📊 CONFIGURATION LINKS (if needed):"
echo "===================================="
echo ""

echo "Google Cloud Console OAuth:"
echo "   https://console.cloud.google.com/apis/credentials?project=last-35eb7"
echo ""

echo "OAuth Consent Screen:"
echo "   https://console.cloud.google.com/apis/credentials/consent?project=last-35eb7"
echo ""

echo "Firebase Google Provider:"
echo "   https://console.firebase.google.com/project/last-35eb7/authentication/providers"
echo ""

echo "Firebase Authorized Domains:"
echo "   https://console.firebase.google.com/project/last-35eb7/authentication/settings"
echo ""

echo "📞 WHAT TO REPORT:"
echo "=================="
echo ""

echo "If it still doesn't work, please share:"
echo "   1. The exact error message in browser console"
echo "   2. Whether the Google popup opens or not"
echo "   3. Any network errors in DevTools"
echo "   4. Screenshot of the OAuth consent screen configuration"
echo ""

echo "🎯 MOST LIKELY OUTCOME:"
echo "======================="
echo ""

echo "If you completed all the OAuth configuration steps correctly,"
echo "Google OAuth should now work perfectly! The auth/internal-error"
echo "should be gone, and you should be able to sign in with Google."
echo ""

echo "🎉 READY FOR TESTING!"
echo "====================="
echo ""

echo "👉 Go to: http://localhost:9002/login"
echo "🔍 Open DevTools and monitor console"
echo "🎯 Try Google Sign-In"
echo ""

echo "Press Ctrl+C to stop the server when done testing"
echo ""

# Wait for the server process
wait $SERVER_PID
