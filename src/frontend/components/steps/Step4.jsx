import React from 'react';

export default function Step4({ data, onChange, onNext, onPrev }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleCheckbox = (name, value) => {
    const arr = Array.isArray(data[name]) ? data[name] : [];
    const updated = arr.includes(value)
      ? arr.filter(v => v !== value)
      : [...arr, value];
    onChange({ [name]: updated });
  };

  const profils = [
    { value: 'clients', icon: '🧑‍💼', label: 'Clients', desc: 'B2C ou B2B' },
    { value: 'interne', icon: '👨‍💻', label: 'Équipe interne', desc: 'Utilisateurs collaborateurs' },
    { value: 'admins', icon: '🛠️', label: 'Administrateurs', desc: 'Gestion et supervision' },
    { value: 'partenaires', icon: '🤝', label: 'Partenaires', desc: 'Accès contrôlé externes' }
  ];

  const profilesArray = Array.isArray(data.profils) ? data.profils : [];

  return (
    <section className="card active">
      <div className="step-tag">Étape 4 · Utilisateurs & données</div>
      <h2>Qui utilisera la solution ?</h2>
      <p className="lead">Cette partie permet d'anticiper les enjeux de volumétrie, d'ergonomie et de sécurité.</p>
      <div className="divider"></div>

      <div className="field-grid">
        <div className="field">
          <label>Nombre d'utilisateurs au lancement</label>
          <select name="users_launch" value={data.users_launch || ''} onChange={handleChange}>
            <option value="">— Sélectionner —</option>
            <option>Moins de 50</option>
            <option>50 à 200</option>
            <option>200 à 1 000</option>
            <option>Plus de 1 000</option>
          </select>
        </div>
        <div className="field">
          <label>Estimation à 1 an</label>
          <select name="users_year1" value={data.users_year1 || ''} onChange={handleChange}>
            <option value="">— Sélectionner —</option>
            <option>Moins de 50</option>
            <option>50 à 200</option>
            <option>200 à 1 000</option>
            <option>Plus de 1 000</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>Profils d'utilisateurs</label>
        <div className="choice-grid">
          {profils.map(p => (
            <label key={p.value} className={`choice ${profilesArray.includes(p.value) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={profilesArray.includes(p.value)}
                onChange={() => handleCheckbox('profils', p.value)}
              />
              <span className="icon">{p.icon}</span>
              <span>
                {p.label}
                <small>{p.desc}</small>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Contraintes données / conformité</label>
        <textarea
          name="compliance"
          placeholder="RGPD, données sensibles, hébergement France, exigences sécurité, etc."
          value={data.compliance || ''}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="field">
        <label>Outils existants à intégrer</label>
        <textarea
          name="integrations"
          placeholder="Salesforce, HubSpot, Stripe, Brevo, Odoo, SAP, Power BI..."
          value={data.integrations || ''}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="nav">
        <button type="button" className="btn btn-ghost" onClick={onPrev}>Retour</button>
        <button type="button" className="btn btn-primary" onClick={onNext}>Continuer</button>
      </div>
    </section>
  );
}
