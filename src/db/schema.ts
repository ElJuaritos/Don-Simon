import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

// Modelo de datos: ver docs/06-modelo-de-datos.md
// Todos los montos son enteros en centavos de MXN, con IVA incluido.
// RLS activo en todas las tablas y sin políticas: la app entra por la conexión
// directa de Postgres, y así la API REST pública de Supabase no expone nada.

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const categorias = pgTable("categorias", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: text("nombre").notNull(),
  slug: text("slug").notNull().unique(),
  descripcion: text("descripcion").notNull().default(""),
  imagenUrl: text("imagen_url"),
  /** Foto de la categoría en Hombre. Si falta, se usa imagen_url. */
  imagenHombreUrl: text("imagen_hombre_url"),
  /** Foto de la categoría en Mujer. Si falta, se usa imagen_url. */
  imagenMujerUrl: text("imagen_mujer_url"),
  orden: integer("orden").notNull().default(0),
  ...timestamps,
}).enableRLS();

export const hormas = pgTable("hormas", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: text("nombre").notNull(),
  recomendacion: text("recomendacion").notNull(),
  ancho: text("ancho", { enum: ["estandar", "ancho"] }).notNull().default("estandar"),
  // Para la página "Nuestras hormas"
  descripcion: text("descripcion").notNull().default(""),
  imagenUrl: text("imagen_url"),
  orden: integer("orden").notNull().default(0),
  ...timestamps,
}).enableRLS();

export const ESTADOS_PRODUCTO = ["borrador", "activo", "archivado"] as const;
export const OCASIONES = ["formal", "casual", "boda"] as const;
export type Ocasion = (typeof OCASIONES)[number];
// Unisex aparece tanto en Hombre como en Mujer
export const PUBLICOS = ["hombre", "mujer", "unisex"] as const;
export type Publico = (typeof PUBLICOS)[number];

export const productos = pgTable("productos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: text("nombre").notNull(),
  slug: text("slug").notNull().unique(),
  categoriaId: uuid("categoria_id")
    .notNull()
    .references(() => categorias.id),
  hormaId: uuid("horma_id").references(() => hormas.id),
  publico: text("publico", { enum: PUBLICOS }).notNull().default("unisex"),
  descripcion: text("descripcion").notNull().default(""),
  precio: integer("precio").notNull(),
  precioComparacion: integer("precio_comparacion"),
  /** Texto corto para el filtro del catálogo, p. ej. "Piel de becerro". */
  material: text("material").notNull().default(""),
  /** Descripción larga de materiales, en la ficha. */
  materiales: text("materiales").notNull().default(""),
  ocasiones: text("ocasiones").array().notNull().default([]),
  construccion: text("construccion").notNull().default(""),
  suela: text("suela").notNull().default(""),
  cuidado: text("cuidado").notNull().default(""),
  hechoEn: text("hecho_en").notNull().default(""),
  destacado: boolean("destacado").notNull().default(false),
  estado: text("estado", { enum: ESTADOS_PRODUCTO }).notNull().default("borrador"),
  ...timestamps,
}).enableRLS();

export const variantes = pgTable(
  "variantes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productoId: uuid("producto_id")
      .notNull()
      .references(() => productos.id, { onDelete: "cascade" }),
    color: text("color").notNull(),
    colorHex: text("color_hex").notNull().default("#5d3f24"),
    // Talla MX en centímetros (25.5)
    talla: numeric("talla", { precision: 3, scale: 1, mode: "number" }).notNull(),
    sku: text("sku").notNull().unique(),
    stock: integer("stock").notNull().default(0),
    // Pares reservados por pedidos que esperan pago
    stockApartado: integer("stock_apartado").notNull().default(0),
    activo: boolean("activo").notNull().default(true),
    ...timestamps,
  },
  (t) => [unique("variantes_producto_color_talla").on(t.productoId, t.color, t.talla)],
).enableRLS();

export const imagenes = pgTable("imagenes", {
  id: uuid("id").primaryKey().defaultRandom(),
  productoId: uuid("producto_id")
    .notNull()
    .references(() => productos.id, { onDelete: "cascade" }),
  color: text("color"),
  url: text("url").notNull(),
  alt: text("alt").notNull(),
  orden: integer("orden").notNull().default(0),
  ...timestamps,
}).enableRLS();

export const ESTADOS_PEDIDO = [
  "pendiente_pago",
  "pagado",
  "en_preparacion",
  "enviado",
  "entregado",
  "cancelado",
  "devuelto",
] as const;
export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];

export type DireccionEnvio = {
  calle: string;
  numeroExt: string;
  numeroInt?: string;
  colonia: string;
  codigoPostal: string;
  ciudad: string;
  estado: string;
  referencias?: string;
};

