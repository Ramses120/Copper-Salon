-- ==========================================
-- COPPER BEAUTY SALON - CLIENTES DE EJEMPLO
-- Noviembre 2025
-- ==========================================

BEGIN;

-- ===========================
-- CLIENTES
-- ===========================

INSERT INTO public.customers (name, phone, email, address, city, notes) VALUES
('María González', '+1-305-555-1234', 'maria@email.com', '123 Calle Principal', 'Miami', 'Cliente frecuente'),
('Sofia Martínez', '+1-305-555-5678', 'sofia@email.com', '456 Avenida Central', 'Miami', 'Prefiere servicios de cabello'),
('Ana Rodríguez', '+1-305-555-9101', 'ana@email.com', '789 Calle Segunda', 'Miami', 'Alérgica a productos químicos'),
('Isabella Torres', '+1-305-555-1121', 'isabella@email.com', '321 Calle Tercera', 'Miami', 'Cliente VIP'),
('Valentina López', '+1-305-555-3141', 'valentina@email.com', '654 Avenida Norte', 'Miami', 'Depilación brasileña semanal'),
('Camila Hernández', '+1-305-555-5161', 'camila@email.com', '987 Calle Cuarta', 'Miami', 'Balayage cada 2 meses'),
('Lucía Ramírez', '+1-305-555-7181', 'lucia@email.com', '147 Avenida Sur', 'Miami', 'Manicure semanal'),
('Daniela Castro', '+1-305-555-9202', 'daniela@email.com', '258 Calle Quinta', 'Miami', 'Cejas con henna mensual')
ON CONFLICT (phone) DO NOTHING;

COMMIT;
