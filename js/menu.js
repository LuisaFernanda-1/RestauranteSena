// ============================================
// RESTAURANTE SENA - FUNCIONALIDAD DEL MENÚ
// ============================================

// Función para filtrar productos por categoría
function filterCategory(category) {
    // Obtener todos los botones de categoría
    const buttons = document.querySelectorAll('#categoryFilters button');
    
    // Remover clase active de todos los botones
    buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
    });
    
    // Agregar clase active al botón clickeado
    const activeButton = document.querySelector(`#categoryFilters button[onclick="filterCategory('${category}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
        activeButton.classList.remove('btn-outline-primary');
        activeButton.classList.add('btn-primary');
    }
    
    // Obtener todas las secciones de categorías
    const sections = document.querySelectorAll('.category-section');
    
    if (category === 'todos') {
        // Mostrar todas las secciones
        sections.forEach(section => {
            section.style.display = 'block';
            // Animación de entrada
            section.style.animation = 'fadeInUp 0.5s ease-out';
        });
    } else {
        // Mostrar solo la categoría seleccionada
        sections.forEach(section => {
            const sectionCategory = section.getAttribute('data-category');
            if (sectionCategory === category) {
                section.style.display = 'block';
                section.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                section.style.display = 'none';
            }
        });
    }
    
    // Scroll suave hacia arriba
    window.scrollTo({
        top: 300,
        behavior: 'smooth'
    });
}

// Función para buscar productos
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Obtener todos los productos
    const products = document.querySelectorAll('.product-item');
    const sections = document.querySelectorAll('.category-section');
    
    let foundResults = false;
    
    if (searchTerm === '') {
        // Si no hay búsqueda, mostrar todos
        products.forEach(product => {
            product.style.display = 'block';
        });
        sections.forEach(section => {
            section.style.display = 'block';
        });
        foundResults = true;
    } else {
        // Ocultar todas las secciones primero
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Buscar en productos
        products.forEach(product => {
            const productName = product.getAttribute('data-name') || '';
            const productSection = product.closest('.category-section');
            
            if (productName.includes(searchTerm)) {
                product.style.display = 'block';
                if (productSection) {
                    productSection.style.display = 'block';
                }
                foundResults = true;
            } else {
                product.style.display = 'none';
            }
        });
    }
    
    // Mostrar mensaje si no hay resultados
    showSearchResults(foundResults, searchTerm);
}

// Función para mostrar resultados de búsqueda
function showSearchResults(found, searchTerm) {
    // Remover mensaje anterior si existe
    const existingMessage = document.getElementById('searchResultsMessage');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (!found && searchTerm !== '') {
        const productsSection = document.querySelector('.products-section');
        const message = document.createElement('div');
        message.id = 'searchResultsMessage';
        message.className = 'alert alert-info text-center my-5';
        message.innerHTML = `
            <i class="bi bi-search fs-1 d-block mb-3"></i>
            <h4>No se encontraron resultados para "${searchTerm}"</h4>
            <p class="mb-0">Intenta con otros términos de búsqueda</p>
        `;
        productsSection.insertBefore(message, productsSection.firstChild);
    }
}

// Función para mostrar notificación (compatibilidad con carrito.js)
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px; 
        right: 20px; 
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${getNotificationIcon(type)} me-2 fs-5"></i>
            <span>${message}</span>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Agregar al body
    document.body.appendChild(notification);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Obtener icono según tipo de notificación
function getNotificationIcon(type) {
    const icons = {
        'success': 'bi-check-circle-fill',
        'danger': 'bi-exclamation-circle-fill',
        'warning': 'bi-exclamation-triangle-fill',
        'info': 'bi-info-circle-fill'
    };
    return icons[type] || 'bi-info-circle-fill';
}

// Función para cambiar número de mesa
function changeTable() {
    const currentTable = localStorage.getItem('tableNumber') || 'No asignada';
    const newTable = prompt(`Mesa actual: ${currentTable}\n\nIngresa el nuevo número de mesa (1-50):`, currentTable);
    
    if (newTable !== null && newTable.trim() !== '') {
        const tableNum = parseInt(newTable);
        if (tableNum >= 1 && tableNum <= 50) {
            localStorage.setItem('tableNumber', tableNum);
            updateTableDisplay();
            showNotification(`Mesa cambiada a #${tableNum}`, 'success');
        } else {
            showNotification('Número de mesa inválido (1-50)', 'danger');
        }
    }
}

