from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
import json
import random
import string
from datetime import datetime

from app.database import get_db, init_db

app = FastAPI(title="AirwAy API", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

# Pydantic Schemas
class BookingRequest(BaseModel):
    flight_id: int
    passenger_name: str
    passenger_email: str
    passenger_phone: str
    cabin_class: str = "Economy"
    seat_number: Optional[str] = None
    origin: Optional[str] = None
    origin_code: Optional[str] = None
    destination: Optional[str] = None
    destination_code: Optional[str] = None
    departure_time: Optional[str] = None
    arrival_time: Optional[str] = None
    airline: Optional[str] = None
    airline_code: Optional[str] = None
    flight_number: Optional[str] = None

def generate_pnr():
    chars = string.ascii_uppercase + string.digits
    return "AW-" + ''.join(random.choices(chars, k=6))

AIRPORT_CITY_MAP = {
    "MAA": "Chennai",
    "ATL": "Atlanta",
    "DXB": "Dubai",
    "DOH": "Doha",
    "LHR": "London",
    "FRA": "Frankfurt",
    "CDG": "Paris",
    "SIN": "Singapore",
    "JFK": "New York",
    "LAX": "Los Angeles"
}

AIRLINES_LIST = [
    {"name": "Delta Air Lines", "code": "DL", "flight_num": "DL-8741", "stops": 1, "via": "Dubai (DXB)", "duration": "19h 45m", "dep": "04:15", "arr": "16:00 (+1d)", "price": 850.0, "aircraft": "Boeing 777-300ER", "rating": 4.7},
    {"name": "Emirates", "code": "EK", "flight_num": "EK-543", "stops": 1, "via": "Dubai (DXB)", "duration": "20h 10m", "dep": "09:45", "arr": "21:55 (+1d)", "price": 920.0, "aircraft": "Airbus A380-800", "rating": 4.9},
    {"name": "Qatar Airways", "code": "QR", "flight_num": "QR-529", "stops": 1, "via": "Doha (DOH)", "duration": "21h 15m", "dep": "03:20", "arr": "16:35 (+1d)", "price": 890.0, "aircraft": "Boeing 777-200LR", "rating": 4.9},
    {"name": "Air India", "code": "AI", "flight_num": "AI-103", "stops": 1, "via": "New Delhi (DEL)", "duration": "22h 30m", "dep": "01:30", "arr": "16:00 (+1d)", "price": 780.0, "aircraft": "Boeing 787-9 Dreamliner", "rating": 4.4},
    {"name": "British Airways", "code": "BA", "flight_num": "BA-036", "stops": 1, "via": "London (LHR)", "duration": "21h 50m", "dep": "05:50", "arr": "19:40 (+1d)", "price": 950.0, "aircraft": "Airbus A350-1000", "rating": 4.6},
    {"name": "Lufthansa", "code": "LH", "flight_num": "LH-759", "stops": 1, "via": "Frankfurt (FRA)", "duration": "22h 05m", "dep": "01:50", "arr": "15:55 (+1d)", "price": 910.0, "aircraft": "Boeing 747-8 Intercontinental", "rating": 4.7},
    {"name": "Air France", "code": "AF", "flight_num": "AF-547", "stops": 1, "via": "Paris (CDG)", "duration": "22h 40m", "dep": "02:10", "arr": "16:50 (+1d)", "price": 895.0, "aircraft": "Airbus A350-900", "rating": 4.6},
    {"name": "Singapore Airlines", "code": "SQ", "flight_num": "SQ-528", "stops": 2, "via": "Singapore (SIN) & Frankfurt (FRA)", "duration": "26h 15m", "dep": "23:15", "arr": "17:30 (+2d)", "price": 1100.0, "aircraft": "Boeing 777-300ER", "rating": 4.9},
    {"name": "Turkish Airlines", "code": "TK", "flight_num": "TK-705", "stops": 1, "via": "Istanbul (IST)", "duration": "23h 10m", "dep": "10:30", "arr": "21:40 (+1d)", "price": 830.0, "aircraft": "Airbus A350-900", "rating": 4.8},
    {"name": "Cathay Pacific", "code": "CX", "flight_num": "CX-632", "stops": 2, "via": "Hong Kong (HKG) & Los Angeles (LAX)", "duration": "27h 30m", "dep": "02:40", "arr": "14:10 (+1d)", "price": 1050.0, "aircraft": "Airbus A350-1000", "rating": 4.7}
]

def generate_10_flights_for_route(origin_code, destination_code):
    origin_city = AIRPORT_CITY_MAP.get(origin_code, origin_code)
    destination_city = AIRPORT_CITY_MAP.get(destination_code, destination_code)
    
    flights_data = []
    base_id_hash = abs(hash(f"{origin_code}_{destination_code}")) % 10000 + 100
    
    for idx, a in enumerate(AIRLINES_LIST):
        flight_id = base_id_hash + idx
        price_econ = round(a["price"] * (0.9 + (idx % 3) * 0.08), 2)
        price_prem = round(price_econ * 1.5, 2)
        price_bus = round(price_econ * 2.8, 2)
        price_first = round(price_econ * 4.8, 2)
        
        flights_data.append({
            "id": flight_id,
            "flight_number": f"{a['code']}-{random.randint(100, 999)}",
            "airline": a["name"],
            "airline_code": a["code"],
            "origin": origin_city,
            "origin_code": origin_code,
            "destination": destination_city,
            "destination_code": destination_code,
            "departure_time": a["dep"],
            "arrival_time": a["arr"],
            "duration": a["duration"],
            "stops": a["stops"],
            "stop_details": a["via"],
            "price_economy": price_econ,
            "price_premium": price_prem,
            "price_business": price_bus,
            "price_first": price_first,
            "available_seats": 12 + (idx * 3) % 20,
            "baggage": "2 x 23 kg",
            "amenities": ["Wi-Fi", "In-flight Entertainment", "Gourmet Meals", "USB Outlets"],
            "aircraft": a["aircraft"],
            "rating": a["rating"]
        })
        
    return flights_data

@app.get("/")
def read_root():
    return {"message": "Welcome to AirwAy Flight Booking API", "status": "online"}

@app.get("/api/airports")
def get_airports():
    return [
        {"code": "MAA", "city": "Chennai", "country": "India", "name": "Chennai International Airport"},
        {"code": "ATL", "city": "Atlanta", "country": "United States", "name": "Hartsfield-Jackson Atlanta International Airport"},
        {"code": "DXB", "city": "Dubai", "country": "UAE", "name": "Dubai International Airport"},
        {"code": "DOH", "city": "Doha", "country": "Qatar", "name": "Hamad International Airport"},
        {"code": "LHR", "city": "London", "country": "United Kingdom", "name": "London Heathrow Airport"},
        {"code": "FRA", "city": "Frankfurt", "country": "Germany", "name": "Frankfurt Airport"},
        {"code": "CDG", "city": "Paris", "country": "France", "name": "Charles de Gaulle Airport"},
        {"code": "SIN", "city": "Singapore", "country": "Singapore", "name": "Changi Airport"},
        {"code": "JFK", "city": "New York", "country": "United States", "name": "John F. Kennedy International Airport"},
        {"code": "LAX", "city": "Los Angeles", "country": "United States", "name": "Los Angeles International Airport"}
    ]

@app.get("/api/flights")
def search_flights(
    origin: Optional[str] = Query(None),
    destination: Optional[str] = Query(None),
    cabin_class: str = Query("Economy"),
    max_price: Optional[float] = None,
    stops: Optional[int] = None,
    airline: Optional[str] = None,
    sort_by: str = Query("price_asc")
):
    # Require BOTH origin and destination to return results
    if not origin or not destination or origin.strip() == "" or destination.strip() == "":
        return []

    orig_clean = origin.upper().strip()
    dest_clean = destination.upper().strip()

    # Generate 10 dynamic flight records for this specific route
    flight_list = generate_10_flights_for_route(orig_clean, dest_clean)

    # Apply filters
    filtered = []
    for item in flight_list:
        if stops is not None and stops >= 0 and item["stops"] != stops:
            continue
            
        if airline and airline != "all" and airline.lower() not in item["airline"].lower():
            continue

        # Class specific price
        class_key = f"price_{cabin_class.lower()}"
        item["active_price"] = item.get(class_key, item["price_economy"])
        
        if max_price and item["active_price"] > max_price:
            continue

        filtered.append(item)

    # Sorting
    if sort_by == "price_asc":
        filtered.sort(key=lambda x: x["active_price"])
    elif sort_by == "price_desc":
        filtered.sort(key=lambda x: x["active_price"], reverse=True)
    elif sort_by == "duration":
        filtered.sort(key=lambda x: x["duration"])

    return filtered

@app.get("/api/flights/{flight_id}")
def get_flight_details(flight_id: int):
    # Fallback lookup
    for a in AIRLINES_LIST:
        return {
            "id": flight_id,
            "flight_number": a["flight_num"],
            "airline": a["name"],
            "airline_code": a["code"],
            "origin": "Origin Airport",
            "origin_code": "ORG",
            "destination": "Destination Airport",
            "destination_code": "DST",
            "departure_time": a["dep"],
            "arrival_time": a["arr"],
            "duration": a["duration"],
            "stops": a["stops"],
            "stop_details": a["via"],
            "price_economy": a["price"],
            "price_premium": a["price"] * 1.5,
            "price_business": a["price"] * 2.8,
            "price_first": a["price"] * 4.8,
            "available_seats": 14,
            "baggage": "2 x 23 kg",
            "amenities": ["Wi-Fi", "In-flight Entertainment", "Gourmet Meals"],
            "aircraft": a["aircraft"],
            "rating": a["rating"]
        }
    raise HTTPException(status_code=404, detail="Flight not found")

@app.post("/api/bookings")
def create_booking(req: BookingRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    pnr = generate_pnr()
    booking_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ticket_price = 850.0
    seat = req.seat_number or "18A"

    orig_code = req.origin_code or "ATL"
    orig_name = req.origin or AIRPORT_CITY_MAP.get(orig_code, "Atlanta")
    dest_code = req.destination_code or "DXB"
    dest_name = req.destination or AIRPORT_CITY_MAP.get(dest_code, "Dubai")
    dep_t = req.departure_time or "08:00"
    arr_t = req.arrival_time or "20:00"
    air_name = req.airline or "AirwAy Partner Airline"
    air_code = req.airline_code or "AW"
    flt_num = req.flight_number or "AW-101"

    cursor.execute("""
    INSERT INTO bookings (
        pnr_code, flight_id, passenger_name, passenger_email, passenger_phone,
        cabin_class, seat_number, ticket_price, booking_date, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')
    """, (
        pnr, req.flight_id, req.passenger_name, req.passenger_email, req.passenger_phone,
        req.cabin_class, seat, ticket_price, booking_date
    ))
    
    conn.commit()
    booking_id = cursor.lastrowid
    conn.close()
    
    return {
        "message": "Flight booked successfully!",
        "pnr_code": pnr,
        "booking_id": booking_id,
        "passenger_name": req.passenger_name,
        "passenger_email": req.passenger_email,
        "flight_number": flt_num,
        "airline": air_name,
        "airline_code": air_code,
        "origin": orig_name,
        "origin_code": orig_code,
        "destination": dest_name,
        "destination_code": dest_code,
        "departure_time": dep_t,
        "arrival_time": arr_t,
        "cabin_class": req.cabin_class,
        "seat_number": seat,
        "ticket_price": ticket_price,
        "booking_date": booking_date,
        "status": "CONFIRMED"
    }

@app.get("/api/bookings/{query_param}")
def get_booking(query_param: str):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT b.*
    FROM bookings b
    WHERE b.pnr_code = ? OR b.passenger_email = ?
    ORDER BY b.id DESC
    """, (query_param.upper(), query_param))
    
    rows = cursor.fetchall()
    conn.close()
    
    if not rows:
        raise HTTPException(status_code=404, detail="No booking found for this PNR code or email")
        
    return [dict(r) for r in rows]
