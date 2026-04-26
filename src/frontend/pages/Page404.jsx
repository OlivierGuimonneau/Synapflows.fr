import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/404.css';

export default function Page404() {
  return (
    <div className="page-404">
      <div className="container-404">
        <div className="error-content">
          <div className="error-code">404</div>
          <h1>Page non trouvée</h1>
          <p className="error-message">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="error-suggestions">
            <h2>Que faire maintenant ?</h2>
            <ul>
              <li>
                <Link to="/">Retourner à l'accueil</Link>
              </li>
              <li>
                <Link to="/faq">Consulter la FAQ</Link>
              </li>
              <li>
                <Link to="/formulaire-qualification">Qualifier mon projet</Link>
              </li>
              <li>
                <a href="mailto:olivier@synapflows.fr">Nous contacter par email</a>
              </li>
            </ul>
          </div>

          <div className="error-footer">
            <p>
              Vous continuez à avoir des problèmes ? 
              <a href="mailto:olivier@synapflows.fr"> Contactez-nous</a>
            </p>
          </div>
        </div>

        <div className="error-illustration">
          <svg viewBox="0 0 400 400" width="300" height="300">
            {/* Background circle */}
            <circle cx="200" cy="200" r="180" fill="rgba(31, 134, 234, 0.1)" stroke="rgba(31, 134, 234, 0.2)" strokeWidth="2"/>
            
            {/* Large 404 text */}
            <text x="200" y="240" fontSize="120" fontWeight="bold" textAnchor="middle" fill="rgba(31, 134, 234, 0.15)">404</text>
            
            {/* Question mark */}
            <g transform="translate(200, 120)">
              <circle cx="0" cy="0" r="50" fill="none" stroke="rgba(31, 134, 234, 0.3)" strokeWidth="3"/>
              <text x="0" y="20" fontSize="60" fontWeight="bold" textAnchor="middle" fill="rgba(31, 134, 234, 0.4)">?</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
