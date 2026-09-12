# Implementation Plan: AgriSeed Complete Modern Frontend Application

Preserve the existing Flask prototype on a dedicated `prototype` branch, create a new `frontend` branch, and develop a modern, production-grade frontend application using **React (Vite) + Tailwind CSS + Lucide Icons + React Router**.

---

## 🌿 Branching Strategy

1. **`prototype` branch:**
   - Create and push branch `prototype` tracking `origin/prototype` to permanently preserve the full-stack Flask prototype.
2. **`frontend` branch:**
   - Create and check out a new branch `frontend` (or `frontend-app`).
   - Push the branch to `origin/frontend`.

---

## 🎨 Proposed Frontend Architecture & Technology Stack

```
agri(proto)/
├── frontend/                     # React + Vite Application
│   ├── public/                   # Static assets, agricultural icons, logos
│   ├── src/
│   │   ├── assets/               # High-res seed & crop imagery
│   │   ├── components/           # Reusable UI component library
│   │   │   ├── common/           # Navbar, Footer, MobileNav, Toast, Modal, Button, Badge
│   │   │   ├── product/          # ProductCard, PackSelector, AgronomySpecsTable, ReviewList
│   │   │   ├── cart/             # CartDrawer, CartItem, CouponBox, OrderSummary
│   │   │   ├── order/            # OrderStepper, LogisticsCard, InvoiceView
│   │   │   └── home/             # HeroBanner, WeatherAdvisoryTicker, CategoryGrid, Testimonials
│   │   ├── context/              # Global React Contexts (CartContext, AuthContext, LanguageContext)
│   │   ├── pages/                # All 10+ Application Screens
│   │   │   ├── HomePage.jsx
│   │   │   ├── CatalogPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderTrackingPage.jsx
│   │   │   ├── FarmerDashboardPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── CropDoctorPage.jsx (AI Leaf Disease Diagnosis)
│   │   │   └── PresentationDeckPage.jsx
│   │   ├── services/             # API Client (Axios / Fetch with proxy to Flask & local mock fallback)
│   │   ├── data/                 # Rich initial mock database & localized strings (EN, HI, PA, TE)
│   │   ├── App.jsx               # Router & Layout Provider
│   │   ├── main.jsx              # App Entry Point
│   │   └── index.css             # Tailwind Directives & Custom Agriculture Emerald UI Theme
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
```

---

## 🌟 Key Frontend Features & Screens to Build

### 1. **Modern Agriculture Emerald UI Design System**
- Forest green (`#14532d`), emerald green (`#16a34a`), golden amber (`#d97706`), light mint (`#f0fdf4`), warm slate typography.
- Mobile-first responsive navigation with bottom mobile app bar and sticky desktop header.
- **Multilingual Support (i18n):** Instant language switcher across **English, Hindi (हिंदी), Punjabi (ਪੰਜਾਬੀ), and Telugu (తెలుగు)**.

### 2. **Farmer Onboarding & Auth**
- Quick modal login and dedicated auth page.
- Agriculture-specific profile registration (Farm Size in Acres, Primary Crops, Village, District).
- **1-Click Demo Logins** (`Demo Farmer` & `Demo Admin`) for live evaluations.

### 3. **Marketplace Catalog & Crop Discovery**
- 4 Primary Categories: 🌾 Seeds, 🧪 Fertilizers, 🌱 Pesticides, 🚜 Equipment.
- Instant search bar with live filtering by Crop Suitability (Paddy, Wheat, Cotton, Mustard, Vegetables).
- Price range sliders, sorting, stock badges, and grid/list view toggles.

### 4. **Product Details & Agronomy Precision**
- Dynamic Pack Size unit selector (1kg, 5kg, 25kg Bag) with real-time price recalculation.
- Comprehensive **Agronomy Specifications Table** (Germination Rate %, Purity %, Sowing Season, Maturity Days, Yield Potential/Acre, Dosage Guide).
- Verified Krishi Kendra Seller card with official government license numbers.
- Farmer Reviews section with star ratings and interactive review submission modal.

### 5. **Interactive Cart & Multi-Payment Checkout**
- Slide-out quick cart drawer + dedicated Cart view.
- Kisan Subsidy engine (`KISAN50` for 10% subsidy, `AGRISEED100` for ₹100 discount, free rural shipping threshold).
- Multi-Payment checkout: **UPI with simulated QR scanner & VPA**, **Debit/Credit Card**, and **Cash on Delivery (COD)**.

### 6. **5-Stage Live Order Tracking Pipeline**
- Animated visual milestone progress stepper:
  $$\text{Ordered} \longrightarrow \text{Confirmed} \longrightarrow \text{Shipped} \longrightarrow \text{Out for Delivery} \longrightarrow \text{Delivered}$$
- Logistics dispatch metadata (AgriExpress Rural Fleet, vehicle registration number, driver contact, timestamped activity log).
- Printable Official Agricultural Invoice.

### 7. **Farmer & Admin Portals**
- **Farmer Dashboard:** Kisan Rewards loyalty balance, active dispatches, complete order history, personalized seasonal crop advisory.
- **Admin Store Manager:** Real-time KPI cards, low-stock alerts, live order status coordinator (instantly updates customer tracking stepper), product inventory CRUD.

### 8. **Bonus: Krishi AI Crop Doctor**
- Upload or drag-and-drop leaf photos to detect crop diseases (e.g. Rice Leaf Blast, Cotton Bollworm, Wheat Rust) with recommended catalog remedies.

---

## 🧪 Verification Plan

### Automated & Build Verification
1. `npm install` and `npm run build` in `frontend/` to ensure zero compilation or syntax errors.
2. Verify all routes and components render cleanly with `npm run preview` or Vite dev server.

### Manual & Visual Verification
1. Test complete user flows: Registration ➔ Catalog Filter ➔ Pack Selection ➔ Add to Cart ➔ Apply `KISAN50` ➔ UPI / COD Checkout ➔ 5-Stage Live Order Tracking.
2. Test Admin Portal: Add new product, update stock, advance order statuses.
3. Test Multilingual Language Switcher across all screens.
4. Test responsive layout on mobile, tablet, and desktop viewports.

---

## 🚀 Git Operations
1. `git checkout -b prototype` ➔ `git push -u origin prototype`
2. `git checkout -b frontend` ➔ Commit frontend codebase ➔ `git push -u origin frontend`
