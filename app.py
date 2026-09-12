import os
import sys
import uuid
import random

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from datetime import datetime, timedelta
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from config import Config
from database import DatabaseManager
from seed_data import seed_database, SAMPLE_PRODUCTS, SAMPLE_SELLERS, SAMPLE_USERS, SAMPLE_REVIEWS, SAMPLE_ORDERS

REACT_DIST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend', 'dist')

app = Flask(
    __name__,
    static_folder=os.path.join(REACT_DIST_DIR, 'assets'),
    static_url_path='/assets'
)
app.config.from_object(Config)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Initialize Database and seed if empty
db = DatabaseManager.get_db()
seed_database(db)

# Helper function to get current logged in user
def get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        return None
    user = db.users.find_one({"_id": user_id})
    if user:
        # Don't expose password hash in session/context
        user_copy = dict(user)
        user_copy.pop('password_hash', None)
        user_copy['id'] = user_copy.get('_id')
        return user_copy
    return None

def format_user(u):
    if not u:
        return None
    u_dict = dict(u)
    u_dict.pop('password_hash', None)
    uid = str(u_dict.get('_id', u_dict.get('id', '')))
    u_dict['id'] = uid
    u_dict['_id'] = uid
    u_dict['farmSize'] = u_dict.get('farmSize', u_dict.get('farm_size', '2 Acres'))
    u_dict['primaryCrops'] = u_dict.get('primaryCrops', u_dict.get('primary_crops', ['Paddy', 'Wheat']))
    u_dict['kisanRewards'] = u_dict.get('kisanRewards', u_dict.get('kisan_rewards', 100))
    return u_dict

def format_product(p):
    if not p:
        return None
    p_dict = dict(p)
    pid = str(p_dict.get('_id', p_dict.get('id', '')))
    unit = p_dict.get('unit', '1 Pack')
    price = p_dict.get('price', 0)
    pack_sizes = p_dict.get('pack_sizes', p_dict.get('packSizes', [{'size': unit, 'price': price}]))
    
    return {
        "id": pid,
        "_id": pid,
        "name": p_dict.get("name", ""),
        "category": p_dict.get("category", "Seeds"),
        "categoryIcon": p_dict.get("categoryIcon", p_dict.get("category_icon", "🌾")),
        "price": price,
        "originalPrice": p_dict.get("originalPrice", p_dict.get("original_price", price)),
        "unit": unit,
        "packSizes": pack_sizes,
        "stock": p_dict.get("stock", 50),
        "rating": p_dict.get("rating", 4.8),
        "reviewCount": p_dict.get("reviewCount", p_dict.get("review_count", 25)),
        "imageUrl": p_dict.get("imageUrl", p_dict.get("image_url", "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80")),
        "cropSuitability": p_dict.get("cropSuitability", p_dict.get("crop_suitability", "All Crops")),
        "season": p_dict.get("season", "All Seasons"),
        "germinationRate": p_dict.get("germinationRate", p_dict.get("germination_rate", "92%")),
        "purity": p_dict.get("purity", "98%"),
        "maturityPeriod": p_dict.get("maturityPeriod", p_dict.get("maturity_period", "120-140 Days")),
        "yieldPotential": p_dict.get("yieldPotential", p_dict.get("yield_potential", "20-25 Quintals/Acre")),
        "sellerId": p_dict.get("sellerId", p_dict.get("seller_id", "seller_1")),
        "sellerName": p_dict.get("sellerName", p_dict.get("seller_name", "Kisan Vikas Agro Kendra")),
        "verifiedSeller": p_dict.get("verifiedSeller", p_dict.get("verified_seller", True)),
        "sellerLicense": p_dict.get("sellerLicense", p_dict.get("seller_license", "DL-AGR-2023-8821")),
        "description": p_dict.get("description", ""),
        "dosageGuide": p_dict.get("dosageGuide", p_dict.get("dosage_guide", "Refer to packet instructions.")),
        "isFeatured": p_dict.get("isFeatured", p_dict.get("is_featured", False)),
        "isPopular": p_dict.get("isPopular", p_dict.get("is_popular", False)),
        "tags": p_dict.get("tags", [])
    }

def format_order(o):
    if not o:
        return None
    o_dict = dict(o)
    oid = str(o_dict.get('_id', o_dict.get('id', o_dict.get('orderId', ''))))
    del_addr = o_dict.get("deliveryAddress", o_dict.get("delivery_address", {}))
    return {
        "id": oid,
        "_id": oid,
        "orderId": oid,
        "userId": o_dict.get("userId", o_dict.get("user_id", "guest")),
        "userName": o_dict.get("userName", o_dict.get("user_name", del_addr.get('name', 'Farmer Patron'))),
        "phone": o_dict.get("phone", del_addr.get('phone', '')),
        "deliveryAddress": del_addr,
        "items": o_dict.get("items", []),
        "subtotal": o_dict.get("subtotal", 0),
        "discount": o_dict.get("discount", 0),
        "couponCode": o_dict.get("couponCode", o_dict.get("coupon_code", None)),
        "deliveryCharge": o_dict.get("deliveryCharge", o_dict.get("delivery_charge", 0)),
        "totalAmount": o_dict.get("totalAmount", o_dict.get("total_amount", 0)),
        "paymentMethod": o_dict.get("paymentMethod", o_dict.get("payment_method", "Cash on Delivery")),
        "paymentStatus": o_dict.get("paymentStatus", o_dict.get("payment_status", "Pending")),
        "status": o_dict.get("status", "Ordered"),
        "statusHistory": o_dict.get("statusHistory", o_dict.get("status_history", [])),
        "courierPartner": o_dict.get("courierPartner", o_dict.get("courier_partner", "AgriExpress Rural Fleet")),
        "trackingNumber": o_dict.get("trackingNumber", o_dict.get("tracking_number", f"AX-KNL-{oid.replace('AGRI-', '')}")),
        "trackingAwb": o_dict.get("trackingAwb", o_dict.get("tracking_number", f"AWB-{oid}-DL")),
        "driverName": o_dict.get("driverName", o_dict.get("driver_name", "Sukhwinder Singh")),
        "driverPhone": o_dict.get("driverPhone", o_dict.get("driver_phone", "+91 98123 77654")),
        "vehicleNumber": o_dict.get("vehicleNumber", o_dict.get("vehicle_number", "HR-05-AB-7721")),
        "estimatedDelivery": o_dict.get("estimatedDelivery", o_dict.get("estimated_delivery", "2-3 Business Days")),
        "createdAt": o_dict.get("createdAt", o_dict.get("created_at", datetime.utcnow().isoformat()))
    }