// Función para actualizar visualización de número de mesa
function updateTableDisplay() {
    const tableDisplay = document.getElementById('tableNumberDisplay');
    const tableNumber = localStorage.getItem('tableNumber') || '?';
    
    if (tableDisplay) {
        tableDisplay.textContent = tableNumber;
    }
}

// Función para configurar mesa desde QR
function setTableFromQR(tableNumber) {
    if (tableNumber && tableNumber > 0 && tableNumber <= 50) {
        localStorage.setItem('tableNumber', tableNumber);
        updateTableDisplay();
        return true;
    }
    return false;
}

// Función para mostrar modal de categoría (opcional)
function showCategoryInfo(category) {
    const categoryInfo = {
        'entradas': {
            title: 'Entradas',
            description: 'Deliciosas opciones para abrir el apetito',
            icon: 'bi-egg-fried'
        },
        'principales': {
            title: 'Platos Principales',
            description: 'Nuestras especialidades de la casa',
            icon: 'bi-bowl-hot-fill'
        },
        'bebidas': {
            title: 'Bebidas',
            description: 'Refrescantes opciones para acompañar tu comida',
            icon: 'bi-cup-straw'
        },
        'postres': {
            title: 'Postres',
            description: 'El toque dulce perfecto para terminar',
            icon: 'bi-cup-hot-fill'
        },
        'especiales': {
            title: 'Especiales del Chef',
            description: 'Creaciones únicas y recomendaciones especiales',
            icon: 'bi-star-fill'
        }
    };
    
    const info = categoryInfo[category];
    if (info) {
        console.log(`Categoría: ${info.title} - ${info.description}`);
    }
}

// Función para agregar animaciones de scroll
function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                entry.target.style.opacity = '1';
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observar todas las tarjetas de productos
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

// Función para manejar el scroll del navbar
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const categoriesSection = document.querySelector('.categories-section');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

// Función para inicializar tooltips de Bootstrap
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Función para lazy loading de imágenes
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Función para verificar disponibilidad de productos
function checkProductAvailability() {
    // Esta función se podría conectar con un backend real
    // Por ahora, es un placeholder para funcionalidad futura
    const products = document.querySelectorAll('.product-item');
    
    products.forEach(product => {
        const badge = product.querySelector('.badge.bg-success');
        if (badge && badge.textContent === 'Disponible') {
            // Producto disponible
            product.querySelector('.btn-primary').disabled = false;
        }
    });
}

// Función para manejar errores de carga de imágenes
function handleImageErrors() {
    const images = document.querySelectorAll('.product-card img, .cart-item img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/200x200/0d6efd/ffffff?text=Producto';
            this.alt = 'Imagen no disponible';
        });
    });
}

// Función para guardar productos favoritos (funcionalidad futura)
function toggleFavorite(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.indexOf(productId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification('Eliminado de favoritos', 'info');
    } else {
        favorites.push(productId);
        showNotification('Agregado a favoritos', 'success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Inicializar funciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar display de mesa
    updateTableDisplay();
    
    // Agregar animaciones de scroll
    addScrollAnimations();
    
    // Manejar scroll del navbar
    handleNavbarScroll();
    
    // Inicializar tooltips
    initializeTooltips();
    
    // Manejar errores de imágenes
    handleImageErrors();
    
    // Verificar disponibilidad de productos
    checkProductAvailability();
    
    // Lazy loading de imágenes
    lazyLoadImages();
});

// Exportar funciones para uso global
window.filterCategory = filterCategory;
window.searchProducts = searchProducts;
window.changeTable = changeTable;
window.setTableFromQR = setTableFromQR;
window.toggleFavorite = toggleFavorite;