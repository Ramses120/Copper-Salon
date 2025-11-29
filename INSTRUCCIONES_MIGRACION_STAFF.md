# 📋 Instrucciones de Migración - Table Staff (Estilistas)

## ✅ Cambios Realizados en el Código

He actualizado completamente el esquema y la lógica para manejar correctamente las especialidades de los estilistas:

### 1. **Cambios en Prisma Schema** (`prisma/schema.prisma`)
- ✅ Cambié `specialty` (singular) a `specialties` (plural)
- ✅ Ahora almacena como JSON array: `"[]"` por defecto
- ✅ Puede contener múltiples especialidades (sin límite)

### 2. **Cambios en API Routes**
- ✅ `/app/api/staff/route.ts` - GET y POST actualizados
- ✅ `/app/api/staff/[id]/route.ts` - PUT y DELETE actualizados
- ✅ Ahora maneja correctamente arrays JSON de especialidades
- ✅ IDs son strings (UUIDs) en lugar de números

### 3. **Cambios en Panel Admin** (`/app/admin/estilistas/page.tsx`)
- ✅ Actualizado tipo de IDs de `number` a `string`
- ✅ Compatible con UUIDs de Supabase
- ✅ Interfaz Staff actualizada

### 4. **Cambios en Wrapper de Base de Datos** (`/lib/db.ts`)
- ✅ Mapeo actualizado de `specialty` a `specialties`
- ✅ Todos los CRUD operations (`findMany`, `findUnique`, `create`, `update`) actualizados

---

## 🚀 Pasos para Ejecutar la Migración en Supabase

### Paso 1: Ejecutar SQL en Supabase Console

1. Abre **Supabase Dashboard** → Tu proyecto → **SQL Editor**
2. Copia todo el contenido del archivo `STAFF_MIGRATION.sql`
3. Ejecuta las consultas SQL en orden:

```sql
-- Paso 1: Agregar columna nueva 'specialties' con valor por defecto
ALTER TABLE "Staff" 
ADD COLUMN "specialties" TEXT NOT NULL DEFAULT '[]';

-- Paso 2: Migrar datos existentes de 'specialty' a 'specialties'
UPDATE "Staff"
SET "specialties" = CASE 
  WHEN "specialty" IS NOT NULL AND "specialty" != '' 
  THEN jsonb_build_array("specialty")::text
  ELSE '[]'
END;

-- Paso 3: Verificar migración (opcional)
-- SELECT id, name, specialty, specialties FROM "Staff" LIMIT 10;

-- Paso 4: Eliminar columna antigua (opcional, después de verificar)
-- ALTER TABLE "Staff" DROP COLUMN "specialty";
```

### Paso 2: Actualizar Prisma

Después de ejecutar el SQL en Supabase, ejecuta en tu terminal:

```bash
cd "/Volumes/WORK/Work/Trabajos de Web Sites/Copper.v2"

# Opción 1: Usar db push (recomendado)
npx prisma db push

# O Opción 2: Crear una migración
npx prisma migrate dev --name update_staff_specialties
```

---

## 📊 Estructura de Datos en Supabase

### Tabla: `Staff`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único del estilista (generado automáticamente) |
| `name` | TEXT | **Nombre completo del estilista** |
| `phone` | TEXT | Teléfono (solo visible para admin) |
| `specialties` | TEXT | **JSON array de especialidades** |
| `email` | TEXT | Email (opcional) |
| `photo_url` | TEXT | URL de foto (opcional) |
| `active` | BOOLEAN | Estado activo/inactivo |
| `work_schedule` | TEXT | JSON con horario laboral |
| `notes` | TEXT | Bio/notas |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de actualización |

### Ejemplo de Datos Guardados en Supabase:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "María García López",
  "phone": "(786) 555-0123",
  "specialties": "[\"Colorista & Estilista\", \"Maquilladora Profesional\"]",
  "email": "maria@salon.com",
  "active": true,
  "work_schedule": "{...}"
}
```

---

## ✨ Características Implementadas

✅ **Nombre Completo del Estilista**
- Se almacena en el campo `name`
- Visible para clientes en la página de reservas

✅ **Teléfono Privado**
- Se almacena en el campo `phone`
- Solo visible para administrador (no se muestra a clientes)

✅ **Múltiples Especialidades**
- Almacenadas como JSON array en `specialties`
- Opciones predefinidas: 
  - Colorista & Estilista
  - Maquilladora Profesional
  - Especialista en Uñas
  - Esteticista
  - Técnico en Extensiones
  - Estilista General

✅ **Sincronización Admin-Cliente**
- Lo que el admin ingresa en el panel se guarda en Supabase
- Los clientes ven el nombre y especialidades en la página de reservas
- Los datos se mantienen sincronizados automáticamente

---

## 🔍 Verificación Post-Migración

Después de completar la migración, verifica que:

1. ✅ El servidor compile sin errores: `npm run dev`
2. ✅ Puedas crear un estilista en el panel admin: `/admin/estilistas`
3. ✅ Los datos se guarden en Supabase correctamente
4. ✅ Los estilistas aparezcan en la página de reservas: `/reservar`

---

## 🆘 Solución de Problemas

**Problema:** Error "column 'specialties' does not exist"
- **Solución:** Verifica que la SQL de migración se ejecutó correctamente en Supabase

**Problema:** Los datos antiguos no aparecen en el admin
- **Solución:** La migración SQL konvierte automáticamente de `specialty` a `specialties`

**Problema:** Error al crear nuevo estilista
- **Solución:** Asegúrate de que el servidor está corriendo: `npm run dev`

---

## 📝 Resumen de Cambios

| Archivo | Cambio |
|---------|--------|
| `prisma/schema.prisma` | `specialty` → `specialties` con JSON array |
| `app/api/staff/route.ts` | GET/POST actualizados |
| `app/api/staff/[id]/route.ts` | PUT/DELETE actualizados |
| `app/admin/estilistas/page.tsx` | IDs: number → string |
| `lib/db.ts` | Mapeo actualizado de campos |

---

**Listo para usar después de ejecutar los pasos anteriores.** ✅
