# Corrección de login y registro

## Problema

La interfaz enviaba las solicitudes, pero los errores se asignaban a propiedades normales en una aplicación Angular zoneless. Por eso la vista no se actualizaba y parecía que el botón no hacía nada. Además, los guards podían ejecutarse antes de terminar la restauración del token.

## Solución

- Login y registro muestran estado de carga, errores generales y errores por campo.
- El registro valida letras y números, igual que `RegisterRequest`.
- `AuthService` restaura la sesión una sola vez y expone su estado listo.
- Los guards esperan la restauración antes de decidir si permiten la ruta.
- El interceptor envía `Accept: application/json` y el Bearer únicamente a la API.
- Se agregó configuración CORS parametrizada por `CORS_ALLOWED_ORIGINS` y rewrite SPA para Vercel.

## Verificación pendiente

En producción se debe configurar `CORS_ALLOWED_ORIGINS` con el dominio exacto de Vercel, ejecutar migraciones y confirmar que `PRODUCTION_API_URL` apunta al Railway correcto. Si el navegador sigue mostrando status 0, revisar la pestaña Network y los logs de Railway.
