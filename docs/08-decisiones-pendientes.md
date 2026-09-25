# 08 · Decisiones pendientes

Preguntas que hay que resolver con la marca. Cuando se decida algo, se registra la respuesta aquí y se actualiza el documento afectado.

## Bloqueantes (antes de empezar a programar)

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

**Decisión**: _pendiente_

## Importantes (antes de diseñar)

### 4. Nombre oficial en textos
¿"Don Simón" (con acento) o "Don Simon" (como en el logotipo)?
**Decisión**: _pendiente_

### 5. Historia de marca
¿Quién es Don Simón? ¿Dónde está el taller? ¿Qué hace diferente al producto (piel, construcción, origen)? Esto define la página "Nuestra historia" y el tono de toda la comunicación.
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
¿Se emitirá CFDI? ¿Con qué proveedor (Facturama, Shopify app, contador)?

### 11. Dominio y correo
¿Dominio (`donsimon.mx`, `donsimon.com.mx`…)? ¿Correo de la marca para contacto y notificaciones?

### 12. Redes y canales
Cuentas de Instagram, Facebook, TikTok y número de WhatsApp Business.

### 13. Quién opera la tienda
¿Quién va a subir productos, atender pedidos y editar contenido? Esto afecta qué tan simple debe ser el panel de administración.
