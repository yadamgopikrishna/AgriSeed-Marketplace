import uuid
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash

SAMPLE_SELLERS = [
    {
        "_id": "seller_1",
        "name": "Kisan Vikas Agro Kendra",
        "owner": "Suresh Patel",
        "rating": 4.8,
        "review_count": 142,
        "location": "Karnal, Haryana",
        "verified": True,
        "license_no": "AGRI/HR/2022/8831",
        "phone": "+91 98765 43210",
        "email": "kisan.vikas@agriseed.in"
    },
    {
        "_id": "seller_2",
        "name": "National Seed & Bio Corp",
        "owner": "Dr. R. K. Sharma",
        "rating": 4.9,
        "review_count": 310,
        "location": "Ludhiana, Punjab",
        "verified": True,
        "license_no": "AGRI/PB/2021/4490",
        "phone": "+91 98111 22334",
        "email": "national.seeds@agriseed.in"
    },
    {
        "_id": "seller_3",
        "name": "GreenEarth Organic Bio-Tech",
        "owner": "Ananya Deshmukh",
        "rating": 4.7,
        "review_count": 89,
        "location": "Nashik, Maharashtra",
        "verified": True,
        "license_no": "AGRI/MH/2023/1104",
        "phone": "+91 98220 99887",
        "email": "greenearth@agriseed.in"
    },
    {
        "_id": "seller_4",
        "name": "Bharat Farm Tech & Tools",
        "owner": "Rajesh Verma",
        "rating": 4.6,
        "review_count": 64,
        "location": "Jaipur, Rajasthan",
        "verified": True,
        "license_no": "AGRI/RJ/2020/5567",
        "phone": "+91 94140 12345",
        "email": "bharat.tools@agriseed.in"
    }
]

