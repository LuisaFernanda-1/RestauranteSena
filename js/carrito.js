// ============================================
// CARRITO.JS - Gestión del Carrito
// Restaurante SENA
// ============================================

// Inicializar cuando cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    renderCart();
    updateCartSummary();
    displayTableNumber();
});

/**
 * Obtener carrito del localStorage
 */
function getCart() {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
}

/**
 * Guardar carrito en localStorage
 */
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

/**
 * Actualizar badge del carrito
 */
function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const badges = document.querySelectorAll('#cartBadge, #cartCount, #floatingCartBadge');
    badges.forEach(badge => {
        if (badge) {
            badge.textContent = totalItems;
            if (totalItems > 0) {
                badge.classList.remove('d-none');
            } else {
                badge.classList.add('d-none');
            }
        }
    });
}

/**
 * Mostrar número de mesa
 */
function displayTableNumber() {
    const tableNumber = localStorage.getItem('tableNumber');
    const tableDisplay = document.getElementById('tableNumber');
    
    if (tableDisplay && tableNumber) {
        tableDisplay.textContent = tableNumber;
    }
}

/**
 * Renderizar carrito
 */
function renderCart() {
    const cart = getCart();
    const emptyCart = document.getElementById('emptyCart');
    const cartItems = document.getElementById('cartItems');
    const clearCartBtn = document.getElementById('clearCartBtn');
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartItems) cartItems.style.display = 'none';
        if (clearCartBtn) clearCartBtn.style.display = 'none';
    } else {
        if (emptyCart) emptyCart.style.display = 'none';
        if (cartItems) {
            cartItems.style.display = 'block';
            cartItems.innerHTML = cart.map(item => generateCartItemHTML(item)).join('');
        }
        if (clearCartBtn) clearCartBtn.style.display = 'inline-block';
    }
}

/**
 * Generar HTML de item del carrito
 */
