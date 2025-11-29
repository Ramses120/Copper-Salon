# Sistema de Reservas Actualizado - Validación de Disponibilidad

## 📋 Cambios Implementados

### 1. **Nuevo Campo `auth_code` en Tabla `staff`**
- Código único generado automáticamente para cada estilista
- Formato: `ST-{timestamp}-{random}` (ej: ST-LNQY6H-ABCDE1)
- Se elimina automáticamente cuando se borra el estilista (ON DELETE CASCADE)
- Campo UNIQUE para evitar duplicados

### 2. **API de Validación de Disponibilidad**
**Ruta:** `/api/availability/validate`

**Request:**
```json
{
  "staffId": "1",
  "date": "2025-12-01",
  "startTime": "14:00",
  "endTime": "15:30"
}
```

**Respuesta (Disponible):**
```json
{
  "available": true,
  "message": "El horario está disponible",
  "staffSchedule": {
    "start": "09:00",
    "end": "17:30"
  }
}
```

**Respuesta (No Disponible - Fuera de Horario):**
```json
{
  "available": false,
  "reason": "El horario solicitado (19:00-20:00) está fuera del horario del estilista (09:00-17:30)",
  "staffSchedule": { "start": "09:00", "end": "17:30" }
}
```

**Respuesta (No Disponible - Conflicto):**
```json
{
  "available": false,
  "reason": "Ya existe una reserva en este horario (14:30-15:30)",
  "conflict": {
    "startTime": "14:30",
    "endTime": "15:30",
    "clientName": "Juan Pérez"
  }
}
```

### 3. **API Bookings Actualizado**
**Ruta:** `/api/bookings` (POST)

**Nuevas Características:**
- Valida automáticamente disponibilidad antes de crear reserva
- Retorna `staffAuthCode` para identificación
- Crea cliente si no existe
- Vincula servicios a la reserva
- Retorna error 409 si hay conflicto de horario

**Request:**
```json
{
  "staffId": "1",
  "date": "2025-12-01",
  "startTime": "14:00",
  "endTime": "15:30",
  "serviceIds": ["1", "2"],
  "customerName": "María García",
  "customerPhone": "(786) 555-0150",
  "customerEmail": "maria@example.com",
  "notes": "Preferencia de color castaño"
}
```

**Respuesta Exitosa:**
```json
{
  "booking": {
    "id": 1,
    "customer": { "id": 1, "name": "María García", ... },
    "staff": { "id": 1, "name": "María García", "auth_code": "ST-LNQY6H-ABCDE1" },
    "booking_date": "2025-12-01",
    "start_time": "14:00",
    "end_time": "15:30",
    "status": "confirmed"
  },
  "message": "Reserva creada exitosamente",
  "staffAuthCode": "ST-LNQY6H-ABCDE1"
}
```

## 🔧 Integración en Frontend (reservar/page.tsx)

### Paso 1: Agregar función de validación

```typescript
const validateAvailability = async (staffId: string, date: string, startTime: string, endTime: string) => {
  try {
    const response = await fetch("/api/availability/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        staffId,
        date,
        startTime,
        endTime,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error validating availability:", error);
    return { available: false, reason: "Error al validar disponibilidad" };
  }
};
```

### Paso 2: Modificar la selección de hora

```typescript
const handleTimeSelect = async (time: string) => {
  setSelectedTime(time);
  
  // Calcular hora de fin basada en duración total
  const [hours, minutes] = time.split(":").map(Number);
  const startDate = new Date(selectedDate);
  startDate.setHours(hours, minutes);
  
  const endDate = new Date(startDate.getTime() + duration * 60000);
  const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
  
  // Validar disponibilidad
  const validation = await validateAvailability(selectedStaff, selectedDate, time, endTime);
  
  if (!validation.available) {
    setError(`No disponible: ${validation.reason}`);
    setSelectedTime(""); // Resetear selección
  } else {
    setError("");
  }
};
```

### Paso 3: Actualizar handleSubmit

