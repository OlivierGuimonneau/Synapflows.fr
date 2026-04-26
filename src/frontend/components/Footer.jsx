import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <p className="footer-copyright">&copy; 2026 SynapFlows. Tous droits réservés.</p>
          <nav className="footer-links">
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/conditions-generales">Conditions générales</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
