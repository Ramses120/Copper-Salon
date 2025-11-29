-- ==========================================
-- COPPER BEAUTY SALON - STORAGE BUCKETS
-- Noviembre 2025
-- ==========================================

BEGIN;

-- ===========================
-- CREAR BUCKETS PARA ALMACENAMIENTO
-- ===========================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('images', 'images', TRUE),
  ('portfolio', 'portfolio', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ===========================
-- POLÍTICAS DE STORAGE - BUCKET 'images'
-- ===========================

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
-- POLÍTICAS DE STORAGE - BUCKET 'portfolio'
-- ===========================

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

COMMIT;