export const pedidos = pgTable("pedidos", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Folio visible: DS-{10000 + numero}
  numero: serial("numero").notNull().unique(),
  email: text("email").notNull(),
  nombre: text("nombre").notNull(),
  telefono: text("telefono").notNull(),
  direccion: jsonb("direccion").$type<DireccionEnvio>().notNull(),
  subtotal: integer("subtotal").notNull(),
  /** Centavos descontados por un cupón de Stripe. Lo escribe el webhook al confirmar el pago. */
  descuento: integer("descuento").notNull().default(0),
  codigoDescuento: text("codigo_descuento"),
  envio: integer("envio").notNull(),
  total: integer("total").notNull(),
  estado: text("estado", { enum: ESTADOS_PEDIDO }).notNull().default("pendiente_pago"),
  canal: text("canal", { enum: ["en_linea", "tienda"] }).notNull().default("en_linea"),
  notas: text("notas").notNull().default(""),
  stripeSessionId: text("stripe_session_id").unique(),
  metodoPago: text("metodo_pago"),
  pagadoEn: timestamp("pagado_en", { withTimezone: true }),
  paqueteria: text("paqueteria"),
  numeroGuia: text("numero_guia"),
  enviadoEn: timestamp("enviado_en", { withTimezone: true }),
  ...timestamps,
}).enableRLS();

export const pedidoLineas = pgTable("pedido_lineas", {
  id: uuid("id").primaryKey().defaultRandom(),
  pedidoId: uuid("pedido_id")
    .notNull()
    .references(() => pedidos.id, { onDelete: "cascade" }),
  varianteId: uuid("variante_id").references(() => variantes.id, { onDelete: "set null" }),
  // Copia de los datos al momento de la compra
  nombreProducto: text("nombre_producto").notNull(),
  color: text("color").notNull(),
  talla: numeric("talla", { precision: 3, scale: 1, mode: "number" }).notNull(),
  sku: text("sku").notNull(),
  precioUnitario: integer("precio_unitario").notNull(),
  cantidad: integer("cantidad").notNull(),
}).enableRLS();

export const PREFERENCIAS_BOLETIN = ["hombre", "mujer", "ambos"] as const;
export type PreferenciaBoletin = (typeof PREFERENCIAS_BOLETIN)[number];

export const suscriptores = pgTable("suscriptores", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  origen: text("origen").notNull().default("footer"),
  preferencia: text("preferencia", { enum: PREFERENCIAS_BOLETIN }).notNull().default("ambos"),
  ...timestamps,
}).enableRLS();

// Galería editorial. Si después hay varias temporadas, se agrega una tabla lookbooks arriba.
export const lookbookFotos = pgTable("lookbook_fotos", {
  id: uuid("id").primaryKey().defaultRandom(),
  imagenUrl: text("imagen_url"),
  alt: text("alt").notNull().default(""),
  publico: text("publico", { enum: PUBLICOS }).notNull().default("hombre"),
  productoId: uuid("producto_id").references(() => productos.id, { onDelete: "set null" }),
  orden: integer("orden").notNull().default(0),
  activa: boolean("activa").notNull().default(true),
  ...timestamps,
}).enableRLS();

/**
 * Catálogo de SEPOMEX. No va en el seed ni en el repositorio: lo carga `npm run cp:generar`.
 * La tienda solo consulta un código a la vez.
 */
export const codigosPostales = pgTable("codigos_postales", {
  cp: text("cp").primaryKey(),
  estado: text("estado").notNull(),
  municipio: text("municipio").notNull(),
  ciudad: text("ciudad").notNull().default(""),
  colonias: text("colonias").array().notNull().default([]),
}).enableRLS();

export const ESTADOS_RESENA = ["pendiente", "publicada", "rechazada"] as const;
export type EstadoResena = (typeof ESTADOS_RESENA)[number];

export const ESTADOS_NOTA = ["borrador", "publicada"] as const;
export type EstadoNota = (typeof ESTADOS_NOTA)[number];

export const TIPOS_MENSAJE = ["contacto", "devolucion", "sugerencia"] as const;
export type TipoMensaje = (typeof TIPOS_MENSAJE)[number];
export const ANCHOS_PIE = ["angosto", "normal", "ancho"] as const;
export type AnchoPie = (typeof ANCHOS_PIE)[number];

