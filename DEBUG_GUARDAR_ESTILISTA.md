# 🔧 Guía de Depuración: Error al Guardar Estilista

## ❌ Problema
"Error al guardar estilista" cuando intento crear un nuevo estilista en `/admin/estilistas`

---

## 🔍 Causas Posibles y Soluciones

### **1. Campo `auth_code` Faltante (CAUSA MÁS PROBABLE)**

**Síntoma:** Error 500 con mensaje "Error al crear estilista"

**Causa:** La tabla `staff` en Supabase no tiene la columna `auth_code`

**Solución:**

```sql
-- 1. En Supabase SQL Editor, ejecutar:
ALTER TABLE public.staff 
ADD COLUMN auth_code TEXT UNIQUE NOT NULL DEFAULT 'ST-' || NOW()::text || '-' || FLOOR(RANDOM() * 1000000)::text;

-- 2. Para estilistas ya existentes, generar códigos:
UPDATE public.staff 
SET auth_code = 'ST-' || FLOOR(RANDOM() * 1000000000)::text 
WHERE auth_code IS NULL OR auth_code LIKE 'ST-%-%-%';

-- 3. Verificar que se creó la columna:
SELECT id, name, auth_code FROM public.staff LIMIT 5;
```

**Verificación:**
- Ir a Supabase → Table Editor → `staff`
- Debe haber columna `auth_code` después de `photo_url`

---

### **2. Problema con NEXT_PUBLIC_SUPABASE_URL**

**Síntoma:** Error de conexión o "Network error"

**Causa:** Variables de entorno no configuradas

**Solución:**

```bash
# 1. Verificar archivo .env.local existe en la raíz del proyecto
cat .env.local | grep SUPABASE

# 2. Debe contener:
# NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# 3. Si falta, agregarlo:
echo "NEXT_PUBLIC_SUPABASE_URL=https://[tu-project].supabase.co" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-key]" >> .env.local

# 4. Reiniciar dev server:
pkill -9 node
npm run dev
```

**Verificación:**
- En navegador F12 → Console
- No debe haber errores de "undefined" en SUPABASE_URL

---

### **3. Error en RLS (Row Level Security)**

**Síntoma:** Error 403 "new row violates row-level security policy"

**Causa:** RLS policies bloquean inserts

**Solución:**

```sql
-- 1. En Supabase SQL Editor:
-- Deshabilitar temporalmente RLS para probar:
ALTER TABLE public.staff DISABLE ROW LEVEL SECURITY;

-- 2. Intentar guardar estilista nuevamente

-- 3. Si funciona, el problema es RLS. Habilitarlo:
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- 4. Crear policy que permita anon key:
CREATE POLICY "Allow anon insert on staff" ON public.staff
  FOR INSERT WITH CHECK (true);

-- 5. Verificar policies:
SELECT * FROM pg_policies WHERE tablename = 'staff';
```

---

### **4. Constraint UNIQUE Duplicado**

**Síntoma:** Error "duplicate key value violates unique constraint"

**Causa:** Dos estilistas con mismo `auth_code` o teléfono

**Solución:**

```sql
-- 1. Verificar auth_codes duplicados:
SELECT auth_code, COUNT(*) 
FROM public.staff 
GROUP BY auth_code 
HAVING COUNT(*) > 1;

-- 2. Si hay duplicados, generar únicos:
UPDATE public.staff 
SET auth_code = 'ST-' || FLOOR(RANDOM() * 9999999)::text
WHERE auth_code IN (
  SELECT auth_code FROM public.staff 
  GROUP BY auth_code HAVING COUNT(*) > 1
);

-- 3. Verificar teléfonos duplicados:
SELECT phone, COUNT(*) 
FROM public.staff 
GROUP BY phone 
HAVING COUNT(*) > 1;

-- 4. Si hay duplicados, eliminar o renombrar:
-- DELETE FROM public.staff WHERE id IN (SELECT id FROM ... LIMIT 1);
```

---

### **5. Versión de Schema Desactualizada**

**Síntoma:** Estilistas anteriores funcionan, nuevos fallan

**Causa:** Script SQL viejo en Supabase

**Solución:**

