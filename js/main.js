// ============================================
// RESTAURANTE SENA - FUNCIONALIDAD PRINCIPAL
// ============================================

// Función para establecer la mesa
function setTable() {
    const tableNumber = document.getElementById('tableNumber').value;
    
    if (tableNumber && tableNumber > 0 && tableNumber <= 50) {
        // Guardar número de mesa en localStorage
        localStorage.setItem('tableNumber', tableNumber);
        
        // Cerrar modal
        const modalElement = document.getElementById('qrModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
        
        // Mostrar mensaje de confirmación
        showNotification(`Mesa #${tableNumber} confirmada. ¡Bienvenido!`, 'success');
        
        // Redirigir al menú después de un momento
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 1500);
    } else {
        showNotification('Por favor ingresa un número de mesa válido (1-50)', 'warning');
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 9999;
        min-width: 250px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease-out;
        border-radius: 12px;
        border: none;
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${getNotificationIcon(type)} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Función para obtener icono de notificación
function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle-fill',
        'info': 'info-circle-fill',
        'warning': 'exclamation-triangle-fill',
        'danger': 'x-circle-fill'
    };
    return icons[type] || 'info-circle-fill';
}

// Función para simular escaneo de QR
function simulateQRScan() {
    // Generar número de mesa aleatorio entre 1 y 20
    const randomTable = Math.floor(Math.random() * 20) + 1;
    document.getElementById('tableNumber').value = randomTable;
    
    // Animar el campo
    const input = document.getElementById('tableNumber');
    input.classList.add('bg-light');
    setTimeout(() => {
        input.classList.remove('bg-light');
    }, 300);
}

// Función para permitir Enter en el campo de mesa
function handleTableNumberEnter(event) {
    if (event.key === 'Enter') {
        setTable();
    }
}

// Función para animación del hero
function animateHero() {
    const heroElements = document.querySelectorAll('.hero-section h1, .hero-section .lead, .hero-section img, .hero-section .btn');
    
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

// Función para animación de las características
function animateFeatures() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    entry.target.style.opacity = '1';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    document.querySelectorAll('.features-section .card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

// Función para animación de los pasos
function animateSteps() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    entry.target.style.opacity = '1';
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    document.querySelectorAll('.how-it-works .col-md-3').forEach(step => {
        step.style.opacity = '0';
        observer.observe(step);
    });
}

// Función para efecto parallax en el hero
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Función para verificar si hay una mesa asignada
function checkTableAssignment() {
    const tableNumber = localStorage.getItem('tableNumber');
    
    // Si estamos en la página del menú y no hay mesa asignada, mostrar alerta
    if (window.location.pathname.includes('menu.html') && !tableNumber) {
        setTimeout(() => {
            if (confirm('No tienes una mesa asignada. ¿Deseas seleccionar una ahora?')) {
                window.location.href = 'index.html';
            }
        }, 1000);
    }
}

// Función para smooth scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Función para manejar el botón "Ver Menú"
function handleViewMenu() {
    const tableNumber = localStorage.getItem('tableNumber');
    
    // Si no hay mesa asignada, mostrar el modal
    if (!tableNumber) {
        const qrModal = new bootstrap.Modal(document.getElementById('qrModal'));
        qrModal.show();
    } else {
        // Si ya hay mesa, ir directo al menú
        window.location.href = 'menu.html';
    }
}

// Función para limpiar datos antiguos (más de 24 horas)
function cleanOldData() {
    const currentOrder = localStorage.getItem('currentOrder');
    
    if (currentOrder) {
        const order = JSON.parse(currentOrder);
        const orderTime = new Date(order.timestamp);
        const now = new Date();
        const hoursDiff = (now - orderTime) / (1000 * 60 * 60);
        
        // Si el pedido tiene más de 24 horas, limpiarlo
        if (hoursDiff > 24) {
            localStorage.removeItem('currentOrder');
            console.log('Pedido antiguo eliminado');
        }
    }
}

// Función para detectar dispositivo móvil
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Función para ajustar el diseño según el dispositivo
function adjustForDevice() {
    if (isMobileDevice()) {
        document.body.classList.add('mobile-device');
        console.log('Dispositivo móvil detectado');
    } else {
        document.body.classList.add('desktop-device');
    }
}

// Función para mostrar mensaje de bienvenida personalizado
function showWelcomeMessage() {
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (!hasVisited) {
        setTimeout(() => {
            showNotification('¡Bienvenido a Restaurante SENA! 🍽️', 'info');
            localStorage.setItem('hasVisited', 'true');
        }, 1000);
    }
}

// Función para agregar efecto de typing al título
function typingEffect(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Agregar estilos de animación
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
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-toast {
        animation: slideInRight 0.3s ease-out;
    }
    
    /* Efecto hover para tarjetas */
    .card {
        transition: all 0.3s ease;
    }
    
    /* Cursor pointer para elementos interactivos */
    .btn, .card, .nav-link {
        cursor: pointer;
    }
    
    /* Loading spinner */
    .spinner-custom {
        border: 3px solid rgba(0,0,0,0.1);
        border-top: 3px solid #0d6efd;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funciones
    updateCartCount();
    checkTableAssignment();
    initSmoothScroll();
    adjustForDevice();
    cleanOldData();
    
    // Animaciones de entrada
    setTimeout(() => {
        animateHero();
        animateFeatures();
        animateSteps();
    }, 100);
    
    // Mostrar mensaje de bienvenida
    showWelcomeMessage();
    
    // Agregar event listener al campo de mesa
    const tableNumberInput = document.getElementById('tableNumber');
    if (tableNumberInput) {
        tableNumberInput.addEventListener('keypress', handleTableNumberEnter);
    }
    
    // Inicializar parallax (opcional, puede afectar rendimiento en móviles)
    if (!isMobileDevice()) {
        initParallax();
    }
    
    console.log('Restaurante SENA - Sistema inicializado correctamente');
});

// Manejar visibilidad de la página
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Actualizar contador del carrito cuando se regresa a la página
        updateCartCount();
    }
});

// Exportar funciones para uso global
window.setTable = setTable;
window.showNotification = showNotification;
window.simulateQRScan = simulateQRScan;
window.handleViewMenu = handleViewMenu;