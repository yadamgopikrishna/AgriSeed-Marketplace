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
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config
from database import DatabaseManager
from seed_data import seed_database, SAMPLE_PRODUCTS, SAMPLE_SELLERS, SAMPLE_USERS, SAMPLE_REVIEWS, SAMPLE_ORDERS

app = Flask(__name__)
app.config.from_object(Config)

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
        return user_copy
    return None

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
# PAGE ROUTES
# ==========================================

@app.route('/')
def index():
    """Welcome / Splash Screen + Home Page."""
    featured_products = list(db.products.find({"is_featured": True}))
    popular_products = list(db.products.find({"is_popular": True}))
    all_products = list(db.products.find({}))
    
    # Calculate some dynamic counts
    category_counts = {
        'Seeds': db.products.count_documents({"category": "Seeds"}),
        'Fertilizers': db.products.count_documents({"category": "Fertilizers"}),
        'Pesticides': db.products.count_documents({"category": "Pesticides"}),
        'Farming Equipment': db.products.count_documents({"category": "Farming Equipment"})
    }
    
    return render_template(
        'index.html',
        featured_products=featured_products,
        popular_products=popular_products,
        total_products=len(all_products),
        category_counts=category_counts
    )

@app.route('/catalog')
def catalog():
    """Product Categories & Catalog Page with filters."""
    category = request.args.get('category', '')
    crop = request.args.get('crop', '')
    search = request.args.get('q', '')
    sort = request.args.get('sort', 'featured')

    query = {}
    if category and category != 'All':
        query['category'] = category
    if crop and crop != 'All':
        query['crop_suitability'] = {'$regex': crop, '$options': 'i'}
    if search:
        query['$or'] = [
            {'name': {'$regex': search, '$options': 'i'}},
            {'description': {'$regex': search, '$options': 'i'}},
            {'category': {'$regex': search, '$options': 'i'}},
            {'crop_suitability': {'$regex': search, '$options': 'i'}}
        ]

    products = list(db.products.find(query))

    # Apply sorting
    if sort == 'price_low':
        products.sort(key=lambda x: x.get('price', 0))
    elif sort == 'price_high':
        products.sort(key=lambda x: x.get('price', 0), reverse=True)
    elif sort == 'rating':
        products.sort(key=lambda x: x.get('rating', 0), reverse=True)

    categories = ["Seeds", "Fertilizers", "Pesticides", "Farming Equipment"]
    crops = ["Paddy / Rice", "Wheat", "Cotton", "Vegetables", "Mustard", "Corn / Maize"]

    return render_template(
        'catalog.html',
        products=products,
        selected_category=category,
        selected_crop=crop,
        search_query=search,
        selected_sort=sort,
        categories=categories,
        crops=crops,
        total_found=len(products)
    )

@app.route('/product/<product_id>')
def product_detail(product_id):
    """Product Details Page."""
    product = db.products.find_one({"_id": product_id})
    if not product:
        flash("Product not found", "error")
        return redirect(url_for('catalog'))

    seller = db.sellers.find_one({"_id": product.get('seller_id')}) or {}
    reviews = list(db.reviews.find({"product_id": product_id}))
    
    # Related products from same category
    related_products = list(db.products.find({
        "category": product.get('category'),
        "_id": {"$ne": product_id}
    }).limit(4))

    return render_template(
        'product_detail.html',
        product=product,
        seller=seller,
        reviews=reviews,
        related_products=related_products
    )

@app.route('/cart')
def cart():
    """Shopping Cart Page."""
    cart_items = session.get('cart', [])
    
    subtotal = sum(item['price'] * item['quantity'] for item in cart_items)
    discount = session.get('cart_discount', 0)
    coupon_code = session.get('coupon_code', None)
    
    delivery_charge = 0 if (subtotal >= 999 or subtotal == 0) else 75
    total = max(0, subtotal - discount + delivery_charge)

    return render_template(
        'cart.html',
        cart_items=cart_items,
        subtotal=subtotal,
        discount=discount,
        coupon_code=coupon_code,
        delivery_charge=delivery_charge,
        total=total
    )

@app.route('/checkout')
def checkout():
    """Checkout & Payment Page."""
    cart_items = session.get('cart', [])
    if not cart_items:
        flash("Your cart is empty. Add products to proceed with checkout.", "warning")
        return redirect(url_for('catalog'))

    current_user = get_current_user()
    subtotal = sum(item['price'] * item['quantity'] for item in cart_items)
    discount = session.get('cart_discount', 0)
    coupon_code = session.get('coupon_code', None)
    delivery_charge = 0 if subtotal >= 999 else 75
    total = max(0, subtotal - discount + delivery_charge)

    return render_template(
        'checkout.html',
        cart_items=cart_items,
        subtotal=subtotal,
        discount=discount,
        coupon_code=coupon_code,
        delivery_charge=delivery_charge,
        total=total,
        farmer=current_user
    )

