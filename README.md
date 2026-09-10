# 🌾 AgriSeed – Online Agricultural Marketplace
> **"Quality Seeds. Better Crops. Better Future."**  
> *A Modern, Professional College Project Prototype for Agricultural E-Commerce*

---

## 📌 Project Overview & Problem Statement

In traditional agricultural supply chains, farmers heavily rely on multiple intermediaries, local middlemen, and unverified retail shops to purchase seeds, fertilizers, and pesticides. This causes:
1. **Inflated Input Costs:** Middlemen commissions inflate seed and fertilizer prices by 20% to 40%.
2. **Substandard & Counterfeit Inputs:** Spurious seeds with low germination rates and adulterated pesticides lead to crop failures.
3. **Lack of Transparency & Logistics:** Smallholder farmers in remote rural villages face difficulties accessing certified high-yield varieties directly from research bodies and certified cooperatives.

**AgriSeed** solves these challenges by establishing a **direct, transparent online agricultural marketplace** connecting farmers with verified seed corporations, certified bio-tech producers, and authorized Krishi Kendra cooperatives.

---

## 🚀 Key Prototype Features & Screens

### 1. 🌟 Welcome / Splash Screen
- AgriSeed branding with sprout logo and tagline: *"Quality Seeds. Better Crops. Better Future."*
- Direct call-to-actions: *"Explore Quality Seeds"* and *"Farmer Get Started"*.
- Key value propositions: Tested Germination Rate, Govt. Approved Sellers, Direct Rural Farm Delivery, and Zero Middlemen Markup.

### 2. 🏠 Home Page
- Smart live keyword search with category autocompletion.
- Krishi Weather & Sowing Advisory ticker for seasonal crop guidance (Kharif/Rabi sowing alerts).
- Category browser with instant item counters.
- Featured high-yield seeds and best-selling agricultural equipment with live ratings, crop badges, and verified seller seals.
- Special Kisan Promotion banner with 10% Kisan Subsidy coupon (`KISAN50`).
- Real farmer testimonials from Punjab, Haryana, and Maharashtra.

### 3. 🔑 Farmer Login & Registration
- Switchable authentication tab (Farmer Login & New Farmer Registration).
- Registration fields tailored to agriculture: Farm Land Size (Acres), Primary Crops (Wheat, Paddy, Cotton, etc.), Village, Tehsil, District, and State.
- **⚡ 1-Click Demo Login Buttons** (`Login as Farmer` & `Login as Admin`) for zero-friction project demonstrations and viva evaluations.

### 4. 📦 Product Categories & Advanced Catalog
- 4 Primary Agricultural Categories:
  - 🌾 **Seeds:** Pusa Basmati 1121, Shriram Super Wheat 1105, Bt Cotton Bollgard II, Abhinav Hybrid Tomato, Sweet Corn, Pusa Yellow Mustard.
  - 🧪 **Fertilizers:** 100% Water Soluble NPK 19:19:19, Cold-Pressed Organic Neem Cake, Chelated Zinc EDTA 12%.
  - 🌱 **Pesticides / Crop Protection:** Bio-Neem Shield (10,000 PPM), Kavach Bio-Larvicide & Caterpillar Control, Saaf Dual-Action Fungicide.
  - 🚜 **Farming Equipment:** KisanPro 16L Battery Sprayer, AgroTech 4-in-1 Digital Soil pH & NPK Meter, Manual Seed Drill, Micro Drip Irrigation Kits.
- Multi-dimensional filtering by Category, Crop Suitability (Paddy, Wheat, Cotton, Vegetables, Mustard, Corn), Price range, and Sorting (Price Low/High, Rating, Featured).

