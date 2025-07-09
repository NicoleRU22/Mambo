# Script para ejecutar backend y frontend simultáneamente
# Uso: .\dev.ps1

Write-Host "🚀 Iniciando Mambo PetShop..." -ForegroundColor Green
Write-Host ""

# Función para manejar la terminación del script
function Cleanup {
    Write-Host ""
    Write-Host "🛑 Deteniendo servicios..." -ForegroundColor Yellow
    if ($backendJob) { Stop-Job $backendJob; Remove-Job $backendJob }
    if ($frontendJob) { Stop-Job $frontendJob; Remove-Job $frontendJob }
    exit
}

# Configurar el manejador de eventos para Ctrl+C
trap { Cleanup }

# Verificar que las carpetas existan
if (-not (Test-Path "backend")) {
    Write-Host "❌ Error: No se encontró la carpeta 'backend'" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "front")) {
    Write-Host "❌ Error: No se encontró la carpeta 'front'" -ForegroundColor Red
    exit 1
}

# Crear archivo .env para backend si no existe
$backendEnvPath = "backend\.env"
if (-not (Test-Path $backendEnvPath)) {
    Write-Host "📝 Creando archivo .env para backend..." -ForegroundColor Yellow
    @"
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration (usando SQLite para desarrollo fácil)
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_for_development_only
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
"@ | Out-File -FilePath $backendEnvPath -Encoding UTF8
}

# Iniciar backend
Write-Host "🔧 Iniciando Backend (puerto 4000)..." -ForegroundColor Blue
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\backend
    $env:PORT = "4000"
    npm run dev
}

# Esperar un poco para que el backend se inicie
Start-Sleep -Seconds 3

# Iniciar frontend
Write-Host "🎨 Iniciando Frontend (puerto 3000)..." -ForegroundColor Green
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\front
    $env:PORT = "3000"
    npm run dev
}

Write-Host ""
Write-Host "✅ Servicios iniciados correctamente!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:4000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener todos los servicios" -ForegroundColor Yellow
Write-Host ""

# Mostrar logs en tiempo real
try {
    while ($true) {
        # Mostrar logs del backend
        $backendOutput = Receive-Job $backendJob -ErrorAction SilentlyContinue
        if ($backendOutput) {
            foreach ($line in $backendOutput) {
                Write-Host "[BACKEND] $line" -ForegroundColor Blue
            }
        }

        # Mostrar logs del frontend
        $frontendOutput = Receive-Job $frontendJob -ErrorAction SilentlyContinue
        if ($frontendOutput) {
            foreach ($line in $frontendOutput) {
                Write-Host "[FRONTEND] $line" -ForegroundColor Green
            }
        }

        # Verificar si los jobs siguen ejecutándose
        if ($backendJob.State -eq "Failed" -or $frontendJob.State -eq "Failed") {
            Write-Host "❌ Error: Uno de los servicios falló" -ForegroundColor Red
            break
        }

        Start-Sleep -Milliseconds 500
    }
}
finally {
    Cleanup
} 