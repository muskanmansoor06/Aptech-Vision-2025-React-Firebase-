import React from 'react';
import '../assets/styles/Hero.css';
import studentImage from '../assets/images/bg5.jpg';
import { FaCode, FaLaptopCode, FaUsers } from 'react-icons/fa';

function HeroSection() {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <div className="container z-1">
          <div className="hero-inner">
            {/* Left Section */}
            <div className="hero-left">
              <p className="tagline">Welcome to AlmaHub</p>
              <h1 className="main-heading">
                 Your one stop platform for success
              </h1>
              <p className="typing-text">Web Development | Mobile Apps | AI & ML | UI/UX Design</p>
              <p className="hero-subtext">
                 Connect with fellow alumni, explore job opportunities, and get help with assignments and projects. Our community is designed to support your growth and success.
              </p>

              <div className="search-box">
                <input
                  type="text"
                  className="custom-input"
                  placeholder="Search programming courses..."
                />
                <button className="btn-search">Search</button>
              </div>

              <div className="hero-features">
                <div><FaCode /> Network with Alumni</div>
                <div><FaLaptopCode /> Discuss Ideas</div>
                <div><FaUsers /> Explore Job Opportunities</div>
              </div>
            </div>

            {/* Right Section */}
            <div className="hero-right">
              <div className="img-bg-shape"></div>
              <img src={studentImage} alt="Student" className="hero-img" />
              <div className="hero-tag top-left">50+ Live Courses</div>
              <div className="hero-tag top-right">20K+ Active Learners</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