@app.context_processor
def inject_globals():
    """Inject current user, cart count and DB mode into all Jinja templates."""
    current_user = get_current_user()
    cart = session.get('cart', [])
    cart_count = sum(item.get('quantity', 1) for item in cart)
    return {
        'current_user': current_user,
        'cart_count': cart_count,
        'is_live_mongo': DatabaseManager.is_live_mongo()
    }

# ==========================================
# PRESENTATION ROUTE (Slide Deck)
# ==========================================

@app.route('/presentation')
def presentation_page():
    """Interactive Slide Presentation Deck for College Project Submission."""
    return render_template('presentation.html')

# ==========================================
# REST API ENDPOINTS
# ==========================================

@app.route('/api/health', methods=['GET'])
def api_health():
    """System health check and MongoDB connection telemetry."""
    is_live = DatabaseManager.is_live_mongo()
    return jsonify({
        "success": True,
        "status": "healthy",
        "database": "MongoDB (agriseed_db)",
        "is_live_mongo": is_live,
        "users_count": db.users.count_documents({}),
        "products_count": db.products.count_documents({}),
        "orders_count": db.orders.count_documents({})
    })

# --- AUTH APIs ---

@app.route('/api/auth/register', methods=['POST'])
def api_register():
    data = request.get_json(silent=True) or request.form.to_dict() or {}
    
    # Robustly extract name across all possible frontend field conventions
    name = (
        data.get('name') or 
        data.get('fullName') or 
        data.get('full_name') or 
        data.get('farmerName') or 
        data.get('farmer_name') or 
        data.get('username') or 
        data.get('user_name') or 
        ''
    ).strip()
    
    # Robustly extract phone and email
    phone = str(
        data.get('phone') or 
        data.get('mobile') or 
        data.get('phoneNumber') or 
        data.get('phone_number') or 
        data.get('contact') or 
        ''
    ).strip()
    
    email = str(
        data.get('email') or 
        data.get('emailAddress') or 
        data.get('email_address') or 
        ''
    ).strip().lower()
    
    password = str(data.get('password') or data.get('pass') or '').strip()
    village = str(data.get('village') or data.get('town') or data.get('villageName') or 'Krishi Nagar').strip()
    district = str(data.get('district') or data.get('districtName') or 'Karnal').strip()
    state = str(data.get('state') or data.get('stateName') or 'Haryana').strip()
    farm_size = str(data.get('farm_size') or data.get('farmSize') or data.get('land_size') or data.get('landSize') or '5 Acres').strip()
    primary_crops = data.get('primary_crops') or data.get('primaryCrops') or data.get('crops') or ['Wheat', 'Rice']
    role = str(data.get('role', 'farmer')).strip().lower()

    if not name:
        return jsonify({"success": False, "message": "Full Name is required."}), 400
    if not phone and not email:
        return jsonify({"success": False, "message": "Please provide either a Mobile Number or Email."}), 400
    if not password:
        password = phone or "farmer123"

    # Check if user already exists
    query_or = []
    if email: query_or.append({"email": email})
    if phone: query_or.append({"phone": phone})
    
    if query_or:
        existing = db.users.find_one({"$or": query_or})
        if existing:
            return jsonify({"success": False, "message": "An account with this mobile number or email already exists. Please log in."}), 409

    now_iso = datetime.now().isoformat()
    new_user = {
        "_id": f"user_{datetime.now().strftime('%Y%m%d%H%M%S')}_{random.randint(100, 999)}",
        "name": name,
        "email": email or f"{phone}@agriseed.in",
        "phone": phone or "9876543210",
        "password_hash": generate_password_hash(password),
        "role": role if role in ['farmer', 'admin', 'seller'] else 'farmer',
        "farm_size": farm_size or "5 Acres",
        "farmSize": farm_size or "5 Acres",
        "primary_crops": primary_crops if isinstance(primary_crops, list) else [c.strip() for c in str(primary_crops).split(',') if c.strip()],
        "primaryCrops": primary_crops if isinstance(primary_crops, list) else [c.strip() for c in str(primary_crops).split(',') if c.strip()],
        "village": village,
        "taluk": data.get('taluk', 'Taluk Center'),
        "district": district,
        "state": state,
        "pincode": data.get('pincode', '132001'),
        "kisan_rewards": 100, # 100 bonus welcome points
        "kisanRewards": 100,
        "registered_host": request.host,
        "created_at": now_iso
    }

    # Insert into database (MongoDB / JSON persistent store)
    db.users.insert_one(new_user)
    session.permanent = True
    session['user_id'] = new_user['_id']
    session['user_role'] = new_user.get('role', 'farmer')
    session['user_name'] = new_user['name']

    print(f"[AUTH-REGISTRATION] Successfully saved user '{name}' ({new_user['phone']}) to MongoDB! Host: {request.host}")

    return jsonify({
        "success": True,
        "message": f"Welcome to AgriSeed, {name}! Your farmer account is registered (+100 Kisan Points).",
        "redirect": "/admin" if new_user.get('role') == 'admin' else "/dashboard",
        "user": format_user(new_user)
    })

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    data = request.get_json(silent=True) or request.form.to_dict() or {}
    identity = str(data.get('identity') or data.get('phone') or data.get('email') or data.get('username') or '').strip().lower()
    password = str(data.get('password') or data.get('pass') or '').strip()

    if not identity or not password:
        return jsonify({"success": False, "message": "Mobile/Email and Password are required."}), 400

    user = db.users.find_one({"$or": [{"email": identity}, {"phone": identity}, {"_id": identity}, {"name": {"$regex": f"^{identity}$", "$options": "i"}}]})
    
    # Fallback to check admin credentials if admin user was queried
    if not user and identity in ['admin', 'admin@agriseed.in', '9998887776'] and password == 'admin123':
        user = db.users.find_one({"role": "admin"})

    if not user or not check_password_hash(user.get('password_hash', ''), password):
        # Allow default admin fallback verification
        if user and user.get('role') == 'admin' and password == 'admin123':
            pass
        else:
            return jsonify({"success": False, "message": "Invalid mobile number, email, or password."}), 401

    session.permanent = True
    session['user_id'] = user['_id']
    session['user_role'] = user.get('role', 'farmer')
    session['user_name'] = user['name']

    print(f"[AUTH-LOGIN] User '{user['name']}' logged in successfully via host: {request.host}")

    return jsonify({
        "success": True,
        "message": f"Welcome back, {user['name']}!",
        "role": user.get('role', 'farmer'),
        "user": format_user(user),
        "redirect": "/admin" if user.get('role') == 'admin' else "/dashboard"
    })

