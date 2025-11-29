# Configuración de Supabase Storage para Portafolio

## Pasos para crear el bucket 'portfolio' en Supabase:

### 1. Acceder a Supabase Console
- Ve a: https://app.supabase.com/
- Selecciona tu proyecto **Copper**

### 2. Ir a Storage
- En el menú izquierdo, haz clic en **"Storage"**
- Verás la sección de buckets

### 3. Crear nuevo bucket
- Haz clic en **"New bucket"** o **"Crear bucket"**
- Nombre del bucket: **`portfolio`** (IMPORTANTE: exactamente así)
- Deja las opciones por defecto
- Haz clic en **Create**

### 4. Configurar permisos públicos (IMPORTANTE)
Después de crear el bucket:
- Ve a las políticas del bucket (Policies)
- Necesitas permitir que las imágenes sean públicas para que se vean en la web

**En SQL Editor, ejecuta:**
```sql
-- Permitir que cualquiera lea las imágenes del portafolio
CREATE POLICY "Public Read Access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'portfolio');
```

### 5. Verificar que funciona
1. Ve a Admin > Portafolio
2. Intenta subir una imagen
3. Si se sube sin errores, ¡está configurado correctamente!

## Notas:
- Las imágenes se guardan en: `storage/portfolio/images/`
- Solo admins pueden subir imágenes (verificado por sesión)
- Las imágenes son públicas para lectura (pueden verse en la web)
- Tamaño máximo: 5MB por imagen
- Formatos soportados: JPG, PNG, WEBP

## Troubleshooting:

### "Error al subir imagen a Supabase"
- Verifica que el bucket 'portfolio' existe
- Verifica que las políticas de permiso están configuradas
- Revisa la consola del navegador para más detalles

### La imagen se sube pero no se ve
- Verifica que ejecutaste el SQL para los permisos públicos
- Abre la URL en una nueva pestaña para confirmar que es accesible
