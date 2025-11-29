# Migración de Schema Prisma - Staff Specialties

## Estado Actual
- ✅ Schema Prisma actualizado: `specialty` → `specialties` (JSON array)
- ✅ API routes corregidos para manejar `specialties`
- ✅ Panel admin actualizado para enviar `specialties`
- ❌ **Falta:** Ejecutar `prisma db push` para sincronizar con Supabase

## Pasos Requeridos

### Paso 1: Obtener DATABASE_URL de Supabase

1. Ve a https://app.supabase.com/
2. Selecciona tu proyecto "CopperBeauty"
3. Ve a **Settings** → **Database** → **Connection String**
4. Selecciona el tipo "URI" (SQL URI format)
5. Copia la URL completa que se ve similar a:
   ```
   postgresql://postgres.[PROJECT_ID]:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
   ```
6. Si ves `[YOUR-PASSWORD]`, reemplázalo con tu contraseña real de postgres

### Paso 2: Agregar variables al .env

Abre el archivo `.env` en la raíz del proyecto y agrega estas dos líneas:

```env
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@db.xagvzoomrwfywamkfdft.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@db.xagvzoomrwfywamkfdft.supabase.co:5432/postgres"
```

Donde `[PROJECT_ID]` y `[PASSWORD]` son tus valores reales.

### Paso 3: Ejecutar Prisma DB Push

Una vez tengas las variables configuradas, ejecuta:

```bash
npx prisma db push
```

Esto hará:
1. ✅ Agregar la columna `specialties` a la tabla `staff`
2. ✅ Convertir los datos existentes de `specialty` a `specialties`
3. ✅ Sincronizar el schema de Supabase con Prisma

### Paso 4: Verificar la Migración

Después, verifica que todo está bien:

```bash
npx prisma studio
```

Esto abrirá Prisma Studio en http://localhost:5555 donde podrás:
- Ver la tabla `Staff`
- Verificar que el campo `specialties` contiene JSON
- Ver que los datos se migraron correctamente

### Paso 5: Reiniciar el servidor

```bash
npm run dev
```

## Resultado esperado

- ✅ Tabla `staff` con columna `specialties` (TEXT que almacena JSON)
- ✅ Admin panel puede crear/editar estilistas con múltiples especialidades
- ✅ Los datos se guardan en Supabase correctamente
- ✅ Los clientes ven el nombre del estilista y sus especialidades al reservar

## Variables de Ejemplo

Tu DATABASE_URL debe ser algo como:

```
postgresql://postgres.xagvzoomrwfywamkfdft:YOUR_PASSWORD@db.xagvzoomrwfywamkfdft.supabase.co:5432/postgres
```

Donde:
- `xagvzoomrwfywamkfdft` es tu Project ID (visible en la URL de Supabase)
- `YOUR_PASSWORD` es tu contraseña de postgres
