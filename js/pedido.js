// ============================================
// PEDIDO.JS - Seguimiento de Pedidos
// Restaurante SENA - Sistema de Pedidos QR
// ============================================

// Variables globales
let currentOrder = null;
let orderUpdateInterval = null;

// Inicializar cuando cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    loadOrder();
    initializeEventListeners();
    console.log('Sistema de seguimiento de pedidos cargado');
});

/**
 * Inicializar event listeners
 */
function initializeEventListeners() {
    // Botón de llamar al mesero
    document.querySelector('.action-btn.primary')?.addEventListener('click', callWaiter);
    
    // Botón de ver factura
    document.querySelector('.action-btn.secondary[onclick="viewReceipt()"]')?.addEventListener('click', viewReceipt);
    
    // Botón de agregar más
    document.querySelector('.action-btn.secondary[href="menu.html"]')?.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'menu.html';
    });
}

/**
 * Obtener el último pedido del localStorage
 */
function getLastOrder() {
    const order = localStorage.getItem('lastOrder');
    return order ? JSON.parse(order) : null;
}

/**
 * Obtener todos los pedidos del localStorage
 */
function getAllOrders() {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
}

/**
 * Formatear precio como moneda colombiana
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
}

/**
 * Formatear fecha/hora
 */
function formatTime(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-CO', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    } catch (error) {
        return '--:--';
    }
}

/**
 * Calcular tiempo restante
 */
function calculateTimeRemaining(estimatedTime) {
    if (!estimatedTime) return '20 min';
    
    try {
        const now = new Date();
        const estimated = new Date(estimatedTime);
        const diffMs = estimated - now;
        const diffMins = Math.max(0, Math.ceil(diffMs / 60000));
        
        return `${diffMins} min`;
    } catch (error) {
        return '20 min';
    }
}

/**
 * Mostrar notificación toast
 */
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'position-fixed top-0 end-0 p-3';
    toast.style.zIndex = '9999';
    
    let bgColor = 'bg-info';
    let icon = 'bi-info-circle-fill';
    
    if (type === 'success') {
        bgColor = 'bg-success';
        icon = 'bi-check-circle-fill';
    } else if (type === 'error') {
        bgColor = 'bg-danger';
        icon = 'bi-x-circle-fill';
    } else if (type === 'warning') {
        bgColor = 'bg-warning';
        icon = 'bi-exclamation-triangle-fill';
    }
    
    toast.innerHTML = `
        <div class="alert ${bgColor} text-white alert-dismissible fade show shadow-lg" role="alert">
            <i class="bi ${icon} me-2"></i>
            <strong>${message}</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * Actualizar barra de progreso del timeline
 */
function updateProgressBar(status) {
    const progressElement = document.getElementById('timelineProgress');
    if (!progressElement) return;
    
    const progressMap = {
        'pendiente': '25%',
        'preparacion': '50%',
        'listo': '75%',
        'entregado': '100%'
    };
    
    progressElement.style.width = progressMap[status] || '25%';
}

/**
 * Actualizar estado visual del pedido
 */
function updateStatusVisual(status) {
    const badgeElement = document.getElementById('statusBadge');
    const statusTextElement = document.getElementById('statusText');
    
    if (!badgeElement || !statusTextElement) return;
    
    const statusMap = {
        'pendiente': {
            badgeClass: 'pending',
            badgeIcon: 'bi-clock',
            badgeText: 'Pendiente',
            text: 'Tu pedido ha sido recibido'
        },
        'preparacion': {
            badgeClass: 'preparing',
            badgeIcon: 'bi-arrow-repeat',
            badgeText: 'En Preparación',
            text: 'Tu pedido está siendo preparado por nuestro chef'
        },
        'listo': {
            badgeClass: 'ready',
            badgeIcon: 'bi-check2-circle',
            badgeText: 'Listo',
            text: '¡Tu pedido está listo! Será llevado a tu mesa'
        },
        'entregado': {
            badgeClass: 'delivered',
            badgeIcon: 'bi-truck',
            badgeText: 'Entregado',
            text: '¡Tu pedido ha sido entregado en tu mesa! ¡Buen provecho!'
        }
    };
    
    const statusInfo = statusMap[status] || statusMap.pendiente;
    
    // Actualizar badge
    badgeElement.className = `status-badge ${statusInfo.badgeClass}`;
    badgeElement.innerHTML = `
        <i class="bi ${statusInfo.badgeIcon} ${status === 'preparacion' ? 'rotating' : ''}"></i>
        <span>${statusInfo.badgeText}</span>
    `;
    
    // Actualizar texto
    statusTextElement.textContent = statusInfo.text;
    
    // Actualizar íconos de timeline
    updateTimelineIcons(status);
}

/**
 * Actualizar íconos del timeline
 */
function updateTimelineIcons(status) {
    const stepIcons = document.querySelectorAll('.step-icon');
    
    // Reset all icons
    stepIcons.forEach(icon => {
        icon.classList.remove('completed', 'active', 'pulse');
        const i = icon.querySelector('i');
        if (i) {
            i.classList.remove('rotating');
        }
    });
    
    // Set completed and active icons based on status
    if (status === 'pendiente') {
        stepIcons[0].classList.add('completed');
    }
    else if (status === 'preparacion') {
        stepIcons[0].classList.add('completed');
        stepIcons[1].classList.add('active', 'pulse');
        const icon2 = stepIcons[1].querySelector('i');
        if (icon2) icon2.classList.add('rotating');
    }
    else if (status === 'listo') {
        stepIcons[0].classList.add('completed');
        stepIcons[1].classList.add('completed');
        stepIcons[2].classList.add('active');
    }
    else if (status === 'entregado') {
        stepIcons.forEach(icon => icon.classList.add('completed'));
    }
}

/**
 * Renderizar items del pedido
 */
function renderOrderItems(items) {
    const container = document.getElementById('orderItemsList');
    if (!container || !items) return;
    
    const itemsHTML = items.map(item => `
        <div class="order-item">
            <img src="${item.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop'}" 
                 alt="${item.name}" 
                 class="item-image">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">${formatCurrency(item.price)} c/u</div>
            </div>
            <div class="item-quantity">
                <span class="quantity-badge">${item.quantity}</span>
            </div>
            <div class="item-total">
                ${formatCurrency(item.price * item.quantity)}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = itemsHTML;
}

