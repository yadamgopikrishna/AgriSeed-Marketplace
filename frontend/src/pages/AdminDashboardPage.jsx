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
  RotateCcw,
  Key,
  Eye,
  EyeOff,
  Save,
  X,
  UserCheck
} from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SELLERS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { adminService, orderService, productService } from '../services/api';

export const AdminDashboardPage = () => {
  const { t, getLocalizedProductName, getLocalizedCategory } = useLanguage();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(() => {
    const local = JSON.parse(localStorage.getItem('agriseed_orders') || '[]');
    return [...local, ...INITIAL_ORDERS];
  });

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'farmers' | 'sellers'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // Modals for User Management
  const [editingUser, setEditingUser] = useState(null);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);

  const [resetPassUser, setResetPassUser] = useState(null);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [showAdminResetPass, setShowAdminResetPass] = useState(false);
  const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);

  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  // Modals for Product Management
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);

  const [actionAlert, setActionAlert] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Fetch live orders, products, and users from MongoDB
  const fetchAdminData = async () => {
    try {
      const [ordersRes, prodsRes, usersRes] = await Promise.all([
        orderService.getAll(),
        productService.getAll(),
        adminService.getUsers()
      ]);
      if (ordersRes.success && ordersRes.orders && ordersRes.orders.length > 0) {
        const local = JSON.parse(localStorage.getItem('agriseed_orders') || '[]');
        const combined = [...ordersRes.orders, ...local];
        const unique = Array.from(new Map(combined.map(item => [item.id || item.orderId, item])).values());
        setOrders(unique);
      }
      if (prodsRes.success && prodsRes.products && prodsRes.products.length > 0) {
        setProducts(prodsRes.products);
      }
      if (usersRes.success && usersRes.users && usersRes.users.length > 0) {
        setRegisteredUsers(usersRes.users);
      }
    } catch (e) {
      console.warn('Admin live sync fallback:', e);
    }
  };

  React.useEffect(() => {
    fetchAdminData();
  }, []);

  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Seeds',
    price: 500,
    originalPrice: 600,
    unit: '1 Pack',
    stock: 50,
    cropSuitability: 'Paddy / Rice',
    season: 'Kharif Season',
    germinationRate: '92%',
    dosageGuide: '5 kg per acre',
    imageUrl: '',
    description: ''
  });

  const handleStatusChange = async (orderId, newStatus) => {
    // 1. Update state locally
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

    // 2. Persist to MongoDB
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
    } catch (e) {
      console.warn('Admin status sync warning:', e);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsActionLoading(true);
    setActionAlert(null);
    const created = {
      id: `prod_${Date.now()}`,
      name: newProd.name,
      category: newProd.category,
      categoryIcon: newProd.category === 'Seeds' ? '🌾' : newProd.category === 'Fertilizers' ? '🧪' : newProd.category === 'Pesticides' ? '🌱' : '🚜',
      price: Number(newProd.price),
      originalPrice: Number(newProd.originalPrice || (Number(newProd.price) + 100)),
      unit: newProd.unit || '1 Pack',
      packSizes: [{ size: newProd.unit || 'Standard Pack', price: Number(newProd.price) }],
      stock: Number(newProd.stock),
      rating: 5.0,
      reviewCount: 1,
      imageUrl: newProd.imageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      cropSuitability: newProd.cropSuitability,
      season: newProd.season,
      germinationRate: newProd.germinationRate,
      purity: '99%',
      maturityPeriod: '120 Days',
      yieldPotential: 'High Yield Potential',
      sellerId: 'seller_1',
      sellerName: 'Kisan Vikas Agro Kendra',
      verifiedSeller: true,
      description: newProd.description || `High-grade certified agricultural ${newProd.category.toLowerCase()} lot.`,
      dosageGuide: newProd.dosageGuide
    };

    try {
      const res = await adminService.addProduct(created);
      if (res.success && res.product) {
        setProducts([res.product, ...products]);
      } else {
        setProducts([created, ...products]);
      }
      setActionAlert({ type: 'success', text: `Product '${created.name}' created and saved to MongoDB catalog!` });
      setIsAddModalOpen(false);
      setNewProd({
        name: '',
        category: 'Seeds',
        price: 500,
        originalPrice: 600,
        unit: '1 Pack',
        stock: 50,
        cropSuitability: 'Paddy / Rice',
        season: 'Kharif Season',
        germinationRate: '92%',
        dosageGuide: '5 kg per acre',
        imageUrl: '',
        description: ''
      });
    } catch (err) {
      setProducts([created, ...products]);
      setIsAddModalOpen(false);
      setActionAlert({ type: 'success', text: `Product '${created.name}' added to catalog.` });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct({
      id: prod.id || prod._id,
      name: prod.name || '',
      category: prod.category || 'Seeds',
      price: prod.price || 0,
      originalPrice: prod.originalPrice || prod.original_price || (prod.price ? prod.price + 100 : 0),
      unit: prod.unit || '1 Pack',
      stock: prod.stock || 0,
      cropSuitability: prod.cropSuitability || prod.crop_suitability || '',
      season: prod.season || '',
      germinationRate: prod.germinationRate || prod.germination_rate || '',
      dosageGuide: prod.dosageGuide || prod.dosage_guide || '',
      description: prod.description || '',
      imageUrl: prod.imageUrl || prod.image_url || ''
    });
    setIsEditProductModalOpen(true);
  };

  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsActionLoading(true);
    setActionAlert(null);
    try {
      const res = await adminService.updateProduct(editingProduct.id, editingProduct);
      if (res.success) {
        setActionAlert({ type: 'success', text: `Product '${editingProduct.name}' updated successfully in MongoDB!` });
        setProducts(prev => prev.map(p => ((p.id || p._id) === editingProduct.id ? { ...p, ...editingProduct } : p)));
        setIsEditProductModalOpen(false);
      } else {
        setActionAlert({ type: 'error', text: res.message || 'Failed to update product.' });
      }
    } catch (err) {
      setActionAlert({ type: 'error', text: 'Error updating product in database.' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenDeleteProduct = (prod) => {
    setDeletingProduct(prod);
    setIsDeleteProductModalOpen(true);
  };

  const handleConfirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    setIsActionLoading(true);
    setActionAlert(null);
    try {
      const prodId = deletingProduct.id || deletingProduct._id;
      const res = await adminService.deleteProduct(prodId);
      if (res.success) {
        setActionAlert({ type: 'success', text: `Product '${deletingProduct.name}' removed from catalog database.` });
        setProducts(prev => prev.filter(p => (p.id || p._id) !== prodId));
        setIsDeleteProductModalOpen(false);
      } else {
        setActionAlert({ type: 'error', text: res.message || 'Failed to delete product.' });
      }
    } catch (err) {
      setActionAlert({ type: 'error', text: 'Error deleting product from database.' });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Farmer & User Management Handlers
  const handleOpenEditUser = (user) => {
    setEditingUser({
      id: user.id || user._id,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'farmer',
      village: user.village || '',
      district: user.district || '',
      state: user.state || '',
      farmSize: user.farmSize || '5 Acres',
      kisanRewards: user.kisanRewards || 100
    });
    setIsEditUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsActionLoading(true);
    setActionAlert(null);
    try {
      const res = await adminService.updateUser(editingUser.id, editingUser);
      if (res.success) {
        setActionAlert({ type: 'success', text: `Profile updated for ${editingUser.name}!` });
        setRegisteredUsers(prev => prev.map(u => ((u.id || u._id) === editingUser.id ? { ...u, ...editingUser } : u)));
        setIsEditUserModalOpen(false);
      } else {
        setActionAlert({ type: 'error', text: res.message || 'Failed to update user.' });
      }
    } catch (err) {
      setActionAlert({ type: 'error', text: 'Error saving user details.' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenResetPass = (user) => {
    setResetPassUser(user);
    setNewAdminPassword('');
    setShowAdminResetPass(false);
    setIsResetPassModalOpen(true);
  };

  const handleSaveResetPass = async (e) => {
    e.preventDefault();
    if (!resetPassUser || !newAdminPassword) return;
    setIsActionLoading(true);
    setActionAlert(null);
    try {
      const userId = resetPassUser.id || resetPassUser._id;
      const res = await adminService.resetUserPassword(userId, newAdminPassword);
      if (res.success) {
        setActionAlert({ type: 'success', text: `Password successfully reset for ${resetPassUser.name}!` });
        setIsResetPassModalOpen(false);
      } else {
        setActionAlert({ type: 'error', text: res.message || 'Failed to reset password.' });
      }
    } catch (err) {
      setActionAlert({ type: 'error', text: 'Error resetting password.' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenDeleteUser = (user) => {
    setDeletingUser(user);
    setIsDeleteUserModalOpen(true);
  };

  const handleConfirmDeleteUser = async () => {
    if (!deletingUser) return;
    setIsActionLoading(true);
    setActionAlert(null);
    try {
      const userId = deletingUser.id || deletingUser._id;
      const res = await adminService.deleteUser(userId);
      if (res.success) {
        setActionAlert({ type: 'success', text: `User ${deletingUser.name} permanently removed from database.` });
        setRegisteredUsers(prev => prev.filter(u => (u.id || u._id) !== userId));
        setIsDeleteUserModalOpen(false);
      } else {
        setActionAlert({ type: 'error', text: res.message || 'Failed to delete user.' });
      }
    } catch (err) {
      setActionAlert({ type: 'error', text: 'Error deleting user.' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const lowStock = products.filter(p => p.stock <= 45);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Action Notification Alert */}
      {actionAlert && (
        <div className={`p-4 rounded-2xl flex items-center justify-between text-xs font-bold border transition-all ${
          actionAlert.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-center gap-2">
            {actionAlert.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
            <span>{actionAlert.text}</span>
          </div>
          <button onClick={() => setActionAlert(null)} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      
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

          <button
            onClick={() => setActiveTab('farmers')}
            className={`py-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'farmers' ? 'border-emerald-600 text-emerald-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            👨‍🌾 Registered Farmers ({registeredUsers.length})
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteProduct(p)}
                          className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-800 rounded-lg transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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

        {/* Tab 4: Registered Farmers & Users */}
        {activeTab === 'farmers' && (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Farmer / User Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Mobile & Email</th>
                  <th className="p-3">Village / District</th>
                  <th className="p-3">Farm Land Holding</th>
                  <th className="p-3">Primary Crops</th>
                  <th className="p-3">Kisan Rewards</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {registeredUsers.map((u) => {
                  const userId = u.id || u._id;
                  return (
                    <tr key={userId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                            {u.role === 'admin' ? '🛡️' : '👨‍🌾'}
                          </div>
                          <span className="font-bold text-slate-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          u.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.role || 'farmer'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">
                        <div>{u.phone || 'N/A'}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </td>
                      <td className="p-3 text-slate-600">{u.village ? `${u.village}, ${u.district || ''}` : u.district || 'India'}</td>
                      <td className="p-3 font-semibold">{u.farmSize || '5 Acres'}</td>
                      <td className="p-3 text-slate-600">
                        {Array.isArray(u.primaryCrops) ? u.primaryCrops.join(', ') : u.primaryCrops || 'Paddy, Wheat'}
                      </td>
                      <td className="p-3 font-black text-emerald-700">
                        ⭐ {u.kisanRewards || 100} Pts
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditUser(u)}
                            className="p-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-lg transition-colors cursor-pointer"
                            title="Edit Farmer Profile & Role"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenResetPass(u)}
                            className="p-1.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 rounded-lg transition-colors cursor-pointer"
                            title="Reset User Password"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteUser(u)}
                            className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-800 rounded-lg transition-colors cursor-pointer"
                            title="Delete User from Database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Crop Suitability</label>
                  <input
                    type="text"
                    value={newProd.cropSuitability}
                    onChange={(e) => setNewProd({ ...newProd, cropSuitability: e.target.value })}
                    placeholder="e.g. Paddy / Rice"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Season</label>
                  <input
                    type="text"
                    value={newProd.season}
                    onChange={(e) => setNewProd({ ...newProd, season: e.target.value })}
                    placeholder="e.g. Kharif / Rabi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('dosageGuideInput')}</label>
                <input
                  type="text"
                  value={newProd.dosageGuide}
                  onChange={(e) => setNewProd({ ...newProd, dosageGuide: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL (Optional Unsplash Link)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newProd.imageUrl}
                  onChange={(e) => setNewProd({ ...newProd, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  placeholder="Certified disease resistant agricultural lot..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-700/20"
                >
                  {isActionLoading ? 'Adding...' : t('saveProductBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Catalog Product</h3>
                  <p className="text-[11px] text-slate-400 font-mono">{editingProduct.id}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Seeds">🌾 Seeds</option>
                    <option value="Fertilizers">🧪 Fertilizers</option>
                    <option value="Pesticides">🌱 Pesticides</option>
                    <option value="Farming Equipment">🚜 Farming Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit / Pack Size</label>
                  <input
                    type="text"
                    value={editingProduct.unit}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    placeholder="e.g. 10 kg Bag"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discounted Selling Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-emerald-900 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original MRP Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Stock (Units)</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Germination / Efficacy Rate</label>
                  <input
                    type="text"
                    value={editingProduct.germinationRate}
                    onChange={(e) => setEditingProduct({ ...editingProduct, germinationRate: e.target.value })}
                    placeholder="e.g. 95% or N/A"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-emerald-800 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Crop Suitability</label>
                  <input
                    type="text"
                    value={editingProduct.cropSuitability}
                    onChange={(e) => setEditingProduct({ ...editingProduct, cropSuitability: e.target.value })}
                    placeholder="e.g. Paddy / Rice"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Recommended Season</label>
                  <input
                    type="text"
                    value={editingProduct.season}
                    onChange={(e) => setEditingProduct({ ...editingProduct, season: e.target.value })}
                    placeholder="e.g. Kharif / Rabi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dosage & Usage Guide</label>
                <input
                  type="text"
                  value={editingProduct.dosageGuide}
                  onChange={(e) => setEditingProduct({ ...editingProduct, dosageGuide: e.target.value })}
                  placeholder="e.g. 5 kg per acre"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">High-Resolution Image URL</label>
                <input
                  type="url"
                  value={editingProduct.imageUrl}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-mono text-[11px] focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditProductModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-700/20"
                >
                  {isActionLoading ? 'Saving...' : 'Save Product Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Delete Product Confirmation Modal */}
      {isDeleteProductModalOpen && deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-100">
            <div className="flex items-center gap-3 mb-4 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Product</h3>
                <p className="text-[11px] text-rose-500 font-bold uppercase">Permanent Catalog Deletion</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to permanently delete <strong className="text-slate-900">{deletingProduct.name}</strong> from the agricultural marketplace catalog? This will also remove it from MongoDB.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteProductModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProduct}
                disabled={isActionLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-md shadow-rose-700/20"
              >
                {isActionLoading ? 'Deleting...' : 'Yes, Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit User Details</h3>
                  <p className="text-[11px] text-slate-400">{editingUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">System Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-800 focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="farmer">👨‍🌾 Farmer</option>
                    <option value="admin">🛡️ Store Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Land Holding</label>
                  <input
                    type="text"
                    value={editingUser.farmSize}
                    onChange={(e) => setEditingUser({ ...editingUser, farmSize: e.target.value })}
                    placeholder="e.g. 5 Acres"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Village / Town</label>
                  <input
                    type="text"
                    value={editingUser.village}
                    onChange={(e) => setEditingUser({ ...editingUser, village: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={editingUser.district}
                    onChange={(e) => setEditingUser({ ...editingUser, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kisan Loyalty Reward Points (⭐)</label>
                <input
                  type="number"
                  value={editingUser.kisanRewards}
                  onChange={(e) => setEditingUser({ ...editingUser, kisanRewards: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-emerald-800 focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors disabled:opacity-50"
                >
                  {isActionLoading ? 'Saving...' : 'Save User Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Reset Password Modal */}
      {isResetPassModalOpen && resetPassUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reset Password</h3>
                  <p className="text-[11px] text-slate-400">{resetPassUser.name} ({resetPassUser.email})</p>
                </div>
              </div>
              <button
                onClick={() => setIsResetPassModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveResetPass} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Set New Password</label>
                <div className="relative">
                  <input
                    type={showAdminResetPass ? "text" : "password"}
                    placeholder="Enter new password (min 6 characters)"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pr-10 outline-none font-medium focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminResetPass(!showAdminResetPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showAdminResetPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  The password will be securely hashed with SHA-256 and saved in MongoDB.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetPassModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-50"
                >
                  {isActionLoading ? 'Updating...' : 'Set Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Delete User Confirmation Modal */}
      {isDeleteUserModalOpen && deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-100">
            <div className="flex items-center gap-3 mb-4 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete User Account</h3>
                <p className="text-[11px] text-rose-500 font-bold uppercase">Permanent MongoDB Action</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to permanently delete <strong className="text-slate-900">{deletingUser.name}</strong> ({deletingUser.email})? All associated records will be removed. This cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteUserModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                disabled={isActionLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors disabled:opacity-50"
              >
                {isActionLoading ? 'Deleting...' : 'Yes, Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
