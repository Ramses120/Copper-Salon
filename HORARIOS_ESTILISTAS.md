# Gestión de Horarios de Estilistas - Documentación

## Descripción General
Se ha implementado un sistema completo de gestión de horarios para los estilistas en la sección de administración. Los administradores pueden:
- Ver los horarios de trabajo de cada estilista
- Agregar nuevos horarios
- Editar horarios existentes
- Eliminar horarios

## Estructura de la Base de Datos

### Tabla: `staff_schedules`
Almacena los horarios de trabajo de cada estilista.

```sql
CREATE TABLE IF NOT EXISTS public.staff_schedules (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  team_member_id  BIGINT NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  weekday         SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

**Campos:**
- `id`: Identificador único del horario
- `team_member_id`: ID del estilista
- `weekday`: Día de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)
- `start_time`: Hora de inicio (formato TIME)
- `end_time`: Hora de fin (formato TIME)
- `is_active`: Estado del horario (activo/inactivo)

**Nota importante:** Domingo (0) está marcado como día OFF y no se permite agregar horarios para ese día.

## API Endpoints

### GET `/api/staff/[id]/schedules`
Obtiene todos los horarios de un estilista.

**Respuesta:**
```json
{
  "schedules": [
    {
      "id": "1",
      "weekday": 1,
      "dayName": "Lunes",
      "startTime": "09:00",
      "endTime": "17:30",
      "isActive": true
    }
  ]
}
```

### POST `/api/staff/[id]/schedules`
Crea un nuevo horario o actualiza uno existente.

**Payload:**
```json
{
  "weekday": 1,
  "startTime": "09:00",
  "endTime": "17:30"
}
```

**Validaciones:**
- No se permite crear horarios para domingo (weekday = 0)
- Si ya existe un horario para ese día, se actualiza automáticamente
- Las horas deben ser válidas (formato HH:mm)

### PUT `/api/staff/[id]/schedules`
Actualiza un horario existente.

**Payload:**
```json
{
  "scheduleId": "1",
  "startTime": "10:00",
  "endTime": "18:00",
  "isActive": true
}
```

### DELETE `/api/staff/[id]/schedules`
Elimina un horario.

**Payload:**
```json
{
  "scheduleId": "1"
}
```

## Interfaz de Administrador

### Vista Principal de Estilistas
La página `/admin/estilistas` ahora muestra:

1. **Información del Estilista**
   - Nombre
   - Teléfono
   - Especialidades (badges)
   - Estado (Activo/Inactivo)

2. **Botón de Horarios (expandible)**
   - Al hacer clic, se expande una sección con los horarios
   - Icono de reloj + "Horarios" + chevron que rota

3. **Sección de Horarios Expandida**
   - Título: "Horarios de Trabajo (9:00 AM - 5:30 PM)"
   - Lista de horarios existentes con:
     - Nombre del día
     - Inputs editables para hora de inicio y fin
     - Botón de eliminar
   - Botón "Agregar Horario"

### Agregar/Editar Horarios
1. Haz clic en "Agregar Horario"
2. Selecciona el día de la semana (Lunes a Sábado, domingo está excluido)
3. Establece las horas de inicio y fin (valores por defecto: 09:00 - 17:30)
4. Haz clic en "Guardar"

### Editar Horarios Existentes
1. Los horarios se muestran en cards
2. Cambia las horas directamente en los inputs
3. Los cambios se guardan automáticamente al hacer blur

## Datos de Ejemplo
Se han agregado 6 estilistas de ejemplo con horarios:

| Estilista | Especialidad | Horarios |
|-----------|--------------|----------|
| María García | Colorista & Estilista | Lun-Sáb: 9:00 AM - 5:30 PM |
| Sofia Rodríguez | Maquilladora Profesional | Lun-Sáb: 10:00 AM - 6:00 PM |
| Ana Martínez | Especialista en Uñas | Mar-Sáb: 9:00 AM - 5:30 PM |
| Isabella López | Esteticista | Lun-Vie: 9:00 AM - 5:30 PM |
| Valentina Torres | Técnico en Extensiones | Lun-Sáb: 9:00 AM - 5:30 PM |
| Camila Hernández | Estilista General | Lun-Sáb: 9:00 AM - 5:30 PM |

## Características Implementadas

✅ **Expandible por Estilista**
- Cada estilista tiene su propia sección de horarios que se puede expandir/contraer

✅ **Edición Inline**
- Edita las horas directamente en la tarjeta sin necesidad de un modal

✅ **Validación de Días**
- Domingo está marcado como día OFF y no se permite agregar horarios
- Solo se pueden seleccionar Lunes a Sábado

✅ **Almacenamiento en Supabase**
- Todos los horarios se guardan correctamente en la base de datos
- Se usa la tabla `staff_schedules` con relación a la tabla `staff`

✅ **Rango Horario Recomendado**
- El sistema recomienda 9:00 AM - 5:30 PM
- Pero es completamente flexible y editable

✅ **Interfaz Intuitiva**
- Iconos de reloj y chevron para mejorar UX
- Mensajes de confirmación al guardar/eliminar
- Estados visuales para acciones

## Cómo Ejecutar

1. **Ejecutar el esquema SQL** en Supabase:
   ```bash
   # Copia el contenido de supabase-schema.sql y ejecuta en el editor SQL de Supabase
   ```

2. **Reiniciar el servidor**:
   ```bash
   npm run dev
   ```

3. **Acceder a la página de administración**:
   - Navega a `/admin/estilistas`
   - Los estilistas de ejemplo se mostrarán con sus horarios

## Estructura de Archivos Creados/Modificados

```
├── app/
│   ├── admin/
│   │   └── estilistas/
│   │       └── page.tsx (MODIFICADO - añadido sistema de horarios)
│   └── api/
│       └── staff/
│           └── [id]/
│               └── schedules/
│                   └── route.ts (NUEVO - API de horarios)
├── supabase-schema.sql (MODIFICADO - añadidos estilistas y horarios de ejemplo)
└── HORARIOS_ESTILISTAS.md (Este archivo)
```

## Próximas Mejoras Sugeridas

1. **Importar horarios en masa**: Permitir importar un CSV con horarios
2. **Horarios recurrentes**: Guardar un patrón y aplicarlo a múltiples estilistas
3. **Disponibilidad en tiempo real**: Mostrar horarios disponibles en el booking
4. **Notificaciones**: Alertar cuando se cambian horarios
5. **Historial**: Mantener registro de cambios en horarios
