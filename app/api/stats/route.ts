import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

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

    // Reservas de hoy
    const todayBookings = await db.booking.count({
      where: {
        date: todayStr,
        status: {
          in: ["pending", "confirmed"],
        },
      },
    });

    // Ingresos de la semana (solo completadas)
    const weekBookings = await db.booking.findMany({
      where: {
        date: {
          gte: startOfWeekStr,
          lte: endOfWeekStr,
        },
        status: "completed",
      },
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    const weekRevenue = weekBookings.reduce((total: number, booking: any) => {
      const bookingTotal = booking.services.reduce(
        (sum: number, bs: any) => sum + bs.service.price,
        0
      );
      return total + bookingTotal;
    }, 0);

    // Clientes únicos del mes
    const monthBookings = await db.booking.findMany({
      where: {
        date: {
          gte: startOfMonthStr,
          lte: endOfMonthStr,
        },
      },
      select: {
        clientPhone: true,
      },
    });

    const uniqueClients = new Set(
      monthBookings.map((b: any) => b.clientPhone)
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

    const lastMonthBookings = await db.booking.count({
      where: {
        date: {
          gte: lastMonthStartStr,
          lte: lastMonthEndStr,
        },
        status: "completed",
      },
    });

    const currentMonthBookings = await db.booking.count({
      where: {
        date: {
          gte: startOfMonthStr,
          lte: todayStr,
        },
        status: "completed",
      },
    });

    const monthGrowth =
      lastMonthBookings > 0
        ? ((currentMonthBookings - lastMonthBookings) / lastMonthBookings) * 100
        : 0;

    // Reservas recientes
    const recentBookings = await db.booking.findMany({
      take: 10,
      orderBy: [{ date: "desc" }],
      include: {
        staff: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    // Estadísticas por estado
    const bookingsByStatus = await db.booking.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
      where: {
        date: {
          gte: todayStr,
        },
      },
    });

    return NextResponse.json({
      stats: {
        todayBookings,
        weekRevenue: Math.round(weekRevenue * 100) / 100,
        activeClients: uniqueClients,
        monthGrowth: Math.round(monthGrowth * 10) / 10,
      },
      recentBookings: recentBookings.map((booking: any) => ({
        id: booking.id,
        cliente: booking.clientName,
        telefono: booking.clientPhone,
        notas: booking.notes,
        servicio: booking.services?.map((s: any) => s.service?.name).filter(Boolean).join(", ") || "Sin servicio",
        estilista: booking.staff?.name || "Sin asignar",
        fecha: booking.date ? booking.date.toISOString().split("T")[0] : "",
        hora: booking.startTime,
        estado: booking.status,
      })),
      bookingsByStatus: bookingsByStatus.reduce((acc: Record<string, number>, item: any) => {
        acc[item.status] = item._count._all;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
