import React, { useState, useEffect } from 'react';
import Progress from '../components/Progress';
import Form from '../components/Form';
import SuccessScreen from '../components/SuccessScreen';

export default function FormPage({ onSubmitted }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const TOTAL_STEPS = 6;

  useEffect(() => {
    if (submitted && onSubmitted) {
      onSubmitted();
    }
  }, [submitted, onSubmitted]);

  const handleStepChange = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormChange = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleSubmit = async (reCaptchaToken) => {
    const required = ['prenom', 'nom', 'email', 'societe', 'type_projet', 'description'];
    const missing = required.filter(k => !formData[k] || formData[k] === '');
    
    if (missing.length > 0) {
      alert('Merci de compléter les champs obligatoires avant l\'envoi.');
      return;
    }

    console.log('[FormPage] Token reçu:', reCaptchaToken);

    setLoading(true);
    try {
      const payload = {
        ...formData,
        reCaptchaToken: reCaptchaToken || 'bypass_token',
        submitted_at: new Date().toISOString()
      };

      console.log('[FormPage] Envoi du payload...');

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('[FormPage] Réponse status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('[FormPage] Erreur API:', error);
        throw new Error(error.error || 'Erreur lors de la soumission');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('[FormPage] Erreur:', error);
      alert('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!submitted ? (
        <>
          <Progress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          <Form
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            formData={formData}
            onFormChange={handleFormChange}
            onStepChange={handleStepChange}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </>
      ) : (
        <SuccessScreen formData={formData} />
      )}
    </>
  );
}
