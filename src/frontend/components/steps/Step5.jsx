import React from 'react';

export default function Step5({ data, onChange, onNext, onPrev }) {
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

  const ambiances = [
    { value: 'sobre', icon: '🧊', label: 'Sobre', desc: 'Interface calme et lisible' },
    { value: 'moderne', icon: '🚀', label: 'Moderne', desc: 'Design contemporain' },
    { value: 'premium', icon: '💎', label: 'Premium', desc: 'Finition haut de gamme' },
    { value: 'accessible', icon: '🤍', label: 'Accessible', desc: 'Clair, rassurant, pédagogique' },
    { value: 'tech', icon: '💻', label: 'Tech', desc: 'Image innovation / performance' },
    { value: 'humain', icon: '🤝', label: 'Humain', desc: 'Relationnel, confiance, proximité' }
  ];

  const ambianceArray = Array.isArray(data.ambiance) ? data.ambiance : [];

  return (
    <section className="card active">
      <div className="step-tag">Étape 5 · Design</div>
      <h2>Alignons l'interface avec votre image</h2>
      <p className="lead">Nous utilisons votre direction visuelle pour préparer des maquettes cohérentes avec votre marque et vos attentes.</p>
      <div className="divider"></div>

      <div className="field">
        <label>Ambiance visuelle attendue</label>
        <div className="choice-grid">
          {ambiances.map(a => (
            <label key={a.value} className={`choice ${ambianceArray.includes(a.value) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={ambianceArray.includes(a.value)}
                onChange={() => handleCheckbox('ambiance', a.value)}
              />
              <span className="icon">{a.icon}</span>
              <span>
                {a.label}
                <small>{a.desc}</small>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Références design ou sites inspirants</label>
        <textarea
          name="refs_design"
          placeholder="Partagez 2 ou 3 liens ou décrivez des styles qui vous plaisent."
          value={data.refs_design || ''}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="field">
        <label>Contraintes de charte graphique</label>
        <textarea
          name="charte"
          placeholder="Logo existant, couleurs imposées, typographies, iconographie, ton visuel, éléments à éviter..."
          value={data.charte || ''}
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
