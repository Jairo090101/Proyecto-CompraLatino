# Panel administrativo - Frontend CompraLatino

## Resumen
`/admin` vuelve al panel de ayer, dentro del layout de la tienda y protegido por el administrador de la sesión.

## Secciones
- Dashboard: ventas, usuarios, órdenes y conversión de septiembre 2026, barras Abr–Sep y órdenes recientes.
- Usuarios: listado, búsqueda, filtro Activo/Suspendido y CSV.
- Productos: inventario, stock, sincronizar en pantalla y editar abre la ficha pública.
- Compras: órdenes históricas, filtro por estado, detalle y CSV.
- Reportes: métricas y resumen al pulsar Ver.

## Decisiones
- Las cifras del panel siguen el diseño, en MXN, salvo Reportes, que muestra dólares (USD). La tienda pública sigue en USD.
- El nombre y el correo del costado salen de la sesión real. El rol mostrado es Super Admin.
- El formulario de productos del API queda fuera de esta vista.
