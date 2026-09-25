# 03 · Arquitectura de información

## Mapa del sitio

```
/                               Portada
├── /coleccion                  Todos los productos
│   ├── /coleccion/[categoria]  Mocasines, Botas, Oxford, Derby, Sandalias… (por definir)
│   └── /producto/[slug]        Detalle de producto
├── /nuestra-historia           Historia de la marca y el oficio
├── /ayuda
│   ├── /guia-de-tallas
│   ├── /envios
│   ├── /cambios-y-devoluciones
│   ├── /cuidado-del-calzado
│   └── /preguntas-frecuentes
├── /contacto
├── /carrito
├── /checkout                   Datos de envío → pago en la pasarela → /checkout/gracias
├── /cuenta                     (fase 2)
├── /buscar
├── /admin                      Panel de administración (privado)
└── /legal
    ├── /aviso-de-privacidad
    └── /terminos-y-condiciones
```

## Navegación

**Header** (fijo; transparente sobre el hero de la portada y crema al hacer scroll):
- Izquierda: menú → Colección (con submenú de categorías) · Nuestra historia · Ayuda
- Centro: logotipo
- Derecha: buscar · cuenta · carrito (con contador)
- Móvil: menú hamburguesa a la izquierda, logo al centro, carrito a la derecha.

**Barra de anuncios** (opcional, encima del header): "Envío gratis a partir de $X" o avisos de temporada.

**Footer** (fondo café, texto crema):
- Monograma + frase de marca
- Tienda: categorías
- Ayuda: tallas, envíos, cambios, preguntas frecuentes, contacto
- Marca: nuestra historia, cuidado del calzado
- Newsletter (correo + botón)
- Redes sociales, métodos de pago aceptados, avisos legales, © 2026 Don Simón

## Páginas

### Portada `/`
1. **Hero** a pantalla completa: foto de producto en contexto natural, logotipo o frase en The Seasons y CTA "Ver colección".
2. **Categorías**: 3–4 tarjetas con foto (p. ej. Mocasines · Botas · Oxford).
3. **Productos destacados / novedades**: carrusel o cuadrícula de 4.
4. **El oficio**: bloque editorial partido en dos (foto del taller + texto corto + enlace a Nuestra historia).
5. **Detalle de materiales**: banda de color (olivo/terracota) con 3 atributos: "Piel curtida al vegetal", "Hecho a mano", "Suela cosida" (a confirmar).
6. **Galería / Instagram**: 4–6 fotos de lifestyle.
7. **Newsletter**.

### Colección `/coleccion` y `/coleccion/[categoria]`
- Título y descripción corta de la categoría (bueno para SEO).
- Filtros: categoría, talla, color, rango de precio. En móvil van en un panel lateral.
- Orden: destacados, novedades, precio ascendente/descendente.
- Tarjeta de producto: foto principal (en hover cambia a la segunda foto), nombre, color, precio y badge ("Nuevo", "Agotado", "Últimos pares").
- Paginación o "Cargar más".

### Detalle de producto `/producto/[slug]`
- Galería (en desktop, fotos en columna con scroll; en móvil, carrusel con swipe) y zoom.
- Nombre, precio y, si aplica, meses sin intereses.
- Selector de color (miniaturas) y selector de talla (botones; las tallas agotadas aparecen deshabilitadas).
- Enlace a la "Guía de tallas" (abre un modal).
- Botón "Agregar al carrito".
- Datos de confianza: envío, cambios gratis, hecho a mano.
- Acordeones: Descripción · Materiales y construcción · Horma y ajuste · Cuidado · Envíos y devoluciones.
- "Completa tu look" / productos relacionados.
- Tiempo de fabricación o entrega, si hay modelos por encargo.

### Carrito `/carrito`
- También como panel lateral (drawer) al agregar un producto.
- Líneas del carrito con foto, nombre, color, talla, cantidad y precio; subtotal; barra de progreso hacia el envío gratis; botón para ir al checkout.

### Nuestra historia `/nuestra-historia`
Página editorial larga: origen del nombre, quién es Don Simón, el taller, proceso paso a paso (patrón → corte → cosido → montado → acabado) con fotos, y materiales.

### Guía de tallas `/ayuda/guia-de-tallas`
Tabla de equivalencias MX / US / EU / cm, cómo medir el pie en casa y notas de horma por modelo ("talla normal", "recomendamos media talla menos").

### Contacto `/contacto`
Formulario, WhatsApp, correo, redes y, si existe, dirección del taller o showroom.
