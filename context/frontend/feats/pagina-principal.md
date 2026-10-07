# Pagina principal (Inicio) - Frontend CompraLatino

## Resumen
Primera pantalla del prototipo Angular (`frontend-CompraLatino`). Pagina publica en `/` con
tematica de importacion desde Japon (Yahoo Auctions Japan) hacia Latinoamerica.
Tema oscuro con acento rojo. Precios en USD. Datos 100% mock (sin backend).

## Secciones
1. Navbar: logo "CompraLatino" + etiqueta "JP", enlaces Inicio / Catalogo / Mis Compras / Admin,
   icono de carrito y boton "Ingresar".
2. Hero: imagen de fondo de Tokio, titulo "Lo mejor de Japon, en tu pais.", buscador y estadisticas.
3. Categorias ("Explora por tipo"): grid 3x2 con imagen, nombre y cantidad de articulos.
4. Destacados ("Los mas populares"): tarjetas de producto con badge (Popular / Oferta).

## Estructura creada (src/app)
- `models/`: `product.model.ts`, `category.model.ts`, `home-stat.model.ts`
- `mocks/`: `categories.mock.ts`, `products.mock.ts`, `home.mock.ts`
- `services/product.service.ts`: expone Observables sobre los mocks.
- `layout/main-layout/`, `layout/navbar/`
- `shared/components/`: `section-header`, `category-card`, `product-card`
- `shared/directives/img-fallback.directive.ts`: imagen local si la URL remota falla.
- `pages/home/` y `pages/home/components/hero-search/`
- `app.routes.ts`: `/` -> MainLayout -> Home (lazy). Rutas desconocidas redirigen a `/`.

## Decisiones tecnicas
- Componentes standalone + signals (`input()`, `output()`, `toSignal`) segun Angular 21.
- Servicios devuelven `Observable` para que el cambio a `HttpClient` (Laravel REST API)
  no afecte a los componentes.
- Estilos comunes (variables, botones, badges, contenedor) en `src/styles.css` para
  respetar el budget de 4kB/8kB por componente definido en `angular.json`.
- Imagenes remotas de Unsplash con fallback local `public/images/placeholder.svg`.
- Busqueda del hero navega a `/catalogo?q=...`; categorias a `/catalogo?categoria=...`.

## Pendientes
- Pantallas siguientes (se implementaran por partes segun disenos): Login, Registro, Catalogo,
  Detalle, Carrito, Confirmacion, Mis Compras (Historial), Perfil, Admin.
- Pie de pagina (falta diseno).
- (Hecho) Contador del carrito en navbar. Catalogo y detalle: ver `catalogo-detalle.md`.

## Riesgos / casos borde
- Las rutas `/login`, `/carrito`, `/historial`, `/admin` aun no existen: redirigen a `/`.
- Las imagenes dependen de internet; sin conexion se muestra el placeholder local.
- Diseno inferido de capturas de baja resolucion; textos pequenos pueden diferir.
