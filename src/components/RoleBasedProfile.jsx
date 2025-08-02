import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import StudentProfile from './StudentProfile';
import TeacherProfile from './TeacherProfile';
import ProfilePage from './ProfilePage'; // Default profile for now
import { useNavigate } from 'react-router-dom';

function RoleBasedProfile() {
  const { user, userRole, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true }); // Redirect to home/login if not logged in
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null; // Prevent flicker

  // Route to role-specific profile components
  
  // Add a simple test message
  if (!user) {
    return <div style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h2>Profile Page</h2>
      <p>No user logged in</p>
    </div>;
  }
  
  switch (userRole) {
    case 'student':
      return <StudentProfile />;
    case 'teacher':
      return <TeacherProfile />;
    case 'department':
      return <ProfilePage />; // Department users now use ProfilePage
    default:
      return <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Profile Page</h2>
        <p>User Role: {userRole || 'Not set'}</p>
        <p>User: {user.email}</p>
        <p>Using default profile page</p>
      </div>;
  }
}

export default RoleBasedProfile; 