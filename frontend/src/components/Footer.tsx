// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>
        <Link to="/privacy" className="privacy-link">
          Privacy Policy
        </Link>{' '}
        | © {new Date().getFullYear()} CineNiche
      </p>
    </footer>
  );
};

export default Footer;
