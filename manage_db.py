import sys
import os
import json
from config import Config
from database import DatabaseManager
from seed_data import seed_database, SAMPLE_PRODUCTS, SAMPLE_SELLERS, SAMPLE_USERS, SAMPLE_REVIEWS, SAMPLE_ORDERS

# Configure UTF-8 on Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

def print_header(title):
    print("\n" + "=" * 60)
    print(f" 🌾 AgriSeed Database Manager: {title}")
    print("=" * 60)

def show_stats(db):
    print_header("Database Overview & Record Counts")
    is_live = DatabaseManager.is_live_mongo()
    print(f" [*] Active Engine: {'Live MongoDB (Local/Atlas)' if is_live else 'Embedded JSON/In-Memory Mongo Fallback'}")
    print(f" [*] Database Name: {Config.DB_NAME}")
    print("-" * 60)
    
    prod_count = db.products.count_documents({})
    user_count = db.users.count_documents({})
    seller_count = db.sellers.count_documents({})
    order_count = db.orders.count_documents({})
    review_count = db.reviews.count_documents({})

    print(f" • Products in Catalog: {prod_count}")
    print(f" • Registered Users:    {user_count} (Farmers & Admins)")
    print(f" • Verified Sellers:    {seller_count}")
    print(f" • Total Orders:        {order_count}")
    print(f" • Customer Reviews:    {review_count}")
    print("-" * 60)

def list_products(db):
    print_header("Catalog Products List")
    products = list(db.products.find({}))
    if not products:
        print(" (No products found)")
        return

    print(f"{'ID':<10} {'Category':<15} {'Price':<10} {'Stock':<10} {'Name'}")
    print("-" * 75)
    for p in products:
        print(f"{p['_id']:<10} {p.get('category',''):<15} ₹{p.get('price',0):<9} {p.get('stock',0):<10} {p.get('name','')[:30]}")

def list_users(db):
    print_header("Registered Users List")
    users = list(db.users.find({}))
    if not users:
        print(" (No users found)")
        return

    print(f"{'Role':<10} {'Name':<22} {'Phone / Email':<25} {'Village / District'}")
    print("-" * 75)
    for u in users:
        loc = f"{u.get('village','')}, {u.get('district','')}"
        print(f"{u.get('role','farmer'):<10} {u.get('name','')[:20]:<22} {u.get('phone', u.get('email','')):<25} {loc[:20]}")

def list_orders(db):
    print_header("Orders & Fulfillment List")
    orders = list(db.orders.find({}))
    if not orders:
        print(" (No orders found)")
        return

    print(f"{'Order ID':<14} {'Status':<18} {'Total':<10} {'Payment':<16} {'Farmer'}")
    print("-" * 75)
    for o in orders:
        print(f"{o['_id']:<14} {o.get('status','Ordered'):<18} ₹{o.get('total_amount',0):<9} {o.get('payment_method','COD')[:15]:<16} {o.get('user_name','')[:15]}")

def reset_data(db):
    confirm = input("\n[!] Are you sure you want to reset all collections to default sample data? (y/n): ").strip().lower()
    if confirm == 'y':
        db.products.drop()
        db.sellers.drop()
        db.users.drop()
        db.reviews.drop()
        db.orders.drop()
        seed_database(db)
        print("\n[✓] Database has been reset to default pristine sample state successfully!")
    else:
        print("\n[-] Operation cancelled.")

def export_data(db):
    filename = input("\nEnter export filename (default: agriseed_backup.json): ").strip()
    if not filename:
        filename = "agriseed_backup.json"

    export_obj = {
        "products": list(db.products.find({})),
        "users": list(db.users.find({})),
        "sellers": list(db.sellers.find({})),
        "orders": list(db.orders.find({})),
        "reviews": list(db.reviews.find({}))
    }

    filepath = os.path.join("g:\\agri(proto)", filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(export_obj, f, indent=2)

    print(f"\n[✓] Database successfully exported to: {filepath}")

def import_data(db):
    filename = input("\nEnter import filename (e.g. agriseed_backup.json): ").strip()
    filepath = os.path.join("g:\\agri(proto)", filename)
    if not os.path.exists(filepath):
        print(f"\n[X] Error: File '{filepath}' not found.")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    db.products.drop()
    db.users.drop()
    db.sellers.drop()
    db.orders.drop()
    db.reviews.drop()

    if data.get('products'): db.products.insert_many(data['products'])
    if data.get('users'): db.users.insert_many(data['users'])
    if data.get('sellers'): db.sellers.insert_many(data['sellers'])
    if data.get('orders'): db.orders.insert_many(data['orders'])
    if data.get('reviews'): db.reviews.insert_many(data['reviews'])

    print(f"\n[✓] Database successfully imported from: {filepath}")

def main():
    db = DatabaseManager.get_db()
    seed_database(db)

    while True:
        print("""
 ==========================================================
  🌾 AGRISEED DATABASE MANAGEMENT CLI TOOL 🌾
 ==========================================================
  1. Show Database Summary & Record Counts
  2. List All Products in Catalog
  3. List All Registered Users (Farmers & Admins)
  4. List All Customer Orders & Status
  5. Reset Database to Default Sample Data
  6. Export Complete Database to JSON Backup
  7. Import Database from JSON Backup
  8. Exit
 ==========================================================
        """)
        choice = input("Enter choice [1-8]: ").strip()
        if choice == '1':
            show_stats(db)
        elif choice == '2':
            list_products(db)
        elif choice == '3':
            list_users(db)
        elif choice == '4':
            list_orders(db)
        elif choice == '5':
            reset_data(db)
        elif choice == '6':
            export_data(db)
        elif choice == '7':
            import_data(db)
        elif choice == '8':
            print("\nExiting Database Manager. Goodbye!\n")
            break
        else:
            print("\n[!] Invalid option. Please enter a number from 1 to 8.")

if __name__ == '__main__':
    main()