### 5. 📋 Rich Product Details Page
- High-definition product imagery and government certification seals.
- Dynamic Pack Size Selector (e.g., 1 kg Pack, 5 kg Pack, 25 kg Bag) with real-time price updates.
- Real-time stock status indicator with depot dispatch location.
- Detailed Agronomy Specifications Table: Germination Rate (%), Purity (%), Sowing Season, Maturity Period, Yield Potential, and Recommended Dosage per Acre.
- Verified Seller Information Card with official License Number, Depot City, and Contact details.
- Farmer Reviews breakdown with star ratings and interactive "Write a Review" modal.
- "Add to Cart" and instant "Buy Now" checkout actions.

### 6. 🛒 Shopping Cart
- Itemized cart with pack size, unit price, quantity steppers (`+` / `-`), and remove controls.
- Dynamic Rural Delivery Fee calculator (Free delivery on orders above ₹999).
- Promo coupon engine (`KISAN50` for 10% Kisan Subsidy, `AGRISEED100` for ₹100 flat off).
- Order price summary breakdown.

### 7. 💳 Checkout & Multi-Payment Gateway
- Farmer Delivery Address form with Village, Tehsil, District, State, and PIN code.
- 3 Interactive Payment Methods:
  - 📱 **UPI (Google Pay, PhonePe, Paytm, BHIM):** Interactive simulated QR code scanner and VPA ID input.
  - 💳 **Credit / Debit Card:** Secure card number, expiry, and CVV payment simulation.
  - 💵 **Cash on Delivery (COD):** Pay upon arrival at village doorstep.
- Seamless transition into the live order tracking workflow.

### 8. 🚚 5-Stage Live Order Tracking System
- Unique Order ID generator (`AGRI-XXXXXX`).
- Visual 5-milestone progress stepper:
  $$\text{Ordered} \longrightarrow \text{Confirmed} \longrightarrow \text{Shipped} \longrightarrow \text{Out for Delivery} \longrightarrow \text{Delivered}$$
- Logistics Dispatch Details: Courier Partner (AgriExpress Rural Fleet), Tracking AWB, Delivery Vehicle details, Driver Name & Contact, and Estimated Delivery date.
- Real-time dispatch activity log timeline.
- Printable Official Agricultural Invoice / Receipt generator.

### 9. 👨‍🌾 Farmer Dashboard
- Farmer profile card with land holding, registered crops, and **Kisan Rewards** loyalty points.
- Active dispatches with single-click live tracking shortcuts.
- Complete historical orders archive.
- District-level agronomy advisory recommendations based on farmer's registered crops.

### 10. 🛡️ Admin Dashboard & Store Management
- Key Performance Indicators (KPIs): Total Farmers, Total Products, Total Orders Processed, and Gross Revenue (₹).
- Inventory & Low-Stock Alert Hub.
- **Order Management:** Real-time dropdown to update order status (`Ordered` -> `Confirmed` -> `Shipped` -> `Out for Delivery` -> `Delivered`), which instantly updates the farmer's live tracking view.
- **Product Management:** Full CRUD operations (Add new agricultural product with specifications and images, update stock levels, delete product).
- **Farmers & Sellers Directory:** Comprehensive registry of all farmers and certified vendors.
- **Reset Demo Database Button:** One-click reset to pristine state for fresh project evaluations.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Modern, responsive, farmer-friendly agricultural interface with high legibility, custom cards, steppers, and modals. |
| **Backend** | Python Flask (3.12+) | Lightweight, high-performance RESTful routing and API architecture. |
| **Database** | MongoDB (PyMongo) | Flexible document-based storage. Includes an automatic zero-config fallback storage engine so the prototype runs out-of-the-box on any machine even without a local MongoDB service. |
| **Styling** | Custom Agriculture UI Design System | Forest Greens (`#15803d`, `#166534`), Golden Wheat (`#d97706`), Light Mint (`#f0fdf4`), High contrast typography. |
| **Version Control** | Git & GitHub | Modular codebase structure with clean commit history. |

---

## 📂 Project Directory Structure

