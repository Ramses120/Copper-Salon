-- ==========================================
-- COPPER BEAUTY SALON - CATEGORÍAS Y SERVICIOS
-- Noviembre 2025
-- ==========================================

BEGIN;

-- ===========================
-- CATEGORÍAS DE SERVICIOS
-- ===========================

INSERT INTO public.categories (name, description, display_order, active) VALUES
('Cabello', 'Cortes, coloración y peinados profesionales', 1, TRUE),
('Depilación', 'Servicios de depilación con cera para todo el cuerpo', 2, TRUE),
('Cuidado Facial', 'Tratamientos faciales y cuidado de la piel', 3, TRUE),
('Cejas y Pestañas', 'Servicios especializados para cejas y pestañas', 4, TRUE),
('Uñas', 'Manicure, pedicure y tratamientos de uñas', 5, TRUE)
ON CONFLICT (name) DO NOTHING;

-- ===========================
-- SERVICIOS DE CABELLO
-- ===========================

INSERT INTO public.services (category_id, name, description, duration_minutes, price, active, featured) VALUES
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Women''s Cut', 'Corte de cabello para mujer', 45, 25.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Hairstyle', 'Peinado profesional', 60, 30.00, TRUE, FALSE),
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Blowout', 'Secado y peinado con brushing', 45, 35.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Men''s Cut', 'Corte de cabello para hombre', 30, 20.00, TRUE, FALSE),
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Kids Cut', 'Corte de cabello infantil', 30, 15.00, TRUE, FALSE),
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Partial Highlights', 'Mechas parciales', 120, 150.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Full Highlights', 'Mechas completas', 150, 200.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Balayage', 'Técnica de coloración balayage', 180, 175.00, TRUE, TRUE);

-- ===========================
-- SERVICIOS DE DEPILACIÓN
-- ===========================

INSERT INTO public.services (category_id, name, description, duration_minutes, price, active, featured) VALUES
((SELECT id FROM public.categories WHERE name = 'Depilación'), 'Hands Wax', 'Depilación de manos', 15, 15.00, TRUE, FALSE),
((SELECT id FROM public.categories WHERE name = 'Depilación'), 'Arms Wax (Full)', 'Depilación de brazos completos', 30, 40.00, TRUE, FALSE),
((SELECT id FROM public.categories WHERE name = 'Depilación'), 'Arms Wax (Half)', 'Depilación de medio brazo', 20, 25.00, TRUE, FALSE),
((SELECT id FROM public.categories WHERE name = 'Depilación'), 'Back Wax (Full)', 'Depilación de espalda completa', 45, 60.00, TRUE, FALSE),
((SELECT id FROM public.categories WHERE name = 'Depilación'), 'Brow Wax', 'Depilación de cejas', 15, 15.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Depilación'), 'Brazilian Bikini Wax', 'Depilación brasileña mujer', 45, 50.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Depilación'), 'Full Face Wax', 'Depilación facial completa', 30, 35.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Depilación'), 'Full Body Wax', 'Depilación corporal completa', 180, 370.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Depilación'), 'Legs Wax (Full)', 'Depilación de piernas completas', 50, 60.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Depilación'), 'Underarm Wax', 'Depilación de axilas', 15, 20.00, TRUE, FALSE);

-- ===========================
-- SERVICIOS DE CUIDADO FACIAL
-- ===========================

INSERT INTO public.services (category_id, name, description, duration_minutes, price, active, featured) VALUES
((SELECT id FROM public.categories WHERE name = 'Cuidado Facial'), 'Basic Facial', 'Facial básico', 60, 75.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cuidado Facial'), 'Facial & Hydrojelly Mask', 'Facial con mascarilla hydrojelly', 75, 85.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cuidado Facial'), 'Facial & Peeling', 'Facial con peeling', 75, 95.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cuidado Facial'), 'Hydrofacial', 'Tratamiento hydrofacial', 90, 100.00, TRUE, TRUE);

-- ===========================
-- SERVICIOS DE CEJAS Y PESTAÑAS
-- ===========================

INSERT INTO public.services (category_id, name, description, duration_minutes, price, active, featured) VALUES
((SELECT id FROM public.categories WHERE name = 'Cejas y Pestañas'), 'Lash Lifting', 'Elevación de pestañas', 60, 40.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cejas y Pestañas'), 'Lash Extension (Classic)', 'Extensiones de pestañas clásicas', 120, 100.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cejas y Pestañas'), 'Lash Extension Refill', 'Relleno de extensiones de pestañas', 60, 50.00, TRUE, FALSE),
((SELECT id FROM public.categories WHERE name = 'Cejas y Pestañas'), 'Brows Henna', 'Henna para cejas', 45, 40.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cejas y Pestañas'), 'Brows Lamination + Tint', 'Laminado y tinte de cejas', 60, 40.00, TRUE, TRUE);

-- ===========================
-- SERVICIOS DE UÑAS
-- ===========================

INSERT INTO public.services (category_id, name, description, duration_minutes, price, active, featured) VALUES
((SELECT id FROM public.categories WHERE name = 'Uñas'), 'Regular Pedicure', 'Pedicure regular', 45, 25.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Uñas'), 'Regular Manicure', 'Manicure regular', 30, 20.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Uñas'), 'Gel Manicure', 'Manicure en gel', 45, 35.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Uñas'), 'Gel Pedicure', 'Pedicure en gel', 45, 30.00, TRUE, FALSE),
((SELECT id FROM public.categories WHERE name = 'Uñas'), 'Set Gel Mani + Gel Pedi', 'Set manicure y pedicure en gel', 75, 60.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Uñas'), 'Acrylic New Set', 'Set nuevo de uñas acrílicas', 90, 70.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Uñas'), 'Acrylic Refill', 'Relleno de uñas acrílicas', 60, 60.00, TRUE, FALSE),
((SELECT id FROM public.categories WHERE name = 'Uñas'), 'Builder Gel Mani', 'Manicure con builder gel', 60, 45.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Uñas'), 'Luminary Mani', 'Manicure luminary', 60, 60.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Uñas'), 'Dip Manicure', 'Manicure dip powder', 60, 55.00, TRUE, TRUE);

COMMIT;
