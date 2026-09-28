CREATE TABLE "bloques" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clave" text NOT NULL,
	"titulo" text,
	"texto" text,
	"enlace_texto" text,
	"enlace_url" text,
	"imagen_url" text,
	"imagen_alt" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bloques_clave_unique" UNIQUE("clave")
);
--> statement-breakpoint
ALTER TABLE "categorias" ADD COLUMN "imagen_url" text;--> statement-breakpoint
ALTER TABLE "hormas" ADD COLUMN "descripcion" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "hormas" ADD COLUMN "imagen_url" text;--> statement-breakpoint
ALTER TABLE "hormas" ADD COLUMN "orden" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "productos" ADD COLUMN "publico" text DEFAULT 'unisex' NOT NULL;