@app.route('/api/auth/demo_login', methods=['POST'])
def api_demo_login():
    """Instant 1-click login for college project demonstration."""
    data = request.get_json() or {}
    role = data.get('role', 'farmer')

    if role == 'admin':
        user = db.users.find_one({"role": "admin"})
        if not user:
            # Create admin if missing
            user = {
                "_id": "user_admin",
                "name": "AgriSeed Administrator",
                "email": "admin@agriseed.in",
                "phone": "9998887776",
                "password_hash": generate_password_hash("admin123"),
                "role": "admin",
                "farm_size": "Admin HQ",
                "primary_crops": ["All Crops"],
                "village": "Agri Complex",
                "district": "New Delhi",
                "state": "Delhi",
                "kisan_rewards": 9999,
                "created_at": "2026-01-01T00:00:00"
            }
            db.users.insert_one(user)
    else:
        user = db.users.find_one({"role": "farmer"})

    if not user:
        return jsonify({"success": False, "message": "Demo user not found"}), 404

    session['user_id'] = user['_id']
    session['user_role'] = user.get('role', 'farmer')
    session['user_name'] = user['name']

    return jsonify({
        "success": True,
        "message": f"Logged in as Demo {role.capitalize()}: {user['name']}",
        "role": user.get('role', 'farmer'),
        "user": format_user(user),
        "redirect": "/admin" if user.get('role') == 'admin' else "/dashboard"
    })

@app.route('/api/auth/me', methods=['GET'])
def api_auth_me():
    user_id = session.get('user_id') or request.args.get('user_id')
    if not user_id:
        return jsonify({"success": False, "authenticated": False, "user": None}), 200
    user = db.users.find_one({"_id": user_id})
    if not user:
        return jsonify({"success": False, "authenticated": False, "user": None}), 200
    return jsonify({"success": True, "authenticated": True, "user": format_user(user)})

@app.route('/api/auth/logout', methods=['GET', 'POST'])
def api_logout():
    session.pop('user_id', None)
    session.pop('user_role', None)
    session.pop('user_name', None)
    return jsonify({"success": True, "message": "Logged out successfully.", "redirect": "/"})

# --- USER PROFILE & ACCOUNT MANAGEMENT ---

@app.route('/api/auth/profile', methods=['PUT'])
@app.route('/api/users/<user_id>', methods=['PUT'])
def api_update_profile(user_id=None):
    """Updates user profile information in MongoDB."""
    current_uid = user_id or session.get('user_id') or request.args.get('user_id')
    data = request.get_json(silent=True) or request.form.to_dict() or {}
    
    target_id = current_uid or data.get('id') or data.get('_id') or data.get('userId')
    if not target_id:
        return jsonify({"success": False, "message": "User identifier required."}), 400

    user = db.users.find_one({"$or": [{"_id": target_id}, {"id": target_id}]})
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404

    update_fields = {}
    if 'name' in data or 'fullName' in data or 'full_name' in data:
        update_fields['name'] = (data.get('name') or data.get('fullName') or data.get('full_name')).strip()
    if 'phone' in data or 'mobile' in data:
        update_fields['phone'] = str(data.get('phone') or data.get('mobile')).strip()
    if 'email' in data:
        update_fields['email'] = str(data.get('email')).strip().lower()
    if 'farmSize' in data or 'farm_size' in data or 'landSize' in data:
        fs = str(data.get('farmSize') or data.get('farm_size') or data.get('landSize')).strip()
        update_fields['farmSize'] = fs
        update_fields['farm_size'] = fs
    if 'village' in data:
        update_fields['village'] = str(data.get('village')).strip()
    if 'district' in data:
        update_fields['district'] = str(data.get('district')).strip()
    if 'state' in data:
        update_fields['state'] = str(data.get('state')).strip()
    if 'pincode' in data:
        update_fields['pincode'] = str(data.get('pincode')).strip()
    if 'primaryCrops' in data or 'primary_crops' in data:
        crops = data.get('primaryCrops') or data.get('primary_crops')
        if isinstance(crops, str):
            crops = [c.strip() for c in crops.split(',') if c.strip()]
        update_fields['primaryCrops'] = crops
        update_fields['primary_crops'] = crops

    if update_fields:
        db.users.update_one({"_id": user['_id']}, {"$set": update_fields})
        if 'name' in update_fields:
            session['user_name'] = update_fields['name']

    updated_user = db.users.find_one({"_id": user['_id']})
    return jsonify({
        "success": True,
        "message": "Farmer profile updated successfully in MongoDB!",
        "user": format_user(updated_user)
    })

