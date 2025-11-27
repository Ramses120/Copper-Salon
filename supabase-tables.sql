-- Copper Beauty Salon - Tablas Supabase
-- Ejecuta este SQL en tu proyecto de Supabase (SQL Editor)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin table
CREATE TABLE IF NOT EXISTS "Admin" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  rol VARCHAR(50) DEFAULT 'admin',
  permisos TEXT,
  activo BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Category table
CREATE TABLE IF NOT EXISTS "Category" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  "nameEn" VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Service table
CREATE TABLE IF NOT EXISTS "Service" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  "nameEn" VARCHAR(255),
  description TEXT,
  "descriptionEn" TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL,
  "categoryId" UUID NOT NULL REFERENCES "Category"(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  note TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Promotion table
CREATE TABLE IF NOT EXISTS "Promotion" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  "nameEn" VARCHAR(255),
  description TEXT,
  "descriptionEn" TEXT,
  discount DECIMAL(5,2) NOT NULL,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  active BOOLEAN DEFAULT true,
  visible BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- PromotionService table (many-to-many)
CREATE TABLE IF NOT EXISTS "PromotionService" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "promotionId" UUID NOT NULL REFERENCES "Promotion"(id) ON DELETE CASCADE,
  "serviceId" UUID NOT NULL REFERENCES "Service"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("promotionId", "serviceId")
);

-- Staff table
CREATE TABLE IF NOT EXISTS "Staff" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  specialty VARCHAR(255),
  bio TEXT,
  "photoUrl" TEXT,
  active BOOLEAN DEFAULT true,
  "workSchedule" TEXT DEFAULT '{}',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Booking table
CREATE TABLE IF NOT EXISTS "Booking" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "clientName" VARCHAR(255) NOT NULL,
  "clientPhone" VARCHAR(50) NOT NULL,
  "clientEmail" VARCHAR(255),
  date DATE NOT NULL,
  "startTime" VARCHAR(10) NOT NULL,
  "endTime" VARCHAR(10) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  "staffId" UUID NOT NULL REFERENCES "Staff"(id),
  "promotionId" UUID REFERENCES "Promotion"(id),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- BookingService table (many-to-many)
CREATE TABLE IF NOT EXISTS "BookingService" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "bookingId" UUID NOT NULL REFERENCES "Booking"(id) ON DELETE CASCADE,
  "serviceId" UUID NOT NULL REFERENCES "Service"(id),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("bookingId", "serviceId")
);

-- PortfolioImage table
CREATE TABLE IF NOT EXISTS "PortfolioImage" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  category VARCHAR(255) NOT NULL,
  caption TEXT,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Review table
CREATE TABLE IF NOT EXISTS "Review" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "clientName" VARCHAR(255) NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  comment TEXT NOT NULL,
  date TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_category ON "Service"("categoryId");
CREATE INDEX IF NOT EXISTS idx_booking_staff ON "Booking"("staffId");
CREATE INDEX IF NOT EXISTS idx_booking_date ON "Booking"(date);
CREATE INDEX IF NOT EXISTS idx_booking_status ON "Booking"(status);

-- Insert default admin users
INSERT INTO "Admin" (email, password, name, rol, activo) VALUES
  ('admin@copperbeauty.com', '$2a$10$YourHashedPasswordHere1', 'Admin Principal', 'superadmin', true),
  ('manager@copperbeauty.com', '$2a$10$YourHashedPasswordHere2', 'Admin Secundario', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Insert default categories
INSERT INTO "Category" (name, "nameEn", slug, description, active) VALUES
  ('Cabello', 'Hair', 'cabello', 'Servicios de estilismo y cuidado del cabello', true),
  ('Uñas', 'Nails', 'unas', 'Manicure, pedicure y diseño de uñas', true),
  ('Cejas', 'Eyebrows', 'cejas', 'Diseño y cuidado de cejas', true),
  ('Facial', 'Facial', 'facial', 'Tratamientos faciales y cuidado de la piel', true),
  ('Maquillaje', 'Makeup', 'maquillaje', 'Maquillaje profesional para todo evento', true),
  ('Depilación', 'Waxing', 'depilacion', 'Servicios de depilación', true)
ON CONFLICT (slug) DO NOTHING;
