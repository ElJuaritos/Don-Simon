# 06 · Modelo de datos

Esquema de la base de datos PostgreSQL (se implementa con Drizzle en `src/db/schema.ts`). Todas las tablas llevan `id` (uuid), `created_at` y `updated_at`, aunque no se repitan en cada tabla de abajo. **Los montos se guardan en centavos, como enteros** (349000 = $3,490.00 MXN), para evitar errores de redondeo.

## Diagrama

```
categorias 1───* productos 1───* variantes (color + talla, sku, stock)
                    │  │
                    │  └───* imagenes (por color)
                    └───1 hormas

clientes 1───* direcciones
    │
    └───* pedidos 1───* pedido_lineas *───1 variantes
              │
              ├───* pagos
              └───* envios
productos 1───* resenas

carritos 1───* carrito_lineas *───1 variantes
suscriptores (newsletter)    lookbook_fotos *───0..1 productos
paginas (contenido editable)    ajustes (clave/valor)
```

## Catálogo

### `categorias`
| Campo | Tipo | Notas |
|-------|------|-------|
| nombre | text | "Mocasines" |
| slug | text, único | `mocasines` |
| descripcion | text | Para SEO y encabezado |
| imagen_url | text | Respaldo si falta la foto de un público |
| imagen_hombre_url | text, nullable | Foto en Hombre, en el catálogo y en el menú |
| imagen_mujer_url | text, nullable | Foto en Mujer, en el catálogo y en el menú |
| orden | int | |

### `hormas`
| Campo | Tipo | Notas |
|-------|------|-------|
| nombre | text | "Horma Clásica" |
| recomendacion | text | "Talla normal" / "Media talla menos" |
| ancho | enum | estandar, ancho |
| descripcion | text | Para `/nuestras-hormas` |
| imagen_url | text, nullable | |
| orden | int | |

### `productos`
| Campo | Tipo | Notas |
|-------|------|-------|
| nombre | text | "Mocasín Alameda" |
| slug | text, único | URL |
| categoria_id | fk | |
| horma_id | fk, nullable | |
| descripcion | text | Texto editorial |
| precio | int (centavos) | IVA incluido |
| precio_comparacion | int, nullable | Para mostrar ofertas |
| materiales | text | Descripción larga, en la ficha |
| material | text | Frase corta para el filtro, p. ej. "Piel de becerro" |
| ocasiones | text[] | `formal`, `casual`, `boda`. Puede haber varias |
| construccion | text | Blake / Goodyear / pegado |
| suela | text | |
| cuidado | text | |
| hecho_en | text | |
| dias_fabricacion | int, nullable | Solo para modelos por encargo |
| publico | enum | hombre, mujer, unisex (unisex aparece en ambos) |
| destacado | bool | Aparece en la portada |
| estado | enum | borrador, activo, archivado |
| seo_titulo, seo_descripcion | text | |

### `variantes`
| Campo | Tipo | Notas |
|-------|------|-------|
| producto_id | fk | |
| color | text | "Café" |
| color_hex | text | Para la muestra de color en el selector |
| talla | numeric(3,1) | 25.5 (MX, en cm) |
| sku | text, único | `DS-ALA-CAF-255` |
| stock | int | Disponible para vender |
| stock_apartado | int | Reservado por pedidos pendientes de pago |
| precio | int, nullable | Si es null, se usa el del producto |
| activo | bool | |

Restricción: único (`producto_id`, `color`, `talla`).
**Convención de SKU**: `DS-{MODELO}-{COLOR}-{TALLA}`.

### `imagenes`
| Campo | Tipo | Notas |
|-------|------|-------|
| producto_id | fk | |
| color | text, nullable | Al cambiar de color en la página, se filtra la galería |
| url | text | Supabase Storage |
| alt | text | Obligatorio |
| tipo | enum | producto, detalle, lifestyle |
| orden | int | |

## Clientes y carrito

### `clientes`
| Campo | Tipo | Notas |
|-------|------|-------|
| email | text, único | Se crea al comprar (aunque sea como invitado) |
| nombre, telefono | text | |
| auth_user_id | uuid, nullable | Solo si el cliente creó una cuenta (fase 2) |
| acepta_marketing | bool | |

### `direcciones`
cliente_id, nombre_destinatario, calle, numero_ext, numero_int, colonia, codigo_postal, ciudad, estado, referencias, telefono, predeterminada.

### `carritos` / `carrito_lineas`
- `carritos`: token (en una cookie), cliente_id (nullable), expira_en.
- `carrito_lineas`: carrito_id, variante_id, cantidad.

## Pedidos

### `pedidos`
| Campo | Tipo | Notas |
|-------|------|-------|
| folio | text, único | `DS-10001`, visible para el cliente |
| cliente_id | fk | |
| email, telefono | text | Copia al momento de la compra |
| direccion_envio | jsonb | Copia de la dirección (no una referencia, para que no cambie después) |
| subtotal, descuento, envio, total | int (centavos) | `descuento` default 0. El webhook lo llena con el cupón de Stripe y ajusta `total` a lo cobrado. `subtotal` y `envio` no cambian |
| codigo_descuento | text, nullable | Código del cupón, si se usó |
| estado | enum | ver abajo |
| notas | text | Regalo, indicaciones |
| requiere_factura | bool | |
| datos_fiscales | jsonb, nullable | RFC, razón social, régimen, uso CFDI, CP fiscal |

