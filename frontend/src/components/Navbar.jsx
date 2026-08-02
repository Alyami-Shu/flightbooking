import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import AirWayBrandLogo from './AirWayBrandLogo';

export default function Navbar({ currency, setCurrency, language, setLanguage, activeNav, setActiveNav }) {
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'FR', name: 'Français' },
    { code: 'DE', name: 'Deutsch' }
  ];

  // Exact navigation order: Explore, Plan, Book & Manage, Experience, Loyalty, Support
  const navItems = ['Explore', 'Plan', 'Book & Manage', 'Experience', 'Loyalty', 'Support'];

  return (
    <header style={{ 
      background: '#ffffff', 
      borderBottom: '1px solid #e2e8f0', 
      position: 'sticky', 
      top: 0, 
      zIndex: 90,
      boxShadow: '0 2px 15px rgba(15, 23, 42, 0.03)'
    }}>
      <div style={{ 
        maxWidth: '1440px', 
        margin: '0 auto', 
        padding: '16px 36px',
        display: 'flex', 
        alignItems: 'center',
        gap: '44px'
      }}>
        
        {/* 1. Left: Premium AirwAy Wordmark Branding */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AirWayBrandLogo 
            size={32} 
            onClick={() => setActiveNav('Book & Manage')}
          />
        </div>

        {/* 2. Center: Main Navigation Bar */}
        <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {navItems.map((item) => {
            const isActive = activeNav === item;
            return (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #0f172a' : '2px solid transparent',
                  padding: '6px 0',
                  color: isActive ? '#0f172a' : '#475569',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '-0.2px'
                }}
              >
                {item}
              </button>
            );
          })}
        </nav>

        {/* 3. Far Right Utility Controls: Language & Currency Only (Aligned to Far Right Margin) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto' }}>
          
          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 10px',
                color: '#0f172a',
                fontWeight: '700',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Globe size={14} color="#0284c7" />
              <span>{language}</span>
              <ChevronDown size={12} color="#64748b" />
            </button>

            {showLangMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                zIndex: 100,
                minWidth: '130px',
                overflow: 'hidden'
              }}>
                {languages.map(l => (
                  <div
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    style={{
                      padding: '8px 12px',
                      fontSize: '0.8rem',
                      color: language === l.code ? '#0284c7' : '#0f172a',
                      fontWeight: language === l.code ? '800' : '600',
                      cursor: 'pointer',
                      background: language === l.code ? '#f0f9ff' : 'transparent'
                    }}
                  >
                    {l.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Currency Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '2px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            {['USD', 'INR', 'EUR'].map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                style={{
                  background: currency === c ? '#0f172a' : 'transparent',
                  color: currency === c ? '#ffffff' : '#64748b',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {c}
              </button>
            ))}
          </div>

        </div>

      </div>
    </header>
  );
}
