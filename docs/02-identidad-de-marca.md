# 02 · Identidad de marca

Varen es una marca mexicana de calzado de piel. El sitio debe verse sobrio: mucho blanco, el producto como protagonista y pocos acentos.

Los colores y las fuentes se usan solo mediante los tokens de `src/app/globals.css`. El nombre sale de `marca.nombre` en `src/config/marca.ts`.

## Logotipo

Hay dos PNG provisionales, con fondo transparente, en `public/marca/`:

| Archivo | Uso | Medida |
| --- | --- | --- |
| `varen-negro.png` | Fondos claros (blanco, niebla) | 1938×543 |
| `varen-blanco.png` | Fondos oscuros (pizarra, negro) | 1832×450 |

El componente `Logo` elige la versión con la prop `tono` (`claro` u `oscuro`). El texto alternativo es `marca.nombre`. En el header lleva `priority`.

Falta pedir el SVG. El favicon y el ícono de Apple son la «V» recortada del logotipo negro, sobre blanco (`src/app/icon.png` y `src/app/apple-icon.png`).

No se usa monograma ni una línea de «Est.».

## Paleta

| Token | Hex | Uso |
| --- | --- | --- |
| `blanco` | `#ffffff` | Fondo principal y texto sobre pizarra o negro |
| `niebla` | `#f2f0f0` | Fondos suaves, hover de botones claros |
| `topo` | `#aa9d92` | Cuadros sin foto, barras y el estado «en preparación» |
| `pizarra` | `#3d516b` | Barra de anuncio, footer, acentos (selección, foco, botón de acento) |
| `pizarra-oscuro` | `#2e3d52` | Hover de esos acentos |
| `negro` | `#000000` | Texto, botones principales, barra del menú, estrellas de reseñas |

### Contraste

Estas combinaciones son las que se pueden usar. El resto se evita.

| Texto | Fondo | Relación aprox. |
| --- | --- | --- |
| Negro | Blanco | 21:1 |
| Negro | Niebla | 18:1 |
| Negro | Topo | 8:1 |
| Blanco | Pizarra | 8.1:1 |
| Blanco | Negro | 21:1 |

- Sobre topo solo va texto negro, sin opacidad.
- Sobre pizarra solo va texto blanco. Un botón negro sobre pizarra no alcanza.
- No se usa texto topo.
- El texto secundario es negro al 70 %. Nunca baja de 60 %.
- En fondos oscuros el anillo de foco es blanco (`foco-claro`). En el resto es pizarra.
- La selección de texto es pizarra con texto blanco.

Los nombres de color de un producto («Café», «Coñac») son datos del catálogo, no tokens de la interfaz.

## Tipografía

Provisional, con `next/font`, hasta que llegue la tipografía definitiva:

- **Montserrat** para todo el texto (`--font-sans`).
- **Cormorant Garamond**, sin cursiva, solo en títulos de 32 px o más (`titulo-display`, `--font-display`).

## Uso

- Móvil primero, desde 375 px.
- Esquinas rectas o de radio mínimo. Animaciones suaves.
- El header de escritorio lleva tres franjas: anuncio en pizarra, logotipo sobre blanco y menú en negro. En el celular no hay barra negra.
- El footer es pizarra con texto blanco. El campo del boletín es blanco y su botón es blanco con texto negro.
