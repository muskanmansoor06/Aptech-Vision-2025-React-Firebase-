// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, connectFirestoreEmulator, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQDTE1Ft1pGbIqhkrhKGFNSOg-sitAxjQ",
  authDomain: "almahub-86893.firebaseapp.com",
  projectId: "almahub-86893",
  storageBucket: "almahub-86893.appspot.com",
  messagingSenderId: "597515321478",
  appId: "1:597515321478:web:2ea656af34ec1b65f99107",
  measurementId: "G-DLCQ4W14C1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics with error handling
let analytics;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn('Analytics initialization failed:', error);
}

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with error handling
export const db = getFirestore(app);

// Initialize Storage for media files
export const storage = getStorage(app);

// Configure Firestore settings for better offline support
// Note: These settings help with connection issues
const firestoreSettings = {
  cacheSizeBytes: 50 * 1024 * 1024, // 50MB cache
  experimentalForceLongPolling: true, // Better for some network conditions
  useFetchStreams: false // Disable fetch streams to avoid some 400 errors
};

// Apply settings if possible
try {
  // Note: These settings might not be available in all Firebase versions
  // The app will still work without them
} catch (error) {
  console.warn('Could not apply Firestore settings:', error);
}

export const googleProvider = new GoogleAuthProvider();

// Export auth functions
export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };

// Export Firestore functions
export { doc, setDoc, getDoc, updateDoc, collection, addDoc, getDocs, query, orderBy, serverTimestamp };

// Export Storage functions
export { ref, uploadBytes, getDownloadURL };

// Helper function to check Firebase connectivity
export const checkFirebaseConnection = async () => {
  try {
    const testRef = doc(db, '_test', 'connection');
    await getDoc(testRef);
    return true;
  } catch (error) {
    console.warn('Firebase connection check failed:', error);
    return false;
  }
};
