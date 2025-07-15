#!/bin/bash

echo "🧪 GOOGLE OAUTH + MIDDLEWARE INTEGRATION TEST"
echo "============================================="

echo ""
echo "🔍 TESTING CURRENT CONFIGURATION"
echo "--------------------------------"

echo ""
echo "1. 📁 File Structure Check:"
echo ""

# Check critical files exist
files_to_check=(
    "src/middleware.ts"
    "src/lib/auth-context.tsx"
    "src/lib/google-auth.ts"
    "src/lib/firebase.ts"
    ".env.local"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

echo ""
echo "2. 🔧 Environment Variables Check:"
echo ""

if [ -f .env.local ]; then
    # Check Firebase config
    if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD" .env.local; then
        echo "✅ Firebase API Key configured"
    else
        echo "❌ Firebase API Key not configured"
    fi
    
    if grep -q "NEXT_PUBLIC_FIREBASE_PROJECT_ID=last-35eb7" .env.local; then
        echo "✅ Firebase Project ID: last-35eb7"
    else
        echo "❌ Firebase Project ID not configured"
    fi
    
    # Check if demo mode is disabled
    if grep -q "^DEMO_MODE=true" .env.local; then
        echo "⚠️  Demo mode is ENABLED - this may interfere with Google OAuth"
        echo "   Consider disabling demo mode for OAuth testing"
    else
        echo "✅ Demo mode is disabled"
    fi
else
    echo "❌ .env.local file not found"
fi

echo ""
echo "3. 🍪 Cookie Integration Check:"
echo ""

# Check if auth-context sets cookies
if grep -q "setAuthCookies" src/lib/auth-context.tsx; then
    echo "✅ setAuthCookies function exists"
    
    # Check if it's called in Google sign-in
    if grep -A 20 "signInWithGoogle" src/lib/auth-context.tsx | grep -q "setAuthCookies"; then
        echo "✅ Google sign-in calls setAuthCookies"
    else
        echo "❌ Google sign-in doesn't call setAuthCookies"
    fi
else
    echo "❌ setAuthCookies function not found"
fi

# Check if middleware validates cookies
if grep -q "auth-token" src/middleware.ts; then
    echo "✅ Middleware checks auth-token cookie"
else
    echo "❌ Middleware doesn't check auth-token cookie"
fi

echo ""
echo "4. 🔒 Security Integration Check:"
echo ""

# Check if middleware has security features
security_features=(
    "rate limiting"
    "CSRF protection"
    "XSS protection"
    "SQL injection protection"
    "path traversal protection"
)

for feature in "${security_features[@]}"; do
    if grep -qi "${feature// /}" src/middleware.ts; then
        echo "✅ $feature implemented"
    else
        echo "⚠️  $feature not explicitly found"
    fi
done

echo ""
echo "5. 📊 Authentication Flow Test:"
echo ""

echo "Testing authentication flow components..."

# Check Google auth service
if [ -f src/lib/google-auth.ts ]; then
    echo "✅ Google auth service exists"
    
    if grep -q "signInWithGoogle" src/lib/google-auth.ts; then
        echo "✅ Google sign-in function available"
    else
        echo "❌ Google sign-in function not found"
    fi
else
    echo "❌ Google auth service not found"
fi

# Check auth context integration
if grep -q "signInWithGoogle" src/lib/auth-context.tsx; then
    echo "✅ Auth context has Google sign-in integration"
else
    echo "❌ Auth context missing Google sign-in"
fi

echo ""
echo "6. 🎯 Protected Routes Test:"
echo ""

# Check if protected routes are defined
if grep -q "protectedRoutes" src/middleware.ts; then
    echo "✅ Protected routes defined in middleware"
    
    # List some protected routes
    echo "   Protected routes include:"
    grep -A 5 "protectedRoutes = {" src/middleware.ts | grep -E "'/[^']*':" | head -5 | while read line; do
        echo "     $line"
    done
else
    echo "❌ Protected routes not defined"
fi

echo ""
echo "7. 🔧 Common Issues Check:"
echo ""

# Check for common authentication issues
echo "Checking for common authentication issues..."

# Demo mode interference
if grep -q "isDemoMode" src/middleware.ts && grep -q "isDemoMode" src/lib/auth-context.tsx; then
    echo "✅ Demo mode handling consistent between middleware and auth context"
else
    echo "⚠️  Demo mode handling may be inconsistent"
fi

# Cookie domain issues
if grep -q "domain=" src/lib/auth-context.tsx; then
    echo "⚠️  Cookie domain restrictions found - may cause issues with localhost"
else
    echo "✅ No cookie domain restrictions (good for localhost)"
fi

# Session expiry handling
if grep -q "session-expiry" src/middleware.ts && grep -q "session-expiry" src/lib/auth-context.tsx; then
    echo "✅ Session expiry handling implemented"
else
    echo "❌ Session expiry handling incomplete"
fi

echo ""
echo "8. 📋 TESTING RECOMMENDATIONS:"
echo ""

echo "To test the Google OAuth + Middleware integration:"
echo ""
echo "Step 1: Start the development server"
echo "   npm run dev"
echo ""
echo "Step 2: Open browser and go to login page"
echo "   http://localhost:9002/login"
echo ""
echo "Step 3: Try Google Sign-In and monitor:"
echo "   - Browser console for errors"
echo "   - Network tab for failed requests"
echo "   - Application tab for cookies"
echo "   - Server logs for middleware activity"
echo ""
echo "Step 4: After successful Google sign-in, verify:"
echo "   - auth-token cookie is set"
echo "   - user-role cookie is set"
echo "   - session-expiry cookie is set"
echo "   - Protected routes are accessible"
echo ""
echo "Step 5: Test protected route access:"
echo "   - Go to http://localhost:9002/dashboard"
echo "   - Should be accessible without redirect"
echo "   - Check middleware logs for authentication"
echo ""

echo "📊 EXPECTED BEHAVIOR:"
echo "   ✅ Google sign-in popup opens"
echo "   ✅ User can authenticate with Google"
echo "   ✅ Cookies are set automatically"
echo "   ✅ Protected routes are accessible"
echo "   ✅ Middleware validates requests"
echo "   ✅ Session expiry works correctly"
echo ""

echo "🚨 TROUBLESHOOTING:"
echo "   - If Google sign-in fails: Check OAuth client configuration"
echo "   - If cookies not set: Check setAuthCookies function"
echo "   - If middleware denies access: Check cookie validation"
echo "   - If demo mode interferes: Disable demo mode"
echo ""

echo "🔧 NEXT STEPS:"
echo "1. Complete Google OAuth setup if not done"
echo "2. Test the authentication flow"
echo "3. Debug any issues found"
echo "4. Optimize performance if needed"
echo ""

echo "📞 SUPPORT RESOURCES:"
echo "   - Run: ./complete-oauth-setup.sh (for OAuth setup)"
echo "   - Run: ./middleware-optimization.sh (for middleware help)"
echo "   - Check: npm run dev (start development server)"
echo "   - Debug: Check browser console and network tab"
