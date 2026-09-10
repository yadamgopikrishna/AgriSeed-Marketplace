import sys
import os

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from config import Config
from database import DatabaseManager
from seed_data import seed_database
from app import app

def main():
    print("""
    ========================================================================
     🌾 AGRISEED – ONLINE AGRICULTURAL MARKETPLACE (COLLEGE PROTOTYPE) 🌾
    ========================================================================
     Tagline: "Quality Seeds. Better Crops. Better Future."
     Stack:   Python Flask | MongoDB | REST API | HTML5 / CSS3 / JavaScript
    ========================================================================
    """)
    
    # Initialize DB
    db = DatabaseManager.get_db()
    seed_database(db)
    
    is_live = DatabaseManager.is_live_mongo()
    print(f" [*] Database Status: {'Connected to Live MongoDB' if is_live else 'Using Embedded Mongo Mock with JSON persistence'}")
    print(f" [*] Local Server URL: http://127.0.0.1:{Config.PORT}")
    print(f" [*] Farmer Demo Login: farmer@agriseed.in (password: farmer123)")
    print(f" [*] Admin Demo Login:  admin@agriseed.in (password: admin123)")
    print("========================================================================\n")
    
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)

if __name__ == '__main__':
    main()
