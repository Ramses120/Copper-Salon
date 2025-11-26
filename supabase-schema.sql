-- ============================================
-- COPPER BEAUTY SALON - SUPABASE DATABASE SCHEMA
-- Complete Beauty Salon Management System
-- PostgreSQL / Supabase
-- Updated: November 2025
-- ============================================

-- Clean existing tables (WARNING: This deletes everything!)
DROP TABLE IF EXISTS "BookingService" CASCADE;
DROP TABLE IF EXISTS "PromotionService" CASCADE;
DROP TABLE IF EXISTS "Booking" CASCADE;
DROP TABLE IF EXISTS "Service" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "PortfolioImage" CASCADE;
DROP TABLE IF EXISTS "Review" CASCADE;
DROP TABLE IF EXISTS "Promotion" CASCADE;
DROP TABLE IF EXISTS "Staff" CASCADE;
DROP TABLE IF EXISTS "Admin" CASCADE;

-- ============================================
-- TABLE: Admin
-- System administrator users
-- ============================================
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "rol" TEXT NOT NULL DEFAULT 'admin',
    "permisos" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- ============================================
-- TABLE: Category
-- Service categories
-- ============================================
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- ============================================
-- TABLE: Service
-- Available salon services
-- ============================================
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT,
    "descriptionEn" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "duration" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- TABLE: Promotion