```typescript
const handleSubmit = async () => {
  if (!clientInfo.nombre || !clientInfo.telefono) {
    setError("Por favor completa nombre y teléfono");
    return;
  }

  try {
    setSubmitting(true);
    setError("");

    // Calcular hora de fin
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startDate = new Date(selectedDate);
    startDate.setHours(hours, minutes);
    const endDate = new Date(startDate.getTime() + duration * 60000);
    const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        staffId: selectedStaff,
        date: selectedDate,
        startTime: selectedTime,
        endTime: endTime,
        serviceIds: selectedServices,
        customerName: clientInfo.nombre,
        customerPhone: clientInfo.telefono,
        customerEmail: clientInfo.email,
        notes: clientInfo.notas,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        setError(`Horario no disponible: ${data.reason}`);
        return;
      }
      throw new Error(data.error);
    }

    setSubmitted(true);
    // Mostrar confirmación con staffAuthCode
    console.log("Reserva confirmada:", data.staffAuthCode);
  } catch (error: any) {
    setError(error.message || "Error al crear reserva");
  } finally {
    setSubmitting(false);
  }
};
```

## 📊 Validaciones Implementadas

### 1. **Validación de Día Laboral**
- Sistema verifica que el estilista trabaja ese día de la semana
- Domingo (0) excluido automáticamente

### 2. **Validación de Horario**
- Sistema verifica que la hora solicitada está dentro del horario del estilista
- Si el estilista trabaja 9:00-17:30, no se pueden reservar horas fuera de ese rango

### 3. **Validación de Conflicto**
- Sistema verifica que no hay otra reserva confirmada en ese horario
- Considera duración total del servicio

### 4. **Cascada de Eliminación**
- Si se borra un estilista, se elimina su `auth_code` automáticamente
- Las reservas vinculadas pueden ser configuradas para SET NULL

## 🔄 Flujo Completo

```
1. Cliente selecciona servicios (paso 1)
   ↓
2. Cliente selecciona estilista (paso 2)
   ↓
3. Cliente selecciona fecha (paso 3)
   ↓
4. Cliente selecciona hora
   ├─ Sistema valida: ¿Trabaja ese día? ✓
   ├─ Sistema valida: ¿Está dentro del horario? ✓
   ├─ Sistema valida: ¿Hay conflicto? ✓
   └─ Si todo está OK → Mostrar confirmación
   ↓
5. Cliente completa datos personales
   ↓
6. Cliente confirma
   ├─ Sistema crea reserva
   ├─ Sistema retorna staffAuthCode
   └─ Mostrar confirmación con código
```

## 📝 Próximos Pasos (Recomendados)

1. **Mostrar horarios disponibles dinámicamente**
   - Usar `/api/availability/validate` para cada hora
   - Marcar horas no disponibles como deshabilitadas

2. **Confirmación visual por email**
   - Incluir `staffAuthCode` en email de confirmación
   - Permitir cliente identificar quién fue su estilista

3. **Notificación a estilista**
   - Enviar SMS/email a estilista con `auth_code` de cliente
   - Opcional: código QR para check-in

4. **Dashboard de estilista**
   - Ver reservas asignadas por `auth_code`
   - Confirmar/rechazar reservas
   - Cambiar disponibilidad

## 🐛 Solución de Problemas

### "Horario no disponible"
- Verificar que el estilista tiene horario configurado ese día
- Ir a `/admin/estilistas` y expandir estilista
- Agregar/editar horarios si es necesario

### "Ya existe una reserva"
- Verificar reservas existentes en `/admin/reservas`
- El horario puede sobreponerse aunque tenga duración diferente

### `auth_code` NULL
- Ejecutar scripts SQL actualizados en Supabase
- Re-crear estilistas para generar código automático

## 📞 Contacto
Para errores o preguntas sobre la integración, verificar logs en:
- `/api/availability/validate` (validación)
- `/api/bookings` (creación)
- `/api/staff` (datos de estilistas)
