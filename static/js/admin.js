/**
 * AgriSeed Admin Dashboard Engine
 */

async function updateOrderStatus(orderId, newStatus) {
    if (!newStatus) return;
    try {
        const res = await fetch(`/api/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.message, 'success');
            setTimeout(() => window.location.reload(), 600);
        } else {
            showToast(data.message || 'Failed to update order status', 'error');
        }
    } catch (err) {
        showToast('Network error updating status', 'error');
    }
}

async function handleAddProduct(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const payload = {
        name: formData.get('name'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        unit: formData.get('unit'),
        crop_suitability: formData.get('crop_suitability'),
        season: formData.get('season'),
        description: formData.get('description'),
        image_url: formData.get('image_url') || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
        is_featured: formData.get('is_featured') === 'on'
    };

    try {
        const res = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.message, 'success');
            closeModal('addProductModal');
            setTimeout(() => window.location.reload(), 700);
        } else {
            showToast(data.message || 'Error adding product', 'error');
        }
    } catch (err) {
        showToast('Network error adding product', 'error');
    }
}

async function handleDeleteProduct(productId, productName) {
    if (!confirm(`Are you sure you want to delete product "${productName}"?`)) return;

    try {
        const res = await fetch(`/api/admin/products/${productId}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.message, 'info');
            setTimeout(() => window.location.reload(), 600);
        } else {
            showToast('Failed to delete product', 'error');
        }
    } catch (err) {
        showToast('Network error deleting product', 'error');
    }
}

async function handleDeleteUser(userId, userName) {
    if (!confirm(`Are you sure you want to permanently delete user "${userName}" from the database? This cannot be undone.`)) return;

    try {
        const res = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.message || 'User deleted successfully', 'success');
            setTimeout(() => window.location.reload(), 600);
        } else {
            showToast(data.message || 'Failed to delete user', 'error');
        }
    } catch (err) {
        showToast('Network error deleting user', 'error');
    }
}

function openEditUserModal(userJsonStr) {
    try {
        const user = JSON.parse(userJsonStr);
        document.getElementById('editUserId').value = user.id || user._id;
        document.getElementById('editUserName').value = user.name || '';
        document.getElementById('editUserPhone').value = user.phone || '';
        document.getElementById('editUserEmail').value = user.email || '';
        document.getElementById('editUserRole').value = user.role || 'farmer';
        document.getElementById('editUserFarmSize').value = user.farmSize || user.farm_size || '5 Acres';
        document.getElementById('editUserRewards').value = user.kisanRewards || user.kisan_rewards || 100;
        openModal('editUserModal');
    } catch (e) {
        console.error('Error parsing user JSON:', e);
    }
}

async function handleSaveEditedUser(e) {
    e.preventDefault();
    const userId = document.getElementById('editUserId').value;
    const payload = {
        name: document.getElementById('editUserName').value,
        phone: document.getElementById('editUserPhone').value,
        email: document.getElementById('editUserEmail').value,
        role: document.getElementById('editUserRole').value,
        farmSize: document.getElementById('editUserFarmSize').value,
        farm_size: document.getElementById('editUserFarmSize').value,
        kisanRewards: parseInt(document.getElementById('editUserRewards').value) || 100
    };

    try {
        const res = await fetch(`/api/admin/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.message || 'User updated successfully', 'success');
            closeModal('editUserModal');
            setTimeout(() => window.location.reload(), 600);
        } else {
            showToast(data.message || 'Failed to update user', 'error');
        }
    } catch (err) {
        showToast('Network error updating user', 'error');
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}
