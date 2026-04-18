import React from 'react';

export default function Progress({ currentStep, totalSteps }) {
  const pct = Math.round(((currentStep - 1) / totalSteps) * 100);

  return (
    <div className="progress-shell">
      <div className="progress-meta">
        <span>Étape {currentStep} sur {totalSteps}</span>
        <span>{pct}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}
