# 🗄️ Configuración de Supabase para Copper Beauty Salon

## 📋 Información de tu Proyecto Supabase

- **Project URL**: `https://gspiqtveojtjizfnbgtx.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzcGlxdHZlb2p0aml6Zm5iZ3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzM4NTcsImV4cCI6MjA3OTY0OTg1N30.Ll-Oq1UJy-4EaeT_HNfQq2d9GYQYRAGE7i_d2kMuAt0`
- **Project Ref**: `gspiqtveojtjizfnbgtx`

## 🚀 Pasos de Configuración

### 1️⃣ Obtener la Contraseña de la Base de Datos

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard/project/gspiqtveojtjizfnbgtx
2. Click en **Settings** (⚙️) en el menú lateral
3. Click en **Database**
4. Busca la sección **Connection String**
5. Click en **Connection Pooling** y copia el string que dice:
   ```
   postgresql://postgres.gspiqtveojtjizfnbgtx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. Copia la contraseña (la parte que reemplaza `[YOUR-PASSWORD]`)

### 2️⃣ Actualizar el archivo .env

Abre el archivo `.env` y **reemplaza `YOUR_DB_PASSWORD`** con tu contraseña real en estas dos líneas:

```env
DATABASE_URL="postgresql://postgres.gspiqtveojtjizfnbgtx:TU_CONTRASEÑA_AQUI@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.gspiqtveojtjizfnbgtx:TU_CONTRASEÑA_AQUI@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

### 3️⃣ Ejecutar el SQL en Supabase

1. Ve a tu proyecto en Supabase
2. Click en **SQL Editor** en el menú lateral
3. Click en **New Query**
4. Abre el archivo `supabase-schema.sql` de este proyecto
5. **Copia TODO el contenido** del archivo SQL
6. **Pégalo** en el editor SQL de Supabase
7. Click en **Run** (▶️) en la esquina inferior derecha
8. Espera a que termine (puede tomar 30-60 segundos)
9. Deberías ver un mensaje ✅ **Success. No rows returned**

### 4️⃣ Verificar que todo funcionó

En el SQL Editor de Supabase, ejecuta esta query para verificar:

```sql
-- Verificar que las tablas se crearon
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Ver los servicios creados
SELECT nombre, categoria, precio FROM "Service" LIMIT 5;

-- Ver los estilistas
SELECT nombre, especialidad FROM "Staff";

-- Ver las promociones activas
SELECT titulo, descuento FROM "Promotion" WHERE activa = true;
```

### 5️⃣ Sincronizar Prisma con Supabase

En tu terminal, ejecuta estos comandos:

```bash
# Generar el cliente de Prisma con el nuevo schema de PostgreSQL
npx prisma generate

# Verificar que la conexión funciona
npx prisma db pull

# Opcional: Ver tu base de datos en el navegador
npx prisma studio
```

### 6️⃣ Probar la conexión desde tu app

Crea un archivo de prueba para verificar:

```typescript
// test-db.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    const services = await prisma.service.findMany({ take: 3 })
    console.log('✅ Conexión exitosa! Servicios:', services.length)
    console.log(services)
  } catch (error) {
    console.error('❌ Error de conexión:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
```

Ejecuta: `npx tsx test-db.ts`

## 📊 Datos Incluidos en la Base de Datos

### 👥 Admins (2)
- **Super Admin**: `admin@copper.com` / `admin123`
- **Gerente**: `gerente@copper.com` / `admin123`

### 💇 Estilistas (3)
- María González - Corte y Color
- Ana Rodríguez - Peinados y Maquillaje
- Sofía Martínez - Tratamientos Capilares

### 💈 Servicios (16)
- **Cortes** (3): Mujer, Hombre, Infantil
- **Color** (4): Tinte completo, Mechas, Retoque, Decoloración
- **Tratamientos** (3): Keratina, Botox capilar, Hidratación
- **Peinados** (3): Novia, Fiesta, Ondas
- **Maquillaje** (3): Novia, Fiesta, Social

### 🎉 Promociones (3)
- Bienvenida Navidad (20% descuento) - Código: `NAVIDAD2025`
- Paquete Novia (15% descuento) - Código: `NOVIA2025`
- Martes de Tratamientos (25% descuento) - Código: `MARTES25`

