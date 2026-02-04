# 🍽️ Restaurante SENA - Sistema de Pedidos QR
Sistema web moderno para gestión de pedidos mediante códigos QR en restaurantes. Proyecto académico desarrollado para el SENA.

 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Pantallas](#-pantallas)
- [Credenciales de Prueba](#-credenciales-de-prueba)
- [Funcionalidades](#-funcionalidades)
- [Diseño Responsivo](#-diseño-responsivo)
- [Accesibilidad](#-accesibilidad)
- [Roadmap](#-roadmap)
- [Autores](#-autores)
- [Licencia](#-licencia)

---

## 📖 Descripción

**Restaurante SENA** es una aplicación web completa que digitaliza el proceso de pedidos en restaurantes mediante códigos QR. Los clientes escanean un código en su mesa, acceden al menú digital, realizan pedidos de forma autónoma y hacen seguimiento en tiempo real.

El sistema incluye un **panel administrativo** completo para gestionar pedidos, productos, estadísticas y operaciones del restaurante.

### 🎯 Objetivo del Proyecto

Desarrollado como evidencia académica **GA5-220501095-AA1-EV04** del programa de **Análisis y Desarrollo de Software** del SENA, este proyecto demuestra competencias en:

- Maquetación web con HTML5, CSS3 y JavaScript
- Diseño de interfaces intuitivas y accesibles
- Aplicación de principios de usabilidad (Nielsen)
- Cumplimiento de estándares WCAG 2.1 (Accesibilidad)
- Diseño responsivo mobile-first
- Gestión de datos con localStorage

---

## ✨ Características

### Para Clientes

✅ Escaneo de código QR por mesa  
✅ Menú digital con imágenes y descripciones  
✅ Búsqueda y filtrado por categorías  
✅ Carrito de compras interactivo  
✅ Confirmación de pedido en tiempo real  
✅ Seguimiento del estado del pedido con timeline visual  
✅ Facturación digital con opción de impresión  
✅ Sistema de notificaciones toast  
✅ Opción de llamar al mesero  

### Para Administradores

✅ Dashboard con estadísticas en tiempo real  
✅ Gestión de pedidos activos  
✅ CRUD completo de productos del menú  
✅ Cambio de estado de pedidos (Pendiente → En Preparación → Listo → Entregado)  
✅ Visualización de reportes y ventas  
✅ Sistema de autenticación seguro  
✅ Panel responsivo para tablet y móvil  

---

### No requiere:
- ❌ Node.js
- ❌ Backend
- ❌ Base de datos
- ❌ Instalación de dependencias

**100% Frontend** - Funciona directamente en el navegador.

---

## 📁 Estructura del Proyecto

```
restaurante-sena/
│
├── 📄 index.html              # Página principal / Landing
├── 📄 menu.html               # Menú digital de productos
├── 📄 carrito.html            # Carrito de compras
├── 📄 pedido.html             # Seguimiento del pedido
├── 📄 factura.html            # Factura digital
├── 📄 admin.html              # Panel administrativo
├── 📄 login.html              # Autenticación
│
├── 📁 css/
│   └── 📄 styles.css          # Estilos personalizados
│
├── 📁 js/
│   ├── 📄 main.js             # Funciones globales
│   ├── 📄 menu.js             # Lógica del menú
│   ├── 📄 carrito.js          # Gestión del carrito
│   ├── 📄 pedido.js           # Seguimiento de pedidos
│   ├── 📄 factura.js          # Generación de facturas
│   ├── 📄 admin.js            # Panel administrativo
│   ├── 📄 admin-auth.js       # Autenticación
│   ├── 📄 login-script.js     # Login
│   └── 📄 pedido-sync.js      # Sincronización de datos
│
├── 📁 images/
│   ├── logo.png
│   ├── hero-image.png
│   └── 📁 productos/          # Imágenes de productos
│
└── 📄 README.md               # Este archivo
```

---

## 🚀 Instalación

### Opción 1: Descarga Directa

1. **Descarga el proyecto**
   ```bash
   # Clona el repositorio
   git clone https://github.com/tu-usuario/restaurante-sena.git
   
   # O descarga el ZIP desde GitHub
   ```

2. **Abre el proyecto**
   ```bash
   cd restaurante-sena
   ```

3. **Abre index.html en tu navegador**
   - Doble clic en `index.html`
   - O arrastra el archivo a tu navegador
   - O usa Live Server en VS Code

### Opción 2: Live Server (Recomendado)

Si usas **Visual Studio Code**:

1. Instala la extensión **Live Server**
2. Abre la carpeta del proyecto
3. Click derecho en `index.html` → **"Open with Live Server"**
4. Se abrirá automáticamente en `http://localhost:5500`

---

## 📱 Uso

### Como Cliente

1. **Accede a la aplicación**
   - Abre `index.html` en tu navegador

2. **Selecciona tu mesa**
   - Haz clic en "Escanear QR" o "Ver Menú"
   - Ingresa un número de mesa (1-50)
   - Ejemplo: `Mesa 5`

3. **Explora el menú**
   - Navega por categorías: Entradas, Principales, Bebidas, Postres
   - Usa la búsqueda para encontrar productos específicos
   - Haz clic en "Agregar" para añadir al carrito

4. **Confirma tu pedido**
   - Ve al carrito (icono superior derecho)
   - Ajusta cantidades si es necesario
   - Agrega notas especiales (opcional)
   - Haz clic en "Confirmar Pedido"

5. **Sigue tu pedido**
   - Serás redirigido automáticamente
   - Observa el progreso en el timeline
   - Llama al mesero si lo necesitas

6. **Revisa tu factura**
   - Haz clic en "Ver Factura"
   - Imprime o descarga si lo deseas

### Como Administrador

1. **Inicia sesión**
   - Accede a `login.html`
   - Usuario: `admin`
   - Contraseña: `admin123`

2. **Dashboard**
   - Visualiza estadísticas del día
   - Pedidos activos, ventas, ocupación

3. **Gestiona pedidos**
   - Ve a "Pedidos Activos"
   - Cambia estados: "En Preparación" → "Listo"
   - Visualiza detalles completos

4. **Administra productos**
   - Ve a "Gestionar Menú"
   - Agrega, edita o elimina productos
   - Cambia disponibilidad

---

## 🖥️ Pantallas

### 1️⃣ Página Principal (index.html)
- Hero section con llamado a la acción
- Características del servicio
- Tutorial "¿Cómo funciona?"
- Modal de selección de mesa

### 2️⃣ Menú Digital (menu.html)
- Catálogo completo de productos
- Filtros por categoría
- Búsqueda en tiempo real
- Cards de productos con imágenes
- Botón flotante del carrito

### 3️⃣ Carrito de Compras (carrito.html)
- Lista de productos seleccionados
- Control de cantidades (+/-)
- Resumen de costos (Subtotal + Servicio 10% + IVA 19%)
- Campo de cupón de descuento
- Notas especiales
- Confirmación con modal

### 4️⃣ Seguimiento de Pedido (pedido.html)
- Información del pedido (número, mesa, hora)
- Timeline visual con 4 estados
- Detalle de productos ordenados
- Resumen de pago
- Botones: Llamar mesero, Ver factura, Agregar más

### 5️⃣ Factura Digital (factura.html)
- Datos del restaurante
- Número de factura único
- Tabla detallada de productos
- Desglose de costos e impuestos
- Código QR de verificación
- Botones: Imprimir, Descargar PDF, Nuevo pedido

### 6️⃣ Login (login.html)
- Formulario de autenticación
- Validación de credenciales
- Opción "Recordar sesión"
- Redirección según rol

### 7️⃣ Panel Administrativo (admin.html)
- Dashboard con estadísticas
- Pedidos activos en tiempo real
- Gestión de productos (CRUD)
- Tabla con acciones (editar, eliminar, ver)
- Filtros y búsquedas
- Reportes

---

## 🔐 Credenciales de Prueba

### Usuarios Disponibles

| Rol | Usuario | Contraseña | Acceso |
|-----|---------|------------|--------|
| **Administrador** | `admin` | `admin123` | Panel completo |

> **Nota:** Los usuarios se crean automáticamente en localStorage al cargar `login.html` por primera vez.

-

## ⚙️ Funcionalidades

### Sistema de Carrito

- **Agregar productos:** Desde el menú con un clic
- **Modificar cantidades:** Botones +/- (límite 1-10)
- **Eliminar productos:** Botón de eliminar individual
- **Vaciar carrito:** Opción para limpiar todo
- **Persistencia:** Se guarda automáticamente en localStorage
- **Actualización en tiempo real:** Badge del carrito se actualiza inmediatamente

### Gestión de Pedidos

- **Generación automática de número:** Formato `ORD-XXXXXX`
- **Timestamp:** Fecha y hora exacta del pedido
- **Validación:** Verifica mesa asignada antes de confirmar
- **Estados:**
  - 🔴 **Pendiente:** Recibido, no iniciado
  - 🟡 **En Preparación:** Cocina trabajando
  - 🟢 **Listo:** Terminado, esperando entrega
  - ✅ **Entregado:** Servido en mesa

### Sincronización de Datos

```javascript
// El sistema guarda pedidos en múltiples claves para compatibilidad:
localStorage.setItem('lastOrder', JSON.stringify(order));        // Cliente
localStorage.setItem('activeOrders', JSON.stringify(orders));     // Admin
localStorage.setItem('pedidos_global', JSON.stringify(global));   // Backup
```

### Notificaciones

- **Toast notifications:** Esquina superior derecha
- **Tipos:** Success, Danger, Warning, Info
- **Auto-desaparición:** 3 segundos
- **Ejemplos:**
  - ✅ "Producto agregado al carrito"
  - ✅ "Mesa cambiada a #5"
  - ✅ "Pedido confirmado exitosamente"
  - ⚠️ "El carrito está vacío"
  - ❌ "Número de mesa inválido"

---

## 📐 Diseño Responsivo

### Breakpoints

| Dispositivo | Ancho | Columnas | Navbar |
|-------------|-------|----------|--------|
| **Móvil pequeño** | < 576px | 1 | Hamburguesa |
| **Móvil** | 576px - 768px | 2 | Hamburguesa |
| **Tablet** | 768px - 992px | 3 | Extendido |
| **Desktop** | 992px - 1200px | 4 | Extendido |
| **Large Desktop** | > 1200px | 4 | Extendido |

### Adaptaciones por Dispositivo

**Móvil:**
- Navbar colapsado en menú hamburguesa
- Productos en 1-2 columnas
- Filtros con scroll horizontal
- Botones apilados verticalmente
- Tablas con scroll horizontal
- Imágenes optimizadas

**Tablet:**
- Productos en 2-3 columnas
- Sidebar visible
- Tablas responsivas
- Modales centrados

**Desktop:**
- Layout completo de 3-4 columnas
- Sidebar fijo
- Tablas completas
- Hover effects activados

---

## ♿ Accesibilidad

### Cumplimiento WCAG 2.1 Nivel AA

✅ **Perceptible:**
- Contraste mínimo 4.5:1 para texto
- Textos alternativos en imágenes
- No se usa solo color para información

✅ **Operable:**
- Navegación completa por teclado (Tab, Enter, Esc)
- Área táctil mínima 44x44px
- Sin trampa de teclado

✅ **Comprensible:**
- Etiquetas descriptivas en formularios
- Mensajes de error claros
- Lenguaje simple

✅ **Robusto:**
- HTML semántico
- Atributos ARIA apropiados
- Compatible con lectores de pantalla

---

## 🗺️ Roadmap

### Versión 1.0 (Actual) ✅
- [x] Maquetación HTML de 7 pantallas
- [x] Estilos CSS con Bootstrap
- [x] JavaScript funcional
- [x] Sistema de carrito
- [x] Seguimiento de pedidos
- [x] Panel administrativo básico
- [x] Autenticación simple
- [x] Diseño responsivo

### Versión 2.0 (Planificada) 🚧
- [ ] Backend con Node.js + Express
- [ ] Base de datos MySQL/MongoDB
- [ ] API REST
- [ ] Autenticación JWT real
- [ ] WebSockets para tiempo real
- [ ] Pasarela de pagos (Stripe/PayU)
- [ ] Generación real de PDF
- [ ] Notificaciones push
- [ ] Sistema de calificaciones

### Versión 3.0 (Futura) 📅
- [ ] PWA (Progressive Web App)
- [ ] Modo offline con Service Workers
- [ ] Aplicación móvil (React Native)
- [ ] Integración con impresoras de cocina
- [ ] IA para recomendaciones personalizadas
- [ ] Dashboard de analítica avanzada
- [ ] Multi-idioma (i18n)
- [ ] Multi-restaurante

---

## 👥 Autores

Desarrollado por estudiantes del **SENA - Análisis y Desarrollo de Software**:

- **Luisa Fernanda Ovallos Carrascal**
- **Duban Guillermo García Daniel**
- **Andrés Felipe Revelo**
- **Didier Pérez Lara**

### 👨‍🏫 Instructor
- **Deivys Guillermo Morales Uribe**

### 🏢 Institución
- **SENA - Servicio Nacional de Aprendizaje**
- **Centro de Diseño y Metrología - Distrito Capital**
- **Programa:** Análisis y Desarrollo de Software (3186628)

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

```
MIT License

Copyright (c) 2024 Restaurante SENA

Se concede permiso, de forma gratuita, a cualquier persona que obtenga una copia
de este software y archivos de documentación asociados (el "Software"), para
utilizar el Software sin restricción, incluyendo sin limitación los derechos
de usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar, y/o
vender copias del Software...
```

## 🙏 Agradecimientos

- **SENA** por la formación académica
- **Bootstrap Team** por el excelente framework
- **MDN Web Docs** por la documentación técnica
- **W3C** por los estándares web
- **Comunidad de desarrolladores** por recursos y tutoriales

---





<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub ⭐**

Hecho con ❤️ por estudiantes del SENA

</div>

---

## 📝 Changelog

### v1.0.0 (2024-02-03)
- 🎉 Lanzamiento inicial
- ✨ 7 pantallas funcionales
- 🎨 Diseño responsivo completo
- ♿ Accesibilidad WCAG 2.1 AA
- 🔐 Sistema de autenticación básico
- 📱 Optimización móvil
- 🛒 Carrito de compras funcional
- 📊 Panel administrativo
- 📄 Facturación digital

---

**Última actualización:** 3 de febrero de 2026
