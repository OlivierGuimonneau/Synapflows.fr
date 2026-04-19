import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="site-header">
      <Link to="/" className="brand" onClick={handleMenuClose}>
        <img src="/assets/images/logo-synapflows.png" alt="Logo SynapFlows" />
      </Link>

      <button
        className="hamburger"
        onClick={handleMenuToggle}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`site-nav ${isMenuOpen ? 'open' : ''}`}>
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
          onClick={handleMenuClose}
        >
          Accueil
        </Link>
        <Link
          to="/formulaire-qualification"
          className={`nav-link ${isActive('/formulaire-qualification') ? 'active' : ''}`}
          onClick={handleMenuClose}
        >
          Qualifier mon projet
        </Link>
      </nav>
    </header>
  );
}
