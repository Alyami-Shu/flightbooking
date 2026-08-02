const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchAirports() {
  try {
    const res = await fetch(`${API_BASE_URL}/airports`);
    if (!res.ok) throw new Error('Failed to fetch airports');
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    return [];
  }
}

export async function searchFlights(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.origin) query.append('origin', params.origin);
    if (params.destination) query.append('destination', params.destination);
    if (params.cabin_class) query.append('cabin_class', params.cabin_class);
    if (params.max_price) query.append('max_price', params.max_price);
    if (params.stops !== undefined && params.stops !== 'all') query.append('stops', params.stops);
    if (params.airline && params.airline !== 'all') query.append('airline', params.airline);
    if (params.sort_by) query.append('sort_by', params.sort_by);

    const res = await fetch(`${API_BASE_URL}/flights?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch flights');
    return await res.json();
  } catch (err) {
    console.error('API Search Error:', err);
    return [];
  }
}

export async function bookFlight(bookingData) {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Booking failed');
  }
  
  return await res.json();
}

export async function lookupBooking(pnrOrEmail) {
  const res = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(pnrOrEmail)}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'No booking found');
  }
  return await res.json();
}
