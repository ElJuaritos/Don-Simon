# 09 · Plan de rediseño según los mockups del dueño

Fuente: `Diseño Página WEB.pdf` (14 láminas, "Minimalismo cálido · estructura y apartados para móvil y PC"). Casi todas las láminas son capturas de **Morjas** con notas del dueño; la última usa **Myrqvist**. Este documento traduce esas notas a cambios concretos sobre el código actual.

> **Para quien implemente (Cursor):** lee primero `CLAUDE.md`, `AGENTS.md` y los documentos 02, 03 y 06. Este plan **no** reemplaza las reglas de marca: los mockups muestran la **estructura** que quiere el dueño, no su paleta. Morjas es blanco y negro; Don Simon es hueso, arena, piedra y café (ver §1).

---

## 0. Resumen

| Lámina | Qué pide el dueño | Estado actual | Esfuerzo |
|---|---|---|---|
| 1 | Portada del PDF: minimalismo cálido | Ya es la dirección (docs/02) | — |
| 2 | Login de cliente (modal) y página "Mi cuenta" con puntos, pedidos e info | No existe (solo login del admin) | **Grande** |
| 3 | Barra superior + header: páginas a la izquierda, logo al centro, idioma + cuenta + buscar + carrito a la derecha; portada con 2 fotos Hombre / Mujer | Header parecido, sin cuenta ni idioma; la portada empieza con un hero | Medio |
| 4 | Portada: "Colección Hombre" con 3 fotos, y lo mismo para Mujer; menú fijo al bajar | Hay categorías mezcladas, no secciones por público | Chico |
| 5 | Footer: índice en columnas, newsletter con preferencia, redes, barra legal con métodos de pago | Footer parecido, sin preferencia, sin logos de pago | Chico |
| 6 | Menú "Nosotros" desplegable (mega menú): Historia, Oficio, Tienda / Blog, Reseñas / Soporte + 3 fotos | Desplegable "La casa" con 3 enlaces de texto | Medio |
| 7 | Hoja Hombre / Mujer: mega menú de categorías (Calzado, Accesorios, Ocasión) + 3 fotos; abajo 2 cuadros grandes | `/coleccion?para=hombre` es solo la rejilla | Medio |
| 8 | Hoja Hombre / Mujer: carrusel de destacados (foto, modelo, color, precio) | Rejilla de 4 destacados en portada | Chico |
| 9 | Hoja Hombre / Mujer: "Top categorías", 3 fotos grandes | Categorías en portada | Chico |
| 10 | Catálogo: barra de filtros horizontal (Estilo, Talla, Color, Material, Suela), 4 columnas, conteo | Filtros de talla, color y orden | Medio (requiere datos nuevos) |
| 11 | Ficha de producto: carrete de fotos, nombre + precio, estrellas, variantes con miniatura, guía de tallas con conversión por país, comprar ahora / agregar, pestañas de descripción, "Combínalo con", reseñas abajo | Ficha completa sin reseñas, sin "comprar ahora", sin complementarios | **Grande** (por las reseñas) |
| 12 | Carrito lateral: resumen con cantidades, desglose y "No olvides agregar" | Carrito lateral solo al agregar, sin cantidades ni sugerencias | Medio |
| 13 | Checkout lo más fácil posible: resumen, información, envío, pago, código de descuento | Formulario de envío + Stripe Checkout alojado | Medio |
| 14 | Páginas extra: Blog / notas, Accesorios, páginas de Pieles, Cuidados, Proceso | Solo hormas, historia y ayuda | Medio |

**Lo que cambia de fondo:** la portada deja de ser un recorrido editorial largo y pasa a ser una puerta a **Hombre** y **Mujer**; cada público tiene su propia página de aterrizaje; aparecen **cuenta de cliente**, **reseñas**, **accesorios** y **notas (blog)**.

---

## 1. Traducción de Morjas a la marca Don Simon

Los mockups usan negro puro, blanco y gris frío. No se copian tal cual. Regla de traducción:

| En el mockup | En Don Simon | Token |
|---|---|---|
| Fondo blanco | Hueso | `bg-hueso` |
| Gris claro detrás del zapato (fotos de producto) | Arena (o piedra en hover) | `bg-arena` |
| Botón negro ("Login", "Add to cart", "Subscribe") | Botón café | `btn-primario` |
| Barra superior negra | Café oscuro con texto crema (D1 ✅, excepción aprobada a "café solo como acento": aplica **solo** a estas dos franjas delgadas) | `bg-cafe-oscuro text-crema-claro` |
| Franja inferior negra del footer | Igual que la barra superior, para que hagan juego | — |
| Texto gris de apoyo (color, suela) | Café al 70–85 % | `text-cafe/75` |
| Tipografía sans pequeña, en minúsculas | Quicksand, 13–14 px, **sin** mayúsculas forzadas | — |
| Títulos ("Men's Collection") | Quicksand regular 20–24 px, o The Seasons si pasa de 32 px | `titulo-display` solo ≥ 32 px |
| Botón contorno blanco sobre foto ("Explore now") | `btn-contorno-claro` | ya existe |
| Esquinas rectas, sombras nulas | Igual | ya es la regla |

**Cambio de tono tipográfico (importante):** Morjas casi no usa mayúsculas con tracking. Hoy el sitio usa mucho `.etiqueta` (mayúsculas, 0.14em). Para acercarse a los mockups:

