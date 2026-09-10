// AgriSeed Comprehensive Agricultural Mock Data & State

export const INITIAL_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Pusa Basmati 1121 Paddy Seeds (Certified Lot)',
    category: 'Seeds',
    categoryIcon: '🌾',
    price: 850,
    originalPrice: 950,
    unit: '10 kg Bag',
    packSizes: [
      { size: '5 kg Bag', price: 450 },
      { size: '10 kg Bag', price: 850 },
      { size: '25 kg Bag', price: 2050 }
    ],
    stock: 120,
    rating: 4.8,
    reviewCount: 42,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    cropSuitability: 'Paddy / Rice',
    season: 'Kharif Season',
    germinationRate: '92%',
    purity: '98%',
    maturityPeriod: '135-140 Days',
    yieldPotential: '20-22 Quintals/Acre',
    sellerId: 'seller_1',
    sellerName: 'Kisan Vikas Agro Kendra',
    verifiedSeller: true,
    sellerLicense: 'DL-AGR-2023-8821',
    description: 'Extra-long slender grain basmati rice seed with exceptional aroma and high cooking elongation. Certified disease resistant by ICAR-IARI.',
    dosageGuide: '6-8 kg seeds per acre for transplanted paddy.',
    isFeatured: true,
    isPopular: true,
    tags: ['High Aroma', 'ICAR Certified', 'Export Quality']
  },
  {
    id: 'prod_2',
    name: 'Shriram Super Wheat 1105 (High Yield)',
    category: 'Seeds',
    categoryIcon: '🌾',
    price: 1100,
    originalPrice: 1250,
    unit: '40 kg Bag',
    packSizes: [
      { size: '20 kg Bag', price: 580 },
      { size: '40 kg Bag', price: 1100 }
    ],
    stock: 85,
    rating: 4.9,
    reviewCount: 56,
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    cropSuitability: 'Wheat',
    season: 'Rabi Season',
    germinationRate: '95%',
    purity: '99%',
    maturityPeriod: '125-130 Days',
    yieldPotential: '25-28 Quintals/Acre',
    sellerId: 'seller_2',
    sellerName: 'National Seeds Corporation (NSC)',
    verifiedSeller: true,
    sellerLicense: 'GOV-NSC-IN-4401',
    description: 'Top-performing semi-dwarf wheat variety with thick stems, high tillering, and immunity against yellow and brown rust.',
    dosageGuide: '40 kg per acre using seed drill.',
    isFeatured: true,
    isPopular: true,
    tags: ['Rust Resistant', 'Bumper Yield', 'Government Tested']
  },
  {
    id: 'prod_3',
    name: 'Bt Cotton Hybrid RCH 659 BG II',
    category: 'Seeds',
    categoryIcon: '🌾',
    price: 864,
    originalPrice: 920,
    unit: '450g Pack',
    packSizes: [
      { size: '450g Pack (1 Acre)', price: 864 },
      { size: '5 Packs Bundle (5 Acres)', price: 4200 }
    ],
    stock: 60,
    rating: 4.7,
    reviewCount: 29,
    imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80',
    cropSuitability: 'Cotton',
    season: 'Kharif Season',
    germinationRate: '90%',
    purity: '98%',
    maturityPeriod: '150-160 Days',
    yieldPotential: '14-16 Quintals/Acre',
    sellerId: 'seller_1',
    sellerName: 'Kisan Vikas Agro Kendra',
    verifiedSeller: true,
    sellerLicense: 'DL-AGR-2023-8821',
    description: 'Bollgard II technology cotton seeds providing built-in protection against American bollworm and pink bollworm with large bolls.',
    dosageGuide: '1 packet (450g) + 120g refuge seed per acre.',
    isFeatured: true,
    isPopular: false,
    tags: ['Bollgard II', 'Drought Tolerant']
  },
  {
    id: 'prod_4',
    name: 'Abhinav Hybrid Tomato Seeds (F1)',
    category: 'Seeds',
    categoryIcon: '🌾',
    price: 420,
    originalPrice: 480,
    unit: '10g (3000 Seeds)',
    packSizes: [
      { size: '10g Pack', price: 420 },
      { size: '50g Pack', price: 1950 }
    ],
    stock: 150,
    rating: 4.8,
    reviewCount: 38,
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
    cropSuitability: 'Vegetables',
    season: 'All Seasons',
    germinationRate: '92%',
    purity: '99%',
    maturityPeriod: '65-70 Days (Post Transplant)',
    yieldPotential: '30-35 Tons/Acre',
    sellerId: 'seller_3',
    sellerName: 'GreenField Agri Genetics',
    verifiedSeller: true,
    sellerLicense: 'MH-PUN-SEED-902',
    description: 'Firm, glossy deep-red fruits with excellent shelf life and resistance to Tomato Leaf Curl Virus (ToLCV).',
    dosageGuide: '40-50 grams seeds for nursery per acre.',
    isFeatured: false,
    isPopular: true,
    tags: ['F1 Hybrid', 'Virus Tolerant']
  },
  {
    id: 'prod_5',
    name: 'NPK 19:19:19 100% Water Soluble Fertilizer',
    category: 'Fertilizers',
    categoryIcon: '🧪',
    price: 180,
    originalPrice: 220,
    unit: '1 kg Pouch',
    packSizes: [
      { size: '1 kg Pouch', price: 180 },
      { size: '5 kg Pack', price: 820 },
      { size: '25 kg Bag', price: 3800 }
    ],
    stock: 200,
    rating: 4.9,
    reviewCount: 64,
    imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
    cropSuitability: 'All Crops (Paddy, Wheat, Vegetables, Fruits)',
    season: 'Vegetative Growth Stage',
    germinationRate: 'N/A (Nutrient Formulation)',
    purity: '100% Soluble',
    maturityPeriod: 'Instant Soil/Foliar Uptake',
    yieldPotential: '+18% Plant Vigour',
    sellerId: 'seller_4',
    sellerName: 'IFFCO Cooperative Center',
    verifiedSeller: true,
    sellerLicense: 'COOP-IFFCO-7890',
    description: 'Balanced primary nutrient formula with equal ratio of Nitrogen, Phosphorus, and Potassium for rapid vegetative growth.',
    dosageGuide: 'Foliar spray: 5g per litre of water; Drip: 2-3 kg/acre.',
    isFeatured: true,
    isPopular: true,
    tags: ['100% Soluble', 'IFFCO Grade', 'Fast Absorption']
  },
  {
    id: 'prod_6',
    name: 'Organic Neem Cake Soil Conditioner & Protectant',
    category: 'Fertilizers',
    categoryIcon: '🧪',
    price: 650,
    originalPrice: 750,
    unit: '25 kg Bag',
    packSizes: [
      { size: '10 kg Bag', price: 290 },
      { size: '25 kg Bag', price: 650 },
      { size: '50 kg Bag', price: 1200 }
    ],
    stock: 45,
    rating: 4.7,
    reviewCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    cropSuitability: 'Organic Farming / Horticultural Crops',
    season: 'Pre-Sowing / Basal Application',
    germinationRate: 'N/A',
    purity: '100% Pure Cold-Pressed',
    maturityPeriod: 'Slow-Release (90 Days)',
    yieldPotential: 'Nematode Free Soil',
    sellerId: 'seller_1',
    sellerName: 'Kisan Vikas Agro Kendra',
    verifiedSeller: true,
    sellerLicense: 'DL-AGR-2023-8821',
    description: 'Rich in natural azadirachtin, nitrogen, phosphorus, and trace minerals. Eliminates subterranean nematodes and white grubs.',
    dosageGuide: '100-150 kg per acre mixed during land preparation.',
    isFeatured: false,
    isPopular: true,
    tags: ['100% Organic', 'Anti-Nematode']
  },
  {
    id: 'prod_7',
    name: 'Bio-Neem Shield Organic Pest Controller (10,000 PPM)',
    category: 'Pesticides',
    categoryIcon: '🌱',
    price: 490,
    originalPrice: 560,
    unit: '1 Litre Bottle',
    packSizes: [
      { size: '500ml Bottle', price: 280 },
      { size: '1 Litre Bottle', price: 490 },
      { size: '5 Litres Can', price: 2250 }
    ],
    stock: 90,
    rating: 4.8,
    reviewCount: 31,
    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
    cropSuitability: 'Paddy, Cotton, Vegetables, Pulses',
    season: 'All Seasons (At Pest Infestation)',
    germinationRate: 'N/A',
    purity: '10,000 PPM Azadirachtin',
    maturityPeriod: 'Target Contact & Systemic Action',
    yieldPotential: 'Protects against 200+ Insect Species',
    sellerId: 'seller_3',
    sellerName: 'GreenField Agri Genetics',
    verifiedSeller: true,
    sellerLicense: 'MH-PUN-SEED-902',
    description: 'Certified organic botanical insecticide effective against sucking pests (aphids, jassids, thrips, whiteflies, and bollworms).',
    dosageGuide: '2.5ml - 3ml per litre of clean water.',
    isFeatured: true,
    isPopular: false,
    tags: ['Zero Chemical Residue', 'Pollinator Safe']
  },
  {
    id: 'prod_8',
    name: 'KisanPro 16L Battery-Operated Knapsack Sprayer',
    category: 'Farming Equipment',
    categoryIcon: '🚜',
    price: 2450,
    originalPrice: 2999,
    unit: '1 Complete Unit',
    packSizes: [
      { size: 'Standard 16L (12V 8Ah)', price: 2450 },
      { size: 'Pro 18L (12V 12Ah Heavy Battery)', price: 2950 }
    ],
    stock: 35,
    rating: 4.9,
    reviewCount: 47,
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
    cropSuitability: 'All Crops & Orchards',
    season: 'All Weather Heavy Duty',
    germinationRate: 'N/A',
    purity: 'IS-Certified Tank',
    maturityPeriod: '1 Year Warranty',
    yieldPotential: 'Sprays 25-30 Tanks per Charge',
    sellerId: 'seller_4',
    sellerName: 'IFFCO Cooperative Center',
    verifiedSeller: true,
    sellerLicense: 'COOP-IFFCO-7890',
    description: 'Ergonomic high-density polyethylene sprayer with auto cutoff pressure regulator, stainless steel telescopic lance, and 4 multi-spray brass nozzles.',
    dosageGuide: 'Ideal for uniform liquid pesticide & fertilizer application.',
    isFeatured: true,
    isPopular: true,
    tags: ['12V Battery', 'Telescopic Lance', '1 Yr Warranty']
  }
];

