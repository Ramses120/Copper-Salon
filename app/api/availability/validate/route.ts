import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AvailabilityRequest {
  staffId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  excludeBookingId?: string; // Para ediciones
}

export async function POST(request: Request) {
  try {
    const { staffId, date, startTime, endTime, excludeBookingId } =
      (await request.json()) as AvailabilityRequest;

    if (!staffId || !date || !startTime) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos" },
        { status: 400 }
      );
    }

    /*
    // RESTRICTIONS REMOVED BY USER REQUEST:
    // 1. Stylist schedule check
    // 2. Overlapping booking check
    // 3. Working hours check
    
    // 1. Validar que el estilista tiene horario ese día
    const dayOfWeek = new Date(`${date}T00:00:00`).getDay();
    const { data: schedules, error: scheduleError } = await supabase
      .from("staff_schedules")
      .select("*")
      .eq("team_member_id", staffId)
      .eq("weekday", dayOfWeek)
      .eq("is_active", true);

    if (scheduleError) throw scheduleError;

    if (!schedules || schedules.length === 0) {
      return NextResponse.json(
        {
          available: false,
          reason: "El estilista no trabaja en este día",
          dayOfWeek,
        },
        { status: 200 }
      );
    }

    // 2. Validar que la hora está dentro del horario del estilista
    const schedule = schedules[0];
    const staffStartTime = schedule.start_time; // HH:MM
    const staffEndTime = schedule.end_time; // HH:MM

    if (startTime < staffStartTime || endTime > staffEndTime) {
      return NextResponse.json(
        {
          available: false,
          reason: `El horario solicitado (${startTime}-${endTime}) está fuera del horario del estilista (${staffStartTime}-${staffEndTime})`,
          staffSchedule: { start: staffStartTime, end: staffEndTime },
        },
        { status: 200 }
      );
    }

    // 3. Verificar que no hay conflictos con otras reservas
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    let query = supabase
      .from("bookings")
      .select("*")
      .eq("team_member_id", staffId)
      .eq("status", "confirmed")
      .lte("start_time", endTime)
      .gte("end_time", startTime);

    // Filtrar por fecha exacta
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    query = query
      .gte("date", startOfDay.toISOString())
      .lte("date", endOfDay.toISOString());

    if (excludeBookingId) {
      query = query.neq("id", excludeBookingId);
    }

    const { data: conflicts, error: conflictError } = await query;

    if (conflictError) throw conflictError;

    if (conflicts && conflicts.length > 0) {
      const conflictBooking = conflicts[0];
      return NextResponse.json(
        {
          available: false,
          reason: `Ya existe una reserva en este horario (${conflictBooking.start_time}-${conflictBooking.end_time})`,
          conflict: {
            startTime: conflictBooking.start_time,
            endTime: conflictBooking.end_time,
            clientName: conflictBooking.client_name,
          },
        },
        { status: 200 }
      );
    }
    */

    // 4. Todo está disponible (Always return true)
    return NextResponse.json(
      {
        available: true,
        message: "El horario está disponible",
        // staffSchedule: { start: staffStartTime, end: staffEndTime }, // Removed as we don't fetch it
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error validating availability:", error);
    return NextResponse.json(
      { error: "Error al validar disponibilidad", details: String(error) },
      { status: 500 }
    );
  }
}
