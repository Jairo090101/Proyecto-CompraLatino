# Backend: auth, catálogo y pedidos

## Implementado

- Sanctum Bearer para registro, login, perfil y logout.
- Middleware `role` para separar `customer` y `admin`.
- Migraciones/seeders de usuarios, categorías, productos, pedidos y líneas.
- Endpoints públicos de catálogo y privados de pedidos.
- Recomendaciones por historial y métricas administrativas.
- CRUD administrativo de productos protegido por rol `admin`, con validación, paginación y protección contra eliminar productos vendidos.
- Gateway YAuctions desacoplado mediante interfaz y fake local.

## Decisiones

Los precios se consultan desde la base de datos y se recalculan en el servidor. Los pedidos guardan `unit_price` y `product_name` como snapshot. El `Idempotency-Key` reduce duplicados por reintentos del cliente.

## Riesgos pendientes

Actualizar PHP a 8.4.1+, conectar proveedor YAuctions real, añadir políticas formales, pagos y pruebas de integración con una base de datos CI.
