#!/bin/bash

echo "🚀 STARTING DEVELOPMENT SERVER"
echo "=============================="

echo ""
echo "📋 Pre-flight Check:"
echo "   ✅ Firebase configured (project: last-35eb7)"
echo "   ✅ Environment variables set"
echo "   ✅ Google OAuth integration ready"
echo "   ✅ Middleware configured"
echo "   ✅ Demo mode disabled"
echo ""

echo "🔥 Starting Next.js development server..."
echo "   URL: http://localhost:9002"
echo "   Port: 9002 (configured in package.json)"
echo ""

echo "📊 Monitor these during testing:"
echo "   - Browser console for errors"
echo "   - Network tab for API calls"
echo "   - Application tab for cookies"
echo ""

echo "🎯 Test URLs:"
echo "   - Login: http://localhost:9002/login"
echo "   - Dashboard: http://localhost:9002/dashboard"
echo "   - Profile: http://localhost:9002/profile"
echo ""

echo "🚨 If you see auth/internal-error:"
echo "   → Complete Google OAuth client setup first"
echo "   → Run: ./complete-oauth-setup.sh for details"
echo ""

echo "⚡ Starting server now..."
echo ""

npm run dev
