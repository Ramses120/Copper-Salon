-- ==========================================
-- COPPER BEAUTY SALON - CREAR TABLAS BASE
-- Noviembre 2025
-- ==========================================

BEGIN;

-- ===========================
-- LIMPIAR TABLAS EXISTENTES
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
DROP TABLE IF EXISTS public.staff CASCADE;

-- ===========================
-- CREAR TABLAS
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

-- CATEGORÍAS DE SERVICIOS LEGACY
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

COMMIT;