- Crear una utilidad `texto-nav` (Quicksand 500, 0.8125–0.875 rem, sin mayúsculas, sin tracking) para el menú, los enlaces del footer y los datos de las tarjetas.
- Dejar `.etiqueta` solo para badges y títulos de columna muy pequeños.
- Revisar con `grep -r "etiqueta" src/` y decidir caso por caso.

**Móvil:** el PDF dice "versión móvil y PC" pero solo trae capturas de escritorio. Cada sección de este plan define su versión a 375 px. Móvil primero sigue siendo la regla.

---

## 2. Estructura global (todas las páginas)

### 2.1 Barra de anuncio (lámina 3)
- Se queda arriba en todas las páginas, centrada: `tienda.anuncio`.
- Hacerla **editable desde el admin** (hoy está fija en `src/config/marca.ts`). Opción simple: un bloque más en `src/content/bloques.ts` con clave `global-anuncio` y grupo nuevo `global`. Permitir 2–3 mensajes que roten cada 5 s (respetando `prefers-reduced-motion`).
- **Sin selector de idioma** por ahora (D2 ✅: primero solo español; los otros idiomas van en una etapa posterior). Tampoco va "Ship to": solo se envía a México. Dejar el espacio de la derecha libre para agregarlo después sin rehacer la barra.

### 2.2 Header (láminas 3, 4, 6, 7)
Estructura de escritorio (≥ 1024 px), en una sola fila:

```
[Hombre] [Mujer] [Accesorios] [Nosotros] [Reseñas]      LOGO      [Guía de tallas] [Ayuda] [👤] [🔍] [🛍 n]
```

- **Izquierda**: Hombre, Mujer, Accesorios (cuando existan, ver §8), Nosotros, Lookbook (§9.1), Reseñas (cuando existan, ver §6.4).
- **Centro**: logo (`<Logo />`, sigue configurable).
- **Derecha**: Guía de tallas (abre el modal existente o va a `/ayuda/guia-de-tallas`), Ayuda, Cuenta (ícono de persona, §7), Buscar, Carrito con contador (abre el carrito lateral, §5.1).
- **Fijo al hacer scroll** ("menú visible al arrastrar o bajar"): ya es `sticky`. Mejora opcional: que se oculte al bajar y reaparezca al subir. Elegir uno de los dos comportamientos y no mezclarlos.
- **Móvil**: hamburguesa a la izquierda, logo al centro, buscar y carrito a la derecha (como hoy). La cuenta va dentro del menú móvil.

Archivos: `src/components/layout/header.tsx`, `navegacion.ts`, `desplegable.tsx`, `menu-movil.tsx`, `src/components/ui/iconos.tsx` (agregar `IconoPersona`).

### 2.3 Mega menú (láminas 6 y 7)
Reemplaza a `Desplegable`. Al pasar el cursor (o al enfocar con teclado) sobre Hombre, Mujer o Nosotros se abre un panel a todo lo ancho, debajo del header, con **columnas de enlaces a la izquierda y 3 fotos a la derecha** (cada foto con su nombre abajo a la izquierda, sobre la imagen).

| Menú | Columnas | 3 fotos |
|---|---|---|
| **Hombre** / **Mujer** | **Calzado**: cada categoría del público + "Ver todo" · **Accesorios**: cinturones, calcetines, cuidado del calzado, piel pequeña · **Ocasión**: formal, casual, boda (ver §4.3) | Editables: p. ej. "Temporada", "Mocasines", "Botas" |
| **Nosotros** | **Nosotros**: Nuestra historia, El oficio, Nuestras hormas, Pieles (§9) · **Don Simon**: Notas (blog), Reseñas, Dónde encontrarnos · **Ayuda**: Preguntas frecuentes, Guía de tallas, Rastrear pedido, Cambios y devoluciones, Contacto | "Nuestra historia", "El oficio", "El taller" |

Detalles técnicos:
- Nuevo componente `src/components/layout/mega-menu.tsx` (cliente). Accesible: botón con `aria-expanded`, cierre con Escape y al salir del panel, navegable con Tab. Pequeño retraso (~150 ms) al cerrar para que no parpadee.
- Fondo `bg-hueso`, separadores verticales `border-cafe/10` entre columnas (como en Morjas).
- Las fotos se editan desde el admin: 3 bloques nuevos por menú (`menu-hombre-1..3`, `menu-mujer-1..3`, `menu-nosotros-1..3`) en `src/content/bloques.ts` con un grupo nuevo `menus`. Campos: imagen, título, enlace.
- Las columnas de categorías salen de la BD (`getCategorias()` filtrado por público, ver §4.1). Las de Nosotros salen de `navegacion.ts`.
- **Móvil**: no hay mega menú. En `menu-movil.tsx`, Hombre y Mujer se convierten en acordeones con las mismas columnas (sin fotos, o con una sola foto arriba).

### 2.4 Footer (lámina 5)
Cuatro columnas de enlaces + newsletter a la derecha:

