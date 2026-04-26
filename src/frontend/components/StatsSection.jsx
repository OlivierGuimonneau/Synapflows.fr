import React, { useState, useEffect, useRef } from 'react';
import '../styles/stats.css';

export default function StatsSection() {
  const stats = [
    { value: 10, label: 'Plus rapide qu\'un développement traditionnel', symbol: 'x' },
    { value: 80, label: 'De réduction des tâches manuelles', symbol: '%' },
    { value: 48, label: 'Du brief au premier prototype fonctionnel', symbol: 'h' },
    { value: 100, label: 'Projets livrés avec IA intégrée', symbol: '%' }
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatCounter key={index} value={stat.value} label={stat.label} symbol={stat.symbol} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCounter({ value, label, symbol }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  // Easing function for deceleration
  const easeOutQuad = (t) => t * (2 - t);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    const duration = 2000; // 2 secondes

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Apply easing
      const easedProgress = easeOutQuad(progress);
      setCount(Math.floor(easedProgress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value]);

  return (
    <div className="stat-card" ref={ref}>
      <div className="stat-value">
        {count}<span className="stat-symbol">{symbol}</span>
      </div>
      <p className="stat-label">{label}</p>
    </div>
  );
}
