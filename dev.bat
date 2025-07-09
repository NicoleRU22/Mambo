@echo off
echo 🚀 Iniciando Mambo PetShop...
echo.

REM Verificar que las carpetas existan
if not exist "backend" (
    echo ❌ Error: No se encontró la carpeta 'backend'
    pause
    exit /b 1
)

if not exist "front" (
    echo ❌ Error: No se encontró la carpeta 'front'
    pause
    exit /b 1
)

REM Crear archivo .env para backend si no existe
if not exist "backend\.env" (
    echo 📝 Creando archivo .env para backend...
    (
        echo # Server Configuration
        echo PORT=4000
        echo NODE_ENV=development
        echo.
        echo # Database Configuration ^(usando SQLite para desarrollo fácil^)
        echo DATABASE_URL="file:./dev.db"
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=your_super_secret_jwt_key_here_for_development_only
        echo JWT_EXPIRES_IN=7d
        echo.
        echo # CORS Configuration
        echo FRONTEND_URL=http://localhost:3000
        echo.
        echo # File Upload Configuration
        echo MAX_FILE_SIZE=5242880
        echo UPLOAD_PATH=./uploads
    ) > backend\.env
)

echo ✅ Configuración completada!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:4000
echo.
echo Presiona cualquier tecla para iniciar los servicios...
pause >nul

REM Iniciar servicios usando npm run dev
echo 🔄 Iniciando servicios...
npm run dev

pause 