# Cómo Ejecutar el Esquema en Supabase

## Pasos para crear las tablas en Supabase

1. **Ve a tu proyecto Supabase**
   - Abre: https://supabase.com/dashboard/project/xaafqracqyyubiaxkosc

2. **Abre el SQL Editor**
   - En el menú lateral izquierdo, haz clic en **SQL Editor**
   - O ve directamente a: https://supabase.com/dashboard/project/xaafqracqyyubiaxkosc/sql/new

3. **Copia el esquema**
   - Abre el archivo `supabase-schema.sql` de tu proyecto
   - Copia TODO el contenido del archivo

4. **Ejecuta el SQL**
   - Pega el contenido en el editor SQL de Supabase
   - Haz clic en **Run** (Ejecutar)

5. **Verifica que se crearon las tablas**
   - Ve a **Table Editor** en el menú lateral
   - Deberías ver todas estas tablas:
     - team_members
     - services
     - service_categories
     - team_member_services
     - staff_schedules
     - promotions
     - appointments
     - appointment_services
     - gallery
     - site_settings
     - site_content
     - testimonials

## Credenciales de Admin

Para entrar al panel de administración necesitas crear un usuario admin manualmente en Supabase:

1. Ve a **SQL Editor** y ejecuta este SQL:

```sql
-- Crear un usuario admin
INSERT INTO team_members (name, email, phone, role, is_active)
VALUES (
  'Administrador',
  'admin@copperbeauty.com',
  '1234567890',
  'admin',
  true
);
```

2. Luego puedes entrar con:
   - Email: admin@copperbeauty.com
   - Password: admin123@

**NOTA IMPORTANTE:** El sistema de autenticación actual usa team_members para login. Si necesitas un sistema de autenticación separado con contraseñas, necesitamos crear una tabla `admins` adicional o usar Supabase Auth.

## Verificar que todo funciona

Después de ejecutar el esquema:

1. Reinicia el servidor de desarrollo:
```bash
npm run dev
```

2. Abre el navegador en: http://localhost:3000

3. Prueba la página de servicios para ver los 100+ servicios con precios reales

4. Ve al admin en: http://localhost:3000/admin/login

## Cambios realizados en el código

- **lib/db.ts**: Ahora usa los nombres de tablas correctos de Supabase:
  - `team_members` en lugar de `Admin` o `Staff`
  - `service_categories` en lugar de `Category`
  - `services` con campos `category`, `duration_minutes`, etc.
  - `appointments` en lugar de `Booking`
  - `gallery` en lugar de `PortfolioImage`

- Todos los campos usan snake_case (como `is_active`) en lugar de camelCase

- Los IDs son BIGINT en lugar de UUID

## Problemas comunes

Si ves errores de "relation does not exist":
1. Verifica que ejecutaste el esquema SQL en Supabase
2. Verifica que estás en el proyecto correcto
3. Refresca el Table Editor para ver las tablas

Si el login no funciona:
1. Verifica que creaste el usuario admin en team_members
2. Verifica las credenciales en CONFIGURACION_SUPABASE.md
