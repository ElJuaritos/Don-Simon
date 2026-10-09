CREATE TABLE "productos_complementarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"producto_id" uuid NOT NULL,
	"complementario_id" uuid NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "productos_complementarios_par" UNIQUE("producto_id","complementario_id"),
	CONSTRAINT "complementario_distinto" CHECK ("productos_complementarios"."producto_id" <> "productos_complementarios"."complementario_id")
);
--> statement-breakpoint
ALTER TABLE "productos_complementarios" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "variantes" DROP CONSTRAINT "variantes_producto_color_talla";--> statement-breakpoint
ALTER TABLE "pedido_lineas" ALTER COLUMN "talla" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "variantes" ALTER COLUMN "talla" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "categorias" ADD COLUMN "tipo" text DEFAULT 'calzado' NOT NULL;--> statement-breakpoint
ALTER TABLE "pedido_lineas" ADD COLUMN "etiqueta_talla" text;--> statement-breakpoint
ALTER TABLE "variantes" ADD COLUMN "etiqueta_talla" text;--> statement-breakpoint
ALTER TABLE "productos_complementarios" ADD CONSTRAINT "productos_complementarios_producto_id_productos_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productos_complementarios" ADD CONSTRAINT "productos_complementarios_complementario_id_productos_id_fk" FOREIGN KEY ("complementario_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variantes" ADD CONSTRAINT "variantes_producto_color_talla" UNIQUE NULLS NOT DISTINCT("producto_id","color","talla","etiqueta_talla");