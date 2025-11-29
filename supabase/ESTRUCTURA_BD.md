# 📊 Estructura de Supabase - Copper Beauty Salon

## 📁 Organización de Carpetas

```
supabase/
├── sql/
│   ├── 01_create_tables.sql              # Crear tablas
│   ├── 02_create_indexes.sql             # Crear índices
│   ├── 03_triggers.sql                   # Triggers y funciones
│   ├── 04_row_level_security.sql         # Políticas RLS
│   ├── 05_storage_buckets.sql            # Buckets de almacenamiento
│   ├── 06_insert_admin.sql               # Admin inicial
│   ├── 07_insert_categories_services.sql # Categorías y servicios
│   ├── 08_insert_customers.sql           # Clientes de ejemplo
│   ├── 09_insert_testimonials.sql        # Testimonios
│   ├── 10_insert_staff_schedules.sql     # Estilistas y horarios ⭐
│   ├── 11_insert_site_content.sql        # Contenido del sitio
│   ├── 12_validate_setup.sql             # Validación final
│   └── README.md                         # Instrucciones de ejecución
└── migrations/                           # (Futuro) Migraciones incrementales
```

## 🗄️ Estructura de Base de Datos

### Tablas Principales

#### 1. **admins** - Administradores
```
id (PK)
name
email (UNIQUE)
password
rol
permisos
activo
created_at
```

#### 2. **categories** - Categorías de Servicios
```
id (PK)
name (UNIQUE)
description
display_order
active
created_at
```

#### 3. **services** - Servicios
```
id (PK)
category_id (FK → categories)
name
description
duration_minutes
price
active
featured
created_at
updated_at
```

#### 4. **staff** - Estilistas ⭐
```
id (PK)
name
phone
specialty
active
work_schedule (DEPRECATED - usar staff_schedules)
email
photo_url
created_at
updated_at
```

#### 5. **staff_schedules** - Horarios de Trabajo ⭐
```
id (PK)
team_member_id (FK → staff)
weekday (0-6: Domingo a Sábado)
start_time (TIME)
end_time (TIME)
is_active
created_at
```

**Notas:**
- `weekday`: 0=Domingo, 1=Lunes, ..., 6=Sábado
- Domingo (0) está marcado como OFF
- Los horarios son editables desde el admin

#### 6. **customers** - Clientes
```
id (PK)
name
phone (UNIQUE)
email
address
city
notes
active
created_at
updated_at
```

#### 7. **bookings** - Reservas
```
id (PK)
customer_id (FK → customers)
booking_date
start_time
end_time
staff_id (FK → staff)
status
notes
created_at
updated_at
```

#### 8. **booking_services** - Servicios por Reserva
```
id (PK)
booking_id (FK → bookings)
service_id (FK → services)
created_at
UNIQUE(booking_id, service_id)
```

#### 9. **testimonials** - Testimonios
```
id (PK)
client_name
rating (1-5)
comment
service
image_url
is_featured
visible
created_at
```

#### 10. **portfolio_images** - Galería
```
id (PK)
url
category
caption
created_at
```

#### 11. **promotions** - Promociones
```
id (PK)
name
description
special_price
duration_minutes
is_active
priority
valid_from
valid_until
image_url
show_on_site
created_at
updated_at
```

#### 12. **site_content** - Contenido del Sitio
```
id (PK)
section (UNIQUE: 'hero', 'about', 'contact')
content (JSONB)
active
created_at
updated_at
```

#### 13. **site_settings** - Configuración
```
id (PK)
setting (UNIQUE)
value (JSONB)
created_at
updated_at
```

## 🔐 Seguridad (RLS)

### Políticas Implementadas

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| **admins** | Admin | Admin | Admin | Admin |
| **categories** | Public (active=true) | Admin | Admin | Admin |
| **services** | Public (active=true) | Admin | Admin | Admin |
| **staff** | Public (active=true) | Admin | Admin | Admin |
| **staff_schedules** | Public | Admin | Admin | Admin |
| **customers** | Admin | Admin | Admin | Admin |
| **bookings** | Admin + Public | Public | Admin | Admin |
| **promotions** | Admin | Admin | Admin | Admin |
| **portfolio_images** | Public | Admin | - | Admin |

## 📦 Storage Buckets

### Buckets Disponibles

1. **images** - Imágenes generales
   - Acceso: Público
   - Uso: Logo, banners, etc.

2. **portfolio** - Portafolio del salón
   - Acceso: Público
   - Uso: Fotos de trabajos

## 🔍 Índices

Creados para optimizar consultas frecuentes:

```sql
- idx_admins_email
- idx_categories_active
- idx_services_category_id
- idx_services_active
- idx_staff_active
- idx_staff_schedules_team
- idx_staff_schedules_weekday
- idx_customers_phone
- idx_customers_name
- idx_bookings_date
- idx_bookings_customer_id
- idx_bookings_staff_id
- idx_bookings_status
- idx_promotions_active
- idx_testimonials_visible
```

## ⚙️ Triggers

Función automática para actualizar `updated_at`:

```sql
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Se aplica a:
- services
- staff
- bookings
- customers
- promotions
- site_settings
- site_content

## 📝 Datos de Ejemplo

### Admin
- Email: `admin@copperbeauty.com`
- Password: `admin123@`
- Rol: `superadmin`

### Estilistas (6)
- María García - Colorista & Estilista
- Sofia Rodríguez - Maquilladora Profesional
- Ana Martínez - Especialista en Uñas
- Isabella López - Esteticista
- Valentina Torres - Técnico en Extensiones
- Camila Hernández - Estilista General

### Servicios (34)
- Categoría Cabello: 8 servicios
- Categoría Depilación: 10 servicios
- Categoría Cuidado Facial: 4 servicios
- Categoría Cejas y Pestañas: 5 servicios
- Categoría Uñas: 10 servicios

### Clientes (8)
- María González
- Sofia Martínez
- Ana Rodríguez
- Isabella Torres
- Valentina López
- Camila Hernández
- Lucía Ramírez
- Daniela Castro

### Testimonios (8)
Ratings 4-5 estrellas con comentarios positivos

## 🐛 Error Corregido en v2.0

**Error anterior (v1.0):**
```
ERROR: 42703: column "id" does not exist
LINE 469: SELECT id, weekday, start_time, end_time, TRUE
```

**Solución aplicada:**
Se eliminó el uso de `UNNEST()` en subquery y se cambió a `VALUES` múltiples filas.

**Antes:**
```sql
INSERT INTO public.staff_schedules SELECT id, weekday, start_time, end_time, TRUE 
FROM (SELECT ... UNNEST(...)) AS days;
```

**Después:**
```sql
INSERT INTO public.staff_schedules (team_member_id, weekday, start_time, end_time, is_active)
VALUES 
  (...), (...), (...);
```

## 🚀 Próximas Mejoras

- [ ] Agregar tabla `staff_services` para asignar servicios a estilistas
- [ ] Agregar tabla `promotions_services` para promociones por servicio
- [ ] Sistema de notificaciones
- [ ] Historial de cambios
- [ ] Sistema de importación de datos

---

**Última actualización:** Noviembre 29, 2025
**Versión:** 2.0 (Corregida)
**Estado:** ✅ Funcional
