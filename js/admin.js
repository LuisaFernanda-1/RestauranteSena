// js/admin.js - Script del panel de administración
// Sincronizado con datos reales de pedidos

// Clase para manejar datos del sistema
class SistemaRestaurante {
    constructor() {
        this.inicializarDatos();
        this.cargarDatos();
    }

    inicializarDatos() {
        // Verificar si es la primera vez
        if (!localStorage.getItem('sistema_inicializado')) {
            // Datos iniciales del sistema
            const datosIniciales = {
                productos: [
                    {
                        id: 1,
                        nombre: "Ensalada César",
                        categoria: "entradas",
                        descripcion: "Lechuga romana, crutones, parmesano y aderezo césar",
                        precio: 15000,
                        costo: 5000,
                        estado: "disponible",
                        imagen: "ensalada-cesar.jpg",
                        stock: 25,
                        stock_minimo: 5,
                        sku: "PROD-001",
                        fecha_creacion: new Date().toISOString(),
                        etiquetas: ["vegetariana", "entrada"],
                        ventas: 42
                    },
                    {
                        id: 2,
                        nombre: "Salmón a la Parrilla",
                        categoria: "principales",
                        descripcion: "Filete de salmón con vegetales asados y salsa de eneldo",
                        precio: 35000,
                        costo: 12000,
                        estado: "disponible",
                        imagen: "salmon.jpg",
                        stock: 3,
                        stock_minimo: 5,
                        sku: "PROD-002",
                        fecha_creacion: new Date().toISOString(),
                        etiquetas: ["pescado", "especial"],
                        ventas: 68
                    },
                    {
                        id: 3,
                        nombre: "Pasta Carbonara",
                        categoria: "principales",
                        descripcion: "Fettuccine con salsa cremosa de huevo, panceta y parmesano",
                        precio: 28000,
                        costo: 8000,
                        estado: "agotado",
                        imagen: "pasta-carbonara.jpg",
                        stock: 0,
                        stock_minimo: 5,
                        sku: "PROD-003",
                        fecha_creacion: new Date().toISOString(),
                        etiquetas: ["tradicional"],
                        ventas: 54
                    },
                    {
                        id: 4,
                        nombre: "Limonada Natural",
                        categoria: "bebidas",
                        descripcion: "Fresca limonada con hierbabuena y stevia",
                        precio: 6000,
                        costo: 1500,
                        estado: "disponible",
                        imagen: "limonada.jpg",
                        stock: 50,
                        stock_minimo: 10,
                        sku: "PROD-004",
                        fecha_creacion: new Date().toISOString(),
                        etiquetas: ["refrescante"],
                        ventas: 35
                    },
                    {
                        id: 5,
                        nombre: "Tiramisú",
                        categoria: "postres",
                        descripcion: "Postre italiano con capas de bizcocho, café y crema de mascarpone",
                        precio: 14000,
                        costo: 4000,
                        estado: "disponible",
                        imagen: "tiramisu.jpg",
                        stock: 15,
                        stock_minimo: 5,
                        sku: "PROD-005",
                        fecha_creacion: new Date().toISOString(),
                        etiquetas: ["postre", "italiano"],
                        ventas: 38
                    }
                ],
                pedidos: [],
                ventas: [],
                empleados: [
                    {
                        id: 1,
                        nombre: "Carlos Rodríguez",
                        cargo: "Chef",
                        telefono: "3001234567",
                        email: "carlos@restaurantesena.com",
                        estado: "activo",
                        horario: "Lun-Vie 8:00-17:00",
                        fecha_ingreso: "2024-01-15"
                    },
                    {
                        id: 2,
                        nombre: "Ana Gómez",
                        cargo: "Mesera",
                        telefono: "3007654321",
                        email: "ana@restaurantesena.com",
                        estado: "activo",
                        horario: "Mar-Sab 12:00-21:00",
                        fecha_ingreso: "2024-02-10"
                    }
                ],
                configuracion: {
                    nombre_restaurante: "Restaurante SENA",
                    direccion: "Calle 57 #8-69, Bogotá D.C.",
                    telefono: "+57 601 5461500",
                    email: "info@restaurantesena.com",
                    horario_apertura: "11:00",
                    horario_cierre: "22:00"
                }
            };

            localStorage.setItem('restaurante_productos', JSON.stringify(datosIniciales.productos));
            localStorage.setItem('restaurante_empleados', JSON.stringify(datosIniciales.empleados));
            localStorage.setItem('restaurante_config', JSON.stringify(datosIniciales.configuracion));
            localStorage.setItem('sistema_inicializado', 'true');

            console.log('Sistema inicializado con datos de ejemplo');
        }
    }

    cargarDatos() {
        this.productos = JSON.parse(localStorage.getItem('restaurante_productos') || '[]');
        this.pedidos = JSON.parse(localStorage.getItem('restaurante_pedidos') || '[]');
        this.ventas = JSON.parse(localStorage.getItem('restaurante_ventas') || '[]');
        this.empleados = JSON.parse(localStorage.getItem('restaurante_empleados') || '[]');
        this.configuracion = JSON.parse(localStorage.getItem('restaurante_config') || '{}');
    }

    guardarDatos() {
        localStorage.setItem('restaurante_productos', JSON.stringify(this.productos));
        localStorage.setItem('restaurante_pedidos', JSON.stringify(this.pedidos));
        localStorage.setItem('restaurante_ventas', JSON.stringify(this.ventas));
        localStorage.setItem('restaurante_empleados', JSON.stringify(this.empleados));
        localStorage.setItem('restaurante_config', JSON.stringify(this.configuracion));
    }

    // ==================== MÉTODOS PARA PEDIDOS ====================

    crearPedido(pedidoData) {
        const nuevoPedido = {
            id: Date.now(),
            numero: `PED-${Date.now().toString().slice(-6)}`,
            mesa: pedidoData.mesa || 1,
            comensales: pedidoData.comensales || 1,
            estado: "pendiente",
            fecha: new Date().toISOString().split('T')[0],
            hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            productos: pedidoData.productos || [],
            subtotal: pedidoData.subtotal || 0,
            impuestos: pedidoData.impuestos || 0,
            total: pedidoData.total || 0,
            notas: pedidoData.notas || "",
            mesero: pedidoData.mesero || "Sistema",
            tiempo_creacion: new Date().toISOString(),
            tiempo_transcurrido: 0
        };

        this.pedidos.unshift(nuevoPedido); // Agregar al principio
        this.guardarDatos();

        // Registrar la venta
        this.registrarVenta(nuevoPedido);

        // Actualizar estadísticas de productos vendidos
        this.actualizarVentasProductos(nuevoPedido.productos);

        return nuevoPedido;
    }