/**
 * Actualizar resumen de pago
 */
function updatePaymentSummary(order) {
    if (!order) return;
    
    const subtotal = order.subtotal || order.total || 0;
    const tip = order.tip || 0;
    const tax = subtotal * 0.19; // 19% IVA
    const total = subtotal + tip + tax;
    
    document.getElementById('subtotalSummary').textContent = formatCurrency(subtotal);
    document.getElementById('tipSummary').textContent = formatCurrency(tip);
    document.getElementById('taxSummary').textContent = formatCurrency(tax);
    document.getElementById('totalSummary').textContent = formatCurrency(total);
}

/**
 * Cargar y mostrar el pedido
 */
function loadOrder() {
    const order = getLastOrder();
    const allOrders = getAllOrders();
    
    const noOrderMessage = document.getElementById('noOrderMessage');
    const orderContent = document.getElementById('orderContent');
    
    // Si no hay pedido activo, mostrar mensaje
    if (!order && allOrders.length === 0) {
        noOrderMessage.style.display = 'block';
        orderContent.style.display = 'none';
        return;
    }
    
    // Mostrar contenido del pedido
    noOrderMessage.style.display = 'none';
    orderContent.style.display = 'block';
    
    // Usar el último pedido o el último de la lista
    currentOrder = order || allOrders[allOrders.length - 1];
    
    // Actualizar información básica
    document.getElementById('orderNumber').textContent = currentOrder.orderNumber || 'ORD-' + (currentOrder.id?.toString().slice(-4) || '0000');
    document.getElementById('tableNumber').textContent = currentOrder.table || localStorage.getItem('tableNumber') || '5';
    document.getElementById('orderTime').textContent = formatTime(currentOrder.date);
    document.getElementById('estimatedTime').textContent = calculateTimeRemaining(currentOrder.estimatedTime);
    document.getElementById('timeRemaining').textContent = `Tiempo restante: ${calculateTimeRemaining(currentOrder.estimatedTime)}`;
    
    // Actualizar timeline times
    document.getElementById('step1Time').textContent = formatTime(currentOrder.date);
    
    // Actualizar estado
    const status = currentOrder.status || 'preparacion';
    updateStatusVisual(status);
    updateProgressBar(status);
    
    // Renderizar items
    renderOrderItems(currentOrder.items);
    
    // Actualizar resumen de pago
    updatePaymentSummary(currentOrder);
    
    console.log('Pedido cargado:', currentOrder);
}

/**
 * Simular progreso del pedido
 */
function simulateOrderProgress() {
    if (!currentOrder) return;
    
    let status = currentOrder.status || 'preparacion';
    
    // Avanzar el estado del pedido
    setTimeout(() => {
        if (status === 'preparacion') {
            updateOrderStatus('listo');
            showNotification('¡Tu pedido está listo!', 'success');
            
            // Simular entrega después de 10 segundos
            setTimeout(() => {
                updateOrderStatus('entregado');
                showNotification('¡Pedido entregado en tu mesa!', 'success');
            }, 10000);
        }
    }, 15000);
}

/**
 * Actualizar estado del pedido
 */
function updateOrderStatus(newStatus) {
    if (!currentOrder) return;
    
    currentOrder.status = newStatus;
    
    // Actualizar en localStorage
    localStorage.setItem('lastOrder', JSON.stringify(currentOrder));
    
    // Actualizar en la lista de pedidos
    const orders = getAllOrders();
    const orderIndex = orders.findIndex(o => o.id === currentOrder.id);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    // Actualizar UI
    loadOrder();
}

/**
 * Llamar al mesero
 */
function callWaiter() {
    if (!currentOrder) {
        showNotification('No hay pedido activo', 'warning');
        return;
    }
    
    showNotification(`Mesero notificado para mesa ${currentOrder.table}`, 'success');
    console.log(`Mesero llamado para mesa ${currentOrder.table}, pedido ${currentOrder.orderNumber}`);
}

/**
 * Ver factura - Redirige a factura.html con el ID del pedido
 */
function viewReceipt() {
    if (!currentOrder) {
        showNotification('No hay pedido activo', 'warning');
        return;
    }
    
    // Guardar el pedido actual para factura
    localStorage.setItem('invoiceOrder', JSON.stringify(currentOrder));
    
    // Redirigir a factura.html
    window.location.href = 'factura.html';
}



// Hacer funciones disponibles globalmente
window.callWaiter = callWaiter;
window.viewReceipt = viewReceipt;

// Iniciar simulación cuando la página cargue
setTimeout(simulateOrderProgress, 3000);