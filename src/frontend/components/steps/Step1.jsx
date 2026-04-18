import React from 'react';

export default function Step1({ data, onChange, onNext }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleContinue = () => {
    if (!data.prenom || !data.nom || !data.email || !data.societe) {
      alert('Veuillez compléter les champs obligatoires');
      return;
    }
    onNext();
  };

  return (
    <section className="card active">
      <div className="step-tag">Étape 1 · Contact</div>
      <h2>Faisons connaissance</h2>
      <p className="lead">Ces informations permettent de personnaliser votre proposition et d'identifier le bon contexte métier.</p>
      <div className="divider"></div>

      <div className="field-grid">
        <div className="field">
          <label>Prénom <span className="req">*</span></label>
          <input
            type="text"
            name="prenom"
            placeholder="Marie"
            value={data.prenom || ''}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label>Nom <span className="req">*</span></label>
          <input
            type="text"
            name="nom"
            placeholder="Dupont"
            value={data.nom || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="field">
        <label>Email professionnel <span className="req">*</span></label>
        <input
          type="email"
          name="email"
          placeholder="marie@entreprise.fr"
          value={data.email || ''}
          onChange={handleChange}
        />
      </div>

      <div className="field-grid">
        <div className="field">
          <label>Téléphone</label>
          <input
            type="tel"
            name="tel"
            placeholder="+33 6 12 34 56 78"
            value={data.tel || ''}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label>Fonction</label>
          <input
            type="text"
            name="fonction"
            placeholder="DSI, CEO, responsable marketing..."
            value={data.fonction || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="field">
        <label>Entreprise/Association <span className="req">*</span></label>
        <input
          type="text"
          name="societe"
          placeholder="Nom de votre structure"
          value={data.societe || ''}
          onChange={handleChange}
        />
      </div>

      <div className="nav">
        <span></span>
        <button type="button" className="btn btn-primary" onClick={handleContinue}>
          Continuer
        </button>
      </div>
    </section>
  );
}
