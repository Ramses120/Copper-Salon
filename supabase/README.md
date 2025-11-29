# 📚 Documentación Supabase - Copper Beauty Salon

Bienvenido a la documentación completa de Supabase para Copper Beauty Salon.

## 📋 Contenido de Esta Carpeta

### 📁 Carpeta `/sql/`
Contiene todos los scripts SQL organizados por función.

**Archivos (ejecutar en orden):**
1. `01_create_tables.sql` - Crear todas las tablas
2. `02_create_indexes.sql` - Crear índices para performance
3. `03_triggers.sql` - Configurar triggers automáticos
4. `04_row_level_security.sql` - Habilitar RLS
5. `05_storage_buckets.sql` - Crear buckets
6. `06_insert_admin.sql` - Admin inicial
7. `07_insert_categories_services.sql` - Servicios
8. `08_insert_customers.sql` - Clientes de ejemplo
9. `09_insert_testimonials.sql` - Testimonios
10. `10_insert_staff_schedules.sql` - Estilistas y horarios ⭐ **CORREGIDO**
11. `11_insert_site_content.sql` - Contenido
12. `12_validate_setup.sql` - Verificación final

👉 **[Ver README en sql/](sql/README.md)** para instrucciones detalladas

---

### 📄 Documentos de Referencia

#### 🚀 [INICIO_RAPIDO.md](INICIO_RAPIDO.md)
**Para empezar rápidamente**
- Instrucciones paso a paso
- Cómo ejecutar los scripts
- Credenciales de prueba
- Qué verificar después

#### 🗄️ [ESTRUCTURA_BD.md](ESTRUCTURA_BD.md)
**Referencia completa de la base de datos**
- Diagrama de tablas
- Campos de cada tabla
- Relaciones (Foreign Keys)
- Políticas de seguridad
- Índices
- Triggers

#### 🔧 [ERROR_CORREGIDO.md](ERROR_CORREGIDO.md)
**Cómo se solucionó el error de horarios**
- Explicación del error
- Comparativa de métodos
- Antes y después
- Lecciones aprendidas

#### 📄 [sql/README.md](sql/README.md)
**Guía de scripts SQL**
- Descripción de cada script
- Instrucciones de ejecución
- Validación
- Troubleshooting

---

## 🎯 Casos de Uso

### Para Desarrolladores

**Necesito entender la estructura:**
→ Lee [ESTRUCTURA_BD.md](ESTRUCTURA_BD.md)

**Necesito ejecutar el setup:**
→ Lee [INICIO_RAPIDO.md](INICIO_RAPIDO.md)

**Me dió un error:**
→ Lee [sql/README.md](sql/README.md) sección "Troubleshooting"

**Quiero ver qué cambió en horarios:**
→ Lee [ERROR_CORREGIDO.md](ERROR_CORREGIDO.md)

### Para DevOps

**Setup inicial:**
1. Lee [INICIO_RAPIDO.md](INICIO_RAPIDO.md)
2. Ejecuta scripts en orden de [sql/](sql/)
3. Valida con `12_validate_setup.sql`

**Backup/Restore:**
1. Exporta desde Supabase Dashboard
2. O ejecuta SQL completo desde `/sql/`

**Migración a otra BD:**
1. Exporta tablas desde Supabase
2. Importa usando scripts de `/sql/`

---

## ⚡ Quick Start (3 pasos)

```bash
# 1. Abre Supabase Dashboard
https://app.supabase.com

# 2. Ve a SQL Editor y ejecuta los scripts en orden
sql/01_create_tables.sql
sql/02_create_indexes.sql
... (y así sucesivamente hasta sql/12_validate_setup.sql)

# 3. Verifica
# Ejecuta sql/12_validate_setup.sql
# Deberías ver:
# - 14 tablas creadas
# - 34 servicios
# - 6 estilistas
# - 32 horarios
```

---

## 📊 Resumen de Datos

| Recurso | Cantidad | Estado |
|---------|----------|--------|
| **Tablas** | 14 | ✅ Creadas |
| **Índices** | 15+ | ✅ Optimizados |
| **Servicios** | 34 | ✅ Cargados |
| **Estilistas** | 6 | ✅ Con horarios |
| **Horarios** | 32 | ✅ Funcionales |
| **Clientes** | 8 | ✅ De ejemplo |
| **Testimonios** | 8 | ✅ Precargados |
| **Admin** | 1 | ✅ Activo |

---

## 🔐 Credenciales de Prueba

**Admin:**
- Email: `admin@copperbeauty.com`
- Password: `admin123@`
- Rol: `superadmin`

**Estilistas (6):**
Todos tienen correos en formato `[nombre_minuscula]@copper.com`

---

## 🚀 Próximos Pasos

Después de setup:

1. **Conecta la app** a tu base de datos Supabase
   - Copia credenciales en `.env.local`
   - Reinicia Next.js

2. **Prueba el admin**
   - Ve a `/admin`
   - Login con credenciales
   - Edita estilistas y horarios

3. **Personaliza datos**
   - Cambia servicios
   - Agrega/edita estilistas
   - Modifica contenido del sitio

4. **Configura pagos** (Stripe)
5. **Configura emails** (SendGrid/Resend)
6. **Configura SMS** (Twilio)

---

## 📞 Soporte

### Si encuentras errores:

1. **Lee la sección Troubleshooting en [sql/README.md](sql/README.md)**
2. **Verifica que ejecutaste los scripts en orden**
3. **Revisa que no eliminaste/modificaste manualmente las tablas**
4. **Intenta ejecutar `12_validate_setup.sql` para diagnosticar**

### Errores Comunes:

| Error | Solución |
|-------|----------|
| "Table already exists" | Ejecuta `01_create_tables.sql` primero |
| "Foreign key constraint" | Scripts en orden incorrecto |
| "Column does not exist" | Ya está corregido en v2.0 |

---

## 📝 Notas Importantes

- ⚠️ Los scripts se deben ejecutar **en orden**
- ⚠️ No modifiques estructura sin actualizar APIs
- ⚠️ Backup regularmente con Supabase
- ✅ RLS está habilitado en todas las tablas
- ✅ Índices optimizan consultas comunes
- ✅ Triggers mantienen `updated_at` automático

---

## 🎓 Aprendizaje

Esta estructura es un ejemplo de:
- ✅ Organización profesional de scripts SQL
- ✅ Separación de responsabilidades
- ✅ Documentación clara
- ✅ Versionamiento (v1.0 → v2.0)
- ✅ Corrección de errores y mejora continua

---

**Última actualización:** Noviembre 29, 2025
**Versión:** 2.0 (Mejorada y Corregida)
**Mantenedor:** Copper Beauty Salon Dev Team
**Estado:** ✅ Listo para Producción
