import React, { useState } from 'react';
import { Ticket, Globe, ChevronDown, Sparkles } from 'lucide-react';
import AirWayBrandLogo from './AirWayBrandLogo';

export default function Navbar({ onOpenMyBookings, currency, setCurrency, language, setLanguage, activeNav, setActiveNav }) {
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'FR', name: 'Français' },
    { code: 'DE', name: 'Deutsch' }
  ];

  const navItems = ['Book & Manage', 'Explore', 'Plan', 'Experience', 'Loyalty', 'Support'];

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 90 }}>
      
      {/* Top Utility Bar */}
      <div style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9', padding: '8px 32px', fontSize: '0.8rem' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Left info badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-sub)', fontWeight: '600' }}>
            <Sparkles size={14} color="var(--primary-cyan)" />
            <span>AirwAy Flagship Digital Travel Experience</span>
          </div>

          {/* Right Utility Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            {/* Language Selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0f172a',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Globe size={14} color="var(--primary-cyan)" />
                <span>{language}</span>
                <ChevronDown size={12} />
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
                        color: language === l.code ? 'var(--primary-cyan)' : '#0f172a',
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

            {/* Currency Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', padding: '2px 4px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              {['USD', 'INR', 'EUR'].map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  style={{
                    background: currency === c ? 'var(--primary-cyan)' : 'transparent',
                    color: currency === c ? '#ffffff' : 'var(--text-sub)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* User Access Button */}
            <button
              onClick={onOpenMyBookings}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-cyan)',
                fontWeight: '800',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Ticket size={16} />
              <span>My Bookings</span>
            </button>

          </div>

        </div>
      </div>

      {/* Main Flagship Navigation Bar */}
      <div style={{ padding: '14px 32px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Brand Logo */}
          <div style={{ cursor: 'pointer' }} onClick={() => setActiveNav('Book & Manage')}>
            <AirWayBrandLogo size={42} showText={true} />
          </div>

          {/* Structured Top Navigation Links */}
          <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeNav === item ? '3px solid var(--primary-cyan)' : '3px solid transparent',
                  padding: '8px 0',
                  color: activeNav === item ? 'var(--primary-cyan)' : '#0f172a',
                  fontWeight: activeNav === item ? '800' : '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {item}
              </button>
            ))}
          </nav>

        </div>
      </div>

    </header>
  );
}
