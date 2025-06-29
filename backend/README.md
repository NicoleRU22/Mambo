# Mambo PetShop Backend API

Backend API para la tienda de mascotas Mambo PetShop construido con Node.js, Express y MySQL.

## 🚀 Características

- **Autenticación JWT** - Sistema de login/registro seguro
- **CRUD de Productos** - Gestión completa de productos
- **Carrito de Compras** - Gestión de carrito persistente
- **Sistema de Pedidos** - Procesamiento de pedidos
- **Panel de Administración** - Gestión de usuarios y pedidos
- **Validación de Datos** - Validación robusta con express-validator
- **Seguridad** - Helmet, CORS, Rate limiting
- **Base de Datos MySQL** - Estructura optimizada para e-commerce

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar el archivo `.env` con tus configuraciones:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=mambo_petshop
   JWT_SECRET=tu_jwt_secret_super_seguro
   ```

4. **Crear la base de datos**
   ```bash
   mysql -u root -p < database.sql
   ```

5. **Iniciar el servidor**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

## 📚 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil del usuario
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/refresh` - Renovar token

### Productos
- `GET /api/products` - Obtener productos (con filtros)
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)
- `GET /api/products/categories` - Obtener categorías

### Carrito
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart` - Agregar producto al carrito
- `PUT /api/cart/:id` - Actualizar cantidad
- `DELETE /api/cart/:id` - Eliminar item del carrito
- `DELETE /api/cart` - Vaciar carrito
- `POST /api/cart/checkout` - Procesar checkout

### Pedidos
- `GET /api/orders` - Obtener pedidos del usuario
- `GET /api/orders/:id` - Obtener detalles del pedido
- `GET /api/orders/admin/all` - Obtener todos los pedidos (admin)
- `PUT /api/orders/:id/status` - Actualizar estado (admin)
- `GET /api/orders/stats/summary` - Estadísticas (admin)

### Usuarios
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Para acceder a rutas protegidas, incluye el token en el header:

```
Authorization: Bearer <tu_token_jwt>
```

## 📊 Estructura de la Base de Datos

### Tablas Principales:
- **users** - Usuarios del sistema
- **products** - Productos de la tienda
- **categories** - Categorías de productos
- **cart_items** - Items del carrito
- **orders** - Pedidos
- **order_items** - Items de los pedidos
- **reviews** - Reseñas de productos
- **wishlist** - Lista de deseos

## 🛡️ Seguridad

- **Helmet** - Headers de seguridad
- **CORS** - Configuración de origen cruzado
- **Rate Limiting** - Límite de requests por IP
- **JWT** - Autenticación stateless
- **bcrypt** - Encriptación de contraseñas
- **Validación** - Validación de datos de entrada

## 🚀 Scripts Disponibles

- `npm run dev` - Iniciar servidor en modo desarrollo con nodemon
- `npm start` - Iniciar servidor en modo producción
- `npm test` - Ejecutar tests (pendiente)

## 📝 Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | 5000 |
| `DB_HOST` | Host de la base de datos | localhost |
| `DB_USER` | Usuario de MySQL | root |
| `DB_PASSWORD` | Contraseña de MySQL | "" |
| `DB_NAME` | Nombre de la base de datos | mambo_petshop |
| `JWT_SECRET` | Clave secreta para JWT | (requerido) |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | 7d |

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 🆘 Soporte

Si tienes problemas o preguntas, crea un issue en el repositorio. 