### 📅 Reservas de Ejemplo (3)
- Laura Pérez - Tinte completo (confirmada)
- Carlos Ramírez - Corte hombre (confirmada)
- Isabel Torres - Peinado de fiesta (pendiente)

### 🖼️ Portfolio (5)
- Balayage Rubio Dorado
- Corte Bob Moderno
- Peinado de Novia Elegante
- Maquillaje Natural Glam
- Tratamiento Keratina

## 🔧 Características Técnicas

### Optimizaciones Incluidas
- ✅ **10 índices** para búsquedas rápidas
- ✅ **2 vistas** (BookingDetails, ServiceStats)
- ✅ **Función** para verificar disponibilidad
- ✅ **Triggers** para actualizar `updatedAt` automáticamente
- ✅ **RLS (Row Level Security)** habilitado
- ✅ **Políticas de seguridad** para acceso público

### Ventajas vs SQLite
- ✅ Soporta **conexiones concurrentes** (múltiples usuarios)
- ✅ **Triggers y funciones** para lógica del lado del servidor
- ✅ **Vistas** para queries complejas optimizadas
- ✅ **RLS** para seguridad granular
- ✅ **Backups automáticos** diarios
- ✅ **Escalabilidad** para crecer sin límites
- ✅ **PostgreSQL** (el mejor motor de base de datos open source)

## 🛠️ Comandos Útiles

```bash
# Ver schema actual
npx prisma db pull

# Generar cliente Prisma
npx prisma generate

# Abrir interfaz visual de la DB
npx prisma studio

# Resetear la base de datos (CUIDADO - borra todo)
# Luego vuelve a ejecutar el SQL completo en Supabase

# Crear una migración desde el schema
npx prisma migrate dev --name init
```

## 📝 Notas Importantes

1. **Seguridad**: 
   - NUNCA subas el archivo `.env` a Git
   - La API Key `anon` es segura para usar en el frontend (tiene restricciones RLS)
   - Los passwords de admin están hasheados con bcrypt

2. **Connection Pooling**: 
   - Usa `DATABASE_URL` (puerto 6543) para conexiones desde serverless (Next.js API routes)
   - Usa `DIRECT_URL` (puerto 5432) para migraciones y Prisma Studio

3. **Límites del Plan Free**:
   - 500 MB de storage
   - 2 GB de transferencia/mes
   - Unlimited API requests
   - Proyecto pausa después de 1 semana de inactividad

4. **Mantener activo**:
   - Usa un cron job o Uptime Robot para hacer ping cada 5 minutos
   - O actualiza al plan Pro ($25/mes)

## 🚨 Solución de Problemas

### Error: "Connection refused"
- Verifica que la contraseña en `.env` sea correcta
- Verifica que el proyecto de Supabase esté activo (no pausado)

### Error: "SSL connection required"
- Asegúrate de tener `?sslmode=require` al final de tu connection string

### Error: "Prepared statement already exists"
- Usa Connection Pooling (puerto 6543) en lugar de Direct Connection

### Error: "Too many connections"
- Estás en el límite del plan Free (max 60 conexiones simultáneas)
- Asegúrate de hacer `prisma.$disconnect()` después de cada query

## 🎯 Siguiente Paso

Una vez configurado, prueba tu aplicación:

```bash
npm run dev
```

Y visita:
- http://localhost:3000 - Homepage
- http://localhost:3000/admin - Panel de admin (usa admin@copper.com / admin123)
- http://localhost:3000/reservar - Sistema de reservas

## ✅ Checklist de Verificación

- [ ] Copié mi contraseña de Supabase
- [ ] Actualicé el archivo `.env` con la contraseña real
- [ ] Ejecuté el SQL completo en Supabase SQL Editor
- [ ] Corrí `npx prisma generate`
- [ ] Probé la conexión con un query simple
- [ ] Mi app funciona con `npm run dev`
- [ ] Puedo hacer login en /admin
- [ ] Puedo crear una reserva en /reservar

---

💡 **¿Problemas?** Revisa la consola del navegador y los logs de Supabase en Dashboard > Logs
