# 08 · Decisiones pendientes

Preguntas que hay que resolver con la marca. Cuando se decida algo, se registra la respuesta aquí y se actualiza el documento afectado.

## Bloqueantes (antes de empezar a programar)

### 0. Conflicto de nombre y registro de marca
Ya existe **Don Simón**, una marca de jugos y vinos muy conocida en México y en España. Los dominios `donsimon.com` y `donsimon.com.mx` ya están ocupados o redirigen a esa marca.
- **Riesgo**: aunque sea otra categoría (calzado vs. bebidas), una marca famosa puede oponerse al registro o reclamar el uso. Hay que **buscar en el IMPI (MARCia)** si "Don Simon" está disponible en la **clase 25** (calzado y ropa) y, si lo está, registrarla antes del lanzamiento.
- **Opciones**: (a) mantener "Don Simon" si el IMPI lo permite; (b) agregar un distintivo ("Don Simon Calzado", "Don Simon Taller", "Casa Don Simon"); (c) cambiar de nombre.
- **Impacto en el desarrollo**: casi nulo. El nombre, el dominio y el logo son configurables, así que se puede empezar a programar con "Don Simon" y cambiarlo después sin rehacer nada.

**Decisión parcial (2026-09-29)**: ✅ La marca sigue como **Don Simon** y el dominio será **donsimonshoes.com** (ver #11). Falta confirmar el registro de la marca en el IMPI, clase 25 (responsable: el dueño).

### 1. Plataforma de comercio
¿Shopify (tema propio), headless (Next.js + Shopify) o todo a la medida?
**Decisión (2026-09-25)**: ✅ **Todo a la medida** (Next.js + Supabase + pasarela de pago). Ver [05](05-stack-tecnico.md).

### 2. Métodos de pago
¿Qué pasarela? ¿Tarjeta, OXXO, SPEI, PayPal? ¿Meses sin intereses desde el lanzamiento?

| | Stripe | Mercado Pago |
|---|---|---|
| Tarjetas, OXXO, MSI | ✅ | ✅ |
| SPEI | ✅ | ✅ |
| Confianza del comprador en México | Media (no se ve la marca) | Alta (mucha gente ya tiene cuenta) |
| Facilidad de integración | Excelente | Buena |

**Decisión (2026-09-25)**: ✅ **Stripe** (Stripe Checkout alojado + webhooks). Mercado Pago queda como opción futura.
**Pendiente**: definir si se activan OXXO, SPEI y meses sin intereses desde el lanzamiento (Stripe México soporta los tres).

### 3. Catálogo de lanzamiento
- ¿Cuántos modelos y qué categorías? (mocasines, botas, oxford, derby…)
- ¿Caballero, dama o ambos?
- Colores por modelo y rango de tallas (¿medias tallas?).
- ¿Rango de precios?
- ¿Hay modelos por encargo o todo es inventario disponible?

**Decisión parcial (2026-09-26)**: ✅ El sitio queda listo para **Hombre y Mujer**. Cada modelo se marca como hombre, mujer o unisex, y la navegación tiene entradas separadas. Los modelos, precios y tallas reales siguen _pendientes_.

## Importantes (antes de diseñar)

### 4. Nombre oficial en textos
**Decisión (2026-09-26)**: ✅ **"Don Simon", sin acento**, como en el logotipo.

### 4b. Dirección visual
El dueño compartió un PDF de estilo visual con referencias (Jean Pierre, Gran Par, Morjas, Myrqvist, Magnanni, Velasca, Dante).
**Decisión (2026-09-26)**: ✅ **Minimalismo cálido con base neutra**: fondos hueso, arena y piedra, y la paleta de marca solo como acento. Composición editorial de cuadros de imagen y texto, con el producto como protagonista. Ver [02](02-identidad-de-marca.md).

### 5. Historia de marca
¿Quién es Don Simon? ¿Dónde está el taller? ¿Qué hace diferente al producto (piel, construcción, origen)? Esto define la página "Nuestra historia" y el tono de toda la comunicación.
**Decisión**: _pendiente_

### 6. Fotografía
¿Ya existe una sesión de producto en fondo liso además de las fotos editoriales? ¿Hay fotos del taller real?
**Decisión**: _pendiente_

### 7. Tipografía The Seasons
Hay que comprar la licencia web. Si no se consigue, alternativas gratuitas similares: *Cormorant Garamond Italic*, *Playfair Display Italic* o *Italiana*.
**Decisión**: _pendiente_

### 4c. Rediseño según los mockups del dueño
El dueño mandó un segundo PDF (`Diseño Página WEB.pdf`) con la estructura que quiere, basada en Morjas y Myrqvist. El plan completo está en [09](09-plan-rediseno-mockups.md).
**Decisiones (2026-10-05)**:
- ✅ Barra de anuncio y franja legal del footer en **café oscuro con texto crema** (excepción a la regla de fondos, ver [02](02-identidad-de-marca.md)).
- ✅ **Solo español** al lanzar; los otros idiomas se agregan después.
- ✅ Portada **sin hero**: Hombre / Mujer a pantalla completa, Colección Hombre, Colección Mujer y un solo bloque editorial al final.
- ✅ Páginas de aterrizaje **`/hombre`** y **`/mujer`**, con foto de categoría distinta por público.
- ✅ Catálogo con **una tarjeta por color**.
- ✅ **Lookbook desde ahora**, con fotos generadas con IA que el dueño reemplazará.
- ✅ Checkout con **código postal primero** (autocompletado con SEPOMEX), **cupones desde Stripe** y prueba de **Embedded Checkout** (si no funciona en Workers, se queda el alojado).
- ✅ **Una sola suela por modelo**: solo cambian los colores. La suela no es variante ni filtro.
- ✅ Tallas en **MX** por defecto, con selector a US y EU.
- ✅ **Reseñas** visibles a partir de ~10 aprobadas; todas las aprueba el dueño.
- ✅ **Cuenta de cliente** con código o enlace por correo, sin contraseña. Se puede seguir comprando sin cuenta.
- ✅ **Puntos en una segunda etapa**. Primero la cuenta con historial de pedidos.
- _Pendiente_: reglas del programa de puntos (cuántos puntos por peso, valor, caducidad, cuándo se ganan).
- _Pendiente_: qué **accesorios** se venderán y con qué tallas (bloquea accesorios y "Combínalo con").
- _Pendiente_: si hay **taller o tienda física** que mostrar.

## Operación (antes del lanzamiento)

### 8. Envíos
¿Qué paquetería? ¿Costo fijo, por código postal o gratis a partir de cierto monto? ¿Envíos solo en México?

### 9. Cambios y devoluciones
¿Cambio de talla gratis? ¿Plazo (p. ej. 30 días)? ¿Quién paga el envío de regreso?

### 10. Facturación
¿Se emitirá CFDI? ¿Con qué proveedor (Facturama, Facturapi, contador)?

### 11. Dominio y correo
**Decisión (2026-09-29)**: ✅ Dominio **`donsimonshoes.com`**. Al ser `.com` funciona también si después se vende fuera de México.
- Pendiente: registrarlo (si no se ha hecho) en un proveedor que permita apuntar el DNS a Cloudflare, y crear el correo de la marca (p. ej. `hola@donsimonshoes.com`).

Notas de la plática: Precios de referencia de la plática: ~620 MXN/año por un `.com.mx` (GoDaddy, Wix y otros).
- `.mx` / `.com.mx`: posicionan mejor en búsquedas desde México. `.com`: mejor si se piensa vender fuera.
- Un solo dominio sirve para varios países: los mercados se separan con rutas (`/us`, `/es`), no con dominios distintos.
- Recomendación: registrarlo en un proveedor que permita apuntar el DNS a Vercel (Cloudflare, Namecheap o GoDaddy). Evitar Wix, que está pensado para sitios hechos en Wix.

### 11b. Hosting: Vercel o Cloudflare
El plan gratuito de Vercel (**Hobby**) solo permite uso personal y no comercial. Una tienda que vende es uso comercial y requiere el plan **Pro** (~20 USD/mes por miembro; con una sola persona, ~20 USD/mes). Confirmar precio vigente en vercel.com/pricing. Esto choca con el requisito de arrancar en planes gratuitos.
- **Opciones**: (a) Hobby durante el desarrollo y las revisiones del dueño, y Pro al abrir la tienda con ventas reales; (b) alojar en Cloudflare Workers (OpenNext) o Netlify, que permiten uso comercial gratis, pero implica replantear el stack y probar Server Actions, `proxy.ts` y el webhook de Stripe.
- **Recomendación**: (a). No cambia el código y el costo es bajo frente a lo que factura la tienda.

**Decisión (2026-09-30)**: ✅ **Cloudflare Workers, plan gratuito** (con el adaptador OpenNext), para arrancar sin costo. Cuando la tienda despegue se muda a **Vercel Pro**; el código sigue siendo Next.js estándar, así que la mudanza es de configuración.
- Límites del plan gratuito de Workers que hay que vigilar: **10 ms de CPU por petición**, **3 MiB comprimido** por Worker, **100,000 peticiones al día** y **50 subpeticiones** por petición. Primera medición del bundle: 2.89 MiB comprimido (muy justo).
- Si se rebasan, el siguiente paso es **Workers Paid (~5 USD/mes)**: 10 MiB, 30 s de CPU y sin límite diario. Sigue siendo mucho más barato que Vercel Pro.

### 12. Redes y canales
Cuentas de Instagram, Facebook, TikTok y número de WhatsApp Business.

### 13. Quién opera la tienda
El dueño va a operar la tienda desde el panel de administración, y no tiene experiencia técnica. Por eso el admin debe ser muy simple y funcionar bien desde el celular.
¿Alguien más necesitará acceso (p. ej. para contenido o fotos)?