@app.route('/api/auth/change-password', methods=['POST'])
def api_change_password():
    """Validates current password and updates with new hashed password in MongoDB."""
    data = request.get_json(silent=True) or request.form.to_dict() or {}
    user_id = data.get('userId') or data.get('user_id') or session.get('user_id')
    current_pass = data.get('currentPassword') or data.get('current_password') or ''
    new_pass = data.get('newPassword') or data.get('new_password') or ''

    if not user_id:
        return jsonify({"success": False, "message": "User session not found. Please log in."}), 400
    if not current_pass or not new_pass:
        return jsonify({"success": False, "message": "Current password and new password are required."}), 400
    if len(new_pass) < 4:
        return jsonify({"success": False, "message": "New password must be at least 4 characters long."}), 400

    user = db.users.find_one({"$or": [{"_id": user_id}, {"id": user_id}]})
    if not user:
        return jsonify({"success": False, "message": "User account not found."}), 404

    # Check current password hash or default password fallback
    if not check_password_hash(user.get('password_hash', ''), current_pass):
        if not (user.get('role') == 'admin' and current_pass == 'admin123') and not (user.get('role') == 'farmer' and current_pass == 'farmer123'):
            return jsonify({"success": False, "message": "Current password is incorrect."}), 401

    new_hash = generate_password_hash(new_pass)
    db.users.update_one({"_id": user['_id']}, {"$set": {"password_hash": new_hash}})
    return jsonify({"success": True, "message": "Password updated successfully in MongoDB! Please use your new password next time you sign in."})

@app.route('/api/auth/account', methods=['DELETE'])
@app.route('/api/users/<user_id>', methods=['DELETE'])
def api_delete_account(user_id=None):
    """Permanently deletes user account from MongoDB."""
    target_id = user_id or session.get('user_id') or request.args.get('user_id')
    if not target_id:
        return jsonify({"success": False, "message": "User identifier required."}), 400

    user = db.users.find_one({"$or": [{"_id": target_id}, {"id": target_id}]})
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404

    db.users.delete_one({"_id": user['_id']})
    
    # If deleting current session user, clear session
    if session.get('user_id') == user['_id']:
        session.clear()

    return jsonify({"success": True, "message": f"Account for '{user.get('name')}' has been permanently deleted from MongoDB."})

# --- PRODUCT APIs ---

@app.route('/api/products', methods=['GET'])
def api_get_products():
    category = request.args.get('category')
    crop = request.args.get('crop')
    search = request.args.get('q')
    max_price = request.args.get('max_price')

    query = {}
    if category and category != 'All':
        query['category'] = category
    if crop and crop != 'All':
        query['crop_suitability'] = {'$regex': crop, '$options': 'i'}
    if max_price:
        try:
            query['price'] = {'$lte': float(max_price)}
        except ValueError:
            pass
    if search:
        query['$or'] = [
            {'name': {'$regex': search, '$options': 'i'}},
            {'description': {'$regex': search, '$options': 'i'}},
            {'category': {'$regex': search, '$options': 'i'}}
        ]

    raw_products = list(db.products.find(query))
    formatted_products = [format_product(p) for p in raw_products]
    return jsonify({"success": True, "count": len(formatted_products), "products": formatted_products})

@app.route('/api/products/<product_id>', methods=['GET'])
def api_get_product_detail(product_id):
    product = db.products.find_one({"$or": [{"_id": product_id}, {"id": product_id}]})
    if not product:
        return jsonify({"success": False, "message": "Product not found"}), 404
    reviews = list(db.reviews.find({"product_id": product.get('_id', product_id)}))
    seller = db.sellers.find_one({"_id": product.get('seller_id')}) or {}
    return jsonify({"success": True, "product": format_product(product), "seller": seller, "reviews": reviews})

@app.route('/api/products/<product_id>/reviews', methods=['POST'])
def api_add_review(product_id):
    data = request.get_json() or {}
    current_user = get_current_user()

    user_name = current_user['name'] if current_user else data.get('user_name', 'Verified Farmer')
    rating = int(data.get('rating', 5))
    comment = data.get('comment', '').strip()

    if not comment:
        return jsonify({"success": False, "message": "Please write a review comment."}), 400

    new_review = {
        "_id": f"rev_{uuid.uuid4().hex[:8]}",
        "product_id": product_id,
        "user_name": user_name,
        "rating": rating,
        "comment": comment,
        "date": datetime.utcnow().strftime('%Y-%m-%d'),
        "verified_purchase": True
    }

    db.reviews.insert_one(new_review)
    
    # Update product rating average
    all_reviews = list(db.reviews.find({"product_id": product_id}))
    avg_rating = round(sum(r['rating'] for r in all_reviews) / len(all_reviews), 1)
    db.products.update_one({"_id": product_id}, {
        "$set": {"rating": avg_rating, "review_count": len(all_reviews)}
    })

    return jsonify({"success": True, "message": "Review submitted successfully!", "review": new_review})