@app.route('/orders/track/<order_id>')
def track_order_page(order_id):
    """Order Tracking Page."""
    order = db.orders.find_one({"_id": order_id})
    if not order:
        flash(f"Order #{order_id} not found.", "error")
        return redirect(url_for('index'))
    return render_template('order_tracking.html', order=order)

@app.route('/track')
def track_search_page():
    """Order Tracking Search / Lookup Page."""
    order_id = request.args.get('order_id', '').strip()
    if order_id:
        return redirect(url_for('track_order_page', order_id=order_id))
    return render_template('order_tracking.html', order=None)

@app.route('/dashboard')
def dashboard():
    """Farmer Account Dashboard."""
    current_user = get_current_user()
    if not current_user:
        flash("Please log in to access your farmer dashboard.", "info")
        return redirect(url_for('auth_page', next='/dashboard'))

    # Retrieve farmer orders
    orders = list(db.orders.find({"user_id": current_user['_id']}).sort("created_at", -1))
    
    # Active orders (not delivered yet)
    active_orders = [o for o in orders if o.get('status') != 'Delivered']
    
    return render_template(
        'dashboard.html',
        farmer=current_user,
        orders=orders,
        active_orders=active_orders
    )

@app.route('/admin')
def admin_page():
    """Admin Store Manager Dashboard."""
    current_user = get_current_user()
    # Check admin role if logged in, or allow viewing demo with warning
    is_admin = current_user and current_user.get('role') == 'admin'

    products = list(db.products.find({}))
    orders = list(db.orders.find({}).sort("created_at", -1))
    farmers = list(db.users.find({"role": "farmer"}))
    sellers = list(db.sellers.find({}))

    total_revenue = sum(o.get('total_amount', 0) for o in orders)
    low_stock_products = [p for p in products if p.get('stock', 0) <= 25]

    return render_template(
        'admin.html',
        products=products,
        orders=orders,
        farmers=farmers,
        sellers=sellers,
        total_revenue=total_revenue,
        low_stock_products=low_stock_products,
        is_admin=is_admin
    )

@app.route('/auth')
def auth_page():
    """Farmer Login & Registration Page."""
    if session.get('user_id'):
        return redirect(url_for('dashboard'))
    return render_template('auth.html')

@app.route('/presentation')
def presentation_page():
    """Interactive Slide Presentation Deck for College Project Submission."""
    return render_template('presentation.html')

# ==========================================
# REST API ENDPOINTS
# ==========================================

# --- AUTH APIs ---

@app.route('/api/auth/register', methods=['POST'])
def api_register():
    data = request.get_json(silent=True) or request.form.to_dict() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    password = data.get('password', '')
    village = data.get('village', '').strip()
    district = data.get('district', '').strip()
    state = data.get('state', '').strip()
    farm_size = data.get('farm_size', '2 Acres').strip()
    primary_crops = data.get('primary_crops', ['Wheat', 'Rice'])

    if not name:
        return jsonify({"success": False, "message": "Full Name is required."}), 400
    if not phone and not email:
        return jsonify({"success": False, "message": "Please provide either a Mobile Number or Email."}), 400
    if not password:
        # Default fallback password for quick 1-step registration
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
        "role": "farmer",
        "farm_size": farm_size or "5 Acres",
        "primary_crops": primary_crops if isinstance(primary_crops, list) else [c.strip() for c in str(primary_crops).split(',') if c.strip()],
        "village": village or "Krishi Nagar",
        "taluk": data.get('taluk', 'Taluk Center'),
        "district": district or "District Hub",
        "state": state or "Punjab",
        "pincode": data.get('pincode', '140001'),
        "kisan_rewards": 100, # 100 bonus welcome points
        "registered_host": request.host,
        "created_at": now_iso
    }

    # Insert into database (MongoDB / JSON persistent store)
    db.users.insert_one(new_user)
    session.permanent = True
    session['user_id'] = new_user['_id']
    session['user_role'] = 'farmer'
    session['user_name'] = new_user['name']

    print(f"[AUTH-REGISTRATION] Successfully saved user '{name}' ({new_user['phone']}) to MongoDB! Host: {request.host}")

    return jsonify({
        "success": True,
        "message": f"Welcome to AgriSeed, {name}! Your farmer account is registered (+100 Kisan Points).",
        "redirect": "/dashboard",
        "user": {k: v for k, v in new_user.items() if k != 'password_hash'}
    })

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    data = request.get_json(silent=True) or request.form.to_dict() or {}
    identity = data.get('identity', '').strip().lower()
    password = data.get('password', '')

    if not identity or not password:
        return jsonify({"success": False, "message": "Mobile/Email and Password are required."}), 400

    user = db.users.find_one({"$or": [{"email": identity}, {"phone": identity}]})
    if not user or not check_password_hash(user.get('password_hash', ''), password):
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
        "redirect": "/admin" if user.get('role') == 'admin' else "/dashboard"
    })

