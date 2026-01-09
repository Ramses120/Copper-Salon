-- ==========================================
-- COPPER BEAUTY SALON - ESQUEMA + RLS + SEEDS (FIX FK)
-- Enero 2026 (corregido: categorías antes de servicios)
-- ==========================================

BEGIN;

-- ===========================
-- 0) PERMISOS BÁSICOS (SUPABASE)
-- ===========================
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- ===========================
-- 1) TABLAS PRINCIPALES
-- ===========================

-- ADMINISTRADORES
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

-- CATEGORÍAS DE SERVICIOS
CREATE TABLE IF NOT EXISTS public.categories (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  description   TEXT,
  display_order INTEGER DEFAULT 0,
  active        BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICIOS
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

-- ESTILISTAS/STAFF
CREATE TABLE IF NOT EXISTS public.staff (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          TEXT NOT NULL,
  phone         TEXT,
  specialty     TEXT,
  active        BOOLEAN DEFAULT TRUE,
  work_schedule TEXT,
  email         TEXT,
  photo_url     TEXT,
  auth_code     TEXT UNIQUE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- HORARIOS DE TRABAJO
CREATE TABLE IF NOT EXISTS public.staff_schedules (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  team_member_id  BIGINT NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  weekday         SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- CLIENTES
CREATE TABLE IF NOT EXISTS public.customers (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL UNIQUE,
  email      TEXT,
  address    TEXT,
  city       TEXT,
  notes      TEXT,
  active     BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLIENTES DESACTIVADOS (bitácora)
CREATE TABLE IF NOT EXISTS public.deactivated_customers (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id     BIGINT NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  name            TEXT,
  phone           TEXT,
  email           TEXT,
  notes           TEXT,
  deactivated_at  TIMESTAMPTZ DEFAULT NOW(),
  reactivated_at  TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_deactivated_customers_customer ON public.deactivated_customers (customer_id);

-- RESERVAS
CREATE TABLE IF NOT EXISTS public.bookings (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id  BIGINT NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time   TIME NOT NULL,
  end_time     TIME,
  staff_id     BIGINT REFERENCES public.staff(id) ON DELETE SET NULL,
  status       TEXT NOT NULL DEFAULT 'pending',
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICIOS POR RESERVA
CREATE TABLE IF NOT EXISTS public.booking_services (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id BIGINT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  service_id BIGINT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (booking_id, service_id)
);

-- GALERÍA DE PORTAFOLIO
CREATE TABLE IF NOT EXISTS public.portfolio_images (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  url        TEXT NOT NULL,
  category   TEXT NOT NULL,
  caption    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ÚNICO PARA ON CONFLICT (url)
CREATE UNIQUE INDEX IF NOT EXISTS portfolio_images_url_unique
ON public.portfolio_images (url);

-- RELACIÓN EQUIPO-SERVICIOS
CREATE TABLE IF NOT EXISTS public.team_member_services (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  team_member_id BIGINT NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  service_id     BIGINT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (team_member_id, service_id)
);

-- PROMOCIONES
CREATE TABLE IF NOT EXISTS public.promotions (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name             TEXT NOT NULL,
  description      TEXT,
  special_price    NUMERIC(10,2),
  discount         NUMERIC(10,2),
  type             VARCHAR(50) DEFAULT 'percentage',
  duration_minutes INTEGER DEFAULT 60,
  is_active        BOOLEAN DEFAULT TRUE,
  priority         INTEGER DEFAULT 0,
  valid_from       DATE,
  valid_until      DATE,
  start_date       DATE,
  end_date         DATE,
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
-- 2) ÍNDICES
-- ===========================
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins (email);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories (active, display_order);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON public.services (category_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services (active);
CREATE INDEX IF NOT EXISTS idx_staff_active ON public.staff (active);
CREATE INDEX IF NOT EXISTS idx_staff_schedules_team ON public.staff_schedules (team_member_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers (phone);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings (customer_id);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON public.promotions (is_active, show_on_site);
CREATE INDEX IF NOT EXISTS idx_testimonials_visible ON public.testimonials (visible, is_featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_images_category ON public.portfolio_images (category);

-- Necesario para tu ON CONFLICT (category_id, name)
CREATE UNIQUE INDEX IF NOT EXISTS services_unique_category_name
ON public.services (category_id, name);

-- ===========================
-- 3) TRIGGERS (UPDATED_AT)
-- ===========================
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
DROP TRIGGER IF EXISTS update_staff_updated_at ON public.staff;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
DROP TRIGGER IF EXISTS update_customers_updated_at ON public.customers;
DROP TRIGGER IF EXISTS update_promotions_updated_at ON public.promotions;
DROP TRIGGER IF EXISTS update_site_content_updated_at ON public.site_content;
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
DROP TRIGGER IF EXISTS update_portfolio_images_updated_at ON public.portfolio_images;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at
BEFORE UPDATE ON public.promotions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_images_updated_at
BEFORE UPDATE ON public.portfolio_images
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================
-- 4) RLS (SEGURIDAD)
-- ===========================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deactivated_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ===========================
-- 4.1) LIMPIEZA DE POLÍTICAS
-- ===========================
DROP POLICY IF EXISTS "Public read access - categories" ON public.categories;
DROP POLICY IF EXISTS "Public read access - services" ON public.services;
DROP POLICY IF EXISTS "Public read access - staff" ON public.staff;
DROP POLICY IF EXISTS "Public read access - staff_schedules" ON public.staff_schedules;
DROP POLICY IF EXISTS "Public read access - portfolio_images" ON public.portfolio_images;
DROP POLICY IF EXISTS "Public read access - promotions" ON public.promotions;
DROP POLICY IF EXISTS "Public read access - testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public read access - site_content" ON public.site_content;

DROP POLICY IF EXISTS "Public insert access - customers" ON public.customers;
DROP POLICY IF EXISTS "Public update access - customers" ON public.customers;
DROP POLICY IF EXISTS "Public insert access - bookings" ON public.bookings;
DROP POLICY IF EXISTS "Public insert access - booking_services" ON public.booking_services;

DROP POLICY IF EXISTS "Admins full access - admins" ON public.admins;
DROP POLICY IF EXISTS "Admins full access - categories" ON public.categories;
DROP POLICY IF EXISTS "Admins full access - services" ON public.services;
DROP POLICY IF EXISTS "Admins full access - staff" ON public.staff;
DROP POLICY IF EXISTS "Admins full access - staff_schedules" ON public.staff_schedules;
DROP POLICY IF EXISTS "Admins full access - customers" ON public.customers;
DROP POLICY IF EXISTS "Admins full access - deactivated_customers" ON public.deactivated_customers;
DROP POLICY IF EXISTS "Admins full access - bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins full access - booking_services" ON public.booking_services;
DROP POLICY IF EXISTS "Admins full access - portfolio_images" ON public.portfolio_images;
DROP POLICY IF EXISTS "Admins full access - promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admins full access - testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins full access - site_content" ON public.site_content;
DROP POLICY IF EXISTS "Admins full access - site_settings" ON public.site_settings;

-- ===========================
-- 4.2) POLÍTICAS DE LECTURA PÚBLICA
-- ===========================
CREATE POLICY "Public read access - categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read access - services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public read access - staff" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Public read access - staff_schedules" ON public.staff_schedules FOR SELECT USING (true);
CREATE POLICY "Public read access - portfolio_images" ON public.portfolio_images FOR SELECT USING (true);
CREATE POLICY "Public read access - promotions" ON public.promotions FOR SELECT USING (true);
CREATE POLICY "Public read access - testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public read access - site_content" ON public.site_content FOR SELECT USING (true);

-- ===========================
-- 4.3) POLÍTICAS PÚBLICAS PARA RESERVAS (MVP)
-- ===========================
CREATE POLICY "Public insert access - customers"
  ON public.customers FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access - customers"
  ON public.customers FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Public insert access - bookings"
  ON public.bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert access - booking_services"
  ON public.booking_services FOR INSERT WITH CHECK (true);

-- ===========================
-- 4.4) ADMIN TOTAL
-- ===========================
CREATE OR REPLACE FUNCTION public.is_copper_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admins a
    WHERE a.email = auth.jwt()->>'email'
      AND a.activo = TRUE
  );
END;
$$;

CREATE POLICY "Admins full access - admins"        ON public.admins        FOR ALL USING (public.is_copper_admin()) WITH CHECK (public.is_copper_admin());
CREATE POLICY "Admins full access - categories"    ON public.categories    FOR ALL USING (public.is_copper_admin()) WITH CHECK (public.is_copper_admin());
CREATE POLICY "Admins full access - services"      ON public.services      FOR ALL USING (public.is_copper_admin()) WITH CHECK (public.is_copper_admin());
CREATE POLICY "Admins full access - staff"         ON public.staff         FOR ALL USING (public.is_copper_admin()) WITH CHECK (public.is_copper_admin());
CREATE POLICY "Admins full access - staff_schedules" ON public.staff_schedules FOR ALL USING (public.is_copper_admin()) WITH CHECK (public.is_copper_admin());
CREATE POLICY "Admins full access - customers"     ON public.customers     FOR ALL USING (public.is_copper_admin()) WITH CHECK (public.is_copper_admin());
CREATE POLICY "Admins full access - deactivated_customers" ON public.deactivated_customers FOR ALL USING (public.is_copper_admin()) WITH CHECK (public.is_copper_admin());
CREATE POLICY "Admins full access - bookings"      ON public.bookings      FOR ALL USING (public.is_copper_admin()) WITH CHECK (public.is_copper_admin());
CREATE POLICY "Admins full access - booking_services" ON public.booking_services FOR ALL USING (public.is_copper_admin()) WITH CHECK (public.is_copper_admin());
CREATE POLICY "Admins full access - portfolio_images" ON public.portfolio_images FOR ALL USING (public.is_copper_admin()) WITH CHECK (public.is_copper_admin());
CREATE POLICY "Admins full access - promotions"    ON public.promotions    FOR ALL USING (public.is_copper_admin()) WITH CHECK (public.is_copper_admin());
CREATE POLICY "Admins full access - testimonials"  ON public.testimonials  FOR ALL USING (public.is_copper_admin()) WITH CHECK (public.is_copper_admin());
CREATE POLICY "Admins full access - site_content"  ON public.site_content  FOR ALL USING (public.is_copper_admin()) WITH CHECK (public.is_copper_admin());
CREATE POLICY "Admins full access - site_settings" ON public.site_settings FOR ALL USING (public.is_copper_admin()) WITH CHECK (public.is_copper_admin());

-- ===========================
-- 5) GRANTS
-- ===========================
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.services TO anon, authenticated;
GRANT SELECT ON public.staff TO anon, authenticated;
GRANT SELECT ON public.staff_schedules TO anon, authenticated;
GRANT SELECT ON public.portfolio_images TO anon, authenticated;
GRANT SELECT ON public.promotions TO anon, authenticated;
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT SELECT ON public.site_content TO anon, authenticated;

GRANT INSERT, UPDATE ON public.customers TO anon, authenticated;
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT INSERT ON public.booking_services TO anon, authenticated;

-- ===========================
-- 6) SEED: ADMINS
-- ===========================
-- Inserta admins desde tu entorno privado (no subas credenciales al repo).
-- Ejemplo:
-- INSERT INTO public.admins (name, email, password, rol, activo)
-- VALUES ('Admin', 'admin@yourdomain.com', '<bcrypt_hash>', 'superadmin', TRUE);

-- ===========================
-- 7) SEED: CATEGORÍAS (CLAVE DEL FIX)
-- ===========================
WITH cat AS (
  SELECT * FROM (VALUES
    ('Nails',        'Manicure, pedicure, acrílicas, gel, nail art', 1, TRUE),
    ('Hair',         'Color, cortes, keratina, blowout, peinados',   2, TRUE),
    ('Brows & Lashes','Cejas, henna, lifting, extensiones',          3, TRUE),
    ('Facials',      'Faciales, antiacné, peeling, microdermo',      4, TRUE),
    ('Waxing',       'Depilaciones',                                 5, TRUE),
    ('Makeup',       'Maquillaje natural, glam, novia',              6, TRUE),
    ('Packages',     'Combos y paquetes',                            7, TRUE),
    ('Other',        'Otros',                                        8, TRUE)
  ) AS t(name, description, display_order, active)
)
INSERT INTO public.categories (name, description, display_order, active)
SELECT c.name, c.description, c.display_order, c.active
FROM cat c
ON CONFLICT (name) DO UPDATE
SET description = EXCLUDED.description,
    display_order = EXCLUDED.display_order,
    active = EXCLUDED.active;

