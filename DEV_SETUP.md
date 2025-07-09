# 🚀 Mambo PetShop - Guía de Desarrollo

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Git

## 🛠️ Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <tu-repositorio>
   cd MamboPetShop
   ```

2. **Instalar todas las dependencias:**
   ```bash
   npm run install:all
   ```

## 🚀 Ejecutar el Proyecto

### Opción 1: Usando npm (Recomendado)
```bash
npm run dev
```

### Opción 2: Usando el script de PowerShell
```powershell
.\dev.ps1
```

### Opción 3: Usando el script batch
```cmd
dev.bat
```

## 📱 Puertos de Desarrollo

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:4000

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Ejecuta backend y frontend simultáneamente |
| `npm run dev:backend-only` | Ejecuta solo el backend (puerto 4000) |
| `npm run dev:frontend-only` | Ejecuta solo el frontend (puerto 3000) |
| `npm run build` | Construye backend y frontend para producción |
| `npm run install:all` | Instala todas las dependencias |
| `npm run clean` | Limpia node_modules y archivos de build |

## 🗄️ Base de Datos

El proyecto está configurado para usar **SQLite** en desarrollo, lo que facilita la configuración inicial.

### Configuración de Base de Datos

1. El archivo `.env` se crea automáticamente en la carpeta `backend/`
2. La base de datos SQLite se crea automáticamente en `backend/dev.db`

### Migraciones (si usas PostgreSQL/MySQL)

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
npm run install:all
```

### Error: "Port already in use"
```bash
# En Windows
netstat -ano | findstr :3000
netstat -ano | findstr :4000
# Luego mata el proceso con el PID correspondiente
taskkill /PID <PID> /F
```

### Error: "concurrently not found"
```bash
npm install concurrently --save-dev
```

## 📁 Estructura del Proyecto

```
MamboPetShop/
├── backend/          # API REST (Node.js + Express)
├── front/           # Frontend (React + Vite)
├── dev.ps1          # Script PowerShell para desarrollo
├── dev.bat          # Script batch para desarrollo
└── package.json     # Scripts principales
```

## 🔄 Flujo de Desarrollo

1. Ejecuta `npm run dev` desde la carpeta raíz
2. El backend se iniciará en http://localhost:4000
3. El frontend se iniciará en http://localhost:3000
4. Ambos servicios se recargarán automáticamente al hacer cambios

## 🛑 Detener Servicios

Presiona `Ctrl + C` en la terminal donde ejecutaste el comando para detener todos los servicios.

## 📝 Notas Importantes

- El backend usa **SQLite** por defecto para facilitar el desarrollo
- El frontend usa **Vite** para desarrollo rápido
- Los archivos `.env` se crean automáticamente si no existen
- Ambos servicios tienen hot-reload habilitado

## 🆘 Soporte

Si encuentras problemas:

1. Verifica que Node.js esté actualizado
2. Ejecuta `npm run clean` y luego `npm run install:all`
3. Asegúrate de que los puertos 3000 y 4000 estén libres
4. Revisa los logs en la consola para errores específicos 