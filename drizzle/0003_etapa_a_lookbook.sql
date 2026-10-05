CREATE TABLE "lookbook_fotos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"imagen_url" text,
	"alt" text DEFAULT '' NOT NULL,
	"publico" text DEFAULT 'hombre' NOT NULL,
	"producto_id" uuid,
	"orden" integer DEFAULT 0 NOT NULL,
	"activa" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lookbook_fotos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "suscriptores" ADD COLUMN "preferencia" text DEFAULT 'ambos' NOT NULL;--> statement-breakpoint
ALTER TABLE "lookbook_fotos" ADD CONSTRAINT "lookbook_fotos_producto_id_productos_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("id") ON DELETE set null ON UPDATE no action;