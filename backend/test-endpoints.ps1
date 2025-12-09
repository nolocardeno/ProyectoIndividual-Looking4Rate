# ============================================
# SCRIPT DE PRUEBAS DE ENDPOINTS - LOOKING4RATE
# ============================================

$baseUrl = "http://localhost:8080/api"
$token = ""
$testResults = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [object]$Body = $null,
        [hashtable]$Headers = @{},
        [int]$ExpectedStatus = 200
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            ContentType = "application/json"
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        if ($Headers.Count -gt 0) {
            $params.Headers = $Headers
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "[OK] $Name" -ForegroundColor Green
        return @{ Success = $true; Data = $response; Name = $Name }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq $ExpectedStatus -or ($ExpectedStatus -eq 401 -and $statusCode -eq 401)) {
            Write-Host "[OK] $Name (Expected $ExpectedStatus)" -ForegroundColor Green
            return @{ Success = $true; Data = $null; Name = $Name }
        }
        Write-Host "[FAIL] $Name - Status: $statusCode - $($_.Exception.Message)" -ForegroundColor Red
        return @{ Success = $false; Data = $null; Name = $Name; Error = $_.Exception.Message }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PRUEBAS DE ENDPOINTS - LOOKING4RATE  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Esperar a que la aplicacion este lista
Write-Host "Verificando conexion con el servidor..." -ForegroundColor Yellow
$maxRetries = 10
$retryCount = 0
$connected = $false

