# 08 · Decisiones pendientes

Preguntas que hay que resolver con la marca. Cuando se decida algo, se registra la respuesta aquí y se actualiza el documento afectado.

## Bloqueantes (antes de empezar a programar)

### 0. Conflicto de nombre y registro de marca
Ya existe **Don Simón**, una marca de jugos y vinos muy conocida en México y en España. Los dominios `donsimon.com` y `donsimon.com.mx` ya están ocupados o redirigen a esa marca.
- **Riesgo**: aunque sea otra categoría (calzado vs. bebidas), una marca famosa puede oponerse al registro o reclamar el uso. Hay que **buscar en el IMPI (MARCia)** si "Don Simon" está disponible en la **clase 25** (calzado y ropa) y, si lo está, registrarla antes del lanzamiento.
- **Opciones**: (a) mantener "Don Simon" si el IMPI lo permite; (b) agregar un distintivo ("Don Simon Calzado", "Don Simon Taller", "Casa Don Simon"); (c) cambiar de nombre.
- **Impacto en el desarrollo**: casi nulo. El nombre, el dominio y el logo son configurables, así que se puede empezar a programar con "Don Simon" y cambiarlo después sin rehacer nada.

**Decisión**: _pendiente_ (responsable: el dueño)

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

## Operación (antes del lanzamiento)

### 8. Envíos
¿Qué paquetería? ¿Costo fijo, por código postal o gratis a partir de cierto monto? ¿Envíos solo en México?

### 9. Cambios y devoluciones
¿Cambio de talla gratis? ¿Plazo (p. ej. 30 días)? ¿Quién paga el envío de regreso?

### 10. Facturación
¿Se emitirá CFDI? ¿Con qué proveedor (Facturama, Facturapi, contador)?

### 11. Dominio y correo
Depende de la decisión #0. Precios de referencia de la plática: ~620 MXN/año por un `.com.mx` (GoDaddy, Wix y otros).
- `.mx` / `.com.mx`: posicionan mejor en búsquedas desde México. `.com`: mejor si se piensa vender fuera.
- Un solo dominio sirve para varios países: los mercados se separan con rutas (`/us`, `/es`), no con dominios distintos.
- Recomendación: registrarlo en un proveedor que permita apuntar el DNS a Vercel (Cloudflare, Namecheap o GoDaddy). Evitar Wix, que está pensado para sitios hechos en Wix.
- ¿Correo de la marca (p. ej. `hola@dominio`) para contacto y notificaciones?

### 12. Redes y canales
Cuentas de Instagram, Facebook, TikTok y número de WhatsApp Business.

### 13. Quién opera la tienda
El dueño va a operar la tienda desde el panel de administración, y no tiene experiencia técnica. Por eso el admin debe ser muy simple y funcionar bien desde el celular.
¿Alguien más necesitará acceso (p. ej. para contenido o fotos)?
