#!/usr/bin/env node

/**
 * Firebase Google OAuth Configuration Checker
 * This script helps diagnose Google OAuth configuration issues
 */

const fs = require('fs');
const https = require('https');

console.log('🔍 FIREBASE GOOGLE OAUTH CONFIGURATION CHECKER');
console.log('===============================================\n');

// Read Firebase config
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const getEnvVar = (name) => {
    const line = envContent.split('\n').find(l => l.startsWith(name));
    return line ? line.split('=')[1] : null;
  };

  const projectId = getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  const apiKey = getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY');
  const authDomain = getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');

  console.log('📊 Firebase Configuration:');
  console.log(`- Project ID: ${projectId}`);
  console.log(`- API Key: ${apiKey ? apiKey.substring(0, 15) + '...' : 'Not found'}`);
  console.log(`- Auth Domain: ${authDomain}`);
  
  if (!projectId || !apiKey || !authDomain) {
    console.log('\n❌ Firebase configuration is incomplete');
    process.exit(1);
  }

  console.log('\n🔗 Firebase Console Links:');
  console.log(`- Authentication Providers: https://console.firebase.google.com/project/${projectId}/authentication/providers`);
  console.log(`- Authentication Settings: https://console.firebase.google.com/project/${projectId}/authentication/settings`);
  console.log(`- Project Overview: https://console.firebase.google.com/project/${projectId}`);

  console.log('\n🚨 ERROR ANALYSIS: auth/internal-error');
  console.log('=====================================');
  
  console.log(`
The "auth/internal-error" you're experiencing typically means:

❌ PRIMARY CAUSE: Google OAuth Provider NOT ENABLED
   - The Google authentication provider is disabled in Firebase Console
   - This is the most common cause of auth/internal-error

🔧 IMMEDIATE FIX (2 minutes):
   1. Open: https://console.firebase.google.com/project/${projectId}/authentication/providers
   2. Look for "Google" in the Sign-in providers list
   3. Click on the Google provider row
   4. Toggle "Enable" to ON (if currently OFF)
   5. Add a support email address when prompted
   6. Click "Save"
   7. Wait 1-2 minutes for changes to propagate
   8. Refresh your app and try Google sign-in again

📋 VERIFICATION STEPS:
   1. Go to the Firebase Console link above
   2. Check if Google shows "Enabled" or "Disabled"
   3. If Disabled: Follow the fix steps above
   4. If Enabled: Check authorized domains in Settings

🎯 OTHER POSSIBLE CAUSES (less likely):
   - Domain not in authorized domains list
   - Google Cloud Console OAuth misconfiguration
   - Firebase project billing issues
   - Temporary Firebase service issues

💡 TESTING:
   After enabling the Google provider:
   - Clear browser cache/cookies
   - Try Google sign-in again
   - Check browser console for any remaining errors
  `);

  console.log('\n🛠️ STEP-BY-STEP GUIDE:');
  console.log('=====================');
  
  console.log(`
STEP 1: Open Firebase Console
→ https://console.firebase.google.com/project/${projectId}/authentication/providers

STEP 2: Find Google Provider
→ Look for "Google" in the list of Sign-in providers
→ Note if it shows "Enabled" or "Disabled"

STEP 3: Enable Google Provider (if disabled)
→ Click on the Google provider row
→ Toggle "Enable" to ON
→ Enter a support email address
→ Click "Save"

STEP 4: Verify Authorized Domains
→ Go to: https://console.firebase.google.com/project/${projectId}/authentication/settings
→ Ensure these domains are listed:
  - localhost
  - 127.0.0.1
  - Your production domain

STEP 5: Test
→ Wait 1-2 minutes for changes to propagate
→ Refresh your app: http://localhost:9002
→ Try Google sign-in again
  `);

  console.log('\n📞 QUICK ACCESS:');
  console.log('===============');
  console.log(`
🔗 Direct Links:
   Firebase Auth Providers: https://console.firebase.google.com/project/${projectId}/authentication/providers
   Firebase Auth Settings:  https://console.firebase.google.com/project/${projectId}/authentication/settings
   
🧪 Test Pages:
   Your Login Page:  http://localhost:9002/login
   Google Auth Test: http://localhost:9002/google-auth-test
   
📋 Expected Result:
   After enabling Google provider, you should see a Google OAuth popup
   or redirect instead of the "auth/internal-error"
  `);

} catch (error) {
  console.error('❌ Error reading Firebase configuration:', error.message);
  console.log('\nPlease ensure .env.local file exists and contains Firebase configuration.');
  process.exit(1);
}

console.log('\n✅ Configuration check complete!');
console.log('📖 Follow the steps above to resolve the auth/internal-error issue.');
