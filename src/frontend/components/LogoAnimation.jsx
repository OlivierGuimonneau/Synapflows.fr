import React from 'react';
import '../styles/logo-animation.css';

export default function LogoAnimation() {
  return (
    <div className="logo-animation-container">
      <svg
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-svg"
      >
        {/* Glow effect filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#1F86EA', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#00D9FF', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Brain shape with glow */}
        <g className="brain" filter="url(#glow)">
          <path
            d="M 120 150 Q 100 120 100 100 Q 100 70 130 60 Q 150 55 160 70 Q 170 55 190 60 Q 220 70 220 100 Q 220 120 200 150"
            fill="url(#logoGradient)"
          />
          <circle cx="110" cy="130" r="15" fill="url(#logoGradient)" />
          <circle cx="210" cy="130" r="15" fill="url(#logoGradient)" />
          <path
            d="M 120 160 Q 100 180 90 200 Q 85 210 95 215 Q 110 220 125 210 Q 140 200 150 185"
            fill="url(#logoGradient)"
          />
          <path
            d="M 200 160 Q 220 180 230 200 Q 235 210 225 215 Q 210 220 195 210 Q 180 200 170 185"
            fill="url(#logoGradient)"
          />
        </g>

        {/* Pulse circles */}
        <circle cx="160" cy="160" r="80" fill="none" stroke="url(#logoGradient)" strokeWidth="2" className="pulse-circle pulse-1" opacity="0.6" />
        <circle cx="160" cy="160" r="110" fill="none" stroke="url(#logoGradient)" strokeWidth="1" className="pulse-circle pulse-2" opacity="0.3" />
      </svg>

      {/* Ambient glow background */}
      <div className="glow-bg"></div>
    </div>
  );
}
