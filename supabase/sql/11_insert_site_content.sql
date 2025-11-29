-- ==========================================
-- COPPER BEAUTY SALON - CONTENIDO DEL SITIO
-- Noviembre 2025
-- ==========================================

BEGIN;

-- ===========================
-- CONTENIDO DEL SITIO
-- ===========================

INSERT INTO public.site_content (section, content, active) VALUES
('hero', '{
  "title": "Belleza que se",
  "titleHighlight": "siente",
  "titleEnd": "y se ve",
  "subtitle": "Hair, makeup & nails con un servicio de autor.",
  "backgroundImage": "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574&auto=format&fit=crop"
}'::jsonb, TRUE),
('about', '{
  "title": "Sobre Nosotros",
  "subtitle": "Copper Beauty Salon & Spa",
  "paragraph1": "En Copper Beauty Salon & Spa cada cita es un momento de cuidado real: te escuchamos, entendemos tu estilo y creamos un look que te haga sentir cómoda y segura desde el primer minuto.",
  "paragraph2": "Nuestra firma es la personalización. Elegimos técnicas y productos de calidad según tu cabello, piel y uñas para lograr un acabado limpio, elegante y duradero.",
  "paragraph3": "En Copper, el trato es cálido, profesional y pensado para que salgas viéndote increíble… y sintiéndote aún mejor.",
  "image": "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=2574&auto=format&fit=crop"
}'::jsonb, TRUE),
('contact', '{
  "title": "Contacto",
  "phone": "(305) 555-0123",
  "email": "info@copper.com",
  "address": "5 SW 107th Ave, Miami, FL 33174",
  "schedule": "Lun - Sáb: 9:00 AM - 5:30 PM"
}'::jsonb, TRUE)
ON CONFLICT (section) DO NOTHING;

COMMIT;