-- ===========================
-- 8) SEED: SERVICIOS (YA NO USA category_id “a mano”)
-- ===========================
WITH svc AS (
  SELECT * FROM (VALUES
    ('Hair',   'Highlights Parciales', 'Mechas parciales (desde)', 150, 140.00, true,  true),
    ('Facials','Facial Profundo', 'Extracciones + alta frecuencia (si aplica)', 75, 95.00, true, true),
    ('Nails',  'Manicure Gel', 'Manicure con esmalte gel de larga duración', 60, 40.00, true, true),
    ('Waxing', 'Depilación Brazos', 'Cera', 30, 35.00, true, false),
    ('Waxing', 'Depilación Cejas', 'Cera/Pinza', 15, 15.00, true, false),
    ('Hair',   'Tinte Completo', 'Aplicación completa (desde)', 120, 110.00, true, false),
    ('Brows & Lashes','Cejas con Henna', 'Tintado con henna (duración extendida)', 45, 40.00, true, true),
    ('Facials','Facial Antiacné', 'Control de sebo + activos antiacné', 75, 105.00, true, true),
    ('Nails',  'Manicure Clásico', 'Limpieza + forma + cutícula + esmalte regular', 45, 25.00, true, true),
    ('Makeup', 'Maquillaje Novia (Prueba)', 'Prueba de maquillaje', 90, 150.00, true, false),
    ('Nails',  'Pedicure Clásico', 'Pedicure básico con esmalte regular', 60, 35.00, true, true),
    ('Packages','Paquete Glow', 'Facial hidratante + blowout', 120, 120.00, true, true),
    ('Makeup', 'Maquillaje Natural', 'Look fresco para día', 60, 85.00, true, true),
    ('Nails',  'Relleno Acrílicas', 'Mantenimiento/Fill de acrílicas', 90, 60.00, true, false),
    ('Facials','Facial Hidratante', 'Enfoque en hidratación y glow', 60, 85.00, true, false),
    ('Brows & Lashes','Extensiones Clásicas', 'Set clásico (1:1)', 120, 120.00, true, true),
    ('Facials','Microdermoabrasión', 'Exfoliación avanzada (si aplica)', 60, 120.00, true, false),
    ('Hair',   'Tratamiento Keratina', 'Alisado/Control frizz (desde)', 180, 180.00, true, true),
    ('Waxing', 'Depilación Piernas Completa', 'Cera', 45, 60.00, true, false),
    ('Nails',  'Dip Powder', 'Sistema de polvo (sin lámpara prolongada)', 75, 55.00, true, false),
    ('Nails',  'Acrílicas Full Set', 'Aplicación completa de uñas acrílicas', 120, 80.00, true, true),
    ('Brows & Lashes','Extensiones Volumen', 'Set volumen (desde)', 150, 160.00, true, true),
    ('Brows & Lashes','Retoque Extensiones', 'Mantenimiento (2-3 semanas)', 90, 80.00, true, false),
    ('Nails',  'Pedicure Spa', 'Exfoliación + mascarilla + masaje + callosidades', 75, 55.00, true, true),
    ('Hair',   'Color Raíz', 'Retoque de raíz (desde)', 90, 75.00, true, true),
    ('Hair',   'Lavado + Secado', 'Lavado + secado simple', 45, 30.00, true, false),
    ('Nails',  'Nail Art (por uña)', 'Diseño por uña (precio base)', 10, 3.00, true, false),
    ('Waxing', 'Depilación Media Pierna', 'Cera', 30, 35.00, true, false),
    ('Facials','Facial Clásico', 'Limpieza + exfoliación + mascarilla', 60, 75.00, true, true),
    ('Packages','Paquete Uñas + Cejas', 'Manicure gel + diseño de cejas', 120, 90.00, true, true),
    ('Waxing', 'Depilación Bozo', 'Cera', 10, 10.00, true, false),
    ('Brows & Lashes','Diseño de Cejas', 'Mapeo + forma según rostro', 30, 25.00, true, true),
    ('Makeup', 'Maquillaje Novia (Día evento)', 'Maquillaje para el evento', 120, 220.00, true, true),
    ('Hair',   'Peinado Evento', 'Recogido / ondas para evento (desde)', 90, 85.00, true, true),
    ('Waxing', 'Depilación Bikini', 'Cera (desde)', 20, 30.00, true, false),
    ('Packages','Paquete Evento', 'Peinado + maquillaje glam', 180, 195.00, true, true),
    ('Makeup', 'Maquillaje Glam', 'Look full glam noche', 75, 120.00, true, true),
    ('Brows & Lashes','Lifting de Pestañas', 'Elevación + curvatura natural', 60, 70.00, true, true),
    ('Waxing', 'Depilación Brasileña', 'Cera', 30, 55.00, true, true),
    ('Hair',   'Blowout / Brushing', 'Lavado + secado + estilo', 60, 45.00, true, true),
    ('Nails',  'Retiro Gel/Acrílico', 'Retiro seguro + limpieza', 30, 15.00, true, false),
    ('Nails',  'Manicure Spa', 'Exfoliación + hidratación + masaje', 60, 45.00, true, false),
    ('Packages','Paquete Spa', 'Pedicure spa + facial clásico', 150, 130.00, true, false),
    ('Waxing', 'Depilación Axilas', 'Cera', 15, 18.00, true, false),
    ('Brows & Lashes','Laminado de Cejas', 'Brow lamination + styling', 60, 65.00, true, true),
    ('Hair',   'Tratamiento Hidratación', 'Mascarilla profunda + sellado', 60, 55.00, true, true),
    ('Brows & Lashes','Tinte de Pestañas', 'Tintado para mayor definición', 30, 30.00, true, false),
    ('Facials','Peeling Suave', 'Renovación ligera (según piel)', 45, 85.00, true, false),
    ('Other',  'tes nuevo servicios', 'test', 20, 10000.00, true, false)
  ) AS t(category_name, name, description, duration_minutes, price, active, featured)
)
INSERT INTO public.services (
  category_id, name, description, duration_minutes, price, active, featured, created_at, updated_at
)
SELECT
  c.id,
  s.name,
  s.description,
  s.duration_minutes,
  s.price,
  s.active,
  s.featured,
  NOW(),
  NOW()
