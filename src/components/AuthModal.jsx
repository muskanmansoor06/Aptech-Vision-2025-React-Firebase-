import React, { useState } from 'react';
import '../assets/styles/AuthModal.css';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import loginImg from '../assets/images/auth-img1.png';      // transparent login image
import registerImg from '../assets/images/auth-img2.png'; // transparent register image


function AuthModal({ type, onClose }) {
  const [isLogin, setIsLogin] = useState(type === 'login');

  const toggleMode = () => setIsLogin(!isLogin);

  const handleGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      alert(`Welcome ${res.user.displayName}`);
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container">
        <div className="auth-modal-left"
  style={{
    backgroundColor: isLogin ? '#EEF2FF' : '#EEF2FF', // 🎨 Soft blue for login, soft orange for register
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
          <img
    src={isLogin ? loginImg : registerImg}
    alt="Auth Visual"
    style={{
      maxWidth: '80%',
      height: 'auto',
    }}
  />
        </div>
        <div className="auth-modal-right">
          <button className="btn-close" onClick={onClose}></button>
          <h2>{isLogin ? 'Login to AlmaHub' : 'Register to AlmaHub'}</h2>

          <form>
            {!isLogin && (
              <input type="text" placeholder="Full Name" required />
            )}
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />

            <button className="btn btn-primary w-100 mt-2">
              {isLogin ? 'Login' : 'Register'}
            </button>
            <div className="text-center my-2">OR</div>
            <button type="button" className="btn btn-outline-dark w-100" onClick={handleGoogle}>
              Continue with Google
            </button>

            <p className="text-center mt-3">
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
