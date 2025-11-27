# 🎯 Configuración de Supabase para Copper Beauty Salon

Esta aplicación usa **únicamente Supabase** como base de datos (sin Prisma).

## 📋 Pasos para configurar

### 1. Crear las tablas en Supabase

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Abre el **SQL Editor**
3. Copia y pega el contenido del archivo `supabase-tables.sql`
4. Ejecuta el SQL

### 2. Crear usuarios administradores

Necesitas crear las contraseñas hasheadas para los usuarios admin. Ejecuta este código en Node.js:

```javascript
const bcrypt = require('bcryptjs');

// Password: admin123@
bcrypt.hash('admin123@', 10).then(hash => {
  console.log('Hash para admin@copperbeauty.com:', hash);
});

// Password: Copper21@Beaty2025@
bcrypt.hash('Copper21@Beaty2025@', 10).then(hash => {
  console.log('Hash para manager@copperbeauty.com:', hash);
});
```

Luego actualiza el SQL en `supabase-tables.sql` con los hashes generados y ejecuta la parte de INSERT de admins nuevamente.

### 3. Configurar variables de entorno

El archivo `.env` ya tiene configuradas las variables de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL="https://xaafqracqyyubiaxkosc.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_anon_key_aqui"
```

### 4. Estructura de las tablas

#### Tablas creadas:
- **Admin** - Usuarios administradores
- **Category** - Categorías de servicios
- **Service** - Servicios del salón
- **Promotion** - Promociones
- **PromotionService** - Relación promociones-servicios
- **Staff** - Estilistas/personal
- **Booking** - Reservas
- **BookingService** - Relación reservas-servicios
- **PortfolioImage** - Imágenes del portafolio
- **Review** - Reseñas de clientes

### 5. Políticas de seguridad (RLS - Row Level Security)

**IMPORTANTE:** Por defecto, las tablas en Supabase tienen RLS activado. Para desarrollo, puedes:

#### Opción 1: Desactivar RLS (solo para desarrollo)
```sql
ALTER TABLE "Admin" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Service" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Promotion" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "PromotionService" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Staff" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "BookingService" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "PortfolioImage" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" DISABLE ROW LEVEL SECURITY;
```

#### Opción 2: Configurar políticas RLS (producción)
```sql
-- Ejemplo: Permitir lectura pública de servicios
CREATE POLICY "Public can view active services"
ON "Service" FOR SELECT
USING (active = true);

-- Ejemplo: Solo admins pueden modificar
CREATE POLICY "Only admins can modify services"
ON "Service" FOR ALL
USING (auth.role() = 'authenticated');
```

### 6. Credenciales de acceso

**Usuario Superadmin:**
- Email: `admin@copperbeauty.com`
- Password: `admin123@`

**Usuario Admin:**
- Email: `manager@copperbeauty.com`
- Password: `Copper21@Beaty2025@`

### 7. Ventajas de usar Supabase directamente

✅ Sin necesidad de Prisma Client  
✅ Sin migraciones de base de datos  
✅ Actualizaciones en tiempo real (Realtime subscriptions)  
✅ Autenticación integrada de Supabase  
✅ Storage integrado para imágenes  
✅ Edge Functions disponibles  
✅ Dashboard visual para gestión  

### 8. Comandos útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# No se necesitan comandos de Prisma
# Todo se gestiona directamente desde Supabase Dashboard
```

### 9. Solución de problemas

**Error: "relation does not exist"**
- Verifica que ejecutaste el SQL en Supabase
- Asegúrate de que los nombres de las tablas coinciden (case-sensitive)

**Error: "new row violates row-level security policy"**
- Desactiva RLS temporalmente o configura las políticas correctas

**Error: "Invalid API key"**
- Verifica que tu `NEXT_PUBLIC_SUPABASE_ANON_KEY` sea correcta
- Cópiala desde: Settings → API → Project API keys → anon public

### 10. Próximos pasos

1. ✅ Ejecutar el SQL para crear las tablas
2. ✅ Insertar usuarios admin con contraseñas hasheadas
3. ✅ Desactivar RLS o configurar políticas
4. ✅ Iniciar el servidor: `npm run dev`
5. ✅ Acceder a: http://localhost:3000/admin/login

---

**¿Necesitas ayuda?** Revisa la documentación de Supabase: https://supabase.com/docs