SAMPLE_PRODUCTS = [
    # --- SEEDS ---
    {
        "_id": "prod_1",
        "name": "Pusa Basmati 1121 Golden Grain Seeds",
        "category": "Seeds",
        "category_icon": "🌾",
        "price": 450,
        "original_price": 550,
        "unit": "5 kg Pack",
        "pack_sizes": [
            {"size": "1 kg Pack", "price": 100},
            {"size": "5 kg Pack", "price": 450},
            {"size": "25 kg Bag", "price": 2100}
        ],
        "stock": 85,
        "rating": 4.8,
        "review_count": 58,
        "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "Paddy / Rice",
        "season": "Kharif (June - October)",
        "germination_rate": "92%",
        "purity": "99%",
        "maturity_period": "140-145 Days",
        "yield_potential": "20-25 Quintals/Acre",
        "seller_id": "seller_2",
        "seller_name": "National Seed & Bio Corp",
        "verified_seller": True,
        "description": "Certified Pusa Basmati 1121 seed with extra-long slender grains, rich aromatic fragrance, and high elongation ratio after cooking. High disease tolerance against blast and bacterial leaf blight.",
        "dosage_guide": "5 kg per acre for transplanted nursery sowing.",
        "is_featured": True,
        "is_popular": True,
        "tags": ["High Yield", "Aromatic", "Certified Pusa"]
    },
    {
        "_id": "prod_2",
        "name": "Super Shriram Hybrid Wheat Seeds (WH-1105)",
        "category": "Seeds",
        "category_icon": "🌾",
        "price": 950,
        "original_price": 1150,
        "unit": "40 kg Bag",
        "pack_sizes": [
            {"size": "10 kg Bag", "price": 260},
            {"size": "40 kg Bag", "price": 950}
        ],
        "stock": 120,
        "rating": 4.9,
        "review_count": 92,
        "image_url": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "Wheat",
        "season": "Rabi (November - April)",
        "germination_rate": "95%",
        "purity": "98.5%",
        "maturity_period": "135-140 Days",
        "yield_potential": "26-30 Quintals/Acre",
        "seller_id": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "description": "High-yielding dwarf wheat variety with strong tillering capacity, lodging resistance, and high resistance to yellow and brown rust. Recommended for irrigated fertile plains.",
        "dosage_guide": "40 kg per acre for standard seed-drill sowing.",
        "is_featured": True,
        "is_popular": True,
        "tags": ["Rust Resistant", "High Tillering", "Certified Seed"]
    },
    {
        "_id": "prod_3",
        "name": "Rasi Bt Cotton Hybrid Hybrid Seeds (Bollgard II)",
        "category": "Seeds",
        "category_icon": "🌾",
        "price": 860,
        "original_price": 920,
        "unit": "475 gm Pack",
        "pack_sizes": [
            {"size": "475 gm Pack", "price": 860},
            {"size": "2 x 475 gm Bundle", "price": 1680}
        ],
        "stock": 45,
        "rating": 4.7,
        "review_count": 34,
        "image_url": "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "Cotton",
        "season": "Kharif (May - November)",
        "germination_rate": "88%",
        "purity": "99%",
        "maturity_period": "150-160 Days",
        "yield_potential": "14-18 Quintals/Acre",
        "seller_id": "seller_2",
        "seller_name": "National Seed & Bio Corp",
        "verified_seller": True,
        "description": "Bollgard II technology cotton seeds providing protection against American bollworm, spotted bollworm, and pink bollworm. Excellent staple length and high ginning percentage.",
        "dosage_guide": "2 packets (950g) per acre with 4x2 ft spacing.",
        "is_featured": False,
        "is_popular": True,
        "tags": ["Bt Cotton", "Bollworm Shield", "Heavy Fruiting"]
    },
    {
        "_id": "prod_4",
        "name": "Abhinav F1 Hybrid Tomato Seeds",
        "category": "Seeds",
        "category_icon": "🌾",
        "price": 680,
        "original_price": 799,
        "unit": "10 gm (approx. 3500 seeds)",
        "pack_sizes": [
            {"size": "10 gm Pack", "price": 680},
            {"size": "50 gm Pack", "price": 3100}
        ],
        "stock": 60,
        "rating": 4.6,
        "review_count": 27,
        "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "Vegetables (Tomato)",
        "season": "All Seasons (Kharif, Rabi, Summer)",
        "germination_rate": "90%",
        "purity": "99%",
        "maturity_period": "60-65 Days after transplant",
        "yield_potential": "35-45 Tons/Acre",
        "seller_id": "seller_3",
        "seller_name": "GreenEarth Organic Bio-Tech",
        "verified_seller": True,
        "description": "Indeterminate vigorous plant habit with deep red, firm, square-round fruits. Excellent long-distance shipping quality and high tolerance to Tomato Leaf Curl Virus (ToLCV).",
        "dosage_guide": "40-50 gm seeds for 1 acre nursery bed.",
        "is_featured": False,
        "is_popular": False,
        "tags": ["ToLCV Resistant", "Firm Fruits", "Long Shelf Life"]
    },

    # --- FERTILIZERS ---
    {
        "_id": "prod_5",
        "name": "IFFCO 100% Water Soluble NPK 19:19:19",
        "category": "Fertilizers",
        "category_icon": "🧪",
        "price": 220,
        "original_price": 280,
        "unit": "1 kg Pouch",
        "pack_sizes": [
            {"size": "1 kg Pouch", "price": 220},
            {"size": "5 kg Pouch", "price": 990},
            {"size": "25 kg Bag", "price": 4500}
        ],
        "stock": 150,
        "rating": 4.9,
        "review_count": 115,
        "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "All Crops (Paddy, Wheat, Vegetables, Fruits)",
        "season": "Vegetative & Flowering Stages",
        "germination_rate": "N/A",
        "purity": "100% Water Soluble",
        "maturity_period": "Immediate Action",
        "yield_potential": "+15-20% Vegetative Vigour",
        "seller_id": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "description": "Balanced 19:19:19 nitrogen, phosphorus, and potassium fertilizer enriched with micro-nutrients. Fully soluble in water, ideal for foliar spray and fertigation through drip irrigation systems.",
        "dosage_guide": "5 grams per liter of water for foliar spray (approx 1 kg/acre).",
        "is_featured": True,
        "is_popular": True,
        "tags": ["100% Soluble", "Drip Grade", "Fast Absorption"]
    },
    {
        "_id": "prod_6",
        "name": "Pure Cold-Pressed Organic Neem Cake Fertilizer",
        "category": "Fertilizers",
        "category_icon": "🧪",
        "price": 480,
        "original_price": 600,
        "unit": "10 kg Bag",
        "pack_sizes": [
            {"size": "5 kg Bag", "price": 260},
            {"size": "10 kg Bag", "price": 480},
            {"size": "50 kg Bulk Bag", "price": 2150}
        ],
        "stock": 90,
        "rating": 4.8,
        "review_count": 48,
        "image_url": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "All Soil Types / Horticulture / Sugarcane",
        "season": "Basal Soil Application",
        "germination_rate": "N/A",
        "purity": "100% Organic Cold Pressed",
        "maturity_period": "Slow Release (60 Days)",
        "yield_potential": "Protects roots from nematodes & termites",
        "seller_id": "seller_3",
        "seller_name": "GreenEarth Organic Bio-Tech",
        "verified_seller": True,
        "description": "Rich in natural Azadirachtin, nitrogen (4%), phosphorus, and potassium. Acts as dual-purpose organic soil conditioner and natural nematicide to protect roots from termites and fungal rot.",
        "dosage_guide": "50-100 kg per acre mixed into soil during land preparation.",
        "is_featured": False,
        "is_popular": True,
        "tags": ["100% Organic", "Anti-Nematode", "Soil Conditioner"]
    },
    {
        "_id": "prod_7",
        "name": "Chelated Zinc EDTA 12% Micronutrient",
        "category": "Fertilizers",
        "category_icon": "🧪",
        "price": 310,
        "original_price": 380,
        "unit": "500 gm Pouch",
        "pack_sizes": [
            {"size": "500 gm Pouch", "price": 310},
            {"size": "1 kg Pouch", "price": 580}
        ],
        "stock": 70,
        "rating": 4.7,
        "review_count": 31,
        "image_url": "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "Paddy, Maize, Citrus, Wheat",
        "season": "Tillering & Active Growth",
        "germination_rate": "N/A",
        "purity": "100% Chelated Grade",
        "maturity_period": "Quick Foliar Absorption",
        "yield_potential": "Prevents Khaira Disease in Paddy",
        "seller_id": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "description": "Easily absorbable EDTA-chelated zinc powder preventing zinc deficiency, yellowing of young leaves, and stunted tillers in paddy, maize, and horticultural crops.",
        "dosage_guide": "1.0 - 1.5 gm per liter of water for foliar spray.",
        "is_featured": False,
        "is_popular": False,
        "tags": ["EDTA Chelated", "Cures Khaira", "Micronutrient"]
    },

    # --- PESTICIDES ---
    {
        "_id": "prod_8",
        "name": "Bio-Neem Shield Organic Insecticide (10,000 PPM)",
        "category": "Pesticides",
        "category_icon": "🌱",
        "price": 390,
        "original_price": 499,
        "unit": "500 ml Bottle",
        "pack_sizes": [
            {"size": "250 ml Bottle", "price": 220},
            {"size": "500 ml Bottle", "price": 390},
            {"size": "1 Litre Bottle", "price": 720}
        ],
        "stock": 110,
        "rating": 4.8,
        "review_count": 76,
        "image_url": "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "Vegetables, Cotton, Pulses, Fruits",
        "season": "Preventive & Infestation Control",
        "germination_rate": "N/A",
        "purity": "10,000 PPM Azadirachtin",
        "maturity_period": "3-7 Days residual control",
        "yield_potential": "Zero Chemical Residue Safe Harvest",
        "seller_id": "seller_3",
        "seller_name": "GreenEarth Organic Bio-Tech",
        "verified_seller": True,
        "description": "Certified organic botanical pesticide formulated with pure neem seed kernel extract. Repels and disrupts feeding cycle of aphids, whiteflies, thrips, jassids, and leaf miners without harming beneficial pollinators.",
        "dosage_guide": "2.5 to 3 ml per liter of water. Spray thoroughly on both sides of leaves.",
        "is_featured": True,
        "is_popular": True,
        "tags": ["Organic Certified", "Safe for Honeybees", "10,000 PPM"]
    },
    {
        "_id": "prod_9",
        "name": "Kavach Broad Spectrum Bio-Larvicide & Caterpillar Control",
        "category": "Pesticides",
        "category_icon": "🌱",
        "price": 540,
        "original_price": 650,
        "unit": "250 ml Bottle",
        "pack_sizes": [
            {"size": "250 ml Bottle", "price": 540},
            {"size": "500 ml Bottle", "price": 990}
        ],
        "stock": 38,
        "rating": 4.7,
        "review_count": 42,
        "image_url": "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "Paddy, Soybean, Cotton, Gram, Vegetables",
        "season": "Larval Attack Stage",
        "germination_rate": "N/A",
        "purity": "Bacillus Thuringiensis (Bt) extract",
        "maturity_period": "Rapid Knockdown in 24 hrs",
        "yield_potential": "Stops leaf webbing & pod boring",
        "seller_id": "seller_2",
        "seller_name": "National Seed & Bio Corp",
        "verified_seller": True,
        "description": "Biological insecticide specifically targeting armyworms, pod borers, bollworms, and diamondback moths. Stomach and contact action ensures zero resurgence.",
        "dosage_guide": "1.5 to 2 ml per liter of water.",
        "is_featured": False,
        "is_popular": True,
        "tags": ["Larva Specialist", "Target Action", "Eco Friendly"]
    },
    {
        "_id": "prod_10",
        "name": "Saaf Dual-Action Systemic & Contact Fungicide",
        "category": "Pesticides",
        "category_icon": "🌱",
        "price": 280,
        "original_price": 340,
        "unit": "500 gm Pack",
        "pack_sizes": [
            {"size": "250 gm Pack", "price": 150},
            {"size": "500 gm Pack", "price": 280},
            {"size": "1 kg Pack", "price": 520}
        ],
        "stock": 95,
        "rating": 4.9,
        "review_count": 63,
        "image_url": "https://images.unsplash.com/photo-1592417817098-8f3d6ef231a4?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "Groundnut, Paddy, Potato, Chilli, Apple",
        "season": "Monsoon / High Humidity Seasons",
        "germination_rate": "N/A",
        "purity": "Carbendazim 12% + Mancozeb 63% WP",
        "maturity_period": "Long Lasting Protective Shield",
        "yield_potential": "Prevents damping off, blast & leaf spots",
        "seller_id": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "description": "Proven combination fungicide with systemic and contact protection. Effective against blast, sheath blight, anthracnose, tikka disease, and early/late blight.",
        "dosage_guide": "2 grams per liter of water for foliar spray.",
        "is_featured": False,
        "is_popular": True,
        "tags": ["Dual Action", "Anti-Fungal", "Fast Recovery"]
    },

    # --- FARMING EQUIPMENT ---
    {
        "_id": "prod_11",
        "name": "KisanPro 16 Litre 2-in-1 Dual Battery Knapsack Sprayer",
        "category": "Farming Equipment",
        "category_icon": "🚜",
        "price": 2499,
        "original_price": 3299,
        "unit": "1 Unit (With 4 Nozzle Set)",
        "pack_sizes": [
            {"size": "16L Battery Sprayer", "price": 2499},
            {"size": "16L Sprayer + Extra 12V Battery", "price": 3199}
        ],
        "stock": 35,
        "rating": 4.8,
        "review_count": 104,
        "image_url": "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "All Crops / Orchards / Large Fields",
        "season": "All Seasons",
        "germination_rate": "N/A",
        "purity": "Heavy Duty Polypropylene Tank (ISI Mark)",
        "maturity_period": "1 Year Motor & Battery Warranty",
        "yield_potential": "Sprays up to 25-30 tanks on single charge",
        "seller_id": "seller_4",
        "seller_name": "Bharat Farm Tech & Tools",
        "verified_seller": True,
        "description": "Ergonomic knapsack sprayer with 12V 12Ah rechargeable battery and backup manual hand pump. Features stainless steel telescopic lance, pressure regulator, and 4 multi-pattern spray nozzles.",
        "dosage_guide": "Recharge battery for 6-8 hours before first use.",
        "is_featured": True,
        "is_popular": True,
        "tags": ["12V Battery", "Dual Mode", "1 Year Warranty"]
    },
    {
        "_id": "prod_12",
        "name": "AgroTech 4-in-1 Digital Soil pH, Moisture & NPK Tester",
        "category": "Farming Equipment",
        "category_icon": "🚜",
        "price": 899,
        "original_price": 1299,
        "unit": "1 Device",
        "pack_sizes": [
            {"size": "Standard Digital Probe", "price": 899},
            {"size": "Probe + Calibration Solution Kit", "price": 1150}
        ],
        "stock": 50,
        "rating": 4.6,
        "review_count": 39,
        "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "Soil Health Diagnostics (All Farms)",
        "season": "Pre-Sowing & Soil Testing",
        "germination_rate": "N/A",
        "purity": "High Precision Copper Alloy Dual Probes",
        "maturity_period": "Instant 5-Second Digital Readout",
        "yield_potential": "Saves fertilizer cost by targeted application",
        "seller_id": "seller_4",
        "seller_name": "Bharat Farm Tech & Tools",
        "verified_seller": True,
        "description": "Instant handheld soil testing probe. Accurately measures soil pH levels (3.5 - 8.0), moisture percentage, sunlight exposure, and relative fertility index without needing batteries.",
        "dosage_guide": "Insert probe 4-6 inches into moist soil and read digital meter.",
        "is_featured": True,
        "is_popular": False,
        "tags": ["Soil Testing", "No Battery Needed", "Instant Readings"]
    },
    {
        "_id": "prod_13",
        "name": "Kisan Seeder Manual Single Row Push Seed Drill",
        "category": "Farming Equipment",
        "category_icon": "🚜",
        "price": 3200,
        "original_price": 3999,
        "unit": "1 Machine (With 6 Seed Discs)",
        "pack_sizes": [
            {"size": "Single Row Manual Seeder", "price": 3200},
            {"size": "Single Row + Fertilizer Box Combo", "price": 3850}
        ],
        "stock": 20,
        "rating": 4.7,
        "review_count": 28,
        "image_url": "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "Wheat, Maize, Soybean, Mustard, Pulses, Peanuts",
        "season": "Sowing Season",
        "germination_rate": "N/A",
        "purity": "Heavy Duty Mild Steel Body with Powder Coating",
        "maturity_period": "Durable 5+ Years Lifespan",
        "yield_potential": "Saves 40% seed wastage & uniform row spacing",
        "seller_id": "seller_4",
        "seller_name": "Bharat Farm Tech & Tools",
        "verified_seller": True,
        "description": "Lightweight manual push seed drill with interchangeable seed distribution discs for seeds of different diameters. Features adjustable furrow opener, seed drop depth controller, and rear soil closer wheel.",
        "dosage_guide": "Adjust seed disk gear ratio according to required seed-to-seed spacing.",
        "is_featured": False,
        "is_popular": True,
        "tags": ["Zero Seed Waste", "6 Seed Discs", "Adjustable Depth"]
    },
    {
        "_id": "prod_14",
        "name": "Drip Drop Micro Irrigation Kit (0.5 to 1 Acre Field)",
        "category": "Farming Equipment",
        "category_icon": "🚜",
        "price": 4650,
        "original_price": 5800,
        "unit": "Complete Kit (500m Lateral Pipe + 250 Drippers)",
        "pack_sizes": [
            {"size": "0.5 Acre Kit (250 Drippers)", "price": 4650},
            {"size": "1.0 Acre Kit (500 Drippers)", "price": 8200}
        ],
        "stock": 18,
        "rating": 4.9,
        "review_count": 52,
        "image_url": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "Vegetables, Sugarcane, Banana, Cotton, Orchards",
        "season": "All Year Round Irrigation",
        "germination_rate": "N/A",
        "purity": "UV Stabilized Virgin Polyethylene Pipes (ISI Marked)",
        "maturity_period": "3 Year Field Warranty",
        "yield_potential": "Saves 60% water, increases yield by 35%",
        "seller_id": "seller_4",
        "seller_name": "Bharat Farm Tech & Tools",
        "verified_seller": True,
        "description": "Complete DIY drip irrigation system. Includes 16mm UV-resistant lateral pipes, pressure compensating 4L/hour drippers, screen filter, punch tool, joiners, elbows, and end caps.",
        "dosage_guide": "Connect to standard 1HP or gravity tank water supply.",
        "is_featured": False,
        "is_popular": True,
        "tags": ["Water Saving", "Easy DIY Setup", "ISI Certified"]
    },
    {
        "_id": "prod_15",
        "name": "Pioneer Hybrid Sweet Corn Seeds (P3501)",
        "category": "Seeds",
        "category_icon": "🌾",
        "price": 720,
        "original_price": 850,
        "unit": "1 kg Pack",
        "pack_sizes": [
            {"size": "1 kg Pack", "price": 720},
            {"size": "5 kg Pack", "price": 3400}
        ],
        "stock": 55,
        "rating": 4.7,
        "review_count": 22,
        "image_url": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "Corn / Maize",
        "season": "Spring / Kharif / Rabi",
        "germination_rate": "94%",
        "purity": "99%",
        "maturity_period": "75-80 Days",
        "yield_potential": "80-90 Quintals green cobs/Acre",
        "seller_id": "seller_2",
        "seller_name": "National Seed & Bio Corp",
        "verified_seller": True,
        "description": "High sweetness (Brix 14-16%) hybrid sweet corn seed variety. High ear placement, excellent tip filling, and superior husk protection against pests.",
        "dosage_guide": "3 kg per acre with 60x20 cm spacing.",
        "is_featured": False,
        "is_popular": False,
        "tags": ["Sweet Corn", "Uniform Cobs", "High Market Value"]
    },
    {
        "_id": "prod_16",
        "name": "Pusa Yellow Mustard Hybrid Seed (Giriraj)",
        "category": "Seeds",
        "category_icon": "🌾",
        "price": 320,
        "original_price": 390,
        "unit": "1 kg Pack",
        "pack_sizes": [
            {"size": "1 kg Pack", "price": 320},
            {"size": "5 kg Pack", "price": 1450}
        ],
        "stock": 75,
        "rating": 4.8,
        "review_count": 41,
        "image_url": "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80",
        "crop_suitability": "Mustard / Oilseeds",
        "season": "Rabi (October - March)",
        "germination_rate": "91%",
        "purity": "99%",
        "maturity_period": "125-130 Days",
        "yield_potential": "10-12 Quintals/Acre (42% Oil Content)",
        "seller_id": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "description": "High oil content (42%) bold yellow seed mustard hybrid. Frost tolerant with high branching and resistance to white rust disease.",
        "dosage_guide": "1.5 kg per acre for line sowing.",
        "is_featured": False,
        "is_popular": True,
        "tags": ["42% Oil Content", "Frost Tolerant", "High Branching"]
    }
]

