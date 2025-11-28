-- ==========================================
-- COPPER BEAUTY SALON - SETUP COMPLETO
-- Crea todas las tablas + Inserta servicios y precios
-- Noviembre 2025
-- ==========================================

BEGIN;

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

-- EQUIPO
CREATE TABLE IF NOT EXISTS public.team_members (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         TEXT NOT NULL,
  role         TEXT,
  image        TEXT,
  bio          TEXT,
  phone        TEXT,
  email        TEXT,
  specialty    TEXT,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICIOS
CREATE TABLE IF NOT EXISTS public.services (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category         TEXT NOT NULL,
  name             TEXT NOT NULL,
  description      TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price            NUMERIC(10,2),
  active           BOOLEAN DEFAULT TRUE,
  featured         BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORÍAS
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
  team_member_id  BIGINT NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  service_id      BIGINT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (team_member_id, service_id)
);

-- HORARIOS
CREATE TABLE IF NOT EXISTS public.staff_schedules (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  team_member_id  BIGINT NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
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

-- CITAS
CREATE TABLE IF NOT EXISTS public.appointments (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_name   TEXT,
  phone         TEXT,
  email         TEXT,
  persons       INTEGER NOT NULL DEFAULT 1,
  stylist_id    BIGINT REFERENCES public.team_members(id),
  promotion_id  BIGINT REFERENCES public.promotions(id),
  date          DATE,
  start_time    TIME,
  end_time      TIME,
  status        TEXT NOT NULL DEFAULT 'pending',
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICIOS DE CITA
CREATE TABLE IF NOT EXISTS public.appointment_services (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  appointment_id  BIGINT NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  service_id      BIGINT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- GALERÍA
CREATE TABLE IF NOT EXISTS public.gallery (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       TEXT,
  image_url   TEXT NOT NULL,
  visible     BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- CONFIGURACIÓN DEL SITIO
CREATE TABLE IF NOT EXISTS public.site_settings (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,
  value       JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
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

-- ===========================
-- 2. ÍNDICES
-- ===========================

CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins (email);
CREATE INDEX IF NOT EXISTS idx_admins_activo ON public.admins (activo);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON public.team_members (is_active);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services (category);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services (active);
CREATE INDEX IF NOT EXISTS idx_service_categories_active ON public.service_categories (active, display_order);
CREATE INDEX IF NOT EXISTS idx_appointments_date_stylist ON public.appointments (date, stylist_id, start_time);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON public.promotions (is_active, show_on_site);
CREATE INDEX IF NOT EXISTS idx_testimonials_visible ON public.testimonials (visible, is_featured);

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
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Admins can manage themselves" ON public.admins;
DROP POLICY IF EXISTS "Anyone can view active team members" ON public.team_members;
DROP POLICY IF EXISTS "Admin can manage team members" ON public.team_members;
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
DROP POLICY IF EXISTS "Admin can manage services" ON public.services;
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.service_categories;
DROP POLICY IF EXISTS "Admin can manage categories" ON public.service_categories;
DROP POLICY IF EXISTS "Anyone can view visible gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admin can manage gallery" ON public.gallery;
DROP POLICY IF EXISTS "Anyone can view visible testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can view active promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admin can manage promotions" ON public.promotions;
DROP POLICY IF EXISTS "Anyone can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admin can manage appointments" ON public.appointments;

-- Políticas: Anyone can view, Admin can modify
CREATE POLICY "Admins can manage themselves" ON public.admins FOR ALL USING (TRUE);

CREATE POLICY "Anyone can view active team members" ON public.team_members FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admin can manage team members" ON public.team_members FOR ALL USING (TRUE);

CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (active = TRUE);
CREATE POLICY "Admin can manage services" ON public.services FOR ALL USING (TRUE);

CREATE POLICY "Anyone can view active categories" ON public.service_categories FOR SELECT USING (active = TRUE);
CREATE POLICY "Admin can manage categories" ON public.service_categories FOR ALL USING (TRUE);

CREATE POLICY "Anyone can view visible gallery" ON public.gallery FOR SELECT USING (visible = TRUE);
CREATE POLICY "Admin can manage gallery" ON public.gallery FOR ALL USING (TRUE);

CREATE POLICY "Anyone can view visible testimonials" ON public.testimonials FOR SELECT USING (visible = TRUE);
CREATE POLICY "Admin can manage testimonials" ON public.testimonials FOR ALL USING (TRUE);

CREATE POLICY "Anyone can view active promotions" ON public.promotions FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admin can manage promotions" ON public.promotions FOR ALL USING (TRUE);

CREATE POLICY "Anyone can view appointments" ON public.appointments FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can create appointments" ON public.appointments FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin can manage appointments" ON public.appointments FOR ALL USING (TRUE);

-- ===========================
-- 5. STORAGE BUCKET
-- ===========================

INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
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

-- ===========================
-- 6. DATOS INICIALES
-- ===========================

-- Limpiar datos existentes
TRUNCATE TABLE public.appointment_services CASCADE;
TRUNCATE TABLE public.appointments CASCADE;
TRUNCATE TABLE public.team_member_services CASCADE;
TRUNCATE TABLE public.staff_schedules CASCADE;
TRUNCATE TABLE public.services CASCADE;
TRUNCATE TABLE public.service_categories CASCADE;
TRUNCATE TABLE public.promotions CASCADE;
TRUNCATE TABLE public.gallery CASCADE;
TRUNCATE TABLE public.testimonials CASCADE;
TRUNCATE TABLE public.admins CASCADE;
DELETE FROM public.site_content;

-- ADMINISTRADOR (con contraseña hasheada)
-- Password: admin123@
INSERT INTO public.admins (name, email, password, rol, activo) VALUES
('Administrador Principal', 'admin@copperbeauty.com', '$2a$12$G5vX4JECCDTMYfyPYxGKLOqvgZKtKAhSVAxsIfrArnt6w0.bB8o6.', 'superadmin', TRUE);

-- CATEGORÍAS DE SERVICIOS
INSERT INTO public.service_categories (name, description, display_order) VALUES
('Cabello', 'Cortes, coloración y peinados profesionales', 1),
('Depilación', 'Servicios de depilación con cera para todo el cuerpo', 2),
('Cuidado Facial', 'Tratamientos faciales y cuidado de la piel', 3),
('Cejas y Pestañas', 'Servicios especializados para cejas y pestañas', 4),
('Uñas', 'Manicure, pedicure y tratamientos de uñas', 5);

-- SERVICIOS DE CABELLO
INSERT INTO public.services (category, name, description, duration_minutes, price, active, featured) VALUES
('Cabello', 'Women''s Cut', 'Corte de cabello para mujer', 45, 25.00, TRUE, TRUE),
('Cabello', 'Hairstyle', 'Peinado profesional', 60, 30.00, TRUE, FALSE),
('Cabello', 'Blowout', 'Secado y peinado con brushing', 45, 35.00, TRUE, TRUE),
('Cabello', 'Men''s Cut', 'Corte de cabello para hombre', 30, 20.00, TRUE, FALSE),
('Cabello', 'Kids Cut', 'Corte de cabello infantil', 30, 15.00, TRUE, FALSE),
('Cabello', 'Partial Highlights', 'Mechas parciales', 120, 150.00, TRUE, TRUE),
('Cabello', 'Full Highlights', 'Mechas completas', 150, 200.00, TRUE, TRUE),
('Cabello', 'Balayage', 'Técnica de coloración balayage', 180, 175.00, TRUE, TRUE);

-- SERVICIOS DE DEPILACIÓN
INSERT INTO public.services (category, name, description, duration_minutes, price, active, featured) VALUES
('Depilación', 'Hands Wax', 'Depilación de manos', 15, 15.00, TRUE, FALSE),
('Depilación', 'Arms Wax (Full)', 'Depilación de brazos completos', 30, 40.00, TRUE, FALSE),
('Depilación', 'Arms Wax (Half)', 'Depilación de medio brazo', 20, 25.00, TRUE, FALSE),
('Depilación', 'Back Wax (Full)', 'Depilación de espalda completa', 45, 60.00, TRUE, FALSE),
('Depilación', 'Back Wax (Upper)', 'Depilación de espalda superior', 20, 20.00, TRUE, FALSE),
('Depilación', 'Back Wax (Mid Section)', 'Depilación de espalda media', 20, 20.00, TRUE, FALSE),
('Depilación', 'Back Wax (Lower)', 'Depilación de espalda baja', 20, 20.00, TRUE, FALSE),
('Depilación', 'Beard Wax', 'Depilación de barba', 20, 25.00, TRUE, FALSE),
('Depilación', 'Beard Facial', 'Facial con depilación de barba', 45, 45.00, TRUE, FALSE),
('Depilación', 'Brow Wax', 'Depilación de cejas', 15, 15.00, TRUE, TRUE),
('Depilación', 'Bikini Line', 'Depilación línea de bikini', 20, 25.00, TRUE, FALSE),
('Depilación', 'Bikini Full', 'Depilación bikini completo', 30, 45.00, TRUE, FALSE),
('Depilación', 'Brazilian Bikini Wax', 'Depilación brasileña mujer', 45, 50.00, TRUE, TRUE),
('Depilación', 'Brazilian Bikini Mens Wax', 'Depilación brasileña hombre', 50, 75.00, TRUE, FALSE),
('Depilación', 'Chest Wax', 'Depilación de pecho', 30, 25.00, TRUE, FALSE),
('Depilación', 'Chin Wax', 'Depilación de mentón', 10, 10.00, TRUE, FALSE),
('Depilación', 'Ears Wax', 'Depilación de orejas', 10, 12.00, TRUE, FALSE),
('Depilación', 'Full Face Wax', 'Depilación facial completa', 30, 35.00, TRUE, TRUE),
('Depilación', 'Full Body Wax', 'Depilación corporal completa', 180, 370.00, TRUE, TRUE),
('Depilación', 'Full Butt Wax', 'Depilación de glúteos', 20, 20.00, TRUE, FALSE),
('Depilación', 'Forehead Wax', 'Depilación de frente', 10, 8.00, TRUE, FALSE),
('Depilación', 'Lip Wax', 'Depilación de labio superior', 10, 10.00, TRUE, FALSE),
('Depilación', 'Legs Wax (Upper)', 'Depilación de piernas superiores', 30, 35.00, TRUE, FALSE),
('Depilación', 'Legs Wax (Lower)', 'Depilación de piernas inferiores', 30, 35.00, TRUE, FALSE),
('Depilación', 'Legs Wax (Full)', 'Depilación de piernas completas', 50, 60.00, TRUE, TRUE),
('Depilación', 'Neck Wax', 'Depilación de cuello', 10, 12.00, TRUE, FALSE),
('Depilación', 'Nose Wax', 'Depilación de nariz', 10, 12.00, TRUE, FALSE),
('Depilación', 'Sideburns Wax', 'Depilación de patillas', 10, 10.00, TRUE, FALSE),
('Depilación', 'Shoulders Wax', 'Depilación de hombros', 20, 20.00, TRUE, FALSE),
('Depilación', 'Stomach Wax (Full)', 'Depilación de abdomen completo', 25, 25.00, TRUE, FALSE),
('Depilación', 'Stomach Strip', 'Depilación línea del abdomen', 10, 5.00, TRUE, FALSE),
('Depilación', 'Underarm Wax', 'Depilación de axilas', 15, 20.00, TRUE, FALSE),
('Depilación', 'Men Underarm Wax', 'Depilación de axilas hombre', 15, 20.00, TRUE, FALSE);

-- SERVICIOS DE CUIDADO FACIAL
INSERT INTO public.services (category, name, description, duration_minutes, price, active, featured) VALUES
('Cuidado Facial', 'Basic Facial', 'Facial básico', 60, 75.00, TRUE, TRUE),
('Cuidado Facial', 'Facial & Hydrojelly Mask', 'Facial con mascarilla hydrojelly', 75, 85.00, TRUE, TRUE),
('Cuidado Facial', 'Facial & Peeling', 'Facial con peeling', 75, 95.00, TRUE, TRUE),
('Cuidado Facial', 'Hydrofacial', 'Tratamiento hydrofacial', 90, 100.00, TRUE, TRUE);

-- SERVICIOS DE CEJAS Y PESTAÑAS
INSERT INTO public.services (category, name, description, duration_minutes, price, active, featured) VALUES
('Cejas y Pestañas', 'Lash Lifting', 'Elevación de pestañas', 60, 40.00, TRUE, TRUE),
('Cejas y Pestañas', 'Lash Extension (Classic)', 'Extensiones de pestañas clásicas', 120, 100.00, TRUE, TRUE),
('Cejas y Pestañas', 'Lash Extension Refill (3 weeks)', 'Relleno de extensiones de pestañas', 60, 50.00, TRUE, FALSE),
('Cejas y Pestañas', 'Eyelash Removal', 'Remoción de extensiones de pestañas', 30, 20.00, TRUE, FALSE),
('Cejas y Pestañas', 'Brows Henna', 'Henna para cejas', 45, 40.00, TRUE, TRUE),
('Cejas y Pestañas', 'Brows Lamination + Tint', 'Laminado y tinte de cejas', 60, 40.00, TRUE, TRUE);

-- SERVICIOS DE UÑAS
INSERT INTO public.services (category, name, description, duration_minutes, price, active, featured) VALUES
('Uñas', 'Regular Pedicure', 'Pedicure regular', 45, 25.00, TRUE, TRUE),
('Uñas', 'Regular Manicure', 'Manicure regular', 30, 20.00, TRUE, TRUE),
('Uñas', 'Set Regular Mani + Pedi', 'Set manicure y pedicure regular', 60, 30.00, TRUE, TRUE),
('Uñas', 'Gel Manicure', 'Manicure en gel', 45, 35.00, TRUE, TRUE),
('Uñas', 'Gel Pedicure', 'Pedicure en gel', 45, 30.00, TRUE, FALSE),
('Uñas', 'Set Gel Mani + Gel Pedi', 'Set manicure y pedicure en gel', 75, 60.00, TRUE, TRUE),
('Uñas', 'Set Gel Mani + Regular Pedi', 'Set gel manicure y pedicure regular', 60, 40.00, TRUE, FALSE),
('Uñas', 'Acrylic New Set', 'Set nuevo de uñas acrílicas', 90, 70.00, TRUE, TRUE),
('Uñas', 'Acrylic Refill', 'Relleno de uñas acrílicas', 60, 60.00, TRUE, FALSE),
('Uñas', 'Rubber Base Mani', 'Manicure con base rubber', 45, 35.00, TRUE, FALSE),
('Uñas', 'Rubber Base Mani + Regular Pedi', 'Set rubber base mani y pedicure regular', 60, 45.00, TRUE, FALSE),
('Uñas', 'Builder Gel Mani', 'Manicure con builder gel', 60, 45.00, TRUE, TRUE),
('Uñas', 'Set Builder Gel Mani + Regular Pedi', 'Set builder gel mani y pedicure regular', 75, 55.00, TRUE, FALSE),
('Uñas', 'Luminary Mani', 'Manicure luminary', 60, 60.00, TRUE, TRUE),
('Uñas', 'Luminary Mani + Regular Pedi', 'Set luminary mani y pedicure regular', 90, 70.00, TRUE, FALSE),
('Uñas', 'Dip Manicure', 'Manicure dip powder', 60, 55.00, TRUE, TRUE),
('Uñas', 'Set Dip Mani + Regular Pedi', 'Set dip mani y pedicure regular', 90, 65.00, TRUE, FALSE),
('Uñas', 'Apres Manicure', 'Manicure apres', 75, 60.00, TRUE, TRUE),
('Uñas', 'Set Apres Mani + Regular Pedi', 'Set apres mani y pedicure regular', 100, 75.00, TRUE, FALSE),
('Uñas', 'Poligel Full Set', 'Set completo de poligel', 90, 60.00, TRUE, TRUE),
('Uñas', 'Poligel Refill', 'Relleno de poligel', 60, 50.00, TRUE, FALSE),
('Uñas', 'Mini Diva Regular Mani + Pedi', 'Set mani-pedi regular para niñas', 45, 25.00, TRUE, FALSE),
('Uñas', 'Mini Diva Gel Mani + Pedi', 'Set mani-pedi gel para niñas', 60, 35.00, TRUE, FALSE),
('Uñas', 'Man Regular Manicure', 'Manicure regular para hombre', 30, 20.00, TRUE, FALSE),
('Uñas', 'Man Regular Pedicure', 'Pedicure regular para hombre', 45, 30.00, TRUE, FALSE),
('Uñas', 'Man Set Mani + Pedi', 'Set mani-pedi regular para hombre', 60, 35.00, TRUE, FALSE),
('Uñas', 'Man Gel Manicure', 'Manicure gel para hombre', 45, 30.00, TRUE, FALSE),
('Uñas', 'Man Gel Pedicure', 'Pedicure gel para hombre', 45, 30.00, TRUE, FALSE),
('Uñas', 'Man Set Gel Mani + Regular Pedi', 'Set gel mani y pedicure regular hombre', 75, 40.00, TRUE, FALSE),
('Uñas', 'Additional Service', 'Servicio adicional', 15, 10.00, TRUE, FALSE),
('Uñas', 'Nail Take Off', 'Remover uñas', 20, 0.00, TRUE, FALSE),
('Uñas', 'Nail Art', 'Arte en uñas (por diseño)', 15, 5.00, TRUE, FALSE),
('Uñas', 'Nail Polish', 'Esmalte de uñas', 15, 15.00, TRUE, FALSE),
('Uñas', 'Full Set Nail Tips', 'Set completo de tips', 30, 16.00, TRUE, FALSE);

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

-- TESTIMONIOS DE CLIENTES
INSERT INTO public.testimonials (client_name, rating, comment, service, is_featured, visible) VALUES
('María González', 5, 'Increíble experiencia! El corte y color quedaron perfectos. El equipo es súper profesional y el ambiente es muy acogedor.', 'Cabello', TRUE, TRUE),
('Sofia Martínez', 5, 'Las extensiones de pestañas son lo mejor! Duran muchísimo y se ven súper naturales. Totalmente recomendado.', 'Cejas y Pestañas', TRUE, TRUE),
('Ana Rodríguez', 5, 'El manicure gel es impecable, me encanta que dure tanto tiempo sin despegarse. Las chicas son muy atentas y detallistas.', 'Uñas', TRUE, TRUE),
('Isabella Torres', 5, 'El facial hydrofacial dejó mi piel radiante! Se nota la diferencia desde la primera sesión. Volveré sin duda.', 'Cuidado Facial', TRUE, TRUE),
('Valentina López', 4, 'Excelente servicio de depilación brasileña. Es rápido, casi sin dolor y el resultado dura semanas. Muy profesional.', 'Depilación', FALSE, TRUE),
('Camila Hernández', 5, 'Llevo años viniendo y siempre salgo feliz. El balayage que me hicieron es justo lo que quería. Las recomiendo 100%.', 'Cabello', FALSE, TRUE),
('Lucía Ramírez', 5, 'El pedicure es súper relajante y mis pies quedaron hermosos. El lugar es limpio y muy bonito. Lo amo!', 'Uñas', FALSE, TRUE),
('Daniela Castro', 5, 'Las cejas con henna quedaron perfectas! Me encantan porque se ven naturales y duran mucho tiempo.', 'Cejas y Pestañas', FALSE, TRUE);

COMMIT;

-- ===========================
-- RESUMEN FINAL
-- ===========================

SELECT 
    '✅ SETUP COMPLETO' as status,
    (SELECT COUNT(*) FROM public.services) as total_servicios,
    (SELECT COUNT(*) FROM public.service_categories) as total_categorias,
    (SELECT COUNT(*) FROM public.testimonials) as total_testimonios;

SELECT 
    category,
    COUNT(*) as servicios,
    MIN(price) as precio_min,
    MAX(price) as precio_max
FROM public.services
GROUP BY category
ORDER BY category;
