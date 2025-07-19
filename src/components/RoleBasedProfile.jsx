import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import StudentProfile from './StudentProfile';
import TeacherProfile from './TeacherProfile';
import ProfilePage from './ProfilePage'; // Default profile for now

function RoleBasedProfile() {
  const { userRole } = useContext(UserContext);

  // Route to role-specific profile components
  switch (userRole) {
    case 'student':
      return <StudentProfile />;
    case 'teacher':
      return <TeacherProfile />;
    case 'department':
      return <ProfilePage />; // Department users now use ProfilePage
    default:
      return <ProfilePage />; // Default profile
  }
}

export default RoleBasedProfile; 