    registrarVenta(pedido) {
        const venta = {
            id: Date.now(),
            pedido_id: pedido.id,
            fecha: pedido.fecha,
            hora: pedido.hora,
            total: pedido.total,
            productos: pedido.productos.length,
            mesa: pedido.mesa,
            tipo: "restaurante"
        };

        this.ventas.push(venta);
        this.guardarDatos();
    }

    actualizarVentasProductos(productosPedido) {
        productosPedido.forEach(item => {
            const producto = this.productos.find(p => p.id === item.productoId);
            if (producto) {
                producto.ventas = (producto.ventas || 0) + item.cantidad;
                producto.stock = Math.max(0, producto.stock - item.cantidad);

                // Actualizar estado si stock bajo
                if (producto.stock <= producto.stock_minimo) {
                    producto.estado = producto.stock === 0 ? "agotado" : "stock_bajo";
                }
            }
        });
        this.guardarDatos();
    }

    actualizarEstadoPedido(pedidoId, nuevoEstado) {
        const pedido = this.pedidos.find(p => p.id === pedidoId);
        if (pedido) {
            pedido.estado = nuevoEstado;
            pedido.actualizado = new Date().toISOString();
            this.guardarDatos();
            return pedido;
        }
        return null;
    }

    eliminarPedido(pedidoId) {
        const index = this.pedidos.findIndex(p => p.id === pedidoId);
        if (index !== -1) {
            this.pedidos.splice(index, 1);
            this.guardarDatos();
            return true;
        }
        return false;
    }

    obtenerPedidos(filtros = {}) {
        let pedidosFiltrados = [...this.pedidos];

        if (filtros.estado && filtros.estado !== 'todos') {
            pedidosFiltrados = pedidosFiltrados.filter(p => p.estado === filtros.estado);
        }

        if (filtros.mesa && filtros.mesa !== 'todas') {
            pedidosFiltrados = pedidosFiltrados.filter(p => p.mesa == filtros.mesa);
        }

        if (filtros.fecha) {
            pedidosFiltrados = pedidosFiltrados.filter(p => p.fecha === filtros.fecha);
        }

        return pedidosFiltrados.reverse(); // Más recientes primero
    }

    // ==================== MÉTODOS PARA ESTADÍSTICAS ====================

    obtenerEstadisticasHoy() {
        const hoy = new Date().toISOString().split('T')[0];

        // Pedidos de hoy
        const pedidosHoy = this.pedidos.filter(p => p.fecha === hoy);
        const totalPedidos = pedidosHoy.length;

        // Ventas de hoy
        const ventasHoy = this.ventas.filter(v => v.fecha === hoy);
        const totalVentas = ventasHoy.reduce((sum, v) => sum + v.total, 0);

        // Pedidos por estado
        const pendientes = pedidosHoy.filter(p => p.estado === 'pendiente').length;
        const preparacion = pedidosHoy.filter(p => p.estado === 'preparacion').length;
        const listos = pedidosHoy.filter(p => p.estado === 'listo').length;

        // Productos activos
        const productosActivos = this.productos.filter(p => p.estado === 'disponible').length;
        const totalProductos = this.productos.length;

        // Mesas ocupadas (simulación)
        const mesasUnicas = [...new Set(pedidosHoy.filter(p =>
            ['pendiente', 'preparacion'].includes(p.estado)
        ).map(p => p.mesa))];
        const mesasOcupadas = mesasUnicas.length;

        // Productos más vendidos hoy
        const productosVendidosHoy = {};
        pedidosHoy.forEach(pedido => {
            pedido.productos.forEach(item => {
                if (!productosVendidosHoy[item.productoId]) {
                    productosVendidosHoy[item.productoId] = 0;
                }
                productosVendidosHoy[item.productoId] += item.cantidad;
            });
        });

        const topProductos = Object.entries(productosVendidosHoy)
            .map(([id, cantidad]) => {
                const producto = this.productos.find(p => p.id == id);
                return {
                    id: id,
                    nombre: producto?.nombre || 'Producto Desconocido',
                    cantidad: cantidad,
                    categoria: producto?.categoria || 'General'
                };
            })
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5);

        return {
            pedidosHoy: totalPedidos,
            ventasHoy: totalVentas,
            mesasOcupadas: mesasOcupadas,
            productosActivos: productosActivos,
            totalProductos: totalProductos,
            pedidosPendientes: pendientes,
            pedidosPreparacion: preparacion,
            pedidosListos: listos,
            topProductos: topProductos,
            porcentajeOcupacion: Math.round((mesasOcupadas / 20) * 100) // 20 mesas totales
        };
    }

    obtenerDatosVentas(dias = 7) {
        const datos = {};
        const hoy = new Date();

        // Inicializar últimos X días
        for (let i = dias - 1; i >= 0; i--) {
            const fecha = new Date(hoy);
            fecha.setDate(fecha.getDate() - i);
            const fechaStr = fecha.toISOString().split('T')[0];
            datos[fechaStr] = 0;
        }

        // Sumar ventas por día
        this.ventas.forEach(venta => {
            if (datos[venta.fecha] !== undefined) {
                datos[venta.fecha] += venta.total;
            }
        });

        return {
            labels: Object.keys(datos).map(fecha => {
                const d = new Date(fecha);
                return d.toLocaleDateString('es-ES', { weekday: 'short' });
            }),
            datos: Object.values(datos)
        };
    }

    obtenerActividadReciente(limite = 10) {
        const actividad = [];

        // Actividad de pedidos
        this.pedidos.slice(0, limite).forEach(pedido => {
            actividad.push({
                tipo: 'pedido',
                hora: pedido.hora,
                accion: `Pedido #${pedido.numero}`,
                usuario: pedido.mesero,
                detalles: `Mesa ${pedido.mesa} - $${pedido.total.toLocaleString()}`,
                estado: pedido.estado
            });
        });

        // Ordenar por hora (más reciente primero)
        return actividad.sort((a, b) => new Date(b.hora) - new Date(a.hora)).slice(0, limite);
    }

    // ==================== MÉTODOS PARA PRODUCTOS ====================

    agregarProducto(productoData) {
        const nuevoProducto = {
            id: Date.now(),
            ...productoData,
            fecha_creacion: new Date().toISOString(),
            ventas: 0,
            estado: productoData.stock > 0 ? 'disponible' : 'agotado'
        };

        this.productos.push(nuevoProducto);
        this.guardarDatos();
        return nuevoProducto;
    }

    actualizarProducto(id, datos) {
        const index = this.productos.findIndex(p => p.id === id);
        if (index !== -1) {
            this.productos[index] = { ...this.productos[index], ...datos };
            this.guardarDatos();
            return this.productos[index];
        }
        return null;
    }

    eliminarProducto(id) {
        const index = this.productos.findIndex(p => p.id === id);
        if (index !== -1) {
            this.productos.splice(index, 1);
            this.guardarDatos();
            return true;
        }
        return false;
    }

    obtenerProductos(filtros = {}) {
        let productos = [...this.productos];

        if (filtros.categoria && filtros.categoria !== 'todas') {
            productos = productos.filter(p => p.categoria === filtros.categoria);
        }

        if (filtros.estado && filtros.estado !== 'todos') {
            productos = productos.filter(p => p.estado === filtros.estado);
        }

        if (filtros.busqueda) {
            const busqueda = filtros.busqueda.toLowerCase();
            productos = productos.filter(p =>
                p.nombre.toLowerCase().includes(busqueda) ||
                p.descripcion.toLowerCase().includes(busqueda) ||
                p.sku.toLowerCase().includes(busqueda)
            );
        }

        if (filtros.stockBajo) {
            productos = productos.filter(p => p.stock <= p.stock_minimo);
        }

        return productos;
    }

    // ==================== MÉTODOS PARA INVENTARIO ====================

    obtenerProductosStockBajo() {
        return this.productos.filter(p => p.stock <= p.stock_minimo && p.stock > 0);
    }

    obtenerProductosAgotados() {
        return this.productos.filter(p => p.stock === 0);
    }

    obtenerValorInventario() {
        return this.productos.reduce((total, producto) => {
            return total + (producto.costo * producto.stock);
        }, 0);
    }

    // ==================== MÉTODOS PARA EMPLEADOS ====================

    obtenerEstadisticasEmpleados() {
        const chefs = this.empleados.filter(e => e.cargo.toLowerCase().includes('chef'));
        const meseros = this.empleados.filter(e => e.cargo.toLowerCase().includes('meser'));
        const administrativos = this.empleados.filter(e =>
            !e.cargo.toLowerCase().includes('chef') &&
            !e.cargo.toLowerCase().includes('meser')
        );

        return {
            total: this.empleados.length,
            chefs: chefs.length,
            meseros: meseros.length,
            administrativos: administrativos.length,
            activos: this.empleados.filter(e => e.estado === 'activo').length
        };
    }
}

