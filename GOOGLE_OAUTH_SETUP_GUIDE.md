# Google OAuth Configuration Fix

The error "Google sign-in is not properly configured" indicates that Google authentication is not properly set up in your Firebase project. Here's how to fix it:

## Step 1: Enable Google Authentication in Firebase Console

1. **Go to Firebase Console**: [https://console.firebase.google.com](https://console.firebase.google.com)
2. **Select your project**: `last-35eb7`
3. **Navigate to Authentication**: 
   - Click "Authentication" in the left sidebar
   - Go to "Sign-in methods" tab
4. **Enable Google Provider**:
   - Find "Google" in the list of providers
   - Click on it and toggle "Enable"
   - You'll need to provide:
     - **Web SDK configuration**: This should auto-populate
     - **Project support email**: Use your Firebase project email

## Step 2: Configure OAuth 2.0 (if needed)

If you need custom OAuth settings:

1. **Go to Google Cloud Console**: [https://console.cloud.google.com](https://console.cloud.google.com)
2. **Select the same project**: `last-35eb7`
3. **Navigate to APIs & Services** > **Credentials**
4. **Find your OAuth 2.0 client ID** or create one if needed
5. **Add authorized domains**:
   - `localhost` (for development)
   - Your production domain
   - Your Codespace domain (if using GitHub Codespaces)

## Step 3: Configure Authorized Domains

1. **In Firebase Console**, go to **Authentication** > **Settings** > **Authorized domains**
2. **Add these domains**:
   - `localhost` (for local development)
   - Your production domain
   - If using Codespaces, add your codespace domain

## Step 4: Test the Configuration

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Try Google sign-in again**

## Alternative: Use Email/Password Authentication

If you want to test authentication without Google OAuth, you can use the email/password sign-in method which should already be working.

## Debugging Tips

- Check the browser console for detailed error messages
- Make sure your Firebase project is active and not suspended
- Verify that your Firebase configuration in `.env.local` matches your project

## Current Configuration Status

Your Firebase project ID: `last-35eb7`
Your current domain: Check in browser console for the exact domain being used

## Support

If you continue having issues:
1. Check Firebase Console for any error messages
2. Verify billing is enabled (required for some Google services)
3. Try creating a new OAuth client ID if the current one has issues
