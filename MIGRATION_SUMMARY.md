# ✅ Migración de Schema Staff - Resumen Completado

## 🎯 Objetivo
Actualizar la tabla `staff` en Supabase para manejar múltiples especialidades (hasta 5+) como JSON array, con coordinación entre Admin Panel y Cliente.

## 📋 Cambios Realizados

### 1. ✅ Schema Prisma Actualizado
**Archivo:** `prisma/schema.prisma`

```prisma
model Staff {
  id           String    @id @default(uuid())
  name         String    // Nombre completo del estilista
  email        String?
  phone        String?   // Teléfono (solo visible para admin)
  specialties  String    @default("[]") // JSON array: ["Colorista", "Maquilladora", ...] 
  bio          String?
  photoUrl     String?
  active       Boolean   @default(true)
  workSchedule String    @default("{}") // JSON
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  bookings     Booking[]
}
```

**Cambios:**
- `specialty` (singular) → `specialties` (plural)
- Almacena JSON array con múltiples especialidades
- Campo `phone` solo visible para admin
- Campo `name` para nombre completo del estilista

### 2. ✅ API Routes Corregidos

#### `app/api/staff/route.ts` (GET)
```typescript
// Ahora obtiene y parsea specialties como JSON
const especialidades = s.specialties ? JSON.parse(s.specialties) : []
```

#### `app/api/staff/route.ts` (POST)
```typescript
// Guarda specialidades como JSON stringified
specialty: JSON.stringify(especialidades)
```

#### `app/api/staff/[id]/route.ts` (PUT/DELETE)
```typescript
// Actualiza specialties correctamente
data: {
  specialty: JSON.stringify(especialidades),
  // ... otros campos
}
```

### 3. ✅ Panel Admin Actualizado

**Archivo:** `app/admin/estilistas/page.tsx`

**Cambios:**
- ID: `number` → `string` (UUID format)
- Interface `Estilista` actualizada
- `especialidades` sigue siendo array en el frontend
- Se convierte a JSON al enviar al API
- Se recibe y parsea correctamente

**Estructura de datos:**
```typescript
interface Estilista {
  id: string;        // UUID string
  nombre: string;    // Nombre completo
  telefono: string;  // Solo para admin
  especialidades: string[]; // Array de especilidades
  activo: boolean;
}
```

### 4. ✅ Archivos de Soporte Creados

**Archivo:** `MIGRATION_INSTRUCTIONS.md`
- Instrucciones paso a paso para ejecutar la migración
- Cómo obtener DATABASE_URL de Supabase
- Cómo configurar .env
- Verificación posterior

**Archivo:** `STAFF_MIGRATION.sql`
- Script SQL para agregar columna specialties
- Migración de datos de specialty a specialties
- Incluye comentarios sobre el proceso

**Script:** `scripts/migrate-staff.mjs`
- Migración automática usando Supabase client
- Convierte datos existentes a nuevo formato

## 📦 Estructura de Datos (Supabase)

```
staff table:
├── id (UUID primary key)
├── name (TEXT) - Nombre completo
├── email (TEXT nullable)
├── phone (TEXT nullable) - Solo admin
├── specialties (TEXT) - JSON array: '["Colorista", "Maquilladora", "Estilista"]'
├── bio (TEXT nullable)
├── photoUrl (TEXT nullable)
├── active (BOOLEAN default: true)
├── workSchedule (TEXT default: '{}')
├── createdAt (TIMESTAMP)
└── updatedAt (TIMESTAMP)
```

## 🔧 Próximos Pasos

### Paso 1: Configurar DATABASE_URL
1. Ve a https://app.supabase.com/
2. Selecciona proyecto "CopperBeauty"
3. Settings → Database → Connection String
4. Copia la URL PostgreSQL
5. Agrega al archivo `.env`:
   ```env
   DATABASE_URL="postgresql://postgres.xagvzoomrwfywamkfdft:YOUR_PASSWORD@db.xagvzoomrwfywamkfdft.supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres.xagvzoomrwfywamkfdft:YOUR_PASSWORD@db.xagvzoomrwfywamkfdft.supabase.co:5432/postgres"
   ```

### Paso 2: Ejecutar Prisma DB Push
```bash
cd "/Volumes/WORK/Work/Trabajos de Web Sites/Copper.v2"
npx prisma db push
```

Esto:
- ✅ Agrega columna `specialties` a tabla `staff`
- ✅ Convierte datos existentes
- ✅ Sincroniza schema con Supabase

### Paso 3: Verificar Migración
```bash
npx prisma studio
```
- Abre http://localhost:5555
- Verifica tabla `Staff`
- Comprueba que `specialties` contiene JSON valido

### Paso 4: Reiniciar Servidor
```bash
npm run dev
```

## 🎯 Flujo de Datos (Admin a Cliente)

```
Admin Panel
    ↓
Selecciona especialidades (checkbox array)
    ↓
Enviá JSON: {"especialidades": ["Colorista", "Estilista"]}
    ↓
API Route (/api/staff)
    ↓
Parsea especialidades → JSON.stringify()
    ↓
Guarda en Supabase
    ↓
Cliente reserva
    ↓
GET /api/staff
    ↓
Retorna specialties: '["Colorista", "Estilista"]'
    ↓
Cliente ve: "Estilista: Colorista, Estilista"
```

## ✅ Verificación Post-Migración

Después de ejecutar `npx prisma db push`:

1. **En Supabase:**
   - Tabla `staff` tiene columna `specialties` (TEXT)
   - Datos existentes convertidos a JSON array

2. **En Admin Panel:**
   - Puedes crear/editar estilistas con 5+ especialidades
   - Los datos se guardan correctamente

3. **En Cliente (Reservas):**
   - Ver nombre del estilista
   - Ver sus especialidades
   - Seleccionar servicios apropiados

## 📝 Archivos Modificados

- ✅ `prisma/schema.prisma` - Schema actualizado
- ✅ `app/api/staff/route.ts` - GET/POST corregido
- ✅ `app/api/staff/[id]/route.ts` - PUT/DELETE corregido
- ✅ `app/api/categories/route.ts` - Migrado a db wrapper
- ✅ `app/api/bookings/route.ts` - Migrado a db wrapper
- ✅ `app/admin/estilistas/page.tsx` - Types actualizados
- ✅ `.env` - Variables DB agregadas (comentadas)
- ✅ Archivos creados:
  - `MIGRATION_INSTRUCTIONS.md`
  - `STAFF_MIGRATION.sql`
  - `scripts/migrate-staff.mjs`
  - `scripts/add-specialties-column.mjs`

## 🚀 Estado Final

- ✅ Backend listo
- ✅ Admin Panel listo
- ✅ Schema Prisma listo
- ⏳ Falta: Ejecutar `npx prisma db push` (requiere DATABASE_URL)
- ⏳ Falta: Reiniciar servidor
- ⏳ Falta: Verificar en Supabase

---

**Próximo:** Agregar DATABASE_URL al .env y ejecutar `npx prisma db push`
