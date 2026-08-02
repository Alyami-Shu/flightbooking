import React, { useState } from 'react';

export const AIRLINE_LOGOS = {
  DL: {
    name: 'Delta Air Lines',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Delta_logo.svg',
    fallbackBg: 'linear-gradient(135deg, #002244, #c8102e)'
  },
  EK: {
    name: 'Emirates',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg',
    fallbackBg: 'linear-gradient(135deg, #d71921, #b5121b)'
  },
  QR: {
    name: 'Qatar Airways',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Qatar_Airways_Logo.svg',
    fallbackBg: 'linear-gradient(135deg, #58112c, #8a1538)'
  },
  AI: {
    name: 'Air India',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Air_India_Logo.svg',
    fallbackBg: 'linear-gradient(135deg, #e31837, #ff6b00)'
  },
  BA: {
    name: 'British Airways',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/British_Airways_Logo.svg',
    fallbackBg: 'linear-gradient(135deg, #eb2226, #012169)'
  },
  LH: {
    name: 'Lufthansa',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lufthansa_Logo_2018.svg',
    fallbackBg: 'linear-gradient(135deg, #05164d, #f9a01b)'
  },
  AF: {
    name: 'Air France',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Air_France_Logo.svg',
    fallbackBg: 'linear-gradient(135deg, #002157, #e1000f)'
  },
  SQ: {
    name: 'Singapore Airlines',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Singapore_Airlines_Logo.svg',
    fallbackBg: 'linear-gradient(135deg, #002b66, #ffb81c)'
  },
  TK: {
    name: 'Turkish Airlines',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Turkish_Airlines_logo_2019.svg',
    fallbackBg: 'linear-gradient(135deg, #c8102e, #1a1a1a)'
  },
  CX: {
    name: 'Cathay Pacific',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Cathay_Pacific_logo.svg',
    fallbackBg: 'linear-gradient(135deg, #006564, #004b49)'
  }
};

export default function AirlineLogo({ code, size = 48 }) {
  const [imgError, setImgError] = useState(false);
  const info = AIRLINE_LOGOS[code] || { name: code, url: '', fallbackBg: 'linear-gradient(135deg, #0284c7, #2563eb)' };

  if (imgError || !info.url) {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '12px',
        background: info.fallbackBg,
        color: '#ffffff',
        fontWeight: '900',
        fontSize: size > 40 ? '0.9rem' : '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
        flexShrink: 0
      }}>
        {code}
      </div>
    );
  }

  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '12px',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: size > 40 ? '6px' : '4px',
      flexShrink: 0
    }}>
      <img
        src={info.url}
        alt={info.name}
        onError={() => setImgError(true)}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
}