FROM svc s
JOIN public.categories c ON c.name = s.category_name
ON CONFLICT (category_id, name) DO UPDATE
SET description       = EXCLUDED.description,
    duration_minutes  = EXCLUDED.duration_minutes,
    price             = EXCLUDED.price,
    active            = EXCLUDED.active,
    featured          = EXCLUDED.featured,
    updated_at        = NOW();

-- ===========================
-- 9) VIEW: HORARIOS AM/PM
-- ===========================
CREATE OR REPLACE VIEW public.staff_schedules_view AS
SELECT
  ss.id,
  ss.team_member_id,
  st.name AS staff_name,
  ss.weekday,
  CASE ss.weekday
    WHEN 0 THEN 'Domingo'
    WHEN 1 THEN 'Lunes'
    WHEN 2 THEN 'Martes'
    WHEN 3 THEN 'Miércoles'
    WHEN 4 THEN 'Jueves'
    WHEN 5 THEN 'Viernes'
    WHEN 6 THEN 'Sábado'
  END AS day_name,
  TO_CHAR(ss.start_time, 'HH12:MI AM') AS start_time_label,
  TO_CHAR(ss.end_time, 'HH12:MI AM') AS end_time_label,
  TO_CHAR(ss.start_time, 'HH12:MI AM') || ' - ' || TO_CHAR(ss.end_time, 'HH12:MI AM') AS time_range,
  ss.start_time,
  ss.end_time,
  ss.is_active
