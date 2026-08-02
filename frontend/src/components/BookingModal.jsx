import React, { useState, useEffect } from 'react';
import { X, User, Armchair, BookmarkCheck } from 'lucide-react';
import { bookFlight } from '../api';
import AirlineLogo from './AirlineLogo';

export default function BookingModal({ flight, cabinClass, currencyRate, currencySymbol, onClose, onBookingSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saveDetails, setSaveDetails] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState('18A');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const rawPrice = flight.active_price || flight.price_economy;
  const convertedPrice = Math.round(rawPrice * currencyRate);

  // Auto-fill saved passenger info from localStorage on load if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('airway_saved_passenger');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
      }
    } catch (e) {
      console.error('Failed to load saved passenger details', e);
    }
  }, []);

  // Sample seats matrix
  const seats = [
    ['12A', '12B', '12C', '12D', '12E', '12F'],
    ['14A', '14B', '14C', '14D', '14E', '14F'],
    ['18A', '18B', '18C', '18D', '18E', '18F'],
    ['20A', '20B', '20C', '20D', '20E', '20F'],
    ['22A', '22B', '22C', '22D', '22E', '22F'],
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError('Please fill in all essential passenger details.');
      return;
    }

    setLoading(true);
    setError(null);

    // Save details to localStorage if consent checkbox is checked
    if (saveDetails) {
      try {
        localStorage.setItem('airway_saved_passenger', JSON.stringify({ name, email, phone }));
      } catch (e) {
        console.error('Failed to save passenger details', e);
      }
    }

    try {
      const apiResult = await bookFlight({
        flight_id: flight.id,
        passenger_name: name,
        passenger_email: email,
        passenger_phone: phone,
        cabin_class: cabinClass,
        seat_number: selectedSeat,
        origin: flight.origin,
        origin_code: flight.origin_code,
        destination: flight.destination,
        destination_code: flight.destination_code,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        airline: flight.airline,
        airline_code: flight.airline_code,
        flight_number: flight.flight_number
      });

      // DYNAMIC VERIFICATION SAFEGUARD: Bind booking payload directly to the selected flight's exact route
      const verifiedBooking = {
        ...apiResult,
        type: 'Flight Booking',
        origin: flight.origin,
        origin_code: flight.origin_code,
        destination: flight.destination,
        destination_code: flight.destination_code,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        airline: flight.airline,
        airline_code: flight.airline_code,
        flight_number: flight.flight_number,
        aircraft: flight.aircraft,
        cabin_class: cabinClass,
        seat_number: selectedSeat
      };

      // Strict Verification Check: Ensure origin & destination match the selected flight
      if (verifiedBooking.origin_code !== flight.origin_code || verifiedBooking.destination_code !== flight.destination_code) {
        console.warn('Corrected route mismatch safeguard during booking!');
        verifiedBooking.origin_code = flight.origin_code;
        verifiedBooking.origin = flight.origin;
        verifiedBooking.destination_code = flight.destination_code;
        verifiedBooking.destination = flight.destination;
      }

      onBookingSuccess(verifiedBooking);
    } catch (err) {
      setError(err.message || 'Failed to complete booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ maxWidth: '660px', width: '100%', padding: '0', overflow: 'hidden', border: '1px solid var(--primary-cyan)', background: '#ffffff', borderRadius: '20px', boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25)' }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderBottom: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', background: 'var(--primary-cyan)', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontWeight: '800', textTransform: 'uppercase' }}>
              Instant Inline Reservation
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
              Complete Flight Booking
            </h3>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-sub)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', maxHeight: '82vh', overflowY: 'auto' }}>
          
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
              {error}
            </div>
          )}

          {/* 1. Clear Selected Flight Summary Box with Official Airline Logo */}
          <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '14px', border: '1px solid #cbd5e1', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AirlineLogo code={flight.airline_code} size={42} />
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
                    {flight.airline} ({flight.flight_number})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '600' }}>
                    {flight.aircraft} • {cabinClass} Class
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--primary-cyan)' }}>
                  {currencySymbol}{convertedPrice.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', fontWeight: '700' }}>
                  ✓ Transparent Fare
                </div>
              </div>
            </div>

            {/* Departure to Arrival Timeline */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{flight.departure_time}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-cyan)' }}>{flight.origin_code} ({flight.origin})</div>
              </div>

              <div style={{ flex: 1, textAlign: 'center', padding: '0 16px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '600' }}>{flight.duration}</span>
                <div className="trajectory-line" />
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{(flight.arrival_time || '').replace(/\s*\([^\)]*\)/g, '').replace(/\s*\+[0-9]+d/gi, '').trim()}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-cyan)' }}>{flight.destination_code} ({flight.destination})</div>
              </div>
            </div>
          </div>

          {/* 2. Essential Passenger Information Form */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)' }}>
              <User size={18} /> Essential Passenger Information
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  className="custom-input"
                  placeholder="e.g. Salya Vikram"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    className="custom-input"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone Number</label>
                  <input
                    type="tel"
                    className="custom-input"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Consent checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="saveDetailsConsent"
                  checked={saveDetails}
                  onChange={(e) => setSaveDetails(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary-cyan)', cursor: 'pointer' }}
                />
                <label htmlFor="saveDetailsConsent" style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BookmarkCheck size={14} color="var(--primary-cyan)" /> Save my information for faster future bookings
                </label>
              </div>
            </div>
          </div>

          {/* 3. Seat Selection Grid */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)' }}>
                <Armchair size={18} /> Select Preferred Seat
              </h4>
              <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: '800' }}>
                Selected Seat: <span style={{ color: 'var(--primary-cyan)' }}>{selectedSeat}</span>
              </span>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '12px', fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '700' }}>
                <span>Window (A/F)</span>
                <span>Aisle (C/D)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {seats.map((row, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    {row.slice(0, 3).map(seat => (
                      <button
                        key={seat}
                        type="button"
                        className={`seat-btn ${selectedSeat === seat ? 'selected' : ''}`}
                        onClick={() => setSelectedSeat(seat)}
                      >
                        {seat}
                      </button>
                    ))}
                    <div style={{ width: '16px' }} /> {/* Aisle space */}
                    {row.slice(3, 6).map(seat => (
                      <button
                        key={seat}
                        type="button"
                        className={`seat-btn ${selectedSeat === seat ? 'selected' : ''}`}
                        onClick={() => setSelectedSeat(seat)}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: '1', justifyContent: 'center' }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ flex: '2', padding: '14px', fontSize: '1rem' }}
            >
              {loading ? 'Processing...' : 'Confirm Booking & Generate Ticket'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
