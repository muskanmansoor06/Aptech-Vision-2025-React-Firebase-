// UserContext.jsx - Provides authentication state and actions for the app
import { createContext, useContext, useEffect, useState } from 'react';
// import { auth, db, onAuthStateChanged, signOut, doc, setDoc, getDoc } from '../../firebase';

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false since no Firebase
  const [firebaseStatus, setFirebaseStatus] = useState('offline'); // Set to offline

  // Create or update user document in Firestore
  const createUserDocument = async (user, role, additionalData = {}) => {
    try {
      // Commented out Firebase functionality
      // const userRef = doc(db, 'users', user.uid);
      const userDoc = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || additionalData.name || '',
        role: role,
        createdAt: new Date().toISOString(),
        ...additionalData
      };
      
      // await setDoc(userRef, userDoc);
      
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
      // Commented out Firebase functionality
      // const userRef = doc(db, 'users', uid);
      // const userSnap = await getDoc(userRef);
      
      // if (userSnap.exists()) {
      //   const data = userSnap.data();
      //   return data;
      // } else {
      //   return null;
      // }
      
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

  useEffect(() => {
    // Commented out Firebase auth listener
    // const unsubscribe = onAuthStateChanged(auth, async (user) => {
    //   if (user) {
    //     setUser(user);
        
    //     // Check Firebase connectivity with timeout
    //     try {
    //       const timeoutPromise = new Promise((_, reject) => 
    //         setTimeout(() => reject(new Error('Timeout')), 5000)
    //       );
          
    //       const testRef = doc(db, '_test', 'connection');
    //       await Promise.race([getDoc(testRef), timeoutPromise]);
    //       setFirebaseStatus('online');
    //     } catch (error) {
    //       console.log('Firebase offline or connection timeout, using localStorage fallback');
    //       setFirebaseStatus('offline');
    //     }
        
    //     // Get user data from Firestore or localStorage
    //     const userData = await getUserData(user.uid);
        
    //     if (userData) {
    //       setUserRole(userData.role);
    //       setUserData(userData);
    //     } else {
    //       // If no user document exists, create one with default role
    //       try {
    //         const defaultUserData = await createUserDocument(user, 'student');
    //         setUserRole(defaultUserData.role);
    //         setUserData(defaultUserData);
    //       } catch (error) {
    //         console.error('Error creating default user document:', error);
    //         // Set default values even if document creation fails
    //         setUserRole('student');
    //         setUserData({
    //           uid: user.uid,
    //           email: user.email,
    //           displayName: user.displayName || '',
    //           role: 'student'
    //         });
    //       }
    //     }
    //   } else {
    //     setUser(null);
    //     setUserRole(null);
    //     setUserData(null);
    //     setFirebaseStatus('checking');
    //   }
    //   setLoading(false);
    // });
    // return () => unsubscribe();
    
    // Static mode - check localStorage for existing user
    const checkLocalUser = () => {
      const localUserData = localStorage.getItem('currentUser');
      if (localUserData) {
        const userData = JSON.parse(localUserData);
        setUser(userData);
        setUserRole(userData.role);
        setUserData(userData);
      }
      setLoading(false);
    };
    
    checkLocalUser();
    
    // Listen for storage changes to update user state
    const handleStorageChange = (e) => {
      if (e.key === 'currentUser') {
        if (e.newValue) {
          const userData = JSON.parse(e.newValue);
          setUser(userData);
          setUserRole(userData.role);
          setUserData(userData);
        } else {
          setUser(null);
          setUserRole(null);
          setUserData(null);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      console.log('Starting logout process...');
      console.log('Current user:', user);
      console.log('Current userRole:', userRole);
      console.log('Current userData:', userData);
      
      // Clear local storage data
      if (user) {
        console.log('Clearing localStorage for user:', user.uid);
        localStorage.removeItem(`userData_${user.uid}`);
      }
      localStorage.removeItem('tempUserRole');
      localStorage.removeItem('tempUserData');
      localStorage.removeItem('currentUser');
      
      // Clear state immediately for better UX
      console.log('Clearing user state...');
      setUser(null);
      setUserRole(null);
      setUserData(null);
      setFirebaseStatus('offline');
      
      // Commented out Firebase signOut
      // console.log('Attempting Firebase signOut...');
      // const timeoutPromise = new Promise((_, reject) => 
      //   setTimeout(() => reject(new Error('Logout timeout')), 10000)
      // );
      
      // await Promise.race([signOut(auth), timeoutPromise]);
      console.log('Logout successful (static mode)');
      
    } catch (error) {
      console.error('Logout error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // Even if logout fails, we've already cleared local state
      // This ensures the user is logged out locally
      if (error.message === 'Logout timeout') {
        console.log('Logout timed out, but user is logged out locally');
      }
    } finally {
      console.log('Logout process completed');
      setLoading(false);
    }
  };

  const setRole = async (role, additionalData = {}) => {
    if (user) {
      try {
        // Commented out Firebase functionality
        // const userRef = doc(db, 'users', user.uid);
        const updatedData = {
          ...userData,
          role: role,
          ...additionalData
        };
        
        // await setDoc(userRef, updatedData, { merge: true });
        
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
        // Commented out Firebase functionality
        // const userRef = doc(db, 'users', user.uid);
        const updatedData = {
          ...userData,
          ...newData
        };
        
        // await setDoc(userRef, updatedData, { merge: true });
        
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
      logout, 
      setRole, 
      updateUserData,
      createUserDocument,
      updateUserState // Add this for static mode
    }}>
      {children}
    </UserContext.Provider>
  );
} 