# 03 · Arquitectura de información

## Mapa del sitio

```
/                               Portada
├── /coleccion                  Todos los productos (?para=hombre | ?para=mujer)
│   ├── /coleccion/[categoria]  Mocasines, Botas, Oxford, Derby, Sandalias… (por definir)
│   └── /producto/[slug]        Detalle de producto
├── /nuestra-historia           Historia de la marca y el oficio
├── /nuestras-hormas            Cada horma con foto, ancho y recomendación de talla
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

**Header** (fijo, fondo hueso):
- Izquierda: Hombre · Mujer · Colección (desplegable con categorías)
- Centro: logotipo
- Derecha: La casa (desplegable: Nuestra historia, Nuestras hormas, Cuidado del calzado) · buscar · carrito (con contador)
- Móvil: menú hamburguesa a la izquierda (Hombre y Mujer en grande, luego Colección, La casa y Ayuda), logo al centro, carrito a la derecha.

**Barra de anuncios** (opcional, encima del header): "Envío gratis a partir de $X" o avisos de temporada.

**Footer** (fondo arena, texto café):
- Monograma + frase de marca
- Tienda: categorías
- Ayuda: tallas, envíos, cambios, preguntas frecuentes, contacto
- Marca: nuestra historia, cuidado del calzado
- Newsletter (correo + botón)
- Redes sociales, métodos de pago aceptados, avisos legales, © 2026 Don Simon

## Páginas

### Portada `/`
Todos los textos y fotos se editan desde **Admin → Portada y textos** (tabla `bloques`).
1. **Hero** casi a pantalla completa: foto de producto, frase en The Seasons y CTA "Ver colección".
2. **Hombre / Mujer**: dos cuadros grandes con foto.
3. **Manifiesto**: frase corta centrada con mucho aire.
4. **Categorías**: tarjetas con foto (en móvil, carrusel horizontal).
5. **Favoritos**: cuadrícula de 4 destacados.
6. **El oficio**: bloque editorial partido (foto 7/12 + texto).
7. **Hormas**: mismo bloque invertido, con enlace a `/nuestras-hormas`.
8. **Galería**: una foto grande y dos apiladas.
9. **Valores**: hecho a mano, envío a todo México, pago seguro.
El newsletter vive en el footer.

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
Página editorial larga: origen del nombre, quién es Don Simon, el taller, proceso paso a paso (patrón → corte → cosido → montado → acabado) con fotos, y materiales. Los textos y fotos se editan desde **Admin → Portada y textos → Nuestra historia**.

### Nuestras hormas `/nuestras-hormas`
Una sección por horma, alternando foto y texto: descripción, ancho y recomendación de talla. Se edita en **Admin → Hormas**. La ficha de producto enlaza aquí desde "Horma y ajuste".

### Guía de tallas `/ayuda/guia-de-tallas`
Tabla de equivalencias MX / US / EU / cm, cómo medir el pie en casa y notas de horma por modelo ("talla normal", "recomendamos media talla menos").

### Contacto `/contacto`
Formulario, WhatsApp, correo, redes y, si existe, dirección del taller o showroom.