# --- CART APIs ---

@app.route('/api/cart/add', methods=['POST'])
def api_cart_add():
    data = request.get_json() or {}
    product_id = data.get('product_id')
    pack_size = data.get('pack_size')
    quantity = int(data.get('quantity', 1))

    product = db.products.find_one({"_id": product_id})
    if not product:
        return jsonify({"success": False, "message": "Product not found"}), 404

    # Determine price based on selected pack size
    price = product.get('price', 0)
    pack_label = product.get('unit', '1 Pack')
    if pack_size and product.get('pack_sizes'):
        for p in product['pack_sizes']:
            if p['size'] == pack_size:
                price = p['price']
                pack_label = p['size']
                break

    if 'cart' not in session:
        session['cart'] = []

    cart = session['cart']
    # Check if item with exact same pack size already in cart
    existing_item = None
    for item in cart:
        if item['product_id'] == product_id and item.get('pack_size') == pack_label:
            existing_item = item
            break

    if existing_item:
        existing_item['quantity'] += quantity
    else:
        cart.append({
            "product_id": product_id,
            "name": product['name'],
            "pack_size": pack_label,
            "price": price,
            "original_price": product.get('original_price', price),
            "quantity": quantity,
            "image_url": product.get('image_url', ''),
            "category": product.get('category', 'Agri')
        })

    session['cart'] = cart
    session.modified = True

    total_count = sum(item['quantity'] for item in cart)
    return jsonify({
        "success": True,
        "message": f"Added {quantity} x {product['name']} ({pack_label}) to your cart.",
        "cart_count": total_count,
        "cart": cart
    })

@app.route('/api/cart/update', methods=['POST'])
def api_cart_update():
    data = request.get_json() or {}
    product_id = data.get('product_id')
    pack_size = data.get('pack_size')
    action = data.get('action') # 'increase', 'decrease', or 'set'
    qty = data.get('quantity')

    cart = session.get('cart', [])
    for item in cart:
        if item['product_id'] == product_id and item.get('pack_size') == pack_size:
            if action == 'increase':
                item['quantity'] += 1
            elif action == 'decrease':
                item['quantity'] = max(1, item['quantity'] - 1)
            elif action == 'set' and qty is not None:
                item['quantity'] = max(1, int(qty))
            break

    session['cart'] = cart
    session.modified = True
    return jsonify({"success": True, "cart": cart})

@app.route('/api/cart/remove', methods=['POST'])
def api_cart_remove():
    data = request.get_json() or {}
    product_id = data.get('product_id')
    pack_size = data.get('pack_size')

    cart = session.get('cart', [])
    cart = [item for item in cart if not (item['product_id'] == product_id and item.get('pack_size') == pack_size)]
    session['cart'] = cart
    session.modified = True

    return jsonify({"success": True, "message": "Item removed from cart.", "cart": cart})

@app.route('/api/cart/coupon', methods=['POST'])
def api_apply_coupon():
    data = request.get_json() or {}
    code = data.get('code', '').strip().upper()
    cart = session.get('cart', [])
    subtotal = sum(item['price'] * item['quantity'] for item in cart)

    if code == 'KISAN50':
        discount = round(subtotal * 0.10) # 10% discount
        session['cart_discount'] = discount
        session['coupon_code'] = code
        return jsonify({
            "success": True,
            "message": f"Coupon KISAN50 applied! You saved ₹{discount} (10% Kisan Subsidy).",
            "discount": discount
        })
    elif code == 'AGRISEED100' and subtotal >= 1000:
        discount = 100
        session['cart_discount'] = discount
        session['coupon_code'] = code
        return jsonify({
            "success": True,
            "message": "Coupon AGRISEED100 applied! Flat ₹100 Off.",
            "discount": discount
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid coupon code or minimum order condition not met. Try 'KISAN50'."
        }), 400

# --- ORDERS & CHECKOUT APIs ---

