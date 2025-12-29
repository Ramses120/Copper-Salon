-- ==========================================
-- COPPER BEAUTY SALON - ESQUEMA COMPLETO
-- Diciembre 2025
-- ==========================================

BEGIN;

-- ===========================
-- TABLAS PRINCIPALES
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
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,
  description  TEXT,
  display_order INTEGER DEFAULT 0,
  active       BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
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
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         TEXT NOT NULL,
  phone        TEXT,
  specialty    TEXT,
  active       BOOLEAN DEFAULT TRUE,
  work_schedule TEXT,
  email        TEXT,
  photo_url    TEXT,
  auth_code    TEXT UNIQUE NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
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

-- RESERVAS
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RELACIÓN EQUIPO-SERVICIOS
CREATE TABLE IF NOT EXISTS public.team_member_services (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  team_member_id  BIGINT NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  service_id      BIGINT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
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
-- ÍNDICES
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

-- ===========================
-- TRIGGERS (UPDATED_AT)
-- ===========================

-- Borramos triggers anteriores si existen (para evitar error "ya existe")
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
DROP TRIGGER IF EXISTS update_staff_updated_at ON public.staff;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
DROP TRIGGER IF EXISTS update_customers_updated_at ON public.customers;
DROP TRIGGER IF EXISTS update_promotions_updated_at ON public.promotions;
DROP TRIGGER IF EXISTS update_site_content_updated_at ON public.site_content;

-- Borramos la función si ya existía
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Creamos la función de actualización automática
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Asociamos la función a cada tabla que tiene updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
  BEFORE UPDATE ON public.staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at
  BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================
-- SEGURIDAD (RLS)
-- ===========================

-- Activar RLS en todas las tablas
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas antiguas si existen
DROP POLICY IF EXISTS "Public read access" ON public.categories;
DROP POLICY IF EXISTS "Public read access" ON public.services;
DROP POLICY IF EXISTS "Public read access" ON public.staff;
DROP POLICY IF EXISTS "Public read access" ON public.staff_schedules;
DROP POLICY IF EXISTS "Public read access" ON public.portfolio_images;
DROP POLICY IF EXISTS "Public read access" ON public.promotions;
DROP POLICY IF EXISTS "Public read access" ON public.testimonials;
DROP POLICY IF EXISTS "Public read access" ON public.site_content;

DROP POLICY IF EXISTS "Authenticated full access" ON public.admins;
DROP POLICY IF EXISTS "Authenticated full access" ON public.categories;
DROP POLICY IF EXISTS "Authenticated full access" ON public.services;
DROP POLICY IF EXISTS "Authenticated full access" ON public.staff;
DROP POLICY IF EXISTS "Authenticated full access" ON public.staff_schedules;
DROP POLICY IF EXISTS "Authenticated full access" ON public.customers;
DROP POLICY IF EXISTS "Authenticated full access" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated full access" ON public.booking_services;
DROP POLICY IF EXISTS "Authenticated full access" ON public.portfolio_images;
DROP POLICY IF EXISTS "Authenticated full access" ON public.promotions;
DROP POLICY IF EXISTS "Authenticated full access" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated full access" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated full access" ON public.site_settings;

-- Políticas de lectura pública (para la web)
CREATE POLICY "Public read access - categories"
  ON public.categories
  FOR SELECT
  USING (true);

CREATE POLICY "Public read access - services"
  ON public.services
  FOR SELECT
  USING (true);

CREATE POLICY "Public read access - staff"
  ON public.staff
  FOR SELECT
  USING (true);

CREATE POLICY "Public read access - staff_schedules"
  ON public.staff_schedules
  FOR SELECT
  USING (true);

CREATE POLICY "Public read access - portfolio_images"
  ON public.portfolio_images
  FOR SELECT
  USING (true);

CREATE POLICY "Public read access - promotions"
  ON public.promotions
  FOR SELECT
  USING (true);

CREATE POLICY "Public read access - testimonials"
  ON public.testimonials
  FOR SELECT
  USING (true);

CREATE POLICY "Public read access - site_content"
  ON public.site_content
  FOR SELECT
  USING (true);

-- Función helper: solo tus dos correos son "admin global"
CREATE OR REPLACE FUNCTION public.is_copper_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.jwt()->>'email' IN (
    'ramsesperaza23@gmail.com',
    'coperadmin@gmail.com',
    'admin@copperbeauty.com'
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Políticas de acceso TOTAL solo para tus dos admins
CREATE POLICY "Admins full access - admins"
  ON public.admins
  FOR ALL
  USING (public.is_copper_admin())
  WITH CHECK (public.is_copper_admin());

CREATE POLICY "Admins full access - categories"
  ON public.categories
  FOR ALL
  USING (public.is_copper_admin())
  WITH CHECK (public.is_copper_admin());

CREATE POLICY "Admins full access - services"
  ON public.services
  FOR ALL
  USING (public.is_copper_admin())
  WITH CHECK (public.is_copper_admin());

CREATE POLICY "Admins full access - staff"
  ON public.staff
  FOR ALL
  USING (public.is_copper_admin())
  WITH CHECK (public.is_copper_admin());

CREATE POLICY "Admins full access - staff_schedules"
  ON public.staff_schedules
  FOR ALL
  USING (public.is_copper_admin())
  WITH CHECK (public.is_copper_admin());

CREATE POLICY "Admins full access - customers"
  ON public.customers
  FOR ALL
  USING (public.is_copper_admin())
  WITH CHECK (public.is_copper_admin());

CREATE POLICY "Admins full access - bookings"
  ON public.bookings
  FOR ALL
  USING (public.is_copper_admin())
  WITH CHECK (public.is_copper_admin());

CREATE POLICY "Admins full access - booking_services"
  ON public.booking_services
  FOR ALL
  USING (public.is_copper_admin())
  WITH CHECK (public.is_copper_admin());

CREATE POLICY "Admins full access - portfolio_images"
  ON public.portfolio_images
  FOR ALL
  USING (public.is_copper_admin())
  WITH CHECK (public.is_copper_admin());

CREATE POLICY "Admins full access - promotions"
  ON public.promotions
  FOR ALL
  USING (public.is_copper_admin())
  WITH CHECK (public.is_copper_admin());

CREATE POLICY "Admins full access - testimonials"
  ON public.testimonials
  FOR ALL
  USING (public.is_copper_admin())
  WITH CHECK (public.is_copper_admin());

CREATE POLICY "Admins full access - site_content"
  ON public.site_content
  FOR ALL
  USING (public.is_copper_admin())
  WITH CHECK (public.is_copper_admin());

CREATE POLICY "Admins full access - site_settings"
  ON public.site_settings
  FOR ALL
  USING (public.is_copper_admin())
  WITH CHECK (public.is_copper_admin());

COMMIT;