-- Special offers and promotions
-- ============================================
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT,
    "descriptionEn" TEXT,
    "discount" DECIMAL(5,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- TABLE: PromotionService
-- Many-to-many relation between promotions and services
-- ============================================
CREATE TABLE "PromotionService" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionService_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PromotionService_promotionId_serviceId_key" ON "PromotionService"("promotionId", "serviceId");

-- ============================================
-- TABLE: Staff
-- Salon staff (stylists)
-- ============================================
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "specialty" TEXT,
    "bio" TEXT,
    "photoUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "workSchedule" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- TABLE: Booking
-- Appointment bookings
-- ============================================
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "clientEmail" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "staffId" TEXT NOT NULL,
    "promotionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- TABLE: BookingService
-- Many-to-many relation between bookings and services
-- ============================================
CREATE TABLE "BookingService" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingService_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BookingService_bookingId_serviceId_key" ON "BookingService"("bookingId", "serviceId");

-- ============================================
-- TABLE: PortfolioImage
-- Portfolio gallery images
-- ============================================
CREATE TABLE "PortfolioImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioImage_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- TABLE: Review
-- Client reviews and testimonials
-- ============================================
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "rating" DECIMAL(2,1) NOT NULL,
    "comment" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- FOREIGN KEYS (Relations)
-- ============================================
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" 
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PromotionService" ADD CONSTRAINT "PromotionService_promotionId_fkey" 
    FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PromotionService" ADD CONSTRAINT "PromotionService_serviceId_fkey" 
    FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Booking" ADD CONSTRAINT "Booking_staffId_fkey" 
    FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Booking" ADD CONSTRAINT "Booking_promotionId_fkey" 
    FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "BookingService" ADD CONSTRAINT "BookingService_bookingId_fkey" 
    FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BookingService" ADD CONSTRAINT "BookingService_serviceId_fkey" 
    FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================
-- INITIAL DATA: Admin
-- ============================================
-- Password: admin123 (hashed with bcrypt)
-- Hash: $2a$10$Yj8xhBEhVXmB4pN9/xnSSuKW8vJL.xBZWHGCvY7V8WYZ0.oG7oQsK
INSERT INTO "Admin" ("id", "email", "password", "name", "rol", "permisos", "activo", "createdAt", "updatedAt") VALUES
('clm9n8x0000001kl60qkr3h2r', 'ramsesperaza23@gmail.com', '$2a$10$Yj8xhBEhVXmB4pN9/xnSSuKW8vJL.xBZWHGCvY7V8WYZ0.oG7oQsK', 'Ramses Peraza', 'superadmin', '["all"]', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clm9n8x0000001kl60qkr3h3s', 'admin@copper.com', '$2a$10$Yj8xhBEhVXmB4pN9/xnSSuKW8vJL.xBZWHGCvY7V8WYZ0.oG7oQsK', 'Admin Copper', 'admin', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================
-- INITIAL DATA: Categories
-- ============================================
INSERT INTO "Category" ("id", "name", "nameEn", "slug", "description", "order", "active", "createdAt", "updatedAt") VALUES
('cat-1', 'Cortes', 'Cuts', 'cortes', 'Cortes de cabello profesionales', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat-2', 'Color', 'Color', 'color', 'Servicios de coloración y mechas', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat-3', 'Tratamientos', 'Treatments', 'tratamientos', 'Tratamientos capilares y restauración', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================
-- INITIAL DATA: Staff
-- ============================================
INSERT INTO "Staff" ("id", "name", "email", "phone", "specialty", "bio", "photoUrl", "active", "workSchedule", "createdAt", "updatedAt") VALUES
('staff-1', 'María González', 'maria@copper.com', '+34612345678', 'Corte y Color', 'Experta en colorimetría con 10 años de experiencia', NULL, true, '{"monday":{"start":"09:00","end":"18:00","enabled":true},"tuesday":{"start":"09:00","end":"18:00","enabled":true},"wednesday":{"start":"09:00","end":"18:00","enabled":true},"thursday":{"start":"09:00","end":"18:00","enabled":true},"friday":{"start":"09:00","end":"20:00","enabled":true},"saturday":{"start":"10:00","end":"16:00","enabled":true},"sunday":{"enabled":false}}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('staff-2', 'Ana Rodríguez', 'ana@copper.com', '+34623456789', 'Peinados', 'Especialista en peinados para eventos especiales', NULL, true, '{"monday":{"start":"10:00","end":"19:00","enabled":true},"tuesday":{"start":"10:00","end":"19:00","enabled":true},"wednesday":{"start":"10:00","end":"19:00","enabled":true},"thursday":{"start":"10:00","end":"19:00","enabled":true},"friday":{"start":"10:00","end":"20:00","enabled":true},"saturday":{"start":"09:00","end":"17:00","enabled":true},"sunday":{"enabled":false}}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('staff-3', 'Sofía Martínez', 'sofia@copper.com', '+34634567890', 'Tratamientos', 'Especialista en tratamientos de restauración capilar', NULL, true, '{"monday":{"start":"09:00","end":"17:00","enabled":true},"tuesday":{"start":"09:00","end":"17:00","enabled":true},"wednesday":{"start":"09:00","end":"17:00","enabled":true},"thursday":{"start":"09:00","end":"17:00","enabled":true},"friday":{"start":"09:00","end":"18:00","enabled":true},"saturday":{"start":"10:00","end":"15:00","enabled":true},"sunday":{"enabled":false}}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================
-- INITIAL DATA: Services
-- ============================================
INSERT INTO "Service" ("id", "name", "nameEn", "description", "descriptionEn", "price", "duration", "categoryId", "active", "note", "createdAt", "updatedAt") VALUES
-- Cuts
('service-1', 'Corte de Cabello Mujer', 'Women Hair Cut', 'Corte profesional con lavado, secado y styling', 'Professional cut with wash, dry and styling', 25.00, 60, 'cat-1', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('service-2', 'Corte de Cabello Hombre', 'Men Hair Cut', 'Corte de caballero con perfilado', 'Men cut with styling', 18.00, 45, 'cat-1', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('service-3', 'Corte Infantil', 'Kids Hair Cut', 'Corte para niños hasta 12 años', 'Cut for kids up to 12 years', 15.00, 30, 'cat-1', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Color
('service-4', 'Tinte Completo', 'Full Color', 'Aplicación de color en todo el cabello', 'Full hair color application', 50.00, 120, 'cat-2', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('service-5', 'Mechas Californianas', 'Balayage', 'Iluminación natural con técnica balayage', 'Natural highlights with balayage technique', 80.00, 180, 'cat-2', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('service-6', 'Retoque de Raíz', 'Root Touch Up', 'Aplicación de color solo en raíces', 'Color application on roots only', 35.00, 90, 'cat-2', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Treatments
('service-7', 'Keratina Brasileña', 'Brazilian Keratin', 'Tratamiento de alisado y restauración', 'Smoothing and restoration treatment', 120.00, 240, 'cat-3', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('service-8', 'Botox Capilar', 'Hair Botox', 'Tratamiento reparador intensivo', 'Intensive repair treatment', 60.00, 90, 'cat-3', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('service-9', 'Hidratación Profunda', 'Deep Hydration', 'Mascarilla nutritiva con vapor', 'Nourishing mask with steam', 30.00, 60, 'cat-3', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================
-- INITIAL DATA: Promotions
-- ============================================
INSERT INTO "Promotion" ("id", "name", "nameEn", "description", "descriptionEn", "discount", "startDate", "endDate", "active", "visible", "createdAt", "updatedAt") VALUES
('promo-1', 'Bienvenida Navidad', 'Christmas Welcome', 'Descuento especial en todos los servicios', 'Special discount on all services', 20.00, '2024-12-01 00:00:00', '2025-01-15 23:59:59', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-2', 'Martes de Tratamientos', 'Treatment Tuesdays', 'Todos los tratamientos con descuento los martes', 'All treatments with discount on Tuesdays', 25.00, '2024-11-01 00:00:00', '2025-12-31 23:59:59', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================
-- INITIAL DATA: Reviews
-- ============================================
INSERT INTO "Review" ("id", "clientName", "rating", "comment", "date", "active", "createdAt", "updatedAt") VALUES
('review-1', 'Laura Pérez', 5.0, '¡Excelente servicio! María es una profesional increíble', CURRENT_TIMESTAMP, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('review-2', 'Carlos Ramírez', 4.5, 'Muy buen corte, el ambiente es acogedor', CURRENT_TIMESTAMP, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('review-3', 'Isabel Torres', 5.0, 'El mejor salón de la ciudad, totalmente recomendado', CURRENT_TIMESTAMP, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================
-- INDEXES FOR OPTIMIZATION
-- ============================================
CREATE INDEX "Booking_date_idx" ON "Booking"("date");
CREATE INDEX "Booking_staffId_idx" ON "Booking"("staffId");
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
CREATE INDEX "Service_categoryId_idx" ON "Service"("categoryId");
CREATE INDEX "Service_active_idx" ON "Service"("active");
CREATE INDEX "Staff_active_idx" ON "Staff"("active");
CREATE INDEX "Promotion_active_idx" ON "Promotion"("active");
CREATE INDEX "Promotion_dates_idx" ON "Promotion"("startDate", "endDate");
CREATE INDEX "PortfolioImage_category_idx" ON "PortfolioImage"("category");
CREATE INDEX "PortfolioImage_active_idx" ON "PortfolioImage"("active");
CREATE INDEX "Category_slug_idx" ON "Category"("slug");
CREATE INDEX "Category_active_idx" ON "Category"("active");

-- ============================================
-- USEFUL VIEWS
-- ============================================

-- View: Complete booking information
CREATE VIEW "BookingDetails" AS
SELECT 
    b."id",
    b."clientName",
    b."clientEmail",
    b."clientPhone",
    b."date",
    b."startTime",
    b."endTime",
    b."status",
    b."notes",
    st."name" as "staffName",
    st."specialty" as "staffSpecialty",
    b."createdAt"
FROM "Booking" b
JOIN "Staff" st ON b."staffId" = st."id";

-- View: Service statistics
CREATE VIEW "ServiceStats" AS
SELECT 
    s."id",
    s."name",
    c."name" as "categoryName",
    s."price",
    COUNT(bs."id") as "totalBookings",
    SUM(s."price") as "totalRevenue"
FROM "Service" s
LEFT JOIN "Category" c ON s."categoryId" = c."id"
LEFT JOIN "BookingService" bs ON s."id" = bs."serviceId"
GROUP BY s."id", s."name", c."name", s."price";

-- ============================================
-- USEFUL FUNCTIONS
-- ============================================

-- Function: Check staff availability
CREATE OR REPLACE FUNCTION check_staff_availability(
    p_staff_id TEXT,
    p_date TIMESTAMP,
    p_start_time TEXT,
    p_end_time TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_conflict INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO v_conflict
    FROM "Booking"
    WHERE "staffId" = p_staff_id
        AND "date" = p_date
        AND "status" IN ('pending', 'confirmed')
        AND (
            (p_start_time >= "startTime" AND p_start_time < "endTime")
            OR (p_end_time > "startTime" AND p_end_time <= "endTime")
            OR (p_start_time <= "startTime" AND p_end_time >= "endTime")
        );
    
    RETURN v_conflict = 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Auto-update updatedAt
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_updated_at BEFORE UPDATE ON "Admin"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_updated_at BEFORE UPDATE ON "Category"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_updated_at BEFORE UPDATE ON "Service"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON "Staff"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_updated_at BEFORE UPDATE ON "Booking"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON "PortfolioImage"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotion_updated_at BEFORE UPDATE ON "Promotion"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_updated_at BEFORE UPDATE ON "Review"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Staff" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BookingService" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PortfolioImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Promotion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PromotionService" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view active categories
CREATE POLICY "Public can view active categories" ON "Category"
    FOR SELECT USING ("active" = true);

-- Policy: Public can view active services
CREATE POLICY "Public can view active services" ON "Service"
    FOR SELECT USING ("active" = true);

-- Policy: Public can view active staff
CREATE POLICY "Public can view active staff" ON "Staff"
    FOR SELECT USING ("active" = true);

-- Policy: Public can view active portfolio
CREATE POLICY "Public can view active portfolio" ON "PortfolioImage"
    FOR SELECT USING ("active" = true);

-- Policy: Public can view active promotions
CREATE POLICY "Public can view active promotions" ON "Promotion"
    FOR SELECT USING ("active" = true AND "visible" = true);

-- Policy: Public can view active reviews
CREATE POLICY "Public can view active reviews" ON "Review"
    FOR SELECT USING ("active" = true);

-- Policy: Authenticated users can create bookings
-- (Implement with JWT and auth.uid() in production)
CREATE POLICY "Anyone can create bookings" ON "Booking"
    FOR INSERT WITH CHECK (true);

-- Policy: Users can view their own bookings by phone
-- (Implement with JWT in production for better security)

-- ============================================
-- DATABASE SUMMARY
-- ============================================
-- Tables created: 10
--   - Admin, Category, Service, Promotion, PromotionService
--   - Staff, Booking, BookingService, PortfolioImage, Review
--
-- Views created: 2
--   - BookingDetails, ServiceStats
--
-- Functions: 1
--   - check_staff_availability
--
-- Triggers: 8
--   - Auto-update updatedAt on all tables
--
-- Indexes: 12 for query optimization
--
-- RLS Policies: 7 for basic security
--
-- Initial data:
--   - 2 admins (superadmin + admin)
--   - 3 categories (Cortes, Color, Tratamientos)
--   - 3 staff members
--   - 9 services
--   - 2 promotions
--   - 3 reviews
--
-- IMPORTANT NOTES:
-- 1. Change DATABASE_URL in your .env to your Supabase connection string
-- 2. Admin password is hashed (real password: admin123@)
-- 3. Status values: pending, confirmed, cancelled, completed
-- 4. All times in 24-hour format (e.g., "09:00", "14:30")
-- 5. Prices in decimal format
-- 6. Duration in minutes
-- ============================================

-- END OF SCRIPT