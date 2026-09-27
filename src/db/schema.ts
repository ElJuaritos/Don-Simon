import {
  boolean,
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
  orden: integer("orden").notNull().default(0),
  ...timestamps,
});

export const hormas = pgTable("hormas", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: text("nombre").notNull(),
  recomendacion: text("recomendacion").notNull(),
  ancho: text("ancho", { enum: ["estandar", "ancho"] }).notNull().default("estandar"),
  ...timestamps,
});

export const ESTADOS_PRODUCTO = ["borrador", "activo", "archivado"] as const;

export const productos = pgTable("productos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: text("nombre").notNull(),
  slug: text("slug").notNull().unique(),
  categoriaId: uuid("categoria_id")
    .notNull()
    .references(() => categorias.id),
  hormaId: uuid("horma_id").references(() => hormas.id),
  descripcion: text("descripcion").notNull().default(""),
  precio: integer("precio").notNull(),
  precioComparacion: integer("precio_comparacion"),
  materiales: text("materiales").notNull().default(""),
  construccion: text("construccion").notNull().default(""),
  suela: text("suela").notNull().default(""),
  cuidado: text("cuidado").notNull().default(""),
  hechoEn: text("hecho_en").notNull().default(""),
  destacado: boolean("destacado").notNull().default(false),
  estado: text("estado", { enum: ESTADOS_PRODUCTO }).notNull().default("borrador"),
  ...timestamps,
});

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
);

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
});

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
});

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
});

export const suscriptores = pgTable("suscriptores", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  origen: text("origen").notNull().default("footer"),
  ...timestamps,
});

export const mensajes = pgTable("mensajes", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: text("nombre").notNull(),
  email: text("email").notNull(),
  telefono: text("telefono").notNull().default(""),
  mensaje: text("mensaje").notNull(),
  leido: boolean("leido").notNull().default(false),
  ...timestamps,
});

export type Categoria = typeof categorias.$inferSelect;
export type Horma = typeof hormas.$inferSelect;
export type Producto = typeof productos.$inferSelect;
export type Variante = typeof variantes.$inferSelect;
export type Imagen = typeof imagenes.$inferSelect;
export type Pedido = typeof pedidos.$inferSelect;
export type PedidoLinea = typeof pedidoLineas.$inferSelect;
