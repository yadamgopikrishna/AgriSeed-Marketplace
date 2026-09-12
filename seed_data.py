import uuid
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash

SAMPLE_SELLERS = [
    {
        "_id": "seller_1",
        "name": "Kisan Vikas Agro Kendra",
        "owner": "Suresh Patel",
        "rating": 4.9,
        "review_count": 342,
        "location": "Karnal, Haryana",
        "verified": True,
        "qc_passed": True,
        "license_no": "AGRI/HR/2022/8831",
        "cib_rc_no": "CIBRC/HR/PEST/4491",
        "seed_cert_no": "ICAR-SEED-CERT-9921",
        "phone": "+91 98765 43210",
        "email": "kisan.vikas@agriseed.in",
        "gross_sales": 384500,
        "net_payout": 376810,
        "bank_name": "State Bank of India (SBI)",
        "account_mask": "•••• •••• 4492",
        "ifsc": "SBIN0001234"
    },
    {
        "_id": "seller_2",
        "name": "National Seed & Bio Corp",
        "owner": "Dr. R. K. Sharma",
        "rating": 4.9,
        "review_count": 510,
        "location": "Ludhiana, Punjab",
        "verified": True,
        "qc_passed": True,
        "license_no": "AGRI/PB/2021/4490",
        "cib_rc_no": "CIBRC/PB/BIO/2210",
        "seed_cert_no": "NSC-GOV-CERT-1102",
        "phone": "+91 98111 22334",
        "email": "national.seeds@agriseed.in",
        "gross_sales": 520400,
        "net_payout": 509992,
        "bank_name": "Punjab National Bank (PNB)",
        "account_mask": "•••• •••• 8821",
        "ifsc": "PUNB0005678"
    },
    {
        "_id": "seller_3",
        "name": "GreenEarth Organic Bio-Tech",
        "owner": "Ananya Deshmukh",
        "rating": 4.8,
        "review_count": 189,
        "location": "Nashik, Maharashtra",
        "verified": True,
        "qc_passed": True,
        "license_no": "AGRI/MH/2023/1104",
        "cib_rc_no": "NPOP/ORG/MH/8812",
        "seed_cert_no": "MH-SEED-BIO-3341",
        "phone": "+91 98220 99887",
        "email": "greenearth@agriseed.in",
        "gross_sales": 210800,
        "net_payout": 206584,
        "bank_name": "Bank of Baroda (BOB)",
        "account_mask": "•••• •••• 3310",
        "ifsc": "BARB0NASHIK"
    },
    {
        "_id": "seller_4",
        "name": "Bharat Farm Tech & Tools",
        "owner": "Rajesh Verma",
        "rating": 4.8,
        "review_count": 164,
        "location": "Jaipur, Rajasthan",
        "verified": True,
        "qc_passed": True,
        "license_no": "AGRI/RJ/2020/5567",
        "cib_rc_no": "FMTTI/EQUIP/RJ/9901",
        "seed_cert_no": "BIS-ISI-EQUIP-4412",
        "phone": "+91 94140 12345",
        "email": "bharat.tools@agriseed.in",
        "gross_sales": 645000,
        "net_payout": 632100,
        "bank_name": "HDFC Bank",
        "account_mask": "•••• •••• 9920",
        "ifsc": "HDFC0001290"
    }
]

