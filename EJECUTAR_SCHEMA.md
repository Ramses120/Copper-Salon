# Ejecutar Schema de Supabase - Copper Beauty Salon

## ✅ Cambios Realizados en el Schema

El archivo `supabase-schema.sql` ha sido actualizado con las siguientes tablas nuevas:

### Tablas Principales:
1. **categories** - Categorías de servicios (Cabello, Depilación, Cuidado Facial, Cejas y Pestañas, Uñas)
2. **services** - Servicios con relación a categorías (80+ servicios)
3. **staff** - Estilistas con teléfono y especialidades
4. **bookings** - Reservas/citas
5. **booking_services** - Tabla de unión (servicios por reserva)
6. **portfolio_images** - Imágenes del portafolio
7. **testimonials** - Testimonios de clientes
8. **promotions** - Promociones
9. **admins** - Administradores

### Características:
- ✅ Row Level Security (RLS) habilitado
- ✅ Índices para optimización
- ✅ Triggers para updated_at automático
- ✅ Storage buckets configurados (images y portfolio)
- ✅ Datos iniciales precargados (admin, categorías, servicios, testimonios)

---

## 🚀 Pasos para Ejecutar

### Paso 1: Acceder a Supabase SQL Editor
1. Ve a https://app.supabase.com/
2. Selecciona proyecto **Copper**
3. Menú izquierdo → **SQL Editor**
4. Haz clic en **New query**

### Paso 2: Copiar y Ejecutar el Schema
1. Abre el archivo: `/supabase-schema.sql`
2. **Copia TODO el contenido**
3. Pega en el SQL Editor de Supabase
4. Haz clic en **Run** (esquina superior derecha)

### Paso 3: Esperar Confirmación
- El script debería ejecutarse sin errores
- Verás en la consola: `✅ SETUP COMPLETO`
- Mostrará resumen de tablas creadas

### Paso 4: Crear Buckets de Storage
En **Storage** → **Buckets**, verifica que existan:
- ✅ `images` (ya debería existir)
- ✅ `portfolio` (debe crear si no existe)

Si no existen, crea uno nuevo:
- Nombre: `portfolio`
- Public: Sí

### Paso 5: Verificar Permisos de Storage
En el **SQL Editor**, ejecuta esto para asegurar permisos:

```sql
-- Permisos para bucket 'portfolio'
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

DROP POLICY IF EXISTS "Anyone can upload to portfolio" ON storage.objects;
CREATE POLICY "Anyone can upload to portfolio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio');

DROP POLICY IF EXISTS "Anyone can delete from portfolio" ON storage.objects;
CREATE POLICY "Anyone can delete from portfolio"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio');
```

---

## 📊 Datos Precargados

### Administrador:
- **Email:** admin@copperbeauty.com
- **Password:** admin123@

### Servicios Incluidos:
- 8 servicios de Cabello
- 10 servicios de Depilación
- 4 servicios de Cuidado Facial
- 5 servicios de Cejas y Pestañas
- 10 servicios de Uñas

### Testimonios:
- 8 testimonios de clientes satisfechos

---

## ✅ Verificación

Después de ejecutar, verifica que todo está correcto:

1. **En Supabase Console:**
   - Ir a **Table Editor**
   - Verificar que existan todas las tablas
   - Verificar datos en `categories`, `services`, `admins`

2. **En la aplicación:**
   - Abrir Admin > Portafolio
   - Intentar subir una imagen (debería funcionar)
   - Abrir Admin > Estilistas
   - Abrir Admin > Reservas
   - Ver si aparecen las categorías

---

## 🆘 Troubleshooting

### Error: "Table already exists"
- Normal si ejecutas varias veces
- Las tablas se recrean correctamente con `CREATE TABLE IF NOT EXISTS`

### Error: "Missing column"
- Ejecuta el script completo de una vez
- No ejecutes partes individuales

### Storage bucket no aparece
- Refresca la página
- Verifica en Settings > Storage

### Las imágenes no se suben
- Verifica que el bucket 'portfolio' existe
- Verifica que los permisos (Policies) están configurados
- Revisa la consola del navegador (F12) para más detalles

---

## 📝 Próximos Pasos

Una vez ejecutado el schema:
1. ✅ Deploy a producción (Vercel)
2. ✅ Configurar variables de entorno en Vercel
3. ✅ Probar todas las funcionalidades en producción

---

## 📞 Notas

- El schema incluye 80+ servicios predefinidos
- Puedes agregar más servicios desde Admin > Servicios
- Puedes editar categorías desde Admin > Categorías
- Las imágenes se guardan en Supabase Storage (bucket 'portfolio')
