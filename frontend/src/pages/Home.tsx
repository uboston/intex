import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Assuming you have a CSS module for styles
const Home: React.FC = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        {/* Navigation Bar */}
        <nav className="nav-bar">
          <div className="nav-left">
            <img
              src="/Logo.svg"
              alt="CineNiche Logo"
              className="primary-logo"
            />
          </div>
          <div className="nav-right">
            <Link to="/login" className="btn sign-in-btn">
              Sign In
            </Link>
          </div>
        </nav>
        {/* Hero Section */}
        <div className="hero">
          <h1>
            Welcome to{' '}
            <img src="/wordlogo.svg" alt="CineNiche" className="center-logo" />
          </h1>
          <p>Unlimited movies, TV shows, and more.</p>
          <div className="email-form">
            <p>Ready to watch? Please Log in above!</p>
            <div className="get-started">
              <input type="text" placeholder="Email address" />
              <a href="#" className="btn-lg">
                Get started <i className="fas fa-chevron-right"></i>
              </a>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
export default Home;