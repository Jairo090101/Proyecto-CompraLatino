# CompraLatino — Backend (Laravel)

API REST de CompraLatino, una tienda que importa productos desde Japón hacia Latinoamérica.
Este backend está construido con **Laravel 13** y **PHP 8.4** y usa **Laravel Sanctum** para la autenticación con tokens.

> Estado actual: solo está implementado el módulo de **registro e inicio de sesión de usuarios**.
> Productos, pedidos y demás módulos están pendientes.

## Contenido

1. [Requisitos](#requisitos)
2. [Puesta en marcha](#puesta-en-marcha)
3. [Cambios realizados](#cambios-realizados)
4. [Cómo funciona la autenticación](#cómo-funciona-la-autenticación)
5. [Referencia de la API](#referencia-de-la-api)
6. [Probar la API manualmente](#probar-la-api-manualmente)
7. [Pruebas automáticas](#pruebas-automáticas)
8. [Notas y pendientes](#notas-y-pendientes)

---

## Requisitos

| Herramienta | Versión |
|---|---|
| PHP | 8.4.1 o superior (el `composer.lock` lo exige por Symfony 8) |
| Extensiones de PHP | `pdo_sqlite`, `mbstring`, `xml`/`dom`, `curl`, `zip` |
| Composer | 2.x |
| Base de datos | SQLite (configurada por defecto) |

## Puesta en marcha

Desde la carpeta `compraLatino/`:

```sh
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve        # http://localhost:8000
```

Los archivos `.env` y `database/database.sqlite` no se suben a git. Cada desarrollador crea los suyos.

---

## Cambios realizados

### Dependencias

| Cambio | Detalle |
|---|---|
| `laravel/sanctum` ^4.3 | Se agregó con `composer require`. Modifica `composer.json` y `composer.lock`. |
| Configuración publicada | `config/sanctum.php`. |
| Migración publicada | `database/migrations/2026_10_09_004813_create_personal_access_tokens_table.php`. Crea la tabla donde se guardan los tokens. |

### Archivos nuevos

| Archivo | Responsabilidad |
|---|---|
| `app/Http/Controllers/Auth/AuthController.php` | Contiene las acciones `register`, `login`, `logout` y `me`. |
| `app/Http/Requests/Auth/RegisterRequest.php` | Reglas de validación del registro. |
| `app/Http/Requests/Auth/LoginRequest.php` | Reglas de validación del inicio de sesión. |
| `app/Http/Resources/UserResource.php` | Define qué campos del usuario se exponen en las respuestas. |
| `routes/api.php` | Define las rutas de la API bajo `/api/auth`. |
| `tests/Feature/Auth/AuthTest.php` | 6 pruebas automáticas del flujo de autenticación. |

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `app/Models/User.php` | Se agregó el trait `HasApiTokens` de Sanctum para poder crear y revocar tokens. |
| `bootstrap/app.php` | Se registró `routes/api.php` y se configuró que las peticiones a `api/*` sin autenticar respondan **401** en lugar de redirigir a una ruta `login` que no existe. |
| `composer.json`, `composer.lock` | Incluyen la dependencia de Sanctum. |

### Corrección durante las pruebas

Al probar con `curl` se detectó que `GET /api/auth/me` sin token y sin la cabecera `Accept: application/json` respondía **500**
(`Route [login] not defined`). Se corrigió con `redirectGuestsTo` en `bootstrap/app.php`, y se agregó la prueba
`test_me_returns_401_even_without_json_accept_header` para evitar que vuelva a ocurrir.

---

## Cómo funciona la autenticación

Se usa **autenticación por tokens Bearer** con Sanctum. El flujo es el mismo para cualquier cliente (el frontend Angular, Postman, curl):

```
 Cliente                                        API Laravel
    │  POST /api/auth/register  (o /login)          │
    │ ─────────────────────────────────────────────▶│  valida datos
    │                                               │  crea/verifica el usuario
    │                                               │  genera un token
    │◀───────────────────────────────────────────── │
    │  { user, token, token_type: "Bearer" }        │
    │                                               │
    │  GET /api/auth/me                             │
    │  Authorization: Bearer <token>                │
    │ ─────────────────────────────────────────────▶│  Sanctum valida el token
    │◀───────────────────────────────────────────── │
    │  { data: { id, name, email, ... } }           │
    │                                               │
    │  POST /api/auth/logout  (con el token)        │
    │ ─────────────────────────────────────────────▶│  borra ese token
```

### Registro (`register`)

1. `RegisterRequest` valida la entrada antes de llegar al controlador:
   - `name`: obligatorio, texto, máximo 255 caracteres.
   - `email`: obligatorio, formato de correo válido, máximo 255 caracteres y **único** en la tabla `users`.
   - `password`: obligatorio, mínimo 8 caracteres, con al menos una letra y un número, y debe coincidir con `password_confirmation`.
2. Si la validación falla, se responde **422** con el detalle por campo.
3. Si pasa, se crea el usuario con solo los campos `name`, `email` y `password`. El modelo `User` cifra la contraseña automáticamente (cast `hashed`, bcrypt). Nunca se guarda en texto plano.
4. Se genera un token de acceso con `createToken('auth')` y se responde **201** con el usuario y el token.

### Inicio de sesión (`login`)

1. `LoginRequest` valida que lleguen `email` y `password`.
2. Se busca el usuario por correo y se compara la contraseña con `Hash::check`.
3. Si el correo no existe **o** la contraseña es incorrecta, se responde **422** con el mismo mensaje en ambos casos
   (`Las credenciales proporcionadas son incorrectas.`). Así no se revela si un correo está registrado.
4. Si son correctas, se genera un token nuevo y se responde **200** con el usuario y el token.

Cada login crea un token independiente. Un mismo usuario puede tener sesiones abiertas en varios dispositivos.

### Cierre de sesión (`logout`)

Requiere token. Borra **solo el token con el que se hizo la petición** (`currentAccessToken()->delete()`). Las sesiones abiertas
en otros dispositivos siguen activas. El token revocado deja de funcionar de inmediato y responde **401**.

### Usuario actual (`me`)

Requiere token. Devuelve los datos del usuario dueño del token. El cliente lo usa, por ejemplo, para restaurar la sesión al recargar la página.

### Protección de rutas

Las rutas `logout` y `me` están dentro del grupo `auth:sanctum`. Para proteger futuros endpoints (carrito, pedidos, perfil), basta
con ponerlos dentro del mismo grupo en `routes/api.php`:

```php
Route::middleware('auth:sanctum')->group(function () {
    // rutas que requieren sesión iniciada
});
```

### Límite de intentos

| Ruta | Límite |
|---|---|
| `POST /api/auth/login` | 5 peticiones por minuto |
| `POST /api/auth/register` | 10 peticiones por minuto |

Al superarlo, la API responde **429 Too Many Attempts**. Esto dificulta los ataques de fuerza bruta contra las contraseñas.

### Datos que se exponen del usuario

`UserResource` devuelve únicamente `id`, `name`, `email` y `created_at`. La contraseña y el `remember_token` nunca se incluyen
(además están marcados como `Hidden` en el modelo).

---

## Referencia de la API

Todas las rutas usan el prefijo `/api/auth`. Se recomienda enviar siempre `Accept: application/json` y `Content-Type: application/json`.

### `POST /api/auth/register`

Cuerpo:

```json
{
  "name": "Ana Pérez",
  "email": "ana@example.com",
  "password": "secreto123",
  "password_confirmation": "secreto123"
}
```

Respuesta **201**:

```json
{
  "user": { "id": 1, "name": "Ana Pérez", "email": "ana@example.com", "created_at": "2026-10-09T00:50:43.000000Z" },
  "token": "1|6rwfh55jk1hhjyfzm2fXob2rIkyn9sJoDNGX428ye607d57d",
  "token_type": "Bearer"
}
```

Respuesta **422** (validación):

```json
{
  "message": "The email field must be a valid email address.",
  "errors": { "email": ["The email field must be a valid email address."] }
}
```

### `POST /api/auth/login`

Cuerpo:

```json
{ "email": "ana@example.com", "password": "secreto123" }
```

- **200**: misma estructura que el registro (`user`, `token`, `token_type`).
- **422**: credenciales incorrectas.

```json
{
  "message": "Las credenciales proporcionadas son incorrectas.",
  "errors": { "email": ["Las credenciales proporcionadas son incorrectas."] }
}
```

### `GET /api/auth/me`

Cabecera: `Authorization: Bearer <token>`

- **200**: `{ "data": { "id": 1, "name": "Ana Pérez", "email": "ana@example.com", "created_at": "..." } }`
- **401**: token ausente, inválido o revocado.

### `POST /api/auth/logout`

Cabecera: `Authorization: Bearer <token>`

- **200**: `{ "message": "Sesión cerrada correctamente." }`
- **401**: token ausente, inválido o revocado.

### Resumen de códigos de estado

| Código | Significado |
|---|---|
| 200 | Operación correcta. |
| 201 | Usuario creado. |
| 401 | No autenticado (sin token, o token inválido o revocado). |
| 422 | Datos inválidos o credenciales incorrectas. |
| 429 | Demasiados intentos; esperar un minuto. |

---

## Probar la API manualmente

Con el servidor levantado (`php artisan serve`), en PowerShell:

```powershell
# 1. Registro
$r = Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/auth/register `
  -ContentType 'application/json' `
  -Body '{"name":"Ana","email":"ana@example.com","password":"secreto123","password_confirmation":"secreto123"}'

# 2. Consultar el usuario con el token recibido
Invoke-RestMethod -Uri http://localhost:8000/api/auth/me `
  -Headers @{ Authorization = "Bearer $($r.token)" }

# 3. Cerrar sesión
Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/auth/logout `
  -Headers @{ Authorization = "Bearer $($r.token)" }
```

Con `curl` (bash):

```sh
curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","password":"secreto123"}'
```

También se puede usar Postman o la extensión Thunder Client de VS Code: `POST` con cuerpo JSON para registro y login, y la
cabecera `Authorization: Bearer <token>` para `me` y `logout`.

---

## Pruebas automáticas

```sh
php artisan test
```

`tests/Feature/Auth/AuthTest.php` cubre:

| Prueba | Verifica |
|---|---|
| `test_user_can_register` | El registro responde 201, devuelve token, no expone la contraseña y guarda el usuario. |
| `test_register_validates_input` | Rechaza correo repetido y contraseña que no coincide (422). |
| `test_user_can_login` | El login con credenciales correctas devuelve el token. |
| `test_login_fails_with_wrong_credentials` | Contraseña incorrecta responde 422. |
| `test_me_requires_authentication` | `/me` sin token responde 401. |
| `test_me_returns_401_even_without_json_accept_header` | `/me` sin token ni cabecera `Accept` responde 401 y no 500. |
| `test_authenticated_user_can_get_profile_and_logout` | Flujo completo: registro, `/me`, logout y token eliminado de la base. |

Estado al momento de escribir este documento: **9 pruebas pasan** (las 7 de arriba más las 2 de ejemplo de Laravel).

---

## Notas y pendientes

- **Expiración de tokens:** `config/sanctum.php` deja `expiration` en `null`, así que los tokens no caducan solos hasta que se hace logout.
  Conviene definir una duración antes de producción.
- **Mensajes de validación:** los mensajes de las reglas salen en inglés porque `APP_LOCALE=en`. El mensaje de credenciales incorrectas sí está en español.
- **CORS:** el frontend Angular (`http://localhost:4200`) llamará a la API desde otro origen. Hay que revisar y configurar CORS al conectarlos.
- **Verificación de correo y recuperación de contraseña:** no están implementadas. La tabla `password_reset_tokens` ya existe.
- **Roles:** no hay distinción entre usuario y administrador. La navbar del frontend ya prevé una sección Admin.
- **Frontend:** faltan las pantallas de login y registro, un servicio de autenticación y un interceptor HTTP que envíe el token.
- **Base de datos en producción:** SQLite sirve para desarrollo; hay que decidir el motor definitivo (MySQL, PostgreSQL).