/** Reseñas de producto. Entran pendientes y solo se publican si el dueño las aprueba. */
export const resenas = pgTable(
  "resenas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productoId: uuid("producto_id")
      .notNull()
      .references(() => productos.id, { onDelete: "cascade" }),
    pedidoId: uuid("pedido_id").references(() => pedidos.id, { onDelete: "set null" }),
    /** Una sola reseña por par (línea de pedido). Vacío si el dueño la capturó a mano. */
    pedidoLineaId: uuid("pedido_linea_id")
      .unique()
      .references(() => pedidoLineas.id, { onDelete: "set null" }),
    nombre: text("nombre").notNull(),
    ciudad: text("ciudad"),
    calificacion: integer("calificacion").notNull(),
    titulo: text("titulo").notNull(),
    texto: text("texto").notNull(),
    /** −2 muy chico, 0 fiel a la talla, 2 muy grande. */
    ajuste: integer("ajuste").notNull(),
    anchoPie: text("ancho_pie", { enum: ANCHOS_PIE }).notNull(),
    estado: text("estado", { enum: ESTADOS_RESENA }).notNull().default("pendiente"),
    /** True solo si el enlace salió de un pedido entregado. */
    verificada: boolean("verificada").notNull().default(false),
    respuesta: text("respuesta"),
    respondidaEn: timestamp("respondida_en", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index("resenas_producto_idx").on(t.productoId), index("resenas_estado_idx").on(t.estado)],
).enableRLS();

export const mensajes = pgTable("mensajes", {
  id: uuid("id").primaryKey().defaultRandom(),
  tipo: text("tipo", { enum: TIPOS_MENSAJE }).notNull().default("contacto"),
  nombre: text("nombre").notNull(),
  email: text("email").notNull(),
  telefono: text("telefono").notNull().default(""),
  mensaje: text("mensaje").notNull(),
  leido: boolean("leido").notNull().default(false),
  ...timestamps,
}).enableRLS();

/** Pieles de la página /pieles. Todavía no se ligan a los productos. */
export const pieles = pgTable("pieles", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: text("nombre").notNull(),
  slug: text("slug").notNull().unique(),
  descripcion: text("descripcion").notNull().default(""),
  cuidado: text("cuidado").notNull().default(""),
  imagenUrl: text("imagen_url"),
  orden: integer("orden").notNull().default(0),
  activa: boolean("activa").notNull().default(true),
  ...timestamps,
}).enableRLS();

/** Notas (blog). Un borrador no se muestra en la tienda. */
export const notas = pgTable("notas", {
  id: uuid("id").primaryKey().defaultRandom(),
  titulo: text("titulo").notNull(),
  slug: text("slug").notNull().unique(),
  resumen: text("resumen").notNull().default(""),
  cuerpo: text("cuerpo").notNull().default(""),
  imagenUrl: text("imagen_url"),
  imagenAlt: text("imagen_alt").notNull().default(""),
  estado: text("estado", { enum: ESTADOS_NOTA }).notNull().default("borrador"),
  publicadaEn: timestamp("publicada_en", { withTimezone: true }),
  ...timestamps,
}).enableRLS();

/**
 * Intentos de los formularios públicos (rastreo y cambios).
 * Guarda un hash de la IP, nunca la IP en claro. Se borran al día.
 */
export const intentos = pgTable(
  "intentos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hashIp: text("hash_ip").notNull(),
    tipo: text("tipo").notNull(),
    ...timestamps,
  },
  (t) => [index("intentos_hash_tipo_idx").on(t.hashIp, t.tipo)],
).enableRLS();

// Cuadros editables de la portada y de las páginas de marca (foto + textos).
// La lista de bloques y sus textos por defecto vive en src/content/bloques.ts;
// aquí solo se guarda lo que el dueño cambió desde el admin.
export const bloques = pgTable("bloques", {
  id: uuid("id").primaryKey().defaultRandom(),
  clave: text("clave").notNull().unique(),
  titulo: text("titulo"),
  texto: text("texto"),
  enlaceTexto: text("enlace_texto"),
  enlaceUrl: text("enlace_url"),
  imagenUrl: text("imagen_url"),
  imagenAlt: text("imagen_alt"),
  ...timestamps,
}).enableRLS();

export type Categoria = typeof categorias.$inferSelect;
export type Horma = typeof hormas.$inferSelect;
export type Producto = typeof productos.$inferSelect;
export type Variante = typeof variantes.$inferSelect;
export type Imagen = typeof imagenes.$inferSelect;
export type Pedido = typeof pedidos.$inferSelect;
export type PedidoLinea = typeof pedidoLineas.$inferSelect;
export type Bloque = typeof bloques.$inferSelect;
export type LookbookFoto = typeof lookbookFotos.$inferSelect;
export type Resena = typeof resenas.$inferSelect;
export type Mensaje = typeof mensajes.$inferSelect;
export type Piel = typeof pieles.$inferSelect;
export type Nota = typeof notas.$inferSelect;
