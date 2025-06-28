# 🐾 Mambo PetShop - E-commerce para Mascotas

Plataforma completa de e-commerce para productos de mascotas con backend en Node.js/Express y frontend en React/TypeScript.

## 🚀 Características

### Backend (Node.js + Express + Prisma)
- **Autenticación JWT** - Sistema seguro de login/registro
- **CRUD de Productos** - Gestión completa con categorías y tipos de mascota
- **Carrito de Compras** - Persistente y sincronizado
- **Sistema de Pedidos** - Procesamiento completo con estados
- **Blog** - Gestión de contenido y posts
- **Newsletter** - Sistema de suscripciones
- **Búsqueda Avanzada** - Con filtros y sugerencias
- **Ofertas** - Gestión de descuentos y promociones
- **Devoluciones** - Sistema de solicitudes de devolución
- **Panel de Administración** - Gestión completa de usuarios y pedidos

### Frontend (React + TypeScript + Tailwind)
- **Interfaz Moderna** - Diseño responsive con Tailwind CSS
- **Autenticación** - Login/registro con contexto global
- **Catálogo de Productos** - Filtros, búsqueda y paginación
- **Carrito de Compras** - Gestión de productos y checkout
- **Perfil de Usuario** - Gestión de datos personales y pedidos
- **Blog** - Visualización de posts y categorías
- **Newsletter** - Suscripción y gestión
- **Panel de Admin** - Dashboard completo para administradores
- **Páginas Informativas** - Políticas, términos, contacto

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd MamboPetShop
```

### 2. Instalar dependencias
```bash
npm run install:all
```

### 3. Configurar variables de entorno

#### Backend
```bash
cd backend
cp env.example .env
```

Editar `backend/.env`:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/mambo_petshop"
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

#### Frontend
```bash
cd front
cp env.example .env
```

Editar `front/.env`:
```env
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME=Mambo PetShop
```

### 4. Configurar base de datos
```bash
cd backend
npm run db:setup
npm run db:seed
```

### 5. Iniciar desarrollo
```bash
# Desde la raíz del proyecto
npm run dev
```

Esto iniciará:
- Backend en http://localhost:4000
- Frontend en http://localhost:3000

## 📚 Estructura del Proyecto

```
MamboPetShop/
├── backend/                 # Backend Node.js/Express
│   ├── src/
│   │   ├── routes/         # Rutas de la API
│   │   ├── controllers/    # Controladores
│   │   ├── services/       # Lógica de negocio
│   │   ├── middleware/     # Middlewares
│   │   └── lib/           # Utilidades
│   ├── prisma/            # Esquema de base de datos
│   └── uploads/           # Archivos subidos
├── front/                  # Frontend React/TypeScript
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas
│   │   ├── contexts/      # Contextos (Auth)
│   │   ├── services/      # Servicios API
│   │   └── hooks/         # Hooks personalizados
│   └── public/            # Archivos estáticos
└── README.md
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil
- `POST /api/auth/logout` - Cerrar sesión

### Productos
- `GET /api/products` - Listar productos (con filtros)
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

### Carrito
- `GET /api/cart` - Obtener carrito
- `POST /api/cart` - Agregar al carrito
- `PUT /api/cart/:id` - Actualizar cantidad
- `DELETE /api/cart/:id` - Eliminar del carrito
- `POST /api/cart/checkout` - Procesar compra

### Pedidos
- `GET /api/orders` - Listar pedidos del usuario
- `GET /api/orders/:id` - Obtener pedido
- `GET /api/orders/admin/all` - Todos los pedidos (admin)
- `PUT /api/orders/:id/status` - Actualizar estado (admin)

### Blog
- `GET /api/blog` - Listar posts
- `GET /api/blog/:id` - Obtener post
- `POST /api/blog` - Crear post (admin)
- `PUT /api/blog/:id` - Actualizar post (admin)
- `DELETE /api/blog/:id` - Eliminar post (admin)

### Newsletter
- `POST /api/newsletter` - Suscribirse
- `DELETE /api/newsletter/:email` - Desuscribirse
- `GET /api/newsletter/subscribers` - Listar suscriptores (admin)

### Búsqueda
- `GET /api/search?q=term` - Búsqueda simple
- `GET /api/search/advanced` - Búsqueda avanzada
- `GET /api/search/popular` - Términos populares
- `GET /api/search/suggestions` - Sugerencias

### Ofertas
- `GET /api/offers` - Listar ofertas
- `GET /api/offers/active` - Ofertas activas
- `POST /api/offers` - Crear oferta (admin)
- `PUT /api/offers/:id` - Actualizar oferta (admin)

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación:

1. **Login/Registro**: El usuario recibe un token JWT
2. **Almacenamiento**: El token se guarda en localStorage
3. **Requests**: Se incluye en el header `Authorization: Bearer <token>`
4. **Middleware**: Valida el token en cada request protegido

### Roles de Usuario
- **USER**: Usuario normal (compras, perfil, pedidos)
- **ADMIN**: Administrador (gestión completa)

## 🛒 Flujo de Compra

1. **Navegación**: Usuario explora productos
2. **Carrito**: Agrega productos al carrito
3. **Checkout**: Completa información de envío y pago
4. **Confirmación**: Recibe confirmación del pedido
5. **Seguimiento**: Puede ver el estado del pedido

## 📊 Panel de Administración

### Dashboard
- Estadísticas de ventas
- Productos más vendidos
- Pedidos recientes
- Actividad de usuarios

### Gestión de Productos
- CRUD completo de productos
- Gestión de categorías
- Control de inventario
- Subida de imágenes

### Gestión de Pedidos
- Ver todos los pedidos
- Actualizar estados
- Gestionar devoluciones
- Exportar datos

### Gestión de Usuarios
- Ver usuarios registrados
- Gestionar roles
- Estadísticas de usuarios

## 🚀 Despliegue

### Backend (Producción)
```bash
cd backend
npm run build
npm start
```

### Frontend (Producción)
```bash
cd front
npm run build
# Servir archivos estáticos con nginx o similar
```

### Variables de Entorno (Producción)
- Configurar `NODE_ENV=production`
- Usar base de datos PostgreSQL en producción
- Configurar CORS para dominio de producción
- Usar JWT_SECRET seguro

## 🧪 Testing

```bash
# Ejecutar tests del backend
npm run test:backend

# Ejecutar tests del frontend
npm run test:frontend

# Ejecutar todos los tests
npm test
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev                    # Iniciar backend y frontend
npm run dev:backend           # Solo backend
npm run dev:frontend          # Solo frontend

# Construcción
npm run build                 # Construir ambos
npm run build:backend         # Solo backend
npm run build:frontend        # Solo frontend

# Base de datos
npm run db:setup              # Configurar base de datos
npm run db:seed               # Poblar con datos de prueba

# Instalación
npm run install:all           # Instalar todas las dependencias
npm run setup                 # Instalación completa
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación de la API

---

**Mambo PetShop** - Tu tienda de confianza para mascotas 🐕🐱🐦 