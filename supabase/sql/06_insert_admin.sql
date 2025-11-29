-- ==========================================
-- COPPER BEAUTY SALON - DATOS INICIALES - ADMIN
-- Noviembre 2025
-- ==========================================

BEGIN;

-- ===========================
-- ADMINISTRADOR
-- ===========================

-- Password: admin123@
INSERT INTO public.admins (name, email, password, rol, activo) VALUES
('Administrador Principal', 'admin@copperbeauty.com', '$2a$12$G5vX4JECCDTMYfyPYxGKLOqvgZKtKAhSVAxsIfrArnt6w0.bB8o6.', 'superadmin', TRUE)
ON CONFLICT (email) DO NOTHING;

COMMIT;
