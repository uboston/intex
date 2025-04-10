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
        credentials: 'include', // Ensures cookies are sent with the request
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

  // Set the 'kidsView' cookie
  const setKidsViewCookie = (value: string) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + 60 * 60 * 24 * 365 * 1000); // 1 year from now
    document.cookie = `kidsView=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax; Secure`; // SameSite attribute and Secure for HTTPS
    console.log('Cookie set:', document.cookie); // Log the cookies to see if it's being set
  };

  // Handle toggle of Kids' View setting
  const handleKidsViewClick = () => {
    const currentCookieValue = getCookie('kidsView');
    const newValue = currentCookieValue === 'true' ? 'false' : 'true';
    setKidsViewCookie(newValue);
    // Reload the page to apply the changes
    window.location.reload(); // This will refresh the page
  };

  // Get the value of a cookie by name
  const getCookie = (name: string): string | null => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
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
              <button onClick={handleKidsViewClick}>Kids' View</button>
              <button onClick={() => navigate('/')}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
