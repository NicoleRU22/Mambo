# Mambo PetShop - E-commerce para Mascotas

Un sistema completo de e-commerce para productos de mascotas construido con React + TypeScript (frontend) y Node.js + Express + Prisma (backend).

## 🚀 Características

### Frontend (React + TypeScript)
- **Autenticación completa** con JWT y contexto de React
- **Catálogo de productos** con filtros y búsqueda
- **Carrito de compras** persistente
- **Panel de administración** para gestión de productos y pedidos
- **Diseño responsive** con Tailwind CSS y shadcn/ui
- **Protección de rutas** basada en roles

### Backend (Node.js + Express + Prisma)
- **API RESTful** completa
- **Autenticación JWT** con middleware de protección
- **Base de datos PostgreSQL** con Prisma ORM
- **Validación de datos** con express-validator
- **Middleware de seguridad** (CORS, Helmet, Rate Limiting)
- **Gestión de archivos** para imágenes de productos

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd MamboPetShop
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

#### Configurar variables de entorno
Crear un archivo `.env` en la carpeta `backend`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mambo_petshop"

# JWT
JWT_SECRET="tu_jwt_secret_super_seguro_aqui"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

#### Configurar la base de datos
```bash
# Generar y ejecutar migraciones
npx prisma migrate dev

# Opcional: Poblar la base de datos con datos de ejemplo
npx prisma db seed
```

#### Iniciar el servidor backend
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

### 3. Configurar el Frontend

```bash
cd front
npm install
```

#### Configurar variables de entorno
Crear un archivo `.env` en la carpeta `front`:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Environment
VITE_NODE_ENV=development
```

#### Iniciar el servidor frontend
```bash
npm run dev
```

## 📚 Estructura del Proyecto

```
MamboPetShop/
├── backend/                 # Servidor Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuración de base de datos
│   │   ├── controllers/    # Controladores de la API
│   │   ├── middleware/     # Middleware (auth, validation)
│   │   ├── models/         # Modelos de datos
│   │   ├── routes/         # Rutas de la API
│   │   └── server.js       # Servidor principal
│   ├── prisma/             # Configuración de Prisma
│   └── package.json
├── front/                   # Aplicación React + TypeScript
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── contexts/       # Contextos de React (Auth)
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Servicios API
│   │   └── App.tsx         # Componente principal
│   └── package.json
└── README.md
```

## 🔐 Autenticación y Autorización

### Roles de Usuario
- **USER**: Usuario regular que puede comprar productos
- **ADMIN**: Administrador con acceso al panel de administración

### Endpoints Protegidos
- `/api/cart/*` - Requiere autenticación
- `/api/orders/*` - Requiere autenticación
- `/api/products/*` (POST, PUT, DELETE) - Requiere rol ADMIN
- `/api/users/*` - Requiere autenticación

### Flujo de Autenticación
1. Usuario se registra/inicia sesión
2. Backend genera token JWT
3. Frontend almacena token en localStorage
4. Token se incluye automáticamente en todas las requests
5. Middleware valida token en cada request protegido

## 🛒 Funcionalidades del E-commerce

### Catálogo de Productos
- Listado con paginación
- Filtros por categoría, precio, tipo de mascota
- Búsqueda por nombre y descripción
- Ordenamiento por precio, rating, nombre

### Carrito de Compras
- Agregar/remover productos
- Actualizar cantidades
- Cálculo automático de totales
- Persistencia en base de datos

### Proceso de Compra
- Checkout con información de envío
- Múltiples métodos de pago
- Confirmación de pedido
- Seguimiento de estado

### Panel de Administración
- Gestión de productos (CRUD)
- Gestión de pedidos
- Estadísticas de ventas
- Gestión de usuarios

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil
- `POST /api/auth/logout` - Cerrar sesión

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto (ADMIN)
- `PUT /api/products/:id` - Actualizar producto (ADMIN)
- `DELETE /api/products/:id` - Eliminar producto (ADMIN)

### Carrito
- `GET /api/cart` - Obtener carrito
- `POST /api/cart` - Agregar al carrito
- `PUT /api/cart/:id` - Actualizar cantidad
- `DELETE /api/cart/:id` - Remover del carrito

### Pedidos
- `GET /api/orders` - Listar pedidos del usuario
- `POST /api/orders` - Crear pedido
- `GET /api/orders/:id` - Obtener pedido
- `PUT /api/orders/:id/status` - Actualizar estado (ADMIN)

## 🚀 Despliegue

### Backend (Heroku/Railway)
1. Configurar variables de entorno en la plataforma
2. Conectar base de datos PostgreSQL
3. Ejecutar migraciones: `npx prisma migrate deploy`

### Frontend (Vercel/Netlify)
1. Configurar variables de entorno
2. Conectar repositorio
3. Configurar build command: `npm run build`

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd front
npm test
```

## 📝 Scripts Disponibles

### Backend
- `npm run dev` - Iniciar servidor en modo desarrollo
- `npm start` - Iniciar servidor en producción
- `npm run migrate` - Ejecutar migraciones
- `npm run seed` - Poblar base de datos

### Frontend
- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de producción

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🔄 Actualizaciones

Para mantener el proyecto actualizado:

```bash
# Backend
cd backend
npm update

# Frontend
cd front
npm update
```

---

**Desarrollado con ❤️ para Mambo PetShop** 