# Migración Manual de Staff en Supabase

## Opción 1: Usar Supabase SQL Editor (Recomendado)

1. Ve a https://app.supabase.com/
2. Selecciona tu proyecto "CopperBeauty"
3. Ve a **SQL Editor** (o **Editor**)
4. Crea una nueva query
5. Copia y pega el siguiente SQL:

```sql
-- Paso 1: Agregar columna 'specialties' si no existe
ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS specialties TEXT DEFAULT '[]';

-- Paso 2: Migrar datos de 'specialty' a 'specialties' 
UPDATE staff
SET specialties = CASE 
  WHEN specialty IS NOT NULL AND specialty != '' 
  THEN jsonb_build_array(specialty)::text
  ELSE '[]'
END
WHERE specialties = '[]';

-- Paso 3: Verificar que los datos se migraron
SELECT id, name, specialty, specialties FROM staff LIMIT 10;
```

6. Haz clic en **Run** (o Control+Enter)
7. Verifica que los datos se hayan actualizado correctamente

---

## Opción 2: Ejecutar SQL desde Terminal (si tienes psql)

```bash
# Reemplaza YOUR_PASSWORD con tu contraseña de postgres
# Obtén la URL en Supabase → Settings → Database → Connection String

PGPASSWORD=YOUR_PASSWORD psql -h db.xagvzoomrwfywamkfdft.supabase.co -U postgres -d postgres << EOF

ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS specialties TEXT DEFAULT '[]';

UPDATE staff
SET specialties = CASE 
  WHEN specialty IS NOT NULL AND specialty != '' 
  THEN jsonb_build_array(specialty)::text
  ELSE '[]'
END
WHERE specialties = '[]';

SELECT id, name, specialty, specialties FROM staff LIMIT 10;

EOF
```

---

## Opción 3: Usar Script Node.js

```bash
cd "/Volumes/WORK/Work/Trabajos de Web Sites/Copper.v2"
NEXT_PUBLIC_SUPABASE_URL="https://xagvzoomrwfywamkfdft.supabase.co" \
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZ3Z6b29tcndmeXdhbWtmZGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNjQ2MjYsImV4cCI6MjA3OTk0MDYyNn0.KfjhpuXp2JY7nEja7LvLbAFDndsB7RaHPauHBiot6e0" \
node scripts/migrate-staff.mjs
```

---

## ✅ Después de la Migración

1. Verifica que `specialties` tenga datos JSON
2. Reinicia el servidor: `npm run dev`
3. Prueba crear un estilista en Admin
4. Verifica que los datos se guardan correctamente