function generateCartItemHTML(item) {
    return `
        <div class="card mb-3 shadow-sm border-0" data-product-id="${item.id}">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2 col-3">
                        <img src="${item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'}" 
                             alt="${item.name}" 
                             class="img-fluid rounded">
                    </div>
                    <div class="col-md-4 col-9">
                        <h5 class="card-title fw-bold mb-1">${item.name}</h5>
                        <p class="text-muted small mb-0">Precio: ${formatPrice(item.price)}</p>
                    </div>
                    <div class="col-md-3 col-6 mt-3 mt-md-0">
                        <div class="input-group input-group-sm">
                            <button class="btn btn-outline-secondary" onclick="decreaseQuantity(${item.id})">
                                <i class="bi bi-dash"></i>
                            </button>
                            <input type="number" class="form-control text-center" 
                                   value="${item.quantity}" readonly>
                            <button class="btn btn-outline-secondary" onclick="increaseQuantity(${item.id})">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 col-4 mt-3 mt-md-0 text-end">
                        <p class="fw-bold text-primary mb-0 fs-5">
                            ${formatPrice(item.price * item.quantity)}
                        </p>
                    </div>
                    <div class="col-md-1 col-2 mt-3 mt-md-0 text-end">
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Aumentar cantidad
 */
function increaseQuantity(productId) {
    let cart = getCart();
    const item = cart.find(i => i.id === productId);
    
    if (item && item.quantity < 10) {
        item.quantity += 1;
        saveCart(cart);
        renderCart();
        updateCartSummary();
        showNotification('Cantidad actualizada', 'success');
    }
}

/**
 * Disminuir cantidad
 */
function decreaseQuantity(productId) {
    let cart = getCart();
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            saveCart(cart);
            renderCart();
            updateCartSummary();
            showNotification('Cantidad actualizada', 'success');
        } else {
            if (confirm('¿Eliminar este producto?')) {
                removeFromCart(productId);
            }
        }
    }
}

/**
 * Eliminar producto
 */
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
    updateCartSummary();
    showNotification('Producto eliminado', 'info');
}

/**
 * Calcular totales
 */
function calculateCartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const servicio = subtotal * 0.10;
    const iva = subtotal * 0.19;
    const total = subtotal + servicio + iva;
    
    return { subtotal, servicio, iva, total };
}

/**
 * Actualizar resumen
 */
function updateCartSummary() {
    const totals = calculateCartTotals();
    
    updateElement('subtotal', formatPrice(totals.subtotal));
    updateElement('servicio', formatPrice(totals.servicio));
    updateElement('iva', formatPrice(totals.iva));
    updateElement('total', formatPrice(totals.total));
    updateElement('modalTotal', formatPrice(totals.total));
}

/**
 * Actualizar elemento
 */
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

/**
 * Formatear precio
 */
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

/**
 * Obtener fecha/hora actual
 */
function getCurrentDateTime() {
    const now = new Date();
    return {
        date: now.toISOString(),
        time: now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    };
}

/**
 * Mostrar notificación
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        <strong>${message}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

/**
 * Limpiar carrito
 */
function clearCart() {
    if (confirm('¿Vaciar el carrito?')) {
        localStorage.removeItem('cart');
        renderCart();
        updateCartSummary();
        updateCartBadge();
        showNotification('Carrito vaciado', 'info');
    }
}

/**
 * Confirmar pedido
 */
function confirmOrder() {
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'warning');
        return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

/**
 * Guardar pedido para admin
 */
function saveOrderForAdmin(orderData) {
    let activeOrders = JSON.parse(localStorage.getItem('activeOrders') || '[]');
    
    const adminOrder = {
        id: orderData.id || Date.now(),
        orderNumber: orderData.orderNumber,
        tableNumber: orderData.table || localStorage.getItem('tableNumber'),
        status: 'pendiente',
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        total: orderData.total || 0,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        comensales: orderData.comensales || 1,
        specialNotes: orderData.specialNotes || ''
    };
    
    activeOrders.push(adminOrder);
    localStorage.setItem('activeOrders', JSON.stringify(activeOrders));
    
    // También guardar en pedidos_global
    let globalOrders = JSON.parse(localStorage.getItem('pedidos_global') || '[]');
    globalOrders.push(adminOrder);
    localStorage.setItem('pedidos_global', JSON.stringify(globalOrders));
    
    console.log('✅ Pedido guardado para admin:', adminOrder);
}

/**
 * Enviar pedido
 */
// En la función sendOrder() de carrito.js, actualiza:
function sendOrder() {
    const cart = getCart();
    const tableNumber = localStorage.getItem('tableNumber');
    const specialNotes = document.getElementById('specialNotes')?.value || '';
    
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'warning');
        return;
    }
    
    const orderNumber = 'ORD-' + Date.now().toString().slice(-6);
    const totals = calculateCartTotals();
    const dateTime = getCurrentDateTime();
    
    const order = {
        id: Date.now(),
        orderNumber: orderNumber,
        table: tableNumber,
        tableNumber: tableNumber,
        items: cart,
        subtotal: totals.subtotal,
        servicio: totals.servicio,
        iva: totals.iva,
        total: totals.total,
        tip: 0,
        specialNotes: specialNotes,
        date: new Date().toISOString(),
        time: dateTime.time,
        status: 'pendiente',
        comensales: 1,
        timestamp: Date.now(),
        estimatedTime: new Date(Date.now() + 20 * 60000).toISOString()
    };
    
    // Guardar pedido
    localStorage.setItem('lastOrder', JSON.stringify(order));
    
    // **AGREGAR ESTA LÍNEA IMPORTANTE:**
    guardarPedidoParaAdmin(order);
    
    const orderHistory = JSON.parse(localStorage.getItem('orders') || '[]');
    orderHistory.push(order);
    localStorage.setItem('orders', JSON.stringify(orderHistory));
    
    // Limpiar carrito
    localStorage.removeItem('cart');
    updateCartBadge();
    
    // Cerrar modales
    const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
    if (confirmModal) confirmModal.hide();
    
    // Mostrar éxito
    document.getElementById('orderNumber').textContent = orderNumber;
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    console.log('✅ Pedido creado y sincronizado:', order);
    
    setTimeout(() => window.location.href = 'pedido.html', 3000);
}
// Exportar funciones
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.confirmOrder = confirmOrder;
window.sendOrder = sendOrder;