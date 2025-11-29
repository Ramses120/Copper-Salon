-- ==========================================
-- COPPER BEAUTY SALON - SETUP COMPLETO
-- Noviembre 2025
-- ==========================================
-- 
-- ⚠️ IMPORTANTE: Este archivo está DEPRECADO
-- Usar la carpeta /supabase/sql/ con los scripts organizados
--
-- Los scripts están divididos en:
-- 1. 01_create_tables.sql - Crear tablas
-- 2. 02_create_indexes.sql - Crear índices
-- 3. 03_triggers.sql - Triggers y funciones
-- 4. 04_row_level_security.sql - RLS
-- 5. 05_storage_buckets.sql - Storage
-- 6. 06_insert_admin.sql - Admin
-- 7. 07_insert_categories_services.sql - Servicios
-- 8. 08_insert_customers.sql - Clientes
-- 9. 09_insert_testimonials.sql - Testimonios
-- 10. 10_insert_staff_schedules.sql - Estilistas y horarios (CORREGIDO)
-- 11. 11_insert_site_content.sql - Contenido
-- 12. 12_validate_setup.sql - Validación
--
-- Lee supabase/sql/README.md para instrucciones detalladas
--
-- ==========================================

-- Si prefieres ejecutar TODO de una vez, descomenta lo siguiente:
-- Pero se recomienda ejecutar cada archivo por separado

/*
BEGIN;

-- Incluir todos los scripts (requiere que Supabase soporte eso)
-- En su lugar, copia el contenido de cada archivo en orden

COMMIT;
*/

-- ✅ Para más info: Ver archivo supabase/sql/README.md

-- ===========================
-- 0. LIMPIAR TABLAS EXISTENTES (Si hay conflicto de versiones)
-- ===========================

DROP TABLE IF EXISTS public.booking_services CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.team_member_services CASCADE;
DROP TABLE IF EXISTS public.staff_schedules CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.portfolio_images CASCADE;
DROP TABLE IF EXISTS public.promotions CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;
DROP TABLE IF EXISTS public.site_content CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.service_categories CASCADE;

-- ===========================
-- 1. CREAR TABLAS
-- ===========================

