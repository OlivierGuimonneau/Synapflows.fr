import React, { useState } from 'react';

export default function Step6({ data, onChange, onPrev, onSubmit, loading }) {
  const [reCaptchaError, setReCaptchaError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setReCaptchaError(null);
      console.log('[Step6] Submission with bypass token');
      // Bypass reCAPTCHA - passer un token vide (sera contourné côté backend)
      onSubmit('bypass_token');
    } catch (error) {
      const errorMsg = error.message || 'Erreur inconnue';
      setReCaptchaError(errorMsg);
      console.error('[Step6] Exception:', error);
      alert('Erreur: ' + errorMsg);
    }
  };

  return (
    <section className="card active">
      <div className="step-tag">Étape 6 · Budget & lancement</div>
      <h2>Cadrons la suite</h2>
      <p className="lead">Cette dernière étape nous aide à formuler une proposition réaliste, avec le bon phasage.</p>
      <div className="divider"></div>

      <div className="field-grid">
        <div className="field">
          <label>Budget envisagé</label>
          <select name="budget" value={data.budget || ''} onChange={handleChange}>
            <option value="">— Sélectionner —</option>
            <option>Moins de 1 000 €</option>
            <option>1 000 à 5 000 €</option>
            <option>5 000 à 15 000 €</option>
            <option>15 000 à 30 000 €</option>
            <option>30 000 € et plus</option>
            <option>À définir ensemble</option>
          </select>
        </div>
        <div className="field">
          <label>Délai souhaité</label>
          <select name="delai" value={data.delai || ''} onChange={handleChange}>
            <option value="">— Sélectionner —</option>
            <option>Urgent</option>
            <option>1 à 3 mois</option>
            <option>3 à 6 mois</option>
            <option>Plus de 6 mois</option>
            <option>Flexible</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>Informations complémentaires</label>
        <textarea
          name="commentaire"
          placeholder="Date clé, contraintes internes, validation DSI, maintenance souhaitée, etc."
          value={data.commentaire || ''}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="airtable-box">
        <h3>Vos données en sécurité</h3>
        <p>Les informations que vous nous transmettez restent strictement confidentielles. Elles nous permettront de préparer une proposition adaptée à votre projet. Nous ne les partagerons avec aucun tiers sans votre consentement.</p>
      </div>

      {reCaptchaError && (
        <div style={{ color: '#d32f2f', marginTop: '1rem', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          <strong>Erreur reCAPTCHA:</strong> {reCaptchaError}
        </div>
      )}

      <div className="nav">
        <button type="button" className="btn btn-ghost" onClick={onPrev} disabled={loading}>
          Retour
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
        </button>
      </div>
    </section>
  );
}