| Tienda | Ayuda | Don Simon | Mi cuenta | Newsletter |
|---|---|---|---|---|
| Hombre, Mujer, Accesorios, Cuidado del calzado | Rastrear pedido, Cambios y devoluciones, Guía de tallas, Preguntas frecuentes, Contacto | Nuestra historia, El oficio, Reseñas, Notas | Iniciar sesión, Crear cuenta, Recomienda a un amigo (cuando exista, §7.4) | Texto + **preferencia** (Hombre / Mujer / Ambos) + correo + botón + íconos de redes |

Franja inferior: `© año Don Simon` · **logos de pago** (Visa, Mastercard, Amex, OXXO y SPEI si se activan, ver docs/08 #2) · **paquetería** (cuando se defina, docs/08 #8) · Aviso de privacidad, Términos, Cookies.

- Íconos de redes en SVG (Instagram, Facebook, TikTok, Pinterest, YouTube). Solo se muestran los que tengan URL en `marca`.
- Newsletter con preferencia: agregar columna `preferencia` a `suscriptores` (§10). Radios accesibles (`fieldset` + `legend`).
- Móvil: newsletter primero, luego columnas como acordeones (`<details>`), franja legal apilada.
- Archivos: `footer.tsx`, `form-newsletter.tsx`, `src/lib/actions/tienda.ts` (acción de suscripción), `src/components/ui/iconos.tsx` (logos de pago y redes).

### 2.5 Botón flotante "¿Necesitas ayuda?" (en todas las láminas)
Ya existe `boton-whatsapp.tsx`. Restilizar como en Morjas: rectángulo hueso con borde, texto "¿Necesitas ayuda?", abajo a la derecha. Al tocarlo, un panel pequeño con WhatsApp, correo y enlace a Preguntas frecuentes. No debe tapar el botón de "Agregar al carrito" en móvil (subirlo o esconderlo en la ficha de producto).

---

## 3. Portada (láminas 3 y 4)

Nueva estructura, mucho más corta que la actual:

1. **Hombre / Mujer a pantalla completa**: dos fotos lado a lado, de borde a borde, alto ≈ `100svh − header − anuncio`. Sobre cada foto, abajo al centro, un enlace subrayado "Explorar Hombre" / "Explorar Mujer". Reutiliza los bloques `portada-hombre` y `portada-mujer`. **Se elimina el hero** (`portada-hero`) (D3 ✅).
   - Móvil: las dos fotos apiladas, cada una ≈ 70 svh, o lado a lado en 3:4 como hoy. Recomendación: apiladas, porque así es como se ve la intención del mockup.
2. **Colección Hombre**: título centrado "Colección Hombre", enlace "Explorar todo" debajo, y **3 fotos verticales** en fila (en móvil, carrusel con `snap-x`). Cada foto es un bloque editable con imagen, título y enlace (`portada-col-hombre-1..3`).
3. **Colección Mujer**: igual, "con el mismo estilo" (`portada-col-mujer-1..3`).
4. **Un solo bloque editorial al final** (D3 ✅): reutilizar `EditorialDividido` con el bloque `portada-oficio`, enlazando a Nosotros.
5. Footer.

Qué sale de la portada: `Manifiesto`, categorías mezcladas, "Los favoritos" (se van a las hojas Hombre / Mujer), `Valores`, `EditorialDividido` × 2 y `Galeria`. **No borrar los componentes** todavía: se reutilizan en Nosotros (§9).

Archivos: `src/app/(tienda)/page.tsx`, `src/content/bloques.ts` (bloques nuevos y quitar los que ya no se usen del grupo `portada`), `src/components/portada/*`. Agregar los bloques nuevos al script de `npm run db:fotos` para que tengan foto de ejemplo.

---

## 4. Hojas Hombre y Mujer (láminas 7, 8, 9 y 10)

### 4.1 Rutas
Decidido (D4 ✅): páginas de aterrizaje nuevas y catálogo con las rutas actuales.

| Ruta | Contenido |
|---|---|
| `/hombre`, `/mujer` | **Nueva**. Página de aterrizaje del público (§4.2) |
| `/coleccion?para=hombre` | Catálogo completo del público (§4.3). El enlace "Ver todo" del mega menú lleva aquí |
| `/coleccion/[categoria]?para=hombre` | Catálogo filtrado por categoría |

Implementación: una sola página dinámica `src/app/(tienda)/[publico]/page.tsx` que valide `publico ∈ {hombre, mujer}` y haga `notFound()` en otro caso, **o** dos carpetas que importen el mismo componente `VistaPublico`. Ojo: un segmento dinámico en la raíz de `(tienda)` choca con otras rutas; la opción segura son dos carpetas `hombre/` y `mujer/`. Recuerda que en Next 16 `params` y `searchParams` son asíncronos.

### 4.2 Página de aterrizaje `/hombre` y `/mujer`
1. **Dos cuadros grandes** lado a lado (lámina 7, "mismos 2 cuadros fotográficos"), con un botón contorno claro "Explorar" centrado abajo. Bloques `hombre-hero-1/2` y `mujer-hero-1/2`.
2. **Destacados de temporada** (lámina 8): título pequeño centrado, **carrusel** de tarjetas de producto con flechas a los lados en escritorio y deslizamiento en móvil. Muestra 4 en escritorio, 1.3 en móvil (para que se note que se desliza). Fuente: `getProductos({ para, soloDestacados: true })`.
3. **Top categorías** (lámina 9): 3 fotos verticales grandes con el nombre subrayado abajo a la izquierda, enlazan a `/coleccion/[categoria]?para=...`. Usa la foto de la categoría **para ese público** (D5 ✅): `imagen_hombre_url` / `imagen_mujer_url` en `categorias`, con `imagen_url` como respaldo. Editables en `/admin/categorias`.
4. Footer.

Componente nuevo `src/components/product/carrusel-productos.tsx` (cliente): `scroll-snap` nativo + botones que hacen `scrollBy`. Sin librerías. Botones con `aria-label`, ocultos si no hay más que mostrar. Se reutiliza en la ficha (§5.3) y en el carrito (§5.1).

### 4.3 Catálogo (lámina 10)
- **Barra de filtros horizontal** justo debajo del header, entre dos líneas finas: **Estilo** (categoría), **Talla**, **Color**, **Material** y **Ocasión**. **Sin filtro de suela** (D11 ✅: cada modelo tiene una sola suela; solo cambian los colores). Como hoy, un filtro con una sola opción no se muestra. Cada uno es un desplegable con casillas; se aplican al instante como hoy. A la derecha: "Ordenar" y el conteo "60 modelos".
- En móvil: botón "Filtrar y ordenar" que abre un panel lateral (hoy se despliega en línea; cambiarlo a panel de pantalla completa con botón "Ver N modelos").
- **Rejilla de 4 columnas** en escritorio, 2 en móvil.
- **Tarjeta de producto** al estilo Morjas (cambia `tarjeta-producto.tsx`):
  - Foto del zapato sobre fondo arena, proporción 3:4 o 4:5, el zapato centrado. En hover: segunda foto (ya lo pide docs/03).
  - Badge arriba a la izquierda, texto pequeño sin fondo: "De vuelta", "Nuevo", "Últimos pares", "Agotado".
  - Debajo: **Nombre** a la izquierda y **precio** a la derecha en la misma línea; luego el **color** en café claro (sin línea de suela, D11).
  - Quitar los puntitos de colores (o dejarlos solo si el modelo tiene más de un color, D6).
  - **Una tarjeta por color**: Morjas muestra "The Penny Loafer" 4 veces, una por color/suela. Es la forma en que el catálogo se ve lleno y deja ver cada piel. Requiere que `getProductos` devuelva una fila por (producto, color) con su foto, y que el enlace lleve `?color=`. Aprobado (D6 ✅).
- **Paginación**: "Cargar más" cuando haya más de 24 modelos.

Datos nuevos necesarios (ver §10): `material` como valor corto filtrable (hoy es texto libre), `ocasiones` como lista, y `publico` en las categorías o un cálculo de qué categorías tienen productos de cada público.

Archivos: `src/components/product/filtros-coleccion.tsx`, `vista-coleccion.tsx`, `tarjeta-producto.tsx`, `src/lib/data/catalogo.ts` (`getProductos`, opciones de filtros), `src/app/(tienda)/coleccion/*`.

---

## 5. Compra

### 5.1 Carrito lateral (lámina 12)
Hoy el panel solo se abre al agregar un par y no deja cambiar cantidades. Cambios:
- **El ícono del carrito en el header abre el panel** (en vez de ir a `/carrito`). `/carrito` se queda como página para quien llegue por URL o sin JavaScript.
- Título "Carrito" + cerrar. Cada línea: foto, nombre, color, talla, **− cantidad +**, precio y **×** para quitar.
- Resumen: Subtotal, Envío ("Gratis" o el monto), **"IVA incluido"** (informativo, los precios ya lo incluyen; no sumarlo), Total.
- Barra de progreso al envío gratis (ya existe, mantener).
- Botón "Ir a pagar".
- **"No olvides agregar"**: carrusel de 2–4 complementarios (accesorios, §8) con botón "Agregar". Si no hay accesorios todavía, ocultar la sección.
- El estado del carrito sigue en la cookie (`src/lib/carrito.ts`); las cantidades se cambian con Server Actions ya existentes de `/carrito`. Usar `useOptimistic` para que se sienta instantáneo.
- Mover el panel a un proveedor de contexto en el layout de `(tienda)` para poder abrirlo desde el header y desde la ficha.

Archivos: `src/components/cart/carrito-lateral.tsx`, `header.tsx`, `src/app/(tienda)/layout.tsx`, `src/lib/actions/tienda.ts`, `selector-compra.tsx`.

### 5.2 Checkout (lámina 13): "hacerlo lo más fácil posible"
Se mantiene **Stripe Checkout** (decisión tomada; nunca tocamos datos de tarjeta). Lo que cambia es la página previa:

- **Una sola página en dos columnas** (en móvil, una): a la izquierda los pasos, a la derecha el **resumen fijo** (líneas con cantidad editable, subtotal, envío, total, IVA incluido).
- Pasos numerados en la misma página, no en pantallas separadas:
  1. **Contacto**: correo y celular. Casilla "Quiero recibir novedades" (crea suscriptor).
  2. **Envío**: **código postal primero**. Con el CP se llenan solos estado, ciudad y una lista de colonias (catálogo de SEPOMEX en un JSON estático o un servicio gratuito; D8). Luego calle, número exterior e interior, referencias. Nombre y apellido separados (como el mockup), aunque se guarden juntos en `pedidos.nombre`.
  3. **Método de envío**: por ahora una sola opción (estándar, costo de `tienda`). Queda listo para varias cuando se defina la paquetería (docs/08 #8).
  4. **Pago**: botón "Ir a pagar" → Stripe. Mostrar los logos de pago y un texto corto de seguridad.
- **Código de descuento**: activar `allow_promotion_codes: true` en la sesión de Stripe Checkout y crear los cupones en el panel de Stripe. Es lo más barato y seguro. Si el dueño quiere crear cupones desde nuestro admin, se hace después (tabla `cupones`, D9).
- Si hay cuenta de cliente (§7), prellenar los datos y ofrecer "Guardar esta dirección".
- Autocompletado del navegador en todos los campos (`autoComplete` correcto: `given-name`, `family-name`, `postal-code`, `address-line1`, `tel`, `email`).
- **Probar primero** (D10 ✅): Stripe **Embedded Checkout** para que el pago ocurra dentro de la página y no se sienta un salto a otro sitio. Sigue sin tocar datos de tarjeta. Si no funciona bien en Cloudflare Workers, quedarse con el Checkout alojado actual.

Archivos: `src/app/(tienda)/checkout/page.tsx`, `form-checkout.tsx`, `src/lib/actions/tienda.ts`, `src/lib/stripe.ts`, `src/lib/data/pedidos.ts`. **No** cambiar la regla de seguridad: precio y stock se recalculan en el servidor y el pedido solo pasa a `pagado` por el webhook.

### 5.3 Ficha de producto (lámina 11)
Distribución en escritorio: **carrete de fotos a la izquierda (rejilla de 2 columnas, todas las fotos)** y **ficha fija a la derecha**. En móvil: carrusel de fotos con puntos o contador ("1 / 5"), luego la ficha.

Ficha, de arriba a abajo:
1. **Nombre** a la izquierda y **precio** a la derecha en la misma línea (texto Quicksand, no The Seasons gigante como hoy).
2. **Estrellas + "N reseñas"** que bajan a la sección de reseñas (§6). Se oculta si no hay reseñas.
3. **Color**: nombre del color elegido y **miniaturas con foto** del zapato en cada color (no círculos), con línea debajo del seleccionado.
4. **Suela**: no es variante (D11 ✅). Va solo como texto en la pestaña Detalles.
5. **"Abrir guía de tallas"**: panel lateral con la tabla de conversión **MX / US / EU / UK / cm**, cómo medir el pie y la recomendación de la horma. Ya existe `guia-tallas-modal.tsx` y `tabla-tallas.tsx`; agregar UK y pasarlo a panel lateral.
6. **Tallas**: rejilla de botones de 5 columnas. Selector de sistema de tallas arriba (MX · US · EU) que cambia la etiqueta de los botones (D12). Agotadas tachadas y deshabilitadas.
7. **Botones**: "Agregar al carrito" (primario, abre el carrito lateral) y **"Comprar ahora"** (secundario, contorno, agrega y va directo a `/checkout`).
8. Texto pequeño: "Envío gratis desde $X · Cambios de talla gratis" (ajustar al acuerdo de docs/08 #9).
9. **Pestañas** en vez de acordeones: **Descripción · Detalles · Ajuste · Cuidado**. Detalles = materiales, construcción, suela, hecho en. Ajuste = horma + recomendación + enlace a Nuestras hormas. En móvil pueden quedarse como acordeones.
10. **"Combínalo con"**: carrusel de complementarios (accesorios y productos elegidos a mano, §8.2).

Debajo de todo: **Reseñas** (§6) y luego "También te puede gustar" (ya existe).

Archivos: `src/app/(tienda)/producto/[slug]/page.tsx`, `selector-compra.tsx`, `guia-tallas-modal.tsx`, `tabla-tallas.tsx`, componentes nuevos `pestanas-producto.tsx`, `miniaturas-color.tsx`.

---

## 6. Reseñas (láminas 11 y header "Reviews")

Es la pieza nueva más grande del lado público.

### 6.1 Datos
Tabla `resenas` (§10): producto, pedido y línea de pedido (para marcar "compra verificada"), nombre a mostrar, ciudad, calificación 1–5, título, texto, **ajuste** (−2 chica … 0 fiel a la talla … +2 grande), **ancho de pie** (angosto / normal / ancho), estado (`pendiente`, `publicada`, `rechazada`), fecha, respuesta de la marca (opcional).

### 6.2 Cómo se juntan las reseñas
- Un correo (Resend) unos días después de que el pedido pase a `entregado`, con un enlace firmado por línea de pedido (`/resena/[token]`). Sin cuenta necesaria. Solo una reseña por línea.
- Mientras no esté Resend: el dueño puede capturarlas desde el admin.
- **Moderación**: toda reseña entra como `pendiente`; el dueño la aprueba desde `/admin/resenas`. Nunca se publican solas.

### 6.3 En la ficha
- Resumen: promedio grande (4.9), estrellas, "Basado en N reseñas", **barras de distribución 5→1**, y un **indicador de ajuste** ("Fiel a la talla") con el promedio del campo ajuste. Esto ayuda mucho a vender calzado en línea.
- Filtros: buscar texto, por calificación, por ancho de pie.
- Lista: nombre + "Compra verificada", ancho de pie, estrellas, título, texto, fecha. Paginación de 5 en 5.
- Datos estructurados: agregar `aggregateRating` y `review` al JSON-LD que ya existe.

### 6.4 Página `/resenas`
Todas las reseñas publicadas, con el producto de cada una. Es el enlace "Reseñas" del header y del footer. **No mostrar el enlace mientras haya menos de ~10 reseñas** (D13).

---

## 7. Cuenta de cliente (lámina 2)

Lo pide el dueño explícitamente: modal de login, "Crear cuenta", y una hoja "Bienvenido, Nombre" con **Mis puntos · Mis pedidos · Mis datos**.

### 7.1 Autenticación
- **Supabase Auth** (ya está en el stack y en el roadmap). Decidido (D14 ✅): **código de 6 dígitos o enlace por correo**, sin contraseñas que olvidar. Google puede agregarse después.
- Separar por completo de la sesión del admin (`src/lib/auth.ts` sigue siendo solo admin hasta que se migre).
- El **checkout sigue permitiendo comprar como invitado**. La cuenta nunca debe ser obligatoria.
- Al crear cuenta, ligar los pedidos anteriores que tengan el mismo correo.

### 7.2 Interfaz
- Ícono de persona en el header → si no hay sesión, **modal** "Iniciar sesión" (correo, contraseña o enlace, "¿Olvidaste tu contraseña?", "¿Eres nuevo? Crea tu cuenta"). Sobre fondo oscurecido, como el mockup.
- `/cuenta` con pestañas: **Mis pedidos** (lista con folio DS-XXXXX, fecha, estado, total, guía de rastreo), **Mis datos** (nombre, teléfono, direcciones guardadas, preferencias de newsletter), **Mis puntos** (§7.3), Cerrar sesión.
- Todo en español y tuteando: "Hola, Alejandro", no "Welcome".

### 7.3 Programa de puntos (D15, decidir antes de construir)
El mockup y el footer de Morjas incluyen "Loyalty program". Hay que definir las reglas con el dueño: cuántos puntos por peso, cuánto vale un punto, si caducan, si se ganan al pagar o al entregar. Propuesta técnica una vez definidas:
- Tabla `movimientos_puntos` (cliente, pedido, puntos +/−, motivo, fecha). El saldo es la suma, nunca un campo editable.
- Se acreditan en el webhook de Stripe cuando el pedido pasa a `pagado` (o al marcarlo `entregado`), y se revierten si se cancela o devuelve.
- Canje en checkout como un descuento: crear un cupón de un solo uso en Stripe por el monto canjeado.
- **Sugerencia:** dejar puntos para una segunda etapa. Primero cuenta + historial de pedidos, que ya aporta mucho.

### 7.4 "Recomienda a un amigo"
Fuera de esta etapa. Anotar en el roadmap.

---

## 8. Accesorios y productos complementarios (láminas 7, 11, 12, 14)

### 8.1 Accesorios
El mega menú, "Combínalo con", "No olvides agregar" y la lámina 14 asumen que se venden **accesorios**: cinturones, calcetines, hormas de cedro, kits de cuidado, piel pequeña.
- Agregar `tipo` a `categorias` (`calzado` | `accesorio`).
- Los accesorios **no tienen talla numérica**. Hoy `variantes.talla` es `numeric NOT NULL` y la talla está en el `unique`. Opciones (D16, **pendiente**: el dueño todavía no define qué accesorios venderá): (a) hacer `talla` opcional y usar `null` para "talla única"; (b) agregar `talla_texto` para cinturones (85, 90, 95) o calcetines (S/M/L). Recomendación: (a) + un campo `etiqueta_talla` opcional.
- Revisar todo lo que asume talla numérica: `formatTalla`, filtros, carrito, pedido, admin de productos, `pedido_lineas.talla`.
- Página `/accesorios` con el mismo catálogo (§4.3) filtrado por `tipo = accesorio`. Mientras no haya accesorios cargados, ocultar el enlace del menú.

### 8.2 Complementarios
- Tabla `productos_complementarios` (producto, complementario, orden), editable en el admin del producto con un buscador ("Combínalo con").
- Si un producto no tiene complementarios elegidos, usar por defecto los accesorios activos de la categoría "Cuidado".

---

## 9. Nosotros y páginas de contenido (láminas 6 y 14)

| Página | Ruta | Contenido | Cómo se edita |
|---|---|---|---|
| Nuestra historia | `/nuestra-historia` | Ya existe. Añadir un índice al inicio: **Filosofía · Valores · Sostenibilidad** (lámina 6) con anclas | Bloques `historia-*` (agregar `historia-filosofia`, `historia-valores`, `historia-sostenibilidad`) |
| El oficio | `/el-oficio` | Proceso paso a paso (patrón → corte → cosido → montado → acabado) y tipos de construcción (Goodyear, Blake…) | Bloques nuevos del grupo `oficio`. Reutiliza `EditorialDividido` y `Galeria` que salen de la portada |
| Pieles | `/pieles` | Una sección por piel (becerro, gamuza, grabado…), con foto, descripción y cuidado. Mismo formato que Nuestras hormas ("Forme #4" de la lámina 14) | Tabla `pieles` + `/admin/pieles`, igual que hormas |
| Nuestras hormas | `/nuestras-hormas` | Ya existe. Darle el formato de la lámina 14: foto grande del zapato a un lado, nombre "Horma #4", ancho y texto | Ya editable |
| Cuidado del calzado | `/ayuda/cuidado-del-calzado` | Ya existe. Pasar a formato editorial con fotos y enlazar a los accesorios de cuidado | — |
| Notas (blog) | `/notas` y `/notas/[slug]` | Rejilla de 2 columnas con foto, título en mayúsculas pequeñas y fecha (lámina 14, "Journal") | Tabla `notas` + `/admin/notas` con editor sencillo (título, foto, resumen, cuerpo en Markdown o bloques) |
| Rastrear pedido | `/rastrear` | Folio + correo → estado, paquetería y guía | Sale de `pedidos`. Limitar intentos por IP |
| Cambios y devoluciones | `/ayuda/cambios-y-devoluciones` | Añadir formulario "Registrar un cambio" (folio, correo, motivo, talla deseada) | Llega a `/admin/mensajes` con tipo `devolucion` |
| Dónde encontrarnos | `/donde-encontrarnos` | Solo si hay taller o tiendas físicas (D17, **pendiente**) | — |

Para el admin: todo esto debe ser tan simple como `/admin/contenido`. Lenguaje claro y usable desde el celular.

### 9.1 Lookbook (D7 ✅, desde ahora)
- Ruta `/lookbook`, enlace en el header (entre Mujer y Nosotros) y en el footer.
- Diseño: galería editorial a todo lo ancho, alternando una foto grande horizontal con parejas de fotos verticales; texto mínimo (título de la temporada y una frase). En móvil, una foto por pantalla.
- Cada foto puede llevar **"Ver el modelo"**: enlace al producto que aparece en ella. Así el lookbook también vende.
- Filtro sencillo arriba: Todo · Hombre · Mujer.
- Datos: tabla `lookbook_fotos` (imagen, alt, público, producto opcional, orden, activa) y `/admin/lookbook` para subir, ordenar y ligar cada foto a un producto. Si después quiere varias temporadas, se agrega una tabla `lookbooks` arriba de esta.
- **Fotos de ejemplo**: generar con IA unas 8–10 (hombre y mujer, ambientes cálidos, piel café y coñac, luz natural, mismo estilo que `.data/fotos-ejemplo`), guardarlas en `.data/fotos-ejemplo/lookbook/` y agregarlas al script de `npm run db:fotos`. El dueño las reemplaza desde el admin.

---

## 10. Cambios en la base de datos

Todas las tablas nuevas con `.enableRLS()`. Montos en centavos. Nombres de tablas y columnas en español. Después de cada cambio: `npm run db:generar`, revisar la migración en `drizzle/`, y `npm run db:migrar` contra Supabase. Actualizar `docs/06-modelo-de-datos.md`.

| Cambio | Tabla | Para qué | Etapa |
|---|---|---|---|
| `preferencia` (`hombre`/`mujer`/`ambos`) | `suscriptores` | Newsletter del footer | A |
| `lookbook_fotos` | nueva | Lookbook (§9.1) | A |
| `imagen_hombre_url`, `imagen_mujer_url` | `categorias` | Foto de categoría por público (D5) | B |
| `tipo` (`calzado`/`accesorio`) | `categorias` | Accesorios y mega menú | C |
| `material` (texto corto), `ocasiones` (`text[]`) | `productos` | Filtros del catálogo. Mantener `materiales` y `suela` largos para la descripción | B |
| `talla` opcional + `etiqueta_talla` | `variantes`, `pedido_lineas` | Accesorios sin talla | C |
| `productos_complementarios` | nueva | "Combínalo con" | C |
| `resenas` | nueva | Reseñas | D |
| `clientes` (id = `auth.users.id`, nombre, teléfono, acepta_novedades) y `direcciones` | nuevas | Cuenta | E |
| `cliente_id` opcional | `pedidos` | Historial de pedidos | E |
| `movimientos_puntos` | nueva | Puntos (segunda etapa, cuando haya reglas) | F |
| `notas` | nueva | Blog | G |
| `pieles` | nueva | Página Pieles | G |
| `tipo` (`contacto`/`devolucion`/`sugerencia`) | `mensajes` | Formularios de soporte | G |

Actualizar `src/db/seed.ts` con datos de ejemplo para todo lo nuevo y reiniciar la base local (`npm run db:reiniciar`, con el servidor detenido).

---

## 11. Etapas sugeridas para Cursor

Cada etapa se puede entregar y revisar con el dueño por separado. Al terminar cada una: `npm run typecheck && npm run lint && npm run build`, revisar en 375 px y en escritorio, y comprobar contraste AA.

### Etapa A · Esqueleto visual (sin datos nuevos complicados)
1. Utilidad tipográfica `texto-nav` y ajuste de tono (§1).
2. Barra de anuncio editable (§2.1).
3. Header nuevo con íconos de cuenta (sin funcionalidad todavía, puede llevar a `/cuenta` con "Próximamente") (§2.2).
4. Mega menú para Hombre, Mujer y Nosotros, con bloques de fotos editables (§2.3).
5. Footer nuevo con preferencia en newsletter y logos (§2.4). Migración `suscriptores.preferencia`.
6. Botón "¿Necesitas ayuda?" (§2.5).
7. Portada nueva (§3).
8. Lookbook con fotos generadas (§9.1).

### Etapa B · Hombre / Mujer y catálogo
1. Componente `CarruselProductos` (§4.2).
2. Páginas `/hombre` y `/mujer` (§4.2).
3. Campos `material` y `ocasiones` en productos y en el admin de productos.
4. Barra de filtros horizontal y panel de filtros móvil (§4.3).
5. Tarjeta de producto nueva, una tarjeta por color (D6).
6. Fotos de categoría por público (D5).

### Etapa C · Ficha, carrito y checkout
1. Ficha de producto nueva (§5.3) sin reseñas.
2. ⏳ Accesorios: `categorias.tipo`, talla opcional, admin, `/accesorios` (§8.1). **Esperar D16**; mientras tanto, hacer el resto de la etapa y ocultar "Combínalo con" y "No olvides agregar" si no hay productos que sugerir.
3. ⏳ Complementarios (§8.2), junto con el punto anterior.
4. Carrito lateral desde el header, con cantidades y "No olvides agregar" (§5.1).
5. Checkout de una página con CP primero y códigos de descuento de Stripe (§5.2).

### Etapa D · Reseñas
Tabla, admin de moderación, sección en la ficha, `/resenas`, JSON-LD (§6). El correo de solicitud se conecta cuando esté Resend.

### Etapa E · Cuenta de cliente
Supabase Auth, modal de login, `/cuenta` con pedidos y datos, ligar pedidos por correo, prellenar checkout (§7.1, §7.2).

### Etapa F · Puntos (segunda etapa, D15)
§7.3. No empezar hasta tener las reglas por escrito.

### Etapa G · Contenido
El oficio, Pieles, Notas, Rastrear pedido, formulario de devoluciones, índice de Nuestra historia (§9).

### Fuera de este plan (anotar en el roadmap)
- Idiomas (D2): después del lanzamiento en español.
- Recomienda a un amigo.
- Cupones desde nuestro admin (D9).

---

## 12. Decisiones del dueño (2026-10-05)

Registradas también en `docs/08-decisiones-pendientes.md`.

| # | Pregunta | Decisión |
|---|---|---|
| D1 | Color de la barra superior y la franja inferior del footer | ✅ Café oscuro con texto crema. Excepción a "café solo como acento", **solo** para esas dos franjas |
| D2 | Idiomas | ✅ Primero solo español. Los otros idiomas, después |
| D3 | Portada | ✅ Sin hero; un solo bloque editorial al final |
| D4 | Páginas `/hombre` y `/mujer` | ✅ Sí |
| D5 | Foto de categoría distinta por público | ✅ Sí: `imagen_hombre_url` e `imagen_mujer_url` en `categorias` (con `imagen_url` como respaldo) |
| D6 | Una tarjeta por color en el catálogo | ✅ Sí |
| D7 | Lookbook | ✅ **Desde ahora**, con fotos generadas con IA que el dueño cambiará después (§9.1) |
| D8 | Dirección por código postal | ✅ Sí, catálogo de SEPOMEX en archivo estático |
| D9 | Cupones | ✅ Desde Stripe (`allow_promotion_codes`) |
| D10 | Pago dentro de la página | ✅ Probar Embedded Checkout; si falla en Workers, quedarse con el alojado |
| D11 | Varias suelas por modelo | ✅ No. Cada modelo tiene una sola suela; solo cambian los colores. La suela no es variante ni filtro |
| D12 | Sistema de tallas por defecto | ✅ MX, con selector a US y EU |
| D13 | Reseñas desde el día 1 | ✅ No: se muestran a partir de ~10 publicadas. Todas pasan por aprobación del dueño |
| D14 | Login de clientes | ✅ Código o enlace por correo, sin contraseña. Comprar sin cuenta sigue siendo posible |
| D15 | Programa de puntos | ✅ Segunda etapa. Primero cuenta con historial de pedidos. Las reglas siguen **pendientes** |
| D16 | Accesorios y sus tallas | ⏳ **Pendiente**. Bloquea §8 (accesorios y complementarios) |
| D17 | Taller o tienda física | ⏳ **Pendiente**. Bloquea "Dónde encontrarnos" |

---

## 13. Cosas que no deben cambiar

- Nada de Shopify ni plataformas; todo a la medida.
- Stripe Checkout (alojado o embebido) + webhooks. Nunca datos de tarjeta en nuestro servidor.
- Precio y stock se recalculan en el servidor. Un pedido solo pasa a `pagado` por el webhook.
- Montos en centavos, MXN, IVA incluido.
- Nombre, logo y dominio configurables desde `src/config/marca.ts`; no escribir "Don Simon" ni `donsimonshoes.com` a mano.
- Todo lo visible en español de México, tuteando, incluidas las URLs. Nada de "Welcome", "Add to cart" o "Explore".
- Colores solo con tokens. Nunca café sobre terracota.
- WCAG 2.1 AA, móvil primero, Lighthouse ≥ 90. Ojo con el peso del bundle en Cloudflare Workers (2.89 MiB de 3 MiB en la última medición): no agregar librerías de carrusel, animación ni componentes pesados.
- Admin simple, en lenguaje claro y usable desde el celular.

Al terminar todo: actualizar `docs/03-arquitectura-de-informacion.md` (mapa del sitio y navegación), `docs/04-funcionalidades.md`, `docs/06-modelo-de-datos.md`, `docs/07-roadmap.md` y la sección de arquitectura de `CLAUDE.md`.
