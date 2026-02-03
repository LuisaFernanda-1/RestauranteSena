// ============================================
// FACTURA.JS - Generación de Factura
// Restaurante SENA - Sistema de Pedidos QR
// ============================================

// Variables globales
let invoiceOrder = null;

// Inicializar cuando cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    loadInvoiceData();
    initializePrintFunctionality();
    console.log('Sistema de facturación cargado');
});

/**
 * Inicializar funcionalidad de impresión
 */
function initializePrintFunctionality() {
    // Botón imprimir
    document.getElementById('printInvoice')?.addEventListener('click', printInvoice);
    
    // Botón descargar PDF (simulación)
    document.getElementById('downloadPDF')?.addEventListener('click', downloadPDF);
    
    // Botón nuevo pedido
    document.getElementById('newOrder')?.addEventListener('click', () => {
        window.location.href = 'menu.html';
    });
}

/**
 * Cargar datos de la factura desde localStorage
 */
function loadInvoiceData() {
    // Obtener pedido para factura
    const orderData = localStorage.getItem('invoiceOrder');
    
    if (!orderData) {
        // Si no hay pedido, redirigir al menú
        showNoInvoiceMessage();
        return;
    }
    
    invoiceOrder = JSON.parse(orderData);
    renderInvoice();
}

/**
 * Mostrar mensaje cuando no hay factura
 */
function showNoInvoiceMessage() {
    const container = document.getElementById('invoiceContainer');
    if (container) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-receipt display-1 text-muted mb-4"></i>
                <h3 class="fw-bold mb-3">No hay factura disponible</h3>
                <p class="text-muted mb-4">
                    No se encontró ningún pedido para generar la factura.
                </p>
                <a href="menu.html" class="btn btn-primary btn-lg">
                    <i class="bi bi-list-ul me-2"></i>Hacer un Pedido
                </a>
            </div>
        `;
    }
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
 * Formatear fecha completa
 */
function formatFullDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Fecha no disponible';
    }
}

/**
 * Calcular totales de la factura
 */
function calculateInvoiceTotals(order) {
    const subtotal = order.subtotal || order.total || 0;
    const tip = order.tip || 0;
    const tax = subtotal * 0.19; // 19% IVA
    const total = subtotal + tip + tax;
    
    return { subtotal, tip, tax, total };
}

/**
 * Generar número de factura
 */
function generateInvoiceNumber(order) {
    const orderNumber = order.orderNumber || order.id || '0000';
    const invoiceNumber = `FAC-${new Date().getFullYear()}-${orderNumber}`;
    return invoiceNumber;
}

/**
 * Renderizar factura en la página
 */
function renderInvoice() {
    if (!invoiceOrder) return;
    
    // Calcular totales
    const totals = calculateInvoiceTotals(invoiceOrder);
    
    // Actualizar información de la factura
    updateElement('invoiceNumber', generateInvoiceNumber(invoiceOrder));
    updateElement('orderNumber', invoiceOrder.orderNumber || 'ORD-' + (invoiceOrder.id?.toString().slice(-4) || '0000'));
    updateElement('invoiceDate', formatFullDate(invoiceOrder.date));
    updateElement('tableNumber', invoiceOrder.table || 'No especificada');
    
    // Renderizar items de la factura
    renderInvoiceItems(invoiceOrder.items);
    
    // Actualizar totales
    updateElement('subtotalInvoice', formatCurrency(totals.subtotal));
    updateElement('tipInvoice', formatCurrency(totals.tip));
    updateElement('taxInvoice', formatCurrency(totals.tax));
    updateElement('totalInvoice', formatCurrency(totals.total));
    
    // Generar código QR para la factura (simulación)
    generateInvoiceQR();
}

/**
 * Actualizar elemento del DOM
 */
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

/**
 * Renderizar items de la factura
 */
function renderInvoiceItems(items) {
    const tbody = document.getElementById('invoiceItems');
    if (!tbody || !items) return;
    
    const itemsHTML = items.map((item, index) => `
        <tr>
            <td class="text-center">${index + 1}</td>
            <td>
                <strong>${item.name}</strong>
                <br>
                <small class="text-muted">Código: PRD-${item.id || '000'}</small>
            </td>
            <td class="text-center">${formatCurrency(item.price)}</td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-end">${formatCurrency(item.price * item.quantity)}</td>
        </tr>
    `).join('');
    
    tbody.innerHTML = itemsHTML;
}

/**
 * Generar código QR para la factura (simulación)
 */
function generateInvoiceQR() {
    const qrContainer = document.getElementById('invoiceQR');
    if (!qrContainer || !invoiceOrder) return;
    
    // Datos para el código QR
    const qrData = {
        invoice: generateInvoiceNumber(invoiceOrder),
        order: invoiceOrder.orderNumber,
        date: invoiceOrder.date,
        total: calculateInvoiceTotals(invoiceOrder).total,
        restaurant: "Restaurante SENA"
    };
    
    // Mostrar información del QR
    qrContainer.innerHTML = `
        <div class="text-center">
            <div class="mb-3">
                <i class="bi bi-qr-code display-4 text-success"></i>
            </div>
            <p class="small text-muted mb-1">Escanea para verificar factura</p>
            <p class="small mb-0">
                <strong>Factura:</strong> ${generateInvoiceNumber(invoiceOrder)}<br>
                <strong>Total:</strong> ${formatCurrency(calculateInvoiceTotals(invoiceOrder).total)}
            </p>
        </div>
    `;
    
    // En una implementación real, aquí se generaría un código QR real
    // usando una librería como qrcode.js
}

/**
 * Imprimir factura
 */
function printInvoice() {
    // Ocultar botones de acción para la impresión
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        actionButtons.classList.add('d-print-none');
    }
    
    // Imprimir
    window.print();
    
    // Restaurar botones después de imprimir
    if (actionButtons) {
        setTimeout(() => {
            actionButtons.classList.remove('d-print-none');
        }, 100);
    }
}

/**
 * Descargar PDF (simulación)
 */
function downloadPDF() {
    if (!invoiceOrder) {
        alert('No hay factura disponible para descargar');
        return;
    }
    
    // En una implementación real, aquí se generaría un PDF
    // usando una librería como jsPDF
    
    alert('Descargando factura en formato PDF...\n\nEsta es una simulación. En una implementación real se generaría un archivo PDF.');
    
    // Simulación de descarga
    setTimeout(() => {
        alert('¡Factura descargada exitosamente!');
    }, 1500);
}

/**
 * Mostrar notificación
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
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Hacer funciones disponibles globalmente
window.printInvoice = printInvoice;
window.downloadPDF = downloadPDF;