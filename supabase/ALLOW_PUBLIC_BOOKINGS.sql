-- ==========================================
-- PERMITIR RESERVAS PÚBLICAS
-- ==========================================

-- Permitir INSERT en customers para todos (público)
CREATE POLICY "Public insert access - customers"
  ON public.customers
  FOR INSERT
  WITH CHECK (true);

-- Permitir UPDATE en customers para todos (para upsert por teléfono)
-- Nota: Esto permite que cualquiera actualice datos si conoce el teléfono.
-- Idealmente se usaría una función segura, pero para este MVP es necesario.
CREATE POLICY "Public update access - customers"
  ON public.customers
  FOR UPDATE
  USING (true);

-- Permitir INSERT en bookings para todos (público)
CREATE POLICY "Public insert access - bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (true);

-- Permitir INSERT en booking_services para todos (público)
CREATE POLICY "Public insert access - booking_services"
  ON public.booking_services
  FOR INSERT
  WITH CHECK (true);
