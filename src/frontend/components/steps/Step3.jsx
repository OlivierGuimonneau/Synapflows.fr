import React from 'react';

export default function Step3({ data, onChange, onNext, onPrev }) {
  const handleCheckbox = (name, value) => {
    const arr = Array.isArray(data[name]) ? data[name] : [];
    const updated = arr.includes(value)
      ? arr.filter(v => v !== value)
      : [...arr, value];
    onChange({ [name]: updated });
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const features = [
    { value: 'blog', icon: '📝', label: 'Blog / articles', desc: 'Publication de contenus éditoriaux' },
    { value: 'cms', icon: '✏️', label: 'Administration de contenu', desc: 'Éditer les pages en autonomie' },
    { value: 'compte', icon: '👤', label: 'Espace utilisateur', desc: 'Compte, connexion, droits, profils' },
    { value: 'emails', icon: '📧', label: 'Envoi d\'emails', desc: 'Notifications et emails transactionnels' },
    { value: 'workflow', icon: '⚡', label: 'Workflow automatisé', desc: 'Règles, validation, relances, actions' },
    { value: 'reporting', icon: '📈', label: 'Reporting', desc: 'KPI, tableaux de bord, exports' },
    { value: 'paiement', icon: '💳', label: 'Paiement en ligne', desc: 'Stripe, PayPal, CB' },
    { value: 'api', icon: '🔌', label: 'Connexions API', desc: 'CRM, ERP, emailing, outils tiers' },
    { value: 'agenda', icon: '📅', label: 'Réservation / agenda', desc: 'Prise de rendez-vous, planning' },
    { value: 'documents', icon: '📁', label: 'Documents / GED', desc: 'Upload, classement, signature' },
    { value: 'ia', icon: '🧠', label: 'Fonctions IA', desc: 'Classification, génération, recommandations' },
    { value: 'multilingue', icon: '🌍', label: 'Multilingue', desc: 'FR / EN et autres langues' }
  ];

  const fonctionsArray = Array.isArray(data.fonctions) ? data.fonctions : [];

  return (
    <section className="card active">
      <div className="step-tag">Étape 3 · Fonctionnalités</div>
      <h2>Ce que la solution doit permettre</h2>
      <p className="lead">Sélectionnez les blocs fonctionnels pertinents. Ils serviront de base au cadrage de la V1 et des évolutions futures.</p>
      <div className="divider"></div>

      <div className="field">
        <div className="group-title">Fonctions métier</div>
        <div className="choice-grid">
          {features.map(feature => (
            <label key={feature.value} className={`choice ${fonctionsArray.includes(feature.value) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={fonctionsArray.includes(feature.value)}
                onChange={() => handleCheckbox('fonctions', feature.value)}
              />
              <span className="icon">{feature.icon}</span>
              <span>
                {feature.label}
                <small>{feature.desc}</small>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Fonctionnalités prioritaires pour la V1</label>
        <textarea
          name="priorites"
          placeholder="Quelles sont les fonctionnalités indispensables dès la première version ?"
          value={data.priorites || ''}
          onChange={handleTextChange}
        ></textarea>
      </div>

      <div className="nav">
        <button type="button" className="btn btn-ghost" onClick={onPrev}>Retour</button>
        <button type="button" className="btn btn-primary" onClick={onNext}>Continuer</button>
      </div>
    </section>
  );
}
