import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Helper para crear cliente autenticado
async function getAuthenticatedSupabase() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token")?.value;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    token
      ? { global: { headers: { Authorization: `Bearer ${token}` } } }
      : {}
  );
}

const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Mapeo de días de la semana (0 = Sunday, 6 = Saturday)
const WEEKDAYS = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Usamos cliente anónimo para lectura (público)
    const { data: schedules, error } = await supabaseAnon
      .from("staff_schedules")
      .select("*")
      .eq("team_member_id", id)
      .order("weekday", { ascending: true });

    if (error) throw error;

    // Transformar al formato esperado
    const formatted = schedules.map((schedule: any) => ({
      id: schedule.id,
      weekday: schedule.weekday,
      dayName: WEEKDAYS[schedule.weekday as keyof typeof WEEKDAYS],
      startTime: schedule.start_time,
      endTime: schedule.end_time,
      isActive: schedule.is_active,
    }));

    return NextResponse.json({ schedules: formatted });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "Error al obtener horarios" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { weekday, startTime, endTime } = await request.json();
    const supabase = await getAuthenticatedSupabase();

    if (weekday === undefined || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Validar que no sea domingo (0)
    if (weekday === 0) {
      return NextResponse.json(
        { error: "No se pueden agregar horarios para domingo (día off)" },
        { status: 400 }
      );
    }

    // Verificar si ya existe un horario para este día
    const { data: existing } = await supabase
      .from("staff_schedules")
      .select("id")
      .eq("team_member_id", id)
      .eq("weekday", weekday)
      .single();

    if (existing) {
      // Actualizar si ya existe
      const { data: schedule, error } = await supabase
        .from("staff_schedules")
        .update({
          start_time: startTime,
          end_time: endTime,
          is_active: true,
        })
        .eq("team_member_id", id)
        .eq("weekday", weekday)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json(
        {
          schedule: {
            id: schedule.id,
            weekday: schedule.weekday,
            dayName: WEEKDAYS[schedule.weekday as keyof typeof WEEKDAYS],
            startTime: schedule.start_time,
            endTime: schedule.end_time,
            isActive: schedule.is_active,
          },
        },
        { status: 200 }
      );
    }

    // Insertar nuevo horario
    const { data: schedule, error } = await supabase
      .from("staff_schedules")
      .insert({
        team_member_id: id,
        weekday,
        start_time: startTime,
        end_time: endTime,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        schedule: {
          id: schedule.id,
          weekday: schedule.weekday,
          dayName: WEEKDAYS[schedule.weekday as keyof typeof WEEKDAYS],
          startTime: schedule.start_time,
          endTime: schedule.end_time,
          isActive: schedule.is_active,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating/updating schedule:", error);
    return NextResponse.json(
      { error: "Error al guardar horario", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { scheduleId, startTime, endTime, isActive } = await request.json();
    const supabase = await getAuthenticatedSupabase();

    if (!scheduleId) {
      return NextResponse.json(
        { error: "Falta el ID del horario" },
        { status: 400 }
      );
    }

    const { data: schedule, error } = await supabase
      .from("staff_schedules")
      .update({
        start_time: startTime,
        end_time: endTime,
        is_active: isActive,
      })
      .eq("id", scheduleId)
      .eq("team_member_id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      schedule: {
        id: schedule.id,
        weekday: schedule.weekday,
        dayName: WEEKDAYS[schedule.weekday as keyof typeof WEEKDAYS],
        startTime: schedule.start_time,
        endTime: schedule.end_time,
        isActive: schedule.is_active,
      },
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json(
      { error: "Error al actualizar horario", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { scheduleId } = await request.json();
    const supabase = await getAuthenticatedSupabase();

    if (!scheduleId) {
      return NextResponse.json(
        { error: "Falta el ID del horario" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("staff_schedules")
      .delete()
      .eq("id", scheduleId)
      .eq("team_member_id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json(
      { error: "Error al eliminar horario", details: String(error) },
      { status: 500 }
    );
  }
}
