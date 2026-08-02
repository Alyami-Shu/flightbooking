import React from 'react';

export default function AirWayBrandLogo({ size = 38, showText = true, textColor = '#0f172a', lightText = false }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', userSelect: 'none' }}>
      
      {/* Sleek Supersonic Wing Monogram Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 4px 10px rgba(2, 132, 199, 0.25))' }}
      >
        <defs>
          {/* Main Electric Gradient */}
          <linearGradient id="airway_wing_grad" x1="4" y1="44" x2="44" y2="4" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          {/* Accent Swoop Gradient */}
          <linearGradient id="airway_swoop_grad" x1="12" y1="36" x2="40" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* Outer Circular Brand Shield / Horizon Ring */}
        <circle cx="24" cy="24" r="22" fill="url(#airway_wing_grad)" opacity="0.1" />
        <circle cx="24" cy="24" r="21.5" stroke="url(#airway_wing_grad)" strokeWidth="1.5" opacity="0.4" />

        {/* Dynamic Jet Wing 'A' Monogram */}
        <path
          d="M 12 36 L 24 10 L 36 36 L 30 36 L 24 22 L 18 36 Z"
          fill="url(#airway_swoop_grad)"
        />

        {/* Supersonic Accent Jet Trajectory Line */}
        <path
          d="M 8 32 C 16 30 26 24 38 12"
          stroke="url(#airway_wing_grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Forward Motion Plane Icon / Tip */}
        <polygon
          points="38,12 32,15 35,18"
          fill="#10b981"
        />
      </svg>

      {/* Brand Name Typography */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
          <div style={{
            fontSize: `${size * 0.58}px`,
            fontWeight: '900',
            letterSpacing: '-0.5px',
            color: lightText ? '#ffffff' : textColor,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Air<span style={{ color: 'var(--primary-cyan, #0284c7)' }}>wAy</span>
          </div>
          <span style={{
            fontSize: `${size * 0.22}px`,
            fontWeight: '800',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: lightText ? 'rgba(255,255,255,0.7)' : '#64748b',
            marginTop: '2px'
          }}>
            Flagship Travel
          </span>
        </div>
      )}

    </div>
  );
}