export const INITIAL_SELLERS = [
  {
    id: 'seller_1',
    name: 'Kisan Vikas Agro Kendra',
    owner: 'Gurpreet Singh Dhillon',
    location: 'Karnal, Haryana',
    rating: 4.8,
    reviewCount: 340,
    verified: true,
    licenseNo: 'DL-AGR-2023-8821',
    phone: '+91 98765 43210',
    email: 'kisanvikas@agriseed.in'
  },
  {
    id: 'seller_2',
    name: 'National Seeds Corporation (NSC)',
    owner: 'Govt. of India Enterprise',
    location: 'Beej Bhawan, New Delhi',
    rating: 4.9,
    reviewCount: 1250,
    verified: true,
    licenseNo: 'GOV-NSC-IN-4401',
    phone: '+91 11 2584 1421',
    email: 'contact@indiaseeds.gov.in'
  },
  {
    id: 'seller_3',
    name: 'GreenField Agri Genetics',
    owner: 'Dr. Madhav Patil',
    location: 'Pune, Maharashtra',
    rating: 4.7,
    reviewCount: 180,
    verified: true,
    licenseNo: 'MH-PUN-SEED-902',
    phone: '+91 94230 11223',
    email: 'greenfield@agri.in'
  },
  {
    id: 'seller_4',
    name: 'IFFCO Cooperative Depot',
    owner: 'IFFCO Rural Logistics Division',
    location: 'Ludhiana, Punjab',
    rating: 4.9,
    reviewCount: 890,
    verified: true,
    licenseNo: 'COOP-IFFCO-7890',
    phone: '+91 161 244 9900',
    email: 'depot.ludhiana@iffco.in'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'AGRI-849201',
    userName: 'Ramesh Kumar Singh',
    userEmail: 'farmer@agriseed.in',
    phone: '+91 98765 43210',
    items: [
      {
        id: 'prod_1',
        name: 'Pusa Basmati 1121 Paddy Seeds',
        packSize: '10 kg Bag',
        price: 850,
        quantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'prod_5',
        name: 'NPK 19:19:19 Soluble Fertilizer',
        packSize: '5 kg Pack',
        price: 820,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 2520,
    discount: 252,
    couponCode: 'KISAN50',
    deliveryCharge: 0,
    totalAmount: 2268,
    paymentMethod: 'UPI (QR Code Verification)',
    paymentStatus: 'Paid',
    status: 'Shipped',
    statusHistory: [
      { status: 'Ordered', timestamp: '2026-09-08 09:30 AM', details: 'Order placed & payment verified successfully.' },
      { status: 'Confirmed', timestamp: '2026-09-08 11:15 AM', details: 'Seller verified seed batch certificates & packed.' },
      { status: 'Shipped', timestamp: '2026-09-09 02:45 PM', details: 'Dispatched from Karnal Regional Agri-Depot.' }
    ],
    courierPartner: 'AgriExpress Rural Fleet',
    trackingNumber: 'AX-HR-884920',
    driverName: 'Sukhwinder Singh',
    driverPhone: '+91 98123 77654',
    vehicleNumber: 'HR-05-AB-7721',
    estimatedDelivery: '2026-09-12',
    deliveryAddress: {
      fullName: 'Ramesh Kumar Singh',
      phone: '9876543210',
      village: 'Rampur Khurd',
      taluk: 'Gharaunda',
      district: 'Karnal',
      state: 'Haryana',
      pincode: '132114'
    }
  },
  {
    id: 'AGRI-773190',
    userName: 'Ramesh Kumar Singh',
    userEmail: 'farmer@agriseed.in',
    phone: '+91 98765 43210',
    items: [
      {
        id: 'prod_8',
        name: 'KisanPro 16L Battery-Operated Knapsack Sprayer',
        packSize: 'Standard 16L (12V 8Ah)',
        price: 2450,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 2450,
    discount: 100,
    couponCode: 'AGRISEED100',
    deliveryCharge: 0,
    totalAmount: 2350,
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'Pending Farm Delivery',
    status: 'Delivered',
    statusHistory: [
      { status: 'Ordered', timestamp: '2026-09-01 10:00 AM', details: 'Order placed via Cash on Delivery.' },
      { status: 'Confirmed', timestamp: '2026-09-01 01:20 PM', details: 'Equipment inspected and packed.' },
      { status: 'Shipped', timestamp: '2026-09-02 09:00 AM', details: 'Handed over to delivery van.' },
      { status: 'Out for Delivery', timestamp: '2026-09-03 08:30 AM', details: 'Driver out for village delivery.' },
      { status: 'Delivered', timestamp: '2026-09-03 01:15 PM', details: 'Delivered at farm gate. Cash received.' }
    ],
    courierPartner: 'AgriExpress Rural Fleet',
    trackingNumber: 'AX-HR-665120',
    driverName: 'Manjit Verma',
    driverPhone: '+91 98777 22331',
    vehicleNumber: 'HR-05-CD-9901',
    estimatedDelivery: '2026-09-03',
    deliveryAddress: {
      fullName: 'Ramesh Kumar Singh',
      phone: '9876543210',
      village: 'Rampur Khurd',
      taluk: 'Gharaunda',
      district: 'Karnal',
      state: 'Haryana',
      pincode: '132114'
    }
  }
];

export const DEMO_USERS = {
  farmer: {
    id: 'user_farmer_1',
    name: 'Ramesh Kumar Singh',
    email: 'farmer@agriseed.in',
    phone: '+91 98765 43210',
    role: 'farmer',
    farmSize: '5.5 Acres',
    primaryCrops: ['Paddy / Rice', 'Wheat', 'Mustard'],
    village: 'Rampur Khurd',
    district: 'Karnal',
    state: 'Haryana',
    kisanRewards: 240
  },
  admin: {
    id: 'user_admin_1',
    name: 'Dr. Rajesh Sharma (Krishi Officer)',
    email: 'admin@agriseed.in',
    phone: '+91 11 2345 6789',
    role: 'admin',
    farmSize: 'N/A',
    village: 'ICAR Head Office',
    district: 'New Delhi',
    state: 'Delhi',
    kisanRewards: 0
  }
};

export const CROP_DISEASES_DB = [
  {
    id: 'dis_1',
    crop: 'Paddy / Rice',
    name: 'Rice Blast (Magnaporthe oryzae)',
    symptoms: 'Spindle-shaped elliptical lesions with gray centers and brown borders on leaves and neck.',
    severity: 'High (Immediate Action Required)',
    recommendedTreatment: {
      productName: 'Saaf Dual-Action Fungicide',
      dosage: '2g per litre of water',
      preventativeTip: 'Avoid excessive nitrogenous fertilizer application. Ensure proper field drainage.'
    }
  },
  {
    id: 'dis_2',
    crop: 'Cotton',
    name: 'Pink Bollworm (Pectinophora gossypiella)',
    symptoms: 'Rosetted flowers, premature boll opening, and internal lint damage with bore holes.',
    severity: 'Critical',
    recommendedTreatment: {
      productName: 'Bio-Neem Shield Organic Pest Controller (10,000 PPM)',
      dosage: '3ml per litre of water + install Pheromone traps',
      preventativeTip: 'Plant Bt Cotton hybrids (Bollgard II) with non-Bt refuge borders.'
    }
  },
  {
    id: 'dis_3',
    crop: 'Wheat',
    name: 'Yellow Stripe Rust (Puccinia striiformis)',
    symptoms: 'Bright yellow powdery pustules arranged in linear stripes on upper leaf surfaces.',
    severity: 'Medium-High',
    recommendedTreatment: {
      productName: 'Bio-Neem & Micronutrient Foliar Tonic',
      dosage: '2.5ml per litre at first sighting',
      preventativeTip: 'Sow certified rust-resistant varieties like Shriram Super Wheat 1105.'
    }
  }
];
