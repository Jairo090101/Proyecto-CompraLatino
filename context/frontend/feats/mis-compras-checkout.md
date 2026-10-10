# Mis compras y checkout sencillo

## Resumen

Mis compras muestra el historial de pedidos con el estilo visual de CompraLatino. El carrito permite editar cantidades y el usuario puede confirmar un pedido sencillo, sin pasarela de pago, dirección ni envío.

## Implementación

1. Confirmación y Mis compras viven dentro de `MainLayout`, por lo que conservan navbar, drawer y navegación.
2. `CartLine` reutiliza `QuantityStepper` para modificar cantidades desde el carrito y la confirmación.
3. El checkout muestra subtotal, comisión del 10% y total estimado, con estados de carga y error.
4. `OrdersService` conserva el mismo `Idempotency-Key` durante un intento de checkout.
5. El backend rechaza productos agotados, recalcula los importes y devuelve la imagen del producto en las líneas del pedido.

## Archivos afectados

- `frontend-CompraLatino/src/app/app.routes.ts`
- `frontend-CompraLatino/src/app/layout/cart-drawer/`
- `frontend-CompraLatino/src/app/shared/components/cart-line/`
- `frontend-CompraLatino/src/app/pages/confirmacion/`
- `frontend-CompraLatino/src/app/pages/mis-compras/`
- `frontend-CompraLatino/src/app/services/orders.service.ts`
- `frontend-CompraLatino/src/app/services/auth.guards.ts`
- `frontend-CompraLatino/src/app/pages/login/login.ts`
- `compraLatino/app/Http/Controllers/OrderController.php`
- `compraLatino/tests/Feature/OrderTest.php`

## Decisiones

- Se mantiene el carrito como drawer lateral, sin crear una ruta `/carrito`.
- El total del frontend es una estimación; el backend usa el precio vigente.
- Los pedidos fallidos no se ocultan del historial.

## Pendientes y riesgos

- No hay pasarela de pago real ni datos de envío.
- Un producto agregado desde mocks puede no existir en la base de datos y será rechazado al confirmar.
- El precio almacenado en localStorage puede cambiar antes de confirmar.
