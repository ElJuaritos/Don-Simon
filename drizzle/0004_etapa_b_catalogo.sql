ALTER TABLE "categorias" ADD COLUMN "imagen_hombre_url" text;--> statement-breakpoint
ALTER TABLE "categorias" ADD COLUMN "imagen_mujer_url" text;--> statement-breakpoint
ALTER TABLE "productos" ADD COLUMN "material" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "productos" ADD COLUMN "ocasiones" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
-- Datos de ejemplo ya cargados: no pisa un material que el dueño haya escrito.
UPDATE "productos" SET "material" = 'Piel de becerro', "ocasiones" = ARRAY['casual','formal']::text[] WHERE "slug" = 'mocasin-alameda' AND "material" = '';--> statement-breakpoint
UPDATE "productos" SET "material" = 'Gamuza', "ocasiones" = ARRAY['casual']::text[] WHERE "slug" = 'mocasin-olivar' AND "material" = '';--> statement-breakpoint
UPDATE "productos" SET "material" = 'Piel de becerro', "ocasiones" = ARRAY['casual']::text[] WHERE "slug" = 'bota-sierra' AND "material" = '';--> statement-breakpoint
UPDATE "productos" SET "material" = 'Piel de becerro', "ocasiones" = ARRAY['casual','formal']::text[] WHERE "slug" = 'chelsea-encino' AND "material" = '';--> statement-breakpoint
UPDATE "productos" SET "material" = 'Piel de becerro', "ocasiones" = ARRAY['formal','boda']::text[] WHERE "slug" = 'oxford-real' AND "material" = '';--> statement-breakpoint
UPDATE "productos" SET "material" = 'Gamuza', "ocasiones" = ARRAY['casual']::text[] WHERE "slug" = 'derby-campo' AND "material" = '';--> statement-breakpoint
UPDATE "productos" SET "material" = 'Piel de becerro', "ocasiones" = ARRAY['casual','formal']::text[] WHERE "slug" = 'mocasin-lucia' AND "material" = '';--> statement-breakpoint
UPDATE "productos" SET "material" = 'Gamuza', "ocasiones" = ARRAY['formal','boda']::text[] WHERE "slug" = 'botin-jacaranda' AND "material" = '';
