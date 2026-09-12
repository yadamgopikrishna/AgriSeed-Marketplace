// AgriSeed Frontend REST API Client
// Seamless communication with Flask Backend & MongoDB

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Universal fetch wrapper with error handling and JSON parsing
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    credentials: 'include' // include cookies for session support
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      return { success: false, message: errorMsg, status: response.status, data };
    }

    return { success: true, ...data };
  } catch (err) {
    console.warn(`[API] Network error communicating with ${url}:`, err);
    return { success: false, message: err.message || 'Network connection failed.' };
  }
}

// ----------------------------------------------------------------------
// AUTHENTICATION SERVICES
// ----------------------------------------------------------------------
export const authService = {
  async register(formData) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  },

  async login(identity, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identity, password })
    });
  },

  async demoLogin(role = 'farmer') {
    return request('/auth/demo_login', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
  },

  async getMe(userId = null) {
    const query = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
    return request(`/auth/me${query}`, { method: 'GET' });
  },

  async updateProfile(userId, profileData) {
    return request(`/users/${encodeURIComponent(userId)}`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  async changePassword(userId, currentPassword, newPassword) {
    return request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ userId, currentPassword, newPassword })
    });
  },

  async deleteAccount(userId) {
    return request(`/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE'
    });
  },

  async logout() {
    return request('/auth/logout', { method: 'POST' });
  }
};

// ----------------------------------------------------------------------
// PRODUCT CATALOG SERVICES
// ----------------------------------------------------------------------
export const productService = {
  async getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.category && params.category !== 'All') queryParams.append('category', params.category);
    if (params.crop && params.crop !== 'All') queryParams.append('crop', params.crop);
    if (params.q) queryParams.append('q', params.q);
    if (params.maxPrice) queryParams.append('max_price', params.maxPrice);

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return request(endpoint, { method: 'GET' });
  },

  async getById(productId) {
    return request(`/products/${productId}`, { method: 'GET' });
  },

  async addReview(productId, review) {
    return request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review)
    });
  }
};

// ----------------------------------------------------------------------
// ORDER & LOGISTICS SERVICES
// ----------------------------------------------------------------------
export const orderService = {
  async create(orderPayload) {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload)
    });
  },

  async getById(orderId) {
    return request(`/orders/${encodeURIComponent(orderId)}`, { method: 'GET' });
  },

  async getByUserId(userId) {
    return request(`/orders/user/${encodeURIComponent(userId)}`, { method: 'GET' });
  },

  async getAll() {
    return request('/orders', { method: 'GET' });
  },

  async applyCoupon(code) {
    return request('/cart/coupon', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }
};

// ----------------------------------------------------------------------
// CROP DOCTOR AI DIAGNOSTIC SERVICE
// ----------------------------------------------------------------------
export const cropDoctorService = {
  async diagnose(sampleIndex = 0, imageUrl = null) {
    return request('/crop-doctor/diagnose', {
      method: 'POST',
      body: JSON.stringify({ sampleIndex, imageUrl })
    });
  }
};

// ----------------------------------------------------------------------
// ADMIN STORE MANAGEMENT SERVICES
// ----------------------------------------------------------------------
export const adminService = {
  async getUsers() {
    return request('/admin/users', { method: 'GET' });
  },

  async updateUser(userId, userData) {
    return request(`/admin/users/${encodeURIComponent(userId)}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  async resetUserPassword(userId, newPassword) {
    return request(`/admin/users/${encodeURIComponent(userId)}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword })
    });
  },

  async deleteUser(userId) {
    return request(`/admin/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE'
    });
  },

  async updateOrderStatus(orderId, status) {
    return request(`/admin/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'POST',
      body: JSON.stringify({ status })
    });
  },

  async addProduct(productData) {
    return request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async updateProduct(productId, productData) {
    return request(`/admin/products/${encodeURIComponent(productId)}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  async deleteProduct(productId) {
    return request(`/admin/products/${encodeURIComponent(productId)}`, {
      method: 'DELETE'
    });
  },

  async resetDemoData() {
    return request('/reset_demo_data', { method: 'POST' });
  }
};

// ----------------------------------------------------------------------
// SELLER DASHBOARD & QUALITY VERIFICATION SERVICES
// ----------------------------------------------------------------------
export const sellerService = {
  async getDashboard(sellerId = null) {
    const query = sellerId ? `?seller_id=${encodeURIComponent(sellerId)}` : '';
    return request(`/seller/dashboard${query}`, { method: 'GET' });
  },

  async addCertifiedProduct(productData) {
    return request('/seller/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async fulfillOrder(orderId, trackingData = {}) {
    return request(`/seller/orders/${encodeURIComponent(orderId)}/fulfill`, {
      method: 'POST',
      body: JSON.stringify(trackingData)
    });
  }
};

export default {
  auth: authService,
  products: productService,
  orders: orderService,
  cropDoctor: cropDoctorService,
  admin: adminService,
  seller: sellerService
};