SAMPLE_USERS = [
    {
        "_id": "user_farmer_1",
        "name": "Ramesh Kumar Singh",
        "email": "farmer@agriseed.in",
        "phone": "9876543210",
        "password_hash": generate_password_hash("farmer123"),
        "role": "farmer",
        "farm_size": "8.5 Acres",
        "primary_crops": ["Wheat", "Paddy", "Mustard"],
        "village": "Rampur Khurd",
        "taluk": "Indri",
        "district": "Karnal",
        "state": "Haryana",
        "pincode": "132001",
        "kisan_rewards": 450,
        "created_at": "2026-01-15T10:30:00"
    },
    {
        "_id": "user_farmer_2",
        "name": "Balwinder Singh Dhillon",
        "email": "balwinder@agriseed.in",
        "phone": "9812345678",
        "password_hash": generate_password_hash("farmer123"),
        "role": "farmer",
        "farm_size": "15 Acres",
        "primary_crops": ["Basmati Rice", "Wheat", "Sugarcane"],
        "village": "Kotla Nihang",
        "taluk": "Rupnagar",
        "district": "Ropar",
        "state": "Punjab",
        "pincode": "140001",
        "kisan_rewards": 820,
        "created_at": "2026-02-01T14:20:00"
    },
    {
        "_id": "user_admin",
        "name": "AgriSeed Administrator",
        "email": "admin@agriseed.in",
        "phone": "9998887776",
        "password_hash": generate_password_hash("admin123"),
        "role": "admin",
        "created_at": "2026-01-01T00:00:00"
    }
]

