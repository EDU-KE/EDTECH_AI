#!/bin/bash

echo "🔍 Checking CSP Headers Configuration"
echo "==================================="

# Check if the dev server is running
if ! pgrep -f "next dev" > /dev/null; then
    echo "❌ Development server is not running"
    echo "Starting the server..."
    npm run dev &
    sleep 5
fi

echo -e "\n📋 Testing Headers..."
echo "Making request to localhost:9002..."

# Make a request and check headers
curl -sI http://localhost:9002 | grep -iE "content-security-policy:|x-frame-options:|x-content-type-options:|referrer-policy:" || echo "❌ No security headers found"

echo -e "\n🔍 Verifying Google Auth Domains..."
curl -sI http://localhost:9002 | grep -i "content-security-policy" | grep -o "script-src[^;]*" || echo "❌ No script-src directive found"

echo -e "\n📊 Required Domains Check..."
DOMAINS=(
    "apis.google.com"
    "*.firebaseapp.com"
    "*.googleapis.com"
    "www.gstatic.com"
)

CSP_HEADER=$(curl -sI http://localhost:9002 | grep -i "content-security-policy")

echo "Checking for required domains:"
for domain in "${DOMAINS[@]}"; do
    if echo "$CSP_HEADER" | grep -q "$domain"; then
        echo "✅ $domain is allowed"
    else
        echo "❌ $domain is missing"
    fi
done

echo -e "\n🌐 Firebase Configuration:"
if [ -f ".env.local" ]; then
    echo "✅ .env.local exists"
    if grep -q "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" .env.local; then
        AUTH_DOMAIN=$(grep "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" .env.local | cut -d '=' -f2)
        echo "✅ Auth Domain: $AUTH_DOMAIN"
    else
        echo "❌ Auth Domain not configured"
    fi
else
    echo "❌ .env.local not found"
fi

echo -e "\n📝 Next Steps:"
echo "1. Verify all required domains are present in CSP"
echo "2. Check if headers are being applied correctly"
echo "3. Clear browser cache and try authentication"
echo "4. Monitor browser console for any CSP violations"
