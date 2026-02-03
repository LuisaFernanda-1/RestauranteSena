// js/pedido-sync.js
class SincronizadorPedidos {
    constructor() {
        this.clavePedidos = 'pedidos_global';
    }
    
    agregarPedidoGlobal(pedidoData) {
        try {
            let pedidos = JSON.parse(localStorage.getItem(this.clavePedidos) || '[]');
            
            const nuevoPedido = {
                id: Date.now(),
                numero: `PED-${Date.now().toString().slice(-6)}`,
                mesa: pedidoData.table || pedidoData.mesa || 1,
                comensales: pedidoData.comensales || 1,
                estado: "pendiente",
                fecha: new Date().toISOString().split('T')[0],
                hora: new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'}),
                productos: this.convertirProductos(pedidoData.items || pedidoData.productos || []),
                subtotal: pedidoData.subtotal || 0,
                impuestos: pedidoData.impuestos || (pedidoData.subtotal * 0.19) || 0,
                total: pedidoData.total || 0,
                notas: pedidoData.specialNotes || pedidoData.notas || "",
                mesero: "Cliente Web",
                tiempo_creacion: new Date().toISOString(),
                tiempo_transcurrido: 0
            };
            
            pedidos.push(nuevoPedido);
            localStorage.setItem(this.clavePedidos, JSON.stringify(pedidos));
            
            console.log('✅ Pedido guardado para sincronización:', nuevoPedido.numero);
            this.mostrarNotificacion('Pedido enviado a cocina');
            
            return nuevoPedido;
        } catch (error) {
            console.error('Error al guardar pedido:', error);
            return null;
        }
    }
    
    convertirProductos(items) {
        // Convierte los items del carrito al formato del sistema administrativo
        return items.map(item => ({
            productoId: item.id,
            nombre: item.name,
            precio: item.price,
            cantidad: item.quantity,
            imagen: item.image || null
        }));
    }
    
    mostrarNotificacion(mensaje) {
        // Eliminar notificación anterior si existe
        const existingNotification = document.querySelector('.sync-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'sync-notification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #39a900 0%, #2d8400 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${mensaje}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.5s';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 3000);
    }
    
    obtenerPedidosPendientes() {
        try {
            return JSON.parse(localStorage.getItem(this.clavePedidos) || '[]');
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
            return [];
        }
    }
    
    limpiarPedidosProcesados() {
        localStorage.removeItem(this.clavePedidos);
    }
}

// Función global para guardar pedido desde carrito
function guardarPedidoParaAdmin(orderData) {
    const sincronizador = new SincronizadorPedidos();
    return sincronizador.agregarPedidoGlobal(orderData);
}

// Hacer disponible globalmente
window.SincronizadorPedidos = SincronizadorPedidos;
window.guardarPedidoParaAdmin = guardarPedidoParaAdmin;