FROM public.staff_schedules ss
JOIN public.staff st ON st.id = ss.team_member_id
WHERE ss.is_active = TRUE;

-- ===========================
-- 10) SEED: 5 ESTILISTAS + HORARIOS
-- ===========================
WITH staff_data AS (
  SELECT * FROM (VALUES
    ('Stylist One',   '000-000-0001', 'Color • Balayage • Treatments', TRUE, 'Senior colorist',   'stylist1@example.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', 'STAFF-01'),
    ('Stylist Two',   '000-000-0002', 'Cuts • Blowout • Styling',       TRUE, 'Styling specialist','stylist2@example.com', 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39', 'STAFF-02'),
    ('Stylist Three', '000-000-0003', 'Nails • Nail Art • Acrylic',      TRUE, 'Nail specialist',  'stylist3@example.com', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1','STAFF-03'),
    ('Stylist Four',  '000-000-0004', 'Brows • Henna • Lamination',      TRUE, 'Brow expert',      'stylist4@example.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb','STAFF-04'),
    ('Stylist Five',  '000-000-0005', 'Makeup • Glam • Bridal',          TRUE, 'Makeup artist',    'stylist5@example.com', 'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5','STAFF-05')
  ) AS t(name, phone, specialty, active, work_schedule, email, photo_url, auth_code)
)
INSERT INTO public.staff (name, phone, specialty, active, work_schedule, email, photo_url, auth_code)
SELECT sd.*
FROM staff_data sd
WHERE NOT EXISTS (SELECT 1 FROM public.staff s WHERE s.auth_code = sd.auth_code);

WITH staff_ids AS (
  SELECT id, auth_code
  FROM public.staff
  WHERE auth_code IN ('STAFF-01','STAFF-02','STAFF-03','STAFF-04','STAFF-05')
),
schedule AS (
  SELECT * FROM (VALUES
    ('STAFF-01', 2, '10:00', '17:30'),
    ('STAFF-01', 3, '10:00', '17:30'),
    ('STAFF-01', 4, '10:00', '17:30'),
    ('STAFF-01', 5, '10:00', '17:30'),
    ('STAFF-01', 6, '10:00', '17:30'),

    ('STAFF-02', 1, '09:00', '17:00'),
    ('STAFF-02', 2, '09:00', '17:00'),
    ('STAFF-02', 3, '09:00', '17:00'),
    ('STAFF-02', 4, '09:00', '17:00'),
    ('STAFF-02', 5, '09:00', '17:00'),

    ('STAFF-03', 2, '09:30', '17:30'),
    ('STAFF-03', 3, '09:30', '17:30'),
    ('STAFF-03', 4, '09:30', '17:30'),
    ('STAFF-03', 5, '09:30', '17:30'),
    ('STAFF-03', 6, '09:30', '17:30'),

    ('STAFF-04', 1, '11:00', '17:30'),
    ('STAFF-04', 3, '11:00', '17:30'),
    ('STAFF-04', 5, '11:00', '17:30'),
    ('STAFF-04', 6, '11:00', '17:30'),

    ('STAFF-05', 0, '12:00', '17:30'),
    ('STAFF-05', 5, '12:00', '17:30'),
    ('STAFF-05', 6, '12:00', '17:30')
  ) AS t(auth_code, weekday, start_time, end_time)
)
INSERT INTO public.staff_schedules (team_member_id, weekday, start_time, end_time, is_active)
SELECT
  si.id,
  sc.weekday,
  sc.start_time::time,
  sc.end_time::time,
  TRUE
FROM schedule sc
JOIN staff_ids si ON si.auth_code = sc.auth_code
WHERE NOT EXISTS (
  SELECT 1
  FROM public.staff_schedules x
  WHERE x.team_member_id = si.id
    AND x.weekday = sc.weekday
    AND x.start_time = sc.start_time::time
    AND x.end_time = sc.end_time::time
);

-- ===========================
-- 11) TRIGGER: STORAGE -> portfolio_images
-- ===========================
DROP TRIGGER IF EXISTS sync_storage_to_portfolio_images ON storage.objects;
DROP FUNCTION IF EXISTS public.sync_storage_to_portfolio_images();

CREATE OR REPLACE FUNCTION public.sync_storage_to_portfolio_images()
RETURNS TRIGGER AS $$
DECLARE
  public_path  TEXT;
  obj_category TEXT;
  file_name    TEXT;
  cap          TEXT;
  new_public_path TEXT;
  old_public_path TEXT;
  is_image BOOLEAN;
BEGIN
  PERFORM set_config('search_path', 'public, storage', true);

  is_image := COALESCE(NEW.name, OLD.name) ~* '\.(jpg|jpeg|png|webp|gif|avif|heic)$';

  IF TG_OP = 'INSERT' THEN
    IF NEW.bucket_id = 'imagenes' AND is_image THEN
      public_path := '/storage/v1/object/public/' || NEW.bucket_id || '/' || NEW.name;

      obj_category := CASE
        WHEN NEW.name LIKE '%/%' THEN split_part(NEW.name, '/', 1)
        ELSE 'sin-categoria'
      END;

      file_name := regexp_replace(NEW.name, '^.*/', '');
      cap := regexp_replace(file_name, '\.[^.]+$', '');

      INSERT INTO public.portfolio_images (url, category, caption, created_at, updated_at)
      VALUES (public_path, obj_category, cap, NOW(), NOW())
      ON CONFLICT (url) DO NOTHING;
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.bucket_id = 'imagenes' AND is_image THEN
      public_path := '/storage/v1/object/public/' || OLD.bucket_id || '/' || OLD.name;
      DELETE FROM public.portfolio_images WHERE url = public_path;
    END IF;

  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.bucket_id = 'imagenes'
       AND NEW.name IS DISTINCT FROM OLD.name
       AND is_image THEN

      new_public_path := '/storage/v1/object/public/' || NEW.bucket_id || '/' || NEW.name;
      old_public_path := '/storage/v1/object/public/' || OLD.bucket_id || '/' || OLD.name;

      obj_category := CASE
        WHEN NEW.name LIKE '%/%' THEN split_part(NEW.name, '/', 1)
        ELSE 'sin-categoria'
      END;

      file_name := regexp_replace(NEW.name, '^.*/', '');
      cap := regexp_replace(file_name, '\.[^.]+$', '');

      UPDATE public.portfolio_images
      SET url = new_public_path,
          category = obj_category,
          caption = cap,
          updated_at = NOW()
      WHERE url = old_public_path;
    END IF;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER sync_storage_to_portfolio_images
AFTER INSERT OR UPDATE OR DELETE ON storage.objects
FOR EACH ROW
EXECUTE FUNCTION public.sync_storage_to_portfolio_images();

COMMIT;
