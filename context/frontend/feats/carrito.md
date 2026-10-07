# Carrito (panel lateral) - Frontend CompraLatino

## Resumen
Segun el diseno, el carrito NO es una pagina: es un panel lateral (drawer) que se desliza desde
la derecha sobre cualquier pantalla. Datos en `CartService` (signals + localStorage).

## Comportamiento
- Se abre desde el icono del carrito en la navbar y automaticamente al "Agregar al carrito".
- Se cierra con la X, "Seguir comprando", clic en el fondo oscuro, tecla Escape o al navegar.
- Cada linea: imagen, nombre, "Cant: N", precio de la linea (precio x cantidad) y eliminar.
- Pie: Subtotal YAuctions, Comision intermediario (10%), Total estimado,
  "Proceder al Pago" (-> `/confirmacion`) y "Seguir comprando".
- "Vaciar carrito" en el encabezado (requisito original, no aparece en el diseno).
- Estado vacio con boton "Explorar catalogo".

## Archivos
- `services/cart-drawer.service.ts`: estado abierto/cerrado (separado de los datos del carrito).
- `layout/cart-drawer/`: panel, renderizado una sola vez en `MainLayout`.
- `shared/components/cart-line/`: fila de producto reutilizable (se usara en Confirmacion).
- `layout/navbar/`: icono del carrito ahora es un boton que abre el panel.
- `pages/detalle-producto/`: abre el panel al agregar y muestra "Tambien te puede interesar"
  (`ProductService.getRelatedProducts`: misma categoria primero).

## Accesibilidad
- `role="dialog"`, `aria-modal`, foco al boton cerrar al abrir, `inert` cuando esta cerrado,
  bloqueo del scroll del body mientras esta abierto.

## Decisiones
- Animacion con transiciones CSS (transform/visibility), sin librerias.
- Totales con `priceBreakdown` de `shared/utils/pricing.ts` (misma logica que el detalle).

## Pendientes / riesgos
- No existe ruta `/carrito`; el requisito original la mencionaba, pero el diseno usa panel.
- "Proceder al Pago" redirige a inicio hasta que exista `/confirmacion`.
- La cantidad no se edita dentro del panel (el diseno solo la muestra);
  `CartService.updateQuantity` ya existe si se decide agregar el control.
