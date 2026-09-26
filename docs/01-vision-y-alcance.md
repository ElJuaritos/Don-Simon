# 01 · Visión y alcance

## Visión

Don Simon es una marca de calzado de piel hecho a mano. El sitio debe sentirse como entrar a un taller: cálido, pausado y cuidado en los detalles. Además de mostrar el producto, tiene que dejar claro el oficio que hay detrás: el corte de la piel, las costuras, las herramientas.

## Contexto (plática inicial, 2026-09-26)

- **Tienda 100% en línea** al inicio, sin local físico.
- Posicionamiento: calzado **premium, de alta calidad y duradero**.
- El dueño lleva el branding junto con su pareja. El desarrollo se hace a la medida para lograr un diseño propio, sin plantillas genéricas.
- El dueño no tiene experiencia técnica, así que el panel de administración debe ser fácil de usar.
- **Arrancar con costos bajos**: servicios en plan gratuito mientras haya poco tráfico, y pasar a planes de pago solo cuando la demanda lo pida.
- Forma de trabajo: primero se construye un **esqueleto funcional** del sitio y del admin. El dueño y su pareja lo revisan, dan retroalimentación y se itera.
- A futuro: posible **tienda física**. El inventario tendría que compartirse entre ambos canales (ver [06](06-modelo-de-datos.md)). También posible venta a otros países.

## Objetivos

1. **Vender en línea**: un catálogo claro y una compra sin fricción, que funcione bien en el celular.
2. **Construir la marca**: presentar Don Simon como una marca premium y artesanal, no como una zapatería genérica.
3. **Generar confianza**: guía de tallas, envíos, cambios y devoluciones explicados de forma visible y sencilla.
4. **Captar clientes recurrentes**: newsletter, cuenta de cliente y, más adelante, lista de deseos.

## Público objetivo (hipótesis a validar)

- Hombres y mujeres de 25 a 55 años en México, de nivel socioeconómico medio-alto.
- Valoran la calidad, los materiales y lo hecho a mano por encima de la moda rápida.
- Compran principalmente desde el celular y llegan por Instagram o por recomendación.
- Tienen dudas sobre la talla al comprar zapatos en línea, así que la guía de tallas es crítica.

## Qué tomamos de las referencias

| Sitio | Qué funciona | Cómo lo aplicamos |
|-------|--------------|-------------------|
| Dante Shoes | Fotografía editorial a pantalla completa, navegación por categorías (mocasines, botas, etc.), estética sobria | Portada con imagen protagonista y colecciones como punto de entrada |
| Duque | Catálogo directo con filtros por talla y color, precios visibles, promociones claras | Listado de productos con filtros útiles y la compra a pocos clics |

Don Simon debe quedar en medio: la **narrativa visual de Dante** con la **claridad comercial de Duque**.

## Alcance del MVP

Incluido:
- Portada, catálogo, detalle de producto, carrito y checkout.
- Páginas de marca: Nuestra historia / El oficio.
- Páginas de ayuda: guía de tallas, envíos, cambios y devoluciones, preguntas frecuentes, contacto.
- Avisos legales: aviso de privacidad y términos y condiciones.
- Pagos con tarjeta y métodos locales (ver [decisiones pendientes](08-decisiones-pendientes.md)).
- Suscripción al newsletter.
- SEO básico y analítica.
- Panel de administración propio: productos, inventario, pedidos y contenido.

Fuera del MVP (fases posteriores):
- Cuentas de cliente con historial de pedidos.
- Lista de deseos, reseñas de producto.
- Pedidos personalizados o por encargo (horma, piel, grabado).
- Sitio en inglés y venta internacional.
- Blog / Journal.
- Programa de lealtad.

## Métricas de éxito

- Tasa de conversión (visitas → compra).
- Porcentaje de devoluciones por talla incorrecta (mide qué tan buena es la guía de tallas).
- Rendimiento en celular: Lighthouse ≥ 90 en Performance y Accesibilidad.
- Suscriptores al newsletter.
