-- ==========================================
-- COPPER BEAUTY SALON - DATOS INICIALES (SEEDS)
-- Solo administradores
-- Diciembre 2025
-- ==========================================

BEGIN;

-- Password en texto para ambos:
--   admin123copper2025@
-- Hash bcrypt (ejemplo cost=12):
--   $2b$12$0SjUDNRWoSZQ/rA855WhUugQl7rnxjPwQBVgYlwm.SnbG0NkrGJgu

INSERT INTO public.admins (name, email, password, rol, activo)
VALUES
  ('Ramses Peraza', 'ramsesperaza23@gmail.com',
   '$2b$12$0SjUDNRWoSZQ/rA855WhUugQl7rnxjPwQBVgYlwm.SnbG0NkrGJgu',
   'superadmin', TRUE),
  ('Copper Admin', 'coperadmin@gmail.com',
   '$2b$12$0SjUDNRWoSZQ/rA855WhUugQl7rnxjPwQBVgYlwm.SnbG0NkrGJgu',
   'superadmin', TRUE)
ON CONFLICT (email) DO UPDATE
SET
  password = EXCLUDED.password,
  rol      = EXCLUDED.rol,
  activo   = EXCLUDED.activo;

COMMIT;
