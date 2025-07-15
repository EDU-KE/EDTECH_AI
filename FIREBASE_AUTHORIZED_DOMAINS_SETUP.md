# Firebase Authorized Domains Setup Guide

## 🔧 Adding Localhost as Verified URL in Firebase Project

### **Step 1: Access Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/project/last-35eb7)
2. Select your project: `last-35eb7`
3. Navigate to **Authentication** in the left sidebar

### **Step 2: Configure Authorized Domains**
1. Click on **Settings** tab (next to Sign-in method)
2. Scroll down to **Authorized domains** section
3. Click **Add domain** button

### **Step 3: Add Required Domains**
Add these domains one by one:

```
localhost
127.0.0.1
fictional-space-guide-x556vjvrxwx53p4gp-3000.githubpreview.dev
fictional-space-guide-x556vjvrxwx53p4gp-3000.app.github.dev
```

### **Step 4: Configure for Development**
For local development, also add:
```
localhost:3000
localhost:9002
127.0.0.1:3000
127.0.0.1:9002
```

### **Step 5: Save Configuration**
1. Click **Save** after adding each domain
2. Wait for the configuration to propagate (usually instant)

## 🚀 Direct Links for Quick Access

### **Firebase Console Links:**
- **Authentication Settings**: https://console.firebase.google.com/project/last-35eb7/authentication/settings
- **Sign-in Providers**: https://console.firebase.google.com/project/last-35eb7/authentication/providers

### **Current Environment:**
- **Project ID**: last-35eb7
- **Codespace Domain**: fictional-space-guide-x556vjvrxwx53p4gp-3000.githubpreview.dev
- **Dev Server Port**: 9002

## 🔍 Verification Steps

After adding the domains:

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Test Authentication**:
   - Go to your login page
   - Try Google sign-in
   - Check browser console for errors

3. **Expected Results**:
   - No "unauthorized domain" errors
   - Google sign-in popup/redirect works
   - Authentication completes successfully

## 🚨 Troubleshooting

### **If you get "unauthorized domain" error:**
1. Double-check the domain is added exactly as shown
2. Try without port numbers first
3. Clear browser cache and cookies
4. Wait 5-10 minutes for Firebase to propagate changes

### **Common Domain Formats:**
- ✅ `localhost` (correct)
- ✅ `127.0.0.1` (correct)
- ❌ `http://localhost` (incorrect - don't include protocol)
- ❌ `localhost/` (incorrect - don't include trailing slash)

## 📋 Complete Domain List for Your Project

Add these domains to Firebase Console:
```
localhost
127.0.0.1
fictional-space-guide-x556vjvrxwx53p4gp-3000.githubpreview.dev
fictional-space-guide-x556vjvrxwx53p4gp-3000.app.github.dev
```

## 🎯 After Configuration

Once domains are added:
1. Firebase authentication will work from all listed domains
2. Google OAuth will not show "unauthorized domain" error
3. Both popup and redirect methods will work
4. Authentication will be fully functional

---

**Next Action**: Go to Firebase Console and add the domains listed above, then test your authentication!
