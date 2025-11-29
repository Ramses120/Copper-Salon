# Configuración de Cloudinary para Upload de Imágenes

## 🚀 Problema Actual
Las credenciales de Cloudinary están usando valores placeholder en `.env`:
```
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Por eso el sistema de carga de imágenes en el portafolio admin no funciona.

## ✅ Pasos para Configurar Cloudinary

### 1. Crear una Cuenta en Cloudinary (si no tienes)
- Ve a: https://cloudinary.com
- Haz clic en "Sign Up"
- Completa el registro (puedes usar tu email o GitHub)

### 2. Obtener tus Credenciales
1. Una vez registrado, accede a tu Dashboard: https://cloudinary.com/console
2. En la sección **Account Details** en el dashboard, encontrarás:
   - **Cloud Name** (en la parte superior)
   - **API Key**
   - **API Secret**

### 3. Actualizar el Archivo `.env`
Abre `/Volumes/WORK/Work/Trabajos de Web Sites/Copper.v2/.env` y reemplaza:

```env
# ❌ ANTES (placeholder)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# ✅ DESPUÉS (con tus valores reales)
CLOUDINARY_CLOUD_NAME="tu_cloud_name_aqui"
CLOUDINARY_API_KEY="tu_api_key_aqui"
CLOUDINARY_API_SECRET="tu_api_secret_aqui"
```

### 4. Reiniciar el Servidor
```bash
# Mata el servidor actual
pkill -f "next dev"

# Inicia nuevamente
npm run dev
```

## 📸 Cómo Funciona el Sistema

### Upload de Imágenes en Admin Panel
1. **Seleccionar Imagen**: El usuario elige una imagen JPG, PNG o WEBP (máx 5MB)
2. **Upload a Cloudinary**: La imagen se carga directamente a Cloudinary (transformada automáticamente)
3. **Guardar URL en Base de Datos**: Se guarda la URL de Cloudinary en Supabase
4. **Mostrar en Portfolio**: La imagen se muestra en el portafolio público

### Endpoints Involucrados
- `POST /api/upload`: Sube imagen a Cloudinary
- `POST /api/portfolio`: Guarda referencia en base de datos
- `GET /api/portfolio`: Lista todas las imágenes

## 🔧 Transformaciones Automáticas

Cloudinary aplica automáticamente:
- Ancho/Alto máximo: 1200x1200px
- Calidad: Auto-optimizada según navegador
- Formato: Auto (WebP, AVIF cuando es posible)

## ⚠️ Errores Comunes

### "Unknown API key your_api_key"
**Causa**: Variables de ambiente no configuradas
**Solución**: Reemplaza los placeholders en `.env` con tus credenciales reales

### "Failed to upload image"
**Causa**: Credenciales inválidas o API Key expirado
**Solución**: Verifica que los valores en `.env` sean correctos

### "File too large"
**Causa**: Imagen > 5MB
**Solución**: Reduce el tamaño de la imagen

## 📝 Notas Importantes

- **NUNCA** compartas tu `API_SECRET` en GitHub o código público
- El `API_SECRET` solo se usa en el servidor (Next.js)
- Si alguien accede a tu `API_KEY`, puede cambiar tu configuración
- Mantén `.env` local y no lo subas a Git (ya está en `.gitignore`)

## ✨ Verificación

Después de configurar, intenta:
1. Ir a `/admin/portafolio`
2. Hacer clic en "Agregar Imagen"
3. Seleccionar una imagen pequeña
4. Escribir categoría y descripción
5. Hacer clic en "Agregar Imagen"

Si todo funciona, verás la imagen cargada al portafolio. ✅

---

**¿Necesitas ayuda?** Revisa los logs del servidor con `npm run dev` para ver mensajes de error específicos.
