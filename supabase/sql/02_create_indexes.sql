-- ==========================================
-- COPPER BEAUTY SALON - CREAR ÍNDICES
-- Noviembre 2025
-- ==========================================

BEGIN;

-- ===========================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ===========================

CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins (email);
CREATE INDEX IF NOT EXISTS idx_admins_activo ON public.admins (activo);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories (active, display_order);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON public.services (category_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services (active);
CREATE INDEX IF NOT EXISTS idx_staff_active ON public.staff (active);
CREATE INDEX IF NOT EXISTS idx_staff_schedules_team ON public.staff_schedules (team_member_id);
CREATE INDEX IF NOT EXISTS idx_staff_schedules_weekday ON public.staff_schedules (weekday);
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

COMMIT;
