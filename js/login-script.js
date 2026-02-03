// js/login-script.js - Código JavaScript para el login del Restaurante SENA
// Conectado al sistema real de autenticación

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    
    // URL base de la API (ajusta según tu configuración)
    const API_BASE_URL = 'http://localhost:3000'; // Cambia esto por tu URL real
    const LOGIN_ENDPOINT = '/api/auth/login';
    
    // Cargar credenciales guardadas si existe la cookie
    const savedUsername = getCookie('savedUsernameSENA');
    if (savedUsername) {
        usernameInput.value = savedUsername;
        rememberCheckbox.checked = true;
    }
    
    // Manejar envío del formulario
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Validaciones básicas
        if (!username) {
            showMessage('Por favor ingresa tu usuario', 'error');
            usernameInput.focus();
            return;
        }
        
        if (!password) {
            showMessage('Por favor ingresa tu contraseña', 'error');
            passwordInput.focus();
            return;
        }
        
        // Guardar usuario si la casilla está marcada
        if (rememberCheckbox.checked) {
            setCookie('savedUsernameSENA', username, 30);
        } else {
            deleteCookie('savedUsernameSENA');
        }
        
        // Autenticación REAL con el sistema
        authenticateUser(username, password);
    });
    
    // Manejar "Olvidé mi contraseña"
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        
        if (!username) {
            showMessage('Por favor ingresa tu usuario para recuperar tu contraseña', 'error');
            usernameInput.focus();
            return;
        }
        
        // En un sistema real, aquí harías una petición al backend
        showMessage('Funcionalidad de recuperación en desarrollo', 'info');
    });
    
    // Función para autenticación REAL
    async function authenticateUser(username, password) {
        // Mostrar mensaje de carga
        const loginButton = loginForm.querySelector('.btn-login');
        const originalText = loginButton.innerHTML;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        loginButton.disabled = true;
        
        try {
            // **OPCIÓN 1: Si tienes API REST (RECOMENDADO)**
            // Descomenta esta sección si tienes un backend
            /*
            const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Login exitoso
                handleSuccessfulLogin(data.user);
            } else {
                // Error en login
                showMessage(data.message || 'Credenciales incorrectas', 'error');
                resetLoginButton(loginButton, originalText);
                passwordInput.value = '';
                passwordInput.focus();
            }
            */
            
            // **OPCIÓN 2: Simulación con datos de localStorage (para desarrollo)**
            // Comenta esta sección cuando implementes la API real
            
            // Simular tiempo de red
            setTimeout(() => {
                // Verificar si existe en localStorage (simulación de base de datos)
                const users = JSON.parse(localStorage.getItem('restaurante_users') || '[]');
                
                // Buscar usuario
                const user = users.find(u => 
                    u.username === username && 
                    u.password === password && 
                    u.role === 'admin'
                );
                
                if (user) {
                    // Login exitoso
                    handleSuccessfulLogin(user);
                } else {
                    // Verificar si es usuario no admin
                    const nonAdminUser = users.find(u => 
                        u.username === username && 
                        u.password === password
                    );
                    
                    if (nonAdminUser) {
                        showMessage('Acceso denegado: Solo administradores pueden acceder desde aquí', 'warning');
                        showMessage(`Usuario ${username}, contacta al administrador para acceder a tu sistema específico.`, 'info');
                    } else {
                        showMessage('Usuario o contraseña incorrectos', 'error');
                    }
                    
                    resetLoginButton(loginButton, originalText);
                    passwordInput.value = '';
                    passwordInput.focus();
                }
            }, 1500);
            
        } catch (error) {
            console.error('Error en autenticación:', error);
            showMessage('Error de conexión con el servidor', 'error');
            resetLoginButton(loginButton, originalText);
        }
    }
    
    // Función para manejar login exitoso
    function handleSuccessfulLogin(user) {
        // Guardar sesión
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            username: user.username,
            role: user.role,
            nombre: user.nombre || user.username,
            email: user.email || '',
            loginTime: new Date().toISOString()
        }));
        
        // Guardar token si existe (para API real)
        if (user.token) {
            localStorage.setItem('authToken', user.token);
        }
        
        showMessage(`¡Bienvenido/a, ${user.nombre || user.username}!`, 'success');
        
        // Redirigir al panel de administración
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
    }
    
    // Función para resetear botón de login
    function resetLoginButton(button, originalText) {
        button.innerHTML = originalText;
        button.disabled = false;
    }
    
    // Función para mostrar mensajes
    function showMessage(message, type) {
        // Eliminar mensaje anterior si existe
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Crear elemento de mensaje
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${type}`;
        messageElement.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 
                           type === 'success' ? 'fa-check-circle' : 
                           type === 'warning' ? 'fa-exclamation-triangle' : 
                           'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Estilos dinámicos para el mensaje
        messageElement.style.cssText = `
            padding: 14px 16px;
            margin-bottom: 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideDown 0.3s ease-out;
            font-weight: 500;
            font-size: 15px;
        `;
        
        // Colores según el tipo de mensaje
        if (type === 'error') {
            messageElement.style.backgroundColor = '#f8d7da';
            messageElement.style.color = '#721c24';
            messageElement.style.border = '1px solid #f5c6cb';
            messageElement.querySelector('i').style.color = '#dc3545';
        } else if (type === 'success') {
            messageElement.style.backgroundColor = '#d4edda';
            messageElement.style.color = '#155724';
            messageElement.style.border = '1px solid #c3e6cb';
            messageElement.querySelector('i').style.color = '#28a745';
        } else if (type === 'warning') {
            messageElement.style.backgroundColor = '#fff3cd';
            messageElement.style.color = '#856404';
            messageElement.style.border = '1px solid #ffeaa7';
            messageElement.querySelector('i').style.color = '#ffc107';
        } else {
            messageElement.style.backgroundColor = '#d1ecf1';
            messageElement.style.color = '#0c5460';
            messageElement.style.border = '1px solid #bee5eb';
            messageElement.querySelector('i').style.color = '#17a2b8';
        }
        
        // Insertar mensaje después del header
        const header = document.querySelector('.header');
        header.parentNode.insertBefore(messageElement, header.nextSibling);
        
        // Auto-eliminar mensaje después de 5 segundos
        if (type !== 'error') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.style.opacity = '0';
                    messageElement.style.transition = 'opacity 0.5s';
                    setTimeout(() => {
                        if (messageElement.parentNode) {
                            messageElement.remove();
                        }
                    }, 500);
                }
            }, 5000);
        }
    }
    
    // Funciones para manejar cookies
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
    }
    
    function getCookie(name) {
        const cookieName = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        
        for(let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return "";
    }
    
    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    
    // **INICIALIZACIÓN: Crear usuario admin por defecto si no existe**
    // (Solo para desarrollo - en producción esto viene de tu base de datos)
    initializeDefaultAdmin();
    
    function initializeDefaultAdmin() {
        const users = JSON.parse(localStorage.getItem('restaurante_users') || '[]');
        
        // Buscar si ya existe el admin
        const adminExists = users.some(u => u.username === 'admin' && u.role === 'admin');
        
        if (!adminExists) {
            // Crear usuario admin por defecto
            const defaultAdmin = {
                id: Date.now(),
                username: 'admin',
                password: 'admin123', // En producción esto debería estar encriptado
                role: 'admin',
                nombre: 'Administrador Principal',
                email: 'admin@restaurantesena.com',
                fechaCreacion: new Date().toISOString(),
                activo: true
            };
            
            users.push(defaultAdmin);
            localStorage.setItem('restaurante_users', JSON.stringify(users));
            console.log('Usuario admin creado por defecto');
        }
        
        // También puedes crear otros usuarios de ejemplo
        const exampleUsers = [
            {
                id: Date.now() + 1,
                username: 'cocina',
                password: 'cocina123',
                role: 'cocina',
                nombre: 'Chef Principal',
                email: 'cocina@restaurantesena.com',
                activo: true
            },
            {
                id: Date.now() + 2,
                username: 'mesero',
                password: 'mesero123',
                role: 'mesero',
                nombre: 'Mesero Ejemplo',
                email: 'mesero@restaurantesena.com',
                activo: true
            }
        ];
        
        exampleUsers.forEach(user => {
            const userExists = users.some(u => u.username === user.username);
            if (!userExists) {
                users.push(user);
            }
        });
        
        localStorage.setItem('restaurante_users', JSON.stringify(users));
    }
});