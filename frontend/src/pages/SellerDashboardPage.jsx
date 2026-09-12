import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  ShieldCheck,
  Package,
  Truck,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  FileText,
  BadgeCheck,
  Building,
  CreditCard,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Clock,
  X,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sellerService } from '../services/api';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SELLERS } from '../data/mockData';

export const SellerDashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders' | 'earnings' | 'compliance'
  const [loading, setLoading] = useState(true);
  const [sellerData, setSellerData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [stats, setStats] = useState({
    grossSales: 148500,
    netPayout: 141075,
    paidPayout: 105800,
    pendingPayout: 35275,
    platformCommission: 7425,
    totalOrders: 18,
    customerCount: 48,
    activeProducts: 12,
    qcPassedCount: 12,
    qcComplianceRate: '100%'
  });

  // Modal State for adding new certified product
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: 'Corteva Agriscience',
    category: 'Pesticides',
    price: 1850,
    originalPrice: 2100,
    unit: '1 Litre',
    stock: 60,
    labCertId: 'CIB-RC/INS-2024/9912',
    batchNumber: 'LOT-2024-CORT-08',
    expiryDate: '2026-11-30',
    activeIngredient: 'Triflumezopyrim 10% SC',
    cropSuitability: 'Paddy / Rice',
    season: 'Kharif',
    germinationRate: 'N/A',
    description: 'Government certified quality insecticide for brown planthopper control in paddy fields.',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
  });

  const [toastMessage, setToastMessage] = useState('');

  // Fetch seller data from backend
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const sellerId = currentUser?.seller_id || currentUser?.sellerId || 'seller_1';
      const res = await sellerService.getDashboard(sellerId);
      if (res.success) {
        setSellerData(res.seller);
        setProducts(res.products || []);
        setOrders(res.orders || []);
        setLabReports(res.labReports || []);
        if (res.stats) setStats(res.stats);
      } else {
        // Fallback to initial mock data
        setSellerData(INITIAL_SELLERS[0]);
        setProducts(INITIAL_PRODUCTS);
        setOrders(INITIAL_ORDERS);
      }
    } catch (e) {
      console.warn('Backend offline, using fallback seller data:', e);
      setSellerData(INITIAL_SELLERS[0]);
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Handle adding new certified product
  const handleAddCertifiedProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.labCertId || !productForm.batchNumber) {
      alert('Please fill in Product Name, Price, Lab Certificate ID, and Batch Number.');
      return;
    }
    setSubmittingProduct(true);
    try {
      const res = await sellerService.addCertifiedProduct(productForm);
      if (res.success && res.product) {
        setProducts([res.product, ...products]);
        showToast(`✓ Certified Product '${productForm.name}' listed with Lab Cert ${productForm.labCertId}!`);
        setIsAddModalOpen(false);
        // Reset form
        setProductForm({
          name: '',
          brand: 'IFFCO',
          category: 'Fertilizers',
          price: 250,
          originalPrice: 280,
          unit: '500 ml Bottle',
          stock: 100,
          labCertId: 'FCO-ICAR/2024/7721',
          batchNumber: 'LOT-2024-IFF-04',
          expiryDate: '2026-12-31',
          activeIngredient: 'Nano Nitrogen (4% w/v)',
          cropSuitability: 'All Crops',
          season: 'All Seasons',
          germinationRate: 'N/A',
          description: 'Eco-friendly nanotechnology fertilizer for high crop yield.',
          imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
        });
      } else {
        alert(res.message || 'Failed to list product.');
      }
    } catch (err) {
      alert('Error communicating with backend.');
    }
    setSubmittingProduct(false);
  };

  // Handle fulfilling an order
  const handleFulfillOrder = async (orderId) => {
    const awb = `AX-AWB-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const res = await sellerService.fulfillOrder(orderId, {
        trackingAwb: awb,
        courierPartner: 'AgriExpress Rural Fleet'
      });
      if (res.success) {
        showToast(`📦 Order #${orderId} marked Dispatched via AgriExpress (AWB: ${awb})!`);
        // Update local order list
        setOrders(orders.map(o => (o.id === orderId || o.orderId === orderId) ? { ...o, status: 'Shipped', trackingNumber: awb } : o));
      }
    } catch (err) {
      showToast(`Order #${orderId} dispatch updated locally.`);
      setOrders(orders.map(o => (o.id === orderId || o.orderId === orderId) ? { ...o, status: 'Shipped', trackingNumber: awb } : o));
    }
  };

  const sellerName = sellerData?.name || currentUser?.shopName || 'Kisan Vikas Agro Kendra';
  const licenseNo = sellerData?.licenseNumber || currentUser?.licenseNumber || 'HR-AGR-2024-QC8821';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Kendra Profile & Regulatory Certifications */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/50 text-2xl font-bold shrink-0">
              🏢
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-black font-serif tracking-tight text-white">
                  {sellerName}
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Govt Verified Kendra</span>
                </span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Seeds Act 1966 Compliant</span>
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-slate-300 mt-2 flex-wrap">
                <span><strong>Seed License:</strong> <code className="text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded">{licenseNo}</code></span>
                <span><strong>GSTIN:</strong> <code className="text-slate-200">{sellerData?.gstin || '06AABCU9603R1ZM'}</code></span>
                <span><strong>Location:</strong> Mandi Road, Sector 12, Karnal, Haryana</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 lg:flex-none bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs px-4 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>List Certified Product</span>
            </button>
            <button
              onClick={loadDashboardData}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Gross Sales */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Gross Sales</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
              ₹{stats.grossSales?.toLocaleString('en-IN') || '1,48,500'}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              ↑ +18.4% this sowing season
            </p>
          </div>
        </div>

        {/* Net Payout */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Net Payout (Disbursed)</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-blue-900 font-sans">
              ₹{stats.paidPayout?.toLocaleString('en-IN') || '1,05,800'}
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              SBI A/C ••••4819
            </p>
          </div>
        </div>

        {/* Pending Escrow */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Pending In Escrow</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-amber-900 font-sans">
              ₹{stats.pendingPayout?.toLocaleString('en-IN') || '35,275'}
            </div>
            <p className="text-[11px] text-amber-700 font-semibold mt-1">
              Auto-releases in 48h
            </p>
          </div>
        </div>

        {/* Farmer Customers */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Farmer Customers</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
              {stats.customerCount || 48} Farmers
            </div>
            <p className="text-[11px] text-purple-700 font-semibold mt-1">
              96% Repeat Orders
            </p>
          </div>
        </div>

        {/* Quality Check Compliance */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between bg-emerald-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-900">QC Pass Compliance</span>
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <BadgeCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-900 font-sans">
              100% Passed
            </div>
            <p className="text-[11px] text-emerald-700 font-extrabold mt-1">
              ✓ Lab Certificates Active
            </p>
          </div>
        </div>

      </div>

      {/* Tabbed Interface */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 px-4 sm:px-6 pt-3 bg-slate-50/70 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-4 text-xs font-extrabold rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 border-b-2 shrink-0 ${
              activeTab === 'inventory'
                ? 'bg-white text-emerald-900 border-emerald-600 shadow-xs'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4 text-emerald-600" />
            <span>Certified Product Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-extrabold rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 border-b-2 shrink-0 ${
              activeTab === 'orders'
                ? 'bg-white text-emerald-900 border-emerald-600 shadow-xs'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Farmer Orders & Dispatches ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`py-3 px-4 text-xs font-extrabold rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 border-b-2 shrink-0 ${
              activeTab === 'earnings'
                ? 'bg-white text-emerald-900 border-emerald-600 shadow-xs'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span>Earnings & Bank Payouts</span>
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`py-3 px-4 text-xs font-extrabold rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 border-b-2 shrink-0 ${
              activeTab === 'compliance'
                ? 'bg-white text-emerald-900 border-emerald-600 shadow-xs'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Quality & Lab Verification Center</span>
          </button>
        </div>

        {/* Tab 1: Certified Product Inventory */}
        {activeTab === 'inventory' && (
          <div className="p-6 space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Certified Agricultural Catalog
                </h3>
                <p className="text-xs text-slate-500">
                  Only authentic products with verified lab certificate numbers & batch IDs are listed.
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-700/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Certified Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Product & Brand</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Selling Price</th>
                    <th className="py-3 px-4">In Stock</th>
                    <th className="py-3 px-4">Lab Cert ID</th>
                    <th className="py-3 px-4">Batch Number</th>
                    <th className="py-3 px-4">QC Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id || p._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{p.name}</div>
                            <div className="text-[11px] text-emerald-700 font-semibold">{p.brand || 'AgriSeed Certified'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          {p.categoryIcon} {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900 font-sans">
                        ₹{p.price} <span className="text-[10px] font-normal text-slate-400">/ {p.unit}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${p.stock > 10 ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                        {p.labCertId || p.lab_cert_id || 'CIB-RC/2024-QC'}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {p.batchNumber || p.batch_number || 'LOT-2024-AGR'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-100 text-emerald-900 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>QC Passed</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 2: Farmer Orders & Dispatches */}
        {activeTab === 'orders' && (
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Farmer Customer Orders
              </h3>
              <p className="text-xs text-slate-500">
                Manage rural delivery dispatches, generate AWBs, and track logistics.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Farmer Customer</th>
                    <th className="py-3 px-4">Delivery Location</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id || o.orderId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        #{o.id || o.orderId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{o.userName || 'Farmer Patron'}</div>
                        <div className="text-[11px] text-slate-400">{o.phone || '9876543210'}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {o.deliveryAddress?.village || 'Rampur Khurd'}, {o.deliveryAddress?.district || 'Karnal'}
                      </td>
                      <td className="py-3 px-4">
                        {o.items?.length || 1} Item(s)
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900 font-sans">
                        ₹{o.totalAmount}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-block ${
                          o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-900' :
                          (o.status === 'Shipped' ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-900')
                        }`}>
                          {o.status || 'Ordered'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {o.status === 'Ordered' ? (
                          <button
                            onClick={() => handleFulfillOrder(o.id || o.orderId)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Dispatch</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">
                            AWB: {o.trackingNumber || 'AX-77821'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Earnings & Bank Payouts */}
        {activeTab === 'earnings' && (
          <div className="p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-400 font-bold block mb-1">Gross Marketplace Sales</span>
                <div className="text-2xl font-black text-slate-900 font-sans">₹1,48,500</div>
                <div className="text-[11px] text-slate-500 mt-2">100% direct payments from registered farmers</div>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
                <span className="text-xs text-amber-800 font-bold block mb-1">Platform Mandi Commission (5%)</span>
                <div className="text-2xl font-black text-amber-900 font-sans">₹7,425</div>
                <div className="text-[11px] text-amber-700 mt-2">Includes logistics fleet coordination & QC audits</div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-800 font-bold block mb-1">Net Realized Kendra Revenue</span>
                <div className="text-2xl font-black text-emerald-950 font-sans">₹1,41,075</div>
                <div className="text-[11px] text-emerald-700 font-bold mt-2">Disbursed to Bank: ₹1,05,800 | Escrow: ₹35,275</div>
              </div>

            </div>

            {/* Bank Information Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building className="w-5 h-5 text-blue-300" />
                  <span className="font-extrabold text-sm">Registered Settlement Bank Account</span>
                </div>
                <p className="text-xs text-blue-200">
                  State Bank of India (SBI), Karnal Main Mandi Branch • A/C No: <code>••••••••4819</code> • IFSC: <code>SBIN0001234</code>
                </p>
              </div>
              <span className="bg-emerald-400 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-xl">
                ✓ Active Settlement
              </span>
            </div>

            {/* Payout History */}
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-3">Settlement & Payout History</h4>
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Payout Date</th>
                      <th className="py-3 px-4">Settlement Reference (UTR)</th>
                      <th className="py-3 px-4">Gross Revenue</th>
                      <th className="py-3 px-4">Net Payout</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="py-3 px-4">2026-02-28</td>
                      <td className="py-3 px-4 font-mono">UTR-SBI-202602288819</td>
                      <td className="py-3 px-4">₹55,000</td>
                      <td className="py-3 px-4 font-bold text-emerald-800">₹52,250</td>
                      <td className="py-3 px-4"><span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">✓ Paid</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">2026-02-15</td>
                      <td className="py-3 px-4 font-mono">UTR-SBI-202602157741</td>
                      <td className="py-3 px-4">₹56,400</td>
                      <td className="py-3 px-4 font-bold text-emerald-800">₹53,580</td>
                      <td className="py-3 px-4"><span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">✓ Paid</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">2026-03-10 (Upcoming)</td>
                      <td className="py-3 px-4 font-mono">ESCROW-BATCH-09</td>
                      <td className="py-3 px-4">₹37,100</td>
                      <td className="py-3 px-4 font-bold text-amber-800">₹35,245</td>
                      <td className="py-3 px-4"><span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">⏳ Escrow Pending</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Quality & Lab Verification Center */}
        {activeTab === 'compliance' && (
          <div className="p-6 space-y-6">
            
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Agricultural Quality Assurance & Regulatory Framework</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                As per the <strong>Seeds Act 1966</strong> and <strong>Central Insecticides Board & Registration Committee (CIB&RC)</strong> regulations, every seed batch, chemical pesticide, and fertilizer listed on AgriSeed is verified against certified government testing laboratories.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-3">Active Batch Lab Reports & Certificates</h4>
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Brand</th>
                      <th className="py-3 px-4">Govt Lab Certificate ID</th>
                      <th className="py-3 px-4">Batch / Lot</th>
                      <th className="py-3 px-4">Testing Authority</th>
                      <th className="py-3 px-4">Quality Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {labReports.length > 0 ? labReports.map((r, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-4 font-bold text-slate-900">{r.product_name}</td>
                        <td className="py-3 px-4 text-emerald-800">{r.brand}</td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">{r.lab_cert_id}</td>
                        <td className="py-3 px-4 font-mono">{r.batch_number}</td>
                        <td className="py-3 px-4 text-slate-500">{r.testing_agency}</td>
                        <td className="py-3 px-4">
                          <span className="bg-emerald-100 text-emerald-900 font-extrabold px-2.5 py-1 rounded-full text-[10px]">
                            ✓ 100% Passed
                          </span>
                        </td>
                      </tr>
                    )) : (
                      products.slice(0, 8).map((p, idx) => (
                        <tr key={idx}>
                          <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                          <td className="py-3 px-4 text-emerald-800">{p.brand}</td>
                          <td className="py-3 px-4 font-mono font-bold text-blue-700">{p.labCertId || 'CIB-RC/2024/7821'}</td>
                          <td className="py-3 px-4 font-mono">{p.batchNumber || 'LOT-2024-AGR'}</td>
                          <td className="py-3 px-4 text-slate-500">ICAR & CIB-RC Quality Testing Station</td>
                          <td className="py-3 px-4">
                            <span className="bg-emerald-100 text-emerald-900 font-extrabold px-2.5 py-1 rounded-full text-[10px]">
                              ✓ 100% Passed
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Modal: Add Certified Product with Strict Quality Check Requirement */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-emerald-200 animate-scaleUp my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-5 relative shrink-0">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 text-emerald-300 hover:text-white p-1 rounded-full hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <h3 className="text-lg font-black font-serif">List Quality-Check Passed Product</h3>
              </div>
              <p className="text-xs text-emerald-200">
                Government Seeds Act & CIB&RC certification parameters are mandatory.
              </p>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleAddCertifiedProduct} className="p-5 overflow-y-auto space-y-3.5 text-xs flex-1">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title / Commercial Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Corteva Pexalon Insecticide"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Manufacturer / Brand Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Corteva, Bayer, IFFCO, FMC"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                  >
                    <option value="Seeds">🌾 Seeds</option>
                    <option value="Fertilizers">🧪 Fertilizers</option>
                    <option value="Pesticides">🌱 Pesticides</option>
                    <option value="Farming Equipment">🚜 Farming Equipment</option>
                  </select>
                </div>
              </div>

              {/* Quality Check Credentials Group */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-[11px] uppercase tracking-wider">
                  <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  <span>Quality Check & Lab Testing Certificates</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Lab Certificate ID / CIB-RC *</label>
                    <input
                      type="text"
                      placeholder="e.g. CIB-RC/INS-2024/7821"
                      value={productForm.labCertId}
                      onChange={(e) => setProductForm({ ...productForm, labCertId: e.target.value })}
                      required
                      className="w-full bg-white border border-emerald-300 rounded-xl p-2 outline-none font-mono text-emerald-950 font-bold focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Lot / Batch Number *</label>
                    <input
                      type="text"
                      placeholder="e.g. LOT-2024-CORT-08"
                      value={productForm.batchNumber}
                      onChange={(e) => setProductForm({ ...productForm, batchNumber: e.target.value })}
                      required
                      className="w-full bg-white border border-emerald-300 rounded-xl p-2 outline-none font-mono text-emerald-950 font-bold focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Active Chemical / Formulation</label>
                    <input
                      type="text"
                      placeholder="e.g. Triflumezopyrim 10% SC"
                      value={productForm.activeIngredient}
                      onChange={(e) => setProductForm({ ...productForm, activeIngredient: e.target.value })}
                      className="w-full bg-white border border-emerald-300 rounded-xl p-2 outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Expiry Date *</label>
                    <input
                      type="date"
                      value={productForm.expiryDate}
                      onChange={(e) => setProductForm({ ...productForm, expiryDate: e.target.value })}
                      required
                      className="w-full bg-white border border-emerald-300 rounded-xl p-2 outline-none text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit Pack</label>
                  <input
                    type="text"
                    placeholder="1 Litre / 10 Kg"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Packaging Image URL *</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={submittingProduct}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
              >
                {submittingProduct ? 'Verifying QC Certificate...' : '✓ Verify Lab Certificate & Publish Product'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
export default SellerDashboardPage;
