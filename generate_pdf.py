import sys
import os
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# Configure UTF-8 stdout
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

class NumberedCanvas(canvas.Canvas):
    """Canvas for adding page numbers and running header/footer."""
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))

        # Do not draw on cover page if page == 1
        if self._pageNumber > 1:
            # Header
            self.drawString(54, 11 * inch - 36, "AgriSeed – Online Agricultural Marketplace (Project Guide)")
            self.drawRightString(8.5 * inch - 54, 11 * inch - 36, "College Project Prototype")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)

            # Footer
            self.line(54, 45, 8.5 * inch - 54, 45)
            self.drawString(54, 32, "Confidential • Academic Capstone & Project Evaluation Document")
            self.drawRightString(8.5 * inch - 54, 32, f"Page {self._pageNumber} of {page_count}")

        self.restoreState()

def build_pdf(filename="AgriSeed_Comprehensive_Project_Guide.pdf"):
    pdf_path = os.path.join("g:\\agri(proto)", filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY_DARK = colors.HexColor("#14532d")
    PRIMARY_GREEN = colors.HexColor("#16a34a")
    EMERALD = colors.HexColor("#22c55e")
    AMBER = colors.HexColor("#d97706")
    SLATE_DARK = colors.HexColor("#0f172a")
    SLATE_MUTED = colors.HexColor("#475569")
    BG_MINT = colors.HexColor("#f0fdf4")
    BG_AMBER = colors.HexColor("#fef3c7")
    BG_LIGHT = colors.HexColor("#f8fafc")
    BORDER_COLOR = colors.HexColor("#e2e8f0")

    # Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=PRIMARY_DARK,
        spaceAfter=8
    )

    tagline_style = ParagraphStyle(
        'CoverTagline',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=14,
        leading=18,
        textColor=AMBER,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'CustomH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=PRIMARY_DARK,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'CustomH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=PRIMARY_GREEN,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=SLATE_DARK,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'CustomBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=SLATE_DARK,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=3
    )

    box_text_style = ParagraphStyle(
        'BoxText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=PRIMARY_DARK
    )

    qa_q_style = ParagraphStyle(
        'QA_Question',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=PRIMARY_DARK,
        spaceBefore=6,
        spaceAfter=2,
        keepWithNext=True
    )

    qa_a_style = ParagraphStyle(
        'QA_Answer',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=SLATE_DARK,
        spaceAfter=8
    )

    story = []

    # =========================================================================
    # COVER / HEADER BLOCK
    # =========================================================================
    story.append(Paragraph("🌾 AGRISEED PROTOTYPE", ParagraphStyle('SubHeader', fontName='Helvetica-Bold', fontSize=10, textColor=AMBER, spaceAfter=4)))
    story.append(Paragraph("AgriSeed – Online Agricultural Marketplace", title_style))
    story.append(Paragraph("“Quality Seeds. Better Crops. Better Future.”", tagline_style))
    story.append(Paragraph("Comprehensive System Architecture, Screen-by-Screen Engineering Guide, Database Design & Viva Walkthrough for Academic Evaluation.", body_style))
    
    story.append(Spacer(1, 10))

    # Meta Info Card Table
    meta_data = [
        [
            Paragraph("<b>Stack:</b> Python Flask, MongoDB, Modern UI", box_text_style),
            Paragraph("<b>Prototype URL:</b> http://127.0.0.1:5000", box_text_style),
            Paragraph("<b>Status:</b> 100% Tested & Verified", box_text_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[2.3*inch, 2.3*inch, 2.3*inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_MINT),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#bbf7d0")),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 1: PROBLEM STATEMENT & MOTIVATION
    # =========================================================================
    story.append(Paragraph("1. Problem Statement & Real-World Agricultural Motivation", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_GREEN, spaceAfter=8))
    
    story.append(Paragraph(
        "In India's conventional agricultural supply chain, rural farmers procure fundamental inputs—certified seeds, fertilizers, crop protection chemicals, and farming tools—through multiple disjointed intermediaries (State Distributors, Mandi Commission Agents, and Local Village Traders). This traditional structure causes three crippling problems for Indian agriculture:",
        body_style
    ))

    story.append(Paragraph("• <b>Middlemen Exploitation & Price Inflation:</b> Multi-tiered commissions artificially inflate seed and fertilizer prices by 20% to 40%, placing a heavy financial burden on smallholder farmers.", bullet_style))
    story.append(Paragraph("• <b>Spurious & Counterfeit Seeds:</b> Over 30% of seeds sold in local markets suffer from abysmal germination rates (< 60%) or genetic impurities, leading to catastrophic crop failures and farmer debt.", bullet_style))
    story.append(Paragraph("• <b>Rural Logistics & Information Barrier:</b> Farmers are forced to travel 30-50 km to urban mandi markets without prior stock availability checks or delivery tracking, wasting critical sowing window days.", bullet_style))

    story.append(Paragraph(
        "<b>AgriSeed Disintermediation Model:</b> AgriSeed replaces this broken supply chain with an authorized direct marketplace. Certified seed research bodies (ICAR, National Seed Corporation) and licensed Krishi Kendra cooperatives list laboratory-tested inputs with verified government license numbers. Farmers browse certified products, apply Kisan subsidies, and receive direct farm-gate village delivery with full 5-stage dispatch tracking.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 2: SYSTEM ARCHITECTURE & TECH STACK
    # =========================================================================
    story.append(Paragraph("2. System Architecture & Technology Stack", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_GREEN, spaceAfter=8))

    story.append(Paragraph("The platform is architected according to the <b>Three-Tier Model-View-Controller (MVC) & REST API design pattern</b>:", body_style))

    arch_data = [
        [
            Paragraph("<b>Architecture Tier</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
            Paragraph("<b>Technology</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
            Paragraph("<b>Engineering Responsibility</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white))
        ],
        [
            Paragraph("<b>Presentation Tier (Frontend)</b>", body_style),
            Paragraph("HTML5, CSS3, Vanilla JS (ES6+)", body_style),
            Paragraph("Responsive Emerald Agricultural Design System, dynamic pack pricing recalculation, QR payment simulator, animated steppers, and asynchronous notifications.", body_style)
        ],
        [
            Paragraph("<b>Application Tier (Backend)</b>", body_style),
            Paragraph("Python Flask (v3.12+)", body_style),
            Paragraph("Modular REST API endpoints (`/api/auth`, `/api/products`, `/api/cart`, `/api/orders`), Jinja2 templating, session state management, and Werkzeug SHA-256 password hashing.", body_style)
        ],
        [
            Paragraph("<b>Data Tier (Database)</b>", body_style),
            Paragraph("MongoDB + Dual-Mode Engine", body_style),
            Paragraph("Flexible NoSQL document model storing heterogeneous seed & equipment attributes. Includes zero-config automated JSON-backed persistence fallback.", body_style)
        ]
    ]

    arch_table = Table(arch_data, colWidths=[1.8*inch, 1.8*inch, 3.3*inch])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_DARK),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT])
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 3: 10-SCREEN PROTOTYPE WALKTHROUGH
    # =========================================================================
    story.append(Paragraph("3. Detailed Screen-by-Screen Functional Walkthrough", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_GREEN, spaceAfter=8))

    screens_data = [
        ("Screen 1: Welcome & Splash Screen", "Presents AgriSeed brand identity with sprout logo, certified quality guarantees, value propositions (Tested Germination, Govt. Approved Sellers, 0% Middlemen), and quick 'Get Started' action triggers."),
        ("Screen 2: Home Page & Krishi Advisory", "Includes real-time agricultural search bar, category counts, seasonal sowing advisory ticker for Kharif/Rabi alerts, featured high-yield seeds, 10% Kisan subsidy promotion (`KISAN50`), and farmer testimonials."),
        ("Screen 3: Farmer Login & Registration", "Features agriculture-tailored registration capturing Land Holding (Acres), Primary Crops (Paddy, Wheat, Cotton), Village, District, and State. Includes 1-Click Demo Login buttons for instant examination."),
        ("Screen 4: Product Categories & Catalog", "Organized across 4 core departments (🌾 Seeds, 🧪 Fertilizers, 🌱 Pesticides, 🚜 Farming Equipment). Provides multi-faceted filters by crop suitability (Paddy, Wheat, Cotton, Vegetables), price slider, and sorting."),
        ("Screen 5: Product Details & Agronomy Specs", "Features dynamic pack-size selectors (1 kg, 5 kg, 25 kg Bag) with instant price recalculation. Includes agronomic specs table (Germination %, Purity %, Sowing Season, Maturity, Dosage per Acre), seller license cards, and farmer reviews."),
        ("Screen 6: Shopping Cart & Subsidy Engine", "Interactive cart with quantity increment/decrement steppers, automated free shipping rule (> ₹999), and coupon discount engine (`KISAN50` for 10% farmer subsidy, `AGRISEED100` for ₹100 off)."),
        ("Screen 7: Checkout & Multi-Payment Gateway", "Captures detailed village delivery address (Village, Tehsil, District, PIN) and provides 3 interactive payment methods: UPI (with simulated QR code and VPA verification), Debit/Credit Card, and Cash on Delivery (COD)."),
        ("Screen 8: 5-Stage Live Order Tracking", "Visual progress stepper: `Ordered` ➔ `Confirmed` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered`. Displays courier logistics metadata (AgriExpress Fleet, vehicle #, driver contact) and printable invoice."),
        ("Screen 9: Farmer Dashboard (My Account)", "Personalized portal displaying registered farm size, primary crops, Kisan Rewards loyalty points, active dispatches with tracking shortcuts, order history archive, and district-level crop advisory."),
        ("Screen 10: Admin Dashboard & Store Manager", "Store management hub featuring KPIs (Total Farmers, Products, Orders, Revenue), low-stock alert badges (< 25 units), live order status coordinator dropdown, product inventory CRUD, and vendor directories.")
    ]

    for title, desc in screens_data:
        story.append(Paragraph(f"<b>{title}:</b> {desc}", body_style))

    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 4: DATABASE SCHEMA (MONGODB)
    # =========================================================================
    story.append(Paragraph("4. Database Schema & Data Models (MongoDB)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_GREEN, spaceAfter=8))

    story.append(Paragraph("The database comprises <b>5 core collections</b> optimized for document-oriented flexibility:", body_style))

    db_data = [
        [Paragraph("<b>Collection</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)), Paragraph("<b>Key Schema Attributes & Description</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white))],
        [
            Paragraph("<b>users</b>", body_style),
            Paragraph("`_id`, `name`, `email`, `phone`, `password_hash`, `role` (farmer/admin), `farm_size`, `primary_crops` (array), `village`, `taluk`, `district`, `state`, `pincode`, `kisan_rewards`.", body_style)
        ],
        [
            Paragraph("<b>products</b>", body_style),
            Paragraph("`_id`, `name`, `category`, `category_icon`, `price`, `original_price`, `unit`, `pack_sizes` (array of {size, price}), `stock`, `rating`, `review_count`, `image_url`, `crop_suitability`, `season`, `germination_rate`, `purity`, `maturity_period`, `yield_potential`, `dosage_guide`, `seller_id`, `seller_name`, `verified_seller`.", body_style)
        ],
        [
            Paragraph("<b>sellers</b>", body_style),
            Paragraph("`_id`, `name`, `owner`, `rating`, `review_count`, `location`, `verified`, `license_no`, `phone`, `email`.", body_style)
        ],
        [
            Paragraph("<b>orders</b>", body_style),
            Paragraph("`_id` (AGRI-XXXXXX), `user_id`, `user_name`, `phone`, `delivery_address` (object), `items` (array), `subtotal`, `discount`, `coupon_code`, `delivery_charge`, `total_amount`, `payment_method`, `payment_status`, `status`, `status_history` (array of {status, timestamp, details}), `courier_partner`, `tracking_number`, `driver_name`, `estimated_delivery`.", body_style)
        ],
        [
            Paragraph("<b>reviews</b>", body_style),
            Paragraph("`_id`, `product_id`, `user_name`, `rating`, `comment`, `date`, `verified_purchase`.", body_style)
        ]
    ]

    db_table = Table(db_data, colWidths=[1.5*inch, 5.4*inch])
    db_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_DARK),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT])
    ]))
    story.append(db_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 5: KEY TECHNICAL INNOVATIONS
    # =========================================================================
    story.append(Paragraph("5. Key Technical Innovations & Engineering Highlights", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_GREEN, spaceAfter=8))

    story.append(Paragraph("1. <b>Zero-Config Dual-Mode Database Architecture (`database.py`):</b> The backend attempts connection to a live MongoDB instance on port 27017. If MongoDB daemon is not running, it automatically switches to an in-memory/JSON-persisted storage engine that implements standard PyMongo APIs (`find`, `find_one`, `insert_one`, `update_one`, `delete_one`, `count_documents`). This guarantees 100% fail-safe execution during evaluation.", bullet_style))
    story.append(Paragraph("2. <b>Real-Time 5-Stage Order Synchronization:</b> When an administrator updates an order's fulfillment state in the Admin Console (e.g. from `Ordered` to `Shipped`), the farmer's live tracking stepper reflects the advancement immediately.", bullet_style))
    story.append(Paragraph("3. <b>Dynamic Client-Side Agronomic Pack Sizing:</b> Selecting variable pack sizes (1 kg, 5 kg, 25 kg) dynamically recalculates the price before adding to cart without requiring complete page reloads.", bullet_style))
    story.append(Paragraph("4. <b>Kisan Subsidy & Promo Engine:</b> Implements rule-based subsidy deduction (`KISAN50` for 10% farmer subsidy) and automated rural free-shipping thresholds.", bullet_style))
    story.append(Paragraph("5. <b>Agricultural Security & Data Integrity:</b> User passwords are encrypted with SHA-256 password hashing. Server-side session authentication prevents unauthorized privilege escalation.", bullet_style))

    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 6: LIVE DEMO SCRIPT
    # =========================================================================
    story.append(Paragraph("6. Live Demonstration Script for College Panel", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_GREEN, spaceAfter=8))

    demo_steps = [
        "<b>Step 1 (Launch):</b> Run `python run.py` (or double-click `start.bat`) and open `http://127.0.0.1:5000`.",
        "<b>Step 2 (Welcome & Home):</b> Highlight the Sprout Logo, tagline, certified badges, and Krishi Weather Advisory ticker.",
        "<b>Step 3 (Catalog Filtering):</b> Click 'Products', select Category = 'Seeds' and Crop = 'Paddy / Rice' to view 'Pusa Basmati 1121'.",
        "<b>Step 4 (Agronomy Details):</b> Open product details. Toggle between '1 kg', '5 kg', and '25 kg' pack sizes to show dynamic price recalculation. Show the 92% germination rate and dosage guide.",
        "<b>Step 5 (Cart & Subsidy):</b> Add to cart, enter coupon `KISAN50`, and show the 10% Kisan Subsidy deduction.",
        "<b>Step 6 (Checkout & Payment):</b> Enter delivery address, toggle between UPI (shows simulated QR code) and COD, then place order.",
        "<b>Step 7 (Live Tracking):</b> Show the generated Order ID (`AGRI-XXXXXX`) and the 5-stage progress stepper currently at 'Ordered'.",
        "<b>Step 8 (Admin Live Sync):</b> Open Admin Console (`admin@agriseed.in`), advance order status from 'Ordered' to 'Shipped', refresh the farmer tracking page, and show the stepper advanced to Stage 3 ('Shipped')!"
    ]
    for s in demo_steps:
        story.append(Paragraph(f"• {s}", bullet_style))

    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 7: VIVA QUESTIONS & ANSWERS
    # =========================================================================
    story.append(Paragraph("7. Top Viva Questions & Model Answers", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_GREEN, spaceAfter=8))

    viva_qa = [
        (
            "Q1: What distinguishes AgriSeed from general e-commerce platforms like Amazon or Flipkart?",
            "AgriSeed is domain-engineered specifically for agriculture: (1) It captures technical agronomic specifications (germination %, purity %, maturity days, dosage/acre) critical for crop decisions. (2) It verifies government seed vendor licenses. (3) It integrates Kisan subsidy discounts and 5-stage village-level logistics tracking."
        ),
        (
            "Q2: Why was MongoDB chosen over a relational SQL database like MySQL?",
            "Agricultural products have heterogeneous, unstructured attributes. Seeds require germination rates and sowing seasons, whereas farming equipment requires battery capacities, warranties, and nozzles. MongoDB's document model handles variable product attributes without requiring sparse NULL columns or complex multi-table SQL joins."
        ),
        (
            "Q3: How is data security and role management enforced?",
            "Passwords are never stored in plaintext; they are salted and hashed using `werkzeug.security.generate_password_hash` (SHA-256). User sessions are maintained server-side with signed session cookies, strictly isolating `farmer` and `admin` privileges."
        ),
        (
            "Q4: What is the future expansion roadmap for AgriSeed?",
            "Planned extensions include: (1) AI Crop Leaf Disease Detection using Convolutional Neural Networks (CNNs). (2) Multilingual voice assistance in regional languages (Hindi, Punjabi, Marathi, Telugu). (3) IoT smart soil sensor sync for automated fertilizer dosage recommendations."
        )
    ]

    for q, a in viva_qa:
        story.append(Paragraph(q, qa_q_style))
        story.append(Paragraph(f"<b>Answer:</b> {a}", qa_a_style))

    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 8: QUICK REFERENCE & DEMO CREDENTIALS
    # =========================================================================
    story.append(Paragraph("8. Project Quick Reference & Evaluation Logins", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_GREEN, spaceAfter=8))

    creds_data = [
        [
            Paragraph("<b>Role</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
            Paragraph("<b>Login Identifier</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
            Paragraph("<b>Password</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white)),
            Paragraph("<b>Demonstration Purpose</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white))
        ],
        [
            Paragraph("<b>Farmer (Ramesh Singh)</b>", body_style),
            Paragraph("`farmer@agriseed.in`", body_style),
            Paragraph("`farmer123`", body_style),
            Paragraph("Farmer dashboard, active dispatches, orders, Kisan rewards, and personalized crop advisory.", body_style)
        ],
        [
            Paragraph("<b>Store Administrator</b>", body_style),
            Paragraph("`admin@agriseed.in`", body_style),
            Paragraph("`admin123`", body_style),
            Paragraph("Store KPIs, product catalog CRUD, order status coordinator, and vendor registries.", body_style)
        ]
    ]

    creds_table = Table(creds_data, colWidths=[1.8*inch, 1.6*inch, 1.1*inch, 2.4*inch])
    creds_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_DARK),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT])
    ]))
    story.append(creds_table)

    # Build document with NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {pdf_path}")

if __name__ == '__main__':
    build_pdf()
