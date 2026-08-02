import React from 'react';
import { ShieldCheck, Award, Gift, DollarSign, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function ConfidenceGuarantee() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      borderRadius: '20px',
      padding: '36px 40px',
      color: '#ffffff',
      marginTop: '40px',
      marginBottom: '40px',
      boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Subtle Background Swoop */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(2, 132, 199, 0.2)', color: '#38bdf8', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
            <ShieldCheck size={14} /> AirwAy Trust Commitment
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-0.5px', color: '#ffffff', margin: 0 }}>
            AirwAy Confidence Guarantee
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#94a3b8', marginTop: '6px', maxWidth: '640px', fontWeight: '500' }}>
            Enjoy complete peace of mind when booking. Guaranteed lowest airfares, transparent travel protection, and tiered rewards on every journey.
          </p>
        </div>

        {/* Status Tiers Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.06)', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Award size={18} color="#f59e0b" />
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1' }}>AirwAy Status Tiers:</span>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94a3b8' }}>Silver</span>
          <span style={{ color: '#475569' }}>→</span>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#fbbf24' }}>Gold</span>
          <span style={{ color: '#475569' }}>→</span>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#38bdf8' }}>Platinum</span>
        </div>
      </div>

      {/* Grid of 3 Core Trust Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Pillar 1: Price Protection */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '24px',
          transition: 'transform 0.2s ease, border-color 0.2s ease'
        }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <DollarSign size={22} color="#38bdf8" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
            Best Price Protection
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
            Find a lower eligible fare on another platform within 24 hours? AirwAy refunds the difference directly with money-back price match coverage.
          </p>
        </div>

        {/* Pillar 2: Customer Travel Benefits */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '24px',
          transition: 'transform 0.2s ease, border-color 0.2s ease'
        }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Gift size={22} color="#34d399" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
            Instant Credits & Rewards
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
            Earn 100% stackable travel credits and percentage discounts on every flight, hotel package, and mobility booking saved in your profile.
          </p>
        </div>

        {/* Pillar 3: Platinum Loyalty Tier Progression */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '24px',
          transition: 'transform 0.2s ease, border-color 0.2s ease'
        }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Award size={22} color="#fbbf24" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
            Silver → Gold → Platinum
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
            Unlock VIP airport lounge passes, complimentary seat upgrades, and zero-fee date changes as you advance through AirwAy loyalty tiers.
          </p>
        </div>

      </div>
    </section>
  );
}
