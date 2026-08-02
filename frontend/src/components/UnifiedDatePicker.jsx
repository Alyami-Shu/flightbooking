import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, ArrowRight } from 'lucide-react';

export default function UnifiedDatePicker({ 
  departureDate, 
  returnDate, 
  onDatesChange,
  isRoundTrip = true
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    return departureDate ? new Date(departureDate) : new Date();
  });
  
  const [tempDeparture, setTempDeparture] = useState(departureDate || '');
  const [tempReturn, setTempReturn] = useState(returnDate || '');
  const [hoverDate, setHoverDate] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    setTempDeparture(departureDate || '');
    setTempReturn(returnDate || '');
  }, [departureDate, returnDate]);

  // Close calendar popover on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const formatDateStr = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const formatDisplayLabel = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return dateStr;
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDateClick = (dateStr) => {
    // Single Click or No Departure yet -> Set Departure Date
    if (!tempDeparture || (tempDeparture && tempReturn)) {
      setTempDeparture(dateStr);
      setTempReturn('');
      onDatesChange(dateStr, '');
      if (!isRoundTrip) {
        setIsOpen(false);
      }
    } else {
      // 2nd Click -> Set Return Date (if >= departure)
      if (new Date(dateStr) < new Date(tempDeparture)) {
        setTempDeparture(dateStr);
        setTempReturn('');
        onDatesChange(dateStr, '');
      } else {
        setTempReturn(dateStr);
        onDatesChange(tempDeparture, dateStr);
        setIsOpen(false);
      }
    }
  };

  const isInRange = (dateStr) => {
    if (!tempDeparture) return false;
    const target = new Date(dateStr).getTime();
    const start = new Date(tempDeparture).getTime();
    
    if (tempReturn) {
      const end = new Date(tempReturn).getTime();
      return target >= start && target <= end;
    }
    
    if (hoverDate && target >= start) {
      const hoverTime = new Date(hoverDate).getTime();
      return target >= start && target <= hoverTime;
    }
    
    return false;
  };

  const getDisplayText = () => {
    if (!tempDeparture) return 'Select Travel Dates';
    const depFormatted = formatDisplayLabel(tempDeparture);
    if (!isRoundTrip) return depFormatted;
    if (!tempReturn) return `${depFormatted} → Select Return`;
    const retFormatted = formatDisplayLabel(tempReturn);
    return `${depFormatted} → ${retFormatted}`;
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      
      {/* Selector Input Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          height: '46px',
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '10px',
          padding: '0 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} color="#0284c7" />
          <span style={{ fontSize: '0.88rem', fontWeight: '700', color: tempDeparture ? '#0f172a' : '#64748b' }}>
            {getDisplayText()}
          </span>
        </div>
        <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0284c7', padding: '3px 8px', borderRadius: '6px', fontWeight: '800' }}>
          {isRoundTrip ? 'Round Trip' : 'One Way'}
        </span>
      </button>

      {/* Single Unified Calendar Popover */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          zIndex: 150,
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.18)',
          width: '340px'
        }}>
          
          {/* Top Summary Bar: Left Departure / Right Return */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '10px', 
            background: '#f8fafc', 
            padding: '10px 12px', 
            borderRadius: '10px', 
            border: '1px solid #e2e8f0', 
            marginBottom: '16px' 
          }}>
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>DEPARTURE</span>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: tempDeparture ? '#0284c7' : '#94a3b8', marginTop: '2px' }}>
                {tempDeparture ? formatDisplayLabel(tempDeparture) : 'Select date'}
              </div>
            </div>

            {isRoundTrip && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>RETURN</span>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: tempReturn ? '#0284c7' : '#94a3b8', marginTop: '2px' }}>
                  {tempReturn ? formatDisplayLabel(tempReturn) : 'Select date'}
                </div>
              </div>
            )}
          </div>

          {/* Month Navigation Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <button type="button" onClick={prevMonth} style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={16} color="#0f172a" />
            </button>

            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
              {monthNames[month]} {year}
            </span>

            <button type="button" onClick={nextMonth} style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={16} color="#0f172a" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '8px', textAlign: 'center' }}>
            {daysOfWeek.map((day) => (
              <span key={day} style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94a3b8' }}>
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {/* Empty slots for month start */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} />
            ))}

            {/* Calendar Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = formatDateStr(year, month, dayNum);
              
              const isDeparture = tempDeparture === dateStr;
              const isReturn = tempReturn === dateStr;
              const inRange = isInRange(dateStr);
              
              const today = formatDateStr(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
              const isPast = dateStr < today;

              return (
                <button
                  key={dayNum}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleDateClick(dateStr)}
                  onMouseEnter={() => setHoverDate(dateStr)}
                  style={{
                    height: '34px',
                    border: 'none',
                    borderRadius: isDeparture || isReturn ? '8px' : '4px',
                    background: isDeparture || isReturn
                      ? '#0284c7'
                      : inRange
                      ? 'rgba(2, 132, 199, 0.14)'
                      : 'transparent',
                    color: isDeparture || isReturn
                      ? '#ffffff'
                      : isPast
                      ? '#cbd5e1'
                      : '#0f172a',
                    fontWeight: isDeparture || isReturn ? '900' : inRange ? '700' : '600',
                    fontSize: '0.8rem',
                    cursor: isPast ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Footer Done Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Done
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
