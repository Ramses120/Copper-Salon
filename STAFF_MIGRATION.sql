-- Migración de la tabla Staff para mejorar manejo de especialidades
-- Este script migra de 'specialty' a 'specialties' con mejor manejo de JSON

-- Paso 1: Agregar columna nueva 'specialties' con valor por defecto
ALTER TABLE "Staff" 
ADD COLUMN "specialties" TEXT NOT NULL DEFAULT '[]';

-- Paso 2: Migrar datos existentes de 'specialty' a 'specialties'
-- Si el campo specialty tiene valor, convertirlo a JSON array
UPDATE "Staff"
SET "specialties" = CASE 
  WHEN "specialty" IS NOT NULL AND "specialty" != '' 
  THEN jsonb_build_array("specialty")::text
  ELSE '[]'
END;

-- Paso 3: Verificar que los datos se migraron correctamente
-- SELECT id, name, specialty, specialties FROM "Staff" LIMIT 10;

-- Paso 4: Eliminar la columna antigua 'specialty' (opcional, después de verificar)
-- ALTER TABLE "Staff" DROP COLUMN "specialty";

-- Notas importantes:
-- - El campo 'specialties' ahora es TEXT que almacena JSON
-- - Puede almacenar hasta 5+ especialidades: ["Colorista & Estilista", "Maquilladora Profesional", ...]
-- - El teléfono (phone) es solo visible para admin
-- - El nombre (name) es el nombre completo del estilista
-- - Estos datos se sincronizarán con la página de reservas del cliente

-- Después de ejecutar este script en Supabase:
-- 1. Ejecuta: npx prisma migrate dev --name update_staff_specialties
-- 2. O usa: npx prisma db push
