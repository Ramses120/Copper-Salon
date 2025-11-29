-- ==========================================
-- COPPER BEAUTY SALON - ESTILISTAS Y HORARIOS
-- Noviembre 2025
-- VERSIÓN CORREGIDA - Sin error de sintaxis SQL
-- ==========================================

BEGIN;

-- ===========================
-- ESTILISTAS
-- ===========================

INSERT INTO public.staff (name, phone, specialty, email, active, auth_code) VALUES
('María García', '(786) 555-0101', 'Colorista & Estilista', 'maria@copper.com', TRUE, 'ST-LNQY6H-ABCDE1'),
('Sofia Rodríguez', '(786) 555-0102', 'Maquilladora Profesional', 'sofia@copper.com', TRUE, 'ST-LNQY6H-FGHIJ2'),
('Ana Martínez', '(786) 555-0103', 'Especialista en Uñas', 'ana@copper.com', TRUE, 'ST-LNQY6H-KLMNO3'),
('Isabella López', '(786) 555-0104', 'Esteticista', 'isabella@copper.com', TRUE, 'ST-LNQY6H-PQRST4'),
('Valentina Torres', '(786) 555-0105', 'Técnico en Extensiones', 'valentina@copper.com', TRUE, 'ST-LNQY6H-UVWXY5'),
('Camila Hernández', '(786) 555-0106', 'Estilista General', 'camila@copper.com', TRUE, 'ST-LNQY6H-ZABCD6');

-- ===========================
-- HORARIOS DE TRABAJO
-- ===========================

-- María García - Lunes a Sábado 9:00 AM - 5:30 PM
INSERT INTO public.staff_schedules (team_member_id, weekday, start_time, end_time, is_active)
VALUES 
  ((SELECT id FROM public.staff WHERE name = 'María García'), 1, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'María García'), 2, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'María García'), 3, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'María García'), 4, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'María García'), 5, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'María García'), 6, '09:00'::time, '17:30'::time, TRUE);

-- Sofia Rodríguez - Lunes a Sábado 10:00 AM - 6:00 PM
INSERT INTO public.staff_schedules (team_member_id, weekday, start_time, end_time, is_active)
VALUES 
  ((SELECT id FROM public.staff WHERE name = 'Sofia Rodríguez'), 1, '10:00'::time, '18:00'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Sofia Rodríguez'), 2, '10:00'::time, '18:00'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Sofia Rodríguez'), 3, '10:00'::time, '18:00'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Sofia Rodríguez'), 4, '10:00'::time, '18:00'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Sofia Rodríguez'), 5, '10:00'::time, '18:00'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Sofia Rodríguez'), 6, '10:00'::time, '18:00'::time, TRUE);

-- Ana Martínez - Martes a Sábado 9:00 AM - 5:30 PM (Lunes OFF)
INSERT INTO public.staff_schedules (team_member_id, weekday, start_time, end_time, is_active)
VALUES 
  ((SELECT id FROM public.staff WHERE name = 'Ana Martínez'), 2, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Ana Martínez'), 3, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Ana Martínez'), 4, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Ana Martínez'), 5, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Ana Martínez'), 6, '09:00'::time, '17:30'::time, TRUE);

-- Isabella López - Lunes a Viernes 9:00 AM - 5:30 PM (Sábado OFF)
INSERT INTO public.staff_schedules (team_member_id, weekday, start_time, end_time, is_active)
VALUES 
  ((SELECT id FROM public.staff WHERE name = 'Isabella López'), 1, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Isabella López'), 2, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Isabella López'), 3, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Isabella López'), 4, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Isabella López'), 5, '09:00'::time, '17:30'::time, TRUE);

-- Valentina Torres - Lunes a Sábado 9:00 AM - 5:30 PM
INSERT INTO public.staff_schedules (team_member_id, weekday, start_time, end_time, is_active)
VALUES 
  ((SELECT id FROM public.staff WHERE name = 'Valentina Torres'), 1, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Valentina Torres'), 2, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Valentina Torres'), 3, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Valentina Torres'), 4, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Valentina Torres'), 5, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Valentina Torres'), 6, '09:00'::time, '17:30'::time, TRUE);

-- Camila Hernández - Lunes a Sábado 9:00 AM - 5:30 PM
INSERT INTO public.staff_schedules (team_member_id, weekday, start_time, end_time, is_active)
VALUES 
  ((SELECT id FROM public.staff WHERE name = 'Camila Hernández'), 1, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Camila Hernández'), 2, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Camila Hernández'), 3, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Camila Hernández'), 4, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Camila Hernández'), 5, '09:00'::time, '17:30'::time, TRUE),
  ((SELECT id FROM public.staff WHERE name = 'Camila Hernández'), 6, '09:00'::time, '17:30'::time, TRUE);

COMMIT;
