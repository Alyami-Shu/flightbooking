import React, { useState } from 'react';
import { Clock, Luggage, Wifi, Utensils, Zap, Tv, ChevronDown, ChevronUp, CheckCircle2, Star, Tag, ArrowRight } from 'lucide-react';
import AirlineLogo from './AirlineLogo';

export default function FlightCard({ flight, cabinClass, currency, currencyRate, currencySymbol, onSelectBook, isCheapest, isFastest, isPackageMode }) {
  const [expanded, setExpanded] = useState(false);

  // Price conversion
  const rawPrice = flight.active_price || flight.price_economy;
  const convertedPrice = Math.round(rawPrice * currencyRate);

  const getAmenityIcon = (name) => {
    if (name.toLowerCase().includes('wifi') || name.toLowerCase().includes('internet')) return <Wifi size={14} />;
    if (name.toLowerCase().includes('meal') || name.toLowerCase().includes('dining') || name.toLowerCase().includes('chef')) return <Utensils size={14} />;
    if (name.toLowerCase().includes('power') || name.toLowerCase().includes('usb') || name.toLowerCase().includes('charge')) return <Zap size={14} />;
    if (name.toLowerCase().includes('tv') || name.toLowerCase().includes('movie') || name.toLowerCase().includes('ife')) return <Tv size={14} />;
    return <CheckCircle2 size={14} />;
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '16px', position: 'relative' }}>
      
      {/* Floating Badges */}
      <div style={{ position: 'absolute', top: '-12px', right: '24px', display: 'flex', gap: '8px' }}>
        {isCheapest && (
          <span style={{ background: '#059669', color: '#ffffff', fontSize: '0.75rem', fontWeight: '800', padding: '3px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)' }}>
            <Tag size={12} /> Lowest Fare
          </span>
        )}
        {isFastest && (
          <span style={{ background: '#0284c7', color: '#ffffff', fontSize: '0.75rem', fontWeight: '800', padding: '3px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)' }}>
            <Zap size={12} /> Fastest Route
          </span>
        )}
      </div>

      {/* Top Row: Official Airline Logo & Flight Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Official Airline Logo & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <AirlineLogo code={flight.airline_code} size={48} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {flight.airline}
              </h4>
              <span style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#d97706', fontSize: '0.75rem', fontWeight: '800', padding: '2px 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Star size={12} fill="#d97706" /> {flight.rating || 4.8}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '600', marginTop: '3px' }}>
              <span>Flight {flight.flight_number}</span>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span>{flight.aircraft}</span>
            </div>
          </div>
        </div>

        {/* Flight Route & Trajectory */}
        <div style={{ display: 'flex', alignItems: 'center', flex: '1', maxWidth: '420px', margin: '0 16px' }}>
          
          {/* Departure */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
              {flight.departure_time}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-cyan)' }}>
              {flight.origin_code}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              {flight.origin}
            </div>
          </div>

          {/* Line & Duration */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> {flight.duration}
            </span>
            <div className="trajectory-line" />
            <span style={{ fontSize: '0.7rem', color: flight.stops === 0 ? 'var(--accent-emerald)' : 'var(--accent-gold)', fontWeight: '700' }}>
              {flight.stops === 0 ? 'Direct Flight' : `${flight.stops} Stop (${flight.stop_details})`}
            </span>
          </div>

          {/* Arrival */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
              {flight.arrival_time}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-cyan)' }}>
              {flight.destination_code}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              {flight.destination}
            </div>
          </div>

        </div>

        {/* Price & Book CTA */}
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>
            {cabinClass} Class
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', background: 'linear-gradient(to right, #0f172a, #0284c7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {currencySymbol}{convertedPrice.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: flight.available_seats <= 10 ? 'var(--accent-gold)' : 'var(--accent-emerald)', marginBottom: '4px', fontWeight: '700' }}>
            {flight.available_seats} seats left
          </div>
          <button
            className="btn-primary"
            onClick={() => onSelectBook(flight)}
          >
            {isPackageMode ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                Select Flight for Package <ArrowRight size={14} />
              </span>
            ) : (
              'Select & Book'
            )}
          </button>
        </div>

      </div>

      {/* Expandable Details Toggle */}
      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Amenities Preview */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
            <Luggage size={14} color="var(--primary-cyan)" /> {flight.baggage}
          </span>
          {flight.amenities.slice(0, 3).map((item, idx) => (
            <span key={idx} style={{ fontSize: '0.75rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontWeight: '600', border: '1px solid #e2e8f0' }}>
              {getAmenityIcon(item)} {item}
            </span>
          ))}
        </div>

        {/* Details button */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary-cyan)',
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {expanded ? 'Hide Details' : 'View Flight Details'}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

      </div>

      {/* Accordion Expand Details */}
      {expanded && (
        <div style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <h5 style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', marginBottom: '8px', fontWeight: '800' }}>Aircraft Specs</h5>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Model: <strong>{flight.aircraft}</strong></p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Rating: <strong>{flight.rating} / 5.0 Stars</strong></p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Flight Number: <strong>{flight.flight_number}</strong></p>
          </div>
          <div>
            <h5 style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', marginBottom: '8px', fontWeight: '800' }}>All Amenities</h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {flight.amenities.map((am, i) => (
                <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--primary-cyan)', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  ✓ {am}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h5 style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', marginBottom: '8px', fontWeight: '800' }}>Fare Rules</h5>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Cancellation: <strong>Free within 24h</strong></p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Changes: <strong>Allowed with low fee</strong></p>
          </div>
        </div>
      )}

    </div>
  );
}
