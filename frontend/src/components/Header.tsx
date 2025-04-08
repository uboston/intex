import { useNavigate } from 'react-router-dom';
import './Header.css';
import { FaSearch } from 'react-icons/fa'; // Ensure you have 'react-icons' installed

function Header() {
  const navigate = useNavigate();

  const goToSearch = () => {
    navigate('/search'); // Navigate to the search page
  };

  return (
    <div className="header-bar">
      {/* Left side: Logo and Site Title */}
      <div className="header-left">
        <img
          src="/Logo.png"
          alt="CineNiche Logo"
          className="header-logo"
        />
      </div>

      {/* Right side: Search button and Circular Profile */}
      <div className="header-right">
        {/* Search button to navigate programmatically */}
        <button className="header-search-btn" onClick={goToSearch}>
          <FaSearch size={18} />
        </button>

        {/* Circular profile image (placeholder) */}
        <div className="header-profile">
          <img
            src="/profileimage.png"
            alt="Profile"
            className="header-profile-img"
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
