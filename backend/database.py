import sqlite3
import os
import json

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "airway.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Create Flights Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS flights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        flight_number TEXT NOT NULL,
        airline TEXT NOT NULL,
        airline_code TEXT NOT NULL,
        origin TEXT NOT NULL,
        origin_code TEXT NOT NULL,
        destination TEXT NOT NULL,
        destination_code TEXT NOT NULL,
        departure_time TEXT NOT NULL,
        arrival_time TEXT NOT NULL,
        duration TEXT NOT NULL,
        stops INTEGER NOT NULL,
        stop_details TEXT NOT NULL,
        price_economy REAL NOT NULL,
        price_premium REAL NOT NULL,
        price_business REAL NOT NULL,
        price_first REAL NOT NULL,
        available_seats INTEGER NOT NULL,
        baggage TEXT NOT NULL,
        amenities TEXT NOT NULL,
        aircraft TEXT NOT NULL
    );
    """)

    # Create Bookings Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pnr_code TEXT UNIQUE NOT NULL,
        flight_id INTEGER NOT NULL,
        passenger_name TEXT NOT NULL,
        passenger_email TEXT NOT NULL,
        passenger_phone TEXT NOT NULL,
        cabin_class TEXT NOT NULL,
        seat_number TEXT NOT NULL,
        ticket_price REAL NOT NULL,
        booking_date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'CONFIRMED',
        FOREIGN KEY (flight_id) REFERENCES flights (id)
    );
    """)

    conn.commit()
    seed_data(conn)
    conn.close()

