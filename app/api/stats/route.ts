import { NextResponse } from "next/server";
import { createUserSupabaseClient, getValidatedSession } from "@/lib/serverAuth";

export async function GET() {
  try {
    const session = await getValidatedSession();
    // Si no hay sesión, bloquear
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const supabase = createUserSupabaseClient(session.token);

    const today = new Date();
    // Use local date string YYYY-MM-DD to avoid UTC shifts
    const todayStr = today.toLocaleDateString('en-CA'); // YYYY-MM-DD format

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('en-CA');

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfWeekStr = startOfWeek.toLocaleDateString('en-CA');

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    const endOfWeekStr = endOfWeek.toLocaleDateString('en-CA');

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfMonthStr = startOfMonth.toLocaleDateString('en-CA');
    
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const endOfMonthStr = endOfMonth.toLocaleDateString('en-CA');

    // Reservas de hoy (pendientes + confirmadas)
    const { data: todayBookingsData, error: todayError } = await supabase
      .from("bookings")
      .select("id, status")
      .eq("booking_date", todayStr)
      .in("status", ["pending", "confirmed"]);
    if (todayError) throw todayError;
    const todayBookings = todayBookingsData?.length || 0;

    // Ingresos de la semana (solo completadas)
    const { data: weekBookings, error: weekError } = await supabase
      .from("bookings")
      .select(
        `
          id,
          booking_services(
            service:service_id(price)
          )
        `
      )
      .gte("booking_date", startOfWeekStr)
      .lte("booking_date", endOfWeekStr)
      .eq("status", "completed");
    if (weekError) throw weekError;

    const weekRevenue = (weekBookings || []).reduce((total: number, booking: any) => {
      const bookingTotal = (booking.booking_services || []).reduce(
        (sum: number, bs: any) => sum + Number(bs.service?.price || 0),
        0
      );
      return total + bookingTotal;
    }, 0);

    // Clientes únicos del mes
    const { data: monthBookings, error: monthError } = await supabase
      .from("bookings")
      .select("customer:customer_id(phone)")
      .gte("booking_date", startOfMonthStr)
      .lte("booking_date", endOfMonthStr);
    if (monthError) throw monthError;

    const uniqueClients = new Set(
      (monthBookings || [])
        .map((b: any) => b.customer?.phone)
        .filter(Boolean)
    ).size;

    // Calcular crecimiento (comparar con mes anterior)
    const lastMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastMonthStartStr = lastMonthStart.toLocaleDateString('en-CA');
    
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    const lastMonthEndStr = lastMonthEnd.toLocaleDateString('en-CA');

    const { data: lastMonthBookings, error: lastMonthError } = await supabase
      .from("bookings")
      .select("id")
      .gte("booking_date", lastMonthStartStr)
      .lte("booking_date", lastMonthEndStr)
      .eq("status", "completed");
    if (lastMonthError) throw lastMonthError;

    const { data: currentMonthBookings, error: currentMonthError } = await supabase
      .from("bookings")
      .select("id")
      .gte("booking_date", startOfMonthStr)
      .lte("booking_date", todayStr)
      .eq("status", "completed");
    if (currentMonthError) throw currentMonthError;

    const monthGrowth =
      (lastMonthBookings?.length || 0) > 0
        ? (((currentMonthBookings?.length || 0) - (lastMonthBookings?.length || 0)) / (lastMonthBookings?.length || 1)) * 100
        : 0;

    // Reservas recientes
    const { data: recentBookings, error: recentError } = await supabase
      .from("bookings")
      .select(
        `
          id,
          booking_date,
          start_time,
          status,
          notes,
          customer:customer_id(name, phone),
          staff:staff_id(name),
          services:booking_services(
            service:service_id(name)
          )
        `
      )
      .order("booking_date", { ascending: false })
      .order("start_time", { ascending: false })
      .limit(20);
    if (recentError) throw recentError;

    // Estadísticas por estado (desde hoy en adelante)
    const { data: statusRows, error: statusError } = await supabase
      .from("bookings")
      .select("status")
      .gte("booking_date", todayStr);
    if (statusError) throw statusError;

    const bookingsByStatus = (statusRows || []).reduce((acc: Record<string, number>, item: any) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      stats: {
        todayBookings,
        weekRevenue: Math.round(weekRevenue * 100) / 100,
        activeClients: uniqueClients,
        monthGrowth: Math.round(monthGrowth * 10) / 10,
      },
      recentBookings: (recentBookings || []).map((booking: any) => ({
        id: booking.id,
        cliente: booking.customer?.name || "Cliente Desconocido",
        telefono: booking.customer?.phone || "",
        notas: booking.notes,
        servicio: booking.services?.map((s: any) => s.service?.name).filter(Boolean).join(", ") || "Sin servicio",
        estilista: booking.staff?.name || "Sin asignar",
        fecha: booking.booking_date,
        hora: booking.start_time,
        estado: booking.status,
      })),
      bookingsByStatus,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
