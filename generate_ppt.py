import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# Ensure UTF-8 on Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

def create_presentation():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    DARK_GREEN = RGBColor(20, 83, 45)      # #14532d
    FOREST_GREEN = RGBColor(22, 101, 52)   # #166534
    EMERALD = RGBColor(34, 197, 94)        # #22c55e
    LIGHT_MINT = RGBColor(240, 253, 244)   # #f0fdf4
    AMBER = RGBColor(217, 119, 6)          # #d97706
    AMBER_LIGHT = RGBColor(254, 243, 199)  # #fef3c7
    SLATE_DARK = RGBColor(15, 23, 42)      # #0f172a
    SLATE_MUTED = RGBColor(100, 116, 139)  # #64748b
    WHITE = RGBColor(255, 255, 255)
    LIGHT_GRAY = RGBColor(248, 250, 252)   # #f8fafc
    BORDER_COLOR = RGBColor(226, 232, 240)

    def add_header(slide, title_text, category_text="AGRISEED PROJECT PRESENTATION"):
        # Top banner background
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(1.1))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p0 = tf.paragraphs[0]
        p0.text = category_text.upper()
        p0.font.size = Pt(11)
        p0.font.bold = True
        p0.font.color.rgb = AMBER
        
        p1 = tf.add_paragraph()
        p1.text = title_text
        p1.font.size = Pt(24)
        p1.font.bold = True
        p1.font.color.rgb = DARK_GREEN
        
        # Horizontal accent line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.55), Inches(11.7), Inches(0.04))
        line.fill.solid()
        line.fill.fore_color.rgb = EMERALD
        line.line.color.rgb = EMERALD

    def add_card(slide, left, top, width, height, title, content_list, icon="🌱", bg_color=WHITE, border_color=BORDER_COLOR, title_color=DARK_GREEN):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)

        tx = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), height - Inches(0.4))
        tf = tx.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p0 = tf.paragraphs[0]
        p0.text = f"{icon}  {title}"
        p0.font.size = Pt(16)
        p0.font.bold = True
        p0.font.color.rgb = title_color
        p0.space_after = Pt(10)

        for item in content_list:
            p = tf.add_paragraph()
            p.text = f"• {item}"
            p.font.size = Pt(13)
            p.font.color.rgb = SLATE_DARK
            p.space_after = Pt(6)

    # -------------------------------------------------------------
    # SLIDE 1: Title Slide (Hero Dark Green)
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = DARK_GREEN
    bg1.line.fill.background()

    # Title content
    tx_title = slide1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11), Inches(4.5))
    tf1 = tx_title.text_frame
    tf1.word_wrap = True
    
    p0 = tf1.paragraphs[0]
    p0.text = "🌱 AGRISEED"
    p0.font.size = Pt(44)
    p0.font.bold = True
    p0.font.color.rgb = WHITE
    
    p1 = tf1.add_paragraph()
    p1.text = "Online Agricultural Marketplace"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = EMERALD
    p1.space_after = Pt(14)

    p2 = tf1.add_paragraph()
    p2.text = "“Quality Seeds. Better Crops. Better Future.”"
    p2.font.size = Pt(22)
    p2.font.italic = True
    p2.font.color.rgb = AMBER_LIGHT
    p2.space_after = Pt(28)

    p3 = tf1.add_paragraph()
    p3.text = "A Direct-to-Farmer Marketplace Disintermediating Agricultural Supply Chains"
    p3.font.size = Pt(16)
    p3.font.color.rgb = WHITE
    p3.space_after = Pt(8)

    p4 = tf1.add_paragraph()
    p4.text = "Academic Capstone Project & Prototype Demonstration  |  Python Flask • MongoDB • Modern UI"
    p4.font.size = Pt(13)
    p4.font.color.rgb = EMERALD

    # -------------------------------------------------------------
    # SLIDE 2: Vision & Mission
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "Project Vision & Core Purpose", "FOUNDATION & MOTIVATION")
    
    add_card(slide2, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "The Vision",
             [
                 "Empower Indian smallholder farmers through transparent digital procurement.",
                 "Eliminate predatory middlemen margins that inflate cultivation costs.",
                 "Ensure 100% access to certified, high-germination seed varieties across remote villages."
             ], "🌟", LIGHT_MINT, EMERALD, DARK_GREEN)

    add_card(slide2, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "The Mission",
             [
                 "Direct linkage between verified Krishi Kendra cooperatives and farmers.",
                 "Complete agronomic transparency: germination %, purity, and dosage guidance.",
                 "End-to-end 5-stage rural delivery tracking directly to farm gates."
             ], "🎯", WHITE, BORDER_COLOR, DARK_GREEN)

    add_card(slide2, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "Key Impact Metrics",
             [
                 "20% - 30% reduction in seed and fertilizer input procurement costs.",
                 "90%+ guaranteed germination emergence from certified seed lots.",
                 "Zero spurious chemical residue risk with authentic producer licensing."
             ], "📈", AMBER_LIGHT, AMBER, AMBER)

    # -------------------------------------------------------------
    # SLIDE 3: The Real-World Problem Statement
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "The Real-World Agricultural Crisis", "PROBLEM STATEMENT")

    add_card(slide3, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "1. Middlemen Exploitation",
             [
                 "Complex 4-tier intermediaries: Producer ➔ State Distributor ➔ Mandi Agent ➔ Village Retailer.",
                 "Commissions inflate input costs by 25% to 40% before reaching farmers.",
                 "Lack of transparent price discovery for rural growers."
             ], "📉", WHITE, BORDER_COLOR, RGBColor(185, 28, 28))

    add_card(slide3, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "2. Spurious & Fake Inputs",
             [
                 "Over 30% of local mandi seeds suffer from poor germination (< 60%).",
                 "Adulterated chemical pesticides cause widespread crop failure and soil toxicity.",
                 "No verified provenance or testing batch verification for farmers."
             ], "⚠️", WHITE, BORDER_COLOR, RGBColor(185, 28, 28))

    add_card(slide3, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "3. Rural Logistics Barrier",
             [
                 "Farmers waste valuable farming days traveling 30-50 km to city mandi shops.",
                 "Lack of doorstep transport for heavy 40kg seed bags and fertilizer pouches.",
                 "Zero tracking or estimated arrival notifications for sowing schedules."
             ], "🚚", WHITE, BORDER_COLOR, RGBColor(185, 28, 28))

    # -------------------------------------------------------------
    # SLIDE 4: The AgriSeed Solution Architecture
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, "The AgriSeed Direct Marketplace Model", "SOLUTION ARCHITECTURE")

    add_card(slide4, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.1),
             "Traditional Broken Supply Chain",
             [
                 "Seed Producer (National Seed Corp / ICAR)",
                 "      ⬇ (takes 10% cut)",
                 "State Distributor / Wholesaler",
                 "      ⬇ (takes 12% cut)",
                 "City Mandi Commission Agent",
                 "      ⬇ (takes 15% cut)",
                 "Local Village Unverified Trader",
                 "      ⬇",
                 "Farmer (Pays 40% Extra + High Risk of Fake Seeds)"
             ], "❌", RGBColor(254, 242, 242), RGBColor(254, 202, 202), RGBColor(185, 28, 28))

    add_card(slide4, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.1),
             "AgriSeed Direct-to-Farmer Model",
             [
                 "Verified Seed Producers & Cooperatives",
                 "      ↕ Direct Connection (0% Commission Middlemen)",
                 "AGRISEED DIGITAL AGRICULTURAL MARKETPLACE",
                 "  • Certified Government License Verification",
                 "  • Agronomic Technical Specifications & Sowing Advisory",
                 "  • Dynamic Pack Size Pricing & Kisan Subsidy Discounts",
                 "  • 5-Stage Live Dispatch Tracking (AgriExpress Fleet)",
                 "      ↕",
                 "Progressive Farmers (Direct Farm Gate Village Delivery)"
             ], "✅", LIGHT_MINT, EMERALD, DARK_GREEN)

    # -------------------------------------------------------------
    # SLIDE 5: Technology Stack & Engineering Design
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, "Full-Stack Technology Architecture", "TECHNICAL IMPLEMENTATION")

    add_card(slide5, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "Frontend Presentation",
             [
                 "Semantic HTML5 & Modern Responsive CSS",
                 "Agricultural Emerald UI Design System (Green, Amber, Mint).",
                 "Vanilla JavaScript (ES6+) for dynamic pack pricing & cart state.",
                 "Interactive Asynchronous Modals, QR Code simulation & Toasts."
             ], "💻", WHITE, BORDER_COLOR, DARK_GREEN)

    add_card(slide5, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "Backend Application",
             [
                 "Python Flask (v3.12+) Modular REST API Architecture.",
                 "Jinja2 Server-Side Templating Engine with context injection.",
                 "Role-Based Access Control (Farmer vs. Admin Manager).",
                 "Werkzeug SHA-256 encrypted password hashing."
             ], "⚙️", WHITE, BORDER_COLOR, DARK_GREEN)

    add_card(slide5, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "Database & Resilience",
             [
                 "MongoDB NoSQL Document Store for heterogeneous products.",
                 "Dual-Mode Connection Engine: Native PyMongo connection.",
                 "Automated Embedded JSON Fallback Engine (Zero-Config startup).",
                 "100% Reliable Execution for College Viva on any computer."
             ], "🗄️", LIGHT_MINT, EMERALD, DARK_GREEN)

    # -------------------------------------------------------------
    # SLIDE 6: 10 Integrated Prototype Screens
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "10-Screen Complete User Journey", "PROTOTYPE OVERVIEW")

    add_card(slide6, Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.4),
             "Discovery & Authentication",
             [
                 "1. Welcome / Splash Screen: Sprout branding & value badges.",
                 "2. Home Page: Search, category counts & Krishi Advisory ticker.",
                 "3. Farmer Auth: Login, Farm registration & 1-Click Demo logins."
             ], "🌾", WHITE, BORDER_COLOR, DARK_GREEN)

    add_card(slide6, Inches(6.8), Inches(1.8), Inches(5.7), Inches(2.4),
             "Catalog & Agronomy Details",
             [
                 "4. Product Categories: 4 departments & crop filters.",
                 "5. Product Details: Dynamic pack selector, specs & reviews.",
                 "6. Shopping Cart: Quantity steppers & Kisan subsidy engine."
             ], "📋", WHITE, BORDER_COLOR, DARK_GREEN)

    add_card(slide6, Inches(0.8), Inches(4.4), Inches(5.6), Inches(2.5),
             "Checkout & Logistics Tracking",
             [
                 "7. Checkout: Village address & UPI/Card/COD payments.",
                 "8. Order Tracking: 5-stage live dispatch progress stepper."
             ], "🚚", WHITE, BORDER_COLOR, DARK_GREEN)

    add_card(slide6, Inches(6.8), Inches(4.4), Inches(5.7), Inches(2.5),
             "Dashboards & Management",
             [
                 "9. Farmer Dashboard: Active dispatches, farm profile & points.",
                 "10. Admin Dashboard: Store KPIs, Product CRUD & Order Manager."
             ], "🛡️", LIGHT_MINT, EMERALD, DARK_GREEN)

    # -------------------------------------------------------------
    # SLIDE 7: Deep Dive: Product Catalog & Agronomy Specs
    # -------------------------------------------------------------
    slide7 = prs.slides.add_slide(blank_layout)
    add_header(slide7, "Agricultural Catalog & Agronomic Precision", "CORE FEATURES")

    add_card(slide7, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "4 Primary Departments",
             [
                 "🌾 Certified Seeds: Basmati Rice, Wheat 1105, Bt Cotton, Hybrid Tomato, Mustard.",
                 "🧪 Fertilizers: NPK 19:19:19 Soluble, Organic Neem Cake, Zinc EDTA 12%.",
                 "🌱 Crop Protection: Bio-Neem Shield (10,000 PPM), Kavach Bio-Larvicide, Fungicide.",
                 "🚜 Farming Equipment: 16L Battery Sprayer, Manual Seed Drill, Drip Kits."
             ], "📦", WHITE, BORDER_COLOR, DARK_GREEN)

    add_card(slide7, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "Agronomic Technical Data",
             [
                 "Germination Emergence Rate (e.g. 92-95%).",
                 "Genetic Purity & Moisture Content standards.",
                 "Sowing Season & Maturity Period (Days).",
                 "Yield Potential per Acre expectation.",
                 "Dosage & Sowing Guide per hectare/acre."
             ], "📋", LIGHT_MINT, EMERALD, DARK_GREEN)

    add_card(slide7, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "Dynamic Pack Pricing",
             [
                 "Interactive Unit Pack Selector: 1 kg, 5 kg, 25 kg Bag / 500ml, 1L.",
                 "Client-side instant price recalculation.",
                 "Real-time regional stock inventory tracker.",
                 "Verified producer license & contact transparency."
             ], "⚡", AMBER_LIGHT, AMBER, AMBER)

    # -------------------------------------------------------------
    # SLIDE 8: Deep Dive: Checkout, Payment & Subsidies
    # -------------------------------------------------------------
    slide8 = prs.slides.add_slide(blank_layout)
    add_header(slide8, "Kisan Subsidy & Multi-Payment Checkout", "TRANSACTIONS & SUBSIDIES")

    add_card(slide8, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "Kisan Subsidy Engine",
             [
                 "Coupon code 'KISAN50' applies 10% direct farmer subsidy.",
                 "Coupon 'AGRISEED100' provides flat ₹100 discount.",
                 "Automated Free Delivery rule on orders above ₹999 across rural districts.",
                 "Real-time subtotal, savings, and net payable calculation."
             ], "🏷️", AMBER_LIGHT, AMBER, AMBER)

    add_card(slide8, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "3 Payment Gateways",
             [
                 "📱 UPI (Google Pay, PhonePe, Paytm, BHIM): Dynamic QR code & VPA input.",
                 "💳 Debit / Credit Card: Card number, expiry, CVV & OTP validation.",
                 "💵 Cash on Delivery (COD): Pay on village farm gate delivery after inspecting seed seal."
             ], "💳", WHITE, BORDER_COLOR, DARK_GREEN)

    add_card(slide8, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "Farm Delivery Logistics",
             [
                 "Village, Tehsil, District, and State localized addressing.",
                 "Automated SMS/Phone notification for delivery.",
                 "Instant unique Order ID generation (#AGRI-XXXXXX).",
                 "Stock inventory auto-decrement on order placement."
             ], "📍", LIGHT_MINT, EMERALD, DARK_GREEN)

    # -------------------------------------------------------------
    # SLIDE 9: Deep Dive: 5-Stage Live Order Tracking
    # -------------------------------------------------------------
    slide9 = prs.slides.add_slide(blank_layout)
    add_header(slide9, "5-Stage Rural Order Tracking Stepper", "LOGISTICS TRANSPARENCY")

    add_card(slide9, Inches(0.8), Inches(1.8), Inches(11.7), Inches(2.2),
             "5-Milestone Lifecycle Progress Stepper",
             [
                 "[ 1. Ordered ]  ➔  [ 2. Confirmed ]  ➔  [ 3. Shipped ]  ➔  [ 4. Out for Delivery ]  ➔  [ 5. Delivered ]",
                 "Visual progress bar dynamically moves based on real-time fulfillment stage.",
                 "Admin status updates in Store Management Console immediately reflect on the farmer's live tracker!"
             ], "🚚", LIGHT_MINT, EMERALD, DARK_GREEN)

    add_card(slide9, Inches(0.8), Inches(4.3), Inches(5.6), Inches(2.6),
             "Logistics Dispatch Metadata",
             [
                 "Courier Partner: AgriExpress Rural Fleet.",
                 "AWB Number & Vehicle Registration (e.g. HR-05-AB-7721).",
                 "Driver Name & Direct Contact Phone number.",
                 "Estimated farm arrival date (3-4 business days)."
             ], "📋", WHITE, BORDER_COLOR, DARK_GREEN)

    add_card(slide9, Inches(6.8), Inches(4.3), Inches(5.7), Inches(2.6),
             "Activity Log & Official Bill",
             [
                 "Chronological timestamped depot log entries.",
                 "Printable Official Agricultural Invoice with tax breakdowns.",
                 "Eligible for government subsidy reimbursement records."
             ], "🖨️", WHITE, BORDER_COLOR, DARK_GREEN)

    # -------------------------------------------------------------
    # SLIDE 10: Deep Dive: Admin Dashboard & Store Management
    # -------------------------------------------------------------
    slide10 = prs.slides.add_slide(blank_layout)
    add_header(slide10, "Admin Store Manager & Order Logistics", "ADMINISTRATIVE CONTROL")

    add_card(slide10, Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.4),
             "Store KPIs & Stock Alerts",
             [
                 "Real-time metric cards: Total Registered Farmers, Catalog Items, Orders, Revenue.",
                 "Low-stock inventory badges flagging items under 25 units at regional depots."
             ], "📊", WHITE, BORDER_COLOR, DARK_GREEN)

    add_card(slide10, Inches(6.8), Inches(1.8), Inches(5.7), Inches(2.4),
             "Live Order Status Coordinator",
             [
                 "Dropdown control to advance orders through the 5 fulfillment stages.",
                 "Directly synchronizes with the customer's live tracking stepper view."
             ], "🔄", LIGHT_MINT, EMERALD, DARK_GREEN)

    add_card(slide10, Inches(0.8), Inches(4.4), Inches(5.6), Inches(2.5),
             "Product Catalog CRUD",
             [
                 "Add New Product Modal with agronomy specifications, season, price & stock.",
                 "Delete and modify existing products in the store catalog."
             ], "🌾", WHITE, BORDER_COLOR, DARK_GREEN)

    add_card(slide10, Inches(6.8), Inches(4.4), Inches(5.7), Inches(2.5),
             "Farmer & Seller Directory",
             [
                 "Complete directory of registered farmers, land holdings, and Kisan points.",
                 "Verified seed vendor registry with authorized government license records."
             ], "🏢", WHITE, BORDER_COLOR, DARK_GREEN)

    # -------------------------------------------------------------
    # SLIDE 11: Database Design & Zero-Config Resilience
    # -------------------------------------------------------------
    slide11 = prs.slides.add_slide(blank_layout)
    add_header(slide11, "MongoDB Schema & Database Resilience", "DATA ARCHITECTURE")

    add_card(slide11, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "5 Core Collections",
             [
                 "users: Farmers (land size, crops, village) & Admin roles.",
                 "products: Seeds, Fertilizers, Pesticides, Equipment with specs.",
                 "sellers: Authorized Krishi Kendra vendors with license numbers.",
                 "orders: Subtotal, items, status history, courier details.",
                 "reviews: Farmer field ratings & comments."
             ], "🗄️", WHITE, BORDER_COLOR, DARK_GREEN)

    add_card(slide11, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "Why MongoDB NoSQL?",
             [
                 "Heterogeneous product schemas without complex SQL sparse tables.",
                 "Embedded status_history arrays for chronological timeline logs.",
                 "JSON document flexibility for varying agricultural attributes.",
                 "Fast query execution for multi-faceted crop filtering."
             ], "💡", LIGHT_MINT, EMERALD, DARK_GREEN)

    add_card(slide11, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "Dual-Mode Resilience",
             [
                 "Connects to Live MongoDB (port 27017) if available.",
                 "Auto-fallback to Embedded JSON-persisted Database Engine if MongoDB is offline.",
                 "100% Zero-Config execution for College Viva on any computer!"
             ], "🛡️", AMBER_LIGHT, AMBER, AMBER)

    # -------------------------------------------------------------
    # SLIDE 12: Testing, Validation & Measurable Impact
    # -------------------------------------------------------------
    slide12 = prs.slides.add_slide(blank_layout)
    add_header(slide12, "Testing, Validation & Project Impact", "EVALUATION & RESULTS")

    add_card(slide12, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.1),
             "Automated Test Suite (100% Pass)",
             [
                 "test_01: Welcome / Splash & Home Page rendering [PASS]",
                 "test_02: Catalog filtering & crop suitability search [PASS]",
                 "test_03: Product details & farmer review submission [PASS]",
                 "test_04: Cart quantity steppers & Kisan subsidy coupon [PASS]",
                 "test_05: Farmer auth & 1-click Demo Logins [PASS]",
                 "test_06: Checkout, UPI payment & Order creation [PASS]",
                 "test_07: Admin Dashboard, Order Status & Product CRUD [PASS]",
                 "",
                 "Result: All 7 test suites passed successfully with zero errors."
             ], "🧪", LIGHT_MINT, EMERALD, DARK_GREEN)

    add_card(slide12, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.1),
             "Measurable Socio-Economic Impact",
             [
                 "25-30% Reduction in Agricultural Input Costs: Removing middlemen margins saves thousands of rupees per harvest.",
                 "90%+ Guaranteed Germination: Eliminates the devastating risk of fake seeds.",
                 "Direct Farm-Gate Logistics: Saves 2-3 working days per sowing cycle.",
                 "Digital Literacy & Empowerment: Simple, intuitive, large-button UI tailored for rural farmers."
             ], "🌱", WHITE, BORDER_COLOR, DARK_GREEN)

    # -------------------------------------------------------------
    # SLIDE 13: Future Scope & Roadmap
    # -------------------------------------------------------------
    slide13 = prs.slides.add_slide(blank_layout)
    add_header(slide13, "Future Enhancements & Scalability", "FUTURE ROADMAP")

    add_card(slide13, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "1. AI Crop Disease Diagnostics",
             [
                 "Integrate Deep Learning (CNN) vision model to detect leaf diseases from phone photos.",
                 "Instantly recommends certified organic or chemical remedies available in the catalog."
             ], "🤖", WHITE, BORDER_COLOR, DARK_GREEN)

    add_card(slide13, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "2. Multilingual Voice AI",
             [
                 "Add Speech-to-Text and Voice Assistant in Hindi, Punjabi, Marathi, Telugu, Tamil, and Bengali.",
                 "Allows farmers with lower literacy to order seeds by simply speaking."
             ], "🎙️", LIGHT_MINT, EMERALD, DARK_GREEN)

    add_card(slide13, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.1),
             "3. IoT Soil & Weather Sync",
             [
                 "Connect low-cost IoT soil NPK/moisture sensors to farmer dashboard.",
                 "Automated predictive fertilizer dosage and irrigation alerts."
             ], "📡", AMBER_LIGHT, AMBER, AMBER)

    # -------------------------------------------------------------
    # SLIDE 14: Conclusion & Demo Summary
    # -------------------------------------------------------------
    slide14 = prs.slides.add_slide(blank_layout)
    bg14 = slide14.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg14.fill.solid()
    bg14.fill.fore_color.rgb = DARK_GREEN
    bg14.line.fill.background()

    tx14 = slide14.shapes.add_textbox(Inches(1.2), Inches(1.5), Inches(11), Inches(5))
    tf14 = tx14.text_frame
    tf14.word_wrap = True

    p0 = tf14.paragraphs[0]
    p0.text = "🌾 AgriSeed: Ready for Live Demonstration"
    p0.font.size = Pt(36)
    p0.font.bold = True
    p0.font.color.rgb = WHITE
    p0.space_after = Pt(14)

    p1 = tf14.add_paragraph()
    p1.text = "“Transforming Agricultural Procurement for a Self-Reliant India (Atmanirbhar Krishi)”"
    p1.font.size = Pt(20)
    p1.font.italic = True
    p1.font.color.rgb = AMBER_LIGHT
    p1.space_after = Pt(28)

    p2 = tf14.add_paragraph()
    p2.text = "⚡ Live Prototype Link: http://127.0.0.1:5000"
    p2.font.size = Pt(18)
    p2.font.bold = True
    p2.font.color.rgb = EMERALD
    p2.space_after = Pt(8)

    p3 = tf14.add_paragraph()
    p3.text = "• Farmer Demo: farmer@agriseed.in (farmer123)   |   • Admin Demo: admin@agriseed.in (admin123)"
    p3.font.size = Pt(14)
    p3.font.color.rgb = WHITE
    p3.space_after = Pt(28)

    p4 = tf14.add_paragraph()
    p4.text = "Thank You! Questions & Discussion are warmly welcomed."
    p4.font.size = Pt(22)
    p4.font.bold = True
    p4.font.color.rgb = WHITE

    # Save PPTX
    output_path = os.path.join("g:\\agri(proto)", "AgriSeed_Project_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == '__main__':
    create_presentation()
