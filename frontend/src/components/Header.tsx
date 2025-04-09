import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { FaSearch } from 'react-icons/fa';

function Header() {
  const navigate = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const goToSearch = () => {
    navigate('/search');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleLogout = async () => {
    try {
      // Post request to logout
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'include'  // Ensures cookies are sent with the request
      });
      if (response.ok) {
        console.log('Logout successful');
        navigate('/login');
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="header-bar">
      {/* Left side: Logo and Site Title */}
      <div className="header-left">
        <img
          src="/Logo.png"
          alt="CineNiche Logo"
          className="header-logo"
          onClick={() => navigate('/movies')}
        />
      </div>

      {/* Right side: Search button and Circular Profile */}
      <div className="header-right">
        <button className="header-search-btn" onClick={goToSearch}>
          <FaSearch size={18} />
        </button>
        <div className="header-profile" onClick={toggleDropdown}>
          <img
            src="/profileimage.png"
            alt="Profile"
            className="header-profile-img"
          />
          {isDropdownVisible && (
            <div className="profile-dropdown">
              <button onClick={() => navigate('/movies')}>Home</button>
              <button onClick={() => navigate('/admin')}>Admin</button>
              <button onClick={() => navigate('/')}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
