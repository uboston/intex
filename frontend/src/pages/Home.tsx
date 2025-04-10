import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Footer from '../components/Footer'; // <-- Import Footer

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Background blur layer */}
      <div className="bg-blur" />
      <header className="home-header">
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
            <Link to="/login" className="sign-in-btn">
              Sign In
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="hero">
          <h1>
            Welcome to{' '}
            <img src="/newlogo.png" alt="CineNiche" className="center-logo" />
          </h1>
          <p>Unlimited movies, TV shows, and more.</p>
          <div className="email-form">
            <p>Ready to watch? Get started below!</p>
            <div className="get-started">
              <input
                type="text"
                placeholder="Email address"
                className="email-input"
              />
              <Link to="/register" className="btn-lg">
                Register Now <i className="fas fa-chevron-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <Footer />
    </div>
  );
};

export default Home;
