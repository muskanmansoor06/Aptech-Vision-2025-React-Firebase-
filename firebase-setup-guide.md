# Firebase Firestore Setup Guide

## 🔧 **Step 1: Enable Firestore Database**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `almahub-86893`
3. Click on **"Firestore Database"** in the left sidebar
4. Click **"Create Database"**
5. Choose **"Start in test mode"** (for development)
6. Select a location (choose closest to your region)
7. Click **"Done"**

## 🔧 **Step 2: Configure Security Rules**

1. In Firestore Database, go to **"Rules"** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

## 🔧 **Step 3: Update Firebase Config**

Make sure your firebase.js has the correct config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDQDTE1Ft1pGbIqhkrhKGFNSOg-sitAxjQ",
  authDomain: "almahub-86893.firebaseapp.com",
  projectId: "almahub-86893",
  storageBucket: "almahub-86893.firebasestorage.app",
  messagingSenderId: "597515321478",
  appId: "1:597515321478:web:2ea656af34ec1b65f99107",
  measurementId: "G-DLCQ4W14C1"
};
```

## 🔧 **Step 4: Test Connection**

After setup, test the connection by:
1. Refreshing your app
2. Checking console for errors
3. Trying to register a new user

## 🚨 **Common Issues:**

1. **400 Errors**: Firestore not enabled
2. **Permission Denied**: Security rules not configured
3. **Network Errors**: Check internet connection
4. **Project ID Mismatch**: Verify project ID in config 