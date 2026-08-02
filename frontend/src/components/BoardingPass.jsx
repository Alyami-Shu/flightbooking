import React from 'react';
import { X, CheckCircle, Printer, Hotel, Car, MapPin, User, ShieldCheck, Calendar, Clock } from 'lucide-react';
import AirlineLogo from './AirlineLogo';
import AirWayBrandLogo from './AirWayBrandLogo';

export default function BoardingPass({ booking, currencySymbol, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const isHotel = booking.is_hotel || booking.type === 'Hotel Reservation';
  const isCar = booking.is_car || booking.type === 'Car Rental';

  return (
    <div className="modal-overlay">
      <div className="boarding-pass-card" style={{ maxWidth: '640px', width: '100%' }}>
        
        {/* Header Banner */}
        <div className="boarding-pass-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <AirWayBrandLogo size={36} showText={true} />
            <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '12px' }}>
              {!isHotel && !isCar ? (
                <AirlineLogo code={booking.airline_code || 'AW'} size={32} />
              ) : (
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isHotel ? <Hotel size={20} color="var(--primary-cyan)" /> : <Car size={20} color="var(--primary-cyan)" />}
                  <span>{isHotel ? '5-Star Hotel Reservation' : 'Airport Car Rental'}</span>
                </div>
              )}
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', marginTop: '2px' }}>
                <CheckCircle size={12} /> Status: {booking.status || 'CONFIRMED'}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-sub)', textTransform: 'uppercase', fontWeight: '700' }}>
              {isHotel ? 'HOTEL CONFIRMATION' : isCar ? 'CAR RENTAL REF' : booking.is_package ? 'PACKAGE PNR' : 'FLIGHT PNR'}
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--primary-cyan)', letterSpacing: '1px' }}>
              {booking.pnr_code || booking.code}
            </div>
          </div>
        </div>

        {/* Ticket Content Body */}
        <div style={{ padding: '28px', background: '#ffffff' }}>
          
          {/* Passenger / Guest Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginBottom: '4px', fontWeight: '700' }}>
                {isHotel ? 'Guest Full Name' : isCar ? 'Driver Full Name' : 'Passenger Name'}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                {booking.passenger_name || booking.guestName || booking.driverName || 'Lead Traveler'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginBottom: '4px', fontWeight: '700' }}>Contact Email</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                {booking.passenger_email || 'Verified Customer'}
              </div>
            </div>

            {isHotel ? (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginBottom: '4px', fontWeight: '700' }}>Reserved Hotel</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary-cyan)' }}>
                  {booking.hotel_name || booking.hotelName}
                </div>
              </div>
            ) : isCar ? (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginBottom: '4px', fontWeight: '700' }}>Reserved Vehicle</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary-cyan)' }}>
                  {booking.car_name || booking.carName}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginBottom: '4px', fontWeight: '700' }}>Airline & Flight</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary-cyan)' }}>
                  {booking.airline} ({booking.flight_number})
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginBottom: '4px', fontWeight: '700' }}>
                {isHotel ? 'Room Suite' : isCar ? 'Pickup Counter' : 'Cabin & Seat'}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
                {isHotel ? (booking.hotel_room || booking.roomType || 'Executive Suite') : isCar ? (booking.pickup || 'Airport Terminal Counter') : `${booking.cabin_class || 'Economy'} • ${booking.seat_number || '18A'}`}
              </div>
            </div>

          </div>

          {/* Timing & Location Detail Block */}
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1', marginBottom: '28px' }}>
            {isHotel ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={22} color="var(--primary-cyan)" />
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a' }}>
                      {booking.hotel_name || booking.hotelName}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', fontWeight: '700' }}>
                      Location: {booking.hotel_location || booking.hotel_city || booking.route}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '800', textTransform: 'uppercase' }}>Check-In Date & Time</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>
                      {booking.check_in_full || `${booking.check_in_date || '2026-08-05'} at ${booking.check_in_time || '15:00 PM'}`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '800', textTransform: 'uppercase' }}>Check-Out Date & Time</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>
                      {booking.check_out_full || `${booking.check_out_date || '2026-08-10'} at ${booking.check_out_time || '11:00 AM'}`}
                    </div>
                  </div>
                </div>
              </div>
            ) : isCar ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Car size={22} color="var(--primary-cyan)" />
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a' }}>
                      {booking.car_name || booking.carName}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', fontWeight: '700' }}>
                      Verified Rental Voucher • Unlimited Mileage Included
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '800', textTransform: 'uppercase' }}>Pickup Date, Time & Location</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>
                      {booking.pickup_full || `${booking.pickup_date || '2026-08-05'} at ${booking.pickup_time || '09:00 AM'}`}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontWeight: '700', marginTop: '2px' }}>
                      📍 {booking.pickup_location || booking.pickup}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '800', textTransform: 'uppercase' }}>Return Date, Time & Location</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>
                      {booking.return_full || `${booking.return_date || '2026-08-10'} at ${booking.return_time || '17:00 PM'}`}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '700', marginTop: '2px' }}>
                      📍 {booking.dropoff_location || 'Airport Return Desk'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' }}>{booking.origin_code || booking.origin}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', fontWeight: '700' }}>Departure: {booking.departure_time}</div>
                </div>

                <div style={{ flex: 1, textAlign: 'center', padding: '0 20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginBottom: '4px', fontWeight: '700' }}>FLIGHT PATH</div>
                  <div className="trajectory-line" />
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' }}>{booking.destination_code || booking.destination}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', fontWeight: '700' }}>Arrival: {booking.arrival_time}</div>
                </div>
              </div>
            )}
          </div>

          {/* Barcode graphic */}
          <div style={{ background: '#f1f5f9', padding: '16px', borderRadius: '10px', textAlign: 'center', marginBottom: '24px', border: '1px solid #cbd5e1' }}>
            <div style={{
              height: '40px',
              backgroundImage: 'repeating-linear-gradient(90deg, #000 0, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 8px, transparent 8px, transparent 10px, #000 10px, #000 13px)',
              width: '80%',
              margin: '0 auto 8px auto'
            }} />
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#000', letterSpacing: '2px', fontWeight: 'bold' }}>
              *{booking.pnr_code || booking.code}*
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={onClose}>
              <X size={16} /> Close
            </button>
            <button className="btn-primary" onClick={handlePrint}>
              <Printer size={16} /> {isHotel ? 'Print Hotel Voucher' : isCar ? 'Print Car Voucher' : 'Print Boarding Pass'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
