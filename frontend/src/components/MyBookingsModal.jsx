import React, { useState } from 'react';
import { X, Search, Ticket, ChevronRight } from 'lucide-react';
import { lookupBooking } from '../api';
import AirlineLogo from './AirlineLogo';

export default function MyBookingsModal({ onClose, onSelectBooking }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await lookupBooking(query.trim());
      setResults(data);
    } catch (err) {
      setError(err.message || 'No booking found for this PNR code or email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', padding: '0', overflow: 'hidden', border: '1px solid var(--primary-cyan)', background: '#ffffff' }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderBottom: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Ticket size={22} color="var(--primary-cyan)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
              Manage & View Bookings
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          
          {/* Lookup Input Form */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input
              type="text"
              className="custom-input"
              placeholder="Enter PNR Reference (e.g. AW-98X21) or Email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
              <Search size={18} />
              <span>{loading ? 'Searching...' : 'Find Ticket'}</span>
            </button>
          </form>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', fontWeight: '600' }}>
              {error}
            </div>
          )}

          {/* Results List */}
          {results.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-sub)', textTransform: 'uppercase', marginBottom: '12px', fontWeight: '700' }}>
                Found {results.length} Booking(s)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {results.map((b) => (
                  <div
                    key={b.pnr_code}
                    onClick={() => onSelectBooking(b)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    className="glass-panel"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <AirlineLogo code={b.airline_code || 'AW'} size={38} />
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--primary-cyan)', marginBottom: '2px' }}>
                          {b.pnr_code}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: '700' }}>
                          {b.airline} ({b.flight_number}) • {b.origin_code} → {b.destination_code}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '2px', fontWeight: '600' }}>
                          Passenger: {b.passenger_name} • Seat: {b.seat_number}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)', fontSize: '0.85rem', fontWeight: '700' }}>
                      View Ticket <ChevronRight size={18} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