// ==================== FUNCIONES GLOBALES ====================

let sistema;

function inicializarSistema() {
    sistema = new SistemaRestaurante();
    window.sistema = sistema;

    // Verificar si hay pedidos nuevos desde otras páginas
    sincronizarPedidosExternos();

    return sistema;
}

function sincronizarPedidosExternos() {
    // Buscar pedidos en localStorage global
    const pedidosRaw = localStorage.getItem('pedidos_global');
    if (!pedidosRaw) return 0;
    
    let pedidosGlobales = [];
    try {
        const parsed = JSON.parse(pedidosRaw);
        // Manejar si es un solo pedido o un array
        if (Array.isArray(parsed)) {
            pedidosGlobales = parsed;
        } else if (parsed && typeof parsed === 'object') {
            pedidosGlobales = [parsed]; // Convertir a array si es un solo objeto
        }
    } catch (e) {
        console.error('Error parsing pedidos_global:', e);
        return 0;
    }
    
    if (pedidosGlobales.length === 0) return 0;
    
    let nuevos = 0;
    pedidosGlobales.forEach(pedidoGlobal => {
        const existe = sistema.pedidos.some(p => p.id === pedidoGlobal.id);
        if (!existe) {
            // Formatear correctamente el pedido para el sistema
            const pedidoFormateado = {
                id: pedidoGlobal.id,
                numero: pedidoGlobal.numero || `PED-${pedidoGlobal.id.toString().slice(-6)}`,
                mesa: pedidoGlobal.table || pedidoGlobal.mesa || 1,
                comensales: pedidoGlobal.comensales || 1,
                estado: "pendiente",
                fecha: pedidoGlobal.date ? pedidoGlobal.date.split('T')[0] : new Date().toISOString().split('T')[0],
                hora: pedidoGlobal.time || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                productos: pedidoGlobal.productos || pedidoGlobal.items || [],
                subtotal: pedidoGlobal.subtotal || 0,
                impuestos: pedidoGlobal.impuestos || (pedidoGlobal.subtotal * 0.19) || 0,
                total: pedidoGlobal.total || 0,
                notas: pedidoGlobal.specialNotes || pedidoGlobal.notas || "",
                mesero: pedidoGlobal.mesero || "Cliente Web",
                tiempo_creacion: new Date(pedidoGlobal.timestamp || Date.now()).toISOString(),
                tiempo_transcurrido: 0
            };
            
            sistema.pedidos.unshift(pedidoFormateado);
            nuevos++;
            
            // Registrar venta
            sistema.registrarVenta(pedidoFormateado);
            
            // Actualizar stock si es necesario
            if (pedidoFormateado.productos && pedidoFormateado.productos.length > 0) {
                sistema.actualizarVentasProductos(pedidoFormateado.productos);
            }
        }
    });
    
    if (nuevos > 0) {
        sistema.guardarDatos();
        localStorage.removeItem('pedidos_global');
        
        // Notificar
        showNotification(`${nuevos} nuevo(s) pedido(s) sincronizado(s)`, 'success');
        
        // Actualizar vistas si están activas
        if (document.querySelector('.tab-pane.active#dashboard') || 
            document.querySelector('.tab-pane.active#pedidos')) {
            actualizarDashboard();
            loadOrders();
        }
        
        return nuevos;
    }
    return 0;
}

// ==================== FUNCIONES DE INTERFAZ ====================

