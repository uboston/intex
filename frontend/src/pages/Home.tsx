import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Assuming you have a CSS module for styles
const Home: React.FC = () => {
  return (
    <div className="home-container background-img">
      <header className="home-header root-styles">
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
            Welcome to<img src="/newlogo.png" alt="CineNiche" className="center-logo" />
          </h1>
          <br></br>
          <p>Unlimited movies, TV shows, and more.</p>
          <div className="email-form">
            <p>Ready to watch? Please Sign in above!</p>
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
