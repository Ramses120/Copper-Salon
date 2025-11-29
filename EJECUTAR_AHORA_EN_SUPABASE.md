# 🔥 EJECUTAR AHORA EN SUPABASE

## ⚡ Acción Inmediata Requerida

Tu sitio web está funcionando pero **NO TIENE BASE DE DATOS**. Necesitas ejecutar el esquema SQL para que el login funcione.

## 📋 Pasos Rápidos (5 minutos)

### 1. Abre Supabase SQL Editor
👉 **[CLICK AQUÍ PARA ABRIR SUPABASE SQL EDITOR](https://supabase.com/dashboard/project/xaafqracqyyubiaxkosc/sql/new)**

### 2. Copia TODO el archivo `supabase-schema.sql`
- Abre el archivo `supabase-schema.sql` en tu proyecto
- Selecciona TODO (Cmd+A)
- Copia (Cmd+C)

### 3. Pega y Ejecuta
- Pega el SQL en el editor de Supabase (Cmd+V)
- Haz clic en el botón **"Run"** (esquina inferior derecha)
- Espera unos segundos

### 4. Verifica las Tablas
- Ve a **Table Editor** en el menú lateral de Supabase
- Deberías ver 13 tablas creadas:
  - ✅ **admins** (¡IMPORTANTE! Contiene tu usuario de login)
  - team_members
  - services (100+ servicios ya cargados)
  - service_categories
  - appointments
  - promotions
  - gallery
  - testimonials
  - y más...

## 🔐 Credenciales de Login

Una vez ejecutado el esquema, puedes entrar al admin con:

```
URL: http://localhost:3000/admin/login

Email: admin@copperbeauty.com
Password: admin123@
```

## ✅ ¿Cómo sé que funcionó?

1. Deberías ver las 13 tablas en Table Editor
2. La tabla `admins` debe tener 1 registro (tu admin)
3. La tabla `services` debe tener 112 registros (todos los servicios)
4. Al entrar a http://localhost:3000/admin/login deberías poder iniciar sesión

## ❌ Problemas Comunes

**Error: "relation admins does not exist"**
- Solución: Ejecuta el esquema SQL completo en Supabase

**No puedo hacer login**
- Verifica que la tabla `admins` tenga el registro del administrador
- Verifica que estés usando: admin@copperbeauty.com / admin123@

**Las tablas ya existen**
- No hay problema, el esquema usa `CREATE TABLE IF NOT EXISTS`
- También hace `TRUNCATE` para limpiar datos viejos

## 🚀 Después de ejecutar

Tu sitio estará 100% funcional con:
- ✅ Login de administrador funcionando
- ✅ 112 servicios cargados con precios reales
- ✅ 5 categorías de servicios
- ✅ 8 testimonios de clientes
- ✅ Todo listo para usar

---

**¿Necesitas ayuda?** El esquema completo está en `supabase-schema.sql` (470+ líneas de SQL listo para ejecutar)
