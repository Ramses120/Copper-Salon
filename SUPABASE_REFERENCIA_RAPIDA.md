# 📌 Referencia Rápida - Setup Supabase

## ⚡ El Archivo Que Necesitas Ahora

### 👉 Lee Primero: [`supabase/INICIO_RAPIDO.md`](supabase/INICIO_RAPIDO.md)

(3 pasos para empezar en 5-10 minutos)

---

## 🗂️ Estructura de Archivos

```
/supabase/                    ← Carpeta raíz
├── sql/                      ← Scripts SQL (usar estos)
│   ├── 01_*.sql
│   ├── 02_*.sql
│   ├── ... hasta 12_*.sql
│   └── README.md            ← Instrucciones detalladas
├── README.md                ← Índice general
├── INICIO_RAPIDO.md         ← 👈 EMPIEZA POR AQUÍ
├── ESTRUCTURA_BD.md         ← Referencia de tablas
└── ERROR_CORREGIDO.md       ← Qué se arregló
```

---

## 🚀 3 Pasos Rápidos

### 1. Abre Supabase
```
https://app.supabase.com
→ Tu Proyecto
→ SQL Editor
```

### 2. Copia y Ejecuta (en este orden)
```
supabase/sql/01_create_tables.sql          ✅ RUN
supabase/sql/02_create_indexes.sql         ✅ RUN
supabase/sql/03_triggers.sql               ✅ RUN
supabase/sql/04_row_level_security.sql     ✅ RUN
supabase/sql/05_storage_buckets.sql        ✅ RUN
supabase/sql/06_insert_admin.sql           ✅ RUN
supabase/sql/07_insert_categories_services.sql  ✅ RUN
supabase/sql/08_insert_customers.sql       ✅ RUN
supabase/sql/09_insert_testimonials.sql    ✅ RUN
supabase/sql/10_insert_staff_schedules.sql ✅ RUN (CORREGIDO)
supabase/sql/11_insert_site_content.sql    ✅ RUN
supabase/sql/12_validate_setup.sql         ✅ RUN (verifica)
```

### 3. Valida
- ✅ Deberías ver "Success" en cada uno
- ✅ Ejecuta `12_validate_setup.sql` al final
- ✅ Verifica que muestra datos

---

## 📝 Credenciales

**Admin Login:**
```
Email: admin@copperbeauty.com
Password: admin123@
```

**URL:**
```
http://localhost:3000/admin
```

---

## ✅ ¿Qué Cambió?

### v1.0 (Antigua)
❌ Error: "column id does not exist"
❌ Todo en 1 archivo
❌ Difícil de debuggear

### v2.0 (Actual)
✅ Error corregido en `10_insert_staff_schedules.sql`
✅ Scripts separados en `/sql/`
✅ Documentación completa (4 archivos)
✅ Validación incluida

---

## 🎯 Qué Se Creó

- ✅ 14 tablas en Supabase
- ✅ 6 estilistas con horarios
- ✅ 34 servicios
- ✅ 32 horarios de trabajo
- ✅ 8 clientes de ejemplo
- ✅ RLS y seguridad

---

## 📚 Documentos por Caso

| Necesitas | Archivo |
|-----------|---------|
| Empezar rápido | `INICIO_RAPIDO.md` |
| Ver estructura BD | `ESTRUCTURA_BD.md` |
| Entender error | `ERROR_CORREGIDO.md` |
| Detalles de scripts | `sql/README.md` |

---

## ⚠️ Importante

- 📌 Ejecuta los scripts **EN ORDEN**
- 📌 Espera a que cada uno termine
- 📌 No modifiques antes de que termine
- 📌 Si falla, lee `sql/README.md` Troubleshooting

---

## 🆘 Si Algo Falla

1. **Mira el error en la consola**
2. **Lee el archivo relevante:**
   - Error SQL → `sql/README.md`
   - Error de estructura → `ESTRUCTURA_BD.md`
   - Error anterior conocido → `ERROR_CORREGIDO.md`
3. **Reinicia desde `01_create_tables.sql`**

---

## ✨ Después de Setup

Accede a:
```
http://localhost:3000/admin/estilistas
```

Deberías ver:
- ✅ 6 estilistas listados
- ✅ Botón "Horarios" expandible en cada uno
- ✅ Horarios editables
- ✅ Opción de agregar/eliminar horarios

---

**Última actualización:** Nov 29, 2025
**Versión:** 2.0 ✅
**Tiempo:** 5-10 min para setup
