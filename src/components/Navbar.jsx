import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import AuthModal from './AuthModal';

function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('login');

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <>
      {/* Top Strip */}
      <div className="top-strip bg-primary text-white">
        <div className="scrolling-text">
          Welcome to AlmaHub - Empowering Students, Teachers & Alumni
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
        <div className="container">
          <a className="navbar-brand fw-bold text-primary" href="#">AlmaHub</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/jobs">Jobs</Link></li>
              <li className="nav-item"><a className="nav-link" href="#">Forum</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Projects</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Jobs</a></li>
              <li className="nav-item">
                <button className="btn btn-outline-primary me-2" onClick={() => openModal('login')}>Login</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-primary text-white" onClick={() => openModal('register')}>Register</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {showModal && <AuthModal type={modalType} onClose={() => setShowModal(false)} />}
    </>
  );
}

export default Navbar;
