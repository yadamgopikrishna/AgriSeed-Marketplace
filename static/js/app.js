/**
 * AgriSeed Marketplace - Client JavaScript Engine
 */

// Toast notification helper
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '🌱';
    if (type === 'error') icon = '⚠️';
    if (type === 'info') icon = 'ℹ️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Global Cart Manager
const Cart = {
    async add(productId, packSize = null, quantity = 1) {
        try {
            const res = await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId, pack_size: packSize, quantity: quantity })
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message, 'success');
                // Update cart count badge
                const badges = document.querySelectorAll('.cart-badge-count');
                badges.forEach(b => b.textContent = data.cart_count);
            } else {
                showToast(data.message || 'Could not add product to cart', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Network error adding to cart', 'error');
        }
    },

    async update(productId, packSize, action, quantity = null) {
        try {
            const res = await fetch('/api/cart/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId, pack_size: packSize, action, quantity })
            });
            const data = await res.json();
            if (data.success) {
                window.location.reload();
            }
        } catch (err) {
            showToast('Error updating cart', 'error');
        }
    },

    async remove(productId, packSize) {
        try {
            const res = await fetch('/api/cart/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId, pack_size: packSize })
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message, 'info');
                setTimeout(() => window.location.reload(), 400);
            }
        } catch (err) {
            showToast('Error removing item', 'error');
        }
    },

    async applyCoupon(code) {
        if (!code) {
            showToast('Please enter a coupon code (Try: KISAN50)', 'info');
            return;
        }
        try {
            const res = await fetch('/api/cart/coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code })
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message, 'success');
                setTimeout(() => window.location.reload(), 600);
            } else {
                showToast(data.message, 'error');
            }
        } catch (err) {
            showToast('Failed to apply coupon', 'error');
        }
    }
};

// Global Auth Manager
const Auth = {
    async demoLogin(role = 'farmer') {
        try {
            const res = await fetch('/api/auth/demo_login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: role })
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message, 'success');
                setTimeout(() => {
                    window.location.href = data.redirect || '/';
                }, 700);
            } else {
                showToast(data.message, 'error');
            }
        } catch (err) {
            showToast('Demo login failed', 'error');
        }
    },

    async logout() {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' });
            const data = await res.json();
            showToast('Logged out successfully', 'info');
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        } catch (err) {
            window.location.href = '/';
        }
    }
};

// Reset Demo Data
async function resetDemoDatabase() {
    if (!confirm("Are you sure you want to reset demo data to pristine default state?")) return;
    try {
        const res = await fetch('/api/reset_demo_data', { method: 'POST' });
        const data = await res.json();
        showToast(data.message, 'success');
        setTimeout(() => window.location.href = '/', 1000);
    } catch (err) {
        showToast('Error resetting database', 'error');
    }
}

// Global Quick Auth Modal Controller
function openQuickAuth(tab = 'register') {
    const modal = document.getElementById('globalQuickAuthModal');
    if (!modal) {
        window.location.href = '/auth';
        return;
    }
    modal.classList.add('active');
    switchQuickAuthTab(tab);
}

function closeQuickAuth() {
    const modal = document.getElementById('globalQuickAuthModal');
    if (modal) modal.classList.remove('active');
}

function switchQuickAuthTab(tab) {
    const regForm = document.getElementById('quickRegForm');
    const loginForm = document.getElementById('quickLoginForm');
    const btnReg = document.getElementById('quickTabBtnReg');
    const btnLogin = document.getElementById('quickTabBtnLogin');

    if (tab === 'register') {
        if (regForm) regForm.style.display = 'block';
        if (loginForm) loginForm.style.display = 'none';
        if (btnReg) {
            btnReg.className = 'btn btn-primary btn-sm';
            btnReg.style.background = '';
        }
        if (btnLogin) {
            btnLogin.className = 'btn btn-secondary btn-sm';
            btnLogin.style.background = 'transparent';
            btnLogin.style.border = 'none';
        }
    } else {
        if (regForm) regForm.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
        if (btnLogin) {
            btnLogin.className = 'btn btn-primary btn-sm';
            btnLogin.style.background = '';
        }
        if (btnReg) {
            btnReg.className = 'btn btn-secondary btn-sm';
            btnReg.style.background = 'transparent';
            btnReg.style.border = 'none';
        }
    }
}

async function handleQuickRegisterSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '⏳ Registering Farm...';

    const payload = {
        name: document.getElementById('qRegName').value,
        phone: document.getElementById('qRegPhone').value,
        email: document.getElementById('qRegEmail') ? document.getElementById('qRegEmail').value : '',
        village: document.getElementById('qRegVillage') ? document.getElementById('qRegVillage').value : 'Krishi Nagar',
        district: document.getElementById('qRegDistrict') ? document.getElementById('qRegDistrict').value : 'Karnal',
        farm_size: document.getElementById('qRegFarmSize') ? document.getElementById('qRegFarmSize').value : '5 Acres',
        password: document.getElementById('qRegPassword').value
    };

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.message, 'success');
            closeQuickAuth();
            setTimeout(() => {
                window.location.href = data.redirect || '/dashboard';
            }, 700);
        } else {
            showToast(data.message || 'Registration failed', 'error');
            btn.disabled = false;
            btn.innerHTML = origText;
        }
    } catch (err) {
        showToast('Network error during registration', 'error');
        btn.disabled = false;
        btn.innerHTML = origText;
    }
}

async function handleQuickLoginSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '⏳ Signing In...';

    const identity = document.getElementById('qLoginIdentity').value;
    const password = document.getElementById('qLoginPassword').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity, password })
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.message, 'success');
            closeQuickAuth();
            setTimeout(() => {
                window.location.href = data.redirect || '/dashboard';
            }, 600);
        } else {
            showToast(data.message || 'Invalid credentials', 'error');
            btn.disabled = false;
            btn.innerHTML = origText;
        }
    } catch (err) {
        showToast('Network error during login', 'error');
        btn.disabled = false;
        btn.innerHTML = origText;
    }
}

// Print Invoice helper
function printInvoice() {
    window.print();
}
