import React from 'react';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';
import Step6 from './steps/Step6';

export default function Form({
  currentStep,
  totalSteps,
  formData,
  onFormChange,
  onStepChange,
  onSubmit,
  loading
}) {
  const steps = [Step1, Step2, Step3, Step4, Step5, Step6];
  const CurrentStep = steps[currentStep - 1];

  return (
    <div className="form-wrap">
      <CurrentStep
        data={formData}
        onChange={onFormChange}
        onNext={() => onStepChange(currentStep + 1)}
        onPrev={() => onStepChange(currentStep - 1)}
        onSubmit={onSubmit}
        loading={loading}
      />
    </div>
  );
}