@app.route('/api/orders', methods=['GET', 'POST'])
def api_orders():
    if request.method == 'GET':
        user_id = request.args.get('user_id')
        if user_id:
            orders = list(db.orders.find({"$or": [{"user_id": user_id}, {"userId": user_id}]}))
        else:
            orders = list(db.orders.find({}))
        formatted_orders = [format_order(o) for o in orders]
        return jsonify({"success": True, "count": len(formatted_orders), "orders": formatted_orders})

    # POST - Create New Order
    data = request.get_json(silent=True) or request.form.to_dict() or {}
    items = data.get('items') or session.get('cart', [])
    if not items:
        return jsonify({"success": False, "message": "No items provided in order."}), 400

    current_user = get_current_user()
    user_id = data.get('userId') or data.get('user_id') or (current_user['_id'] if current_user else "guest_farmer")
    
    delivery_addr = data.get('deliveryAddress') or data.get('delivery_address') or {}
    name = delivery_addr.get('fullName') or delivery_addr.get('name') or data.get('name') or (current_user['name'] if current_user else "Farmer Patron")
    phone = delivery_addr.get('phone') or data.get('phone') or (current_user.get('phone') if current_user else "9876543210")
    village = delivery_addr.get('village') or data.get('village', 'Village Farm')
    taluk = delivery_addr.get('taluk') or data.get('taluk', 'Tehsil')
    district = delivery_addr.get('district') or data.get('district', 'District')
    state = delivery_addr.get('state') or data.get('state', 'State')
    pincode = delivery_addr.get('pincode') or data.get('pincode', '110001')
    payment_method = data.get('paymentMethod') or data.get('payment_method', 'Cash on Delivery')

    subtotal = float(data.get('subtotal', sum((item.get('price', 0) * item.get('quantity', 1)) for item in items)))
    discount = float(data.get('discount', session.get('cart_discount', 0)))
    coupon_code = data.get('couponCode', session.get('coupon_code', None))
    delivery_charge = float(data.get('deliveryCharge', 0 if subtotal >= 999 else 75))
    total_amount = float(data.get('totalAmount', max(0, subtotal - discount + delivery_charge)))

    # Generate unique readable Order ID
    order_id = f"AGRI-{random.randint(100000, 999999)}"
    now_str = datetime.utcnow().strftime("%Y-%m-%d %I:%M %p")
    estimated_del = (datetime.utcnow() + timedelta(days=3)).strftime("%Y-%m-%d")

    new_order = {
        "_id": order_id,
        "id": order_id,
        "orderId": order_id,
        "user_id": user_id,
        "userId": user_id,
        "user_name": name,
        "userName": name,
        "phone": phone,
        "delivery_address": {
            "fullName": name,
            "name": name,
            "village": village,
            "taluk": taluk,
            "district": district,
            "state": state,
            "pincode": pincode,
            "phone": phone
        },
        "deliveryAddress": {
            "fullName": name,
            "name": name,
            "village": village,
            "taluk": taluk,
            "district": district,
            "state": state,
            "pincode": pincode,
            "phone": phone
        },
        "items": items,
        "subtotal": subtotal,
        "discount": discount,
        "coupon_code": coupon_code,
        "couponCode": coupon_code,
        "delivery_charge": delivery_charge,
        "deliveryCharge": delivery_charge,
        "total_amount": total_amount,
        "totalAmount": total_amount,
        "payment_method": payment_method,
        "paymentMethod": payment_method,
        "payment_status": "Paid" if "UPI" in payment_method or "Card" in payment_method else "Pay on Delivery",
        "status": "Ordered",
        "status_history": [
            {
                "status": "Ordered",
                "timestamp": now_str,
                "details": f"Order #{order_id} placed successfully with {payment_method}."
            }
        ],
        "courier_partner": "AgriExpress Rural Fleet",
        "courierPartner": "AgriExpress Rural Fleet",
        "tracking_number": f"AX-KNL-{order_id.replace('AGRI-', '')}",
        "trackingNumber": f"AX-KNL-{order_id.replace('AGRI-', '')}",
        "trackingAwb": f"AWB-{order_id}-DL",
        "driver_name": "Sukhwinder Singh",
        "driverName": "Sukhwinder Singh",
        "driver_phone": "+91 98123 77654",
        "driverPhone": "+91 98123 77654",
        "vehicle_number": "HR-05-AB-7721",
        "vehicleNumber": "HR-05-AB-7721",
        "estimated_delivery": estimated_del,
        "estimatedDelivery": "2-3 Business Days",
        "created_at": datetime.utcnow().isoformat()
    }

    db.orders.insert_one(new_order)

    # Reduce product stock in database
    for item in items:
        pid = item.get('id') or item.get('productId') or item.get('product_id')
        qty = int(item.get('quantity', 1))
        if pid:
            db.products.update_one(
                {"$or": [{"_id": pid}, {"id": pid}]},
                {"$inc": {"stock": -qty}}
            )

    # Add Kisan Rewards loyalty points to user in database
    if user_id and user_id != "guest_farmer":
        db.users.update_one(
            {"$or": [{"_id": user_id}, {"id": user_id}]},
            {"$inc": {"kisan_rewards": 20, "kisanRewards": 20}}
        )

    # Clear session cart if present
    session['cart'] = []
    session.pop('cart_discount', None)
    session.pop('coupon_code', None)
    session.modified = True

    print(f"[ORDERS] Successfully created real order #{order_id} for user '{name}' ({phone}) in MongoDB!")

    return jsonify({
        "success": True,
        "message": f"Order #{order_id} placed successfully!",
        "order_id": order_id,
        "order": format_order(new_order),
        "redirect": f"/track?orderId={order_id}"
    })

@app.route('/api/orders/create', methods=['POST'])
def api_create_order():
    return api_orders()

@app.route('/api/orders/<order_id>', methods=['GET'])
@app.route('/api/orders/track/<order_id>', methods=['GET'])
def api_get_order_track(order_id):
    order = db.orders.find_one({"$or": [{"_id": order_id}, {"id": order_id}, {"orderId": order_id}]})
    if not order:
        return jsonify({"success": False, "message": f"Order #{order_id} not found."}), 404
    return jsonify({"success": True, "order": format_order(order)})

@app.route('/api/orders/user/<user_id>', methods=['GET'])
def api_get_user_orders(user_id):
    orders = list(db.orders.find({"$or": [{"user_id": user_id}, {"userId": user_id}]}))
    return jsonify({"success": True, "count": len(orders), "orders": [format_order(o) for o in orders]})

# --- CROP DOCTOR AI DIAGNOSTIC API ---

