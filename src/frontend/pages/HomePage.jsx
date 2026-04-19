import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/homepage.css';

export default function HomePage() {
  const services = [
    {
      icon: '⚙️',
      title: 'Automatisation des Processus',
      description: 'Optimisez vos workflows métier et réduisez les tâches manuelles avec nos solutions d\'automatisation (RPA).'
    },
    {
      icon: '💻',
      title: 'Applications Web Custom',
      description: 'Développement d\'applications spécifiques adaptées exactement à vos besoins métier.'
    },
    {
      icon: '🔗',
      title: 'Intégration Systèmes',
      description: 'Connectez vos outils et données pour une vue d\'ensemble unifiée de votre activité.'
    },
    {
      icon: '🎯',
      title: 'Audit & Consulting',
      description: 'Analyser vos processus actuels et identifier les opportunités d\'optimisation.'
    },
    {
      icon: '🛠️',
      title: 'Maintenance & Support',
      description: 'Support technique continu et maintenance de vos solutions pour une performance optimale.'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Transformez votre entreprise avec l'automatisation</h1>
          <p className="hero-subtitle">Développement rapide • Expertise de 30 ans • Hébergement en France</p>
          <p className="hero-description">
            SynapFlows concrétise vos projets numériques en combinant la rapidité d'exécution, l'expérience de grandes multinationalles et la confiance du stockage data local.
          </p>
          <div className="hero-buttons">
            <Link to="/formulaire-qualification" className="btn btn-primary">
              Commencer une qualification de projet
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="/assets/images/video-synapflows.gif" 
            alt="SynapFlows Animation" 
            className="hero-animation"
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2>Nos Services</h2>
          <p className="section-subtitle">Tout ce dont vous avez besoin pour innover et optimiser</p>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="value-section">
        <div className="container">
          <div className="value-content">
            <div className="value-item">
              <div className="value-number">30<span>ans</span></div>
              <p>D'expérience dans les plus grandes multinationales</p>
            </div>
            <div className="value-item">
              <div className="value-number">⚡</div>
              <p>Développement rapide sans compromettre la qualité</p>
            </div>
            <div className="value-item">
              <div className="value-number">🇫🇷</div>
              <p>Hébergement en France - Conformité RGPD garantie</p>
            </div>
            <div className="value-item">
              <div className="value-number">⏱️</div>
              <p>Gain de temps mesurable sur vos processus</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Parlons de votre projet</h2>
          <p>Explorez comment SynapFlows peut transformer votre activité</p>
          <div className="cta-buttons">
            <Link to="/formulaire-qualification" className="btn btn-outline btn-large">
              Qualifier mon projet
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
