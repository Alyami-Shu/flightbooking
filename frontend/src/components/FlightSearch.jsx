import React, { useState } from 'react';
import { ArrowRightLeft, Calendar, Users, Briefcase, Search, MapPin, Plane, Hotel, Car, Plus, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';

export default function FlightSearch({
  searchParams,
  onSearchChange,
  onExecuteSearch,
  airports,
  currencySymbol,
  currencyRate,
  isCollapsed,
  onToggleCollapse,
  productType,
  onProductTypeChange
}) {
  const [isSwapping, setIsSwapping] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // Multi-City Legs
  const [multiCityLegs, setMultiCityLegs] = useState([
    { origin: '', destination: '', date: '' },
    { origin: '', destination: '', date: '' }
  ]);

  const handleSwap = () => {
    if (!searchParams.origin && !searchParams.destination) return;
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 400);
    onSearchChange({
      ...searchParams,
      origin: searchParams.destination,
      destination: searchParams.origin
    });
  };

  const handleSearchClick = () => {
    setValidationError(null);

    if (productType === 'Hotels') {
      if (!searchParams.origin || searchParams.origin.trim() === '') {
        setValidationError('Please select a Destination City before searching hotels.');
        return;
      }
      onExecuteSearch(searchParams);
      setTimeout(() => {
        document.getElementById('right-side-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    if (productType === 'Cars') {
      if (!searchParams.origin || searchParams.origin.trim() === '') {
        setValidationError('Please select a Pickup Location before searching car rentals.');
        return;
      }
      onExecuteSearch(searchParams);
      setTimeout(() => {
        document.getElementById('right-side-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    // Flights or Flight + Hotel Validation
    if (searchParams.tripType === 'Multi-City') {
      const firstLeg = multiCityLegs[0];
      if (!firstLeg.origin || !multiCityLegs[multiCityLegs.length - 1].destination) {
        setValidationError('Please select both Departure and Destination airports for multi-city legs.');
        return;
      }
      onExecuteSearch({
        ...searchParams,
        origin: firstLeg.origin,
        destination: multiCityLegs[multiCityLegs.length - 1].destination,
        date: firstLeg.date
      });
    } else {
      // Validate both origin and destination are selected for flight search
      if (!searchParams.origin || searchParams.origin.trim() === '' || !searchParams.destination || searchParams.destination.trim() === '') {
        setValidationError('Please select both Departure (From) and Destination (To) airports before searching.');
        return;
      }

      if (searchParams.origin === searchParams.destination) {
        setValidationError('Departure and Destination airports cannot be the same. Please select different airports.');
        return;
      }

      onExecuteSearch(searchParams);
    }
    
    // Smooth scroll down to results on right side
    setTimeout(() => {
      document.getElementById('right-side-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="glass-panel" style={{ padding: isCollapsed ? '16px 20px' : '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)' }}>
      
      {/* Collapsible Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCollapsed ? '0' : '16px', borderBottom: isCollapsed ? 'none' : '1px solid #e2e8f0', paddingBottom: isCollapsed ? '0' : '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-cyan)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plane size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
              {isCollapsed && searchParams.origin && searchParams.destination
                ? `${searchParams.origin} → ${searchParams.destination}`
                : `Search ${productType}`}
            </h3>
            {isCollapsed && (
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontWeight: '700' }}>
                {searchParams.tripType} • {searchParams.cabin_class}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onToggleCollapse}
          style={{
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#0f172a',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {isCollapsed ? 'Expand Panel' : 'Minimize'}
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {/* Collapsible Form Body */}
      {!isCollapsed && (
        <div>
          {/* 1. Top Product Categories */}
          <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {[
              { name: 'Flights', icon: <Plane size={15} /> },
              { name: 'Flight + Hotel', icon: <Hotel size={15} /> },
              { name: 'Hotels', icon: <Hotel size={15} /> },
              { name: 'Cars', icon: <Car size={15} /> }
            ].map((prod) => (
              <button
                key={prod.name}
                onClick={() => {
                  setValidationError(null);
                  onProductTypeChange(prod.name);
                }}
                style={{
                  background: productType === prod.name ? '#0f172a' : '#f8fafc',
                  color: productType === prod.name ? '#ffffff' : 'var(--text-sub)',
                  border: productType === prod.name ? '1px solid #0f172a' : '1px solid #cbd5e1',
                  borderRadius: '7px',
                  height: '36px',
                  padding: '0 12px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                {prod.icon}
                <span>{prod.name}</span>
              </button>
            ))}
          </div>

          {/* Validation Alert Box */}
          {validationError && (
            <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </div>
          )}

          {/* 2. Trip Type Sub-Tabs */}
          {productType === 'Flights' && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'inline-flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                {['Round Trip', 'One Way', 'Multi-City'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setValidationError(null);
                      onSearchChange({ ...searchParams, tripType: type });
                    }}
                    style={{
                      background: searchParams.tripType === type ? 'var(--primary-cyan)' : 'transparent',
                      color: searchParams.tripType === type ? '#ffffff' : 'var(--text-sub)',
                      border: 'none',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Main Search Form Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Origin */}
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} color="var(--primary-cyan)" /> {productType === 'Hotels' ? 'City / Destination' : productType === 'Cars' ? 'Pickup Location' : 'From'}
              </label>
              <select
                className="custom-select"
                value={searchParams.origin}
                onChange={(e) => {
                  setValidationError(null);
                  onSearchChange({ ...searchParams, origin: e.target.value });
                }}
              >
                <option value="">{productType === 'Hotels' ? 'Select Destination City' : 'Select Departure Airport'}</option>
                {airports.map(a => (
                  <option key={a.code} value={a.code}>
                    {a.city} ({a.code}) - {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            {productType === 'Flights' && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Swap Origin and Destination"
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    width: '100%',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-cyan)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    gap: '6px'
                  }}
                >
                  <ArrowRightLeft size={14} /> Swap Departure & Destination
                </button>
              </div>
            )}

            {/* Destination */}
            {productType !== 'Hotels' && productType !== 'Cars' && (
              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="var(--primary-cyan)" /> To (Destination)
                </label>
                <select
                  className="custom-select"
                  value={searchParams.destination}
                  onChange={(e) => {
                    setValidationError(null);
                    onSearchChange({ ...searchParams, destination: e.target.value });
                  }}
                >
                  <option value="">Select Destination Airport</option>
                  {airports.map(a => (
                    <option key={a.code} value={a.code}>
                      {a.city} ({a.code}) - {a.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Departure Date */}
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} /> Departure Date
              </label>
              <input
                type="date"
                className="custom-input"
                value={searchParams.date || ''}
                onChange={(e) => onSearchChange({ ...searchParams, date: e.target.value })}
              />
            </div>

            {/* Return Date */}
            {(searchParams.tripType === 'Round Trip' || productType !== 'Flights') && (
              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} /> Return Date
                </label>
                <input
                  type="date"
                  className="custom-input"
                  value={searchParams.returnDate || ''}
                  onChange={(e) => onSearchChange({ ...searchParams, returnDate: e.target.value })}
                />
              </div>
            )}

            {/* Passengers */}
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={13} /> Passengers
              </label>
              <select
                className="custom-select"
                value={searchParams.passengers}
                onChange={(e) => onSearchChange({ ...searchParams, passengers: parseInt(e.target.value) })}
              >
                <option value={1}>1 Adult</option>
                <option value={2}>2 Adults</option>
                <option value={3}>3 Adults</option>
                <option value={4}>4 Adults</option>
              </select>
            </div>

            {/* Cabin Class */}
            {productType === 'Flights' && (
              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Briefcase size={13} /> Cabin Class
                </label>
                <select
                  className="custom-select"
                  value={searchParams.cabin_class}
                  onChange={(e) => onSearchChange({ ...searchParams, cabin_class: e.target.value })}
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business Class</option>
                  <option value="First">First Class</option>
                </select>
              </div>
            )}

            {/* Search Button */}
            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '6px' }}
              onClick={handleSearchClick}
            >
              <Search size={18} />
              <span>Search {productType}</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