@app.route('/api/crop-doctor/diagnose', methods=['POST'])
def api_crop_doctor_diagnose():
    data = request.get_json(silent=True) or request.form.to_dict() or {}
    sample_index = int(data.get('sampleIndex', data.get('sample_index', 0)))
    image_url = data.get('imageUrl') or data.get('image_url')
    
    diagnoses_kb = [
        {
            "crop": "Paddy / Rice",
            "name": "Paddy Blast (Magnaporthe oryzae)",
            "symptoms": "Spindle-shaped lesions with grey center and reddish-brown borders on leaf blades.",
            "recommendedTreatment": {
                "productId": "prod_7",
                "productName": "Bio-Neem Shield & Tricyclazole 75 WP",
                "dosage": "120g in 200L water per acre",
                "preventativeTip": "Avoid excess nitrogen fertilizer during cloudy high-humidity weather."
            }
        },
        {
            "crop": "Cotton",
            "name": "Pink Bollworm (Pectinophora gossypiella)",
            "symptoms": "Rosetted flowers and punctured squares on developing bolls.",
            "recommendedTreatment": {
                "productId": "prod_8",
                "productName": "Proclaim 5% SG Emamectin Benzoate",
                "dosage": "80g in 200L water per acre",
                "preventativeTip": "Install pheromone traps at 5 traps/acre for early monitoring."
            }
        },
        {
            "crop": "Wheat",
            "name": "Yellow Rust / Stripe Rust (Puccinia striiformis)",
            "symptoms": "Yellowish stripe-like pustules arranged along the veins of leaves.",
            "recommendedTreatment": {
                "productId": "prod_7",
                "productName": "Propiconazole 25% EC (Tilt)",
                "dosage": "200ml in 200L water per acre",
                "preventativeTip": "Sow rust-resistant ICAR certified seed lots early in November."
            }
        }
    ]
    
    chosen = diagnoses_kb[min(sample_index, len(diagnoses_kb)-1)]
    diag_record = {
        "_id": f"diag_{uuid.uuid4().hex[:8]}",
        "user_id": session.get('user_id', 'guest'),
        "crop": chosen['crop'],
        "pathogen": chosen['name'],
        "diagnosis": chosen,
        "image_url": image_url,
        "timestamp": datetime.utcnow().isoformat()
    }
    try:
        db.diagnoses.insert_one(diag_record)
    except Exception:
        pass
        
    return jsonify({
        "success": True,
        "diagnosis": chosen,
        "record_id": diag_record["_id"]
    })

# --- ADMIN APIs ---

@app.route('/api/admin/products', methods=['POST'])
def api_admin_add_product():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    category = data.get('category', 'Seeds')
    price = float(data.get('price', 100))
    original_price = float(data.get('original_price', price * 1.2))
    stock = int(data.get('stock', 50))
    unit = data.get('unit', '1 Pack')
    crop_suitability = data.get('crop_suitability', 'All Crops')
    description = data.get('description', '')
    image_url = data.get('image_url') or 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'

    if not name or price <= 0:
        return jsonify({"success": False, "message": "Product name and valid price are required."}), 400

    new_prod_id = f"prod_{uuid.uuid4().hex[:6]}"
    category_icons = {
        'Seeds': '🌾',
        'Fertilizers': '🧪',
        'Pesticides': '🌱',
        'Farming Equipment': '🚜'
    }

    new_product = {
        "_id": new_prod_id,
        "name": name,
        "category": category,
        "category_icon": category_icons.get(category, '🌾'),
        "price": price,
        "original_price": original_price,
        "unit": unit,
        "pack_sizes": [
            {"size": unit, "price": price}
        ],
        "stock": stock,
        "rating": 5.0,
        "review_count": 1,
        "image_url": image_url,
        "crop_suitability": crop_suitability,
        "season": data.get('season', 'All Season'),
        "germination_rate": data.get('germination_rate', '90%'),
        "purity": data.get('purity', '99%'),
        "maturity_period": data.get('maturity_period', '90-120 Days'),
        "yield_potential": data.get('yield_potential', 'High Yield'),
        "seller_id": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "description": description or f"High grade agricultural product for {crop_suitability}.",
        "dosage_guide": data.get('dosage_guide', 'Apply as per package instructions.'),
        "is_featured": bool(data.get('is_featured', False)),
        "is_popular": False,
        "tags": ["Verified Seller", "Certified Quality"]
    }

    db.products.insert_one(new_product)
    return jsonify({"success": True, "message": f"Product '{name}' added successfully!", "product": new_product})

@app.route('/api/admin/products/<product_id>', methods=['PUT'])
def api_admin_update_product(product_id):
    data = request.get_json() or {}
    update_fields = {}

    if 'name' in data: update_fields['name'] = data['name']
    if 'price' in data: update_fields['price'] = float(data['price'])
    if 'stock' in data: update_fields['stock'] = int(data['stock'])
    if 'category' in data: update_fields['category'] = data['category']
    if 'crop_suitability' in data: update_fields['crop_suitability'] = data['crop_suitability']
    if 'description' in data: update_fields['description'] = data['description']

    if not update_fields:
        return jsonify({"success": False, "message": "No fields to update."}), 400

    db.products.update_one({"_id": product_id}, {"$set": update_fields})
    return jsonify({"success": True, "message": "Product updated successfully!"})

@app.route('/api/admin/products/<product_id>', methods=['DELETE'])
def api_admin_delete_product(product_id):
    res = db.products.delete_one({"_id": product_id})
    return jsonify({"success": True, "message": "Product removed successfully."})

