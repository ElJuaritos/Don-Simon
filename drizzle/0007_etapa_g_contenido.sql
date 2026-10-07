CREATE TABLE "intentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hash_ip" text NOT NULL,
	"tipo" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "intentos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "notas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titulo" text NOT NULL,
	"slug" text NOT NULL,
	"resumen" text DEFAULT '' NOT NULL,
	"cuerpo" text DEFAULT '' NOT NULL,
	"imagen_url" text,
	"imagen_alt" text DEFAULT '' NOT NULL,
	"estado" text DEFAULT 'borrador' NOT NULL,
	"publicada_en" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notas_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "notas" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pieles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"slug" text NOT NULL,
	"descripcion" text DEFAULT '' NOT NULL,
	"cuidado" text DEFAULT '' NOT NULL,
	"imagen_url" text,
	"orden" integer DEFAULT 0 NOT NULL,
	"activa" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pieles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "pieles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "mensajes" ADD COLUMN "tipo" text DEFAULT 'contacto' NOT NULL;--> statement-breakpoint
CREATE INDEX "intentos_hash_tipo_idx" ON "intentos" USING btree ("hash_ip","tipo");