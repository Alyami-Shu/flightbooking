import React from 'react';
import { SlidersHorizontal, ArrowUpDown, RotateCcw } from 'lucide-react';

export default function FlightFilter({ filters, onFilterChange, onResetFilters, flightCount, currencySymbol, maxPriceLimit }) {
  return (
    <div className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '24px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
          <SlidersHorizontal size={18} color="var(--primary-cyan)" />
          Filters & Sort
        </h3>
        <button
          onClick={onResetFilters}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-sub)',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Sort By */}
      <div className="input-group" style={{ marginBottom: '24px' }}>
        <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowUpDown size={14} /> Sort By
        </label>
        <select
          className="custom-select"
          value={filters.sort_by}
          onChange={(e) => onFilterChange({ ...filters, sort_by: e.target.value })}
        >
          <option value="price_asc">Price: Lowest First</option>
          <option value="price_desc">Price: Highest First</option>
          <option value="duration">Fastest Duration</option>
          <option value="departure">Departure Time (Earliest)</option>
        </select>
      </div>

      {/* Stops */}
      <div style={{ marginBottom: '24px' }}>
        <label className="input-label" style={{ marginBottom: '10px', display: 'block' }}>
          Stops / Layovers
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { label: 'All Flights', value: 'all' },
            { label: '1 Stop', value: 1 },
            { label: '2 Stops', value: 2 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onFilterChange({ ...filters, stops: item.value })}
              style={{
                background: filters.stops === item.value ? 'rgba(2, 132, 199, 0.1)' : '#f8fafc',
                border: filters.stops === item.value ? '1px solid var(--primary-cyan)' : '1px solid #cbd5e1',
                color: filters.stops === item.value ? 'var(--primary-cyan)' : 'var(--text-sub)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Max Price Slider */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label className="input-label">Max Price</label>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', fontWeight: '800' }}>
            {currencySymbol}{filters.max_price || maxPriceLimit}
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={maxPriceLimit || 6000}
          step={50}
          value={filters.max_price || maxPriceLimit}
          onChange={(e) => onFilterChange({ ...filters, max_price: parseFloat(e.target.value) })}
          style={{
            width: '100%',
            accentColor: 'var(--primary-cyan)',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Airlines Filter */}
      <div>
        <label className="input-label" style={{ marginBottom: '10px', display: 'block' }}>
          Preferred Airlines
        </label>
        <select
          className="custom-select"
          value={filters.airline}
          onChange={(e) => onFilterChange({ ...filters, airline: e.target.value })}
        >
          <option value="all">All Airlines</option>
          <option value="Delta">Delta Air Lines</option>
          <option value="Emirates">Emirates</option>
          <option value="Qatar Airways">Qatar Airways</option>
          <option value="Air India">Air India</option>
          <option value="British Airways">British Airways</option>
          <option value="Lufthansa">Lufthansa</option>
          <option value="Air France">Air France</option>
          <option value="Singapore Airlines">Singapore Airlines</option>
          <option value="Turkish Airlines">Turkish Airlines</option>
          <option value="Cathay Pacific">Cathay Pacific</option>
        </select>
      </div>

      {/* Summary count */}
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Showing <strong>{flightCount}</strong> matching flights
      </div>

    </div>
  );
}
