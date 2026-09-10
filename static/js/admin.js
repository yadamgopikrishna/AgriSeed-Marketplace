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

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}