**Estados del pedido:**
```
pendiente_pago ──▶ pagado ──▶ en_preparacion ──▶ enviado ──▶ entregado
      │                                                        │
      └──▶ cancelado (pago vencido o rechazado)   devuelto ◀───┘
```

### `pedido_lineas`
pedido_id, variante_id, nombre_producto, color, talla, sku, precio_unitario, cantidad. Guardan una **copia** de los datos al momento de la compra, así el pedido no cambia si luego se edita el producto.

### `codigos_postales` (implementada)

Catálogo de SEPOMEX para autocompletar el envío. **No va en el seed ni en el repositorio**: la licencia no permite distribuirlo. Se carga en local con `npm run cp:generar` (servidor detenido) y la tienda solo pide un código, en `GET /api/cp/[cp]`. RLS activo, sin políticas.

| Campo | Tipo | Notas |
|-------|------|-------|
| cp | text, pk | 5 dígitos |
| estado, municipio, ciudad | text | `ciudad` puede ir vacía |
| colonias | text[] | Asentamientos de ese código |

### `resenas` (implementada)

Entran como `pendiente` y solo se publican si el dueño las aprueba. La tienda no las muestra hasta tener al menos `tienda.resenasMinimas` publicadas (hoy 10). Una línea de pedido solo puede tener una reseña. RLS activo, sin políticas. Las de ejemplo no van en el seed: las carga `npm run db:resenas-ejemplo` y solo en la base local.

| Campo | Tipo | Notas |
|-------|------|-------|
| producto_id | fk | |
| pedido_id | fk, nullable | Vacío si se capturó a mano |
| pedido_linea_id | fk, nullable, único | Una reseña por par comprado |
| nombre | text | El que se muestra, p. ej. "Ana L." |
| ciudad | text, nullable | |
| calificacion | int | 1 a 5 |
| titulo, texto | text | Texto plano, sin HTML |
| ajuste | int | −2 muy chico, 0 fiel a la talla, 2 muy grande |
| ancho_pie | text | `angosto`, `normal`, `ancho` |
| estado | text | `pendiente`, `publicada`, `rechazada` |
| verificada | bool | True solo si el enlace salió de un pedido entregado |
| respuesta | text, nullable | Respuesta de la tienda |
| respondida_en | timestamptz, nullable | |

Índices por `producto_id` y `estado`.

### `pagos`
pedido_id, proveedor (stripe), proveedor_id (checkout session / payment intent), metodo (tarjeta, oxxo, spei), estado, monto, respuesta (jsonb), pagado_en.

### `envios`
pedido_id, paqueteria, numero_guia, url_rastreo, enviado_en, entregado_en.

## Marketing y contenido

- **`cupones`** (fase 1.5): codigo, tipo (porcentaje / monto), valor, minimo_compra, usos_maximos, usos, vigencia.
- **`suscriptores`**: email, origen (footer, popup), preferencia (`hombre` / `mujer` / `ambos`).
- **`bloques`** (implementada): clave única, titulo, texto, enlace_texto, enlace_url, imagen_url, imagen_alt. Cada fila personaliza un cuadro de la portada, de los menús, del lookbook o de Nuestra historia. Los cuadros existentes y sus textos por defecto se definen en código (`src/content/bloques.ts`), así que la tabla solo guarda lo que el dueño cambió.
- **`lookbook_fotos`** (implementada): imagen_url, alt, publico (`hombre` / `mujer` / `unisex`), producto_id opcional, orden, activa. La galería `/lookbook` se edita en `/admin/lookbook`.
- **`paginas`**: slug, titulo, contenido (Markdown), seo. Para ayuda y legales.
- **`ajustes`**: clave/valor, p. ej. `barra_anuncio`, `envio_gratis_minimo`, `costo_envio`, `whatsapp`.

## Usuarios del admin

Se usa Supabase Auth, más una tabla `admins` (auth_user_id, nombre, rol: `dueño` | `operador`). Solo los usuarios de esta tabla pueden entrar a `/admin`.

## Preparado para una tienda física (futuro)

Si se abre un local, las ventas en tienda y en línea descuentan del **mismo inventario** (`variantes.stock`). Para permitirlo sin rehacer el modelo:
- `pedidos.canal`: enum `en_linea` | `tienda` (hoy siempre `en_linea`).
- Si hubiera varias ubicaciones, `variantes.stock` pasaría a una tabla `inventario(variante_id, ubicacion_id, cantidad)`.

## Tallas
- Sistema principal: **MX (cm)**; las equivalencias US/EU se muestran en la guía de tallas.
- Rango por definir (ver [08](08-decisiones-pendientes.md#3-catálogo-de-lanzamiento)).
