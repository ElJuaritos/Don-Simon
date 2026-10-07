CREATE TABLE "codigos_postales" (
	"cp" text PRIMARY KEY NOT NULL,
	"estado" text NOT NULL,
	"municipio" text NOT NULL,
	"ciudad" text DEFAULT '' NOT NULL,
	"colonias" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "codigos_postales" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pedidos" ADD COLUMN "descuento" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "pedidos" ADD COLUMN "codigo_descuento" text;