# 🚀 EJECUTAR AHORA: Actualizar Supabase con Nueva Columna auth_code

## ⚠️ CRÍTICO: Debes hacer esto PRIMERO antes de probar guardar estilistas

---

## 📍 Pasos Exactos en Supabase

### **Paso 1: Abrir Supabase Console**

1. Ir a: https://supabase.com/dashboard
2. Seleccionar tu proyecto "CopperBeauty"
3. Click en "SQL Editor" (lado izquierdo)

---

### **Paso 2: Ejecutar Script de Actualización**

**Opción A: Si ya existe `staff` sin `auth_code` (RECOMENDADO)**

```sql
-- 1. Primero, verificar que la columna no existe:
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'staff' AND column_name = 'auth_code';

-- 2. Si la consulta anterior retorna vacío, ejecutar esto:
ALTER TABLE public.staff 
ADD COLUMN auth_code TEXT UNIQUE NOT NULL 
DEFAULT ('ST-' || DATE_PART('epoch', NOW())::text || '-' || FLOOR(RANDOM() * 1000000)::text);

-- 3. Verificar que se agregó:
SELECT id, name, auth_code FROM public.staff LIMIT 5;
```

**Opción B: Si ya ejecutaste 01_create_tables.sql (LIMPIA TODA TABLA)**

```sql
-- ⚠️ ADVERTENCIA: BORRARÁ TODOS LOS DATOS
-- Solo usar si NO tienes datos importantes

-- Ejecutar contenido completo de:
-- /supabase/sql/01_create_tables.sql

-- Luego ejecutar para datos de prueba:
-- /supabase/sql/10_insert_staff_schedules.sql
```

---

### **Paso 3: Verificar que Funcionó**

```sql
-- Ejecutar en SQL Editor:
SELECT 
  id, 
  name, 
  phone, 
  auth_code,
  active 
FROM public.staff 
LIMIT 10;

-- Deberías ver algo como:
-- id | name          | phone         | auth_code           | active
-- 1  | María García  | (786)555-0101 | ST-1732898765-451230 | true
-- 2  | Sofia...      | (786)555-0102 | ST-1732898766-782345 | true
```

---

### **Paso 4: Actualizar Datos de Ejemplo (Opcional)**

Si quieres códigos más legibles, ejecuta:

```sql
-- Actualizar con códigos legibles:
UPDATE public.staff 
SET auth_code = CASE 
  WHEN name = 'María García' THEN 'ST-LNQY6H-ABCDE1'
  WHEN name = 'Sofia Rodríguez' THEN 'ST-LNQY6H-FGHIJ2'
  WHEN name = 'Ana Martínez' THEN 'ST-LNQY6H-KLMNO3'
  WHEN name = 'Isabella López' THEN 'ST-LNQY6H-PQRST4'
  WHEN name = 'Valentina Torres' THEN 'ST-LNQY6H-UVWXY5'
  WHEN name = 'Camila Hernández' THEN 'ST-LNQY6H-ZABCD6'
  ELSE auth_code
END;
```

---

## ✅ Verificación Final

### **Test 1: Crear Estilista desde Admin Panel**

1. Abrir: http://localhost:3000/admin/estilistas
2. Click "Agregar Estilista"
3. Llenar formulario:
   - Nombre: "Test Estilista"
   - Teléfono: "(786) 555-0199"
   - Especialidades: Seleccionar al menos una
   - Estado: Activo
4. Click "Agregar Estilista"
5. Debe mostrar: ✅ "Estilista agregado exitosamente"

### **Test 2: Verificar en Supabase**

```sql
-- En SQL Editor, ejecutar:
SELECT name, auth_code FROM public.staff 
WHERE name = 'Test Estilista';

-- Deberá retornar una fila con:
-- name          | auth_code
-- Test Estilista| ST-xxxx-xxxxx
```

### **Test 3: Crear Reserva**

1. Abrir: http://localhost:3000/reservar
2. Seleccionar servicio
3. Seleccionar "Test Estilista"
4. Seleccionar fecha y hora
5. Completar datos
6. Click "Confirmar Reserva"
7. Debe mostrar éxito y código de estilista

---

## 🔄 Orden de Ejecución Correcta

Si necesitas empezar completamente limpio:

```sql
-- 1. Ejecutar esto PRIMERO:
-- Contenido completo de: /supabase/sql/01_create_tables.sql

-- 2. Luego esto:
-- Contenido completo de: /supabase/sql/02_create_indexes.sql

-- 3. Luego esto:
-- Contenido completo de: /supabase/sql/03_triggers.sql

-- 4. Luego esto:
-- Contenido completo de: /supabase/sql/04_row_level_security.sql

-- 5. Luego esto (inserts):
-- Contenido completo de: /supabase/sql/10_insert_staff_schedules.sql
```

---

## 🐛 Si algo sale mal

### **Error: "column auth_code already exists"**
- Significa que ya está agregado ✅
- No hacer nada, continuar

### **Error: "column auth_code does not exist"**
- Significa que no se ejecutó el ALTER TABLE
- Volver al Paso 2 (Opción A) y ejecutar

### **Estilistas desaparecieron**
- Significa que ejecutaste 01_create_tables.sql con DROP
- Normal, se borraron todos los datos
- Ejecutar 10_insert_staff_schedules.sql para datos de prueba

### **Error: "permission denied"**
- Verificar que tienes permiso de admin en Supabase
- Crear un token con permisos de escritura en Settings

---

## 📊 Estado Después de Ejecutar

✅ Tabla `staff` tiene columna `auth_code`
✅ Nuevo campo es UNIQUE (no duplicados)
✅ Cada estilista tiene código único auto-generado
✅ Admin panel puede crear estilistas
✅ API genera códigos automáticamente
✅ Reservas guardan referencia a estilista
✅ Sistema valida disponibilidad

---

## 🎯 Siguiente: Actualizar Variables de Entorno

Si no lo hiciste, agregar a `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://[tu-proyecto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Luego reiniciar dev server:

```bash
pkill -9 node
npm run dev
```

---

## ✨ Una Vez Todo Esté Listo

- ✅ Columna `auth_code` en Supabase ← **DEBES HACER ESTO AHORA**
- ✅ API actualizada con auto-generación ← Ya hecho
- ✅ Validación de disponibilidad ← Ya hecho
- ✅ Reservas integradas ← Ya hecho

**Listo para producción** 🚀

---

**Última actualización:** 29 Nov 2025  
**Versión:** 2.0 - Con Sistema de Autenticación