function actualizarDashboard() {
    if (!sistema) return;

    const stats = sistema.obtenerEstadisticasHoy();

    // Actualizar tarjetas
    document.getElementById('statPedidosHoy').textContent = stats.pedidosHoy;
    document.getElementById('statVentasHoy').textContent = `$${Math.round(stats.ventasHoy / 1000)}K`;
    document.getElementById('statMesasOcupadas').textContent = `${stats.mesasOcupadas}/20`;
    document.getElementById('statProductosActivos').textContent = stats.productosActivos;
    document.getElementById('totalProductos').textContent = stats.totalProductos;

    // Actualizar progreso
    document.getElementById('pedidosProgress').style.width = `${Math.min((stats.pedidosHoy / 60) * 100, 100)}%`;
    document.getElementById('ventasProgress').style.width = `${Math.min((stats.ventasHoy / 3000000) * 100, 100)}%`;
    document.getElementById('mesasProgress').style.width = `${stats.porcentajeOcupacion}%`;
    document.getElementById('productosProgress').style.width = `${Math.min((stats.productosActivos / stats.totalProductos) * 100, 100)}%`;

    // Actualizar cambios
    document.getElementById('pedidosChange').innerHTML = `<i class="fas fa-arrow-up me-1"></i> ${stats.pedidosHoy} hoy`;
    document.getElementById('ventasChange').innerHTML = `<i class="fas fa-arrow-up me-1"></i> $${Math.round(stats.ventasHoy / 1000)}K`;
    document.getElementById('mesasChange').innerHTML = `<i class="fas fa-users"></i> ${stats.porcentajeOcupacion}%`;
    document.getElementById('productosChange').innerHTML = `<i class="fas fa-tags"></i> ${stats.productosActivos} activos`;

    // Actualizar top productos
    const topProductsList = document.getElementById('topProductsList');
    if (topProductsList) {
        if (stats.topProductos.length > 0) {
            topProductsList.innerHTML = stats.topProductos.map((producto, index) => `
                <div class="list-group-item px-3 py-3 d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <span class="badge ${index === 0 ? 'bg-primary' : 'bg-secondary'} rounded-circle me-3 d-flex align-items-center justify-content-center" 
                              style="width: 30px; height: 30px;">${index + 1}</span>
                        <div>
                            <strong>${producto.nombre}</strong>
                            <br>
                            <small class="text-muted">${producto.categoria || 'General'}</small>
                        </div>
                    </div>
                    <span class="badge bg-success">${producto.cantidad} uds</span>
                </div>
            `).join('');
        } else {
            topProductsList.innerHTML = `
                <div class="list-group-item px-3 py-3 text-center">
                    <i class="fas fa-clipboard-list text-muted fa-2x mb-2"></i>
                    <p class="mb-0 text-muted">No hay ventas hoy</p>
                </div>
            `;
        }
    }

    // Actualizar actividad reciente
    const actividad = sistema.obtenerActividadReciente(5);
    const activityTableBody = document.getElementById('activityTableBody');
    if (activityTableBody) {
        if (actividad.length > 0) {
            activityTableBody.innerHTML = actividad.map(item => `
                <tr>
                    <td><small>${item.hora}</small></td>
                    <td>${item.accion}</td>
                    <td>${item.usuario}</td>
                    <td>${item.detalles}</td>
                    <td>
                        <span class="badge ${obtenerClaseEstado(item.estado)}">
                            ${traducirEstado(item.estado)}
                        </span>
                    </td>
                </tr>
            `).join('');
        } else {
            activityTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4">
                        <i class="fas fa-history text-muted fa-2x mb-2"></i>
                        <p class="text-muted mb-0">No hay actividad reciente</p>
                    </td>
                </tr>
            `;
        }
    }

    // Actualizar gráfico de ventas
    actualizarGraficoVentas();

    // Actualizar contadores en sidebar
    actualizarSidebarStats(stats);
}

function actualizarGraficoVentas() {
    const ventasData = sistema.obtenerDatosVentas(7);
    const ctx = document.getElementById('salesChart');

    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (window.ventasChart) {
        window.ventasChart.destroy();
    }

    window.ventasChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ventasData.labels,
            datasets: [{
                label: 'Ventas ($)',
                data: ventasData.datos,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#28a745',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Ventas: $${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            if (value >= 1000000) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            } else if (value >= 1000) {
                                return '$' + (value / 1000).toFixed(0) + 'K';
                            }
                            return '$' + value;
                        }
                    },
                    grid: {
                        color: 'rgba(40, 167, 69, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(40, 167, 69, 0.1)'
                    }
                }
            }
        }
    });
}

function actualizarSidebarStats(stats) {
    // Actualizar badge de pedidos
    document.getElementById('pedidosBadge').textContent = stats.pedidosPendientes;

    // Actualizar contadores
    document.getElementById('pendingOrdersCount').textContent = stats.pedidosPendientes;
    document.getElementById('lowStockCount').textContent = sistema.obtenerProductosStockBajo().length;

    // Actualizar hora
    const ahora = new Date();
    document.getElementById('lastUpdate').textContent =
        `Última actualización: ${ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
}

function loadOrders() {
    if (!sistema) return;

    const estado = document.getElementById('filterEstado')?.value || 'todos';
    const mesa = document.getElementById('filterMesa')?.value || 'todas';
    const fecha = document.getElementById('filterFecha')?.value || new Date().toISOString().split('T')[0];

    const pedidos = sistema.obtenerPedidos({
        estado: estado,
        mesa: mesa,
        fecha: fecha
    });

    const container = document.getElementById('pedidosContainer');
    const noOrdersMessage = document.getElementById('noOrdersMessage');

    if (!container) return;

    // Actualizar estadísticas rápidas
    const stats = sistema.obtenerEstadisticasHoy();
    document.getElementById('statsPendientes').textContent = stats.pedidosPendientes;
    document.getElementById('statsPreparacion').textContent = stats.pedidosPreparacion;
    document.getElementById('statsListos').textContent = stats.pedidosListos;
    document.getElementById('statsEntregados').textContent = sistema.pedidos.filter(p =>
        p.estado === 'entregado' && p.fecha === new Date().toISOString().split('T')[0]
    ).length;

    if (pedidos.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="card border-0 shadow-sm">
                    <div class="card-body text-center py-5">
                        <i class="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                        <h5 class="text-muted">No hay pedidos activos</h5>
                        <p class="text-muted">No se encontraron pedidos con los filtros aplicados</p>
                        <button class="btn btn-primary mt-2" onclick="simularNuevoPedido()">
                            <i class="fas fa-plus me-1"></i> Simular Primer Pedido
                        </button>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = pedidos.map(pedido => crearTarjetaPedido(pedido)).join('');
}

function crearTarjetaPedido(pedido) {
    const configEstado = {
        'pendiente': { clase: 'danger', texto: 'Pendiente', icono: 'fa-clock' },
        'preparacion': { clase: 'warning', texto: 'En Preparación', icono: 'fa-utensils' },
        'listo': { clase: 'success', texto: 'Listo', icono: 'fa-check-circle' },
        'entregado': { clase: 'success', texto: 'Entregado', icono: 'fa-box' },
        'cancelado': { clase: 'secondary', texto: 'Cancelado', icono: 'fa-times-circle' }
    }[pedido.estado] || { clase: 'secondary', texto: 'Desconocido', icono: 'fa-question' };

    // Calcular tiempo transcurrido
    const creado = new Date(pedido.tiempo_creacion);
    const ahora = new Date();
    const minutos = Math.floor((ahora - creado) / (1000 * 60));

    return `
        <div class="col-lg-6">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-${configEstado.clase} bg-opacity-10 border-0">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0 fw-bold">${pedido.numero}</h6>
                            <small class="text-muted">
                                <i class="fas fa-clock me-1"></i>${pedido.hora} - Hace ${minutos} min
                            </small>
                        </div>
                        <span class="badge bg-${configEstado.clase}">
                            <i class="fas ${configEstado.icono} me-1"></i>${configEstado.texto}
                        </span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <i class="fas fa-table text-primary fs-4 me-2"></i>
                        <strong>Mesa #${pedido.mesa}</strong>
                        <span class="ms-auto text-muted">${pedido.comensales} comensales</span>
                    </div>
                    <hr>
                    <div class="mb-2">
                        <small class="text-muted">Productos:</small>
                        <ul class="list-unstyled mb-0 mt-2">
                            ${(pedido.productos || []).map(item => {
        const producto = sistema.productos.find(p => p.id == item.productoId);
        const subtotal = (item.precio || 0) * (item.cantidad || 0);
        return `
                                    <li class="mb-1">
                                        <i class="fas fa-dot-circle text-primary" style="font-size: 0.5rem;"></i>
                                        ${item.cantidad}x ${producto?.nombre || 'Producto'}
                                        <small class="text-muted">($${subtotal.toLocaleString()})</small>
                                    </li>
                                `;
    }).join('')}
                        </ul>
                        ${pedido.notas ? `
                            <div class="mt-2">
                                <small class="text-muted">Notas:</small>
                                <p class="mb-0 small">${pedido.notas}</p>
                            </div>
                        ` : ''}
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <strong>Total:</strong>
                        <strong class="text-primary fs-5">$${(pedido.total || 0).toLocaleString()}</strong>
                    </div>
                    <div class="d-grid gap-2">
                        ${pedido.estado === 'pendiente' ? `
                            <button class="btn btn-primary btn-sm" onclick="cambiarEstadoPedido(${pedido.id}, 'preparacion')">
                                <i class="fas fa-play-circle me-1"></i>Iniciar Preparación
                            </button>
                        ` : pedido.estado === 'preparacion' ? `
                            <button class="btn btn-primary btn-sm" onclick="cambiarEstadoPedido(${pedido.id}, 'listo')">
                                <i class="fas fa-check-circle me-1"></i>Marcar como Listo
                            </button>
                        ` : pedido.estado === 'listo' ? `
                            <button class="btn btn-primary btn-sm" onclick="cambiarEstadoPedido(${pedido.id}, 'entregado')">
                                <i class="fas fa-box me-1"></i>Marcar como Entregado
                            </button>
                        ` : ''}
                        <button class="btn btn-outline-primary btn-sm" onclick="verDetallesPedido(${pedido.id})">
                            <i class="fas fa-eye me-1"></i>Ver Detalles
                        </button>
                        ${pedido.estado !== 'entregado' && pedido.estado !== 'cancelado' ? `
                            <button class="btn btn-outline-danger btn-sm" onclick="cancelarPedido(${pedido.id})">
                                <i class="fas fa-times me-1"></i>Cancelar
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function cambiarEstadoPedido(pedidoId, nuevoEstado) {
    if (!sistema) return;

    const pedido = sistema.actualizarEstadoPedido(pedidoId, nuevoEstado);
    if (pedido) {
        showNotification(`Pedido ${pedido.numero} actualizado a: ${traducirEstado(nuevoEstado)}`, 'success');
        loadOrders();
        actualizarDashboard();
    }
}

function cancelarPedido(pedidoId) {
    if (confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
        cambiarEstadoPedido(pedidoId, 'cancelado');
    }
}

function verDetallesPedido(pedidoId) {
    const pedido = sistema.pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;

    const modalContent = `
        <h5 class="mb-3">Detalles del Pedido</h5>
        <div class="row">
            <div class="col-md-6">
                <p><strong>Número:</strong> ${pedido.numero}</p>
                <p><strong>Mesa:</strong> #${pedido.mesa}</p>
                <p><strong>Comensales:</strong> ${pedido.comensales}</p>
                <p><strong>Mesero:</strong> ${pedido.mesero}</p>
            </div>
            <div class="col-md-6">
                <p><strong>Fecha:</strong> ${pedido.fecha}</p>
                <p><strong>Hora:</strong> ${pedido.hora}</p>
                <p><strong>Estado:</strong> <span class="badge ${obtenerClaseEstado(pedido.estado)}">${traducirEstado(pedido.estado)}</span></p>
            </div>
        </div>
        
        <hr>
        
        <h6 class="mb-3">Productos:</h6>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th class="text-center">Cantidad</th>
                        <th class="text-end">Precio Unitario</th>
                        <th class="text-end">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${(pedido.productos || []).map(item => {
        const producto = sistema.productos.find(p => p.id == item.productoId);
        const subtotal = (item.precio || 0) * (item.cantidad || 0);
        return `
                            <tr>
                                <td>${producto?.nombre || 'Producto'}</td>
                                <td class="text-center">${item.cantidad}</td>
                                <td class="text-end">$${item.precio.toLocaleString()}</td>
                                <td class="text-end">$${subtotal.toLocaleString()}</td>
                            </tr>
                        `;
    }).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" class="text-end"><strong>Subtotal:</strong></td>
                        <td class="text-end"><strong>$${pedido.subtotal.toLocaleString()}</strong></td>
                    </tr>
                    <tr>
                        <td colspan="3" class="text-end"><strong>Impuestos:</strong></td>
                        <td class="text-end"><strong>$${pedido.impuestos.toLocaleString()}</strong></td>
                    </tr>
                    <tr class="table-active">
                        <td colspan="3" class="text-end"><strong>TOTAL:</strong></td>
                        <td class="text-end"><strong class="text-primary">$${pedido.total.toLocaleString()}</strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>
        
        ${pedido.notas ? `
            <hr>
            <h6 class="mb-2">Notas:</h6>
            <p class="bg-light p-3 rounded">${pedido.notas}</p>
        ` : ''}
    `;

    document.getElementById('orderDetailsContent').innerHTML = modalContent;

    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    modal.show();
}

function simularNuevoPedido() {
    if (!sistema) return;

    const productosDisponibles = sistema.productos.filter(p => p.estado === 'disponible');
    if (productosDisponibles.length === 0) {
        showNotification('No hay productos disponibles para crear pedido', 'warning');
        return;
    }

    // Seleccionar 1-3 productos aleatorios
    const numProductos = Math.floor(Math.random() * 3) + 1;
    const productosSeleccionados = [];
    let subtotal = 0;

    for (let i = 0; i < numProductos; i++) {
        const producto = productosDisponibles[Math.floor(Math.random() * productosDisponibles.length)];
        const cantidad = Math.floor(Math.random() * 3) + 1;

        productosSeleccionados.push({
            productoId: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: cantidad
        });

        subtotal += producto.precio * cantidad;
    }

    const impuestos = subtotal * 0.19;
    const total = subtotal + impuestos;

    const nuevoPedido = {
        mesa: Math.floor(Math.random() * 10) + 1,
        comensales: Math.floor(Math.random() * 4) + 1,
        productos: productosSeleccionados,
        subtotal: subtotal,
        impuestos: impuestos,
        total: total,
        notas: "Pedido de prueba generado automáticamente",
        mesero: "Sistema"
    };

    sistema.crearPedido(nuevoPedido);

    showNotification(`Pedido ${sistema.pedidos[0]?.numero || 'nuevo'} creado. Total: $${total.toLocaleString()}`, 'success');

    // Actualizar vista
    actualizarDashboard();
    loadOrders();
}

function refreshOrders() {
    loadOrders();
    showNotification('Pedidos actualizados', 'success');
}

function filterOrders() {
    loadOrders();
}

// ==================== FUNCIONES PARA GESTIÓN DE MENÚ ====================

function loadProducts() {
    if (!sistema) return;

    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    // Obtener filtros
    const searchTerm = document.getElementById('searchProduct')?.value?.toLowerCase() || '';
    const categoryFilter = document.getElementById('filterCategory')?.value || 'todas';
    const statusFilter = document.getElementById('filterStatus')?.value || 'todos';

    // Filtrar productos
    let productos = sistema.productos;

    if (searchTerm) {
        productos = productos.filter(p =>
            p.nombre.toLowerCase().includes(searchTerm) ||
            p.sku?.toLowerCase().includes(searchTerm) ||
            p.descripcion?.toLowerCase().includes(searchTerm)
        );
    }

    if (categoryFilter !== 'todas') {
        productos = productos.filter(p => p.categoria === categoryFilter);
    }

    if (statusFilter !== 'todos') {
        productos = productos.filter(p => p.estado === statusFilter);
    }

    if (productos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5">
                    <i class="fas fa-utensils fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No se encontraron productos</h5>
                    <p class="text-muted">Intenta con otros términos de búsqueda</p>
                    <button class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#addProductModal">
                        <i class="fas fa-plus me-1"></i> Agregar Producto
                    </button>
                </td>
            </tr>
        `;
        return;
    }

    // Renderizar productos
    tbody.innerHTML = productos.map(producto => {
        // Determinar color del estado
        let estadoColor = 'success';
        let estadoTexto = 'Disponible';

        if (producto.estado === 'agotado') {
            estadoColor = 'danger';
            estadoTexto = 'Agotado';
        } else if (producto.estado === 'stock_bajo') {
            estadoColor = 'warning';
            estadoTexto = 'Stock Bajo';
        } else if (producto.estado === 'descontinuado') {
            estadoColor = 'secondary';
            estadoTexto = 'Descontinuado';
        }

        // Formatear categoría
        const categorias = {
            'entradas': 'Entradas',
            'principales': 'Platos Principales',
            'bebidas': 'Bebidas',
            'postres': 'Postres',
            'especiales': 'Especiales'
        };

        return `
            <tr>
                <td>
                    <div class="product-image-small" style="width: 60px; height: 60px; background-color: #f8f9fa; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <i class="fas fa-utensils text-muted"></i>
                    </div>
                </td>
                <td>
                    <strong class="d-block">${producto.nombre}</strong>
                    <small class="text-muted d-block">${producto.descripcion?.substring(0, 50) || 'Sin descripción'}...</small>
                    <small class="text-muted">SKU: ${producto.sku || 'N/A'}</small>
                </td>
                <td>
                    <span class="badge bg-primary">${categorias[producto.categoria] || producto.categoria}</span>
                </td>
                <td>
                    <strong>$${producto.precio.toLocaleString()}</strong>
                    <br>
                    <small class="text-muted">Costo: $${producto.costo?.toLocaleString() || '0'}</small>
                </td>
                <td>
                    <span class="badge bg-${estadoColor}">
                        ${estadoTexto}
                    </span>
                    <br>
                    <small class="text-muted">
                        Stock: ${producto.stock || 0} 
                        ${producto.stock_minimo ? `<br>Mín: ${producto.stock_minimo}` : ''}
                    </small>
                </td>
                <td class="text-center">
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-primary" onclick="editarProducto(${producto.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="verDetallesProducto(${producto.id})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="actualizarStock(${producto.id})" title="Actualizar stock">
                            <i class="fas fa-box"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="eliminarProducto(${producto.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function filterProducts() {
    loadProducts();
}

function editarProducto(id) {
    const producto = sistema.productos.find(p => p.id == id);
    if (!producto) {
        showNotification('Producto no encontrado', 'error');
        return;
    }

    // Llenar formulario de edición
    document.getElementById('productName').value = producto.nombre;
    document.getElementById('productCategory').value = producto.categoria;
    document.getElementById('productPrice').value = producto.precio;
    document.getElementById('productDescription').value = producto.descripcion || '';
    document.getElementById('productStatus').value = producto.estado;

    // Mostrar modal de edición
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();

    // Cambiar título del modal
    document.getElementById('addProductModalLabel').innerHTML = `
        <i class="fas fa-edit me-2"></i>Editar Producto
    `;

    // Configurar botón para guardar cambios
    const saveBtn = document.getElementById('saveProductBtn');
    saveBtn.innerHTML = '<i class="fas fa-save me-1"></i>Guardar Cambios';
    saveBtn.onclick = function () {
        guardarProductoEditado(id);
    };
}

function guardarProductoEditado(id) {
    const nombre = document.getElementById('productName').value;
    const categoria = document.getElementById('productCategory').value;
    const precio = parseFloat(document.getElementById('productPrice').value);
    const descripcion = document.getElementById('productDescription').value;
    const estado = document.getElementById('productStatus').value;

    const datosActualizados = {
        nombre: nombre,
        categoria: categoria,
        precio: precio,
        descripcion: descripcion,
        estado: estado
    };

    const productoActualizado = sistema.actualizarProducto(id, datosActualizados);

    if (productoActualizado) {
        showNotification('Producto actualizado exitosamente', 'success');
        loadProducts();
        loadLowStockProducts();

        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal.hide();

        // Restaurar botón original
        const saveBtn = document.getElementById('saveProductBtn');
        saveBtn.innerHTML = '<i class="fas fa-save me-1"></i>Guardar Producto';
        saveBtn.onclick = null;
        document.getElementById('addProductModalLabel').innerHTML = `
            <i class="fas fa-plus-circle me-2"></i>Agregar Nuevo Producto
        `;
    } else {
        showNotification('Error al actualizar el producto', 'error');
    }
}

function verDetallesProducto(id) {
    const producto = sistema.productos.find(p => p.id == id);
    if (!producto) {
        showNotification('Producto no encontrado', 'error');
        return;
    }

    // Crear contenido del modal
    const categorias = {
        'entradas': 'Entradas',
        'principales': 'Platos Principales',
        'bebidas': 'Bebidas',
        'postres': 'Postres',
        'especiales': 'Especiales'
    };

    let estadoColor = 'success';
    if (producto.estado === 'agotado') estadoColor = 'danger';
    else if (producto.estado === 'stock_bajo') estadoColor = 'warning';
    else if (producto.estado === 'descontinuado') estadoColor = 'secondary';

    const modalContent = `
        <h5 class="mb-4">Detalles del Producto</h5>
        <div class="row">
            <div class="col-md-6">
                <p><strong>Nombre:</strong> ${producto.nombre}</p>
                <p><strong>Categoría:</strong> ${categorias[producto.categoria] || producto.categoria}</p>
                <p><strong>SKU:</strong> ${producto.sku || 'N/A'}</p>
                <p><strong>Precio:</strong> $${producto.precio.toLocaleString()}</p>
                <p><strong>Costo:</strong> $${producto.costo?.toLocaleString() || '0'}</p>
            </div>
            <div class="col-md-6">
                <p><strong>Estado:</strong> <span class="badge bg-${estadoColor}">${producto.estado}</span></p>
                <p><strong>Stock actual:</strong> ${producto.stock || 0}</p>
                <p><strong>Stock mínimo:</strong> ${producto.stock_minimo || 5}</p>
                <p><strong>Ventas totales:</strong> ${producto.ventas || 0}</p>
                <p><strong>Creado:</strong> ${new Date(producto.fecha_creacion).toLocaleDateString()}</p>
            </div>
        </div>
        <div class="mt-3">
            <p><strong>Descripción:</strong></p>
            <p class="bg-light p-3 rounded">${producto.descripcion || 'Sin descripción'}</p>
        </div>
        ${producto.etiquetas && producto.etiquetas.length > 0 ? `
            <div class="mt-3">
                <p><strong>Etiquetas:</strong></p>
                <div class="d-flex flex-wrap gap-1">
                    ${producto.etiquetas.map(etiqueta => `
                        <span class="badge bg-secondary">${etiqueta}</span>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;

    // Crear modal dinámico
    const modalElement = document.createElement('div');
    modalElement.className = 'modal fade';
    modalElement.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-info-circle me-2"></i>Detalles del Producto
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ${modalContent}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" onclick="editarProducto(${id})">
                        <i class="fas fa-edit me-1"></i>Editar
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalElement);
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Limpiar el modal después de cerrar
    modalElement.addEventListener('hidden.bs.modal', function () {
        document.body.removeChild(modalElement);
    });
}

function actualizarStock(id) {
    const producto = sistema.productos.find(p => p.id == id);
    if (!producto) return;

    const nuevoStock = prompt(`Ingrese el nuevo stock para "${producto.nombre}":`, producto.stock);

    if (nuevoStock !== null && !isNaN(nuevoStock)) {
        const stockNum = parseInt(nuevoStock);
        sistema.actualizarProducto(id, {
            stock: stockNum,
            estado: stockNum > 0 ? 'disponible' : 'agotado'
        });
        showNotification(`Stock actualizado a ${stockNum} unidades`, 'success');
        loadProducts();
        loadLowStockProducts();
    }
}

function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        const eliminado = sistema.eliminarProducto(id);
        if (eliminado) {
            showNotification('Producto eliminado exitosamente', 'success');
            loadProducts();
            loadLowStockProducts();
        } else {
            showNotification('Error al eliminar el producto', 'error');
        }
    }
}

// ==================== FUNCIONES PARA INVENTARIO ====================

function loadLowStockProducts() {
    if (!sistema) return;

    const productosBajos = sistema.obtenerProductosStockBajo();
    const productosAgotados = sistema.obtenerProductosAgotados();
    const todosProductos = [...productosBajos, ...productosAgotados];

    const tbody = document.getElementById('lowStockTableBody');
    const lowStockAlert = document.getElementById('lowStockAlert');
    const lowStockMessage = document.getElementById('lowStockMessage');

    if (!tbody) return;

    if (todosProductos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <i class="fas fa-check-circle text-success fa-2x mb-2"></i>
                    <p class="text-muted mb-0">Todos los productos tienen stock suficiente</p>
                </td>
            </tr>
        `;

        if (lowStockAlert && lowStockMessage) {
            lowStockMessage.innerHTML = 'Todos los productos tienen stock suficiente';
            lowStockAlert.className = 'alert alert-success';
        }
    } else {
        tbody.innerHTML = todosProductos.map(producto => {
            let estadoColor = 'warning';
            let estadoTexto = 'Stock Bajo';

            if (producto.stock === 0) {
                estadoColor = 'danger';
                estadoTexto = 'Agotado';
            } else if (producto.stock < 3) {
                estadoColor = 'danger';
                estadoTexto = 'Crítico';
            }

            return `
                <tr>
                    <td>
                        <strong>${producto.nombre}</strong>
                        <br>
                        <small class="text-muted">${producto.sku || 'N/A'}</small>
                    </td>
                    <td>
                        <span class="badge bg-${estadoColor}">
                            ${producto.stock} unidades
                        </span>
                    </td>
                    <td>${producto.stock_minimo || 5} unidades</td>
                    <td>
                        <span class="badge bg-${estadoColor}">
                            ${estadoTexto}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="actualizarStock(${producto.id})">
                            <i class="fas fa-plus me-1"></i> Reponer
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        if (lowStockAlert && lowStockMessage) {
            const totalBajos = productosBajos.length;
            const totalAgotados = productosAgotados.length;
            let mensaje = '';

            if (totalAgotados > 0 && totalBajos > 0) {
                mensaje = `${totalAgotados} productos agotados y ${totalBajos} con stock bajo`;
            } else if (totalAgotados > 0) {
                mensaje = `${totalAgotados} productos agotados`;
            } else {
                mensaje = `${totalBajos} productos con stock bajo`;
            }

            lowStockMessage.innerHTML = `${mensaje} requieren atención inmediata`;
            lowStockAlert.className = 'alert alert-warning';
        }
    }
}

// ==================== FUNCIONES DE UTILIDAD ====================

function obtenerClaseEstado(estado) {
    const clases = {
        'pendiente': 'bg-danger',
        'preparacion': 'bg-warning',
        'listo': 'bg-success',
        'entregado': 'bg-success', // Cambiado de bg-info a bg-success para verde
        'cancelado': 'bg-secondary'
    };
    return clases[estado] || 'bg-secondary';
}

function traducirEstado(estado) {
    const traducciones = {
        'pendiente': 'Pendiente',
        'preparacion': 'En Preparación',
        'listo': 'Listo',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado'
    };
    return traducciones[estado] || estado;
}

function showNotification(mensaje, tipo = 'info') {
    // Eliminar notificación anterior si existe
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `custom-notification alert alert-${tipo} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease-out;
    `;

    const iconos = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };

    notification.innerHTML = `
        <i class="fas ${iconos[tipo] || 'fa-info-circle'} me-2"></i>
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ==================== FUNCIONES DE DEMOSTRACIÓN ====================

function exportData() {
    showNotification('Datos exportados exitosamente', 'success');
}

function showTodaySummary() {
    if (!sistema) return;

    const stats = sistema.obtenerEstadisticasHoy();
    alert(`Resumen del día:\n\n• Pedidos hoy: ${stats.pedidosHoy}\n• Ventas: $${stats.ventasHoy.toLocaleString()}\n• Mesas ocupadas: ${stats.mesasOcupadas}/20\n• Productos activos: ${stats.productosActivos}\n\n¡Excelente trabajo!`);
}

function exportMenu() {
    showNotification('Menú exportado exitosamente', 'success');
}

function exportInventory() {
    showNotification('Inventario exportado exitosamente', 'success');
}

function generateInventoryReport() {
    showNotification('Reporte de inventario generado', 'success');
}

function generateReport(tipo) {
    showNotification(`Reporte ${tipo} generado exitosamente`, 'success');
}

function customReport() {
    alert('Configuración de reporte personalizado\n\n(Esta funcionalidad se implementaría completamente en un sistema real)');
}

function printOrder() {
    window.print();
}

// ==================== INICIALIZACIÓN ====================

document.addEventListener('DOMContentLoaded', function () {
    // Inicializar sistema
    sistema = inicializarSistema();

    // Configurar eventos de filtros para productos
    const searchProductInput = document.getElementById('searchProduct');
    if (searchProductInput) {
        let searchTimeout;
        searchProductInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                loadProducts();
            }, 500);
        });
    }

    const filterCategory = document.getElementById('filterCategory');
    if (filterCategory) {
        filterCategory.addEventListener('change', loadProducts);
    }

    const filterStatus = document.getElementById('filterStatus');
    if (filterStatus) {
        filterStatus.addEventListener('change', loadProducts);
    }

    // Configurar filtro de fecha por defecto a hoy
    const fechaInput = document.getElementById('filterFecha');
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.value = today;
    }

    // Manejar cambio de pestañas
    const tabLinks = document.querySelectorAll('[data-bs-toggle="pill"]');
    tabLinks.forEach(link => {
        link.addEventListener('shown.bs.tab', function (e) {
            const activeTab = e.target.getAttribute('href').substring(1);

            // Cargar datos específicos de la pestaña
            setTimeout(() => {
                if (sistema) {
                    if (activeTab === 'menu') {
                        loadProducts();
                    } else if (activeTab === 'pedidos') {
                        loadOrders();
                    } else if (activeTab === 'inventario') {
                        loadLowStockProducts();
                    } else if (activeTab === 'dashboard') {
                        actualizarDashboard();
                    }
                }
            }, 100);
        });
    });

    // Configurar formulario de nuevo producto
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre = document.getElementById('productName').value;
            const categoria = document.getElementById('productCategory').value;
            const precio = parseFloat(document.getElementById('productPrice').value);
            const descripcion = document.getElementById('productDescription').value;
            const estado = document.getElementById('productStatus').value;

            if (!nombre || !categoria || !precio) {
                showNotification('Por favor complete todos los campos requeridos', 'error');
                return;
            }

            const nuevoProducto = {
                nombre: nombre,
                categoria: categoria,
                descripcion: descripcion,
                precio: precio,
                costo: Math.round(precio * 0.3), // 30% del precio como costo
                estado: estado,
                stock: estado === 'disponible' ? 10 : 0,
                stock_minimo: 5,
                sku: `PROD-${Date.now().toString().slice(-6)}`,
                imagen: `${categoria}.jpg`,
                etiquetas: [categoria]
            };

            sistema.agregarProducto(nuevoProducto);

            showNotification('Producto agregado exitosamente', 'success');

            const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
            modal.hide();

            // Recargar productos
            loadProducts();
            loadLowStockProducts();

            // Resetear formulario
            addProductForm.reset();
        });
    }

    // Configurar formulario de configuración
    const configForm = document.getElementById('configForm');
    if (configForm) {
        configForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showNotification('Configuración guardada exitosamente', 'success');
        });
    }

    // Inicializar dashboard
    setTimeout(() => {
        actualizarDashboard();
        loadOrders();

        // Cargar productos si estamos en la pestaña de menú
        if (document.querySelector('.tab-pane.active#menu')) {
            loadProducts();
        }
    }, 500);

    // Configurar auto-actualización
    setInterval(() => {
        // Sincronizar pedidos externos
        function sincronizarPedidosExternos() {
            if (!sistema) return;

            const pedidosGlobales = JSON.parse(localStorage.getItem('pedidos_global') || '[]');

            if (pedidosGlobales.length > 0) {
                let nuevos = 0;
                pedidosGlobales.forEach(pedidoGlobal => {
                    const existe = sistema.pedidos.some(p => p.id === pedidoGlobal.id);
                    if (!existe) {
                        // Formatear correctamente el pedido para el sistema
                        const pedidoFormateado = {
                            id: pedidoGlobal.id,
                            numero: pedidoGlobal.numero || `PED-${pedidoGlobal.id.toString().slice(-6)}`,
                            mesa: pedidoGlobal.table || pedidoGlobal.mesa || 1,
                            comensales: pedidoGlobal.comensales || 1,
                            estado: "pendiente",
                            fecha: pedidoGlobal.date ? pedidoGlobal.date.split('T')[0] : new Date().toISOString().split('T')[0],
                            hora: pedidoGlobal.time || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                            productos: pedidoGlobal.productos || pedidoGlobal.items || [],
                            subtotal: pedidoGlobal.subtotal || 0,
                            impuestos: pedidoGlobal.impuestos || (pedidoGlobal.subtotal * 0.19) || 0,
                            total: pedidoGlobal.total || 0,
                            notas: pedidoGlobal.specialNotes || pedidoGlobal.notas || "",
                            mesero: pedidoGlobal.mesero || "Cliente Web",
                            tiempo_creacion: new Date(pedidoGlobal.timestamp || Date.now()).toISOString(),
                            tiempo_transcurrido: 0
                        };

                        sistema.pedidos.unshift(pedidoFormateado);
                        nuevos++;

                        // Registrar venta
                        sistema.registrarVenta(pedidoFormateado);

                        // Actualizar stock si es necesario
                        if (pedidoFormateado.productos && pedidoFormateado.productos.length > 0) {
                            sistema.actualizarVentasProductos(pedidoFormateado.productos);
                        }
                    }
                });

                if (nuevos > 0) {
                    sistema.guardarDatos();
                    localStorage.removeItem('pedidos_global');

                    // Notificar
                    showNotification(`${nuevos} nuevo(s) pedido(s) sincronizado(s)`, 'success');

                    // Actualizar vistas si están activas
                    if (document.querySelector('.tab-pane.active#dashboard') ||
                        document.querySelector('.tab-pane.active#pedidos')) {
                        actualizarDashboard();
                        loadOrders();
                    }

                    return nuevos;
                }
            }
            return 0;
        }

        // Actualizar vista activa
        if (document.querySelector('.tab-pane.active#dashboard')) {
            actualizarDashboard();
        }
        if (document.querySelector('.tab-pane.active#pedidos')) {
            loadOrders();
        }
        if (document.querySelector('.tab-pane.active#inventario')) {
            loadLowStockProducts();
        }
    }, 30000); // Cada 30 segundos
});

// Agregar animación CSS para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);