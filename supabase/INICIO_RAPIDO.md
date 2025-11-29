# 🚀 Inicio Rápido - Supabase Setup

## Opción 1: Ejecución Rápida (Recomendado) ⚡

### Paso 1: Abre Supabase SQL Editor
```
https://app.supabase.com
→ Tu Proyecto
→ SQL Editor
```

### Paso 2: Ejecuta los scripts en orden

**IMPORTANTE: Ejecuta uno a uno, esperando que termine cada uno**

1. Copia el contenido de `supabase/sql/01_create_tables.sql`
2. Pégalo en el SQL Editor y haz clic en **"Run"**
3. Espera a que termine (verás "Success")
4. Repite con `02_create_indexes.sql`
5. Repite con `03_triggers.sql`
6. Repite con `04_row_level_security.sql`
7. Repite con `05_storage_buckets.sql`
8. Repite con `06_insert_admin.sql`
9. Repite con `07_insert_categories_services.sql`
10. Repite con `08_insert_customers.sql`
11. Repite con `09_insert_testimonials.sql`
12. **Repite con `10_insert_staff_schedules.sql` ⭐ (CORREGIDO)**
13. Repite con `11_insert_site_content.sql`
14. Repite con `12_validate_setup.sql` (para verificar)

### Paso 3: Verifica la instalación

Ejecuta el script `12_validate_setup.sql` y verifica:
- ✅ Total de tablas > 10
- ✅ Total de servicios = 34
- ✅ Total de estilistas = 6
- ✅ Total de horarios = 32

## Opción 2: Script Todo en Uno (Alternativa)

Si Supabase permite, crea un nuevo script combinado:

```bash
cat supabase/sql/01_*.sql supabase/sql/02_*.sql ... > combined.sql
```

Luego pégalo todo en el SQL Editor.

## ⚠️ Si Algo Falla

### Error: "Table already exists"
- Ejecuta `01_create_tables.sql` primero (limpia todo)
- Luego ejecuta todos en orden

### Error: "Foreign key constraint"
- Verifica que ejecutaste los scripts en orden
- Las tablas dependientes deben existir primero

### Error: "Column does not exist"
- Este error ya está CORREGIDO en `10_insert_staff_schedules.sql`
- Si persiste, revisa que no mezclaste versiones antiguas

## ✅ Después de Completar

### 1. Verifica en Supabase Dashboard
```
SQL Editor
→ Run → 12_validate_setup.sql
```

### 2. Ve a la tabla de Estilistas
```
Table Editor
→ staff
→ Deberías ver 6 estilistas
→ Haz clic en uno y expande "staff_schedules"
→ Deberías ver sus horarios (6 días x 6 estilistas = 36 registros)
```

### 3. Prueba el Admin
```
URL: https://tuapp.com/admin
Email: admin@copperbeauty.com
Password: admin123@
```

## 📞 Credenciales de Prueba

### Admin
- Email: `admin@copperbeauty.com`
- Password: `admin123@`

### Estilistas (6)
Todos tienen horarios configurados:
1. María García - (786) 555-0101
2. Sofia Rodríguez - (786) 555-0102
3. Ana Martínez - (786) 555-0103
4. Isabella López - (786) 555-0104
5. Valentina Torres - (786) 555-0105
6. Camila Hernández - (786) 555-0106

## 🎯 Resumen Final

| Recurso | Cantidad |
|---------|----------|
| Tablas | 14 |
| Índices | 15+ |
| Triggers | 7 |
| Admin | 1 |
| Estilistas | 6 |
| Horarios | 32 |
| Servicios | 34 |
| Clientes | 8 |
| Testimonios | 8 |

---

**Tiempo estimado:** 5-10 minutos
**Dificultad:** Fácil ✅
**Soporte:** Ver `supabase/sql/README.md`