SAMPLE_REVIEWS = [
    {
        "_id": "rev_1",
        "product_id": "prod_1",
        "user_name": "Balwinder Singh (Karnal)",
        "rating": 5,
        "comment": "Germination was beyond 95% in my nursery beds! Grain elongation and aroma were truly exceptional. Direct delivery to our village saved me 2 trips to the city mandi.",
        "date": "2026-07-10",
        "verified_purchase": True
    },
    {
        "_id": "rev_2",
        "product_id": "prod_1",
        "user_name": "Gurpreet Cheema",
        "rating": 5,
        "comment": "Genuine certified seeds with government batch testing seal. High resistance to blast compared to local market seeds.",
        "date": "2026-07-22",
        "verified_purchase": True
    },
    {
        "_id": "rev_3",
        "product_id": "prod_5",
        "user_name": "Ramesh Kumar Singh",
        "rating": 5,
        "comment": "100% water soluble without any clogging in drip filters. Gave an instant green boost to my tomato crop within 4 days of foliar spray!",
        "date": "2026-08-05",
        "verified_purchase": True
    },
    {
        "_id": "rev_4",
        "product_id": "prod_11",
        "user_name": "Shivraj Patil (Maharashtra)",
        "rating": 5,
        "comment": "Battery backup is solid! Covered 4 acres on a single charge. The double motor pressure is very powerful for tall cotton crops.",
        "date": "2026-08-12",
        "verified_purchase": True
    }
]

