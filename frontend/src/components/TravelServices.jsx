import React, { useState, useEffect } from 'react';
import { Star, Check, MapPin, Tag, X, User, Car, Plane, ArrowLeft, RefreshCw, Hotel, Armchair, ShieldCheck, Ticket, Calendar, Clock } from 'lucide-react';
import AirlineLogo from './AirlineLogo';

export const CITY_HOTELS_DB = [
  // 1. Atlanta (ATL)
  { id: 'atl-1', cityCode: 'ATL', cityName: 'Atlanta', country: 'USA', name: 'The Ritz-Carlton Atlanta', rating: 5, priceNightUsd: 280, roomType: 'Executive King Suite', amenities: ['Spa Access', 'Fine Dining', 'Free High-Speed Wi-Fi', 'Valet Parking'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
  { id: 'atl-2', cityCode: 'ATL', cityName: 'Atlanta', country: 'USA', name: 'Grand Hyatt Atlanta in Buckhead', rating: 5, priceNightUsd: 220, roomType: 'Deluxe Suite', amenities: ['Infinity Pool', '24/7 Fitness Center', 'Japanese Garden', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
  { id: 'atl-3', cityCode: 'ATL', cityName: 'Atlanta', country: 'USA', name: 'Four Seasons Hotel Atlanta', rating: 5, priceNightUsd: 340, roomType: 'Midtown Luxury Suite', amenities: ['Indoor Saltwater Pool', 'Full Luxury Spa', 'Terrace Restaurant'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80' },

  // 2. Chennai (MAA)
  { id: 'maa-1', cityCode: 'MAA', cityName: 'Chennai', country: 'India', name: 'The Leela Palace Chennai', rating: 5, priceNightUsd: 185, roomType: 'Sea View Royal Suite', amenities: ['Sea View Pool', 'Personal Butler Service', 'Ayurvedic Spa', 'Buffet Breakfast'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
  { id: 'maa-2', cityCode: 'MAA', cityName: 'Chennai', country: 'India', name: 'Taj Connemara Heritage', rating: 5, priceNightUsd: 160, roomType: 'Heritage Deluxe Room', amenities: ['Colonial Pool', 'High Tea Lounge', 'Complimentary Breakfast', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
  { id: 'maa-3', cityCode: 'MAA', cityName: 'Chennai', country: 'India', name: 'ITC Grand Chola', rating: 5, priceNightUsd: 195, roomType: 'Executive Club Room', amenities: ['Rooftop Swimming Pool', 'Kaya Kalp Spa', '10 Restaurants', 'Airport Shuttle'], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80' },

  // 3. Dubai (DXB)
  { id: 'dxb-1', cityCode: 'DXB', cityName: 'Dubai', country: 'UAE', name: 'JW Marriott Marquis Dubai', rating: 5, priceNightUsd: 280, roomType: 'Deluxe City Suite', amenities: ['Saray Spa', 'Rooftop Sky Lounge', 'Airport VIP Transfer', '14 Restaurants'], image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
  { id: 'dxb-2', cityCode: 'DXB', cityName: 'Dubai', country: 'UAE', name: 'Atlantis The Palm Dubai', rating: 5, priceNightUsd: 420, roomType: 'Ocean Suite', amenities: ['Aquaventure Pass', 'Private Beach', 'Underwater Dining', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80' },
  { id: 'dxb-3', cityCode: 'DXB', cityName: 'Dubai', country: 'UAE', name: 'Burj Al Arab Jumeirah', rating: 5, priceNightUsd: 950, roomType: 'Duplex Royal Suite', amenities: ['Helipad Access', 'Hermès Amenities', '24/7 Private Butler', 'Private Beach'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80' },

  // 4. Doha (DOH)
  { id: 'doh-1', cityCode: 'DOH', cityName: 'Doha', country: 'Qatar', name: 'The St. Regis Doha', rating: 5, priceNightUsd: 260, roomType: 'Grand Sea View Suite', amenities: ['Olympic Pool', 'Remède Spa', 'Private Beach', 'Butler Service'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80' },
  { id: 'doh-2', cityCode: 'DOH', cityName: 'Doha', country: 'Qatar', name: 'Mandarin Oriental Doha', rating: 5, priceNightUsd: 310, roomType: 'Club Deluxe Suite', amenities: ['Rooftop Pool', '9 Dining Venues', 'Holistic Spa', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
  { id: 'doh-3', cityCode: 'DOH', cityName: 'Doha', country: 'Qatar', name: 'Sharq Village & Spa, Ritz-Carlton', rating: 5, priceNightUsd: 240, roomType: 'Resort Villa Suite', amenities: ['Infinity Pool', 'Private Bay', 'Traditional Spa', 'Breakfast Included'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },

  // 5. London (LHR)
  { id: 'lhr-1', cityCode: 'LHR', cityName: 'London', country: 'UK', name: 'The Ritz London', rating: 5, priceNightUsd: 480, roomType: 'Executive Mayfair Suite', amenities: ['Michelin Dining', 'Afternoon Tea', 'Concierge Service', 'High-Speed Wi-Fi'], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80' },
  { id: 'lhr-2', cityCode: 'LHR', cityName: 'London', country: 'UK', name: 'The Langham London', rating: 5, priceNightUsd: 420, roomType: 'Regent Suite', amenities: ['Chuan Spa', '16m Swimming Pool', 'Roux Dining', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80' },
  { id: 'lhr-3', cityCode: 'LHR', cityName: 'London', country: 'UK', name: 'Rosewood London', rating: 5, priceNightUsd: 390, roomType: 'Manor House Suite', amenities: ['Sense Spa', 'Courtyard Lounge', 'Fitness Center', 'Valet Service'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80' },

  // 6. Frankfurt (FRA)
  { id: 'fra-1', cityCode: 'FRA', cityName: 'Frankfurt', country: 'Germany', name: 'Jumeirah Frankfurt', rating: 5, priceNightUsd: 250, roomType: 'Skyline View Suite', amenities: ['Talise Spa', 'Skyline Dining', 'Free High-Speed Wi-Fi', 'Airport Shuttle'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80' },
  { id: 'fra-2', cityCode: 'FRA', cityName: 'Frankfurt', country: 'Germany', name: 'Steigenberger Frankfurter Hof', rating: 5, priceNightUsd: 230, roomType: 'Grand Deluxe Room', amenities: ['Spa & Wellness', 'French Restaurant', 'Cigar Lounge', 'Free Breakfast'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
  { id: 'fra-3', cityCode: 'FRA', cityName: 'Frankfurt', country: 'Germany', name: 'Villa Kennedy, Rocco Forte', rating: 5, priceNightUsd: 290, roomType: 'Garden Villa Suite', amenities: ['Indoor Pool', 'Courtyard Dining', 'Luxury Spa', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },

  // 7. Paris (CDG)
  { id: 'cdg-1', cityCode: 'CDG', cityName: 'Paris', country: 'France', name: 'Four Seasons Hotel George V', rating: 5, priceNightUsd: 850, roomType: 'Eiffel View Suite', amenities: ['3 Michelin Restaurants', 'Palace Spa', 'Wine Cellar Tours', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80' },
  { id: 'cdg-2', cityCode: 'CDG', cityName: 'Paris', country: 'France', name: 'Le Meurice Paris', rating: 5, priceNightUsd: 720, roomType: 'Tuileries Deluxe Suite', amenities: ['Alain Ducasse Dining', 'Valmont Spa', 'Concierge Service'], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80' },
  { id: 'cdg-3', cityCode: 'CDG', cityName: 'Paris', country: 'France', name: 'Hôtel Plaza Athénée', rating: 5, priceNightUsd: 790, roomType: 'Avenue Montaigne Suite', amenities: ['Dior Spa', 'Courtyard Garden', 'Cocktail Bar', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80' },

  // 8. Singapore (SIN)
  { id: 'sin-1', cityCode: 'SIN', cityName: 'Singapore', country: 'Singapore', name: 'Marina Bay Sands Singapore', rating: 5, priceNightUsd: 490, roomType: 'Sky View Premier Suite', amenities: ['Infinity Rooftop Pool', 'Banyan Tree Spa', '45 Dining Venues', 'Casino Access'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
  { id: 'sin-2', cityCode: 'SIN', cityName: 'Singapore', country: 'Singapore', name: 'Raffles Hotel Singapore', rating: 5, priceNightUsd: 580, roomType: 'Courtyard Suite', amenities: ['Personal Butler', 'Long Bar Singapore Sling', 'Raffles Spa', 'Free Breakfast'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
  { id: 'sin-3', cityCode: 'SIN', cityName: 'Singapore', country: 'Singapore', name: 'The Ritz-Carlton, Millenia', rating: 5, priceNightUsd: 380, roomType: 'Marina Deluxe Suite', amenities: ['4,200 Art Collection', 'Colony Buffet', 'Ritz Spa', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80' },

  // 9. New York (JFK)
  { id: 'jfk-1', cityCode: 'JFK', cityName: 'New York', country: 'USA', name: 'The Plaza Hotel New York', rating: 5, priceNightUsd: 650, roomType: 'Fifth Avenue Suite', amenities: ['Guerlain Spa', 'The Palm Court', 'Butler Service', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80' },
  { id: 'jfk-2', cityCode: 'JFK', cityName: 'New York', country: 'USA', name: 'The St. Regis New York', rating: 5, priceNightUsd: 720, roomType: 'Grand Deluxe Suite', amenities: ['24/7 St. Regis Butler', 'King Cole Bar', 'Bentley House Car', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80' },
  { id: 'jfk-3', cityCode: 'JFK', cityName: 'New York', country: 'USA', name: 'Baccarat Hotel New York', rating: 5, priceNightUsd: 810, roomType: 'Baccarat Suite', amenities: ['Spa de La Mer', 'Grand Salon', 'Indoor Pool', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80' },

  // 10. Los Angeles (LAX)
  { id: 'lax-1', cityCode: 'LAX', cityName: 'Los Angeles', country: 'USA', name: 'The Beverly Hills Hotel', rating: 5, priceNightUsd: 750, roomType: 'Bungalow Suite', amenities: ['Famous Polo Lounge', 'Outdoor Cabana Pool', 'Spa Services', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80' },
  { id: 'lax-2', cityCode: 'LAX', cityName: 'Los Angeles', country: 'USA', name: 'Hotel Bel-Air', rating: 5, priceNightUsd: 690, roomType: 'Canyon Luxury Suite', amenities: ['Wolfgang Puck Dining', 'Swans Pond', 'Valmont Spa', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
  { id: 'lax-3', cityCode: 'LAX', cityName: 'Los Angeles', country: 'USA', name: 'Waldorf Astoria Beverly Hills', rating: 5, priceNightUsd: 620, roomType: 'Wilshire Corner Suite', amenities: ['Rooftop Pool', 'La Prairie Spa', 'Jean-Georges Dining', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' }
];

export function FlightHotelStep2HotelSelection({ confirmedFlight, currencySymbol, currencyRate, onChangeFlight, onCompletePackage }) {
  const [selectedHotel, setSelectedHotel] = useState(null);

  const destCode = confirmedFlight.destination_code || 'DXB';
  const destCity = confirmedFlight.destination || confirmedFlight.destination_city || destCode;

  // Filter hotels strictly for confirmed flight destination
  const activeHotels = CITY_HOTELS_DB.filter(h => h.cityCode === destCode);
  const displayHotels = activeHotels.length > 0 ? activeHotels : CITY_HOTELS_DB.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* STEP 2 BANNER & CONFIRMED FLIGHT SUMMARY BAR */}
      <div style={{ background: '#f0f9ff', border: '2px solid #0284c7', borderRadius: '16px', padding: '20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', background: '#0284c7', color: '#ffffff', padding: '3px 10px', borderRadius: '12px', fontWeight: '800', textTransform: 'uppercase' }}>
              Step 2 of 2: Add Hotel in {destCity} ({destCode})
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>
              Select a 5-Star Hotel for Your Stay in {destCity}
            </h3>
          </div>

          <button
            onClick={onChangeFlight}
            className="btn-secondary"
            style={{ height: '36px', fontSize: '0.8rem', padding: '0 14px' }}
          >
            <RefreshCw size={14} /> Change Selected Flight
          </button>
        </div>

        {/* CONFIRMED FLIGHT SUMMARY CARD */}
        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary-cyan)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plane size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
                Selected Package Flight: {confirmedFlight.origin_code || confirmedFlight.origin} → {destCode} ({destCity})
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', fontWeight: '600' }}>
                {confirmedFlight.airline} ({confirmedFlight.flight_number}) • Departure: {confirmedFlight.departure_time}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ background: '#fef3c7', color: '#d97706', padding: '3px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800' }}>
              ⏳ Pending Hotel Selection
            </span>
          </div>
        </div>

      </div>

      {/* HOTEL LISTINGS FOR DESTINATION CITY ONLY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {displayHotels.map((hotel) => {
          const price = Math.round(hotel.priceNightUsd * currencyRate);

          return (
            <div
              key={hotel.id}
              className="glass-panel"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid #cbd5e1',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)'
              }}
            >
              <div>
                <div style={{
                  height: '190px',
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%), url("${hotel.image}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end'
                }}>
                  <div style={{ color: '#ffffff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '2px' }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
                    </div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{hotel.name}</h4>
                    <p style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {hotel.cityName}, {hotel.country}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-cyan)', marginBottom: '8px' }}>
                    Room: {hotel.roomType}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                    {hotel.amenities.map((am, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#0f172a', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>
                        ✓ {am}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: '0 16px 16px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Rate per Night</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a' }}>
                    {currencySymbol}{price.toLocaleString()}
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => setSelectedHotel(hotel)}
                >
                  Select Hotel & Review Package
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* COMBINED FLIGHT + HOTEL PACKAGE CHECKOUT MODAL */}
      {selectedHotel && (
        <CombinedPackageCheckoutModal
          flight={confirmedFlight}
          hotel={selectedHotel}
          currencySymbol={currencySymbol}
          currencyRate={currencyRate}
          onClose={() => setSelectedHotel(null)}
          onCompletePackage={(packageBooking) => {
            setSelectedHotel(null);
            onCompletePackage(packageBooking);
          }}
        />
      )}

    </div>
  );
}

// COMBINED PACKAGE CHECKOUT MODAL (Single Transaction for Flight + Hotel)
function CombinedPackageCheckoutModal({ flight, hotel, currencySymbol, currencyRate, onClose, onCompletePackage }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [seat, setSeat] = useState('18A');
  const [loading, setLoading] = useState(false);

  const flightPrice = flight.active_price || flight.price_economy || 850;
  const hotelPrice = hotel.priceNightUsd || 280;
  const rawTotal = (flightPrice + hotelPrice * 3) * 0.85; // 15% package discount
  const convertedTotal = Math.round(rawTotal * currencyRate);

  const handleConfirmPackage = (e) => {
    e.preventDefault();
    setLoading(true);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randPnr = '';
    for (let i = 0; i < 6; i++) randPnr += chars.charAt(Math.floor(Math.random() * chars.length));
    const combinedPnr = `PKG-AW-${randPnr}`;

    const packageBooking = {
      pnr_code: combinedPnr,
      type: 'Travel Package',
      is_package: true,
      status: 'Travel Package Confirmed',
      passenger_name: name,
      passenger_email: email,
      passenger_phone: phone,
      seat_number: seat,

      // Flight Details
      flight_number: flight.flight_number,
      airline: flight.airline,
      airline_code: flight.airline_code,
      origin: flight.origin,
      origin_code: flight.origin_code,
      destination: flight.destination,
      destination_code: flight.destination_code,
      departure_time: flight.departure_time,
      arrival_time: flight.arrival_time,
      cabin_class: flight.cabin_class || 'Economy',

      // Hotel Details
      hotel_name: hotel.name,
      hotel_room: hotel.roomType,
      hotel_city: hotel.cityName,
      hotel_country: hotel.country,
      hotel_location: `${hotel.cityName}, ${hotel.country}`,
      check_in_date: '2026-08-05',
      check_in_time: '15:00 PM',
      check_out_date: '2026-08-10',
      check_out_time: '11:00 AM',
      hotel_image: hotel.image,
      hotel_rating: hotel.rating
    };

    setTimeout(() => {
      setLoading(false);
      onCompletePackage(packageBooking);
    }, 400);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ maxWidth: '680px', width: '100%', padding: '0', background: '#ffffff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25)' }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #0284c7 0%, #0f172a 100%)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '6px', fontWeight: '800', textTransform: 'uppercase' }}>
              Combined Package Transaction
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', marginTop: '4px' }}>
              Confirm Travel Package
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleConfirmPackage} style={{ padding: '24px', maxHeight: '82vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* COMBINED SUMMARY CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            {/* ✈️ FLIGHT CARD SUMMARY */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-cyan)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plane size={16} /> ✈ Flight Details
              </h4>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a' }}>
                {flight.origin_code} → {flight.destination_code}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', fontWeight: '600', marginTop: '4px' }}>
                {flight.airline} ({flight.flight_number})
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '2px' }}>
                Departure: <strong>{flight.departure_time}</strong> | Arrival: <strong>{(flight.arrival_time || '').replace(/\s*\([^\)]*\)/g, '').replace(/\s*\+[0-9]+d/gi, '').trim()}</strong>
              </div>
            </div>

            {/* 🏨 HOTEL CARD SUMMARY */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-cyan)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Hotel size={16} /> 🏨 Hotel Details
              </h4>
              <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0f172a' }}>
                {hotel.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', fontWeight: '600', marginTop: '4px' }}>
                {hotel.cityName}, {hotel.country}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '2px' }}>
                Room: <strong>{hotel.roomType}</strong> (5-Star)
              </div>
            </div>

          </div>

          {/* TOTAL BUNDLED PRICE BANNER */}
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', background: '#22c55e', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                15% PACKAGE DISCOUNT APPLIED
              </span>
              <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: '700', marginTop: '4px' }}>
                Bundled Flight + 5-Star Hotel Stay
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#15803d' }}>
                {currencySymbol}{convertedTotal.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: '700' }}>
                ✓ Single Transaction Payment
              </div>
            </div>
          </div>

          {/* PASSENGER & GUEST DETAILS FORM */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} color="var(--primary-cyan)" /> Lead Passenger & Guest Details
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input type="text" className="custom-input" placeholder="e.g. Salya Vikram" value={name} onChange={e => setName(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <input type="email" className="custom-input" placeholder="name@domain.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone Number</label>
                  <input type="tel" className="custom-input" placeholder="+1 (555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '10px' }}>
            <button type="button" className="btn-secondary" style={{ flex: '1', justifyContent: 'center' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: '2', padding: '14px', fontSize: '1rem', background: '#0284c7' }}>
              {loading ? 'Processing Package...' : 'Confirm & Book Flight + Hotel Package'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export function HotelsSection({ currencySymbol, currencyRate, selectedDestinationCode = '', hasSearchedHotels = false, onBookingSuccess }) {
  const [selectedCity, setSelectedCity] = useState(selectedDestinationCode || 'ALL');
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    if (selectedDestinationCode) {
      setSelectedCity(selectedDestinationCode);
    }
  }, [selectedDestinationCode]);

  const filtered = (selectedCity === 'ALL' || !selectedCity)
    ? CITY_HOTELS_DB
    : CITY_HOTELS_DB.filter(h => h.cityCode === selectedCity);

  const displayHotels = filtered.length > 0 ? filtered : CITY_HOTELS_DB.slice(0, 3);

  return (
    <div style={{ margin: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--primary-cyan)', padding: '4px 12px', borderRadius: '12px', fontWeight: '800', textTransform: 'uppercase' }}>
            Luxury Hotel Directory
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>
            5-Star Luxury Hotels Worldwide
          </h3>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>
            Displaying verified 5-star hotel resorts across top global destination hubs.
          </p>
        </div>

        {/* City Filter Switcher */}
        {hasSearchedHotels && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: '700' }}>Filter City:</span>
            <select className="custom-select" value={selectedCity} onChange={e => setSelectedCity(e.target.value)} style={{ padding: '6px 30px 6px 12px', width: 'auto', fontWeight: '700' }}>
              <option value="ALL">All Destinations (30 Hotels)</option>
              <option value="ATL">Atlanta (ATL)</option>
              <option value="MAA">Chennai (MAA)</option>
              <option value="DXB">Dubai (DXB)</option>
              <option value="DOH">Doha (DOH)</option>
              <option value="LHR">London (LHR)</option>
              <option value="FRA">Frankfurt (FRA)</option>
              <option value="CDG">Paris (CDG)</option>
              <option value="SIN">Singapore (SIN)</option>
              <option value="JFK">New York (JFK)</option>
              <option value="LAX">Los Angeles (LAX)</option>
            </select>
          </div>
        )}
      </div>

      {!hasSearchedHotels ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', background: '#ffffff', border: '2px dashed #cbd5e1' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(2, 132, 199, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: 'var(--primary-cyan)'
          }}>
            <Hotel size={32} />
          </div>
          <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>
            Search Luxury Hotels
          </h4>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto 16px auto', lineHeight: '1.5' }}>
            Select your <strong>Destination City</strong> and travel dates in the left search panel, then click <strong>"Search Hotels"</strong> to view matching 5-star hotel options.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {displayHotels.map(hotel => {
            const price = Math.round(hotel.priceNightUsd * currencyRate);

            return (
              <div key={hotel.id} className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#ffffff' }}>
                <div>
                  <div style={{
                    height: '190px',
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%), url("${hotel.image}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}>
                    <div style={{ color: '#ffffff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '2px' }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
                      </div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{hotel.name}</h4>
                      <p style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {hotel.cityName}, {hotel.country}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-cyan)', marginBottom: '8px' }}>
                      Room: {hotel.roomType}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                      {hotel.amenities.map((am, i) => (
                        <span key={i} style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#0f172a', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>
                          ✓ {am}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0 16px 16px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Rate per Night</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a' }}>
                      {currencySymbol}{price.toLocaleString()}
                    </div>
                  </div>
                  <button className="btn-primary" onClick={() => setSelectedHotel(hotel)}>
                    Reserve Room
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hotel Reservation Modal */}
      {selectedHotel && (
        <HotelBookingModal
          hotel={selectedHotel}
          currencySymbol={currencySymbol}
          currencyRate={currencyRate}
          onClose={() => setSelectedHotel(null)}
          onSuccess={(b) => {
            setSelectedHotel(null);
            if (onBookingSuccess) onBookingSuccess(b);
          }}
        />
      )}
    </div>
  );
}

function HotelBookingModal({ hotel, currencySymbol, currencyRate, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [checkInDate, setCheckInDate] = useState('2026-08-05');
  const [checkInTime, setCheckInTime] = useState('15:00 PM');
  const [checkOutDate, setCheckOutDate] = useState('2026-08-10');
  const [checkOutTime, setCheckOutTime] = useState('11:00 AM');

  const price = Math.round(hotel.priceNightUsd * currencyRate);

  const handleSubmit = (e) => {
    e.preventDefault();
    const confNum = 'HTL-AW-' + Math.floor(100000 + Math.random() * 900000);
    onSuccess({
      pnr_code: confNum,
      code: confNum,
      type: 'Hotel Reservation',
      is_hotel: true,
      hotelName: hotel.name,
      hotel_name: hotel.name,
      hotel_location: `${hotel.cityName}, ${hotel.country}`,
      hotel_city: hotel.cityName,
      hotel_country: hotel.country,
      roomType: hotel.roomType,
      hotel_room: hotel.roomType,
      guestName: name,
      passenger_name: name,
      passenger_email: email,
      check_in_date: checkInDate,
      check_in_time: checkInTime,
      check_out_date: checkOutDate,
      check_out_time: checkOutTime,
      check_in_full: `${checkInDate} at ${checkInTime}`,
      check_out_full: `${checkOutDate} at ${checkOutTime}`,
      route: `${hotel.cityName}, ${hotel.country}`,
      status: 'Hotel Confirmed'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ maxWidth: '560px', width: '100%', padding: '24px', background: '#ffffff', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontWeight: '800' }}>HOTEL ROOM RESERVATION</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a' }}>{hotel.name}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="input-group">
            <label className="input-label">Selected Room</label>
            <input type="text" className="custom-input" value={hotel.roomType} readOnly style={{ background: '#f1f5f9', fontWeight: '700' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} /> Check-In Date & Time
              </label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="date" className="custom-input" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} required />
                <input type="text" className="custom-input" style={{ width: '90px' }} value={checkInTime} onChange={e => setCheckInTime(e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} /> Check-Out Date & Time
              </label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="date" className="custom-input" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} required />
                <input type="text" className="custom-input" style={{ width: '90px' }} value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Guest Full Name</label>
            <input type="text" className="custom-input" placeholder="e.g. Salya Vikram" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input type="email" className="custom-input" placeholder="name@domain.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Rate per Night</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a' }}>{currencySymbol}{price.toLocaleString()}</div>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '700' }}>Free Cancellation</span>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '13px' }}>
            Confirm Hotel Reservation
          </button>
        </form>
      </div>
    </div>
  );
}

export function CarsSection({ currencySymbol, currencyRate, selectedPickupCode = 'ALL', onBookingSuccess }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCar, setSelectedCar] = useState(null);

  const cars = [
    {
      id: 'c-1',
      name: 'Cadillac Escalade Platinum SUV',
      category: 'SUV',
      passengers: 7,
      bags: 4,
      transmission: 'Automatic',
      priceDayUsd: 115,
      pickup: 'Airport VIP Exit Terminal Desk',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'c-2',
      name: 'Mercedes-Benz S-Class Executive',
      category: 'Luxury',
      passengers: 4,
      bags: 3,
      transmission: 'Automatic',
      priceDayUsd: 160,
      pickup: 'Chauffeur Terminal Service',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'c-3',
      name: 'Toyota Camry Hybrid Sedan',
      category: 'Economy',
      passengers: 5,
      bags: 2,
      transmission: 'Automatic',
      priceDayUsd: 45,
      pickup: 'Airport Car Terminal',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const filteredCars = selectedCategory === 'ALL'
    ? cars
    : cars.filter(c => c.category === selectedCategory);

  return (
    <div style={{ margin: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--primary-cyan)', padding: '4px 12px', borderRadius: '12px', fontWeight: '800', textTransform: 'uppercase' }}>
            Ground Transportation
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>
            Airport Car Rental & Mobility
          </h3>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>
            Accurate vehicle options with airport pickup desks and unlimited mileage.
          </p>
        </div>

        {/* Category Filter Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: '700' }}>Car Type:</span>
          <select className="custom-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{ padding: '6px 30px 6px 12px', width: 'auto', fontWeight: '700' }}>
            <option value="ALL">All Categories</option>
            <option value="Economy">Economy Sedan</option>
            <option value="SUV">Luxury SUV</option>
            <option value="Luxury">Executive Luxury Sedan</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredCars.map(car => {
          const price = Math.round(car.priceDayUsd * currencyRate);

          return (
            <div key={car.id} className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#ffffff' }}>
              <div>
                <div style={{
                  height: '190px',
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%), url("${car.image}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ alignSelf: 'flex-start', background: 'var(--primary-cyan)', color: '#ffffff', fontSize: '0.75rem', fontWeight: '800', padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Car size={14} /> {car.category}
                  </span>
                  <div style={{ color: '#ffffff' }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{car.name}</h4>
                  </div>
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '14px', fontWeight: '600' }}>
                    <span>👤 {car.passengers} Seats</span>
                    <span>🧳 {car.bags} Bags</span>
                    <span>⚙️ {car.transmission}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', fontWeight: '700' }}>
                    Pickup: {car.pickup}
                  </div>
                </div>
              </div>

              <div style={{ padding: '0 16px 16px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Rate per day</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a' }}>
                    {currencySymbol}{price.toLocaleString()}
                  </div>
                </div>
                <button className="btn-primary" onClick={() => setSelectedCar(car)}>
                  Rent Vehicle
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Car Rental Modal */}
      {selectedCar && (
        <CarBookingModal
          car={selectedCar}
          currencySymbol={currencySymbol}
          currencyRate={currencyRate}
          onClose={() => setSelectedCar(null)}
          onSuccess={(b) => {
            setSelectedCar(null);
            if (onBookingSuccess) onBookingSuccess(b);
          }}
        />
      )}
    </div>
  );
}

function CarBookingModal({ car, currencySymbol, currencyRate, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pickupLoc, setPickupLoc] = useState('Airport Terminal Arrival Desk');
  const [dropoffLoc, setDropoffLoc] = useState('Airport Terminal Return Desk');
  const [pickupDate, setPickupDate] = useState('2026-08-05');
  const [pickupTime, setPickupTime] = useState('09:00 AM');
  const [returnDate, setReturnDate] = useState('2026-08-10');
  const [returnTime, setReturnTime] = useState('17:00 PM');

  const price = Math.round(car.priceDayUsd * currencyRate);

  const handleSubmit = (e) => {
    e.preventDefault();
    const confNum = 'CAR-AW-' + Math.floor(100000 + Math.random() * 900000);
    onSuccess({
      pnr_code: confNum,
      code: confNum,
      type: 'Car Rental',
      is_car: true,
      carName: car.name,
      car_name: car.name,
      driverName: name,
      passenger_name: name,
      passenger_email: email,
      pickup: pickupLoc,
      pickup_location: pickupLoc,
      dropoff_location: dropoffLoc,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      return_date: returnDate,
      return_time: returnTime,
      pickup_full: `${pickupDate} at ${pickupTime}`,
      return_full: `${returnDate} at ${returnTime}`,
      route: pickupLoc,
      status: 'Car Rental Confirmed'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ maxWidth: '560px', width: '100%', padding: '24px', background: '#ffffff', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontWeight: '800' }}>VEHICLE RENTAL RESERVATION</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a' }}>{car.name}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="input-group">
              <label className="input-label">Pickup Location</label>
              <select className="custom-select" value={pickupLoc} onChange={e => setPickupLoc(e.target.value)}>
                <option value="Airport Terminal Arrival Desk">Airport Terminal Arrival Desk</option>
                <option value="City Center Downtown Hub">City Center Downtown Hub</option>
                <option value="Hotel VIP Service Desk">Hotel VIP Service Desk</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Drop-off Location</label>
              <select className="custom-select" value={dropoffLoc} onChange={e => setDropoffLoc(e.target.value)}>
                <option value="Airport Terminal Return Desk">Airport Terminal Return Desk</option>
                <option value="City Center Downtown Hub">City Center Downtown Hub</option>
                <option value="Hotel VIP Service Desk">Hotel VIP Service Desk</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} /> Pickup Date & Time
              </label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="date" className="custom-input" value={pickupDate} onChange={e => setPickupDate(e.target.value)} required />
                <input type="text" className="custom-input" style={{ width: '90px' }} value={pickupTime} onChange={e => setPickupTime(e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} /> Return Date & Time
              </label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="date" className="custom-input" value={returnDate} onChange={e => setReturnDate(e.target.value)} required />
                <input type="text" className="custom-input" style={{ width: '90px' }} value={returnTime} onChange={e => setReturnTime(e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Driver Full Name</label>
            <input type="text" className="custom-input" placeholder="e.g. Salya Vikram" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input type="email" className="custom-input" placeholder="name@domain.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Rental Rate per Day</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a' }}>{currencySymbol}{price.toLocaleString()}</div>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '700' }}>Unlimited Mileage</span>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '13px' }}>
            Confirm Car Rental
          </button>
        </form>
      </div>
    </div>
  );
}
