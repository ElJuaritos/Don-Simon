CREATE TABLE "resenas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"producto_id" uuid NOT NULL,
	"pedido_id" uuid,
	"pedido_linea_id" uuid,
	"nombre" text NOT NULL,
	"ciudad" text,
	"calificacion" integer NOT NULL,
	"titulo" text NOT NULL,
	"texto" text NOT NULL,
	"ajuste" integer NOT NULL,
	"ancho_pie" text NOT NULL,
	"estado" text DEFAULT 'pendiente' NOT NULL,
	"verificada" boolean DEFAULT false NOT NULL,
	"respuesta" text,
	"respondida_en" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "resenas_pedido_linea_id_unique" UNIQUE("pedido_linea_id")
);
--> statement-breakpoint
ALTER TABLE "resenas" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_producto_id_productos_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_pedido_id_pedidos_id_fk" FOREIGN KEY ("pedido_id") REFERENCES "public"."pedidos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_pedido_linea_id_pedido_lineas_id_fk" FOREIGN KEY ("pedido_linea_id") REFERENCES "public"."pedido_lineas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "resenas_producto_idx" ON "resenas" USING btree ("producto_id");--> statement-breakpoint
CREATE INDEX "resenas_estado_idx" ON "resenas" USING btree ("estado");