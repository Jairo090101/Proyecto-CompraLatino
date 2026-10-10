# Panel administrativo

## Alcance

El panel protegido en `/admin` permite consultar métricas y administrar el catálogo de productos. Solo usuarios con rol `admin` pueden acceder; los clientes son redirigidos al inicio.

## Módulos

- Dashboard: ventas, pedidos, clientes, productos, ventas por día, estados de pedidos y productos más vendidos.
- Catálogo: búsqueda, alta, edición y eliminación de productos.
- Formulario: categoría, nombre, descripción, precios, estado, imagen por URL, condición, referencia YAuctions y destacado.

## API

Las operaciones usan `GET /api/admin/metrics` y `apiResource /api/admin/products`, protegidos por Sanctum y `role:admin`. Los productos asociados a ventas no se eliminan: la API responde 409 y recomienda marcarlos como agotados.

## Decisiones

La imagen se registra como URL para evitar acoplar la primera versión al almacenamiento de archivos. El panel consume la misma base transaccional; el warehouse analítico y dashboards externos quedan para la evolución de BI.
