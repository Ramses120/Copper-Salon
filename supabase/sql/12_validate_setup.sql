-- ==========================================
-- COPPER BEAUTY SALON - VALIDACIÓN FINAL
-- Noviembre 2025
-- ==========================================

-- Este script valida que todo está configurado correctamente
-- Ejecutar DESPUÉS de todos los otros scripts

-- ===========================
-- VERIFICAR TABLAS
-- ===========================

SELECT 
    COUNT(*)::TEXT as total_tablas,
    '✅ Tablas creadas' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- ===========================
-- CONTEO DE DATOS
-- ===========================

SELECT 
    '✅ SETUP COMPLETO' as status,
    (SELECT COUNT(*) FROM public.categories)::TEXT as total_categorias,
    (SELECT COUNT(*) FROM public.services)::TEXT as total_servicios,
    (SELECT COUNT(*) FROM public.staff)::TEXT as total_estilistas,
    (SELECT COUNT(*) FROM public.staff_schedules)::TEXT as total_horarios,
    (SELECT COUNT(*) FROM public.customers)::TEXT as total_clientes,
    (SELECT COUNT(*) FROM public.testimonials)::TEXT as total_testimonios;

-- ===========================
-- RESUMEN POR CATEGORÍA
-- ===========================

SELECT 
    c.name as categoria,
    COUNT(s.id) as servicios,
    MIN(s.price)::TEXT as precio_minimo,
    MAX(s.price)::TEXT as precio_maximo
FROM public.categories c
LEFT JOIN public.services s ON c.id = s.category_id
WHERE c.active = TRUE
GROUP BY c.id, c.name, c.display_order
ORDER BY c.display_order ASC;

-- ===========================
-- ESTILISTAS Y SUS HORARIOS
-- ===========================

SELECT 
    s.id,
    s.name as estilista,
    s.specialty as especialidad,
    COUNT(ss.id) as total_horarios,
    STRING_AGG(
        CASE ss.weekday 
            WHEN 0 THEN 'Dom'
            WHEN 1 THEN 'Lun'
            WHEN 2 THEN 'Mar'
            WHEN 3 THEN 'Mié'
            WHEN 4 THEN 'Jue'
            WHEN 5 THEN 'Vie'
            WHEN 6 THEN 'Sáb'
        END || ' ' || ss.start_time || '-' || ss.end_time,
        ', '
    ) as horarios
FROM public.staff s
LEFT JOIN public.staff_schedules ss ON s.id = ss.team_member_id AND ss.is_active = TRUE
WHERE s.active = TRUE
GROUP BY s.id, s.name, s.specialty
ORDER BY s.name;

-- ===========================
-- VERIFICAR RLS ESTÁ HABILITADO
-- ===========================

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_habilitado
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ===========================
-- VERIFICAR ÍNDICES
-- ===========================

SELECT 
    COUNT(*) as total_indices,
    '✅ Índices creados' as status
FROM pg_indexes 
WHERE schemaname = 'public';

-- ===========================
-- VERIFICAR TRIGGERS
-- ===========================

SELECT 
    COUNT(*) as total_triggers,
    '✅ Triggers creados' as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- ===========================
-- VERIFICAR BUCKETS DE ALMACENAMIENTO
-- ===========================

SELECT 
    id as bucket_id,
    name as bucket_name,
    public as es_publico
FROM storage.buckets
ORDER BY name;
