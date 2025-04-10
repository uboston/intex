import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer'; // Import the Footer component
import './Home.css'; // Assuming you have a CSS module for styles

const Home: React.FC = () => {
  return (
    <div className="home-container background-img">
      <header className="home-header root-styles">
        {/* Navigation Bar */}
        <nav className="nav-bar">
          <div className="nav-left">
            <img
              src="/smalllogo.png"
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
  <div className="email-form">
  <p>Ready to watch? Get started below!</p>
  <div className="get-started">
    <input type="text" placeholder="Email address" />
    <Link to="/register" className="btn-lg">
      Register Now <i className="fas fa-chevron-right"></i>
    </Link>
  </div>
</div>

          </div>
        </div>
      </header>
      {/* Add Footer here */}
      <Footer />
    </div>
  );
};

export default Home;
