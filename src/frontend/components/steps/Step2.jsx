import React from 'react';

export default function Step2({ data, onChange, onNext, onPrev }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleContinue = () => {
    if (!data.type_projet || !data.description) {
      alert('Veuillez compléter les champs obligatoires');
      return;
    }
    onNext();
  };

  return (
    <section className="card active">
      <div className="step-tag">Étape 2 · Projet</div>
      <h2>Décrivez le besoin</h2>
      <p className="lead">Expliquez le plus concrètement possible ce que vous voulez construire, améliorer ou automatiser.</p>
      <div className="divider"></div>

      <div className="field">
        <label>Type de projet <span className="req">*</span></label>
        <div className="choice-grid">
          {[
            { value: 'site_vitrine', icon: '🌐', label: 'Site vitrine', desc: 'Présenter votre activité et générer des contacts' },
            { value: 'webapp', icon: '⚙️', label: 'Webapp métier', desc: 'Outil interne, extranet, portail, SaaS' },
            { value: 'automatisation', icon: '🤖', label: 'Automatisation', desc: 'Workflows, synchronisations, notifications, API' },
            { value: 'refonte', icon: '🔄', label: 'Refonte', desc: 'Moderniser un existant technique ou visuel' },
            { value: 'ecommerce', icon: '🛒', label: 'E-commerce', desc: 'Boutique, catalogue, panier, paiement' },
            { value: 'autre', icon: '💡', label: 'Autre', desc: 'Besoin spécifique à détailler' }
          ].map(option => (
            <label key={option.value} className={`choice ${data.type_projet === option.value ? 'selected' : ''}`}>
              <input
                type="radio"
                name="type_projet"
                value={option.value}
                checked={data.type_projet === option.value}
                onChange={handleChange}
              />
              <span className="icon">{option.icon}</span>
              <span>
                {option.label}
                <small>{option.desc}</small>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Description du projet <span className="req">*</span><span className="hint">Contexte, problème actuel, solution souhaitée, résultat attendu.</span></label>
        <textarea
          name="description"
          placeholder="Décrivez le projet avec vos mots..."
          value={data.description || ''}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="field">
        <label>Objectif principal</label>
        <select name="objectif" value={data.objectif || ''} onChange={handleChange}>
          <option value="">— Sélectionner —</option>
          <option>Générer des leads</option>
          <option>Automatiser un processus</option>
          <option>Créer un nouvel outil métier</option>
          <option>Améliorer l'expérience client</option>
          <option>Moderniser un existant</option>
        </select>
      </div>

      <div className="nav">
        <button type="button" className="btn btn-ghost" onClick={onPrev}>Retour</button>
        <button type="button" className="btn btn-primary" onClick={handleContinue}>Continuer</button>
      </div>
    </section>
  );
}
