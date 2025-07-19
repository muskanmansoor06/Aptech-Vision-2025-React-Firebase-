import React, { useState, useContext } from 'react';
import '../assets/styles/AuthModal.css';
// import { auth, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '../../firebase';
// import { signInWithPopup } from 'firebase/auth';
import { UserContext } from '../context/UserContext';

function AuthModal({ type, onClose }) {
  const [isLogin, setIsLogin] = useState(type === 'login');
  const [selectedRole, setSelectedRole] = useState('');
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: '',
    studentId: '',
    teacherId: '',
    departmentId: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setRole, createUserDocument, updateUserState } = useContext(UserContext);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setSelectedRole('');
    setForm({ 
      name: '', 
      email: '', 
      password: '', 
      role: '',
      studentId: '',
      teacherId: '',
      departmentId: '',
      department: ''
    });
    setError('');
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setForm(prev => ({ ...prev, role }));
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateAptechEmail = (email) => {
    // Removed Aptech email validation - now accepts any email
    return true;
  };

  const validateStudentId = (studentId) => {
    // Removed student ID validation - now accepts any format
    return true;
  };

  const validateTeacherId = (teacherId) => {
    // Removed teacher ID validation - now accepts any format
    return true;
  };

  const validateDepartmentId = (departmentId) => {
    // Removed department ID validation - now accepts any format
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Static mode - simulate login
        const mockUser = {
          uid: 'mock-user-id',
          email: form.email,
          displayName: form.name || 'User'
        };
        
        // Check if user exists in localStorage
        const existingUser = localStorage.getItem(`userData_${mockUser.uid}`);
        if (!existingUser) {
          throw new Error('User not found. Please register first.');
        }
        
        // Set user in context
        const userData = JSON.parse(existingUser);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        updateUserState(userData);
        
        alert('Login successful!');
        onClose();
      } else {
        // Validate Aptech email
        if (!validateAptechEmail(form.email)) {
          throw new Error('Please use your Aptech email address');
        }

        // Validate role-specific ID
        let isValidId = false;
        switch (form.role) {
          case 'student':
            isValidId = validateStudentId(form.studentId);
            if (!isValidId) {
              throw new Error('Invalid Student ID format. Use: APT-YYYY-XXXX (e.g., APT-2024-1234)');
            }
            break;
          case 'teacher':
            isValidId = validateTeacherId(form.teacherId);
            if (!isValidId) {
              throw new Error('Invalid Teacher ID format. Use: T-YYYY-XXX (e.g., T-2024-123)');
            }
            break;
          case 'department':
            isValidId = validateDepartmentId(form.departmentId);
            if (!isValidId) {
              throw new Error('Invalid Department ID format. Use: DEP-YYYY-XX (e.g., DEP-2024-12)');
            }
            break;
          default:
            throw new Error('Please select a valid role');
        }

        // Static mode - create mock user
        const mockUser = {
          uid: `mock-${Date.now()}`,
          email: form.email,
          displayName: form.name
        };

        // Create user document in localStorage
        const additionalData = {
          name: form.name,
          ...(form.role === 'student' && { studentId: form.studentId }),
          ...(form.role === 'teacher' && { teacherId: form.teacherId }),
          ...(form.role === 'department' && { 
            departmentId: form.departmentId,
            department: form.department 
          })
        };
        
        await createUserDocument(mockUser, form.role, additionalData);
        
        // Set as current user
        const userData = {
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName,
          role: form.role,
          ...additionalData
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        updateUserState(userData);
        
        alert('Registration successful! You are now logged in.');
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      // Static mode - simulate Google login
      const mockUser = {
        uid: `google-${Date.now()}`,
        email: 'user@aptech.com',
        displayName: 'Google User'
      };
      
      // For Google login, we'll need to verify Aptech email
      if (!validateAptechEmail(mockUser.email)) {
        throw new Error('Please use your Aptech email address for Google login');
      }
      
      // For Google login, create user document with default role
      try {
        await createUserDocument(mockUser, 'student', {
          name: mockUser.displayName
        });
        
        // Set as current user
        const userData = {
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName,
          role: 'student'
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        updateUserState(userData);
        
      } catch (docError) {
        console.error('Error creating user document for Google login:', docError);
        // Continue with login even if document creation fails
      }
      alert(`Welcome ${mockUser.displayName}`);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Role Selection Modal
  if (!isLogin && !selectedRole) {
    return (
      <div className="auth-modal-overlay">
        <div className="auth-modal-container modern-auth-modal">
          <button className="auth-modal-close-btn" onClick={onClose} title="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7A6AD8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div className="auth-modal-left">
            <img
              src="/images/auth-img2.png"
              alt="Select Role"
              style={{ maxWidth: '80%', height: 'auto' }}
            />
          </div>
          <div className="auth-modal-right">
            <h2>Select Your Role</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', marginBottom: '2rem' }}>
              Choose your role to continue with registration
            </p>
            
            <div className="role-selection">
              <button 
                className="role-option" 
                onClick={() => handleRoleSelect('student')}
              >
                <div className="role-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <div className="role-info">
                  <h3>Student</h3>
                  <p>Student with valid student ID</p>
                </div>
              </button>
              
              <button 
                className="role-option" 
                onClick={() => handleRoleSelect('teacher')}
              >
                <div className="role-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div className="role-info">
                  <h3>Teacher</h3>
                  <p>Faculty member with teacher ID</p>
                </div>
              </button>
              
              <button 
                className="role-option" 
                onClick={() => handleRoleSelect('department')}
              >
                <div className="role-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="9" y1="9" x2="9" y2="21"/>
                    <line x1="15" y1="9" x2="15" y2="21"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                  </svg>
                </div>
                <div className="role-info">
                  <h3>Department Staff</h3>
                  <p>Admin, Placement, or other department staff</p>
                </div>
              </button>
            </div>

            <p className="text-center mt-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Already have an account?{' '}
              <span onClick={toggleMode} className="toggle-link" style={{ color: '#ffffff' }}>
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container modern-auth-modal">
        <button className="auth-modal-close-btn" onClick={onClose} title="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7A6AD8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div className="auth-modal-left">
          <img
            src={isLogin ? '/images/auth-img1.png' : '/images/auth-img2.png'}
            alt={isLogin ? 'Login' : 'Register'}
            style={{ maxWidth: '80%', height: 'auto' }}
          />
        </div>
        <div className="auth-modal-right">
          <h2>{isLogin ? 'Login to AlmaHub' : `Register as ${selectedRole}`}</h2>

          <form onSubmit={handleSubmit} className="modern-auth-form">
            {!isLogin && (
              <input 
                type="text" 
                placeholder="Full Name" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
              />
            )}
            
            {!isLogin && selectedRole === 'student' && (
              <input 
                type="text" 
                placeholder="Student ID" 
                name="studentId" 
                value={form.studentId} 
                onChange={handleChange} 
                required 
              />
            )}
            
            {!isLogin && selectedRole === 'teacher' && (
              <input 
                type="text" 
                placeholder="Teacher ID" 
                name="teacherId" 
                value={form.teacherId} 
                onChange={handleChange} 
                required 
              />
            )}
            
            {!isLogin && selectedRole === 'department' && (
              <>
                <select 
                  name="department" 
                  value={form.department} 
                  onChange={handleChange} 
                  className="role-select" 
                  required
                >
                  <option value="">Select Department</option>
                  <option value="admin">Administration</option>
                  <option value="placement">Placement</option>
                  <option value="academic">Academic</option>
                  <option value="finance">Finance</option>
                  <option value="it">IT Support</option>
                  <option value="marketing">Marketing</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Department ID" 
                  name="departmentId" 
                  value={form.departmentId} 
                  onChange={handleChange} 
                  required 
                />
              </>
            )}
            
            <input 
              type="email" 
              placeholder="Email Address" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              required 
            />

            {error && <div className="auth-error">{error}</div>}
            
            <button className="btn btn-primary w-100 mt-2 modern-auth-btn" disabled={loading} type="submit">
              {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
            </button>
            
            <div className="text-center my-2">OR</div>
            
            <button type="button" className="btn btn-outline-dark w-100 modern-auth-btn" onClick={handleGoogle} disabled={loading}>
              Continue with Google
            </button>

            <p className="text-center mt-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <span onClick={toggleMode} className="toggle-link">
                {isLogin ? 'Register' : 'Login'}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