def seed_data(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM flights")
    count = cursor.fetchone()[0]
    
    if count == 0:
        sample_flights = [
            # 10 MAA to ATL flights with different airlines
            (
                "DL-8741", "Delta Air Lines", "DL",
                "Chennai", "MAA", "Atlanta", "ATL",
                "04:15", "16:00 (+1d)", "19h 45m", 1, "Dubai (DXB)",
                850.0, 1250.0, 2400.0, 4100.0, 14, "2 x 23 kg",
                json.dumps(["Wi-Fi", "Power Outlets", "Gourmet Meals", "Live TV", "In-Flight USB"]),
                "Boeing 777-300ER"
            ),
            (
                "EK-543", "Emirates", "EK",
                "Chennai", "MAA", "Atlanta", "ATL",
                "09:45", "21:55 (+1d)", "20h 10m", 1, "Dubai (DXB)",
                920.0, 1380.0, 2750.0, 4900.0, 8, "2 x 23 kg",
                json.dumps(["High-Speed Wi-Fi", "Ice Entertainment", "Multi-course Dining", "Private Suites", "Onboard Bar"]),
                "Airbus A380-800"
            ),
            (
                "QR-529", "Qatar Airways", "QR",
                "Chennai", "MAA", "Atlanta", "ATL",
                "03:20", "16:35 (+1d)", "21h 15m", 1, "Doha (DOH)",
                890.0, 1310.0, 2600.0, 4650.0, 22, "2 x 23 kg",
                json.dumps(["Oryx One IFE", "Qsuite Business", "À la Carte Dining", "Type-C Charging"]),
                "Boeing 777-200LR"
            ),
            (
                "AI-103", "Air India", "AI",
                "Chennai", "MAA", "Atlanta", "ATL",
                "01:30", "16:00 (+1d)", "22h 30m", 1, "New Delhi (DEL)",
                780.0, 1120.0, 2100.0, 3800.0, 19, "2 x 23 kg",
                json.dumps(["Indian & Continental Cuisine", "In-flight Movies", "AC Power Ports"]),
                "Boeing 787-9 Dreamliner"
            ),
            (
                "BA-036", "British Airways", "BA",
                "Chennai", "MAA", "Atlanta", "ATL",
                "05:50", "19:40 (+1d)", "21h 50m", 1, "London (LHR)",
                950.0, 1420.0, 2890.0, 5100.0, 11, "2 x 23 kg",
                json.dumps(["Wi-Fi", "Afternoon Tea", "Noise Cancelling Headphones", "Club Suite"]),
                "Airbus A350-1000"
            ),
            (
                "LH-759", "Lufthansa", "LH",
                "Chennai", "MAA", "Atlanta", "ATL",
                "01:50", "15:55 (+1d)", "22h 05m", 1, "Frankfurt (FRA)",
                910.0, 1350.0, 2680.0, 4800.0, 16, "2 x 23 kg",
                json.dumps(["FlyNet Internet", "German Beers & Wines", "Ergonomic Seats", "Kids Audio"]),
                "Boeing 747-8 Intercontinental"
            ),
            (
                "AF-547", "Air France", "AF",
                "Chennai", "MAA", "Atlanta", "ATL",
                "02:10", "16:50 (+1d)", "22h 40m", 1, "Paris (CDG)",
                895.0, 1320.0, 2590.0, 4750.0, 25, "2 x 23 kg",
                json.dumps(["French Fine Dining", "Sommelier Wine List", "HD 4K Screens", "Wi-Fi"]),
                "Airbus A350-900"
            ),
            (
                "SQ-528", "Singapore Airlines", "SQ",
                "Chennai", "MAA", "Atlanta", "ATL",
                "23:15", "17:30 (+2d)", "26h 15m", 2, "Singapore (SIN) & Frankfurt (FRA)",
                1100.0, 1650.0, 3200.0, 5800.0, 6, "2 x 25 kg",
                json.dumps(["KrisWorld 1,800+ Movies", "Book The Cook Dining", "Luxury Comfort Kit"]),
                "Boeing 777-300ER"
            ),
            (
                "TK-705", "Turkish Airlines", "TK",
                "Chennai", "MAA", "Atlanta", "ATL",
                "10:30", "21:40 (+1d)", "23h 10m", 1, "Istanbul (IST)",
                830.0, 1210.0, 2350.0, 4200.0, 30, "2 x 23 kg",
                json.dumps(["Onboard Flying Chef", "Turkish Meze", "Live TV", "Noise Cancelling Headsets"]),
                "Airbus A350-900"
            ),
            (
                "CX-632", "Cathay Pacific", "CX",
                "Chennai", "MAA", "Atlanta", "ATL",
                "02:40", "14:10 (+1d)", "27h 30m", 2, "Hong Kong (HKG) & Los Angeles (LAX)",
                1050.0, 1550.0, 3050.0, 5400.0, 12, "2 x 23 kg",
                json.dumps(["Asian & International Flavors", "Wide Screen Entertainment", "Universal Chargers"]),
                "Airbus A350-1000"
            ),
            # Return route ATL to MAA for full booking experience
            (
                "DL-8742", "Delta Air Lines", "DL",
                "Atlanta", "ATL", "Chennai", "MAA",
                "18:30", "02:15 (+2d)", "20h 15m", 1, "Dubai (DXB)",
                870.0, 1280.0, 2450.0, 4200.0, 18, "2 x 23 kg",
                json.dumps(["Wi-Fi", "Power Outlets", "Gourmet Meals", "Live TV"]),
                "Boeing 777-300ER"
            ),
            (
                "EK-544", "Emirates", "EK",
                "Atlanta", "ATL", "Chennai", "MAA",
                "22:10", "07:30 (+2d)", "21h 50m", 1, "Dubai (DXB)",
                940.0, 1400.0, 2800.0, 5000.0, 15, "2 x 23 kg",
                json.dumps(["High-Speed Wi-Fi", "Ice Entertainment", "Multi-course Dining"]),
                "Airbus A380-800"
            )
        ]

        cursor.executemany("""
        INSERT INTO flights (
            flight_number, airline, airline_code, origin, origin_code, destination, destination_code,
            departure_time, arrival_time, duration, stops, stop_details, price_economy, price_premium,
            price_business, price_first, available_seats, baggage, amenities, aircraft
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, sample_flights)
        conn.commit()
