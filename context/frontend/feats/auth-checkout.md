# Frontend: autenticación y checkout

## Implementado

Angular usa `AuthService` con signals, persistencia del token Bearer, interceptor HTTP y guards para rutas privadas. Login y registro consumen los endpoints Laravel y muestran errores de validación. Checkout convierte el carrito en líneas de pedido y la pantalla de compras consulta el historial.

## Flujo

1. El usuario se registra o inicia sesión.
2. El token se conserva en localStorage y se agrega automáticamente a peticiones.
3. `/confirmacion` envía solo identificadores y cantidades; Laravel calcula el importe.
4. `/mis-compras` muestra el estado y el total persistidos.

## Pendientes

Configurar la URL de API por ambiente sin editarla en código, agregar renovación/expiración de sesión y conectar una pasarela de pago real.
