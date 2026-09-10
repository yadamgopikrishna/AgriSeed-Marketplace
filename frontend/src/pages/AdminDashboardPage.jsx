import React, { useState } from 'react';
import {
  ShieldCheck,
  Package,
  Users,
  DollarSign,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Truck,
  RotateCcw
} from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SELLERS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const AdminDashboardPage = () => {
  const { t, getLocalizedProductName, getLocalizedCategory } = useLanguage();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(() => {
    const local = JSON.parse(localStorage.getItem('agriseed_orders') || '[]');
    return [...local, ...INITIAL_ORDERS];
  });

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'farmers' | 'sellers'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Seeds',
    price: 500,
    stock: 50,
    cropSuitability: 'Paddy / Rice',
    season: 'Kharif Season',
    germinationRate: '92%',
    dosageGuide: '5 kg per acre'
  });

  const handleStatusChange = (orderId, newStatus) => {
    const updated = orders.map(o => {
      if ((o.id || o.orderId) === orderId) {
        return {
          ...o,
          status: newStatus,
          statusHistory: [
            ...(o.statusHistory || []),
            {
              status: newStatus,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              details: `Status advanced to ${newStatus} by Depot Admin.`
            }
          ]
        };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('agriseed_orders', JSON.stringify(updated));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const created = {
      id: `prod_${Date.now()}`,
      name: newProd.name,
      category: newProd.category,
      categoryIcon: newProd.category === 'Seeds' ? '🌾' : newProd.category === 'Fertilizers' ? '🧪' : '🌱',
      price: Number(newProd.price),
      originalPrice: Number(newProd.price) + 100,
      unit: '1 Bag',
      packSizes: [{ size: 'Standard Pack', price: Number(newProd.price) }],
      stock: Number(newProd.stock),
      rating: 5.0,
      reviewCount: 1,
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      cropSuitability: newProd.cropSuitability,
      season: newProd.season,
      germinationRate: newProd.germinationRate,
      purity: '99%',
      maturityPeriod: '120 Days',
      yieldPotential: '20 Quintals/Acre',
      sellerId: 'seller_1',
      sellerName: 'Kisan Vikas Agro Kendra',
      verifiedSeller: true,
      description: 'Newly added certified seed lot.',
      dosageGuide: newProd.dosageGuide
    };
    setProducts([created, ...products]);
    setIsAddModalOpen(false);
    setNewProd({
      name: '',
      category: 'Seeds',
      price: 500,
      stock: 50,
      cropSuitability: 'Paddy / Rice',
      season: 'Kharif Season',
      germinationRate: '92%',
      dosageGuide: '5 kg per acre'
    });
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Delete this product from agricultural catalog?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const lowStock = products.filter(p => p.stock <= 45);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-serif">
                {t('adminConsoleTitle')}
              </h1>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                {t('adminConsoleSubtitle')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t('adminConsoleDesc')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-700/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addNewProductBtn')}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">{t('kpiCatalogItems')}</span>
            <h3 className="text-2xl font-black text-slate-900">{products.length} {t('productsUnit')}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">{t('kpiTotalOrders')}</span>
            <h3 className="text-2xl font-black text-slate-900">{orders.length} {t('dispatchesUnit')}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">{t('kpiRevenue')}</span>
            <h3 className="text-2xl font-black text-emerald-950">₹{totalRevenue}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">{t('kpiLowStock')}</span>
            <h3 className="text-2xl font-black text-rose-700">{lowStock.length} {t('itemsUnder45')}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'border-emerald-600 text-emerald-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📦 {t('tabLiveOrders')} ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'products' ? 'border-emerald-600 text-emerald-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🌾 {t('tabProductCatalog')} ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('sellers')}
            className={`py-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'sellers' ? 'border-emerald-600 text-emerald-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🏢 {t('tabVerifiedVendors')} ({INITIAL_SELLERS.length})
          </button>
        </div>

        {/* Tab 1: Orders Coordinator */}
        {activeTab === 'orders' && (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">{t('thOrderId')}</th>
                  <th className="p-3">{t('thFarmerName')}</th>
                  <th className="p-3">{t('thTotal')}</th>
                  <th className="p-3">{t('thPayment')}</th>
                  <th className="p-3">{t('thCurrentStatus')}</th>
                  <th className="p-3 text-right">{t('thAdvanceStatus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {orders.map((o) => {
                  const id = o.id || o.orderId;
                  return (
                    <tr key={id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-emerald-900">#{id}</td>
                      <td className="p-3 font-bold">{o.userName || o.deliveryAddress?.fullName}</td>
                      <td className="p-3 font-black text-slate-900">₹{o.totalAmount}</td>
                      <td className="p-3 text-slate-500">{o.paymentMethod}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(id, e.target.value)}
                          className="text-xs bg-slate-100 border border-slate-300 rounded-lg py-1 px-2 font-bold outline-none cursor-pointer text-slate-800"
                        >
                          <option value="Ordered">{t('stepOrdered')}</option>
                          <option value="Confirmed">{t('stepConfirmed')}</option>
                          <option value="Shipped">{t('stepShipped')}</option>
                          <option value="Out for Delivery">{t('stepOutForDelivery')}</option>
                          <option value="Delivered">{t('stepDelivered')}</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Products Catalog CRUD */}
        {activeTab === 'products' && (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">{t('thProductName')}</th>
                  <th className="p-3">{t('thCategory')}</th>
                  <th className="p-3">{t('thPrice')}</th>
                  <th className="p-3">{t('thStock')}</th>
                  <th className="p-3">{t('thGermination')}</th>
                  <th className="p-3 text-right">{t('thActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{getLocalizedProductName(p)}</td>
                    <td className="p-3">{getLocalizedCategory(p.category)}</td>
                    <td className="p-3 font-black text-emerald-900">₹{p.price}</td>
                    <td className="p-3">
                      <span className={`font-bold ${p.stock <= 45 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {p.stock} {t('unitsLabel')}
                      </span>
                    </td>
                    <td className="p-3 text-emerald-700 font-extrabold">{p.germinationRate}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Verified Sellers */}
        {activeTab === 'sellers' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_SELLERS.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    {t('verifiedBadge')}
                  </span>
                </div>
                <p className="text-slate-600">{t('licenseLabel')} <code className="font-mono text-emerald-800 font-bold">{s.licenseNo}</code></p>
                <p className="text-slate-600">{t('locationLabel')} {s.location} • {t('ownerLabel')} {s.owner}</p>
                <p className="text-slate-600">{t('contactLabel')} {s.phone}</p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4">{t('addProductModalTitle')}</h3>
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('productNameInput')}</label>
                <input
                  type="text"
                  placeholder="e.g. Hybrid Mustard Seeds"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('departmentInput')}</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold"
                  >
                    <option value="Seeds">{t('seedsTitle')}</option>
                    <option value="Fertilizers">{t('fertilizersTitle')}</option>
                    <option value="Pesticides">{t('pesticidesTitle')}</option>
                    <option value="Farming Equipment">{t('equipmentTitle')}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('priceInput')}</label>
                  <input
                    type="number"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('stockQtyInput')}</label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('germinationRateInput')}</label>
                  <input
                    type="text"
                    value={newProd.germinationRate}
                    onChange={(e) => setNewProd({ ...newProd, germinationRate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('dosageGuideInput')}</label>
                <input
                  type="text"
                  value={newProd.dosageGuide}
                  onChange={(e) => setNewProd({ ...newProd, dosageGuide: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {t('saveProductBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
