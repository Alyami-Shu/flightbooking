# Implementation Plan - AirwAy Unified Date Picker & Search Layout Enhancement

Enhance the **AirwAy Flight Booking Application** frontend with a custom unified airline-style date range calendar picker, expanded search widget layout, and restored harmonious AirwAy color palette.

## User Review Required

> [!IMPORTANT]
> - **Frontend Only**: All changes are strictly isolated to React UI components and CSS styling.
> - **Zero Backend / Database Impact**: FastAPI backend (`backend/main.py`), SQLite (`airway.db`), and data models remain 100% untouched.
> - **Functional Preservation**: All flight search endpoints, seat picker modals, boarding pass generator, and My Active Bookings dashboard remain fully intact.

---

## Proposed Changes

### 1. Unified Travel Dates Selection Component (`UnifiedDatePicker.jsx`)

#### [NEW] [UnifiedDatePicker.jsx](file:///c:/Users/salya/Desktop/Flight%20Booking/frontend/src/components/UnifiedDatePicker.jsx)
- **Single Calendar Popup Interface**: Clicking the "Travel Dates" field opens one unified popover modal containing both Departure and Return selection controls.
- **Top Summary Header**: Displays Departure date (Left) and Return date (Right) with live status tags ("Select Departure", "Select Return").
- **Interactive Calendar Grid**:
  - Month navigation (Previous / Next month).
  - 1st Click -> Sets Departure date.
  - 2nd Click -> Sets Return date (if after Departure; resets if earlier).
  - Hover preview over potential return dates.
  - Range Highlight: Soft premium cyan background tint (`rgba(2, 132, 199, 0.12)`) across all dates between Departure and Return.
- **Formatted Input Display**: Displays concise formatted date range string upon selection (e.g., `"Aug 10 → Aug 18"`).

---

### 2. Search Flights Layout Expansion (`FlightSearch.jsx`, `App.jsx`)

#### [MODIFY] [App.jsx](file:///c:/Users/salya/Desktop/Flight%20Booking/frontend/src/App.jsx)
- Expand left column width from `minmax(340px, 380px)` to **`minmax(420px, 460px)`** for a spacious, non-cramped layout.

#### [MODIFY] [FlightSearch.jsx](file:///c:/Users/salya/Desktop/Flight%20Booking/frontend/src/components/FlightSearch.jsx)
- Integrate `<UnifiedDatePicker />` into the search form.
- Increase input field padding (`14px 18px`), vertical gap (`18px`), and label margins for clean alignment and zero crowding.

---

### 3. Restore Harmonious AirwAy Color Scheme (`index.css`, `App.jsx`, `ConfidenceGuarantee.jsx`)

#### [MODIFY] [index.css](file:///c:/Users/salya/Desktop/Flight%20Booking/frontend/src/index.css)
#### [MODIFY] [App.jsx](file:///c:/Users/salya/Desktop/Flight%20Booking/frontend/src/App.jsx)
#### [MODIFY] [ConfidenceGuarantee.jsx](file:///c:/Users/salya/Desktop/Flight%20Booking/frontend/src/components/ConfidenceGuarantee.jsx)
- Revert background overlays and card backgrounds back to AirwAy's signature crisp, luminous light palette (`#ffffff`, `#f8fafc`) with deep navy text (`#0f172a`) and electric cyan accents (`#0284c7`).
- Retain high-contrast dark accents in My Active Bookings while restoring clean visual harmony throughout the dashboard.

---

## Verification Plan

### Automated Build Verification
- Run `cmd /c "cd /d c:\Users\salya\Desktop\Flight Booking\frontend && npm run build"` to verify 0 JSX/Vite compilation errors.

### Manual Verification
1. **Unified Date Picker**: Click "Travel Dates", select Departure date then Return date, verify range highlight and formatted text (`"Aug 10 → Aug 18"`).
2. **Search Widget Width**: Verify From, To, Travel Dates, Passengers, Cabin Class, and Search button render in a wide, non-cramped panel.
3. **Color Harmony**: Confirm clean AirwAy light theme palette with cyan accents.
4. **Flight Search & Booking**: Execute search for MAA → ATL, confirm flight card selection, seat picker, boarding pass, and PNR creation.
