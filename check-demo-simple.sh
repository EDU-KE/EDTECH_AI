#!/bin/bash

# Simple demo mode check
echo "🔍 Demo Mode Check"
echo "=================="
echo ""

echo "📋 Environment Variables:"
echo "NEXT_PUBLIC_FIREBASE_API_KEY present: $([ -n "$NEXT_PUBLIC_FIREBASE_API_KEY" ] && echo "YES" || echo "NO")"

if [ -n "$NEXT_PUBLIC_FIREBASE_API_KEY" ]; then
    echo "API Key (first 20 chars): ${NEXT_PUBLIC_FIREBASE_API_KEY:0:20}..."
else
    echo "❌ API Key is missing or empty"
fi

echo ""
echo "📋 Demo Mode Logic:"
echo "Demo mode is TRUE if:"
echo "1. API Key is missing"
echo "2. API Key equals 'your_api_key_here'"
echo "3. API Key is empty string"

if [ -z "$NEXT_PUBLIC_FIREBASE_API_KEY" ]; then
    echo "🚨 DEMO MODE: API Key is missing"
elif [ "$NEXT_PUBLIC_FIREBASE_API_KEY" = "your_api_key_here" ]; then
    echo "🚨 DEMO MODE: API Key is placeholder"
elif [ "$NEXT_PUBLIC_FIREBASE_API_KEY" = "" ]; then
    echo "🚨 DEMO MODE: API Key is empty"
else
    echo "✅ NOT DEMO MODE: API Key is valid"
fi

echo ""
echo "🔍 If system is in demo mode, that's why auth isn't working!"
echo "Demo mode disables all Firebase authentication, even if enabled in console."
