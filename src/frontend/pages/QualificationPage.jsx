import React, { useState } from 'react';
import Hero from '../components/Hero';
import FormPage from './FormPage';

export default function QualificationPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      {!submitted && <Hero />}
      <FormPage onSubmitted={() => setSubmitted(true)} />
    </>
  );
}
