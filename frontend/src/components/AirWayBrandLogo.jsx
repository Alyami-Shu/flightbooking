import React from 'react';

export default function AirWayBrandLogo({ size = 36, textColor = '#0f172a', lightText = false, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        textDecoration: 'none', 
        userSelect: 'none',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      {/* AirwAy Single Premium Luxury Wordmark (No icon, no subtitle) */}
      <span style={{
        fontSize: `${size}px`,
        fontWeight: '900',
        letterSpacing: '-1.2px',
        color: lightText ? '#ffffff' : textColor,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        lineHeight: '1'
      }}>
        AirwAy
      </span>
    </div>
  );
}
