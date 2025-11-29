-- ==========================================
-- COPPER BEAUTY SALON - TESTIMONIOS
-- Noviembre 2025
-- ==========================================

BEGIN;

-- ===========================
-- TESTIMONIOS
-- ===========================

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
