import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import FlightSearch from './components/FlightSearch';
import FlightFilter from './components/FlightFilter';
import FlightCard from './components/FlightCard';
import BookingModal from './components/BookingModal';
import BoardingPass from './components/BoardingPass';
import { FlightHotelStep2HotelSelection, HotelsSection, CarsSection } from './components/TravelServices';
import { ExploreView, PlanView, ExperienceView, LoyaltyView, SupportView, OffersAndPackagesSection } from './components/TabViews';
import { fetchAirports, searchFlights, lookupBooking } from './api';
import AirlineLogo from './components/AirlineLogo';
import { AlertCircle, ShieldCheck, HeartHandshake, Phone, Mail, Plane, Search, Ticket, CheckCircle2, ChevronDown, ChevronUp, Printer, Trash2, ArrowRight, Hotel, Car, MapPin, Calendar, Clock, X } from 'lucide-react';

export default function App() {
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('EN');
  const [activeNav, setActiveNav] = useState('Book & Manage');

  // Product Type state: 'Flights', 'Flight + Hotel', 'Hotels', 'Cars'
  const [productType, setProductType] = useState('Flights');

  // Flight + Hotel Two-Step Workflow State
  const [flightHotelStep, setFlightHotelStep] = useState(1);
  const [tempPackageFlight, setTempPackageFlight] = useState(null);

  const [airports, setAirports] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Search parameters - empty initial states for route and dates
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: '',
    returnDate: '',
    passengers: 1,
    cabin_class: 'Economy',
    tripType: 'Round Trip'
  });

  // Filter parameters
  const [filters, setFilters] = useState({
    sort_by: 'price_asc',
    stops: 'all',
    max_price: null,
    airline: 'all'
  });

  // Active confirmed bookings state (persisted in localStorage)
  const [activeBookings, setActiveBookings] = useState([]);
  const [lookupPnrQuery, setLookupPnrQuery] = useState('');
  const [lookupError, setLookupError] = useState(null);
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  // Collapsible Left Search Panel state
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);

  // Modal states
  const [selectedFlightForBooking, setSelectedFlightForBooking] = useState(null);
  const [activeBoardingPassModal, setActiveBoardingPassModal] = useState(null);

  // Thank You Confirmation Modal State (replaces confetti animation completely)
  const [thankYouConfirmation, setThankYouConfirmation] = useState(null);

  // Currency symbols & conversion rates
  const currencySymbolMap = { USD: '$', INR: '₹', EUR: '€' };
  const currencyRateMap = { USD: 1, INR: 83, EUR: 0.92 };

  // Helper to format city name cleanly
  const getCityName = (code, fallbackName) => {
    if (!code) return fallbackName || '';
    const match = airports.find(a => a.code === code);
    return match ? match.city : fallbackName || '';
  };

  // Handle section tab changes: Reset state completely for a fresh independent booking flow
  const handleProductTypeChange = (pType) => {
    setProductType(pType);
    setFlightHotelStep(1);
    setTempPackageFlight(null);
    setHasSearched(false);
    setFlights([]);
    
    // Clear search form parameters for a fresh independent search flow
    setSearchParams({
      origin: '',
      destination: '',
      date: '',
      returnDate: '',
      passengers: 1,
      cabin_class: 'Economy',
      tripType: 'Round Trip'
    });
  };

  // Load Initial Airports & Saved Bookings from LocalStorage
  useEffect(() => {
    async function init() {
      const airportList = await fetchAirports();
      setAirports(airportList);

      try {
        const saved = localStorage.getItem('airway_user_bookings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setActiveBookings(parsed);
        }
      } catch (e) {
        console.error('Failed to load saved bookings', e);
      }
    }
    init();
  }, []);

  const executeSearch = async (sParams = searchParams, fFilters = filters) => {
    setLoading(true);
    setHasSearched(true);

    if (productType === 'Hotels' || productType === 'Cars') {
      setLoading(false);
      return;
    }

    if (!sParams.origin || !sParams.destination) {
      setFlights([]);
      setLoading(false);
      return;
    }

    const results = await searchFlights({
      origin: sParams.origin,
      destination: sParams.destination,
      cabin_class: sParams.cabin_class,
      stops: fFilters.stops,
      max_price: fFilters.max_price,
      airline: fFilters.airline,
      sort_by: fFilters.sort_by
    });
    setFlights(results);
    setLoading(false);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (hasSearched) {
      executeSearch(searchParams, newFilters);
    }
  };

  const handleResetFilters = () => {
    const defaultFilters = { sort_by: 'price_asc', stops: 'all', max_price: null, airline: 'all' };
    setFilters(defaultFilters);
    if (hasSearched) {
      executeSearch(searchParams, defaultFilters);
    }
  };

  // Automatic Booking Success Handler: Triggers Professional Thank You Confirmation Screen & Unified Dashboard Storage
  const handleBookingSuccess = (bookingResult) => {
    setSelectedFlightForBooking(null);

    const pnrCode = bookingResult.pnr_code || bookingResult.code || (`AW-CONF-` + Math.floor(100000 + Math.random() * 900000));
    const normalizedBooking = {
      ...bookingResult,
      pnr_code: pnrCode
    };

    // Prepend new booking to activeBookings list so it appears alongside all reservations
    const updated = [normalizedBooking, ...activeBookings.filter(b => b.pnr_code !== pnrCode)];
    setActiveBookings(updated);
    try {
      localStorage.setItem('airway_user_bookings', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save booking to localStorage', e);
    }

    if (hasSearched && productType === 'Flights') {
      executeSearch(searchParams, filters);
    }

    // Trigger Thank You Confirmation Modal
    setThankYouConfirmation(normalizedBooking);
  };

  // Lookup existing PNR to add to My Bookings panel
  const handlePnrLookup = async (e) => {
    e.preventDefault();
    if (!lookupPnrQuery.trim()) return;

    setIsLookupLoading(true);
    setLookupError(null);

    try {
      const foundList = await lookupBooking(lookupPnrQuery.trim());
      if (foundList && foundList.length > 0) {
        const updated = [...foundList, ...activeBookings.filter(b => !foundList.some(f => f.pnr_code === b.pnr_code))];
        setActiveBookings(updated);
        localStorage.setItem('airway_user_bookings', JSON.stringify(updated));
        setLookupPnrQuery('');
      } else {
        setLookupError('No booking record found for this PNR code.');
      }
    } catch (err) {
      setLookupError('No booking record found.');
    } finally {
      setIsLookupLoading(false);
    }
  };

  // Clear booking item
  const handleRemoveBooking = (pnrCode) => {
    const updated = activeBookings.filter(b => b.pnr_code !== pnrCode);
    setActiveBookings(updated);
    localStorage.setItem('airway_user_bookings', JSON.stringify(updated));
  };

  // Find lowest price and fastest duration flight IDs for tag badges
  const lowestPriceId = flights.length > 0 ? [...flights].sort((a, b) => (a.active_price || a.price_economy) - (b.active_price || b.price_economy))[0]?.id : null;
  
  const fastestDurationId = flights.length > 0 ? [...flights].sort((a, b) => {
    const parseMins = (durStr) => {
      const parts = durStr.match(/(\d+)h\s*(\d+)m/);
      if (!parts) return 9999;
      return parseInt(parts[1]) * 60 + parseInt(parts[2]);
    };
    return parseMins(a.duration) - parseMins(b.duration);
  })[0]?.id : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      
      {/* Top Flagship Navigation Bar */}
      <Navbar
        onOpenMyBookings={() => {
          document.getElementById('my-bookings-panel')?.scrollIntoView({ behavior: 'smooth' });
        }}
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* Main Content Area switched by Navigation Tab */}
      <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px 24px 60px 24px', flex: 1 }}>
        
        {activeNav === 'Explore' && (
          <ExploreView onSelectRoute={(orig, dest) => {
            handleProductTypeChange('Flights');
            setSearchParams({ ...searchParams, origin: orig, destination: dest });
            setActiveNav('Book & Manage');
            executeSearch({ ...searchParams, origin: orig, destination: dest }, filters);
          }} />
        )}

        {activeNav === 'Plan' && <PlanView />}

        {activeNav === 'Experience' && <ExperienceView />}

        {activeNav === 'Loyalty' && <LoyaltyView />}

        {activeNav === 'Support' && <SupportView />}

        {activeNav === 'Book & Manage' && (
          <div>
            {/* Compact Aviation Hero Banner Carousel */}
            <HeroCarousel />

            {/* SPLIT-SCREEN DASHBOARD LAYOUT */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(340px, 380px) 1fr',
              gap: '28px',
              alignItems: 'start'
            }}>
              
              {/* LEFT COLUMN: Minimized Collapsible Flight Search Panel */}
              <div style={{ position: 'sticky', top: '90px' }}>
                <FlightSearch
                  searchParams={searchParams}
                  onSearchChange={setSearchParams}
                  onExecuteSearch={(newParams) => {
                    setSearchParams(newParams);
                    setFlightHotelStep(1);
                    executeSearch(newParams, filters);
                  }}
                  airports={airports}
                  currencySymbol={currencySymbolMap[currency]}
                  currencyRate={currencyRateMap[currency]}
                  isCollapsed={isSearchCollapsed}
                  onToggleCollapse={() => setIsSearchCollapsed(!isSearchCollapsed)}
                  productType={productType}
                  onProductTypeChange={handleProductTypeChange}
                />

                {/* Left Column Filters */}
                {hasSearched && (productType === 'Flights' || (productType === 'Flight + Hotel' && flightHotelStep === 1)) && !isSearchCollapsed && (
                  <div style={{ marginTop: '20px' }}>
                    <FlightFilter
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onResetFilters={handleResetFilters}
                      flightCount={flights.length}
                      currencySymbol={currencySymbolMap[currency]}
                      currencyRate={currencyRateMap[currency]}
                      maxPriceLimit={6000 * currencyRateMap[currency]}
                    />
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Always-Visible "My Bookings" Panel & Dynamic Service Results */}
              <div id="right-side-results" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                
                {/* 1. ALWAYS VISIBLE MY BOOKINGS DASHBOARD PANEL */}
                <div id="my-bookings-panel" className="glass-panel" style={{ padding: '24px', background: '#ffffff', border: '2px solid #0284c7', borderRadius: '18px' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Ticket size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                          My Active Bookings & Boarding Passes ({activeBookings.length})
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '600' }}>
                          Confirmed flight, package, hotel, and car reservations display here in real-time.
                        </p>
                      </div>
                    </div>

                    {/* Quick PNR Lookup Bar */}
                    <form onSubmit={handlePnrLookup} style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        className="custom-input"
                        placeholder="Enter Reference (e.g. HTL-AW-829102)"
                        style={{ height: '38px', fontSize: '0.8rem', width: '230px' }}
                        value={lookupPnrQuery}
                        onChange={(e) => setLookupPnrQuery(e.target.value)}
                      />
                      <button type="submit" className="btn-secondary" style={{ height: '38px', fontSize: '0.8rem', padding: '0 12px' }}>
                        {isLookupLoading ? '...' : 'Find'}
                      </button>
                    </form>
                  </div>

                  {lookupError && (
                    <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.8rem', fontWeight: '700' }}>
                      {lookupError}
                    </div>
                  )}

                  {/* Booking Cards Stack */}
                  {activeBookings.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                      <Ticket size={32} color="var(--primary-cyan)" style={{ marginBottom: '8px' }} />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                        No Active Bookings Yet
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
                        Confirm a flight, package, hotel, or car rental to view your instant travel documents here.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {activeBookings.map((b) => {
                        const isHotel = b.is_hotel || b.type === 'Hotel Reservation';
                        const isCar = b.is_car || b.type === 'Car Rental';

                        if (isHotel) {
                          return (
                            <div
                              key={b.pnr_code}
                              style={{
                                background: '#ffffff',
                                border: '2px solid #0284c7',
                                borderRadius: '16px',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px',
                                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Hotel size={22} />
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                                      {b.hotel_name || b.hotelName}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', fontWeight: '600', marginTop: '2px' }}>
                                      Guest: <strong>{b.passenger_name || b.guestName}</strong> • Room: <strong>{b.hotel_room || b.roomType || '5-Star Suite'}</strong>
                                    </div>
                                  </div>
                                </div>

                                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-sub)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>
                                      HOTEL REF
                                    </span>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--primary-cyan)', letterSpacing: '1px' }}>
                                      {b.pnr_code}
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => setActiveBoardingPassModal(b)}
                                    className="btn-secondary"
                                    style={{ height: '38px', fontSize: '0.8rem', padding: '0 14px' }}
                                  >
                                    <Printer size={15} /> Hotel Voucher
                                  </button>

                                  <button
                                    onClick={() => handleRemoveBooking(b.pnr_code)}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                                    title="Remove Booking"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              {/* HOTEL CHECK-IN & CHECK-OUT TIMINGS GRID */}
                              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Check-In Date & Time
                                  </div>
                                  <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '900', marginTop: '2px' }}>
                                    {b.check_in_full || `${b.check_in_date || '2026-08-05'} at ${b.check_in_time || '15:00 PM'}`}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontWeight: '700', marginTop: '2px' }}>
                                    📍 Location: {b.hotel_location || b.hotel_city || b.route}
                                  </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Check-Out Date & Time
                                  </div>
                                  <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '900', marginTop: '2px' }}>
                                    {b.check_out_full || `${b.check_out_date || '2026-08-10'} at ${b.check_out_time || '11:00 AM'}`}
                                  </div>
                                  <span style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#059669', padding: '2px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '800', display: 'inline-block', marginTop: '4px' }}>
                                    {b.status || 'Hotel Confirmed'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        if (isCar) {
                          return (
                            <div
                              key={b.pnr_code}
                              style={{
                                background: '#ffffff',
                                border: '2px solid #0284c7',
                                borderRadius: '16px',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px',
                                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Car size={22} />
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                                      {b.car_name || b.carName}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', fontWeight: '600', marginTop: '2px' }}>
                                      Driver: <strong>{b.passenger_name || b.driverName}</strong>
                                    </div>
                                  </div>
                                </div>

                                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-sub)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>
                                      CAR RENTAL REF
                                    </span>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--primary-cyan)', letterSpacing: '1px' }}>
                                      {b.pnr_code}
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => setActiveBoardingPassModal(b)}
                                    className="btn-secondary"
                                    style={{ height: '38px', fontSize: '0.8rem', padding: '0 14px' }}
                                  >
                                    <Printer size={15} /> Rental Voucher
                                  </button>

                                  <button
                                    onClick={() => handleRemoveBooking(b.pnr_code)}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                                    title="Remove Booking"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              {/* CAR PICKUP & DROP-OFF TIMINGS GRID */}
                              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Pickup Date, Time & Desk
                                  </div>
                                  <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '900', marginTop: '2px' }}>
                                    {b.pickup_full || `${b.pickup_date || '2026-08-05'} at ${b.pickup_time || '09:00 AM'}`}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontWeight: '700', marginTop: '2px' }}>
                                    📍 Pickup: {b.pickup_location || b.pickup || 'Airport Arrival Terminal Desk'}
                                  </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Return Date, Time & Desk
                                  </div>
                                  <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '900', marginTop: '2px' }}>
                                    {b.return_full || `${b.return_date || '2026-08-10'} at ${b.return_time || '17:00 PM'}`}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '700', marginTop: '2px' }}>
                                    📍 Return: {b.dropoff_location || 'Airport Return Desk'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Default Flight & Flight + Hotel Package Card
                        const origCode = b.origin_code || 'ATL';
                        const destCode = b.destination_code || 'DXB';
                        const origCity = getCityName(origCode, b.origin);
                        const destCity = getCityName(destCode, b.destination);

                        return (
                          <div
                            key={b.pnr_code}
                            style={{
                              background: '#ffffff',
                              border: b.is_package ? '2px solid #0284c7' : '1px solid #cbd5e1',
                              borderRadius: '16px',
                              padding: '20px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '16px',
                              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)'
                            }}
                          >
                            {/* Header Row: Airline Logo, Airline Name, Passenger Info & PNR */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <AirlineLogo code={b.airline_code || 'AW'} size={44} />
                                <div>
                                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                                    {b.airline} ({b.flight_number})
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', fontWeight: '600', marginTop: '2px' }}>
                                    Passenger: <strong>{b.passenger_name}</strong> • Seat: <strong>{b.seat_number || '18A'}</strong> ({b.cabin_class || 'Economy'})
                                  </div>
                                </div>
                              </div>

                              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-sub)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>
                                    {b.is_package ? 'PACKAGE PNR' : 'FLIGHT PNR'}
                                  </span>
                                  <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--primary-cyan)', letterSpacing: '1px' }}>
                                    {b.pnr_code}
                                  </div>
                                </div>

                                <button
                                  onClick={() => setActiveBoardingPassModal(b)}
                                  className="btn-secondary"
                                  style={{ height: '38px', fontSize: '0.8rem', padding: '0 14px' }}
                                >
                                  <Printer size={15} /> Boarding Pass
                                </button>

                                <button
                                  onClick={() => handleRemoveBooking(b.pnr_code)}
                                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                                  title="Remove Booking"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            {/* PERFECTLY CENTERED ARROW & PROMINENT IATA CODES */}
                            <div style={{
                              background: '#f8fafc',
                              padding: '20px 24px',
                              borderRadius: '14px',
                              border: '1px solid #cbd5e1',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '16px'
                            }}>
                              {/* Top Row: Departure (Left), Centered Arrow (Middle), Destination (Right) */}
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '16px' }}>
                                
                                {/* Left: Departure Code & City */}
                                <div style={{ textAlign: 'left' }}>
                                  <div style={{ fontSize: '2.1rem', fontWeight: '900', color: '#0f172a', letterSpacing: '1px', lineHeight: '1' }}>
                                    {origCode}
                                  </div>
                                  {origCity && (
                                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-cyan)', marginTop: '4px' }}>
                                      {origCity}
                                    </div>
                                  )}
                                </div>

                                {/* Center: Perfectly Centered Arrow */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 12px' }}>
                                  <span style={{ fontSize: '1.8rem', color: 'var(--primary-cyan)', fontWeight: '900', lineHeight: '1' }}>
                                    →
                                  </span>
                                  <span style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#059669', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '800', marginTop: '4px' }}>
                                    {b.status || 'CONFIRMED'}
                                  </span>
                                </div>

                                {/* Right: Destination Code & City */}
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontSize: '2.1rem', fontWeight: '900', color: '#0f172a', letterSpacing: '1px', lineHeight: '1' }}>
                                    {destCode}
                                  </div>
                                  {destCity && (
                                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-cyan)', marginTop: '4px' }}>
                                      {destCity}
                                    </div>
                                  )}
                                </div>

                              </div>

                              {/* Departure and Arrival Schedule Labels */}
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '16px',
                                paddingTop: '14px',
                                borderTop: '1px dashed #cbd5e1'
                              }}>
                                {/* Departure */}
                                <div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Departure
                                  </div>
                                  <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '900', marginTop: '2px' }}>
                                    {b.departure_time}
                                  </div>
                                </div>

                                {/* Arrival */}
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Arrival
                                  </div>
                                  <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '900', marginTop: '2px' }}>
                                    {b.arrival_time}
                                  </div>
                                </div>
                              </div>

                              {/* COMBINED HOTEL PACKAGE FOOTER CARD IF PACKAGE BOOKING */}
                              {b.is_package && (
                                <div style={{ background: '#f0f9ff', border: '1px solid #7dd3fc', padding: '12px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Hotel size={18} color="var(--primary-cyan)" />
                                    <div>
                                      <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>
                                        🏨 Bundled Hotel: {b.hotel_name}
                                      </div>
                                      <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '600' }}>
                                        Location: {b.hotel_city} • Room: {b.hotel_room} (5-Star)
                                      </div>
                                    </div>
                                  </div>
                                  <span style={{ fontSize: '0.75rem', background: '#0284c7', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                                    Included
                                  </span>
                                </div>
                              )}

                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>

                {/* 2. DYNAMIC MAIN RESULTS SECTION ON RIGHT SIDE BASED ON PRODUCT TYPE TAB */}
                <div>
                  
                  {/* Option A: FLIGHTS TAB SELECTED */}
                  {productType === 'Flights' && (
                    <div id="flight-results">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                          Available Flight Results ({flights.length})
                        </h3>
                        {hasSearched && searchParams.origin && searchParams.destination && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', fontWeight: '700' }}>
                            {searchParams.origin} → {searchParams.destination} ({searchParams.cabin_class})
                          </span>
                        )}
                      </div>

                      {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {[1, 2, 3].map((n) => (
                            <div key={n} className="glass-panel" style={{ padding: '28px', height: '140px', animation: 'pulse 1.5s infinite ease-in-out' }}>
                              <div style={{ width: '40%', height: '20px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '16px' }} />
                              <div style={{ width: '80%', height: '16px', background: '#f1f5f9', borderRadius: '4px' }} />
                            </div>
                          ))}
                        </div>
                      ) : !hasSearched ? (
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
                            <Plane size={32} />
                          </div>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>
                            Ready to Explore the Skies?
                          </h4>
                          <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto 16px auto', lineHeight: '1.5' }}>
                            Select your <strong>Departure (From)</strong> and <strong>Destination (To)</strong> airports in the left search panel, then click <strong>"Search Flights"</strong> to view 10 real-time flight options.
                          </p>
                        </div>
                      ) : flights.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
                          <AlertCircle size={48} color="var(--primary-cyan)" style={{ marginBottom: '16px' }} />
                          <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>No Flights Found</h4>
                          <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '20px' }}>
                            No flight records match your active filters for {searchParams.origin} to {searchParams.destination}.
                          </p>
                          <button className="btn-primary" onClick={handleResetFilters}>
                            Reset All Filters
                          </button>
                        </div>
                      ) : (
                        <div>
                          {flights.map((flight) => (
                            <FlightCard
                              key={flight.id}
                              flight={flight}
                              cabinClass={searchParams.cabin_class}
                              currency={currency}
                              currencyRate={currencyRateMap[currency]}
                              currencySymbol={currencySymbolMap[currency]}
                              onSelectBook={(selected) => setSelectedFlightForBooking(selected)}
                              isCheapest={flight.id === lowestPriceId}
                              isFastest={flight.id === fastestDurationId}
                              isPackageMode={false}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Option B: FLIGHT + HOTEL TAB SELECTED (FLIGHTS FIRST, HOTELS AFTER FLIGHTS) */}
                  {productType === 'Flight + Hotel' && (
                    <div>
                      {flightHotelStep === 1 ? (
                        <div id="flight-results">
                          <div style={{ background: '#f0f9ff', border: '1px solid #0284c7', padding: '16px 20px', borderRadius: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', background: '#0284c7', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontWeight: '800', textTransform: 'uppercase' }}>
                                Flight + Hotel Package Search
                              </span>
                              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                                Flights First, Destination Hotels Below
                              </h4>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                                Browse 10 flight search results for your route, followed by verified hotels in {searchParams.destination || 'your destination'}.
                              </p>
                            </div>
                          </div>

                          {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {[1, 2, 3].map((n) => (
                                <div key={n} className="glass-panel" style={{ padding: '28px', height: '140px', animation: 'pulse 1.5s infinite ease-in-out' }}>
                                  <div style={{ width: '40%', height: '20px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '16px' }} />
                                  <div style={{ width: '80%', height: '16px', background: '#f1f5f9', borderRadius: '4px' }} />
                                </div>
                              ))}
                            </div>
                          ) : !hasSearched ? (
                            <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', background: '#ffffff', border: '2px dashed #cbd5e1' }}>
                              <Plane size={32} color="var(--primary-cyan)" style={{ marginBottom: '12px' }} />
                              <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>
                                Start Your Flight + Hotel Package Search
                              </h4>
                              <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto 16px auto' }}>
                                Select <strong>From</strong> and <strong>To</strong> airports in the left search panel, then click <strong>"Search Flight + Hotel"</strong>.
                              </p>
                            </div>
                          ) : flights.length === 0 ? (
                            <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
                              <AlertCircle size={48} color="var(--primary-cyan)" style={{ marginBottom: '16px' }} />
                              <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>No Flights Found</h4>
                              <button className="btn-primary" onClick={handleResetFilters}>Reset Filters</button>
                            </div>
                          ) : (
                            <div>
                              {/* 1. FLIGHT RESULTS FIRST */}
                              <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                                  1. Select Package Flight ({flights.length} Options Found for {searchParams.origin} → {searchParams.destination})
                                </h3>
                                {flights.map((flight) => (
                                  <FlightCard
                                    key={flight.id}
                                    flight={flight}
                                    cabinClass={searchParams.cabin_class}
                                    currency={currency}
                                    currencyRate={currencyRateMap[currency]}
                                    currencySymbol={currencySymbolMap[currency]}
                                    isCheapest={flight.id === lowestPriceId}
                                    isFastest={flight.id === fastestDurationId}
                                    isPackageMode={true}
                                    onSelectBook={(selectedFlight) => {
                                      setTempPackageFlight(selectedFlight);
                                      setFlightHotelStep(2);
                                      setTimeout(() => {
                                        document.getElementById('flight-hotel-step2-area')?.scrollIntoView({ behavior: 'smooth' });
                                      }, 100);
                                    }}
                                  />
                                ))}
                              </div>

                              {/* 2. HOTELS AFTER FLIGHTS (STRICT DESTINATION MATCHING ONLY) */}
                              <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '2px dashed #cbd5e1' }}>
                                <div style={{ marginBottom: '18px' }}>
                                  <span style={{ fontSize: '0.75rem', background: '#0284c7', color: '#ffffff', padding: '3px 10px', borderRadius: '12px', fontWeight: '800', textTransform: 'uppercase' }}>
                                    Destination Hotels for {getCityName(searchParams.destination, searchParams.destination)} ({searchParams.destination})
                                  </span>
                                  <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>
                                    2. 5-Star Hotels Available in {getCityName(searchParams.destination, searchParams.destination)}
                                  </h3>
                                  <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>
                                    Strictly matching destination city: <strong>{searchParams.destination}</strong>. Select any hotel below to bundle with your flight.
                                  </p>
                                </div>

                                <HotelsSection
                                  currencySymbol={currencySymbolMap[currency]}
                                  currencyRate={currencyRateMap[currency]}
                                  selectedDestinationCode={searchParams.destination}
                                  hasSearchedHotels={true}
                                  onBookingSuccess={handleBookingSuccess}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* STEP 2: HOTEL SELECTION FOR DESTINATION ONLY */
                        <div id="flight-hotel-step2-area">
                          <FlightHotelStep2HotelSelection
                            confirmedFlight={tempPackageFlight}
                            currencySymbol={currencySymbolMap[currency]}
                            currencyRate={currencyRateMap[currency]}
                            onChangeFlight={() => setFlightHotelStep(1)}
                            onCompletePackage={(completedPackageBooking) => {
                              setFlightHotelStep(1);
                              setTempPackageFlight(null);
                              handleBookingSuccess(completedPackageBooking);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Option C: HOTELS TAB SELECTED (REQUIRES EXPLICIT SEARCH CLICK) */}
                  {productType === 'Hotels' && (
                    <HotelsSection
                      currencySymbol={currencySymbolMap[currency]}
                      currencyRate={currencyRateMap[currency]}
                      selectedDestinationCode={searchParams.origin || ''}
                      hasSearchedHotels={hasSearched}
                      onBookingSuccess={handleBookingSuccess}
                    />
                  )}

                  {/* Option D: CARS TAB SELECTED */}
                  {productType === 'Cars' && (
                    <CarsSection
                      currencySymbol={currencySymbolMap[currency]}
                      currencyRate={currencyRateMap[currency]}
                      selectedPickupCode={searchParams.origin || ''}
                      onBookingSuccess={handleBookingSuccess}
                    />
                  )}

                </div>

                {/* Homepage Offers & Packages Section */}
                <OffersAndPackagesSection />

              </div>

            </div>
          </div>
        )}

      </main>

      {/* Redesigned Flagship Footer */}
      <footer style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '48px 24px 32px 24px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', marginBottom: '40px' }}>
            
            {/* Column 1: Brand Info */}
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', marginBottom: '12px' }}>AirwAy</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.6', marginBottom: '16px' }}>
                Next-generation flagship flight booking platform connecting major international hubs with instant seat reservation and luxury service.
              </p>
              <div style={{ display: 'flex', gap: '12px', color: 'var(--primary-cyan)', fontSize: '0.8rem', fontWeight: '700' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={16} /> SSL 256-Bit</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HeartHandshake size={16} /> 24/7 Service</span>
              </div>
            </div>

            {/* Column 2: Book & Manage Links */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Book & Manage
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <li><a href="#search" onClick={() => setActiveNav('Book & Manage')} style={{ color: 'var(--text-sub)', textDecoration: 'none', fontWeight: '600' }}>Search Flights</a></li>
                <li><a href="#packages" onClick={() => setActiveNav('Book & Manage')} style={{ color: 'var(--text-sub)', textDecoration: 'none', fontWeight: '600' }}>Flight + Hotel Packages</a></li>
                <li><a href="#my-bookings-panel" onClick={() => document.getElementById('my-bookings-panel')?.scrollIntoView({ behavior: 'smooth' })} style={{ color: 'var(--text-sub)', textDecoration: 'none', fontWeight: '600' }}>My Bookings Dashboard</a></li>
                <li><a href="#seat" onClick={() => setActiveNav('Book & Manage')} style={{ color: 'var(--text-sub)', textDecoration: 'none', fontWeight: '600' }}>Seat Selection & Upgrades</a></li>
                <li><a href="#status" onClick={() => setActiveNav('Explore')} style={{ color: 'var(--text-sub)', textDecoration: 'none', fontWeight: '600' }}>Real-Time Flight Status</a></li>
              </ul>
            </div>

            {/* Column 3: Support & Info Links */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Support & Info
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <li><a href="#faqs" onClick={() => setActiveNav('Support')} style={{ color: 'var(--text-sub)', textDecoration: 'none', fontWeight: '600' }}>Frequently Asked Questions</a></li>
                <li><a href="#visa" onClick={() => setActiveNav('Plan')} style={{ color: 'var(--text-sub)', textDecoration: 'none', fontWeight: '600' }}>Visa & Entry Requirements</a></li>
                <li><a href="#baggage" onClick={() => setActiveNav('Plan')} style={{ color: 'var(--text-sub)', textDecoration: 'none', fontWeight: '600' }}>Baggage Allowances & Policies</a></li>
                <li><a href="#loyalty" onClick={() => setActiveNav('Loyalty')} style={{ color: 'var(--text-sub)', textDecoration: 'none', fontWeight: '600' }}>AirwAy SkyMiles Rewards</a></li>
                <li><a href="#contact" onClick={() => setActiveNav('Support')} style={{ color: 'var(--text-sub)', textDecoration: 'none', fontWeight: '600' }}>Contact Support Hotline</a></li>
              </ul>
            </div>

            {/* Column 4: Contact & Phone */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Contact Hotline
              </h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#0f172a' }}>
                  <Phone size={16} color="var(--primary-cyan)" /> +1 (800) 247-929]
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                  <Mail size={16} color="var(--accent-emerald)" /> support@airway.com
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Available 24 hours a day, 7 days a week for reservations, booking changes, and refunds.
                </p>
              </div>
            </div>

          </div>

          <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: 'var(--text-sub)' }}>
            <div>© {new Date().getFullYear()} <strong>AirwAy</strong> Flagship Airlines • All Rights Reserved.</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Cookie Preferences</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Booking Form Modal for Single Flight Booking */}
      {selectedFlightForBooking && (
        <BookingModal
          flight={selectedFlightForBooking}
          cabinClass={searchParams.cabin_class}
          currencyRate={currencyRateMap[currency]}
          currencySymbol={currencySymbolMap[currency]}
          onClose={() => setSelectedFlightForBooking(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* E-Ticket / Boarding Pass Modal */}
      {activeBoardingPassModal && (
        <BoardingPass
          booking={activeBoardingPassModal}
          currencySymbol={currencySymbolMap[currency]}
          onClose={() => setActiveBoardingPassModal(null)}
        />
      )}

      {/* PROFESSIONAL THANK YOU CONFIRMATION MODAL WITH FULL TIMINGS */}
      {thankYouConfirmation && (
        <ThankYouConfirmationModal
          confirmation={thankYouConfirmation}
          onClose={() => setThankYouConfirmation(null)}
          onViewBooking={() => {
            document.getElementById('my-bookings-panel')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenBoardingPass={(b) => {
            setActiveBoardingPassModal(b);
          }}
        />
      )}

    </div>
  );
}

// PREMIUM THANK YOU CONFIRMATION MODAL WITH FULL TIMINGS
function ThankYouConfirmationModal({ confirmation, onClose, onViewBooking, onOpenBoardingPass }) {
  if (!confirmation) return null;

  const isHotel = confirmation.is_hotel || confirmation.type === 'Hotel Reservation';
  const isCar = confirmation.is_car || confirmation.type === 'Car Rental';

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{
        maxWidth: '620px',
        width: '100%',
        padding: '36px 32px',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #cbd5e1',
        boxShadow: '0 25px 60px rgba(15, 23, 42, 0.22)',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-sub)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Elegant Confirmation Badge */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0284c7 0%, #0f172a 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 10px 24px rgba(2, 132, 199, 0.3)'
        }}>
          <CheckCircle2 size={40} />
        </div>

        <span style={{
          fontSize: '0.75rem',
          background: '#d1fae5',
          border: '1px solid #a7f3d0',
          color: '#059669',
          padding: '4px 14px',
          borderRadius: '12px',
          fontWeight: '800',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          ✓ Booking Successfully Confirmed
        </span>

        {/* Premium Thank You Title */}
        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0f172a', marginTop: '14px', marginBottom: '8px' }}>
          Thank You for Choosing Us
        </h2>
        <p style={{ color: 'var(--text-sub)', fontSize: '0.92rem', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto 24px auto' }}>
          We appreciate your trust and are excited to be part of your journey. Your booking has been successfully confirmed.
        </p>

        {/* Detailed Timing & Confirmation Summary Card */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'left',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>
                Booking Category
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                {confirmation.type || (confirmation.is_package ? 'Flight + Hotel Package' : isHotel ? 'Hotel Reservation' : isCar ? 'Car Rental' : 'Flight Booking')}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>
                Confirmation Ref
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--primary-cyan)', letterSpacing: '0.5px' }}>
                {confirmation.pnr_code || confirmation.code || 'AW-CONFIRMED'}
              </div>
            </div>
          </div>

          {/* Full Hotel / Car Timing Details */}
          {isHotel ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '1rem', fontWeight: '900', color: '#0f172a' }}>
                🏨 {confirmation.hotel_name || confirmation.hotelName} ({confirmation.roomType || confirmation.hotel_room})
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', fontWeight: '700' }}>
                📍 Location: {confirmation.hotel_location || confirmation.hotel_city || confirmation.route}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '700' }}>Check-In Date & Time</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                    {confirmation.check_in_full || `${confirmation.check_in_date || '2026-08-05'} at ${confirmation.check_in_time || '15:00 PM'}`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '700' }}>Check-Out Date & Time</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                    {confirmation.check_out_full || `${confirmation.check_out_date || '2026-08-10'} at ${confirmation.check_out_time || '11:00 AM'}`}
                  </div>
                </div>
              </div>
            </div>
          ) : isCar ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '1rem', fontWeight: '900', color: '#0f172a' }}>
                🚗 {confirmation.car_name || confirmation.carName}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '700' }}>Pickup Desk & Timing</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                    {confirmation.pickup_full || `${confirmation.pickup_date || '2026-08-05'} at ${confirmation.pickup_time || '09:00 AM'}`}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontWeight: '700', marginTop: '2px' }}>
                    📍 {confirmation.pickup_location || confirmation.pickup}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '700' }}>Return Desk & Timing</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                    {confirmation.return_full || `${confirmation.return_date || '2026-08-10'} at ${confirmation.return_time || '17:00 PM'}`}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '700', marginTop: '2px' }}>
                    📍 {confirmation.dropoff_location || 'Airport Return Desk'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '700' }}>Route / Location</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                  {confirmation.origin_code ? `${confirmation.origin_code} → ${confirmation.destination_code}` : confirmation.route || 'Confirmed Reservation'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '700' }}>Passenger / Guest</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                  {confirmation.passenger_name || confirmation.guestName || confirmation.driverName || 'Lead Guest'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn-secondary"
            style={{ flex: 1, padding: '13px', justifyContent: 'center', fontSize: '0.9rem' }}
            onClick={() => {
              onClose();
              onViewBooking();
            }}
          >
            View My Booking
          </button>

          <button
            className="btn-primary"
            style={{ flex: 1, padding: '13px', justifyContent: 'center', fontSize: '0.9rem' }}
            onClick={() => {
              onClose();
              onOpenBoardingPass(confirmation);
            }}
          >
            <Printer size={16} /> Download Confirmation / Voucher
          </button>
        </div>
      </div>
    </div>
  );
}