@app.route('/api/auth/demo_login', methods=['POST'])
def api_demo_login():
    """Instant 1-click login for college project demonstration."""
    data = request.get_json() or {}
    role = data.get('role', 'farmer')

    if role == 'admin':
        user = db.users.find_one({"role": "admin"})
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
        "redirect": "/admin" if user.get('role') == 'admin' else "/dashboard"
    })

@app.route('/api/auth/logout', methods=['GET', 'POST'])
def api_logout():
    session.pop('user_id', None)
    session.pop('user_role', None)
    session.pop('user_name', None)
    return jsonify({"success": True, "message": "Logged out successfully.", "redirect": "/"})

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

    products = list(db.products.find(query))
    return jsonify({"success": True, "count": len(products), "products": products})

@app.route('/api/products/<product_id>', methods=['GET'])
def api_get_product_detail(product_id):
    product = db.products.find_one({"_id": product_id})
    if not product:
        return jsonify({"success": False, "message": "Product not found"}), 404
    reviews = list(db.reviews.find({"product_id": product_id}))
    seller = db.sellers.find_one({"_id": product.get('seller_id')}) or {}
    return jsonify({"success": True, "product": product, "seller": seller, "reviews": reviews})

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

@app.route('/api/orders/create', methods=['POST'])
def api_create_order():
    data = request.get_json() or {}
    cart = session.get('cart', [])
    if not cart:
        return jsonify({"success": False, "message": "Cart is empty."}), 400

    current_user = get_current_user()
    user_id = current_user['_id'] if current_user else "guest_farmer"

    name = data.get('name', 'Farmer Patron')
    phone = data.get('phone', '9876543210')
    village = data.get('village', 'Village Farm')
    taluk = data.get('taluk', 'Tehsil')
    district = data.get('district', 'District')
    state = data.get('state', 'State')
    pincode = data.get('pincode', '110001')
    payment_method = data.get('payment_method', 'Cash on Delivery')

    subtotal = sum(item['price'] * item['quantity'] for item in cart)
    discount = session.get('cart_discount', 0)
    coupon_code = session.get('coupon_code', None)
    delivery_charge = 0 if subtotal >= 999 else 75
    total_amount = max(0, subtotal - discount + delivery_charge)

    # Generate unique readable Order ID
    order_id = f"AGRI-{random.randint(100000, 999999)}"
    now_str = datetime.utcnow().strftime("%Y-%m-%d %I:%M %p")
    estimated_del = (datetime.utcnow() + timedelta(days=3)).strftime("%Y-%m-%d")

    new_order = {
        "_id": order_id,
        "user_id": user_id,
        "user_name": name,
        "phone": phone,
        "delivery_address": {
            "name": name,
            "village": village,
            "taluk": taluk,
            "district": district,
            "state": state,
            "pincode": pincode,
            "phone": phone
        },
        "items": cart,
        "subtotal": subtotal,
        "discount": discount,
        "coupon_code": coupon_code,
        "delivery_charge": delivery_charge,
        "total_amount": total_amount,
        "payment_method": payment_method,
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
        "tracking_number": f"AX-{random.randint(100000, 999999)}",
        "driver_name": "Agri Logistics Team (+91 98000 12345)",
        "estimated_delivery": estimated_del,
        "created_at": datetime.utcnow().isoformat()
    }

    db.orders.insert_one(new_order)

    # Reduce product stock
    for item in cart:
        db.products.update_one(
            {"_id": item['product_id']},
            {"$inc": {"stock": -item['quantity']}}
        )

    # Clear cart
    session['cart'] = []
    session.pop('cart_discount', None)
    session.pop('coupon_code', None)
    session.modified = True

    return jsonify({
        "success": True,
        "message": f"Order #{order_id} placed successfully!",
        "order_id": order_id,
        "redirect": f"/orders/track/{order_id}"
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

@app.route('/api/admin/orders/<order_id>/status', methods=['PUT'])
def api_admin_update_order_status(order_id):
    data = request.get_json() or {}
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
        {"_id": order_id},
        {
            "$set": {"status": new_status},
            "$push": {"status_history": status_entry}
        }
    )

    return jsonify({"success": True, "message": f"Order #{order_id} status updated to '{new_status}'."})

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

if __name__ == '__main__':
    print("=" * 60)
    print("🌾 AgriSeed – Online Agricultural Marketplace Prototype 🌾")
    print(f"🚀 Server running on http://127.0.0.1:{Config.PORT}")
    print(f"📦 Database Mode: {'Live MongoDB' if DatabaseManager.is_live_mongo() else 'Embedded JSON/In-Memory MongoDB'}")
    print("=" * 60)
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
