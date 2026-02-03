// js/admin-auth.js
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        this.loadSession();
        this.validateSession();
    }
    
    loadSession() {
        try {
            const userData = localStorage.getItem('currentUser');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Error cargando sesión:', error);
            this.logout();
        }
    }
    
    validateSession() {
        const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
        
        if (!isLoggedIn || !this.currentUser) {
            this.redirectToLogin('No hay sesión activa');
            return;
        }
        
        if (this.currentUser.role !== 'admin') {
            this.redirectToLogin('Acceso denegado: Solo administradores');
            return;
        }
        
        this.updateUI();
    }
    
    updateUI() {
        const adminNameElement = document.getElementById('adminName');
        const adminRoleElement = document.getElementById('adminRole');
        
        if (adminNameElement && this.currentUser) {
            adminNameElement.textContent = this.currentUser.nombre || this.currentUser.username;
        }
        
        if (adminRoleElement) {
            adminRoleElement.textContent = this.currentUser.role === 'admin' ? 'Administrador' : this.currentUser.role;
        }
    }
    
    logout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            localStorage.removeItem('isAdminLoggedIn');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
            this.redirectToLogin('Sesión cerrada exitosamente');
        }
    }
    
    redirectToLogin(message = '') {
        if (message) {
            sessionStorage.setItem('loginMessage', message);
            sessionStorage.setItem('messageType', 'info');
        }
        
        window.location.href = 'login.html';
    }
}

// Hacer disponible globalmente
window.AuthManager = AuthManager;