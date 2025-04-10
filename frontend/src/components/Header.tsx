import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { FaSearch } from 'react-icons/fa';

function Header() {
  const navigate = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [kidsViewText, setKidsViewText] = useState("Kid's View");

  useEffect(() => {
    const currentCookieValue = getCookie('kidsView');
    setKidsViewText(currentCookieValue === 'true' ? 'Parent View' : "Kid's View");
  }, []);

  const goToSearch = () => {
    navigate('/search');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('https://cinenicheee-c0fqg8b9hscqe7bk.eastus-01.azurewebsites.net/logout', {
        method: 'POST',
        credentials: 'include',
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

  const setKidsViewCookie = (value: string) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + 60 * 60 * 24 * 365 * 1000); // 1 year from now
    document.cookie = `kidsView=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax; Secure`;
    console.log('Cookie set:', document.cookie);
  };

  const handleKidsViewClick = () => {
    const currentCookieValue = getCookie('kidsView');
    const newValue = currentCookieValue === 'true' ? 'false' : 'true';
    setKidsViewCookie(newValue);
    setKidsViewText(newValue === 'true' ? 'Parent View' : "Kids' View");
    window.location.reload(); // Optional: remove this if you want a smoother UX without reload
  };

  const getCookie = (name: string): string | null => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
  };

  return (
    <div className="header-bar">
      {/* Left side: Logo and Site Title */}
      <div className="header-left">
        <img
          src="/newlogo.png"
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
              <button onClick={handleKidsViewClick}>{kidsViewText}</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
