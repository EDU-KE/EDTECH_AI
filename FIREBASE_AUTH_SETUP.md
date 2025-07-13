# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for your EdTech AI Hub application.

## Prerequisites

1. A Firebase project (create one at [Firebase Console](https://console.firebase.google.com/))
2. Node.js and npm installed

## Step 1: Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Navigate to **Authentication** > **Sign-in method**
4. Enable the following sign-in providers:

### Email/Password Authentication
- Click on "Email/Password"
- Enable the first option (Email/Password)
- Save

### Google Authentication
- Click on "Google"
- Enable Google sign-in
- Add your project's authorized domains (localhost:9002 for development)
- Note: Your Google OAuth client will be automatically configured

### Twitter Authentication (Optional)
- Click on "Twitter"
- Enable Twitter sign-in
- You'll need to:
  1. Create a Twitter app at [Twitter Developer Platform](https://developer.twitter.com/)
  2. Get your Twitter API Key and API Secret Key
  3. Add these to Firebase Twitter configuration
  4. Set callback URL to: `https://your-project-id.firebaseapp.com/__/auth/handler`

### Facebook Authentication (Optional)
- Click on "Facebook"
- Enable Facebook sign-in
- You'll need to:
  1. Create a Facebook app at [Facebook Developers](https://developers.facebook.com/)
  2. Get your App ID and App Secret
  3. Add these to Firebase Facebook configuration
  4. Configure OAuth redirect URIs

## Step 2: Get Firebase Configuration

1. In your Firebase project, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click on the web app icon (`</>`) to create a web app
4. Register your app with a name (e.g., "EdTech AI Hub")
5. Copy the configuration object

## Step 3: Environment Variables

1. Create a `.env.local` file in your project root
2. Copy the contents from `.env.example`
3. Replace the placeholder values with your Firebase config values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
```

## Step 4: Firestore Database Setup

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users

## Step 5: Security Rules (Optional but Recommended)

Update your Firestore security rules to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add more rules for other collections as needed
  }
}
```

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:9002`
3. Try signing up with a new account
4. Try logging in with the created account
5. Test social login providers if enabled

## Features Included

- ✅ Email/Password authentication
- ✅ Google Sign-In
- ✅ Facebook Sign-In  
- ✅ Twitter Sign-In
- ✅ User profile creation in Firestore
- ✅ Protected routes
- ✅ Automatic redirects based on auth state
- ✅ User session management
- ✅ Logout functionality

## File Structure

```
src/
├── lib/
│   ├── auth.ts          # Authentication functions
│   └── firebase.ts      # Firebase configuration
├── contexts/
│   └── AuthContext.tsx  # React context for auth state
├── components/
│   ├── ProtectedRoute.tsx # Component to protect routes
│   └── user-nav.tsx     # User navigation with logout
├── app/
│   ├── page.tsx         # Landing page
│   ├── login/
│   │   └── page.tsx     # Login page
│   └── signup/
│       └── page.tsx     # Signup page
```

## Troubleshooting

### Common Issues

1. **"Firebase App not initialized"**
   - Make sure your environment variables are set correctly
   - Restart your development server after adding env vars

2. **"auth/invalid-api-key"**
   - Check that your `NEXT_PUBLIC_FIREBASE_API_KEY` is correct

3. **"auth/unauthorized-domain"**
   - Add your domain to authorized domains in Firebase Console
   - Go to Authentication > Settings > Authorized domains
   - Add `localhost` and `localhost:9002` for development

4. **Google Sign-In Issues**
   - Make sure Google provider is enabled in Firebase Console
   - Check that your domain is in the authorized domains list
   - Clear browser cache and cookies if issues persist

5. **Twitter Sign-In Issues**
   - Verify Twitter app configuration in Twitter Developer Console
   - Check that callback URL is correctly set
   - Ensure Twitter API keys are properly configured in Firebase

6. **Popup Blocked Issues**
   - Make sure popup blockers are disabled for your domain
   - Try using `signInWithRedirect` instead of `signInWithPopup` if popups are consistently blocked

7. **Social login not working**
   - Make sure you've enabled the provider in Firebase Console
   - Configure OAuth credentials for each provider
   - Check browser console for specific error messages

### Development vs Production

- In development, the app connects to Firebase emulators if available
- In production, make sure to:
  - Set environment variables in your hosting platform
  - Update Firestore security rules
  - Add your production domain to authorized domains

## Need Help?

If you encounter issues, check:
1. Firebase Console logs
2. Browser developer console for errors
3. Network tab to see failed requests
4. Firebase documentation at [firebase.google.com/docs](https://firebase.google.com/docs)
