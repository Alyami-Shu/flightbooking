import React, { useState } from 'react';
import { ArrowRight, Users, Briefcase, Search, MapPin, Plane, Hotel, Car, AlertCircle } from 'lucide-react';
import UnifiedDatePicker from './UnifiedDatePicker';

export default function FlightSearch({
  searchParams,
  onSearchChange,
  onExecuteSearch,
  airports,
  currencySymbol,
  currencyRate,
  productType,
  onProductTypeChange
}) {
  const [validationError, setValidationError] = useState(null);

  // Multi-City Legs
  const [multiCityLegs, setMultiCityLegs] = useState([
    { origin: '', destination: '', date: '' },
    { origin: '', destination: '', date: '' }
  ]);

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

    // Flights or Travel Packages Validation
    if (searchParams.tripType === 'Multi-City') {
      const firstLeg = multiCityLegs[0];
      if (!firstLeg.origin || !multiCityLegs[multiCityLegs.length - 1].destination) {
        setValidationError('Please select both From and To airports for multi-city legs.');
        return;
      }
      onExecuteSearch({
        ...searchParams,
        origin: firstLeg.origin,
        destination: multiCityLegs[multiCityLegs.length - 1].destination,
        date: firstLeg.date
      });
    } else {
      if (!searchParams.origin || searchParams.origin.trim() === '' || !searchParams.destination || searchParams.destination.trim() === '') {
        setValidationError('Please select both From and To airports before searching.');
        return;
      }

      if (searchParams.origin === searchParams.destination) {
        setValidationError('From and To airports cannot be the same.');
        return;
      }

      onExecuteSearch(searchParams);
    }
    
    setTimeout(() => {
      document.getElementById('right-side-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="glass-panel" style={{ 
      padding: '30px', 
      background: '#ffffff', 
      border: '1px solid #e2e8f0', 
      borderRadius: '20px', 
      boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)' 
    }}>
      
      {/* Search Header (Always Expanded - No Minimize Button) */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        marginBottom: '22px', 
        borderBottom: '1px solid #f1f5f9', 
        paddingBottom: '14px' 
      }}>
        <div style={{ 
          width: '36px', 
          height: '36px', 
          borderRadius: '10px', 
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', 
          color: '#ffffff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)'
        }}>
          <Plane size={19} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.3px', margin: 0 }}>
            Search {productType}
          </h3>
        </div>
      </div>

      {/* Form Body */}
      <div>
        {/* 1. Category Tab Switcher (Flights | Travel Packages | Hotels | Cars) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', background: '#f8fafc', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '22px' }}>
          {[
            { name: 'Flights', icon: <Plane size={15} /> },
            { name: 'Travel Packages', icon: <Hotel size={15} /> },
            { name: 'Hotels', icon: <Hotel size={15} /> },
            { name: 'Cars', icon: <Car size={15} /> }
          ].map((prod) => {
            const isActive = productType === prod.name;
            return (
              <button
                key={prod.name}
                onClick={() => {
                  setValidationError(null);
                  onProductTypeChange(prod.name);
                }}
                style={{
                  background: isActive ? '#0f172a' : 'transparent',
                  color: isActive ? '#ffffff' : '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  height: '40px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none'
                }}
              >
                {prod.icon}
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.name}</span>
              </button>
            );
          })}
        </div>

        {/* Validation Alert Box */}
        {validationError && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '10px 14px', borderRadius: '10px', marginBottom: '18px', fontSize: '0.82rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}

        {/* 2. Trip Type Selector for Flights */}
        {productType === 'Flights' && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'inline-flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              {['Round Trip', 'One Way', 'Multi-City'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setValidationError(null);
                    onSearchChange({ ...searchParams, tripType: type });
                  }}
                  style={{
                    background: searchParams.tripType === type ? '#0284c7' : 'transparent',
                    color: searchParams.tripType === type ? '#ffffff' : '#475569',
                    border: 'none',
                    padding: '5px 14px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Spaced Search Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Origin (From) */}
          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
              <Plane size={14} color="#0284c7" /> From
            </label>
            <select
              className="custom-select"
              style={{ height: '46px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
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

          {/* Simple Directional Arrow Between From and To */}
          {productType === 'Flights' && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '-4px 0' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: '#f1f5f9', 
                border: '1px solid #cbd5e1', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#0284c7'
              }}>
                <ArrowRight size={16} style={{ transform: 'rotate(90deg)' }} />
              </div>
            </div>
          )}

          {/* Destination (To) */}
          {productType !== 'Hotels' && productType !== 'Cars' && (
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                <MapPin size={14} color="#0284c7" /> To
              </label>
              <select
                className="custom-select"
                style={{ height: '46px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
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

          {/* UNIFIED TRAVEL DATES SELECTOR COMPONENT */}
          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
              Travel Dates
            </label>
            <UnifiedDatePicker
              departureDate={searchParams.date}
              returnDate={searchParams.returnDate}
              isRoundTrip={searchParams.tripType === 'Round Trip' || productType !== 'Flights'}
              onDatesChange={(dep, ret) => {
                onSearchChange({
                  ...searchParams,
                  date: dep,
                  returnDate: ret
                });
              }}
            />
          </div>

          {/* Passengers & Cabin Class Grid Row */}
          <div style={{ display: 'grid', gridTemplateColumns: productType === 'Flights' ? '1fr 1fr' : '1fr', gap: '12px' }}>
            
            {/* Passengers */}
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                <Users size={14} color="#0284c7" /> Passengers
              </label>
              <select
                className="custom-select"
                style={{ height: '44px' }}
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
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                  <Briefcase size={14} color="#0284c7" /> Cabin Class
                </label>
                <select
                  className="custom-select"
                  style={{ height: '44px' }}
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
          </div>

          {/* High Priority Search CTA Button */}
          <button
            onClick={handleSearchClick}
            style={{
              width: '100%',
              height: '50px',
              marginTop: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.98rem',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
          >
            <Search size={18} />
            <span>Search {productType}</span>
          </button>

        </div>
      </div>

    </div>
  );
}
