// UserContext.jsx - Provides authentication state and actions for the app
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, onAuthStateChanged, signOut, doc, setDoc, getDoc } from '../../firebase';

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Set to true for Firebase loading
  const [firebaseStatus, setFirebaseStatus] = useState('checking'); // Set to checking for Firebase

  // Create or update user document in Firestore
  const createUserDocument = async (user, role, additionalData = {}) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || additionalData.name || '',
        role: role,
        createdAt: new Date().toISOString(),
        ...additionalData
      };
      
      await setDoc(userRef, userDoc);
      
      // Save to localStorage as backup
      localStorage.setItem(`userData_${user.uid}`, JSON.stringify(userDoc));
      
      return userDoc;
    } catch (error) {
      console.error('Error creating user document:', error);
      
      // Fallback to localStorage only
      const userDoc = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || additionalData.name || '',
        role: role,
        createdAt: new Date().toISOString(),
        ...additionalData
      };
      
      localStorage.setItem(`userData_${user.uid}`, JSON.stringify(userDoc));
      return userDoc;
    }
  };

  // Get user data from Firestore
  const getUserData = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return data;
      } else {
        return null;
      }
      
      // Fallback to localStorage for offline mode
      const localData = localStorage.getItem(`userData_${uid}`);
      return localData ? JSON.parse(localData) : null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to localStorage for offline mode
      const localData = localStorage.getItem(`userData_${uid}`);
      return localData ? JSON.parse(localData) : null;
    }
  };

  // Function to check Firebase connectivity
  const checkFirebaseConnection = async () => {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      const testRef = doc(db, '_test', 'connection');
      await Promise.race([getDoc(testRef), timeoutPromise]);
      return true;
    } catch (error) {
      console.log('Firebase offline or connection timeout, using localStorage fallback');
      return false;
    }
  };

  useEffect(() => {
    // Check Firebase connectivity with timeout
    let timeout = setTimeout(() => {
      setFirebaseStatus('offline');
      console.log('Firebase offline or connection timeout, using localStorage fallback');
    }, 5000);
    checkFirebaseConnection().then((isOnline) => {
      if (isOnline) {
        setFirebaseStatus('online');
        clearTimeout(timeout);
      }
    });
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setUserRole(data.role); // Ensure role is set after refresh
        }
        } else {
          setUser(null);
        setUserData(null);
          setUserRole(null);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      setFirebaseStatus('offline');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    setLoading(false);
  };

  const setRole = async (role, additionalData = {}) => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const updatedData = {
          ...userData,
          role: role,
          ...additionalData
        };
        
        await setDoc(userRef, updatedData, { merge: true });
        
        // Update localStorage
        localStorage.setItem(`userData_${user.uid}`, JSON.stringify(updatedData));
        localStorage.setItem('currentUser', JSON.stringify(updatedData));
        
        setUserRole(role);
        setUserData(prev => ({ ...prev, role, ...additionalData }));
      } catch (error) {
        console.error('Error updating role:', error);
        
        // Fallback to localStorage only
        const updatedData = {
          ...userData,
          role: role,
          ...additionalData
        };
        
        localStorage.setItem(`userData_${user.uid}`, JSON.stringify(updatedData));
        localStorage.setItem('currentUser', JSON.stringify(updatedData));
        setUserRole(role);
        setUserData(prev => ({ ...prev, role, ...additionalData }));
      }
    } else {
      // For new registration, store temporarily
      localStorage.setItem('tempUserRole', role);
      localStorage.setItem('tempUserData', JSON.stringify(additionalData));
    }
  };

  const updateUserData = async (newData) => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const updatedData = {
          ...userData,
          ...newData
        };
        
        await setDoc(userRef, updatedData, { merge: true });
        
        // Update localStorage
        localStorage.setItem(`userData_${user.uid}`, JSON.stringify(updatedData));
        localStorage.setItem('currentUser', JSON.stringify(updatedData));
        
        setUserData(prev => ({ ...prev, ...newData }));
      } catch (error) {
        console.error('Error updating user data:', error);
        
        // Fallback to localStorage only
        const updatedData = {
          ...userData,
          ...newData
        };
        
        localStorage.setItem(`userData_${user.uid}`, JSON.stringify(updatedData));
        localStorage.setItem('currentUser', JSON.stringify(updatedData));
        setUserData(prev => ({ ...prev, ...newData }));
      }
    }
  };

  // Function to manually update user state (for static mode)
  const updateUserState = (userData) => {
    if (userData) {
      setUser(userData);
      setUserRole(userData.role);
      setUserData(userData);
    } else {
      setUser(null);
      setUserRole(null);
      setUserData(null);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      userRole, 
      userData, 
      loading, 
      firebaseStatus,
      logout: handleLogout, 
      setRole, 
      setUserRole, // Export setUserRole for consumers
      updateUserData,
      createUserDocument,
      updateUserState, // Add this for static mode
      getUserData // Make getUserData available to consumers
    }}>
      {children}
    </UserContext.Provider>
  );
} 