SAMPLE_PRODUCTS = [
    {
        "_id": "prod_1",
        "id": "prod_1",
        "name": "Pusa Basmati 1121 Golden Grain Paddy Seeds (ICAR Certified)",
        "category": "Seeds",
        "category_icon": "🌾",
        "categoryIcon": "🌾",
        "subcategory": "Field Grain Crops",
        "brand": "ICAR-IARI / National Seed Corp",
        "price": 850,
        "original_price": 950,
        "originalPrice": 950,
        "unit": "10 kg Bag",
        "pack_sizes": [
            {
                "size": "5 kg Bag",
                "price": 450
            },
            {
                "size": "10 kg Bag",
                "price": 850
            },
            {
                "size": "25 kg Bag",
                "price": 2050
            }
        ],
        "packSizes": [
            {
                "size": "5 kg Bag",
                "price": 450
            },
            {
                "size": "10 kg Bag",
                "price": 850
            },
            {
                "size": "25 kg Bag",
                "price": 2050
            }
        ],
        "stock": 120,
        "rating": 4.9,
        "review_count": 68,
        "reviewCount": 68,
        "image_url": "/images/products/pusa_basmati_1121.svg",
        "imageUrl": "/images/products/pusa_basmati_1121.svg",
        "crop_suitability": "Paddy / Rice",
        "cropSuitability": "Paddy / Rice",
        "season": "Kharif (June - October)",
        "germination_rate": "94%",
        "germinationRate": "94%",
        "purity": "99%",
        "maturity_period": "140-145 Days",
        "maturityPeriod": "140-145 Days",
        "yield_potential": "22-25 Quintals/Acre",
        "yieldPotential": "22-25 Quintals/Acre",
        "seller_id": "seller_2",
        "sellerId": "seller_2",
        "seller_name": "National Seed & Bio Corp",
        "sellerName": "National Seed & Bio Corp",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "ICAR-IARI-QC-9921",
        "labCertId": "ICAR-IARI-QC-9921",
        "batch_number": "PB-1121-B4-2026",
        "batchNumber": "PB-1121-B4-2026",
        "expiry_date": "2027-06-30",
        "expiryDate": "2027-06-30",
        "description": "Certified Pusa Basmati 1121 pure seed lot with extra-long slender grains, exceptional aroma, and superior elongation after cooking. Resistant to bacterial leaf blight and blast.",
        "dosage_guide": "5-6 kg per acre for transplanted nursery sowing.",
        "dosageGuide": "5-6 kg per acre for transplanted nursery sowing.",
        "is_featured": True,
        "isFeatured": True,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "ICAR Certified",
            "94% Germination",
            "Export Quality Basmati"
        ],
        "mfg_date": "2025-11-10",
        "mfgDate": "2025-11-10",
        "shelf_life": "18 Months from MFG",
        "shelfLife": "18 Months from MFG",
        "toxicityLevel": "Green - Non-Toxic Certified Seeds",
        "gstRate": "0% (Exempt for Certified Seeds)"
    },
    {
        "_id": "prod_2",
        "id": "prod_2",
        "name": "Shriram Super 1105 High-Yield Hybrid Wheat Seeds",
        "category": "Seeds",
        "category_icon": "🌾",
        "categoryIcon": "🌾",
        "subcategory": "Field Grain Crops",
        "brand": "Shriram Farm Solutions",
        "price": 950,
        "original_price": 1150,
        "originalPrice": 1150,
        "unit": "40 kg Bag",
        "pack_sizes": [
            {
                "size": "10 kg Bag",
                "price": 260
            },
            {
                "size": "40 kg Bag",
                "price": 950
            }
        ],
        "packSizes": [
            {
                "size": "10 kg Bag",
                "price": 260
            },
            {
                "size": "40 kg Bag",
                "price": 950
            }
        ],
        "stock": 140,
        "rating": 4.9,
        "review_count": 92,
        "reviewCount": 92,
        "image_url": "/images/products/shriram_wheat_1105.svg",
        "imageUrl": "/images/products/shriram_wheat_1105.svg",
        "crop_suitability": "Wheat",
        "cropSuitability": "Wheat",
        "season": "Rabi (November - April)",
        "germination_rate": "96%",
        "germinationRate": "96%",
        "purity": "99.2%",
        "maturity_period": "135-140 Days",
        "maturityPeriod": "135-140 Days",
        "yield_potential": "28-32 Quintals/Acre",
        "yieldPotential": "28-32 Quintals/Acre",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "SFS-SEED-QC-4412",
        "labCertId": "SFS-SEED-QC-4412",
        "batch_number": "SR-WH-1105-R26",
        "batchNumber": "SR-WH-1105-R26",
        "expiry_date": "2027-04-30",
        "expiryDate": "2027-04-30",
        "description": "High-yielding dwarf wheat variety with sturdy tillering capacity, lodging resistance, and absolute resistance to yellow and brown rust. Recommended for irrigated fertile soils.",
        "dosage_guide": "40 kg per acre for standard seed-drill sowing.",
        "dosageGuide": "40 kg per acre for standard seed-drill sowing.",
        "is_featured": True,
        "isFeatured": True,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "Rust Resistant",
            "96% Germination",
            "High Tillering"
        ],
        "mfg_date": "2025-11-10",
        "mfgDate": "2025-11-10",
        "shelf_life": "18 Months from MFG",
        "shelfLife": "18 Months from MFG",
        "toxicityLevel": "Green - Non-Toxic Certified Seeds",
        "gstRate": "0% (Exempt for Certified Seeds)"
    },
    {
        "_id": "prod_3",
        "id": "prod_3",
        "name": "Rasi RCH-659 BG-II Hybrid Bt Cotton Seeds",
        "category": "Seeds",
        "category_icon": "🌾",
        "categoryIcon": "🌾",
        "subcategory": "Hybrid Cash Crops",
        "brand": "Rasi Seeds (Bollgard II)",
        "price": 864,
        "original_price": 920,
        "originalPrice": 920,
        "unit": "450g Pack (1 Acre)",
        "pack_sizes": [
            {
                "size": "450g Pack",
                "price": 864
            },
            {
                "size": "5 Packs Bundle",
                "price": 4200
            }
        ],
        "packSizes": [
            {
                "size": "450g Pack",
                "price": 864
            },
            {
                "size": "5 Packs Bundle",
                "price": 4200
            }
        ],
        "stock": 65,
        "rating": 4.8,
        "review_count": 44,
        "reviewCount": 44,
        "image_url": "/images/products/rasi_cotton_659.svg",
        "imageUrl": "/images/products/rasi_cotton_659.svg",
        "crop_suitability": "Cotton",
        "cropSuitability": "Cotton",
        "season": "Kharif (May - November)",
        "germination_rate": "90%",
        "germinationRate": "90%",
        "purity": "98.5%",
        "maturity_period": "150-160 Days",
        "maturityPeriod": "150-160 Days",
        "yield_potential": "15-18 Quintals/Acre",
        "yieldPotential": "15-18 Quintals/Acre",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "CIB-BG2-RASI-881",
        "labCertId": "CIB-BG2-RASI-881",
        "batch_number": "RCH-659-K26",
        "batchNumber": "RCH-659-K26",
        "expiry_date": "2027-02-28",
        "expiryDate": "2027-02-28",
        "description": "Approved Bollgard II technology cotton seeds providing complete protection against American and pink bollworms. High ginning percentage and big boll weight.",
        "dosage_guide": "1 packet (450g) + 120g non-Bt refuge seed per acre.",
        "dosageGuide": "1 packet (450g) + 120g non-Bt refuge seed per acre.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "Bollgard II",
            "Pink Bollworm Shield",
            "Heavy Fruiting"
        ],
        "mfg_date": "2025-11-10",
        "mfgDate": "2025-11-10",
        "shelf_life": "18 Months from MFG",
        "shelfLife": "18 Months from MFG",
        "toxicityLevel": "Green - Non-Toxic Certified Seeds",
        "gstRate": "0% (Exempt for Certified Seeds)"
    },
    {
        "_id": "prod_4",
        "id": "prod_4",
        "name": "Syngenta Abhinav F1 Hybrid Tomato Seeds",
        "category": "Seeds",
        "category_icon": "🌾",
        "categoryIcon": "🌾",
        "subcategory": "Vegetable Seeds",
        "brand": "Syngenta India",
        "price": 480,
        "original_price": 560,
        "originalPrice": 560,
        "unit": "10g (approx 3500 Seeds)",
        "pack_sizes": [
            {
                "size": "10g Pack",
                "price": 480
            },
            {
                "size": "50g Pack",
                "price": 2250
            }
        ],
        "packSizes": [
            {
                "size": "10g Pack",
                "price": 480
            },
            {
                "size": "50g Pack",
                "price": 2250
            }
        ],
        "stock": 90,
        "rating": 4.8,
        "review_count": 52,
        "reviewCount": 52,
        "image_url": "/images/products/syngenta_tomato_abhinav.svg",
        "imageUrl": "/images/products/syngenta_tomato_abhinav.svg",
        "crop_suitability": "Vegetables (Tomato)",
        "cropSuitability": "Vegetables (Tomato)",
        "season": "All Seasons",
        "germination_rate": "93%",
        "germinationRate": "93%",
        "purity": "99%",
        "maturity_period": "65-70 Days post transplant",
        "maturityPeriod": "65-70 Days post transplant",
        "yield_potential": "35-45 Tons/Acre",
        "yieldPotential": "35-45 Tons/Acre",
        "seller_id": "seller_3",
        "sellerId": "seller_3",
        "seller_name": "GreenEarth Organic Bio-Tech",
        "sellerName": "GreenEarth Organic Bio-Tech",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "SYN-IND-QC-7721",
        "labCertId": "SYN-IND-QC-7721",
        "batch_number": "SYN-ABH-902",
        "batchNumber": "SYN-ABH-902",
        "expiry_date": "2027-08-31",
        "expiryDate": "2027-08-31",
        "description": "Vigorous plant habit with deep red, firm, square-round fruits. Highly tolerant to Tomato Leaf Curl Virus (ToLCV) with exceptional transport durability.",
        "dosage_guide": "40-50 gm seeds for 1 acre nursery bed.",
        "dosageGuide": "40-50 gm seeds for 1 acre nursery bed.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "ToLCV Resistant",
            "Firm Fruits",
            "Long Distance Shipping"
        ],
        "mfg_date": "2025-11-10",
        "mfgDate": "2025-11-10",
        "shelf_life": "18 Months from MFG",
        "shelfLife": "18 Months from MFG",
        "toxicityLevel": "Green - Non-Toxic Certified Seeds",
        "gstRate": "0% (Exempt for Certified Seeds)"
    },
    {
        "_id": "prod_5",
        "id": "prod_5",
        "name": "Pioneer P3501 High-Brix Hybrid Sweet Corn Seeds",
        "category": "Seeds",
        "category_icon": "🌾",
        "categoryIcon": "🌾",
        "subcategory": "Field Grain Crops",
        "brand": "Corteva Agriscience (Pioneer)",
        "price": 720,
        "original_price": 850,
        "originalPrice": 850,
        "unit": "1 kg Pack",
        "pack_sizes": [
            {
                "size": "1 kg Pack",
                "price": 720
            },
            {
                "size": "5 kg Pack",
                "price": 3400
            }
        ],
        "packSizes": [
            {
                "size": "1 kg Pack",
                "price": 720
            },
            {
                "size": "5 kg Pack",
                "price": 3400
            }
        ],
        "stock": 75,
        "rating": 4.8,
        "review_count": 31,
        "reviewCount": 31,
        "image_url": "/images/products/pioneer_corn_p3501.svg",
        "imageUrl": "/images/products/pioneer_corn_p3501.svg",
        "crop_suitability": "Corn / Maize",
        "cropSuitability": "Corn / Maize",
        "season": "Spring / Kharif / Rabi",
        "germination_rate": "95%",
        "germinationRate": "95%",
        "purity": "99%",
        "maturity_period": "75-80 Days",
        "maturityPeriod": "75-80 Days",
        "yield_potential": "85-95 Quintals fresh cobs/Acre",
        "yieldPotential": "85-95 Quintals fresh cobs/Acre",
        "seller_id": "seller_2",
        "sellerId": "seller_2",
        "seller_name": "National Seed & Bio Corp",
        "sellerName": "National Seed & Bio Corp",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "COR-PIO-QC-3301",
        "labCertId": "COR-PIO-QC-3301",
        "batch_number": "PIO-P3501-S2",
        "batchNumber": "PIO-P3501-S2",
        "expiry_date": "2027-05-31",
        "expiryDate": "2027-05-31",
        "description": "Premium sweet corn hybrid with high sweetness (Brix 14-16%). Uniform cobs with excellent tip filling and tight husk cover preventing borer entry.",
        "dosage_guide": "3 kg per acre with 60x20 cm spacing.",
        "dosageGuide": "3 kg per acre with 60x20 cm spacing.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": False,
        "isPopular": False,
        "tags": [
            "High Brix Sweetness",
            "Uniform Cobs",
            "Corteva Pioneer"
        ],
        "mfg_date": "2025-11-10",
        "mfgDate": "2025-11-10",
        "shelf_life": "18 Months from MFG",
        "shelfLife": "18 Months from MFG",
        "toxicityLevel": "Green - Non-Toxic Certified Seeds",
        "gstRate": "0% (Exempt for Certified Seeds)"
    },
    {
        "_id": "prod_6",
        "id": "prod_6",
        "name": "Advanta PAC-751 Hybrid Bold Yellow Mustard Seeds (Giriraj)",
        "category": "Seeds",
        "category_icon": "🌾",
        "categoryIcon": "🌾",
        "subcategory": "Field Grain Crops",
        "brand": "UPL Advanta Seeds",
        "price": 340,
        "original_price": 420,
        "originalPrice": 420,
        "unit": "1 kg Pack",
        "pack_sizes": [
            {
                "size": "1 kg Pack",
                "price": 340
            },
            {
                "size": "5 kg Pack",
                "price": 1550
            }
        ],
        "packSizes": [
            {
                "size": "1 kg Pack",
                "price": 340
            },
            {
                "size": "5 kg Pack",
                "price": 1550
            }
        ],
        "stock": 85,
        "rating": 4.9,
        "review_count": 48,
        "reviewCount": 48,
        "image_url": "/images/products/advanta_mustard_751.svg",
        "imageUrl": "/images/products/advanta_mustard_751.svg",
        "crop_suitability": "Mustard / Oilseeds",
        "cropSuitability": "Mustard / Oilseeds",
        "season": "Rabi (October - March)",
        "germination_rate": "93%",
        "germinationRate": "93%",
        "purity": "98.5%",
        "maturity_period": "125-130 Days",
        "maturityPeriod": "125-130 Days",
        "yield_potential": "11-13 Quintals/Acre (42% Oil)",
        "yieldPotential": "11-13 Quintals/Acre (42% Oil)",
        "seller_id": "seller_2",
        "sellerId": "seller_2",
        "seller_name": "National Seed & Bio Corp",
        "sellerName": "National Seed & Bio Corp",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "UPL-ADV-QC-1120",
        "labCertId": "UPL-ADV-QC-1120",
        "batch_number": "ADV-PAC-751-26",
        "batchNumber": "ADV-PAC-751-26",
        "expiry_date": "2027-03-31",
        "expiryDate": "2027-03-31",
        "description": "Bold yellow seeded hybrid mustard with 42% high oil content. Frost tolerant with vigorous branching and resistance to white rust and Alternaria blight.",
        "dosage_guide": "1.5 to 2.0 kg per acre in line sowing.",
        "dosageGuide": "1.5 to 2.0 kg per acre in line sowing.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "42% Oil Content",
            "Frost Tolerant",
            "UPL Advanta"
        ],
        "mfg_date": "2025-11-10",
        "mfgDate": "2025-11-10",
        "shelf_life": "18 Months from MFG",
        "shelfLife": "18 Months from MFG",
        "toxicityLevel": "Green - Non-Toxic Certified Seeds",
        "gstRate": "0% (Exempt for Certified Seeds)"
    },
    {
        "_id": "prod_32",
        "id": "prod_32",
        "name": "Mahyco Tejaswini F1 Hybrid Hot Chilli Seeds (10 gm)",
        "category": "Seeds",
        "category_icon": "🌾",
        "categoryIcon": "🌾",
        "subcategory": "Vegetable Seeds",
        "brand": "Mahyco Seeds",
        "price": 360,
        "original_price": 420,
        "originalPrice": 420,
        "unit": "10 gm Foil Pack",
        "pack_sizes": [
            {
                "size": "10 gm Pack",
                "price": 360
            },
            {
                "size": "50 gm Pack",
                "price": 1650
            }
        ],
        "packSizes": [
            {
                "size": "10 gm Pack",
                "price": 360
            },
            {
                "size": "50 gm Pack",
                "price": 1650
            }
        ],
        "stock": 95,
        "rating": 4.9,
        "review_count": 56,
        "reviewCount": 56,
        "image_url": "/images/products/mahyco_chilli_seeds.svg",
        "imageUrl": "/images/products/mahyco_chilli_seeds.svg",
        "crop_suitability": "Chilli / Vegetables",
        "cropSuitability": "Chilli / Vegetables",
        "season": "Kharif & Rabi",
        "germination_rate": "92%",
        "germinationRate": "92%",
        "purity": "99%",
        "maturity_period": "70-75 Days post transplant",
        "maturityPeriod": "70-75 Days post transplant",
        "yield_potential": "12-15 Tons fresh chilli/Acre",
        "yieldPotential": "12-15 Tons fresh chilli/Acre",
        "seller_id": "seller_3",
        "sellerId": "seller_3",
        "seller_name": "GreenEarth Organic Bio-Tech",
        "sellerName": "GreenEarth Organic Bio-Tech",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "MAH-CHIL-QC-8821",
        "labCertId": "MAH-CHIL-QC-8821",
        "batch_number": "TEJ-F1-2026-B1",
        "batchNumber": "TEJ-F1-2026-B1",
        "expiry_date": "2027-09-30",
        "expiryDate": "2027-09-30",
        "description": "High pungency hybrid chilli with dark green glossy fruits that turn bright red at maturity. Tolerant to sucking pests and leaf curl viruses with prolific continuous bearing.",
        "dosage_guide": "60-80 gm seeds for 1 acre nursery sowing.",
        "dosageGuide": "60-80 gm seeds for 1 acre nursery sowing.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "High Pungency",
            "Virus Tolerant",
            "Continuous Picking"
        ],
        "mfg_date": "2025-11-10",
        "mfgDate": "2025-11-10",
        "shelf_life": "18 Months from MFG",
        "shelfLife": "18 Months from MFG",
        "toxicityLevel": "Green - Non-Toxic Certified Seeds",
        "gstRate": "0% (Exempt for Certified Seeds)"
    },
    {
        "_id": "prod_33",
        "id": "prod_33",
        "name": "Nunhems Singham F1 Hybrid Okra / Bhindi Seeds (100 gm)",
        "category": "Seeds",
        "category_icon": "🌾",
        "categoryIcon": "🌾",
        "subcategory": "Vegetable Seeds",
        "brand": "Nunhems (BASF)",
        "price": 310,
        "original_price": 380,
        "originalPrice": 380,
        "unit": "100 gm Pack",
        "pack_sizes": [
            {
                "size": "100 gm Pack",
                "price": 310
            },
            {
                "size": "500 gm Pack",
                "price": 1420
            }
        ],
        "packSizes": [
            {
                "size": "100 gm Pack",
                "price": 310
            },
            {
                "size": "500 gm Pack",
                "price": 1420
            }
        ],
        "stock": 85,
        "rating": 4.8,
        "review_count": 39,
        "reviewCount": 39,
        "image_url": "/images/products/nunhems_okra_seeds.svg",
        "imageUrl": "/images/products/nunhems_okra_seeds.svg",
        "crop_suitability": "Okra / Bhindi",
        "cropSuitability": "Okra / Bhindi",
        "season": "Summer & Kharif",
        "germination_rate": "90%",
        "germinationRate": "90%",
        "purity": "99%",
        "maturity_period": "45-50 Days post sowing",
        "maturityPeriod": "45-50 Days post sowing",
        "yield_potential": "8-10 Tons/Acre",
        "yieldPotential": "8-10 Tons/Acre",
        "seller_id": "seller_3",
        "sellerId": "seller_3",
        "seller_name": "GreenEarth Organic Bio-Tech",
        "sellerName": "GreenEarth Organic Bio-Tech",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "BASF-NUN-QC-4410",
        "labCertId": "BASF-NUN-QC-4410",
        "batch_number": "SING-OKRA-26",
        "batchNumber": "SING-OKRA-26",
        "expiry_date": "2027-08-31",
        "expiryDate": "2027-08-31",
        "description": "Premium dark green, tender, 5-ridged okra hybrid. Highly resistant to Yellow Vein Mosaic Virus (YVMV) and Enation Leaf Curl Virus (ELCV) with short internodes.",
        "dosage_guide": "3.5 to 4.0 kg per acre in line sowing.",
        "dosageGuide": "3.5 to 4.0 kg per acre in line sowing.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": False,
        "isPopular": False,
        "tags": [
            "YVMV Resistant",
            "Tender Green Pods",
            "Nunhems Quality"
        ],
        "mfg_date": "2025-11-10",
        "mfgDate": "2025-11-10",
        "shelf_life": "18 Months from MFG",
        "shelfLife": "18 Months from MFG",
        "toxicityLevel": "Green - Non-Toxic Certified Seeds",
        "gstRate": "0% (Exempt for Certified Seeds)"
    },
    {
        "_id": "prod_7",
        "id": "prod_7",
        "name": "IFFCO Nano Urea Liquid Nitrogen Fertilizer (500 ml Bottle)",
        "category": "Fertilizers",
        "category_icon": "🧪",
        "categoryIcon": "🧪",
        "subcategory": "Liquid Nanotechnology",
        "brand": "IFFCO Cooperative",
        "price": 225,
        "original_price": 250,
        "originalPrice": 250,
        "unit": "500 ml Bottle (Replaces 1 Urea Bag)",
        "pack_sizes": [
            {
                "size": "500 ml Bottle",
                "price": 225
            },
            {
                "size": "Pack of 3 Bottles",
                "price": 650
            }
        ],
        "packSizes": [
            {
                "size": "500 ml Bottle",
                "price": 225
            },
            {
                "size": "Pack of 3 Bottles",
                "price": 650
            }
        ],
        "stock": 200,
        "rating": 4.9,
        "review_count": 142,
        "reviewCount": 142,
        "image_url": "/images/products/iffco_nano_urea.svg",
        "imageUrl": "/images/products/iffco_nano_urea.svg",
        "crop_suitability": "All Crops (Paddy, Wheat, Maize, Vegetables)",
        "cropSuitability": "All Crops (Paddy, Wheat, Maize, Vegetables)",
        "season": "Active Tillering & Branching",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "4.0% Total Nitrogen (40,000 PPM)",
        "maturity_period": "Rapid Foliar Stomata Absorption",
        "maturityPeriod": "Rapid Foliar Stomata Absorption",
        "yield_potential": "+8-10% Crop Yield Improvement",
        "yieldPotential": "+8-10% Crop Yield Improvement",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "IFFCO-NANO-FCO-2022",
        "labCertId": "IFFCO-NANO-FCO-2022",
        "batch_number": "NU-500-2026-B1",
        "batchNumber": "NU-500-2026-B1",
        "expiry_date": "2028-01-31",
        "expiryDate": "2028-01-31",
        "description": "World's first nanotechnology based liquid fertilizer developed by IFFCO. 1 bottle of 500ml replaces 1 full 45kg sack of conventional granular urea with 80%+ nitrogen use efficiency.",
        "dosage_guide": "2-4 ml per liter of water for foliar spray during vegetative stage.",
        "dosageGuide": "2-4 ml per liter of water for foliar spray during vegetative stage.",
        "is_featured": True,
        "isFeatured": True,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "IFFCO Nano",
            "Replaces 1 Urea Bag",
            "Eco Friendly"
        ],
        "mfg_date": "2026-02-15",
        "mfgDate": "2026-02-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Green - Eco Nutrients / FCO Approved",
        "gstRate": "5% GST Included"
    },
    {
        "_id": "prod_8",
        "id": "prod_8",
        "name": "IFFCO 100% Water Soluble NPK 19:19:19 Fertilizer (1 kg Pouch)",
        "category": "Fertilizers",
        "category_icon": "🧪",
        "categoryIcon": "🧪",
        "subcategory": "100% Water Soluble NPK",
        "brand": "IFFCO Cooperative",
        "price": 190,
        "original_price": 240,
        "originalPrice": 240,
        "unit": "1 kg Pouch",
        "pack_sizes": [
            {
                "size": "1 kg Pouch",
                "price": 190
            },
            {
                "size": "5 kg Pouch",
                "price": 890
            },
            {
                "size": "25 kg Bag",
                "price": 4200
            }
        ],
        "packSizes": [
            {
                "size": "1 kg Pouch",
                "price": 190
            },
            {
                "size": "5 kg Pouch",
                "price": 890
            },
            {
                "size": "25 kg Bag",
                "price": 4200
            }
        ],
        "stock": 180,
        "rating": 4.9,
        "review_count": 110,
        "reviewCount": 110,
        "image_url": "/images/products/iffco_npk_191919.svg",
        "imageUrl": "/images/products/iffco_npk_191919.svg",
        "crop_suitability": "All Crops (Paddy, Wheat, Vegetables, Fruits)",
        "cropSuitability": "All Crops (Paddy, Wheat, Vegetables, Fruits)",
        "season": "Vegetative & Early Flowering",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "100% Crystalline Soluble (No Residue)",
        "maturity_period": "Instant Uptake in 24 hrs",
        "maturityPeriod": "Instant Uptake in 24 hrs",
        "yield_potential": "+18% Plant Vigour",
        "yieldPotential": "+18% Plant Vigour",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "IFFCO-FCO-QC-8820",
        "labCertId": "IFFCO-FCO-QC-8820",
        "batch_number": "NPK-191919-B1-26",
        "batchNumber": "NPK-191919-B1-26",
        "expiry_date": "2028-06-30",
        "expiryDate": "2028-06-30",
        "description": "Balanced 19:19:19 primary plant nutrition enriched with trace minerals. 100% water soluble formulation ideal for foliar spray and fertigation via drip systems without nozzle clogging.",
        "dosage_guide": "5 gm per liter of water for foliar spray (approx 1 kg/acre).",
        "dosageGuide": "5 gm per liter of water for foliar spray (approx 1 kg/acre).",
        "is_featured": True,
        "isFeatured": True,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "100% Soluble",
            "Drip Grade",
            "IFFCO Quality"
        ],
        "mfg_date": "2026-02-15",
        "mfgDate": "2026-02-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Green - Eco Nutrients / FCO Approved",
        "gstRate": "5% GST Included"
    },
    {
        "_id": "prod_9",
        "id": "prod_9",
        "name": "Pure Cold-Pressed Organic Neem Cake Fertilizer (25 kg Bag)",
        "category": "Fertilizers",
        "category_icon": "🧪",
        "categoryIcon": "🧪",
        "subcategory": "Organic & Bio-Fertilizers",
        "brand": "GreenEarth Organic Bio-Tech",
        "price": 680,
        "original_price": 800,
        "originalPrice": 800,
        "unit": "25 kg Bag",
        "pack_sizes": [
            {
                "size": "10 kg Bag",
                "price": 310
            },
            {
                "size": "25 kg Bag",
                "price": 680
            },
            {
                "size": "50 kg Bag",
                "price": 1280
            }
        ],
        "packSizes": [
            {
                "size": "10 kg Bag",
                "price": 310
            },
            {
                "size": "25 kg Bag",
                "price": 680
            },
            {
                "size": "50 kg Bag",
                "price": 1280
            }
        ],
        "stock": 80,
        "rating": 4.8,
        "review_count": 55,
        "reviewCount": 55,
        "image_url": "/images/products/organic_neem_cake.svg",
        "imageUrl": "/images/products/organic_neem_cake.svg",
        "crop_suitability": "Organic Farming / Sugarcane / Orchards / Vegetables",
        "cropSuitability": "Organic Farming / Sugarcane / Orchards / Vegetables",
        "season": "Basal Soil Application",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "100% Pure Cold-Pressed (NPOP Certified)",
        "maturity_period": "Slow Release (90 Days)",
        "maturityPeriod": "Slow Release (90 Days)",
        "yield_potential": "Protects roots from nematodes & termites",
        "yieldPotential": "Protects roots from nematodes & termites",
        "seller_id": "seller_3",
        "sellerId": "seller_3",
        "seller_name": "GreenEarth Organic Bio-Tech",
        "sellerName": "GreenEarth Organic Bio-Tech",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "NPOP-ORG-QC-9921",
        "labCertId": "NPOP-ORG-QC-9921",
        "batch_number": "NC-25KG-89-2026",
        "batchNumber": "NC-25KG-89-2026",
        "expiry_date": "2027-12-31",
        "expiryDate": "2027-12-31",
        "description": "Rich in natural Azadirachtin, nitrogen (4%), phosphorus, and potassium. Dual-purpose organic soil conditioner and natural nematicide protecting root zones from white grubs and nematodes.",
        "dosage_guide": "100-150 kg per acre mixed into soil during land preparation.",
        "dosageGuide": "100-150 kg per acre mixed into soil during land preparation.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "100% Organic",
            "Anti-Nematode",
            "NPOP Certified"
        ],
        "mfg_date": "2025-11-10",
        "mfgDate": "2025-11-10",
        "shelf_life": "18 Months from MFG",
        "shelfLife": "18 Months from MFG",
        "toxicityLevel": "Green - Eco Nutrients / FCO Approved",
        "gstRate": "5% GST Included"
    },
    {
        "_id": "prod_10",
        "id": "prod_10",
        "name": "Mahadhan Chelated Zinc EDTA 12% Micronutrient Fertilizer (500 gm)",
        "category": "Fertilizers",
        "category_icon": "🧪",
        "categoryIcon": "🧪",
        "subcategory": "Micronutrients & Growth Promoters",
        "brand": "Mahadhan (Deepak Fertilisers)",
        "price": 320,
        "original_price": 390,
        "originalPrice": 390,
        "unit": "500 gm Pouch",
        "pack_sizes": [
            {
                "size": "500 gm Pouch",
                "price": 320
            },
            {
                "size": "1 kg Pouch",
                "price": 599
            }
        ],
        "packSizes": [
            {
                "size": "500 gm Pouch",
                "price": 320
            },
            {
                "size": "1 kg Pouch",
                "price": 599
            }
        ],
        "stock": 90,
        "rating": 4.8,
        "review_count": 38,
        "reviewCount": 38,
        "image_url": "/images/products/mahadhan_chelated_zinc.svg",
        "imageUrl": "/images/products/mahadhan_chelated_zinc.svg",
        "crop_suitability": "Paddy, Wheat, Maize, Citrus, Cotton",
        "cropSuitability": "Paddy, Wheat, Maize, Citrus, Cotton",
        "season": "Tillering & Active Growth",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "100% EDTA Chelated Zinc (12% Zn)",
        "maturity_period": "Rapid Foliar Uptake",
        "maturityPeriod": "Rapid Foliar Uptake",
        "yield_potential": "Cures Khaira Disease & Yellowing in Paddy",
        "yieldPotential": "Cures Khaira Disease & Yellowing in Paddy",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "FCO-ZN-EDTA-4491",
        "labCertId": "FCO-ZN-EDTA-4491",
        "batch_number": "MD-ZN12-701-26",
        "batchNumber": "MD-ZN12-701-26",
        "expiry_date": "2028-04-30",
        "expiryDate": "2028-04-30",
        "description": "Easily absorbable EDTA-chelated zinc powder preventing zinc deficiency, chlorosis, and stunted tillering in paddy, wheat, and horticultural crops.",
        "dosage_guide": "1.0 - 1.5 gm per liter of water for foliar spray.",
        "dosageGuide": "1.0 - 1.5 gm per liter of water for foliar spray.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": False,
        "isPopular": False,
        "tags": [
            "12% Zinc EDTA",
            "Cures Khaira Disease",
            "Mahadhan Quality"
        ],
        "mfg_date": "2026-02-15",
        "mfgDate": "2026-02-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Green - Eco Nutrients / FCO Approved",
        "gstRate": "5% GST Included"
    },
    {
        "_id": "prod_21",
        "id": "prod_21",
        "name": "IFFCO Neem Coated Granular Urea (45 kg Bag)",
        "category": "Fertilizers",
        "category_icon": "🧪",
        "categoryIcon": "🧪",
        "subcategory": "Bulk Soil Fertilizers",
        "brand": "IFFCO Cooperative",
        "price": 266,
        "original_price": 300,
        "originalPrice": 300,
        "unit": "45 kg Bag (Govt Subsidized)",
        "pack_sizes": [
            {
                "size": "45 kg Bag",
                "price": 266
            },
            {
                "size": "10 Bags Lot (450 kg)",
                "price": 2660
            }
        ],
        "packSizes": [
            {
                "size": "45 kg Bag",
                "price": 266
            },
            {
                "size": "10 Bags Lot (450 kg)",
                "price": 2660
            }
        ],
        "stock": 350,
        "rating": 4.9,
        "review_count": 210,
        "reviewCount": 210,
        "image_url": "/images/products/iffco_urea_sack.svg",
        "imageUrl": "/images/products/iffco_urea_sack.svg",
        "crop_suitability": "Paddy, Wheat, Sugarcane, Maize, Cotton",
        "cropSuitability": "Paddy, Wheat, Sugarcane, Maize, Cotton",
        "season": "Vegetative & Top Dressing",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "46% Total Nitrogen (Neem Oil Treated)",
        "maturity_period": "Sustained Slow Release",
        "maturityPeriod": "Sustained Slow Release",
        "yield_potential": "Maximum Chlorophyll & Tillering Booster",
        "yieldPotential": "Maximum Chlorophyll & Tillering Booster",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "FCO-UREA-IFFCO-2024",
        "labCertId": "FCO-UREA-IFFCO-2024",
        "batch_number": "IFF-NCU-45-2026",
        "batchNumber": "IFF-NCU-45-2026",
        "expiry_date": "2029-12-31",
        "expiryDate": "2029-12-31",
        "description": "Essential primary nitrogenous chemical fertilizer treated with 100% natural neem oil to slow down nitrification, reduce leaching loss, and maximize crop absorption.",
        "dosage_guide": "45-90 kg per acre split into 2-3 top dressings according to soil testing.",
        "dosageGuide": "45-90 kg per acre split into 2-3 top dressings according to soil testing.",
        "is_featured": True,
        "isFeatured": True,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "Neem Coated",
            "46% Nitrogen",
            "Govt Subsidized",
            "IFFCO"
        ],
        "mfg_date": "2026-01-20",
        "mfgDate": "2026-01-20",
        "shelf_life": "3 to 5 Years Warranty",
        "shelfLife": "3 to 5 Years Warranty",
        "toxicityLevel": "Green - Eco Nutrients / FCO Approved",
        "gstRate": "5% GST Included"
    },
    {
        "_id": "prod_22",
        "id": "prod_22",
        "name": "Coromandel Gromor DAP Di-Ammonium Phosphate 18:46:0 (50 kg Bag)",
        "category": "Fertilizers",
        "category_icon": "🧪",
        "categoryIcon": "🧪",
        "subcategory": "Bulk Soil Fertilizers",
        "brand": "Coromandel International",
        "price": 1350,
        "original_price": 1450,
        "originalPrice": 1450,
        "unit": "50 kg Bag",
        "pack_sizes": [
            {
                "size": "50 kg Bag",
                "price": 1350
            },
            {
                "size": "5 Bags Lot (250 kg)",
                "price": 6700
            }
        ],
        "packSizes": [
            {
                "size": "50 kg Bag",
                "price": 1350
            },
            {
                "size": "5 Bags Lot (250 kg)",
                "price": 6700
            }
        ],
        "stock": 190,
        "rating": 4.9,
        "review_count": 165,
        "reviewCount": 165,
        "image_url": "/images/products/coromandel_dap_bag.svg",
        "imageUrl": "/images/products/coromandel_dap_bag.svg",
        "crop_suitability": "Paddy, Wheat, Potato, Mustard, Cotton, Pulses",
        "cropSuitability": "Paddy, Wheat, Potato, Mustard, Cotton, Pulses",
        "season": "Basal Sowing Application",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "18% Ammoniacal Nitrogen + 46% P2O5",
        "maturity_period": "High Water Soluble Phosphate",
        "maturityPeriod": "High Water Soluble Phosphate",
        "yield_potential": "Drives Deep Root Proliferation & Early Tillering",
        "yieldPotential": "Drives Deep Root Proliferation & Early Tillering",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "FCO-DAP-CORO-8891",
        "labCertId": "FCO-DAP-CORO-8891",
        "batch_number": "CORO-DAP-50KG-26",
        "batchNumber": "CORO-DAP-50KG-26",
        "expiry_date": "2029-06-30",
        "expiryDate": "2029-06-30",
        "description": "The nation's most trusted phosphatic fertilizer. Delivers concentrated phosphorus and starter nitrogen right into root zones during initial sowing and transplanting stages.",
        "dosage_guide": "50 kg per acre as basal soil dose at the time of field preparation/sowing.",
        "dosageGuide": "50 kg per acre as basal soil dose at the time of field preparation/sowing.",
        "is_featured": True,
        "isFeatured": True,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "18:46:0 Ratio",
            "Root Strength",
            "Coromandel Gromor"
        ],
        "mfg_date": "2026-01-20",
        "mfgDate": "2026-01-20",
        "shelf_life": "3 to 5 Years Warranty",
        "shelfLife": "3 to 5 Years Warranty",
        "toxicityLevel": "Green - Eco Nutrients / FCO Approved",
        "gstRate": "5% GST Included"
    },
    {
        "_id": "prod_23",
        "id": "prod_23",
        "name": "Indian Potash (IPL) Muriate of Potash MOP 60% K2O (50 kg Bag)",
        "category": "Fertilizers",
        "category_icon": "🧪",
        "categoryIcon": "🧪",
        "subcategory": "Bulk Soil Fertilizers",
        "brand": "Indian Potash Limited (IPL)",
        "price": 1650,
        "original_price": 1800,
        "originalPrice": 1800,
        "unit": "50 kg Bag",
        "pack_sizes": [
            {
                "size": "50 kg Bag",
                "price": 1650
            }
        ],
        "packSizes": [
            {
                "size": "50 kg Bag",
                "price": 1650
            }
        ],
        "stock": 140,
        "rating": 4.9,
        "review_count": 98,
        "reviewCount": 98,
        "image_url": "/images/products/ipl_mop_potash.svg",
        "imageUrl": "/images/products/ipl_mop_potash.svg",
        "crop_suitability": "Paddy, Sugarcane, Banana, Potato, Wheat, Cotton",
        "cropSuitability": "Paddy, Sugarcane, Banana, Potato, Wheat, Cotton",
        "season": "Basal & Flowering Stages",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "60.0% Potassium Oxide (K2O)",
        "maturity_period": "Improves Water Retention & Stalk Strength",
        "maturityPeriod": "Improves Water Retention & Stalk Strength",
        "yield_potential": "Prevents Lodging & Increases Grain Plumpness",
        "yieldPotential": "Prevents Lodging & Increases Grain Plumpness",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "FCO-MOP-IPL-7710",
        "labCertId": "FCO-MOP-IPL-7710",
        "batch_number": "IPL-MOP-60-26",
        "batchNumber": "IPL-MOP-60-26",
        "expiry_date": "2029-08-31",
        "expiryDate": "2029-08-31",
        "description": "Essential potassium fertilizer (Potassium Chloride 60% K2O). Enhances disease resistance, drought tolerance, photosynthesis, grain luster, and bold seed weight.",
        "dosage_guide": "25-35 kg per acre based on soil analysis recommendations.",
        "dosageGuide": "25-35 kg per acre based on soil analysis recommendations.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "60% K2O Potash",
            "Anti-Lodging",
            "IPL Certified"
        ],
        "mfg_date": "2026-01-20",
        "mfgDate": "2026-01-20",
        "shelf_life": "3 to 5 Years Warranty",
        "shelfLife": "3 to 5 Years Warranty",
        "toxicityLevel": "Green - Eco Nutrients / FCO Approved",
        "gstRate": "5% GST Included"
    },
    {
        "_id": "prod_24",
        "id": "prod_24",
        "name": "Khaitan Single Super Phosphate SSP 16% P2O5 + 11% Sulphur (50 kg Bag)",
        "category": "Fertilizers",
        "category_icon": "🧪",
        "categoryIcon": "🧪",
        "subcategory": "Bulk Soil Fertilizers",
        "brand": "Khaitan Chemicals & Fertilizers",
        "price": 490,
        "original_price": 580,
        "originalPrice": 580,
        "unit": "50 kg Bag",
        "pack_sizes": [
            {
                "size": "50 kg Bag",
                "price": 490
            },
            {
                "size": "5 Bags Lot (250 kg)",
                "price": 2400
            }
        ],
        "packSizes": [
            {
                "size": "50 kg Bag",
                "price": 490
            },
            {
                "size": "5 Bags Lot (250 kg)",
                "price": 2400
            }
        ],
        "stock": 160,
        "rating": 4.8,
        "review_count": 74,
        "reviewCount": 74,
        "image_url": "/images/products/khaitan_ssp_bag.svg",
        "imageUrl": "/images/products/khaitan_ssp_bag.svg",
        "crop_suitability": "Mustard, Groundnut, Soybean, Pulses, Wheat",
        "cropSuitability": "Mustard, Groundnut, Soybean, Pulses, Wheat",
        "season": "Basal Soil Preparation",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "16% Water Soluble P2O5 + 11% S + 19% Calcium",
        "maturity_period": "3-in-1 Nutrient Package",
        "maturityPeriod": "3-in-1 Nutrient Package",
        "yield_potential": "+15% Oil Content in Mustard & Groundnut",
        "yieldPotential": "+15% Oil Content in Mustard & Groundnut",
        "seller_id": "seller_2",
        "sellerId": "seller_2",
        "seller_name": "National Seed & Bio Corp",
        "sellerName": "National Seed & Bio Corp",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "FCO-SSP-KHAITAN-9921",
        "labCertId": "FCO-SSP-KHAITAN-9921",
        "batch_number": "KHA-SSP-50-26",
        "batchNumber": "KHA-SSP-50-26",
        "expiry_date": "2029-05-31",
        "expiryDate": "2029-05-31",
        "description": "Multi-nutrient fertilizer supplying 16% Phosphorus, 11% Sulphur, and 19% Calcium. Highly recommended for oilseeds and pulses to boost nodulation and oil recovery percentage.",
        "dosage_guide": "100-150 kg per acre mixed uniformly into soil during final ploughing.",
        "dosageGuide": "100-150 kg per acre mixed uniformly into soil during final ploughing.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "Phosphorus + Sulphur",
            "Oil Content Booster",
            "Khaitan SSP"
        ],
        "mfg_date": "2026-01-20",
        "mfgDate": "2026-01-20",
        "shelf_life": "3 to 5 Years Warranty",
        "shelfLife": "3 to 5 Years Warranty",
        "toxicityLevel": "Green - Eco Nutrients / FCO Approved",
        "gstRate": "5% GST Included"
    },
    {
        "_id": "prod_25",
        "id": "prod_25",
        "name": "Bio-Enriched 100% Organic Vermicompost Manure (50 kg Sack)",
        "category": "Fertilizers",
        "category_icon": "🧪",
        "categoryIcon": "🧪",
        "subcategory": "Organic & Bio-Fertilizers",
        "brand": "GreenEarth Organic Bio-Tech",
        "price": 450,
        "original_price": 550,
        "originalPrice": 550,
        "unit": "50 kg Sack",
        "pack_sizes": [
            {
                "size": "25 kg Sack",
                "price": 240
            },
            {
                "size": "50 kg Sack",
                "price": 450
            },
            {
                "size": "1 Ton Bulk Lot (20 Sacks)",
                "price": 8500
            }
        ],
        "packSizes": [
            {
                "size": "25 kg Sack",
                "price": 240
            },
            {
                "size": "50 kg Sack",
                "price": 450
            },
            {
                "size": "1 Ton Bulk Lot (20 Sacks)",
                "price": 8500
            }
        ],
        "stock": 120,
        "rating": 4.9,
        "review_count": 89,
        "reviewCount": 89,
        "image_url": "/images/products/vermicompost_sack.svg",
        "imageUrl": "/images/products/vermicompost_sack.svg",
        "crop_suitability": "All Crops, Organic Farming, Orchards, Polyhouse",
        "cropSuitability": "All Crops, Organic Farming, Orchards, Polyhouse",
        "season": "All Seasons",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "100% Eisenia Fetida Earthworm Castings (NPOP)",
        "maturity_period": "Enhances Soil Organic Carbon & Microbial Life",
        "maturityPeriod": "Enhances Soil Organic Carbon & Microbial Life",
        "yield_potential": "Restores Dead Soil Fertility & Drought Resistance",
        "yieldPotential": "Restores Dead Soil Fertility & Drought Resistance",
        "seller_id": "seller_3",
        "sellerId": "seller_3",
        "seller_name": "GreenEarth Organic Bio-Tech",
        "sellerName": "GreenEarth Organic Bio-Tech",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "NPOP-VERMI-QC-1120",
        "labCertId": "NPOP-VERMI-QC-1120",
        "batch_number": "GEO-VERM-50-26",
        "batchNumber": "GEO-VERM-50-26",
        "expiry_date": "2027-12-31",
        "expiryDate": "2027-12-31",
        "description": "Finely sifted, odor-free, pure vermicompost produced via red earthworms (Eisenia fetida). Packed with humic acids, beneficial mycorrhizae, and micro-nutrients.",
        "dosage_guide": "500 kg to 1 Ton per acre mixed into top 15cm soil.",
        "dosageGuide": "500 kg to 1 Ton per acre mixed into top 15cm soil.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "100% Organic",
            "Humic Enriched",
            "Soil Carbon",
            "NPOP"
        ],
        "mfg_date": "2025-11-10",
        "mfgDate": "2025-11-10",
        "shelf_life": "18 Months from MFG",
        "shelfLife": "18 Months from MFG",
        "toxicityLevel": "Green - Eco Nutrients / FCO Approved",
        "gstRate": "5% GST Included"
    },
    {
        "_id": "prod_26",
        "id": "prod_26",
        "name": "Multiplex Samurai Liquid Bio-Stimulant Seaweed Extract (1 Litre)",
        "category": "Fertilizers",
        "category_icon": "🧪",
        "categoryIcon": "🧪",
        "subcategory": "Micronutrients & Growth Promoters",
        "brand": "Multiplex Group",
        "price": 580,
        "original_price": 690,
        "originalPrice": 690,
        "unit": "1 Litre Bottle",
        "pack_sizes": [
            {
                "size": "500 ml Bottle",
                "price": 310
            },
            {
                "size": "1 Litre Bottle",
                "price": 580
            }
        ],
        "packSizes": [
            {
                "size": "500 ml Bottle",
                "price": 310
            },
            {
                "size": "1 Litre Bottle",
                "price": 580
            }
        ],
        "stock": 110,
        "rating": 4.8,
        "review_count": 62,
        "reviewCount": 62,
        "image_url": "/images/products/multiplex_seaweed.svg",
        "imageUrl": "/images/products/multiplex_seaweed.svg",
        "crop_suitability": "Paddy, Cotton, Chilli, Tomato, Grapes, Mango",
        "cropSuitability": "Paddy, Cotton, Chilli, Tomato, Grapes, Mango",
        "season": "Vegetative & Flowering Stages",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "Ascophyllum Nodosum Marine Algae Extract",
        "maturity_period": "Stimulates Cytokinins & Auxins",
        "maturityPeriod": "Stimulates Cytokinins & Auxins",
        "yield_potential": "+20% Increased Flowering & Fruit Retention",
        "yieldPotential": "+20% Increased Flowering & Fruit Retention",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "FCO-BIO-MUL-2024",
        "labCertId": "FCO-BIO-MUL-2024",
        "batch_number": "MUL-SAM-1L-26",
        "batchNumber": "MUL-SAM-1L-26",
        "expiry_date": "2028-06-30",
        "expiryDate": "2028-06-30",
        "description": "Cold-extracted Nordic marine brown seaweed (Ascophyllum nodosum). Natural plant growth promoter providing amino acids, natural gibberellins, and enzymes preventing flower drop.",
        "dosage_guide": "2.0 - 2.5 ml per liter of water for foliar spray.",
        "dosageGuide": "2.0 - 2.5 ml per liter of water for foliar spray.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "Seaweed Bio-Stimulant",
            "Prevents Flower Drop",
            "Multiplex Quality"
        ],
        "mfg_date": "2026-02-15",
        "mfgDate": "2026-02-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Green - Eco Nutrients / FCO Approved",
        "gstRate": "5% GST Included"
    },
    {
        "_id": "prod_11",
        "id": "prod_11",
        "name": "Corteva Pexalon Insecticide (Triflumezopyrim 10% SC - 235 ml Bottle)",
        "category": "Pesticides",
        "category_icon": "🌱",
        "categoryIcon": "🌱",
        "subcategory": "Insecticides (Hoppers)",
        "brand": "Corteva Agriscience",
        "price": 1390,
        "original_price": 1550,
        "originalPrice": 1550,
        "unit": "235 ml Bottle (1 Acre Paddy Dose)",
        "pack_sizes": [
            {
                "size": "94 ml Bottle",
                "price": 620
            },
            {
                "size": "235 ml Bottle",
                "price": 1390
            }
        ],
        "packSizes": [
            {
                "size": "94 ml Bottle",
                "price": 620
            },
            {
                "size": "235 ml Bottle",
                "price": 1390
            }
        ],
        "stock": 80,
        "rating": 4.9,
        "review_count": 86,
        "reviewCount": 86,
        "image_url": "/images/products/corteva_pexalon.svg",
        "imageUrl": "/images/products/corteva_pexalon.svg",
        "crop_suitability": "Paddy / Rice (Brown Planthopper & WBPH)",
        "cropSuitability": "Paddy / Rice (Brown Planthopper & WBPH)",
        "season": "BPH Infestation / Boot Leaf Stage",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "Triflumezopyrim 10% SC",
        "maturity_period": "21 Days Extended Residual Control",
        "maturityPeriod": "21 Days Extended Residual Control",
        "yield_potential": "Stops hopper burn completely",
        "yieldPotential": "Stops hopper burn completely",
        "seller_id": "seller_2",
        "sellerId": "seller_2",
        "seller_name": "National Seed & Bio Corp",
        "sellerName": "National Seed & Bio Corp",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "CIR-14392/2018-TRIFLUMEZOPYRIM-SC",
        "labCertId": "CIR-14392/2018-TRIFLUMEZOPYRIM-SC",
        "batch_number": "COR-PEX-992-2026",
        "batchNumber": "COR-PEX-992-2026",
        "expiry_date": "2028-02-28",
        "expiryDate": "2028-02-28",
        "description": "The gold-standard rice hopper controller powered by Pyraxalt. Immediately stops BPH feeding within 15 minutes and protects paddy crop for 21 days with zero resurgence.",
        "dosage_guide": "235 ml in 200 liters of water per acre. Direct spray at the base of paddy plants.",
        "dosageGuide": "235 ml in 200 liters of water per acre. Direct spray at the base of paddy plants.",
        "is_featured": True,
        "isFeatured": True,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "Corteva Pexalon",
            "BPH Hopper Specialist",
            "21-Day Shield"
        ],
        "mfg_date": "2026-02-15",
        "mfgDate": "2026-02-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Yellow - Moderately Toxic (Insecticide/Herbicide)",
        "gstRate": "18% GST Included"
    },
    {
        "_id": "prod_12",
        "id": "prod_12",
        "name": "FMC Coragen Insecticide (Chlorantraniliprole 18.5% SC - 150 ml Bottle)",
        "category": "Pesticides",
        "category_icon": "🌱",
        "categoryIcon": "🌱",
        "subcategory": "Insecticides (Borers & Caterpillars)",
        "brand": "FMC Corporation",
        "price": 1780,
        "original_price": 1950,
        "originalPrice": 1950,
        "unit": "150 ml Bottle",
        "pack_sizes": [
            {
                "size": "60 ml Bottle",
                "price": 790
            },
            {
                "size": "150 ml Bottle",
                "price": 1780
            }
        ],
        "packSizes": [
            {
                "size": "60 ml Bottle",
                "price": 790
            },
            {
                "size": "150 ml Bottle",
                "price": 1780
            }
        ],
        "stock": 65,
        "rating": 4.9,
        "review_count": 94,
        "reviewCount": 94,
        "image_url": "/images/products/fmc_coragen.svg",
        "imageUrl": "/images/products/fmc_coragen.svg",
        "crop_suitability": "Sugarcane, Paddy, Cotton, Tomato, Maize",
        "cropSuitability": "Sugarcane, Paddy, Cotton, Tomato, Maize",
        "season": "Early Shoot Borer & Stem Borer Stages",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "Chlorantraniliprole 18.5% SC (Rynaxypyr)",
        "maturity_period": "Long Lasting Ovi-Larvicidal Action",
        "maturityPeriod": "Long Lasting Ovi-Larvicidal Action",
        "yield_potential": "Prevents dead hearts & boring damage",
        "yieldPotential": "Prevents dead hearts & boring damage",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "CIR-12091/2016-CHLORANTRANILIPROLE-SC",
        "labCertId": "CIR-12091/2016-CHLORANTRANILIPROLE-SC",
        "batch_number": "FMC-COR-150-K26",
        "batchNumber": "FMC-COR-150-K26",
        "expiry_date": "2028-05-31",
        "expiryDate": "2028-05-31",
        "description": "World-leading insecticide with Rynaxypyr active molecule. Controls stem borers, leaf folders, early shoot borers, and bollworms with excellent crop safety profile.",
        "dosage_guide": "60 ml per acre in paddy/cotton; 150 ml per acre in sugarcane.",
        "dosageGuide": "60 ml per acre in paddy/cotton; 150 ml per acre in sugarcane.",
        "is_featured": True,
        "isFeatured": True,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "FMC Coragen",
            "Rynaxypyr Active",
            "Borer Specialist"
        ],
        "mfg_date": "2026-02-15",
        "mfgDate": "2026-02-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Yellow - Moderately Toxic (Insecticide/Herbicide)",
        "gstRate": "18% GST Included"
    },
    {
        "_id": "prod_13",
        "id": "prod_13",
        "name": "Bayer Confidor / Admire Insecticide (Imidacloprid 17.8% SL - 250 ml Bottle)",
        "category": "Pesticides",
        "category_icon": "🌱",
        "categoryIcon": "🌱",
        "subcategory": "Insecticides (Sucking Pests)",
        "brand": "Bayer CropScience",
        "price": 640,
        "original_price": 750,
        "originalPrice": 750,
        "unit": "250 ml Bottle",
        "pack_sizes": [
            {
                "size": "100 ml Bottle",
                "price": 290
            },
            {
                "size": "250 ml Bottle",
                "price": 640
            },
            {
                "size": "500 ml Bottle",
                "price": 1190
            }
        ],
        "packSizes": [
            {
                "size": "100 ml Bottle",
                "price": 290
            },
            {
                "size": "250 ml Bottle",
                "price": 640
            },
            {
                "size": "500 ml Bottle",
                "price": 1190
            }
        ],
        "stock": 110,
        "rating": 4.8,
        "review_count": 72,
        "reviewCount": 72,
        "image_url": "/images/products/bayer_confidor.svg",
        "imageUrl": "/images/products/bayer_confidor.svg",
        "crop_suitability": "Cotton, Chilli, Paddy, Vegetables, Mango",
        "cropSuitability": "Cotton, Chilli, Paddy, Vegetables, Mango",
        "season": "Sucking Pest Attack Stage",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "Imidacloprid 17.8% SL",
        "maturity_period": "Systemic Fast Knockdown",
        "maturityPeriod": "Systemic Fast Knockdown",
        "yield_potential": "Protects leaves from curling and mosaic virus",
        "yieldPotential": "Protects leaves from curling and mosaic virus",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "CIR-8842/2014-IMIDACLOPRID-SL",
        "labCertId": "CIR-8842/2014-IMIDACLOPRID-SL",
        "batch_number": "BAY-CONF-250-26",
        "batchNumber": "BAY-CONF-250-26",
        "expiry_date": "2028-03-31",
        "expiryDate": "2028-03-31",
        "description": "Iconic systemic insecticide from Bayer for controlling aphids, jassids, thrips, and whiteflies. Quickly absorbed by foliage and translocated throughout the plant.",
        "dosage_guide": "0.5 to 1.0 ml per liter of water (approx 50-75 ml/acre).",
        "dosageGuide": "0.5 to 1.0 ml per liter of water (approx 50-75 ml/acre).",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "Bayer Confidor",
            "Anti-Sucking Pests",
            "Systemic Shield"
        ],
        "mfg_date": "2026-02-15",
        "mfgDate": "2026-02-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Yellow - Moderately Toxic (Insecticide/Herbicide)",
        "gstRate": "18% GST Included"
    },
    {
        "_id": "prod_14",
        "id": "prod_14",
        "name": "UPL Saaf Dual-Action Systemic & Contact Fungicide (500 gm Pack)",
        "category": "Pesticides",
        "category_icon": "🌱",
        "categoryIcon": "🌱",
        "subcategory": "Fungicides & Bactericides",
        "brand": "UPL Limited",
        "price": 290,
        "original_price": 360,
        "originalPrice": 360,
        "unit": "500 gm Pack",
        "pack_sizes": [
            {
                "size": "250 gm Pack",
                "price": 160
            },
            {
                "size": "500 gm Pack",
                "price": 290
            },
            {
                "size": "1 kg Pack",
                "price": 540
            }
        ],
        "packSizes": [
            {
                "size": "250 gm Pack",
                "price": 160
            },
            {
                "size": "500 gm Pack",
                "price": 290
            },
            {
                "size": "1 kg Pack",
                "price": 540
            }
        ],
        "stock": 130,
        "rating": 4.9,
        "review_count": 88,
        "reviewCount": 88,
        "image_url": "/images/products/upl_saaf.svg",
        "imageUrl": "/images/products/upl_saaf.svg",
        "crop_suitability": "Groundnut, Paddy, Potato, Chilli, Apple, Tea",
        "cropSuitability": "Groundnut, Paddy, Potato, Chilli, Apple, Tea",
        "season": "Monsoon / High Humidity Seasons",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "Carbendazim 12% + Mancozeb 63% WP",
        "maturity_period": "Dual Action Protective & Curative Barrier",
        "maturityPeriod": "Dual Action Protective & Curative Barrier",
        "yield_potential": "Prevents blast, leaf spot & damping off",
        "yieldPotential": "Prevents blast, leaf spot & damping off",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "CIR-3920/2012-CARBENDAZIM+MANCOZEB-WP",
        "labCertId": "CIR-3920/2012-CARBENDAZIM+MANCOZEB-WP",
        "batch_number": "UPL-SAAF-500-26",
        "batchNumber": "UPL-SAAF-500-26",
        "expiry_date": "2027-11-30",
        "expiryDate": "2027-11-30",
        "description": "Proven combination fungicide with systemic and contact protection. Highly effective against paddy blast, groundnut tikka disease, late blight in potato, and fruit rot in chilli.",
        "dosage_guide": "2 grams per liter of water for foliar spray.",
        "dosageGuide": "2 grams per liter of water for foliar spray.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "UPL Saaf",
            "Dual Action Fungicide",
            "Broad Spectrum"
        ],
        "mfg_date": "2025-11-10",
        "mfgDate": "2025-11-10",
        "shelf_life": "18 Months from MFG",
        "shelfLife": "18 Months from MFG",
        "toxicityLevel": "Blue - Slightly Toxic (Fungicide/Bactericide)",
        "gstRate": "18% GST Included"
    },
    {
        "_id": "prod_15",
        "id": "prod_15",
        "name": "Dursban / Chlorpyrifos 20% EC Broad-Spectrum Insecticide (1 Litre)",
        "category": "Pesticides",
        "category_icon": "🌱",
        "categoryIcon": "🌱",
        "subcategory": "Insecticides (Soil & Termites)",
        "brand": "Adama / Dow AgroSciences",
        "price": 420,
        "original_price": 520,
        "originalPrice": 520,
        "unit": "1 Litre Bottle",
        "pack_sizes": [
            {
                "size": "500 ml Bottle",
                "price": 230
            },
            {
                "size": "1 Litre Bottle",
                "price": 420
            },
            {
                "size": "5 Litres Can",
                "price": 1950
            }
        ],
        "packSizes": [
            {
                "size": "500 ml Bottle",
                "price": 230
            },
            {
                "size": "1 Litre Bottle",
                "price": 420
            },
            {
                "size": "5 Litres Can",
                "price": 1950
            }
        ],
        "stock": 95,
        "rating": 4.7,
        "review_count": 51,
        "reviewCount": 51,
        "image_url": "/images/products/dursban_chlorpyrifos.svg",
        "imageUrl": "/images/products/dursban_chlorpyrifos.svg",
        "crop_suitability": "Paddy, Sugarcane, Cotton, Gram, Timber",
        "cropSuitability": "Paddy, Sugarcane, Cotton, Gram, Timber",
        "season": "Soil Drenching & Foliar Spray",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "Chlorpyrifos 20% EC",
        "maturity_period": "Contact, Stomach & Vapour Action",
        "maturityPeriod": "Contact, Stomach & Vapour Action",
        "yield_potential": "Eliminates subterranean termites & cutworms",
        "yieldPotential": "Eliminates subterranean termites & cutworms",
        "seller_id": "seller_2",
        "sellerId": "seller_2",
        "seller_name": "National Seed & Bio Corp",
        "sellerName": "National Seed & Bio Corp",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "CIR-4410/2015-CHLORPYRIFOS-EC",
        "labCertId": "CIR-4410/2015-CHLORPYRIFOS-EC",
        "batch_number": "DUR-20EC-1L-26",
        "batchNumber": "DUR-20EC-1L-26",
        "expiry_date": "2028-01-31",
        "expiryDate": "2028-01-31",
        "description": "Classic broad-spectrum insecticide for controlling subterranean termites, soil cutworms, stem borers, and bollworms through potent triple action (contact, stomach, and vapour).",
        "dosage_guide": "Foliar: 2 to 2.5 ml per liter; Soil drenching for termites: 1 liter per acre in irrigation water.",
        "dosageGuide": "Foliar: 2 to 2.5 ml per liter; Soil drenching for termites: 1 liter per acre in irrigation water.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": False,
        "isPopular": False,
        "tags": [
            "Chlorpyrifos 20%",
            "Termite Specialist",
            "Soil Drenching"
        ],
        "mfg_date": "2026-02-15",
        "mfgDate": "2026-02-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Yellow - Moderately Toxic (Insecticide/Herbicide)",
        "gstRate": "18% GST Included"
    },
    {
        "_id": "prod_27",
        "id": "prod_27",
        "name": "Roundup / Excel Mera 71 Systemic Non-Selective Herbicide (Glyphosate 41% SL - 1 Litre)",
        "category": "Pesticides",
        "category_icon": "🌱",
        "categoryIcon": "🌱",
        "subcategory": "Weedicides & Herbicides",
        "brand": "Bayer / Excel Crop Care",
        "price": 480,
        "original_price": 580,
        "originalPrice": 580,
        "unit": "1 Litre Bottle",
        "pack_sizes": [
            {
                "size": "500 ml Bottle",
                "price": 260
            },
            {
                "size": "1 Litre Bottle",
                "price": 480
            },
            {
                "size": "5 Litres Can",
                "price": 2250
            }
        ],
        "packSizes": [
            {
                "size": "500 ml Bottle",
                "price": 260
            },
            {
                "size": "1 Litre Bottle",
                "price": 480
            },
            {
                "size": "5 Litres Can",
                "price": 2250
            }
        ],
        "stock": 105,
        "rating": 4.9,
        "review_count": 91,
        "reviewCount": 91,
        "image_url": "/images/products/glyphosate_roundup.svg",
        "imageUrl": "/images/products/glyphosate_roundup.svg",
        "crop_suitability": "Tea Gardens, Non-Cropped Land, Bunds, Orchard Rows",
        "cropSuitability": "Tea Gardens, Non-Cropped Land, Bunds, Orchard Rows",
        "season": "Active Weed Growth Stage",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "Glyphosate 41% SL (IPA Salt)",
        "maturity_period": "Systemic Translocation to Root Tips in 7 Days",
        "maturityPeriod": "Systemic Translocation to Root Tips in 7 Days",
        "yield_potential": "Complete Eradication of Stubborn Perennial Weeds",
        "yieldPotential": "Complete Eradication of Stubborn Perennial Weeds",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "CIR-7719/2015-GLYPHOSATE-SL",
        "labCertId": "CIR-7719/2015-GLYPHOSATE-SL",
        "batch_number": "GLY-41-1L-26",
        "batchNumber": "GLY-41-1L-26",
        "expiry_date": "2028-04-30",
        "expiryDate": "2028-04-30",
        "description": "Powerful systemic non-selective post-emergence herbicide. Translocates throughout annual and perennial grasses, sedges, and broadleaf weeds destroying roots completely.",
        "dosage_guide": "8-10 ml per liter of water (approx 1.0 - 1.25 L/acre). Use flood-jet nozzle.",
        "dosageGuide": "8-10 ml per liter of water (approx 1.0 - 1.25 L/acre). Use flood-jet nozzle.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "Glyphosate 41%",
            "Total Weed Killer",
            "Roundup Molecule"
        ],
        "mfg_date": "2026-02-15",
        "mfgDate": "2026-02-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Yellow - Moderately Toxic (Insecticide/Herbicide)",
        "gstRate": "18% GST Included"
    },
    {
        "_id": "prod_28",
        "id": "prod_28",
        "name": "BASF Stomp Extra Selective Pre-Emergence Herbicide (Pendimethalin 38.7% CS - 1 Litre)",
        "category": "Pesticides",
        "category_icon": "🌱",
        "categoryIcon": "🌱",
        "subcategory": "Weedicides & Herbicides",
        "brand": "BASF India",
        "price": 720,
        "original_price": 840,
        "originalPrice": 840,
        "unit": "1 Litre Bottle",
        "pack_sizes": [
            {
                "size": "700 ml Bottle",
                "price": 520
            },
            {
                "size": "1 Litre Bottle",
                "price": 720
            },
            {
                "size": "3.5 Litres Can",
                "price": 2350
            }
        ],
        "packSizes": [
            {
                "size": "700 ml Bottle",
                "price": 520
            },
            {
                "size": "1 Litre Bottle",
                "price": 720
            },
            {
                "size": "3.5 Litres Can",
                "price": 2350
            }
        ],
        "stock": 85,
        "rating": 4.9,
        "review_count": 67,
        "reviewCount": 67,
        "image_url": "/images/products/stomp_pendimethalin.svg",
        "imageUrl": "/images/products/stomp_pendimethalin.svg",
        "crop_suitability": "Wheat, Paddy, Soybean, Cotton, Onion, Garlic",
        "cropSuitability": "Wheat, Paddy, Soybean, Cotton, Onion, Garlic",
        "season": "0-3 Days Post Sowing / Transplanting",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "Pendimethalin 38.7% CS (Capsule Suspension)",
        "maturity_period": "Chemical Shield Preventing Weed Emergence for 40 Days",
        "maturityPeriod": "Chemical Shield Preventing Weed Emergence for 40 Days",
        "yield_potential": "Saves 35% crop nutrients by stopping weed competition",
        "yieldPotential": "Saves 35% crop nutrients by stopping weed competition",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "CIR-11201/2017-PENDIMETHALIN-CS",
        "labCertId": "CIR-11201/2017-PENDIMETHALIN-CS",
        "batch_number": "BASF-STOMP-1L-26",
        "batchNumber": "BASF-STOMP-1L-26",
        "expiry_date": "2028-07-31",
        "expiryDate": "2028-07-31",
        "description": "Micro-encapsulated selective pre-emergence herbicide. Forms a uniform chemical barrier on soil surface preventing Phalaris minor (Gulli Danda) and broadleaf weeds from germinating.",
        "dosage_guide": "700 ml per acre mixed in 200 liters of water sprayed within 48 hours of sowing.",
        "dosageGuide": "700 ml per acre mixed in 200 liters of water sprayed within 48 hours of sowing.",
        "is_featured": True,
        "isFeatured": True,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "BASF Stomp Extra",
            "Gulli Danda Specialist",
            "Pre-Emergence"
        ],
        "mfg_date": "2026-02-15",
        "mfgDate": "2026-02-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Yellow - Moderately Toxic (Insecticide/Herbicide)",
        "gstRate": "18% GST Included"
    },
    {
        "_id": "prod_29",
        "id": "prod_29",
        "name": "Syngenta Proclaim Caterpillar & Bollworm Specialist (Emamectin Benzoate 5% SG - 100 gm)",
        "category": "Pesticides",
        "category_icon": "🌱",
        "categoryIcon": "🌱",
        "subcategory": "Insecticides (Borers & Caterpillars)",
        "brand": "Syngenta India",
        "price": 410,
        "original_price": 490,
        "originalPrice": 490,
        "unit": "100 gm Pack",
        "pack_sizes": [
            {
                "size": "50 gm Pack",
                "price": 220
            },
            {
                "size": "100 gm Pack",
                "price": 410
            },
            {
                "size": "250 gm Pack",
                "price": 960
            }
        ],
        "packSizes": [
            {
                "size": "50 gm Pack",
                "price": 220
            },
            {
                "size": "100 gm Pack",
                "price": 410
            },
            {
                "size": "250 gm Pack",
                "price": 960
            }
        ],
        "stock": 115,
        "rating": 4.9,
        "review_count": 83,
        "reviewCount": 83,
        "image_url": "/images/products/syngenta_proclaim.svg",
        "imageUrl": "/images/products/syngenta_proclaim.svg",
        "crop_suitability": "Cotton, Chilli, Tomato, Cabbage, Gram, Tea",
        "cropSuitability": "Cotton, Chilli, Tomato, Cabbage, Gram, Tea",
        "season": "Larval Attack & Pod Borer Stage",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "Emamectin Benzoate 5% SG (Water Soluble Granules)",
        "maturity_period": "Translaminar Stomach Poison Knockdown in 2 Hours",
        "maturityPeriod": "Translaminar Stomach Poison Knockdown in 2 Hours",
        "yield_potential": "Stops Fruit Borer, DBM & Spodoptera damage instantly",
        "yieldPotential": "Stops Fruit Borer, DBM & Spodoptera damage instantly",
        "seller_id": "seller_2",
        "sellerId": "seller_2",
        "seller_name": "National Seed & Bio Corp",
        "sellerName": "National Seed & Bio Corp",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "CIR-9921/2016-EMAMECTIN-SG",
        "labCertId": "CIR-9921/2016-EMAMECTIN-SG",
        "batch_number": "SYN-PROC-100G-26",
        "batchNumber": "SYN-PROC-100G-26",
        "expiry_date": "2028-06-30",
        "expiryDate": "2028-06-30",
        "description": "Modern avermectin class insecticide with quick stomach action. Caterpillars cease feeding immediately after ingestion and are paralyzed within 2 to 4 hours.",
        "dosage_guide": "0.5 gm per liter of water (approx 80-100 gm/acre).",
        "dosageGuide": "0.5 gm per liter of water (approx 80-100 gm/acre).",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "Emamectin 5% SG",
            "Bollworm & DBM Specialist",
            "Syngenta"
        ],
        "mfg_date": "2026-02-15",
        "mfgDate": "2026-02-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Yellow - Moderately Toxic (Insecticide/Herbicide)",
        "gstRate": "18% GST Included"
    },
    {
        "_id": "prod_30",
        "id": "prod_30",
        "name": "Tata Rallis Contaf Plus Broad-Spectrum Fungicide (Hexaconazole 5% SC - 500 ml)",
        "category": "Pesticides",
        "category_icon": "🌱",
        "categoryIcon": "🌱",
        "subcategory": "Fungicides & Bactericides",
        "brand": "Tata Rallis India",
        "price": 390,
        "original_price": 460,
        "originalPrice": 460,
        "unit": "500 ml Bottle",
        "pack_sizes": [
            {
                "size": "250 ml Bottle",
                "price": 210
            },
            {
                "size": "500 ml Bottle",
                "price": 390
            },
            {
                "size": "1 Litre Bottle",
                "price": 740
            }
        ],
        "packSizes": [
            {
                "size": "250 ml Bottle",
                "price": 210
            },
            {
                "size": "500 ml Bottle",
                "price": 390
            },
            {
                "size": "1 Litre Bottle",
                "price": 740
            }
        ],
        "stock": 100,
        "rating": 4.8,
        "review_count": 59,
        "reviewCount": 59,
        "image_url": "/images/products/rallis_contaf_plus.svg",
        "imageUrl": "/images/products/rallis_contaf_plus.svg",
        "crop_suitability": "Paddy, Groundnut, Mango, Apple, Grapes, Chilli",
        "cropSuitability": "Paddy, Groundnut, Mango, Apple, Grapes, Chilli",
        "season": "Sheath Blight & Powdery Mildew Stages",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "Hexaconazole 5% SC",
        "maturity_period": "Systemic Triazole Ergosterol Inhibitor",
        "maturityPeriod": "Systemic Triazole Ergosterol Inhibitor",
        "yield_potential": "Cures Sheath Blight & Tikka Leaf Spot rapidly",
        "yieldPotential": "Cures Sheath Blight & Tikka Leaf Spot rapidly",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "CIR-6610/2015-HEXACONAZOLE-SC",
        "labCertId": "CIR-6610/2015-HEXACONAZOLE-SC",
        "batch_number": "RAL-CONT-500-26",
        "batchNumber": "RAL-CONT-500-26",
        "expiry_date": "2028-03-31",
        "expiryDate": "2028-03-31",
        "description": "High-efficiency systemic triazole fungicide with protective, curative, and eradicative properties. Controls sheath blight in rice, powdery mildew in mango, and tikka disease in groundnut.",
        "dosage_guide": "2.0 ml per liter of water (approx 350-400 ml/acre).",
        "dosageGuide": "2.0 ml per liter of water (approx 350-400 ml/acre).",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "Hexaconazole 5%",
            "Sheath Blight Cure",
            "Tata Rallis"
        ],
        "mfg_date": "2026-02-15",
        "mfgDate": "2026-02-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Blue - Slightly Toxic (Fungicide/Bactericide)",
        "gstRate": "18% GST Included"
    },
    {
        "_id": "prod_31",
        "id": "prod_31",
        "name": "Rallis Blitox 50 WP Copper Oxychloride Broad-Spectrum Fungicide (500 gm)",
        "category": "Pesticides",
        "category_icon": "🌱",
        "categoryIcon": "🌱",
        "subcategory": "Fungicides & Bactericides",
        "brand": "Tata Rallis India",
        "price": 310,
        "original_price": 370,
        "originalPrice": 370,
        "unit": "500 gm Pack",
        "pack_sizes": [
            {
                "size": "500 gm Pack",
                "price": 310
            },
            {
                "size": "1 kg Pack",
                "price": 590
            }
        ],
        "packSizes": [
            {
                "size": "500 gm Pack",
                "price": 310
            },
            {
                "size": "1 kg Pack",
                "price": 590
            }
        ],
        "stock": 90,
        "rating": 4.8,
        "review_count": 45,
        "reviewCount": 45,
        "image_url": "/images/products/blitox_copper.svg",
        "imageUrl": "/images/products/blitox_copper.svg",
        "crop_suitability": "Paddy, Potato, Tomato, Citrus, Grapes, Cardamom",
        "cropSuitability": "Paddy, Potato, Tomato, Citrus, Grapes, Cardamom",
        "season": "Bacterial Blight & Downy Mildew Seasons",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "Copper Oxychloride 50% WP",
        "maturity_period": "Protective Contact Bactericide & Fungicide Barrier",
        "maturityPeriod": "Protective Contact Bactericide & Fungicide Barrier",
        "yield_potential": "Stops Bacterial Canker, Citrus Gummosis & Blight",
        "yieldPotential": "Stops Bacterial Canker, Citrus Gummosis & Blight",
        "seller_id": "seller_1",
        "sellerId": "seller_1",
        "seller_name": "Kisan Vikas Agro Kendra",
        "sellerName": "Kisan Vikas Agro Kendra",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "CIR-4421/2014-COPPER-OXY-WP",
        "labCertId": "CIR-4421/2014-COPPER-OXY-WP",
        "batch_number": "BLI-50WP-500-26",
        "batchNumber": "BLI-50WP-500-26",
        "expiry_date": "2028-02-28",
        "expiryDate": "2028-02-28",
        "description": "Benchmark inorganic copper based fungicide and bactericide. Provides broad protective layer preventing bacterial leaf blight, late blight, and damping-off fungi from penetrating plant tissue.",
        "dosage_guide": "2.5 to 3.0 grams per liter of water for foliar spray or trunk pasting.",
        "dosageGuide": "2.5 to 3.0 grams per liter of water for foliar spray or trunk pasting.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": False,
        "isPopular": False,
        "tags": [
            "Copper Oxychloride 50%",
            "Bacterial Shield",
            "Rallis Blitox"
        ],
        "mfg_date": "2026-02-15",
        "mfgDate": "2026-02-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Blue - Slightly Toxic (Fungicide/Bactericide)",
        "gstRate": "18% GST Included"
    },
    {
        "_id": "prod_16",
        "id": "prod_16",
        "name": "KisanKraft KK-IC-400P 7.0 HP Petrol Power Weeder & Cultivator Tiller",
        "category": "Farming Equipment",
        "category_icon": "🚜",
        "categoryIcon": "🚜",
        "subcategory": "Tillage & Power Weeders",
        "brand": "KisanKraft Machine Tools",
        "price": 32500,
        "original_price": 38000,
        "originalPrice": 38000,
        "unit": "1 Complete Machine (With 32 Tiller Blades)",
        "pack_sizes": [
            {
                "size": "7 HP Petrol Weeder",
                "price": 32500
            },
            {
                "size": "7 HP Weeder + Ridger & Ditching Attachment",
                "price": 36800
            }
        ],
        "packSizes": [
            {
                "size": "7 HP Petrol Weeder",
                "price": 32500
            },
            {
                "size": "7 HP Weeder + Ridger & Ditching Attachment",
                "price": 36800
            }
        ],
        "stock": 15,
        "rating": 4.9,
        "review_count": 64,
        "reviewCount": 64,
        "image_url": "/images/products/kisankraft_power_weeder.svg",
        "imageUrl": "/images/products/kisankraft_power_weeder.svg",
        "crop_suitability": "Sugarcane, Cotton, Vegetables, Orchards, Maize",
        "cropSuitability": "Sugarcane, Cotton, Vegetables, Orchards, Maize",
        "season": "Inter-Cultivation & Weeding Stages",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "Heavy Duty 212cc 4-Stroke Engine (FMTTI Tested)",
        "maturity_period": "1 Year Comprehensive Motor Warranty",
        "maturityPeriod": "1 Year Comprehensive Motor Warranty",
        "yield_potential": "Replaces 10 manual labourers per day",
        "yieldPotential": "Replaces 10 manual labourers per day",
        "seller_id": "seller_4",
        "sellerId": "seller_4",
        "seller_name": "Bharat Farm Tech & Tools",
        "sellerName": "Bharat Farm Tech & Tools",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "FMTTI-TEST-2022-KK400P",
        "labCertId": "FMTTI-TEST-2022-KK400P",
        "batch_number": "KK-400P-2026",
        "batchNumber": "KK-400P-2026",
        "expiry_date": "2035-12-31",
        "expiryDate": "2035-12-31",
        "description": "Heavy-duty 7 HP petrol power weeder designed for deep inter-cultivation, de-weeding, and soil aeration. Features adjustable 3-ft tilling width, forward/reverse gears, and fuel efficient 4-stroke engine.",
        "dosage_guide": "Use 20W40 4T engine oil. Check fuel tank before field operation.",
        "dosageGuide": "Use 20W40 4T engine oil. Check fuel tank before field operation.",
        "is_featured": True,
        "isFeatured": True,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "7 HP Petrol Engine",
            "32 Blades",
            "1 Yr Warranty",
            "KisanKraft"
        ],
        "mfg_date": "2026-01-15",
        "mfgDate": "2026-01-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Green - Farm Machinery (BIS/ISI Certified)",
        "gstRate": "12% GST Included"
    },
    {
        "_id": "prod_17",
        "id": "prod_17",
        "name": "KisanPro 16L Heavy-Duty 12V 12Ah Dual Battery Knapsack Sprayer",
        "category": "Farming Equipment",
        "category_icon": "🚜",
        "categoryIcon": "🚜",
        "subcategory": "Sprayers & Spraying Tech",
        "brand": "KisanPro Agri Tools",
        "price": 2499,
        "original_price": 3299,
        "originalPrice": 3299,
        "unit": "1 Complete Unit (With 4 Brass Nozzle Set)",
        "pack_sizes": [
            {
                "size": "16L Battery Sprayer (12V 12Ah)",
                "price": 2499
            },
            {
                "size": "16L Sprayer + Extra 12V Battery Pack",
                "price": 3199
            }
        ],
        "packSizes": [
            {
                "size": "16L Battery Sprayer (12V 12Ah)",
                "price": 2499
            },
            {
                "size": "16L Sprayer + Extra 12V Battery Pack",
                "price": 3199
            }
        ],
        "stock": 45,
        "rating": 4.8,
        "review_count": 104,
        "reviewCount": 104,
        "image_url": "/images/products/kisanpro_battery_sprayer.svg",
        "imageUrl": "/images/products/kisanpro_battery_sprayer.svg",
        "crop_suitability": "All Crops, Orchards, Tea Gardens, Cotton Fields",
        "cropSuitability": "All Crops, Orchards, Tea Gardens, Cotton Fields",
        "season": "All Seasons Weatherproof",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "ISI Certified Virgin Polypropylene Tank",
        "maturity_period": "1 Year Motor & Battery Replacement Warranty",
        "maturityPeriod": "1 Year Motor & Battery Replacement Warranty",
        "yield_potential": "Sprays up to 30 tanks (480L) on single charge",
        "yieldPotential": "Sprays up to 30 tanks (480L) on single charge",
        "seller_id": "seller_4",
        "sellerId": "seller_4",
        "seller_name": "Bharat Farm Tech & Tools",
        "sellerName": "Bharat Farm Tech & Tools",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "BIS-ISI-CM/L-884920",
        "labCertId": "BIS-ISI-CM/L-884920",
        "batch_number": "KP-16L-BAT-26",
        "batchNumber": "KP-16L-BAT-26",
        "expiry_date": "2031-12-31",
        "expiryDate": "2031-12-31",
        "description": "Ergonomic battery operated knapsack sprayer with upgraded 12V 12Ah long-life battery and backup manual hand pump. Features stainless steel telescopic lance, auto-cutoff pressure switch, and 4 brass nozzles.",
        "dosage_guide": "Recharge battery for 6 hours with supplied auto-cutoff charger.",
        "dosageGuide": "Recharge battery for 6 hours with supplied auto-cutoff charger.",
        "is_featured": True,
        "isFeatured": True,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "12V 12Ah Battery",
            "Telescopic Lance",
            "1 Year Warranty"
        ],
        "mfg_date": "2026-01-15",
        "mfgDate": "2026-01-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Green - Farm Machinery (BIS/ISI Certified)",
        "gstRate": "12% GST Included"
    },
    {
        "_id": "prod_18",
        "id": "prod_18",
        "name": "Balwan Single-Row Manual Push Seed-Cum-Fertilizer Drill Planter",
        "category": "Farming Equipment",
        "category_icon": "🚜",
        "categoryIcon": "🚜",
        "subcategory": "Sowing & Planters",
        "brand": "Balwan Agro Industries",
        "price": 3400,
        "original_price": 4200,
        "originalPrice": 4200,
        "unit": "1 Machine (With 6 Interchangeable Seed Discs)",
        "pack_sizes": [
            {
                "size": "Single Row Manual Seeder",
                "price": 3400
            },
            {
                "size": "Single Row + Dual Fertilizer Hopper",
                "price": 3990
            }
        ],
        "packSizes": [
            {
                "size": "Single Row Manual Seeder",
                "price": 3400
            },
            {
                "size": "Single Row + Dual Fertilizer Hopper",
                "price": 3990
            }
        ],
        "stock": 25,
        "rating": 4.8,
        "review_count": 36,
        "reviewCount": 36,
        "image_url": "/images/products/balwan_seed_drill.svg",
        "imageUrl": "/images/products/balwan_seed_drill.svg",
        "crop_suitability": "Wheat, Maize, Soybean, Mustard, Gram, Peanuts",
        "cropSuitability": "Wheat, Maize, Soybean, Mustard, Gram, Peanuts",
        "season": "Sowing Season",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "Heavy Duty Mild Steel with Anti-Rust Powder Coating",
        "maturity_period": "Durable 5+ Years Operational Life",
        "maturityPeriod": "Durable 5+ Years Operational Life",
        "yield_potential": "Saves 40% seed wastage & provides uniform row spacing",
        "yieldPotential": "Saves 40% seed wastage & provides uniform row spacing",
        "seller_id": "seller_4",
        "sellerId": "seller_4",
        "seller_name": "Bharat Farm Tech & Tools",
        "sellerName": "Bharat Farm Tech & Tools",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "ICAR-CIAE-TEST-771",
        "labCertId": "ICAR-CIAE-TEST-771",
        "batch_number": "BLW-SD-01-2026",
        "batchNumber": "BLW-SD-01-2026",
        "expiry_date": "2036-12-31",
        "expiryDate": "2036-12-31",
        "description": "Lightweight manual push seed drill with interchangeable distribution discs for seeds of different diameters. Features adjustable furrow opener, seed drop depth controller, and rear soil closer wheel.",
        "dosage_guide": "Choose seed disc matching grain size (Mustard disc / Wheat disc / Maize disc).",
        "dosageGuide": "Choose seed disc matching grain size (Mustard disc / Wheat disc / Maize disc).",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "Zero Seed Waste",
            "6 Seed Discs",
            "Balwan Quality"
        ],
        "mfg_date": "2026-01-20",
        "mfgDate": "2026-01-20",
        "shelf_life": "3 to 5 Years Warranty",
        "shelfLife": "3 to 5 Years Warranty",
        "toxicityLevel": "Green - Farm Machinery (BIS/ISI Certified)",
        "gstRate": "12% GST Included"
    },
    {
        "_id": "prod_19",
        "id": "prod_19",
        "name": "AgroTech 4-in-1 Digital Soil pH, Moisture, EC & NPK Analyzer",
        "category": "Farming Equipment",
        "category_icon": "🚜",
        "categoryIcon": "🚜",
        "subcategory": "Testing & Diagnostics",
        "brand": "AgroTech Instruments",
        "price": 899,
        "original_price": 1299,
        "originalPrice": 1299,
        "unit": "1 Digital Device",
        "pack_sizes": [
            {
                "size": "Standard Dual Probe Tester",
                "price": 899
            },
            {
                "size": "Tester + pH Buffer Calibration Kit",
                "price": 1150
            }
        ],
        "packSizes": [
            {
                "size": "Standard Dual Probe Tester",
                "price": 899
            },
            {
                "size": "Tester + pH Buffer Calibration Kit",
                "price": 1150
            }
        ],
        "stock": 60,
        "rating": 4.7,
        "review_count": 42,
        "reviewCount": 42,
        "image_url": "/images/products/agrotech_soil_tester.svg",
        "imageUrl": "/images/products/agrotech_soil_tester.svg",
        "crop_suitability": "Soil Health Diagnostics (All Farm Land)",
        "cropSuitability": "Soil Health Diagnostics (All Farm Land)",
        "season": "Pre-Sowing & Land Preparation",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "High Precision Copper Alloy Dual Probes",
        "maturity_period": "Instant 5-Second Digital Readout",
        "maturityPeriod": "Instant 5-Second Digital Readout",
        "yield_potential": "Saves fertilizer costs by precision application",
        "yieldPotential": "Saves fertilizer costs by precision application",
        "seller_id": "seller_4",
        "sellerId": "seller_4",
        "seller_name": "Bharat Farm Tech & Tools",
        "sellerName": "Bharat Farm Tech & Tools",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "CE-ISO-9001-TESTER",
        "labCertId": "CE-ISO-9001-TESTER",
        "batch_number": "AT-SOIL-4IN1-26",
        "batchNumber": "AT-SOIL-4IN1-26",
        "expiry_date": "2032-12-31",
        "expiryDate": "2032-12-31",
        "description": "Instant handheld soil testing probe. Accurately measures soil pH levels (3.5 - 8.0), moisture percentage, sunlight exposure, and relative fertility index without needing external batteries.",
        "dosage_guide": "Insert probe 4-6 inches into moist soil and read digital meter.",
        "dosageGuide": "Insert probe 4-6 inches into moist soil and read digital meter.",
        "is_featured": True,
        "isFeatured": True,
        "is_popular": False,
        "isPopular": False,
        "tags": [
            "Soil Health Testing",
            "No Battery Needed",
            "Instant Readout"
        ],
        "mfg_date": "2026-01-15",
        "mfgDate": "2026-01-15",
        "shelf_life": "24 Months from MFG",
        "shelfLife": "24 Months from MFG",
        "toxicityLevel": "Green - Farm Machinery (BIS/ISI Certified)",
        "gstRate": "12% GST Included"
    },
    {
        "_id": "prod_20",
        "id": "prod_20",
        "name": "Jain Micro Drip Irrigation Automation Kit (1 Acre Complete Field Setup)",
        "category": "Farming Equipment",
        "category_icon": "🚜",
        "categoryIcon": "🚜",
        "subcategory": "Drip & Irrigation",
        "brand": "Jain Irrigation Systems Ltd",
        "price": 5400,
        "original_price": 6800,
        "originalPrice": 6800,
        "unit": "Complete Kit (500m Lateral Pipe + 250 Drippers + Filter)",
        "pack_sizes": [
            {
                "size": "0.5 Acre Setup (250m + 125 Drippers)",
                "price": 3100
            },
            {
                "size": "1.0 Acre Setup (500m + 250 Drippers)",
                "price": 5400
            }
        ],
        "packSizes": [
            {
                "size": "0.5 Acre Setup (250m + 125 Drippers)",
                "price": 3100
            },
            {
                "size": "1.0 Acre Setup (500m + 250 Drippers)",
                "price": 5400
            }
        ],
        "stock": 25,
        "rating": 4.9,
        "review_count": 58,
        "reviewCount": 58,
        "image_url": "/images/products/jain_drip_irrigation.svg",
        "imageUrl": "/images/products/jain_drip_irrigation.svg",
        "crop_suitability": "Vegetables, Sugarcane, Banana, Cotton, Orchards",
        "cropSuitability": "Vegetables, Sugarcane, Banana, Cotton, Orchards",
        "season": "All Year Round Water Management",
        "germination_rate": "N/A",
        "germinationRate": "N/A",
        "purity": "UV Stabilized Virgin Polyethylene Pipes (ISI Marked)",
        "maturity_period": "3 Year Manufacturer Field Warranty",
        "maturityPeriod": "3 Year Manufacturer Field Warranty",
        "yield_potential": "Saves 60% water, boosts crop yield by 35%",
        "yieldPotential": "Saves 60% water, boosts crop yield by 35%",
        "seller_id": "seller_4",
        "sellerId": "seller_4",
        "seller_name": "Bharat Farm Tech & Tools",
        "sellerName": "Bharat Farm Tech & Tools",
        "verified_seller": True,
        "verifiedSeller": True,
        "qc_status": "Quality Check Passed",
        "qcStatus": "Quality Check Passed",
        "lab_cert_id": "BIS-IS-12786-DRIP",
        "labCertId": "BIS-IS-12786-DRIP",
        "batch_number": "JISL-DRIP-1AC-26",
        "batchNumber": "JISL-DRIP-1AC-26",
        "expiry_date": "2036-12-31",
        "expiryDate": "2036-12-31",
        "description": "Complete DIY precision drip irrigation kit from Jain Irrigation. Includes 16mm UV-resistant lateral pipes, 4L/hr pressure compensating drippers, screen filter, punch tool, joiners, elbows, and end caps.",
        "dosage_guide": "Connect to standard 1 HP agricultural water motor or overhead water tank.",
        "dosageGuide": "Connect to standard 1 HP agricultural water motor or overhead water tank.",
        "is_featured": False,
        "isFeatured": False,
        "is_popular": True,
        "isPopular": True,
        "tags": [
            "Jain Drip",
            "Saves 60% Water",
            "ISI Certified 1 Acre Kit"
        ],
        "mfg_date": "2026-01-20",
        "mfgDate": "2026-01-20",
        "shelf_life": "3 to 5 Years Warranty",
        "shelfLife": "3 to 5 Years Warranty",
        "toxicityLevel": "Green - Farm Machinery (BIS/ISI Certified)",
        "gstRate": "12% GST Included"
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
        "_id": "user_seller",
        "name": "Suresh Patel (Kisan Vikas Kendra)",
        "email": "seller@agriseed.in",
        "phone": "9811122334",
        "password_hash": generate_password_hash("seller123"),
        "role": "seller",
        "seller_id": "seller_1",
        "shop_name": "Kisan Vikas Agro Kendra",
        "license_no": "AGRI/HR/2022/8831",
        "cib_rc_no": "CIBRC/HR/PEST/4491",
        "village": "Agri Complex, GT Road",
        "district": "Karnal",
        "state": "Haryana",
        "pincode": "132001",
        "verified": True,
        "created_at": "2026-01-01T00:00:00"
    },
    {
        "_id": "user_customer",
        "name": "Vikram Choudhary (Retail Buyer)",
        "email": "customer@agriseed.in",
        "phone": "9870001122",
        "password_hash": generate_password_hash("customer123"),
        "role": "customer",
        "farm_size": "Retail Home Garden",
        "primary_crops": ["Vegetables", "Flowers"],
        "village": "Sector 14 Urban Estate",
        "taluk": "Karnal",
        "district": "Karnal",
        "state": "Haryana",
        "pincode": "132001",
        "kisan_rewards": 100,
        "created_at": "2026-02-10T10:00:00"
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
        "product_id": "prod_11",
        "user_name": "Gurbir Cheema (Punjab)",
        "rating": 5,
        "comment": "Corteva Pexalon completely wiped out the brown planthopper within 24 hours. Single spray protected my basmati paddy until harvest without hopper burn.",
        "date": "2026-08-15",
        "verified_purchase": True
    },
    {
        "_id": "rev_3",
        "product_id": "prod_7",
        "user_name": "Ramesh Kumar Singh",
        "rating": 5,
        "comment": "1 bottle of IFFCO Nano Urea replaced an entire 45kg bag of granular urea. Gave deep green tillers to wheat within 4 days of foliar spray!",
        "date": "2026-08-05",
        "verified_purchase": True
    },
    {
        "_id": "rev_4",
        "product_id": "prod_16",
        "user_name": "Shivraj Patil (Maharashtra)",
        "rating": 5,
        "comment": "The KisanKraft 7HP power weeder saves huge labour in sugarcane rows. Easily tills through hard black soil and finishes 2 acres before afternoon.",
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
        "seller_id": "seller_1",
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
                "name": "Pusa Basmati 1121 Golden Grain Paddy Seeds (ICAR Certified)",
                "pack_size": "10 kg Bag",
                "price": 850,
                "quantity": 2,
                "image_url": "/images/products/pusa_basmati_1121.svg"
            },
            {
                "product_id": "prod_8",
                "name": "IFFCO 100% Water Soluble NPK 19:19:19 Fertilizer",
                "pack_size": "5 kg Pouch",
                "price": 890,
                "quantity": 1,
                "image_url": "/images/products/iffco_npk_191919.svg"
            }
        ],
        "subtotal": 2590,
        "discount": 259,
        "coupon_code": "KISAN50",
        "delivery_charge": 0,
        "total_amount": 2331,
        "payment_method": "UPI (Google Pay)",
        "payment_status": "Paid",
        "status": "Shipped",
        "status_history": [
            {"status": "Ordered", "timestamp": "2026-08-20 09:30 AM", "details": "Order placed successfully by farmer."},
            {"status": "Confirmed", "timestamp": "2026-08-20 11:15 AM", "details": "Batch quality certificates verified by Kisan Vikas Kendra."},
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
        "seller_id": "seller_4",
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
                "product_id": "prod_17",
                "name": "KisanPro 16L Heavy-Duty 12V 12Ah Dual Battery Knapsack Sprayer",
                "pack_size": "16L Battery Sprayer (12V 12Ah)",
                "price": 2499,
                "quantity": 1,
                "image_url": "/images/products/kisanpro_battery_sprayer.svg"
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
            {"status": "Confirmed", "timestamp": "2026-08-10 11:30 AM", "details": "Seller inspected machine battery and sealed warranty card."},
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
    """Populates collections with rich sample data and guarantees admin & seller presence."""
    # Ensure all sellers exist
    for s in SAMPLE_SELLERS:
        db.sellers.update_one({"_id": s["_id"]}, {"$set": s}, upsert=True)

    # Ensure all products exist
    for p in SAMPLE_PRODUCTS:
        db.products.update_one({"_id": p["_id"]}, {"$set": p}, upsert=True)

    # Ensure all sample users including ADMIN & SELLER exist
    for u in SAMPLE_USERS:
        db.users.update_one(
            {"$or": [{"_id": u["_id"]}, {"email": u["email"]}]},
            {"$set": u},
            upsert=True
        )

    # Ensure sample reviews exist
    for r in SAMPLE_REVIEWS:
        db.reviews.update_one({"_id": r["_id"]}, {"$set": r}, upsert=True)

    # Ensure sample orders exist
    for o in SAMPLE_ORDERS:
        db.orders.update_one({"_id": o["_id"]}, {"$set": o}, upsert=True)

    print("[SEED] Database seeding complete! Multi-role users (Admin, Seller, Farmer) and authentic products loaded.")

