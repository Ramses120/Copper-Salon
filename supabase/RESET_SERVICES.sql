-- ==========================================
-- SCRIPT PARA ELIMINAR SERVICIOS Y CATEGORÍAS
-- ==========================================
-- Ejecuta este script en el SQL Editor de Supabase para limpiar
-- toda la información de servicios y permitir crear desde cero.

BEGIN;

-- 1. Eliminar todas las categorías.
-- Debido a la configuración "ON DELETE CASCADE", esto eliminará automáticamente:
-- - Todos los servicios asociados a estas categorías.
-- - Todas las relaciones de servicios con reservas (booking_services).
-- - Todas las relaciones de servicios con staff (team_member_services).
DELETE FROM public.categories;

-- 2. (Opcional) Asegurar que la tabla de servicios esté vacía
DELETE FROM public.services;

COMMIT;

-- Verificación
SELECT count(*) as total_categorias FROM public.categories;
SELECT count(*) as total_servicios FROM public.services;
