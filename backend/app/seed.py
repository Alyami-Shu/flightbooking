import sys
import os

# Ensure backend root is on sys.path if script is executed directly
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

try:
    from app.database import init_db
except ImportError:
    from database import init_db

def seed():
    print("Initializing and seeding AirwAy database...")
    init_db()
    print("Database successfully initialized and seeded.")

if __name__ == "__main__":
    seed()