```
agriseed/
├── app.py                      # Main Flask application with REST API endpoints & routes
├── config.py                   # Configuration parameters & environment settings
├── database.py                 # MongoDB connection manager with automated fallback engine
├── seed_data.py                # Preloaded sample products, sellers, demo users & initial orders
├── requirements.txt            # Python dependencies
├── run.py                      # Startup script with terminal banner & port detector
├── start.bat                   # 1-Click Windows launch script
├── test_app.py                 # Automated unit test suite verifying all 10 screens & APIs
├── static/
│   ├── css/
│   │   └── style.css           # Agricultural styling, stepper animations, and responsive layouts
│   └── js/
│       ├── app.js              # Cart state, auth handlers, coupon calculator, and toasts
│       └── admin.js            # Admin CRUD actions and order status lifecycle coordinator
├── templates/
│   ├── base.html               # Master layout with header, search, and footer
│   ├── index.html              # Welcome Splash & Home Page (Featured, Categories, Advisory)
│   ├── catalog.html            # Category & Product filtering (Seeds, Fertilizers, Pesticides, Equipment)
│   ├── product_detail.html     # Rich product detail view (Specs, reviews, pack size selector)
│   ├── cart.html               # Shopping cart with quantity steppers & promo discount calculator
│   ├── checkout.html           # 3-step checkout with delivery address and UPI/Card/COD payments
│   ├── order_tracking.html     # 5-stage live order tracking stepper and printable invoice
│   ├── dashboard.html          # Farmer Account Dashboard (My Orders, Profile, Kisan Rewards)
│   ├── admin.html              # Admin Store Manager (KPI stats, Products CRUD, Orders tracker)
│   └── auth.html               # Farmer Login & Registration with 1-Click Demo buttons
└── README.md                   # Complete college project documentation
```

---

## ⚡ How to Run the Project

### Prerequisites
- Python 3.9+ installed on your computer.

### Step 1: Install Dependencies
Open your terminal or command prompt in the project root directory and run:
```bash
pip install -r requirements.txt
```

### Step 2: Start the Application
Run using Python:
```bash
python run.py
```
*(Or simply double-click `start.bat` on Windows)*

### Step 3: Open in Browser
Open your web browser and navigate to:
```
http://127.0.0.1:5000
```

---

## 🔑 Pre-Configured Demo Credentials

| Role | Email / Identity | Password | Description |
|---|---|---|---|
| **Farmer (Ramesh Singh)** | `farmer@agriseed.in` | `farmer123` | Progressive farmer in Karnal with active orders, farm profile, and Kisan rewards. |
| **Admin / Store Manager** | `admin@agriseed.in` | `admin123` | Full access to product catalog CRUD, order status updating, and store analytics. |

*(Note: You can also use the **1-Click Demo Login** buttons on the Login page or navigation bar to instantly log in with one click during project presentation).*

---

## 🧪 Automated Testing

To run the automated unit test suite verifying all 7 test suites (Home, Catalog, Product Details, Cart, Auth, Checkout & Orders, Admin):
```bash
python test_app.py
```

---

## 📜 Prototype Demonstration Flow

$$\text{Splash / Welcome} \longrightarrow \text{Farmer Login} \longrightarrow \text{Browse Catalog} \longrightarrow \text{Filter by Crop / Category} \longrightarrow \text{View Product Details \& Specs}$$
$$\downarrow$$
$$\text{Add to Cart} \longrightarrow \text{Apply Coupon (KISAN50)} \longrightarrow \text{Checkout \& Address} \longrightarrow \text{Choose UPI / COD Payment} \longrightarrow \text{Place Order}$$
$$\downarrow$$
$$\text{Live 5-Stage Order Tracking} \longrightarrow \text{Farmer Dashboard} \longleftrightarrow \text{Admin Dashboard (Update Status to Shipped / Delivered)}$$

---

## 🎓 Academic Presentation Summary
- **Domain:** AgriTech / E-Commerce Systems
- **Platform:** AgriSeed – Online Agricultural Marketplace
- **Objective:** Eliminating middlemen in agricultural procurement by connecting rural farmers directly to certified seed producers and cooperatives.
