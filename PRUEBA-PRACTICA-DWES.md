# Prueba Práctica - DWES (Servidor)

## Endpoint creado

He creado el endpoint `GET /api/ranking` que devuelve el ranking de los juegos mejor valorados.

**URL:** `GET /api/ranking?limite=10`

El parámetro `limite` es opcional (por defecto 10) y controla cuántos juegos se devuelven.

### ¿Por qué este endpoint?

Necesitaba un endpoint que devolviera los juegos ordenados por su puntuación media, calculada a partir de las reviews de los usuarios. A diferencia de los otros endpoints de juegos que ya tenía, este devuelve datos específicos para el ranking: la posición, la puntuación media y el número total de reviews de cada juego. Por eso creé un DTO nuevo (`JuegoRankingDTO`) en vez de reutilizar los que ya tenía.

### Archivos creados/modificados

| Archivo | Qué hace |
|---------|----------|
| `RankingController.java` | Controlador REST con el endpoint GET |
| `RankingService.java` | Lógica de negocio, transforma los datos del repo al DTO |
| `JuegoRankingDTO.java` | Record con los campos: posicion, id, nombre, imagenPortada, puntuacionMedia, totalReviews |
| `JuegoRepository.java` | Añadida la query `findRankingWithStats` con JPQL |

---

## Seguridad

El endpoint requiere autenticación porque cae dentro de `anyRequest().authenticated()` en la `SecurityConfig`. Todos los endpoints que no están explícitamente en la lista de `permitAll()` necesitan un token JWT para acceder.

### Cómo funciona la seguridad en el proyecto

- **JWT stateless**: no uso sesiones, cada petición lleva el token en el header `Authorization: Bearer <token>`.
- **CSRF deshabilitado**: al usar JWT no hace falta CSRF.
- **Filtro JWT** (`JwtAuthenticationFilter`): intercepta cada petición, extrae el token del header, lo valida y establece el contexto de seguridad.
- **Contraseñas**: se hashean con `BCryptPasswordEncoder`.
- **Token**: se firma con HMAC, contiene el userId, email, nombre y rol. Expira en 24h.

## Cómo probarlo

### Opción 1: Desde el navegador / Swagger

Con la app arrancada, ir a `http://localhost:8080/swagger-ui.html` y probar el endpoint de ranking desde ahí.

### Opción 2: Con curl

**Primero, hacer login para obtener el token:**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@looking4rate.com", "contrasenia": "admin123"}'
```

Copiar el `token` de la respuesta y usarlo:

```bash
curl http://localhost:8080/api/ranking?limite=5 \
  -H "Authorization: Bearer <TOKEN>"
```

### Opción 3: Con PowerShell

```powershell
# Login
$login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@looking4rate.com","contrasenia":"admin123"}'

# Guardar token
$token = $login.token

# Llamar al ranking
Invoke-RestMethod -Uri "http://localhost:8080/api/ranking?limite=5" -Headers @{"Authorization"="Bearer $token"}
```