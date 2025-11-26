import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get("staffId");
    const fecha = searchParams.get("fecha");

    if (!staffId || !fecha) {
      return NextResponse.json(
        { error: "staffId y fecha son requeridos" },
        { status: 400 }
      );
    }

    // Obtener todas las reservas confirmadas o pendientes para ese día y estilista
    const bookings = await db.booking.findMany({
      where: {
        staffId,
        date: new Date(fecha),
        status: {
          in: ["pending", "confirmed"],
        },
      },
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    // Generar todos los slots posibles del día (9:00 AM - 5:30 PM)
    const slots: string[] = [];
    const startHour = 9;
    const endHour = 17; // 5:30 PM es la última cita que puede empezar
    
    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < endHour || hour === 17) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }

    // Marcar slots ocupados
    const unavailableSlots = new Set<string>();

    for (const booking of bookings) {
      const duracionTotal = booking.services.reduce(
        (sum: number, bs: any) => sum + bs.service.duration,
        0
      );

      const [hours, minutes] = booking.startTime.split(":").map(Number);
      const startTime = hours * 60 + minutes;
      const endTime = startTime + duracionTotal;

      // Marcar todos los slots que caen dentro de esta reserva
      slots.forEach((slot) => {
        const [slotHours, slotMinutes] = slot.split(":").map(Number);
        const slotTime = slotHours * 60 + slotMinutes;

        // Un slot está ocupado si cae dentro del rango de la reserva
        if (slotTime >= startTime && slotTime < endTime) {
          unavailableSlots.add(slot);
        }
      });
    }

    const availableSlots = slots.filter((slot) => !unavailableSlots.has(slot));

    return NextResponse.json({
      fecha,
      staffId,
      availableSlots,
      totalSlots: slots.length,
      availableCount: availableSlots.length,
      ocupadas: Array.from(unavailableSlots),
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    return NextResponse.json(
      { error: "Error al verificar disponibilidad" },
      { status: 500 }
    );
  }
}