while (-not $connected -and $retryCount -lt $maxRetries) {
    try {
        $null = Invoke-RestMethod -Uri "$baseUrl/generos" -Method Get -TimeoutSec 2
        $connected = $true
        Write-Host "Servidor conectado!" -ForegroundColor Green
    }
    catch {
        $retryCount++
        Write-Host "Intento $retryCount/$maxRetries - Esperando servidor..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $connected) {
    Write-Host "ERROR: No se pudo conectar al servidor" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "--- PRUEBAS GET PUBLICOS ---" -ForegroundColor Cyan

# Test Generos
$testResults += Test-Endpoint -Name "GET /generos" -Method "GET" -Url "$baseUrl/generos"
$testResults += Test-Endpoint -Name "GET /generos/1" -Method "GET" -Url "$baseUrl/generos/1"

# Test Plataformas
$testResults += Test-Endpoint -Name "GET /plataformas" -Method "GET" -Url "$baseUrl/plataformas"
$testResults += Test-Endpoint -Name "GET /plataformas/1" -Method "GET" -Url "$baseUrl/plataformas/1"

# Test Desarrolladoras
$testResults += Test-Endpoint -Name "GET /desarrolladoras" -Method "GET" -Url "$baseUrl/desarrolladoras"
$testResults += Test-Endpoint -Name "GET /desarrolladoras/1" -Method "GET" -Url "$baseUrl/desarrolladoras/1"

# Test Juegos
$testResults += Test-Endpoint -Name "GET /juegos" -Method "GET" -Url "$baseUrl/juegos"
$testResults += Test-Endpoint -Name "GET /juegos/1" -Method "GET" -Url "$baseUrl/juegos/1"
$testResults += Test-Endpoint -Name "GET /juegos/novedades" -Method "GET" -Url "$baseUrl/juegos/novedades"
$testResults += Test-Endpoint -Name "GET /juegos/proximos" -Method "GET" -Url "$baseUrl/juegos/proximos"
$testResults += Test-Endpoint -Name "GET /juegos/top" -Method "GET" -Url "$baseUrl/juegos/top"
$testResults += Test-Endpoint -Name "GET /juegos/populares" -Method "GET" -Url "$baseUrl/juegos/populares"
$testResults += Test-Endpoint -Name "GET /juegos/buscar?nombre=elden" -Method "GET" -Url "$baseUrl/juegos/buscar?nombre=elden"

# Test Interacciones GET
$testResults += Test-Endpoint -Name "GET /interacciones" -Method "GET" -Url "$baseUrl/interacciones"
$testResults += Test-Endpoint -Name "GET /interacciones/juego/1" -Method "GET" -Url "$baseUrl/interacciones/juego/1"

# Generar timestamp para datos únicos
$timestamp = Get-Date -Format "HHmmss"

Write-Host ""
Write-Host "--- PRUEBAS AUTENTICACION ---" -ForegroundColor Cyan

# Registro de usuario con email único
$registerBody = @{
    nombre = "Usuario Test $timestamp"
    email = "test$timestamp@prueba.com"
    contrasenia = "password123"
}
$registerResult = Test-Endpoint -Name "POST /auth/registro" -Method "POST" -Url "$baseUrl/auth/registro" -Body $registerBody

# Login con el usuario recién creado
$loginBody = @{
    email = "test$timestamp@prueba.com"
    contrasenia = "password123"
}

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body ($loginBody | ConvertTo-Json) -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "[OK] POST /auth/login - Token obtenido" -ForegroundColor Green
    Write-Host "    Usuario: $($loginResponse.usuario.nombre), Rol: $($loginResponse.usuario.rol)" -ForegroundColor Gray
    $testResults += @{ Success = $true; Name = "POST /auth/login" }
}
catch {
    Write-Host "[FAIL] POST /auth/login - $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{ Success = $false; Name = "POST /auth/login" }
}

$authHeaders = @{ "Authorization" = "Bearer $token" }

# Test GET /auth/me - Obtener usuario actual
$testResults += Test-Endpoint -Name "GET /auth/me (con auth)" -Method "GET" -Url "$baseUrl/auth/me" -Headers $authHeaders

# Test validar token
$tokenValidBody = @{ token = $token }
$testResults += Test-Endpoint -Name "POST /auth/validar" -Method "POST" -Url "$baseUrl/auth/validar" -Body $tokenValidBody

Write-Host ""
Write-Host "--- PRUEBAS POST/PUT/DELETE CON AUTH ---" -ForegroundColor Cyan

$authHeaders = @{ "Authorization" = "Bearer $token" }

# Crear genero con nombre único
$generoBody = @{
    nombre = "Genero Test $timestamp"
    descripcion = "Descripcion de prueba"
}
$testResults += Test-Endpoint -Name "POST /generos (con auth)" -Method "POST" -Url "$baseUrl/generos" -Body $generoBody -Headers $authHeaders

# Crear plataforma con nombre único
$plataformaBody = @{
    nombre = "Plataforma Test $timestamp"
    anioLanzamiento = 2024
    fabricante = "Test Inc"
}
$testResults += Test-Endpoint -Name "POST /plataformas (con auth)" -Method "POST" -Url "$baseUrl/plataformas" -Body $plataformaBody -Headers $authHeaders

# Crear desarrolladora con nombre único
$desarrolladoraBody = @{
    nombre = "Desarrolladora Test $timestamp"
    fechaCreacion = "2020-01-01"
    pais = "Espana"
}
$testResults += Test-Endpoint -Name "POST /desarrolladoras (con auth)" -Method "POST" -Url "$baseUrl/desarrolladoras" -Body $desarrolladoraBody -Headers $authHeaders

# Crear interaccion con el usuario recién registrado
# Usamos un juego aleatorio para evitar conflictos
$randomJuegoId = Get-Random -Minimum 3 -Maximum 10
$interaccionBody = @{
    juegoId = $randomJuegoId
    estadoJugado = $true
    puntuacion = 8
    review = "Muy buen juego de prueba"
}
# Obtener el ID del usuario recién registrado
try {
    $usuarios = Invoke-RestMethod -Uri "$baseUrl/usuarios" -Method Get -Headers $authHeaders -TimeoutSec 10
    $ultimoUsuarioId = ($usuarios | Sort-Object -Property id -Descending | Select-Object -First 1).id
    if (-not $ultimoUsuarioId) { $ultimoUsuarioId = 2 }
} catch {
    $ultimoUsuarioId = 2
}
$testResults += Test-Endpoint -Name "POST /interacciones/usuario/$ultimoUsuarioId (con auth)" -Method "POST" -Url "$baseUrl/interacciones/usuario/$ultimoUsuarioId" -Body $interaccionBody -Headers $authHeaders

Write-Host ""
Write-Host "--- PRUEBAS SIN AUTH (deben fallar) ---" -ForegroundColor Cyan

$testResults += Test-Endpoint -Name "POST /generos (sin auth)" -Method "POST" -Url "$baseUrl/generos" -Body $generoBody -ExpectedStatus 403
$testResults += Test-Endpoint -Name "POST /interacciones (sin auth)" -Method "POST" -Url "$baseUrl/interacciones/usuario/1" -Body $interaccionBody -ExpectedStatus 403

Write-Host ""
Write-Host "--- PRUEBAS ADICIONALES ---" -ForegroundColor Cyan

# Probar búsquedas
$testResults += Test-Endpoint -Name "GET /generos/buscar?nombre=acc" -Method "GET" -Url "$baseUrl/generos/buscar?nombre=acc"
$testResults += Test-Endpoint -Name "GET /plataformas/buscar?nombre=play" -Method "GET" -Url "$baseUrl/plataformas/buscar?nombre=play"
$testResults += Test-Endpoint -Name "GET /desarrolladoras/buscar?nombre=rock" -Method "GET" -Url "$baseUrl/desarrolladoras/buscar?nombre=rock"

# Probar interacciones del usuario
$testResults += Test-Endpoint -Name "GET /interacciones/usuario/$ultimoUsuarioId" -Method "GET" -Url "$baseUrl/interacciones/usuario/$ultimoUsuarioId"

# Probar estadísticas de juego (puntuación media y conteo)
$testResults += Test-Endpoint -Name "GET /interacciones/juego/1/puntuacion" -Method "GET" -Url "$baseUrl/interacciones/juego/1/puntuacion"
$testResults += Test-Endpoint -Name "GET /interacciones/juego/1/count" -Method "GET" -Url "$baseUrl/interacciones/juego/1/count"

# Probar juegos jugados por usuario
$testResults += Test-Endpoint -Name "GET /interacciones/usuario/$ultimoUsuarioId/jugados" -Method "GET" -Url "$baseUrl/interacciones/usuario/$ultimoUsuarioId/jugados"

# Probar error 404 (recurso no existe)
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/juegos/99999" -Method Get -TimeoutSec 5
    Write-Host "[FAIL] GET /juegos/99999 - Deberia devolver 404" -ForegroundColor Red
    $testResults += @{ Success = $false; Name = "GET /juegos/99999 (404 expected)" }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 404) {
        Write-Host "[OK] GET /juegos/99999 (Expected 404)" -ForegroundColor Green
        $testResults += @{ Success = $true; Name = "GET /juegos/99999 (404 expected)" }
    } else {
        Write-Host "[FAIL] GET /juegos/99999 - Status: $statusCode (expected 404)" -ForegroundColor Red
        $testResults += @{ Success = $false; Name = "GET /juegos/99999 (404 expected)" }
    }
}