```bash
# 1. Verificar qué versión está en Supabase:
# En Supabase → SQL Editor, ejecutar:
-- SELECT column_name FROM information_schema.columns 
-- WHERE table_name = 'staff' ORDER BY ordinal_position;

# 2. Comparar con archivo local:
cat /Volumes/WORK/Work/Trabajos\ de\ Web\ Sites/Copper.v2/supabase/sql/01_create_tables.sql | grep -A 15 "CREATE TABLE.*staff"

# 3. Si no coinciden, ejecutar script actualizado:
# Copiar contenido de 01_create_tables.sql y ejecutar en Supabase SQL Editor
```

---

### **6. Problema con JSON stringify**

**Síntoma:** Error "Invalid JSON" o campo especialidades vacío

**Causa:** Error al serializar array de especialidades

**Solución:**

```typescript
// En /app/api/staff/route.ts, verificar:
const { data: staff, error } = await supabase
  .from("staff")
  .insert({
    name: nombre,
    specialties: JSON.stringify(especialidades), // ✓ Debe ser string
    phone: telefono,
    email: "",
    photo_url: "",
    auth_code: authCode,
    work_schedule: JSON.stringify(defaultSchedule),
  })
  .select()
  .single();

// Validar antes de insertar:
if (!especialidades || !Array.isArray(especialidades)) {
  throw new Error("Especialidades debe ser un array");
}
```

---

## 🧪 Test de Depuración Paso a Paso

### **Test 1: ¿Supabase está conectado?**

```typescript
// Crear archivo temporal: test-supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const test = async () => {
  const { data, error } = await supabase.from('staff').select('*').limit(1);
  console.log('Success:', !!data);
  console.log('Error:', error?.message);
};

test();
```

### **Test 2: ¿Auth_code se genera?**

```typescript
// En /app/api/staff/route.ts, agregar log:
console.log('Auth Code Generado:', authCode);
console.log('Nombres especialidades:', especialidades);
```

### **Test 3: ¿Inserción se ejecuta?**

```bash
# Terminal, ejecutar curl:
curl -X POST http://localhost:3000/api/staff \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Estilista",
    "especialidades": ["Colorista & Estilista"],
    "telefono": "(786) 555-0199",
    "activo": true
  }'

# Debería retornar staff object o error específico
```

---

## 📋 Checklist de Verificación

- [ ] Tabla `staff` existe en Supabase
- [ ] Columna `auth_code` existe y es UNIQUE
- [ ] Variables `.env.local` están configuradas
- [ ] Dev server reiniciado después de cambiar .env
- [ ] No hay RLS policies bloqueando inserts
- [ ] No hay auth_codes duplicados
- [ ] API `/api/staff` retorna 201 en POST exitoso
- [ ] Admin panel muestra mensaje de éxito/error

---

## 🚨 Error Específico: "details: [...]"

El API retorna error con `details`. Copiar ese error y buscar:

### **"column 'auth_code' does not exist"**
→ Ejecutar ALTER TABLE para agregar columna (Solución #1)

### **"permission denied"**
→ Verificar RLS policies (Solución #3)

### **"Unauthorized"**
→ Verificar NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local

### **"Network error"**
→ Verificar NEXT_PUBLIC_SUPABASE_URL es válida

---

## 💡 Logs Útiles para Debugging

### **Verificar logs del servidor:**

```bash
# Terminal donde corre npm run dev
# Buscar errores en rojo/amarillo cuando intentes guardar estilista

# O revisar console del navegador (F12 → Console)
# Debe mostrar request/response completo
```

### **Agregar logs temporales:**

```typescript
// En /app/api/staff/route.ts:
console.log('=== CREANDO ESTILISTA ===');
console.log('Nombre:', nombre);
console.log('Especialidades:', especialidades);
console.log('Auth Code:', authCode);

const { data: staff, error } = await supabase
  .from("staff")
  .insert({...})

if (error) {
  console.error('SUPABASE ERROR:', error);
  console.error('Error details:', JSON.stringify(error, null, 2));
}
```

---

## 📞 Si Nada Funciona

1. Verificar que ejecutaste `/supabase/sql/01_create_tables.sql` en Supabase SQL Editor
2. Verificar que el proyecto de Supabase está activo (no suspendido)
3. Verificar que tienes permiso de edición en la tabla staff
4. Crear ticket en Supabase support si persiste el error

---

**Última actualización:** 29 Nov 2025
**Estado:** ✅ Listo para producción
