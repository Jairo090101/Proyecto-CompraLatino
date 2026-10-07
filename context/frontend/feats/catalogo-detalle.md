# Catalogo y Detalle de producto - Frontend CompraLatino

## Resumen
Pantallas `/catalogo` y `/producto/:id` del prototipo Angular, basadas en los disenos entregados.
Datos 100% mock. Precios en USD (el diseno muestra MXN; se mantuvo USD por decision del equipo).

## Catalogo (`pages/catalogo/`)
- Breadcrumb, titulo y contador dinamico de resultados.
- `components/catalog-toolbar`: busqueda (sin acentos), ordenamiento, vista grid/lista y panel
  de filtros (precio min/max, solo disponibles) con contador de filtros activos.
- Chips por categoria (Todos + 6 categorias).
- Lee `?q=` y `?categoria=` al entrar (enlaces desde la pagina principal).
- Estado vacio con boton "Limpiar filtros".

## Detalle (`pages/detalle-producto/`)
- `components/product-gallery`: imagen principal + miniaturas (`linkedSignal` reinicia al cambiar producto).
- `components/price-summary`: precio, precio anterior, % descuento, desglose
  precio + comision 10% + total (se multiplica por la cantidad).
- `components/product-tabs`: Descripcion, Especificaciones, Resenas.
- Cantidad (`shared/components/quantity-stepper`), Agregar al carrito con feedback, favorito (local),
  tarjeta de vendedor y etiquetas de confianza.
- Producto agotado: boton deshabilitado. ID inexistente: pantalla "Producto no encontrado".

## Piezas compartidas nuevas
- `services/cart.service.ts`: carrito con signals + localStorage (`compralatino.cart`).
  Expone `items`, `count`, `subtotal`, `add`, `updateQuantity`, `remove`, `clear`.
- `shared/components/`: `star-rating`, `breadcrumb`, `quantity-stepper`.
- `shared/utils/pricing.ts` (comision y descuento, solo visual) y `shared/utils/text.ts`.
- `product-card` redisenada: tarjeta completa clicable, rating, precio anterior, variante `list`.
- Navbar con contador del carrito.
- `app.config.ts`: `withInMemoryScrolling` para volver arriba al navegar.

## Modelos / mocks
- `Product` ampliado: `originalPriceUsd`, `gallery`, `rating`, `reviewCount`, `seller`, `specs`.
- Nuevos: `Review`, `CartItem`, `catalog-filters.model.ts`.
- `products.mock.ts`: 12 productos del diseno + Toyota Supra, iPhone, MacBook (15 total).
- `reviews.mock.ts`: resenas genericas para cualquier producto.

## Decisiones tecnicas
- Filtros en el componente pagina via `computed` (O(n log n) por el sort); el toolbar solo
  edita estado con `model()` two-way binding.
- La comision (10%) es una constante visual; la fuente real sera el backend.
- Fechas con formato `dd/MM/yyyy` para no depender de registrar el locale `es`.

## Pendientes
- (Hecho) Carrito como panel lateral: ver `carrito.md`. Falta pantalla de confirmacion.
- Sincronizar filtros con la URL si se requiere compartir enlaces filtrados.
- Favoritos persistentes (requiere backend/usuario).

## Riesgos / casos borde
- Imagenes remotas (Unsplash); sin internet se usa el placeholder local.
- El carrito guarda una copia del precio al agregar; al conectar la API debe revalidarse.
