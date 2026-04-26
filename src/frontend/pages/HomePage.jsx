import React from 'react';
import { Link } from 'react-router-dom';
import StatsSection from '../components/StatsSection';
import AnimatedSubtitle from '../components/AnimatedSubtitle';
import '../styles/homepage.css';

export default function HomePage() {
  const services = [
    {
      icon: '⚙️',
      title: 'Automatisation des Processus',
      description: 'Transformez vos workflows manuels en flux intelligents et autonomes. Éliminez les tâches répétitives et laissez vos équipes se concentrer sur la valeur ajoutée.'
    },
    {
      icon: '💻',
      title: 'Applications Web Custom',
      description: 'Développez vos applications à une vitesse inégalée grâce à notre approche d\'IA-augmented development. Du prototype à la production en quelques jours.'
    },
    {
      icon: '🔗',
      title: 'Intégration & Connectivité',
      description: 'Connectez l\'ensemble de votre écosystème digital : ERP, CRM, outils SaaS, bases de données. Tout communique, tout est synchronisé.'
    },
    {
      icon: '📈',
      title: 'Tableaux de bord & Analytique',
      description: 'Visualisez vos données en temps réel avec des dashboards personnalisés. Prenez des décisions éclairées basées sur vos indicateurs clés.'
    },
    {
      icon: '🛠️',
      title: 'Maintenance & Support',
      description: 'Support technique continu et maintenance de vos solutions pour une performance optimale.'
    },
    {
      icon: '🎯',
      title: 'Conseil & Accompagnement',
      description: 'De l\'audit de vos processus à la conduite du changement, nous vous guidons à chaque étape de votre transformation digitale.'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Accélèrez le développement de votre business.</h1>
          <AnimatedSubtitle />
          <p className="hero-description">
            Synapflows accompagne les entreprises dans leur transformation digitale grâce à l'automatisation intelligente et au développement accéléré par l'IA.
          </p>
          <div className="hero-buttons">
            <Link to="/formulaire-qualification" className="btn btn-primary">
              Vous avez un projet ?
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
          <span className="badge">Nos expertises</span>
          <h2>Des solutions pour chaque <span className="gradient-text">défi digital</span></h2>
          <p className="section-subtitle">De l'automatisation à l'intelligence artificielle, nous couvrons l'ensemble du spectre de la transformation digitale de votre entreprise.</p>
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

      {/* Stats Section */}
      <StatsSection />

      {/* Method Section */}
      <section className="method-section">
        <div className="container">
          <span className="badge">Notre Méthode</span>
          <h2>De l'idée à la <span className="gradient-text">mise en production</span></h2>
          <div className="timeline">
            <div className="timeline-item timeline-item--primary">
              <div className="timeline-marker">🔍</div>
              <div className="timeline-content">
                <span className="timeline-label">ÉTAPE 01</span>
                <h3>Audit & Analyse</h3>
                <p>Nous cartographions vos processus existants, identifions les goulots d'étranglement et définissons les opportunités d'automatisation à fort impact.</p>
              </div>
            </div>
            <div className="timeline-item timeline-item--secondary">
              <div className="timeline-marker">💡</div>
              <div className="timeline-content">
                <span className="timeline-label">ÉTAPE 02</span>
                <h3>Conception & Stratégie</h3>
                <p>Nous concevons l'architecture de la solution, choisissons les technologies IA adaptées et planifions les phases de déploiement.</p>
              </div>
            </div>
            <div className="timeline-item timeline-item--primary">
              <div className="timeline-marker">{'</>'}</div>
              <div className="timeline-content">
                <span className="timeline-label">ÉTAPE 03</span>
                <h3>Développement rapide</h3>
                <p>Grâce au vibe coding et à nos templates IA, nous développons des solutions fonctionnelles en un temps record, avec des itérations hebdomadaires.</p>
              </div>
            </div>
            <div className="timeline-item timeline-item--secondary">
              <div className="timeline-marker">🚀</div>
              <div className="timeline-content">
                <span className="timeline-label">ÉTAPE 04</span>
                <h3>Déploiement & Suivi</h3>
                <p>Mise en production, formation de vos équipes, monitoring continu et optimisation des performances pour maximiser votre ROI.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <span className="badge">Disponible pour nouveaux projets</span>
          <h2>Prêt à transformer <span className="gradient-text">votre entreprise</span> ?</h2>
          <p>Discutons de vos défis et découvrez comment Synapflows peut automatiser et accélérer votre croissance grâce à l'IA.</p>
          <div className="cta-buttons">
            <Link to="/formulaire-qualification" className="btn btn-outline btn-large">
              Prendre contact →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
