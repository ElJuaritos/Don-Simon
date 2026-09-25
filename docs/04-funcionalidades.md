# 04 · Funcionalidades

Prioridad: **P0** = MVP (sin esto no se lanza) · **P1** = poco después del lanzamiento · **P2** = futuro.

## Catálogo

| ID | Funcionalidad | Prioridad |
|----|---------------|-----------|
| CAT-01 | Listado de productos por categoría | P0 |
| CAT-02 | Detalle de producto con galería, variantes de color y talla | P0 |
| CAT-03 | Inventario por variante (color + talla); las tallas agotadas se muestran deshabilitadas | P0 |
| CAT-04 | Filtros por talla, color, categoría y precio | P0 |
| CAT-05 | Ordenamiento (novedades, precio) | P0 |
| CAT-06 | Búsqueda de productos | P1 |
| CAT-07 | Productos relacionados | P1 |
| CAT-08 | "Avísame cuando esté disponible" para tallas agotadas | P1 |
| CAT-09 | Reseñas y calificaciones | P2 |
| CAT-10 | Pedidos personalizados (elegir piel, color de suela, grabado de iniciales) | P2 |

## Compra

| ID | Funcionalidad | Prioridad |
|----|---------------|-----------|
| CMP-01 | Carrito persistente (se conserva si el cliente sale del sitio) | P0 |
| CMP-02 | Drawer de carrito al agregar un producto | P0 |
| CMP-03 | Checkout como invitado | P0 |
| CMP-04 | Pago con tarjeta de crédito/débito | P0 |
| CMP-05 | Métodos locales vía Stripe: OXXO y SPEI | P0 (por confirmar) |
| CMP-06 | Meses sin intereses | P1 |
| CMP-07 | Cálculo de envío por código postal; envío gratis a partir de un monto | P0 |
| CMP-08 | Cupones de descuento | P1 |
| CMP-09 | Correos transaccionales: confirmación, envío con guía de rastreo, entrega | P0 |
| CMP-10 | Facturación electrónica (CFDI) a solicitud del cliente | P1 |

## Cliente

| ID | Funcionalidad | Prioridad |
|----|---------------|-----------|
| CLI-01 | Registro e inicio de sesión | P1 |
| CLI-02 | Historial de pedidos y rastreo | P1 |
| CLI-03 | Direcciones guardadas | P1 |
| CLI-04 | Lista de deseos | P2 |
| CLI-05 | Solicitud de cambio o devolución en línea | P2 |

## Contenido y marketing

| ID | Funcionalidad | Prioridad |
|----|---------------|-----------|
| MKT-01 | Páginas de contenido editables sin tocar código (historia, ayuda, legales) | P0 |
| MKT-02 | Suscripción a newsletter | P0 |
| MKT-03 | Barra de anuncios editable | P0 |
| MKT-04 | Botón de WhatsApp | P0 |
| MKT-05 | Píxel de Meta y Google Analytics 4 | P0 |
| MKT-06 | Catálogo sincronizado con Instagram/Facebook Shop y Google Merchant | P1 |
| MKT-07 | Recuperación de carritos abandonados por correo | P1 |
| MKT-08 | Journal / blog | P2 |
| MKT-09 | Sitio en inglés y precios en USD | P2 |

## Administración

Como el proyecto se construye a la medida, el panel de administración (`/admin`) también lo desarrollamos nosotros. Debe poder usarlo alguien sin conocimientos técnicos y funcionar bien desde el celular.

| ID | Funcionalidad | Prioridad |
|----|---------------|-----------|
| ADM-01 | Inicio de sesión del admin (solo usuarios autorizados) | P0 |
| ADM-02 | Productos: crear, editar, archivar; subir y ordenar fotos | P0 |
| ADM-03 | Variantes: generar la matriz color × talla de golpe y editar el stock rápido | P0 |
| ADM-04 | Pedidos: lista con filtros por estado, detalle, cambio de estado, captura de guía de envío (con correo automático al cliente) | P0 |
| ADM-05 | Reembolsos (desde la pasarela, con registro en el pedido) | P0 |
| ADM-06 | Editar contenido: barra de anuncios, textos de páginas, costo de envío | P0 |
| ADM-07 | Tablero: ventas del día/semana/mes, pedidos pendientes, productos con poco stock | P1 |
| ADM-08 | Cupones | P1 |
| ADM-09 | Exportar pedidos y suscriptores a CSV | P1 |
| ADM-10 | Generación de guías con paqueterías (Envia.com / Skydropx) | P2 |
| ADM-11 | Roles (dueño / operador) | P2 |

## Requerimientos no funcionales

- **Móvil primero**: se diseña y prueba primero a 375px.
- **Rendimiento**: LCP < 2.5s en 4G; imágenes en AVIF/WebP con tamaños responsivos; carga diferida de lo que está fuera de pantalla.
- **Accesibilidad**: WCAG 2.1 AA; navegación completa con teclado; `alt` en todas las imágenes; respetar los contrastes de [02](02-identidad-de-marca.md#contraste-wcag).
- **SEO**: URLs limpias en español, metadatos por página, datos estructurados `Product` y `BreadcrumbList`, sitemap.xml y Open Graph para compartir en redes.
- **Seguridad**: HTTPS; nunca se procesan ni almacenan datos de tarjeta en nuestro servidor (lo hace la pasarela de pago).
- **Legal (México)**: aviso de privacidad conforme a la LFPDPPP, términos y condiciones, política de devoluciones visible (PROFECO) y precios con IVA incluido.
