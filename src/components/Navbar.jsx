import { Link, useLocation } from 'react-router-dom';
import React, { useState, useContext, useEffect, useRef } from 'react';
import AuthModal from './AuthModal';
import { UserContext } from '../context/UserContext';
import { FaSearch } from 'react-icons/fa';
import '../assets/styles/Nav.css';

function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('login');
  const { user, userRole, logout, loading, firebaseStatus } = useContext(UserContext);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutAttempting, setLogoutAttempting] = useState(false);
  const navRef = useRef();
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleLogout = async () => {
    if (logoutAttempting) return; // Prevent multiple clicks
    
    try {
      console.log('Logout button clicked');
      setLogoutAttempting(true);
      setDropdownOpen(false); // Close dropdown immediately
      
      await logout();
      console.log('Logout completed successfully');
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Show user-friendly error message
      alert('Logout failed. Please try again or refresh the page.');
    } finally {
      setLogoutAttempting(false);
    }
  };

  return (
    <header className={`header-area header-sticky${scrolled || isProfilePage ? ' background-header' : ''}`}>
      <div className="container">
        <nav className="main-nav" ref={navRef}>
          {/* Logo */}
          <Link to="/" className="logo">
            <h1>AlmaHub</h1>
            {/* Firebase status indicator - commented out for static mode */}
            {/* {firebaseStatus === 'offline' && (
              <span style={{ 
                fontSize: '10px', 
                color: '#fff', 
                marginLeft: '10px',
                background: '#ff6b6b',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 'bold',
                animation: 'pulse 2s infinite'
              }}>
                OFFLINE
              </span>
            )} */}
          </Link>

          {/* Search Bar */}
          <div className="search-input">
            <form id="search" action="#" onSubmit={e => e.preventDefault()}>
              <input type="text" placeholder="Type Something" name="searchKeyword" />
              <FaSearch className="search-icon" />
            </form>
          </div>

          {/* Menu */}
          <ul className={`nav${menuOpen ? ' nav-visible' : ''}`}>
            <li><Link to="/" className={`scroll-to-section${location.pathname === '/' ? ' active' : ''}`}>Home</Link></li>
            <li><Link to="/jobs" className={`scroll-to-section${location.pathname === '/jobs' ? ' active' : ''}`}>Jobs</Link></li>
            <li><Link to="/queries" className={`scroll-to-section${location.pathname === '/queries' ? ' active' : ''}`}>Queries</Link></li>

            {user ? (
              <li className="user-dropdown">
                <div className="user-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  ) : (
                    <span className="avatar-circle">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <ul className={`dropdown-menu${dropdownOpen ? ' open' : ''}`}>
                  <li className="user-role">
                    <span className="role-badge">{userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'}</span>
                  </li>
                  <li><Link to="/profile">Profile</Link></li>
                  <li>
                    <button 
                      onClick={handleLogout}
                      disabled={loading || logoutAttempting}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#333', 
                        cursor: logoutAttempting ? 'not-allowed' : 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 18px',
                        fontSize: '14px',
                        opacity: logoutAttempting ? 0.6 : 1
                      }}
                    >
                      {logoutAttempting ? 'Logging out...' : 'Logout'}
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li>
                  <button className="btn btn-outline-primary me-2" onClick={() => openModal('login')}>Login</button>
                </li>
                <li>
                  <button className="btn btn-primary text-white" onClick={() => openModal('register')}>Register</button>
                </li>
              </>
            )}
          </ul>

          {/* Hamburger Menu */}
          <a className={`menu-trigger${menuOpen ? ' active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span>Menu</span>
          </a>
        </nav>
      </div>

      {showModal && <AuthModal type={modalType} onClose={() => setShowModal(false)} />}
    </header>
  );
}

export default Navbar;