@app.route('/api/admin/orders/<order_id>/status', methods=['PUT', 'POST'])
def api_admin_update_order_status(order_id):
    data = request.get_json(silent=True) or request.form.to_dict() or {}
    new_status = data.get('status')
    valid_statuses = ['Ordered', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']

    if new_status not in valid_statuses:
        return jsonify({"success": False, "message": f"Invalid status '{new_status}'."}), 400

    now_str = datetime.utcnow().strftime("%Y-%m-%d %I:%M %p")
    status_entry = {
        "status": new_status,
        "timestamp": now_str,
        "details": f"Status updated to {new_status} by Admin / Logistics Coordinator."
    }

    db.orders.update_one(
        {"$or": [{"_id": order_id}, {"id": order_id}, {"orderId": order_id}]},
        {
            "$set": {"status": new_status},
            "$push": {"status_history": status_entry, "statusHistory": status_entry}
        }
    )

    return jsonify({"success": True, "message": f"Order #{order_id} status updated to '{new_status}'."})

@app.route('/api/admin/users', methods=['GET'])
def api_admin_users():
    """Returns all registered farmers and admin users from MongoDB."""
    users = list(db.users.find({}))
    return jsonify({
        "success": True,
        "users": [format_user(u) for u in users],
        "total": len(users)
    })

@app.route('/api/admin/users/<user_id>', methods=['PUT'])
def api_admin_update_user(user_id):
    """Admin endpoint to modify any user's role, name, phone, kisan points, etc."""
    data = request.get_json(silent=True) or request.form.to_dict() or {}
    user = db.users.find_one({"$or": [{"_id": user_id}, {"id": user_id}]})
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404

    update_fields = {}
    if 'name' in data: update_fields['name'] = str(data['name']).strip()
    if 'phone' in data: update_fields['phone'] = str(data['phone']).strip()
    if 'email' in data: update_fields['email'] = str(data['email']).strip().lower()
    if 'role' in data and data['role'] in ['farmer', 'admin', 'seller']:
        update_fields['role'] = data['role']
    if 'farmSize' in data or 'farm_size' in data:
        fs = str(data.get('farmSize') or data.get('farm_size')).strip()
        update_fields['farmSize'] = fs
        update_fields['farm_size'] = fs
    if 'kisanRewards' in data or 'kisan_rewards' in data:
        try:
            pts = int(data.get('kisanRewards') or data.get('kisan_rewards'))
            update_fields['kisanRewards'] = pts
            update_fields['kisan_rewards'] = pts
        except ValueError:
            pass
    if 'village' in data: update_fields['village'] = str(data['village']).strip()
    if 'district' in data: update_fields['district'] = str(data['district']).strip()
    if 'state' in data: update_fields['state'] = str(data['state']).strip()

    if update_fields:
        db.users.update_one({"_id": user['_id']}, {"$set": update_fields})

    updated_user = db.users.find_one({"_id": user['_id']})
    return jsonify({
        "success": True,
        "message": f"User '{updated_user.get('name')}' updated successfully in MongoDB.",
        "user": format_user(updated_user)
    })

@app.route('/api/admin/users/<user_id>/reset-password', methods=['POST'])
def api_admin_reset_user_password(user_id):
    """Admin endpoint to reset a user's password."""
    data = request.get_json(silent=True) or request.form.to_dict() or {}
    new_password = data.get('newPassword') or data.get('new_password') or data.get('password')
    if not new_password or len(new_password) < 4:
        return jsonify({"success": False, "message": "Valid new password of at least 4 characters is required."}), 400

    user = db.users.find_one({"$or": [{"_id": user_id}, {"id": user_id}]})
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404

    new_hash = generate_password_hash(new_password)
    db.users.update_one({"_id": user['_id']}, {"$set": {"password_hash": new_hash}})
    return jsonify({"success": True, "message": f"Password for '{user.get('name')}' has been reset successfully."})

@app.route('/api/admin/users/<user_id>', methods=['DELETE'])
def api_admin_delete_user(user_id):
    """Admin endpoint to delete a user from MongoDB."""
    user = db.users.find_one({"$or": [{"_id": user_id}, {"id": user_id}]})
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404

    db.users.delete_one({"_id": user['_id']})
    return jsonify({"success": True, "message": f"User '{user.get('name')}' deleted from MongoDB."})

@app.route('/api/reset_demo_data', methods=['POST'])
def api_reset_demo_data():
    """Resets database to pristine sample data for fresh demonstration."""
    db.products.drop()
    db.sellers.drop()
    db.users.drop()
    db.reviews.drop()
    db.orders.drop()

    seed_database(db)
    session.clear()

    return jsonify({"success": True, "message": "Demo data reset successfully to pristine state!"})

# ==========================================
# MODERN REACT SPA SERVING ROUTE
# ==========================================

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    """
    Serves the compiled production React/Vite Single Page Application (frontend/dist).
    Falls back to index.html for client-side routing.
    """
    # Prevent catching unhandled API routes
    if path.startswith('api/'):
        return jsonify({"success": False, "message": f"API endpoint '/{path}' not found."}), 404

    # If static file exists in frontend/dist (e.g., vite.svg, favicon.ico)
    if path and os.path.exists(os.path.join(REACT_DIST_DIR, path)):
        return send_from_directory(REACT_DIST_DIR, path)

    # Serve modern React SPA entry point
    if os.path.exists(os.path.join(REACT_DIST_DIR, 'index.html')):
        return send_from_directory(REACT_DIST_DIR, 'index.html')

    # Fallback to Jinja template if build has not been run
    return render_template('index.html')

if __name__ == '__main__':
    print("=" * 60)
    print("🌾 AgriSeed – Online Agricultural Marketplace Prototype 🌾")
    print(f"🚀 Server running on http://127.0.0.1:{Config.PORT}")
    print(f"📦 Database Mode: {'Live MongoDB' if DatabaseManager.is_live_mongo() else 'Embedded JSON/In-Memory MongoDB'}")
    print("=" * 60)
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
