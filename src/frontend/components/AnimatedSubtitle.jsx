import React, { useState, useEffect } from 'react';
import '../styles/animated-subtitle.css';

export default function AnimatedSubtitle() {
  const phrases = [
    "L'IA qui automatise vos processus",
    "L'IA qui accélère votre développement",
    "L'IA qui transforme votre business"
  ];

  const [displayedText, setDisplayedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const typeSpeed = 50; // Speed of typing
    const pauseTime = 2500; // Pause before deleting
    const deleteSpeed = 30; // Speed of deleting

    let timeout;

    if (!isDeleting) {
      // Typing phase
      if (charIndex < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentPhrase.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typeSpeed);
      } else {
        // Pause before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      // Deleting phase
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentPhrase.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, deleteSpeed);
      } else {
        // Move to next phrase
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentPhraseIndex, phrases]);

  return (
    <p className="hero-subtitle animated-subtitle">
      {displayedText}
      <span className="cursor">|</span>
    </p>
  );
}