SAMPLE_ORDERS = [
    {
        "_id": "AGRI-849201",
        "user_id": "user_farmer_1",
        "user_name": "Ramesh Kumar Singh",
        "phone": "9876543210",
        "delivery_address": {
            "name": "Ramesh Kumar Singh",
            "village": "Rampur Khurd, Near Govt High School",
            "taluk": "Indri",
            "district": "Karnal",
            "state": "Haryana",
            "pincode": "132001",
            "phone": "9876543210"
        },
        "items": [
            {
                "product_id": "prod_1",
                "name": "Pusa Basmati 1121 Golden Grain Seeds",
                "pack_size": "5 kg Pack",
                "price": 450,
                "quantity": 2,
                "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"
            },
            {
                "product_id": "prod_5",
                "name": "IFFCO 100% Water Soluble NPK 19:19:19",
                "pack_size": "1 kg Pouch",
                "price": 220,
                "quantity": 1,
                "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80"
            }
        ],
        "subtotal": 1120,
        "discount": 112,
        "coupon_code": "KISAN50",
        "delivery_charge": 0,
        "total_amount": 1008,
        "payment_method": "UPI (Google Pay)",
        "payment_status": "Paid",
        "status": "Shipped",
        "status_history": [
            {"status": "Ordered", "timestamp": "2026-08-20 09:30 AM", "details": "Order placed successfully by farmer."},
            {"status": "Confirmed", "timestamp": "2026-08-20 11:15 AM", "details": "Verified by National Seed Corp depot."},
            {"status": "Shipped", "timestamp": "2026-08-21 02:45 PM", "details": "Dispatched via AgriExpress Logistics (Van #HR-05-AB-7721)."}
        ],
        "courier_partner": "AgriExpress Rural Fleet",
        "tracking_number": "AX-KNL-992384",
        "driver_name": "Suraj Pal (+91 94160 55432)",
        "estimated_delivery": "2026-08-24",
        "created_at": "2026-08-20T09:30:00"
    },
    {
        "_id": "AGRI-773190",
        "user_id": "user_farmer_1",
        "user_name": "Ramesh Kumar Singh",
        "phone": "9876543210",
        "delivery_address": {
            "name": "Ramesh Kumar Singh",
            "village": "Rampur Khurd",
            "taluk": "Indri",
            "district": "Karnal",
            "state": "Haryana",
            "pincode": "132001",
            "phone": "9876543210"
        },
        "items": [
            {
                "product_id": "prod_11",
                "name": "KisanPro 16 Litre 2-in-1 Dual Battery Knapsack Sprayer",
                "pack_size": "16L Battery Sprayer",
                "price": 2499,
                "quantity": 1,
                "image_url": "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&w=600&q=80"
            }
        ],
        "subtotal": 2499,
        "discount": 0,
        "coupon_code": None,
        "delivery_charge": 0,
        "total_amount": 2499,
        "payment_method": "Cash on Delivery",
        "payment_status": "Paid upon Delivery",
        "status": "Delivered",
        "status_history": [
            {"status": "Ordered", "timestamp": "2026-08-10 10:00 AM", "details": "Order placed."},
            {"status": "Confirmed", "timestamp": "2026-08-10 11:30 AM", "details": "Seller confirmed stock."},
            {"status": "Shipped", "timestamp": "2026-08-11 08:00 AM", "details": "Handed over to delivery van."},
            {"status": "Out for Delivery", "timestamp": "2026-08-12 09:15 AM", "details": "Out for delivery to Rampur village."},
            {"status": "Delivered", "timestamp": "2026-08-12 01:40 PM", "details": "Delivered directly to farmer doorstep."}
        ],
        "courier_partner": "AgriExpress Rural Fleet",
        "tracking_number": "AX-KNL-881023",
        "driver_name": "Virender Tyagi (+91 98960 11223)",
        "estimated_delivery": "2026-08-12",
        "created_at": "2026-08-10T10:00:00"
    }
]

def seed_database(db):
    """Populates collections with rich sample data if empty or resets."""
    # Check if products exist
    if db.products.count_documents({}) == 0:
        print("[SEED] Seeding Products...")
        db.products.insert_many(SAMPLE_PRODUCTS)
    
    if db.sellers.count_documents({}) == 0:
        print("[SEED] Seeding Sellers...")
        db.sellers.insert_many(SAMPLE_SELLERS)

    if db.users.count_documents({}) == 0:
        print("[SEED] Seeding Users (Farmers & Admin)...")
        db.users.insert_many(SAMPLE_USERS)

    if db.reviews.count_documents({}) == 0:
        print("[SEED] Seeding Product Reviews...")
        db.reviews.insert_many(SAMPLE_REVIEWS)

    if db.orders.count_documents({}) == 0:
        print("[SEED] Seeding Demo Orders...")
        db.orders.insert_many(SAMPLE_ORDERS)

    print("[SEED] Database seeding complete! Ready for evaluation & demo.")
