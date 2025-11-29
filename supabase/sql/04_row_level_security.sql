-- ==========================================
-- COPPER BEAUTY SALON - ROW LEVEL SECURITY
-- Noviembre 2025
-- ==========================================

BEGIN;

-- ===========================
-- HABILITAR ROW LEVEL SECURITY
-- ===========================

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ===========================
-- ELIMINAR POLÍTICAS EXISTENTES
-- ===========================

DROP POLICY IF EXISTS "Admins can manage themselves" ON public.admins;
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Admin can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
DROP POLICY IF EXISTS "Admin can manage services" ON public.services;
DROP POLICY IF EXISTS "Anyone can view active staff" ON public.staff;
DROP POLICY IF EXISTS "Admin can manage staff" ON public.staff;
DROP POLICY IF EXISTS "Anyone can view staff schedules" ON public.staff_schedules;
DROP POLICY IF EXISTS "Admin can manage staff schedules" ON public.staff_schedules;
DROP POLICY IF EXISTS "Anyone can view customers" ON public.customers;
DROP POLICY IF EXISTS "Admin can manage customers" ON public.customers;
DROP POLICY IF EXISTS "Anyone can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin can manage bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can view booking services" ON public.booking_services;
DROP POLICY IF EXISTS "Anyone can view portfolio" ON public.portfolio_images;
DROP POLICY IF EXISTS "Admin can manage portfolio" ON public.portfolio_images;

-- ===========================
-- CREAR NUEVAS POLÍTICAS RLS
-- ===========================

-- ADMINS
CREATE POLICY "Admins can manage themselves" ON public.admins FOR ALL USING (TRUE);

-- CATEGORÍAS
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (active = TRUE);
CREATE POLICY "Admin can manage categories" ON public.categories FOR ALL USING (TRUE);

-- SERVICIOS
CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (active = TRUE);
CREATE POLICY "Admin can manage services" ON public.services FOR ALL USING (TRUE);

-- STAFF
CREATE POLICY "Anyone can view active staff" ON public.staff FOR SELECT USING (active = TRUE);
CREATE POLICY "Admin can manage staff" ON public.staff FOR ALL USING (TRUE);

-- STAFF SCHEDULES
CREATE POLICY "Anyone can view staff schedules" ON public.staff_schedules FOR SELECT USING (TRUE);
CREATE POLICY "Admin can manage staff schedules" ON public.staff_schedules FOR ALL USING (TRUE);

-- CLIENTES
CREATE POLICY "Anyone can view customers" ON public.customers FOR SELECT USING (TRUE);
CREATE POLICY "Admin can manage customers" ON public.customers FOR ALL USING (TRUE);

-- RESERVAS
CREATE POLICY "Anyone can view bookings" ON public.bookings FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin can manage bookings" ON public.bookings FOR ALL USING (TRUE);

-- SERVICIOS POR RESERVA
CREATE POLICY "Anyone can view booking services" ON public.booking_services FOR SELECT USING (TRUE);

-- PORTAFOLIO
CREATE POLICY "Anyone can view portfolio" ON public.portfolio_images FOR SELECT USING (TRUE);
CREATE POLICY "Admin can manage portfolio" ON public.portfolio_images FOR ALL USING (TRUE);

COMMIT;
