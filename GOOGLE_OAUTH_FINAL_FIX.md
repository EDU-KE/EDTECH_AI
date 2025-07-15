🔧 GOOGLE OAUTH INTERNAL ERROR - COMPLETE FIX GUIDE
================================================================

🚨 CURRENT STATUS: 
- Error: FirebaseError: Firebase: Error (auth/internal-error)
- Firebase Configuration: ✅ COMPLETE (environment variables properly set)
- Google Provider in Firebase: ✅ ENABLED
- Google Cloud Console OAuth Client: ❌ NOT CONFIGURED (this is the issue)

🎯 THE PROBLEM:
The auth/internal-error occurs because Firebase has the Google provider enabled, but the Google Cloud Console OAuth 2.0 client is not properly configured with the required redirect URIs.

🔧 STEP-BY-STEP FIX:

1. 🌐 GO TO GOOGLE CLOUD CONSOLE:
   https://console.cloud.google.com/apis/credentials?project=last-35eb7

2. 🔑 CREATE OAUTH 2.0 CLIENT ID:
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: Web application
   - Name: EDTECH_AI_Web_Client

3. 📝 CONFIGURE AUTHORIZED REDIRECT URIs:
   Add these EXACT URLs:
   - https://last-35eb7.firebaseapp.com/__/auth/handler
   - https://fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev
   - http://localhost:9002

4. 🌍 CONFIGURE AUTHORIZED JAVASCRIPT ORIGINS:
   Add these EXACT URLs:
   - https://last-35eb7.firebaseapp.com
   - https://fictional-space-guide-x556vjvrxwx53p4gp-9002.githubpreview.dev
   - http://localhost:9002

5. 📋 CONFIGURE OAUTH CONSENT SCREEN:
   https://console.cloud.google.com/apis/credentials/consent?project=last-35eb7
   - User Type: External
   - App name: EDTECH AI
   - User support email: Your email
   - Developer contact: Your email
   - Add your email as a test user

6. 🔄 COPY CLIENT ID TO FIREBASE:
   - Copy the Client ID from Google Cloud Console
   - Go to: https://console.firebase.google.com/project/last-35eb7/authentication/providers
   - Click on Google provider
   - Paste the Client ID (and Client Secret if shown)

7. ✅ TEST:
   - Start server: npm run dev
   - Go to: http://localhost:9002
   - Try Google Sign-In
   - Should work without auth/internal-error

🚨 CRITICAL DETAILS:
- The Firebase auth handler URL MUST be: https://last-35eb7.firebaseapp.com/__/auth/handler
- Your email MUST be added as a test user in OAuth consent screen
- The Client ID in Firebase MUST match the one from Google Cloud Console

🔍 VERIFICATION:
After configuration, the Google OAuth should work. The error will change from:
❌ "auth/internal-error" 
✅ To successful authentication OR specific user-actionable errors

📞 SUPPORT URLS:
- Google Cloud Console Credentials: https://console.cloud.google.com/apis/credentials?project=last-35eb7
- OAuth Consent Screen: https://console.cloud.google.com/apis/credentials/consent?project=last-35eb7
- Firebase Authentication: https://console.firebase.google.com/project/last-35eb7/authentication/providers

🎯 NEXT STEPS:
1. Complete the Google Cloud Console OAuth configuration (steps 1-5)
2. Update Firebase with the Client ID (step 6)
3. Test the Google OAuth (step 7)
4. Start development server with: npm run dev

The auth/internal-error will be resolved once the OAuth 2.0 client is properly configured!