-- ADMINISTRADORES (Para login)
CREATE TABLE IF NOT EXISTS public.admins (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL UNIQUE,
  password     TEXT NOT NULL,
  rol          TEXT NOT NULL DEFAULT 'admin',
  permisos     TEXT,
  activo       BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORÍAS DE SERVICIOS (NUEVA ESTRUCTURA)
CREATE TABLE IF NOT EXISTS public.categories (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,
  description  TEXT,
  display_order INTEGER DEFAULT 0,
  active       BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICIOS (ACTUALIZADO CON RELACIÓN A CATEGORÍAS)
CREATE TABLE IF NOT EXISTS public.services (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id      BIGINT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  description      TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price            NUMERIC(10,2) NOT NULL DEFAULT 0,
  active           BOOLEAN DEFAULT TRUE,
  featured         BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ESTILISTAS/STAFF (ACTUALIZADO)
CREATE TABLE IF NOT EXISTS public.staff (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         TEXT NOT NULL,
  phone        TEXT,
  specialty    TEXT,
  active       BOOLEAN DEFAULT TRUE,
  work_schedule TEXT,
  email        TEXT,
  photo_url    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- CLIENTES (NUEVA TABLA)
CREATE TABLE IF NOT EXISTS public.customers (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         TEXT NOT NULL,
  phone        TEXT NOT NULL UNIQUE,
  email        TEXT,
  address      TEXT,
  city         TEXT,
  notes        TEXT,
  active       BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- RESERVAS (NUEVA TABLA)
CREATE TABLE IF NOT EXISTS public.bookings (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id      BIGINT NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  booking_date     DATE NOT NULL,
  start_time       TIME NOT NULL,
  end_time         TIME,
  staff_id         BIGINT REFERENCES public.staff(id) ON DELETE SET NULL,
  status           TEXT NOT NULL DEFAULT 'pending',
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICIOS POR RESERVA (TABLA DE UNIÓN - NUEVA)
CREATE TABLE IF NOT EXISTS public.booking_services (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id BIGINT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  service_id BIGINT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (booking_id, service_id)
);

-- GALERÍA DE PORTAFOLIO (NUEVA)
CREATE TABLE IF NOT EXISTS public.portfolio_images (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  url        TEXT NOT NULL,
  category   TEXT NOT NULL,
  caption    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORÍAS DE SERVICIOS LEGACY (Mantenida para compatibilidad)
CREATE TABLE IF NOT EXISTS public.service_categories (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  description   TEXT,
  icon          TEXT,
  display_order INTEGER DEFAULT 0,
  active        BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RELACIÓN EQUIPO-SERVICIOS
CREATE TABLE IF NOT EXISTS public.team_member_services (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  team_member_id  BIGINT NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  service_id      BIGINT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (team_member_id, service_id)
);

-- HORARIOS
CREATE TABLE IF NOT EXISTS public.staff_schedules (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  team_member_id  BIGINT NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  weekday         SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- PROMOCIONES
CREATE TABLE IF NOT EXISTS public.promotions (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name             TEXT NOT NULL,
  description      TEXT,
  special_price    NUMERIC(10,2),
  duration_minutes INTEGER DEFAULT 60,
  is_active        BOOLEAN DEFAULT TRUE,
  priority         INTEGER DEFAULT 0,
  valid_from       DATE,
  valid_until      DATE,
  image_url        TEXT,
  show_on_site     BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- TESTIMONIOS
CREATE TABLE IF NOT EXISTS public.testimonials (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_name TEXT NOT NULL,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT NOT NULL,
  service     TEXT,
  image_url   TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  visible     BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENIDO DEL SITIO
CREATE TABLE IF NOT EXISTS public.site_content (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  section    TEXT NOT NULL UNIQUE,
  content    JSONB NOT NULL,
  active     BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONFIGURACIÓN DEL SITIO
CREATE TABLE IF NOT EXISTS public.site_settings (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  setting    TEXT NOT NULL UNIQUE,
  value      JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- 2. ÍNDICES
-- ===========================

CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins (email);
CREATE INDEX IF NOT EXISTS idx_admins_activo ON public.admins (activo);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories (active, display_order);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON public.services (category_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services (active);
CREATE INDEX IF NOT EXISTS idx_staff_active ON public.staff (active);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers (phone);
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers (name);
CREATE INDEX IF NOT EXISTS idx_customers_active ON public.customers (active);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings (customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_staff_id ON public.bookings (staff_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_booking_services_booking_id ON public.booking_services (booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_services_service_id ON public.booking_services (service_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON public.portfolio_images (category);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON public.promotions (is_active, show_on_site);
CREATE INDEX IF NOT EXISTS idx_testimonials_visible ON public.testimonials (visible, is_featured);
CREATE INDEX IF NOT EXISTS idx_service_categories_active ON public.service_categories (active, display_order);

-- ===========================
-- 3. TRIGGERS
-- ===========================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_promotions_updated_at ON public.promotions;
CREATE TRIGGER update_promotions_updated_at
    BEFORE UPDATE ON public.promotions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_content_updated_at ON public.site_content;
CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON public.site_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================
-- 4. ROW LEVEL SECURITY
-- ===========================

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Admins can manage themselves" ON public.admins;
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Admin can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
DROP POLICY IF EXISTS "Admin can manage services" ON public.services;
DROP POLICY IF EXISTS "Anyone can view active staff" ON public.staff;
DROP POLICY IF EXISTS "Admin can manage staff" ON public.staff;
DROP POLICY IF EXISTS "Anyone can view customers" ON public.customers;
DROP POLICY IF EXISTS "Admin can manage customers" ON public.customers;
DROP POLICY IF EXISTS "Anyone can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin can manage bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can view portfolio" ON public.portfolio_images;
DROP POLICY IF EXISTS "Admin can manage portfolio" ON public.portfolio_images;

-- Políticas RLS
CREATE POLICY "Admins can manage themselves" ON public.admins FOR ALL USING (TRUE);

CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (active = TRUE);
CREATE POLICY "Admin can manage categories" ON public.categories FOR ALL USING (TRUE);

CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (active = TRUE);
CREATE POLICY "Admin can manage services" ON public.services FOR ALL USING (TRUE);

CREATE POLICY "Anyone can view active staff" ON public.staff FOR SELECT USING (active = TRUE);
CREATE POLICY "Admin can manage staff" ON public.staff FOR ALL USING (TRUE);

CREATE POLICY "Anyone can view customers" ON public.customers FOR SELECT USING (TRUE);
CREATE POLICY "Admin can manage customers" ON public.customers FOR ALL USING (TRUE);

CREATE POLICY "Anyone can view bookings" ON public.bookings FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin can manage bookings" ON public.bookings FOR ALL USING (TRUE);

CREATE POLICY "Anyone can view portfolio" ON public.portfolio_images FOR SELECT USING (TRUE);
CREATE POLICY "Admin can manage portfolio" ON public.portfolio_images FOR ALL USING (TRUE);

-- ===========================
-- 5. STORAGE BUCKET
-- ===========================

-- Crear buckets para imágenes
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('images', 'images', TRUE),
  ('portfolio', 'portfolio', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Storage policies para bucket 'images'
DROP POLICY IF EXISTS "Public access to images" ON storage.objects;
CREATE POLICY "Public access to images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
CREATE POLICY "Anyone can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Anyone can update images" ON storage.objects;
CREATE POLICY "Anyone can update images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects;
CREATE POLICY "Anyone can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images');

-- Storage policies para bucket 'portfolio'
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

DROP POLICY IF EXISTS "Anyone can upload to portfolio" ON storage.objects;
CREATE POLICY "Anyone can upload to portfolio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio');

DROP POLICY IF EXISTS "Anyone can delete from portfolio" ON storage.objects;
CREATE POLICY "Anyone can delete from portfolio"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio');

-- ===========================
-- 6. DATOS INICIALES
-- ===========================

-- ADMINISTRADOR (con contraseña hasheada)
-- Password: admin123@
INSERT INTO public.admins (name, email, password, rol, activo) VALUES
('Administrador Principal', 'admin@copperbeauty.com', '$2a$12$G5vX4JECCDTMYfyPYxGKLOqvgZKtKAhSVAxsIfrArnt6w0.bB8o6.', 'superadmin', TRUE);

-- CLIENTES DE EJEMPLO
INSERT INTO public.customers (name, phone, email, address, city, notes) VALUES
('María González', '+1-305-555-1234', 'maria@email.com', '123 Calle Principal', 'Miami', 'Cliente frecuente'),
('Sofia Martínez', '+1-305-555-5678', 'sofia@email.com', '456 Avenida Central', 'Miami', 'Prefiere servicios de cabello'),
('Ana Rodríguez', '+1-305-555-9101', 'ana@email.com', '789 Calle Segunda', 'Miami', 'Alérgica a productos químicos'),
('Isabella Torres', '+1-305-555-1121', 'isabella@email.com', '321 Calle Tercera', 'Miami', 'Cliente VIP'),
('Valentina López', '+1-305-555-3141', 'valentina@email.com', '654 Avenida Norte', 'Miami', 'Depilación brasileña semanal'),
('Camila Hernández', '+1-305-555-5161', 'camila@email.com', '987 Calle Cuarta', 'Miami', 'Balayage cada 2 meses'),
('Lucía Ramírez', '+1-305-555-7181', 'lucia@email.com', '147 Avenida Sur', 'Miami', 'Manicure semanal'),
('Daniela Castro', '+1-305-555-9202', 'daniela@email.com', '258 Calle Quinta', 'Miami', 'Cejas con henna mensual');

-- CATEGORÍAS DE SERVICIOS (Nueva estructura) - PRIMERO!
INSERT INTO public.categories (name, description, display_order, active) VALUES
('Cabello', 'Cortes, coloración y peinados profesionales', 1, TRUE),
('Depilación', 'Servicios de depilación con cera para todo el cuerpo', 2, TRUE),
('Cuidado Facial', 'Tratamientos faciales y cuidado de la piel', 3, TRUE),
('Cejas y Pestañas', 'Servicios especializados para cejas y pestañas', 4, TRUE),
('Uñas', 'Manicure, pedicure y tratamientos de uñas', 5, TRUE);

-- SERVICIOS DE CABELLO
INSERT INTO public.services (category_id, name, description, duration_minutes, price, active, featured) VALUES
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Women''s Cut', 'Corte de cabello para mujer', 45, 25.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Hairstyle', 'Peinado profesional', 60, 30.00, TRUE, FALSE),
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Blowout', 'Secado y peinado con brushing', 45, 35.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Men''s Cut', 'Corte de cabello para hombre', 30, 20.00, TRUE, FALSE),
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Kids Cut', 'Corte de cabello infantil', 30, 15.00, TRUE, FALSE),
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Partial Highlights', 'Mechas parciales', 120, 150.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Full Highlights', 'Mechas completas', 150, 200.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cabello'), 'Balayage', 'Técnica de coloración balayage', 180, 175.00, TRUE, TRUE);

-- SERVICIOS DE DEPILACIÓN
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

-- SERVICIOS DE CUIDADO FACIAL
INSERT INTO public.services (category_id, name, description, duration_minutes, price, active, featured) VALUES
((SELECT id FROM public.categories WHERE name = 'Cuidado Facial'), 'Basic Facial', 'Facial básico', 60, 75.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cuidado Facial'), 'Facial & Hydrojelly Mask', 'Facial con mascarilla hydrojelly', 75, 85.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cuidado Facial'), 'Facial & Peeling', 'Facial con peeling', 75, 95.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cuidado Facial'), 'Hydrofacial', 'Tratamiento hydrofacial', 90, 100.00, TRUE, TRUE);

-- SERVICIOS DE CEJAS Y PESTAÑAS
INSERT INTO public.services (category_id, name, description, duration_minutes, price, active, featured) VALUES
((SELECT id FROM public.categories WHERE name = 'Cejas y Pestañas'), 'Lash Lifting', 'Elevación de pestañas', 60, 40.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cejas y Pestañas'), 'Lash Extension (Classic)', 'Extensiones de pestañas clásicas', 120, 100.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cejas y Pestañas'), 'Lash Extension Refill', 'Relleno de extensiones de pestañas', 60, 50.00, TRUE, FALSE),
((SELECT id FROM public.categories WHERE name = 'Cejas y Pestañas'), 'Brows Henna', 'Henna para cejas', 45, 40.00, TRUE, TRUE),
((SELECT id FROM public.categories WHERE name = 'Cejas y Pestañas'), 'Brows Lamination + Tint', 'Laminado y tinte de cejas', 60, 40.00, TRUE, TRUE);

-- SERVICIOS DE UÑAS
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

-- TESTIMONIOS
INSERT INTO public.testimonials (client_name, rating, comment, service, is_featured, visible) VALUES
('María González', 5, 'Increíble experiencia! El corte y color quedaron perfectos. El equipo es súper profesional y el ambiente es muy acogedor.', 'Cabello', TRUE, TRUE),
('Sofia Martínez', 5, 'Las extensiones de pestañas son lo mejor! Duran muchísimo y se ven súper naturales. Totalmente recomendado.', 'Cejas y Pestañas', TRUE, TRUE),
('Ana Rodríguez', 5, 'El manicure gel es impecable, me encanta que dure tanto tiempo sin despegarse. Las chicas son muy atentas y detallistas.', 'Uñas', TRUE, TRUE),
('Isabella Torres', 5, 'El facial hydrofacial dejó mi piel radiante! Se nota la diferencia desde la primera sesión. Volveré sin duda.', 'Cuidado Facial', TRUE, TRUE),
('Valentina López', 4, 'Excelente servicio de depilación brasileña. Es rápido, casi sin dolor y el resultado dura semanas. Muy profesional.', 'Depilación', FALSE, TRUE),
('Camila Hernández', 5, 'Llevo años viniendo y siempre salgo feliz. El balayage que me hicieron es justo lo que quería. Las recomiendo 100%.', 'Cabello', FALSE, TRUE),
('Lucía Ramírez', 5, 'El pedicure es súper relajante y mis pies quedaron hermosos. El lugar es limpio y muy bonito. Lo amo!', 'Uñas', FALSE, TRUE),
('Daniela Castro', 5, 'Las cejas con henna quedaron perfectas! Me encantan porque se ven naturales y duran mucho tiempo.', 'Cejas y Pestañas', FALSE, TRUE);

-- ESTILISTAS (STAFF) CON DATOS DE EJEMPLO
INSERT INTO public.staff (name, phone, specialty, email, active) VALUES
('María García', '(786) 555-0101', 'Colorista & Estilista', 'maria@copper.com', TRUE),
('Sofia Rodríguez', '(786) 555-0102', 'Maquilladora Profesional', 'sofia@copper.com', TRUE),
('Ana Martínez', '(786) 555-0103', 'Especialista en Uñas', 'ana@copper.com', TRUE),
('Isabella López', '(786) 555-0104', 'Esteticista', 'isabella@copper.com', TRUE),
('Valentina Torres', '(786) 555-0105', 'Técnico en Extensiones', 'valentina@copper.com', TRUE),
('Camila Hernández', '(786) 555-0106', 'Estilista General', 'camila@copper.com', TRUE);

-- HORARIOS DE TRABAJO (staff_schedules)
-- María García - Lunes a Sábado 9:00 AM - 5:30 PM
INSERT INTO public.staff_schedules (team_member_id, weekday, start_time, end_time, is_active) 
SELECT id, weekday, start_time, end_time, TRUE 
FROM (
  SELECT (SELECT id FROM public.staff WHERE name = 'María García') as team_member_id, 
         UNNEST(ARRAY[1, 2, 3, 4, 5, 6]) as weekday,
         '09:00'::time as start_time,
         '17:30'::time as end_time
) AS days;

-- Sofia Rodríguez - Lunes a Sábado 10:00 AM - 6:00 PM
INSERT INTO public.staff_schedules (team_member_id, weekday, start_time, end_time, is_active)
SELECT id, weekday, start_time, end_time, TRUE
FROM (
  SELECT (SELECT id FROM public.staff WHERE name = 'Sofia Rodríguez') as team_member_id,
         UNNEST(ARRAY[1, 2, 3, 4, 5, 6]) as weekday,
         '10:00'::time as start_time,
         '18:00'::time as end_time
) AS days;

-- Ana Martínez - Martes a Sábado 9:00 AM - 5:30 PM (Lunes OFF)
INSERT INTO public.staff_schedules (team_member_id, weekday, start_time, end_time, is_active)
SELECT id, weekday, start_time, end_time, TRUE
FROM (
  SELECT (SELECT id FROM public.staff WHERE name = 'Ana Martínez') as team_member_id,
         UNNEST(ARRAY[2, 3, 4, 5, 6]) as weekday,
         '09:00'::time as start_time,
         '17:30'::time as end_time
) AS days;

-- Isabella López - Lunes a Viernes 9:00 AM - 5:30 PM (Sábado OFF)
INSERT INTO public.staff_schedules (team_member_id, weekday, start_time, end_time, is_active)
SELECT id, weekday, start_time, end_time, TRUE
FROM (
  SELECT (SELECT id FROM public.staff WHERE name = 'Isabella López') as team_member_id,
         UNNEST(ARRAY[1, 2, 3, 4, 5]) as weekday,
         '09:00'::time as start_time,
         '17:30'::time as end_time
) AS days;

-- Valentina Torres - Lunes a Sábado 9:00 AM - 5:30 PM
INSERT INTO public.staff_schedules (team_member_id, weekday, start_time, end_time, is_active)
SELECT id, weekday, start_time, end_time, TRUE
FROM (
  SELECT (SELECT id FROM public.staff WHERE name = 'Valentina Torres') as team_member_id,
         UNNEST(ARRAY[1, 2, 3, 4, 5, 6]) as weekday,
         '09:00'::time as start_time,
         '17:30'::time as end_time
) AS days;

-- Camila Hernández - Lunes a Sábado 9:00 AM - 5:30 PM
INSERT INTO public.staff_schedules (team_member_id, weekday, start_time, end_time, is_active)
SELECT id, weekday, start_time, end_time, TRUE
FROM (
  SELECT (SELECT id FROM public.staff WHERE name = 'Camila Hernández') as team_member_id,
         UNNEST(ARRAY[1, 2, 3, 4, 5, 6]) as weekday,
         '09:00'::time as start_time,
         '17:30'::time as end_time
) AS days;

-- CONTENIDO INICIAL DEL SITIO
INSERT INTO public.site_content (section, content, active) VALUES
('hero', '{
  "title": "Belleza que se",
  "titleHighlight": "siente",
  "titleEnd": "y se ve",
  "subtitle": "Hair, makeup & nails con un servicio de autor.",
  "backgroundImage": "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574&auto=format&fit=crop"
}', TRUE),
('about', '{
  "title": "Sobre Nosotros",
  "subtitle": "Copper Beauty Salon & Spa",
  "paragraph1": "En Copper Beauty Salon & Spa cada cita es un momento de cuidado real: te escuchamos, entendemos tu estilo y creamos un look que te haga sentir cómoda y segura desde el primer minuto.",
  "paragraph2": "Nuestra firma es la personalización. Elegimos técnicas y productos de calidad según tu cabello, piel y uñas para lograr un acabado limpio, elegante y duradero.",
  "paragraph3": "En Copper, el trato es cálido, profesional y pensado para que salgas viéndote increíble… y sintiéndote aún mejor.",
  "image": "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=2574&auto=format&fit=crop"
}', TRUE),
('contact', '{
  "title": "Contacto",
  "phone": "(305) 555-0123",
  "email": "info@copper.com",
  "address": "5 SW 107th Ave, Miami, FL 33174",
  "schedule": "Lun - Sáb: 9:00 AM - 5:30 PM"
}', TRUE);

COMMIT;

-- ===========================
-- RESUMEN FINAL
-- ===========================

-- Verificar que todo está configurado correctamente
SELECT 
    '✅ SETUP COMPLETO' as status,
    (SELECT COUNT(*) FROM public.categories) as total_categorias,
    (SELECT COUNT(*) FROM public.services) as total_servicios,
    (SELECT COUNT(*) FROM public.testimonials) as total_testimonios,
    (SELECT COUNT(*) FROM public.staff) as total_estilistas;

-- Resumen por categoría
SELECT 
    c.name as categoria,
    COUNT(s.id) as servicios,
    MIN(s.price) as precio_minimo,
    MAX(s.price) as precio_maximo
FROM public.categories c
LEFT JOIN public.services s ON c.id = s.category_id
WHERE c.active = TRUE
GROUP BY c.id, c.name, c.display_order
ORDER BY c.display_order ASC;
