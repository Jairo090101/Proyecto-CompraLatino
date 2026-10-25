# Pago con tarjeta - Frontend CompraLatino

## Resumen
`/confirmacion` deja de crear el pedido con un solo botón. Primero autoriza una tarjeta de prueba y, si el cargo sale aprobado, llama a `POST /api/orders`.

## Flujo
1. El carrito abre `/confirmacion`. La ruta exige sesión.
2. El formulario pide titular, número, vencimiento y CVV.
3. `PaymentService` acepta solo tarjetas de prueba (Luhn, marca, fecha y CVV).
4. Aprobada: se crea el pedido y el carrito se vacía. La pantalla siguiente es Mis Compras.
5. Rechazada o inválida: no se crea pedido. Si el número no es de prueba, se limpian número y CVV.

## Tarjetas de prueba
- `4242 4242 4242 4242` Visa aprobada, CVV `123`
- `5555 5555 5555 4444` Mastercard aprobada, CVV `123`
- `3782 822463 10005` American Express aprobada, CVV `1234`
- `4000 0000 0000 0002` rechazada, CVV `123`
- Vencimiento de ejemplo: `12/30`

## Decisiones
- El número y el CVV no se envían ni se guardan. El API del pedido sigue recibiendo solo productos y cantidades.
- El cargo es un simulador. Cuando exista Stripe, el navegador enviará un token y este servicio se reemplaza.

## Archivos
- `pages/confirmacion/` y `pages/confirmacion/components/card-payment-form/`
- `services/payment.service.ts`, `shared/utils/card.ts`, `models/payment.model.ts`