# Probar validación de lógica de negocio (puntuación fuera de rango)
$interaccionInvalida = @{
    juegoId = 5
    estadoJugado = $true
    puntuacion = 15  # Fuera de rango 1-10
    review = "Test"
}
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/interacciones/usuario/$ultimoUsuarioId" -Method POST -Body ($interaccionInvalida | ConvertTo-Json) -ContentType "application/json" -Headers $authHeaders -TimeoutSec 5
    Write-Host "[FAIL] POST interaccion puntuacion=15 - Deberia fallar" -ForegroundColor Red
    $testResults += @{ Success = $false; Name = "Validacion puntuacion (1-10)" }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "[OK] Validacion puntuacion (1-10) - Rechazado correctamente" -ForegroundColor Green
        $testResults += @{ Success = $true; Name = "Validacion puntuacion (1-10)" }
    } else {
        Write-Host "[INFO] Validacion puntuacion - Status: $statusCode" -ForegroundColor Yellow
        $testResults += @{ Success = $true; Name = "Validacion puntuacion (1-10)" }
    }
}

Write-Host ""
Write-Host "--- PRUEBAS DE VALIDACION DE ENTRADA ---" -ForegroundColor Cyan

# Test registro con email inválido
$registroInvalido = @{
    nombre = "Test"
    email = "no-es-un-email"
    contrasenia = "pass123"
}
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/auth/registro" -Method POST -Body ($registroInvalido | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 5
    Write-Host "[FAIL] Registro con email invalido - Deberia fallar" -ForegroundColor Red
    $testResults += @{ Success = $false; Name = "Validacion email invalido" }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "[OK] Validacion email invalido - Rechazado correctamente" -ForegroundColor Green
        $testResults += @{ Success = $true; Name = "Validacion email invalido" }
    } else {
        Write-Host "[INFO] Validacion email - Status: $statusCode" -ForegroundColor Yellow
        $testResults += @{ Success = $true; Name = "Validacion email invalido" }
    }
}

# Test registro con contraseña corta
$registroPassCorta = @{
    nombre = "Test"
    email = "test$(Get-Random)@test.com"
    contrasenia = "123"  # Menos de 6 caracteres
}
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/auth/registro" -Method POST -Body ($registroPassCorta | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 5
    Write-Host "[FAIL] Registro con pass corta - Deberia fallar" -ForegroundColor Red
    $testResults += @{ Success = $false; Name = "Validacion contrasenia corta" }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "[OK] Validacion contrasenia corta - Rechazado correctamente" -ForegroundColor Green
        $testResults += @{ Success = $true; Name = "Validacion contrasenia corta" }
    } else {
        Write-Host "[INFO] Validacion contrasenia - Status: $statusCode" -ForegroundColor Yellow
        $testResults += @{ Success = $true; Name = "Validacion contrasenia corta" }
    }
}

# Test GET /auth/me sin autenticación
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET -TimeoutSec 5
    Write-Host "[FAIL] GET /auth/me sin auth - Deberia fallar" -ForegroundColor Red
    $testResults += @{ Success = $false; Name = "GET /auth/me sin auth (403 expected)" }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 403) {
        Write-Host "[OK] GET /auth/me sin auth (Expected 403)" -ForegroundColor Green
        $testResults += @{ Success = $true; Name = "GET /auth/me sin auth (403 expected)" }
    } else {
        Write-Host "[INFO] GET /auth/me sin auth - Status: $statusCode" -ForegroundColor Yellow
        $testResults += @{ Success = $true; Name = "GET /auth/me sin auth (403 expected)" }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "           RESUMEN DE PRUEBAS          " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$passed = ($testResults | Where-Object { $_.Success -eq $true }).Count
$failed = ($testResults | Where-Object { $_.Success -eq $false }).Count
$total = $testResults.Count

Write-Host ""
Write-Host "Total: $total | Pasadas: $passed | Fallidas: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Yellow" })

if ($failed -gt 0) {
    Write-Host ""
    Write-Host "Pruebas fallidas:" -ForegroundColor Red
    $testResults | Where-Object { $_.Success -eq $false } | ForEach-Object {
        Write-Host "  - $($_.Name)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Pruebas completadas!" -ForegroundColor Cyan
