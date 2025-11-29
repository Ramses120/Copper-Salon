# 📁 Supabase SQL Scripts

Carpeta organizada con todos los scripts SQL para Copper Beauty Salon.

## 📋 Estructura de Scripts

Ejecuta los scripts en este orden:

### 1️⃣ **01_create_tables.sql**
Crea todas las tablas base de la aplicación.
- Elimina tablas existentes (limpia de conflictos)
- Crea nuevas tablas con sus relaciones
- Incluye: Admins, Categories, Services, Staff, Customers, Bookings, etc.

### 2️⃣ **02_create_indexes.sql**
Crea índices para optimizar consultas.
- Índices en campos frecuentemente buscados
- Mejora significativa de performance

### 3️⃣ **03_triggers.sql**
Configura triggers y funciones automáticas.
- Función `update_updated_at_column()` para actualizar timestamps
- Triggers en todas las tablas relevantes

### 4️⃣ **04_row_level_security.sql**
Configura políticas RLS (Row Level Security).
- Habilita RLS en todas las tablas
- Crea políticas para lectura/escritura
- Protege datos sensibles

### 5️⃣ **05_storage_buckets.sql**
Configura buckets de almacenamiento.
- Crea buckets: `images`, `portfolio`
- Establece políticas de acceso

### 6️⃣ **06_insert_admin.sql**
Inserta administrador inicial.
- Email: `admin@copperbeauty.com`
- Password: `admin123@`

### 7️⃣ **07_insert_categories_services.sql**
Inserta categorías y servicios.
- 5 categorías (Cabello, Depilación, etc.)
- 34 servicios con precios y duraciones

### 8️⃣ **08_insert_customers.sql**
Inserta clientes de ejemplo.
- 8 clientes de prueba con información completa

### 9️⃣ **09_insert_testimonials.sql**
Inserta testimonios.
- 8 testimonios con ratings y comentarios

### 🔟 **10_insert_staff_schedules.sql** ⭐ (CORREGIDO)
Inserta estilistas y sus horarios.
- 6 estilistas con especialidades
- Horarios completos (Lun-Sáb, sin domingo)
- **Versión corregida sin errores SQL**

### 1️⃣1️⃣ **11_insert_site_content.sql**
Inserta contenido del sitio.
- Hero section
- About section
- Contact information

## 🚀 Cómo Ejecutar

### Opción 1: En Supabase UI (Recomendado)

1. Abre [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Copia el contenido de cada archivo (en orden)
5. Pégalo y ejecuta con el botón **"Run"**
6. Espera a que termine antes de pasar al siguiente

### Opción 2: Desde Terminal

```bash
# Asume que tienes configurado psql o supabase-cli

# Ejecutar un archivo individual
psql -U postgres -h db.xxxx.supabase.co -d postgres -f supabase/sql/01_create_tables.sql

# O todos en secuencia
for file in supabase/sql/*.sql; do
  echo "Ejecutando: $file"
  psql -U postgres -h db.xxxx.supabase.co -d postgres -f "$file"
done
```

## ⚠️ Importante

- **NO ejecutes los scripts en desorden** - tienen dependencias
- Si falla uno, revisa el error y corrige antes de continuar
- El script `10_insert_staff_schedules.sql` es la **versión corregida** del error anterior

## 🔧 Error Previo Resuelto

**Error anterior:**
```
ERROR: 42703: column "id" does not exist
```

**Causa:** Uso incorrecto de `UNNEST()` en subquery con INSERT

**Solución:** 
Se cambió de:
```sql
INSERT ... SELECT ... FROM (SELECT ... UNNEST(...)) AS days;
```

A:
```sql
INSERT ... VALUES 
  (...), (...), (...);
```

Cada horario se inserta explícitamente como una fila separada.

## ✅ Validación Después de Ejecutar

Después de completar todos los scripts, ejecuta:

```sql
-- Verificar tablas creadas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Verificar datos
SELECT COUNT(*) as total_categorias FROM public.categories;
SELECT COUNT(*) as total_servicios FROM public.services;
SELECT COUNT(*) as total_estilistas FROM public.staff;
SELECT COUNT(*) as total_horarios FROM public.staff_schedules;

-- Verificar estilistas con horarios
SELECT s.name, COUNT(ss.id) as horarios
FROM public.staff s
LEFT JOIN public.staff_schedules ss ON s.id = ss.team_member_id
GROUP BY s.id, s.name;
```

## 📞 Soporte

Si encuentras errores:
1. Verifica el orden de ejecución
2. Comprueba que no hay tablas duplicadas
3. Revisa los logs de error en Supabase
4. Intenta limpiar y ejecutar de nuevo desde `01_create_tables.sql`

---

**Última actualización:** Noviembre 29, 2025
**Versión:** 2.0 (Corregida)
