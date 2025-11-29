-- ============================================================
-- MIGRACIÓN DE TABLA STAFF EN SUPABASE
-- Agregar campo 'specialties' para múltiples especialidades
-- ============================================================

-- Paso 1: Agregar columna 'specialties' si no existe
ALTER TABLE staff
ADD COLUMN IF NOT EXISTS specialties TEXT DEFAULT '[]';

-- Paso 2: Si existe data en 'specialty', convertir a 'specialties'
UPDATE staff
SET specialties = 
  CASE 
    WHEN specialty IS NOT NULL AND specialty != '' 
    THEN jsonb_build_array(specialty)::text
    ELSE '[]'
  END
WHERE specialties = '[]' OR specialties IS NULL;

-- Paso 3: Renombrar columnas si es necesario (opcional)
-- Esta parte es solo si quieres cambiar los nombres de las columnas
-- para que coincidan con camelCase (photoUrl, workSchedule)

-- Agregar columnas en camelCase si no existen
ALTER TABLE staff
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS work_schedule TEXT DEFAULT '{}';

-- Paso 4: Verificar que todo está bien
-- SELECT id, name, phone, specialties, active FROM staff LIMIT 10;

-- ============================================================
-- NOTAS IMPORTANTES:
-- ============================================================
-- 1. El campo 'specialties' ahora es TEXT que almacena JSON
-- 2. Puede contener: ["Colorista", "Estilista", "Maquilladora", ...]
-- 3. El campo 'phone' es solo para admin (no visible para clientes)
-- 4. El nombre completo va en 'name'
-- 5. Estos datos se sincronizarán automáticamente con:
--    - Admin Panel: Para crear/editar estilistas
--    - Página de Reservas del Cliente: Para ver estilistas y sus especialidades

-- ============================================================
-- DESPUÉS DE EJECUTAR ESTE SQL:
-- ============================================================
-- 1. El admin panel podrá crear estilistas con múltiples especialidades
-- 2. Los clientes verán el estilista y sus especialidades al reservar
-- 3. La API sincronizará los datos automáticamente
