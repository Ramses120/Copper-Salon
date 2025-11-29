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
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Reservas de hoy
    const todayBookings = await db.booking.count({
      where: {
        date: today,
        status: {
          in: ["pending", "confirmed"],
        },
      },
    });

    // Ingresos de la semana (solo completadas)
    const weekBookings = await db.booking.findMany({
      where: {
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
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
          gte: startOfMonth,
          lte: endOfMonth,
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
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const lastMonthBookings = await db.booking.count({
      where: {
        date: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
        status: "completed",
      },
    });

    const currentMonthBookings = await db.booking.count({
      where: {
        date: {
          gte: startOfMonth,
          lte: today,
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
          gte: today,
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
        servicio: booking.services.map((s: any) => s.service.name).join(", "),
        estilista: booking.staff.name,
        fecha: booking.date.toISOString().split("T")[0],
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
