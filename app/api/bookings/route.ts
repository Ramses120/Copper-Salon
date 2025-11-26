import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendBookingConfirmation } from "@/lib/email";
import { sendBookingSMS } from "@/lib/sms";

export async function POST(request: Request) {
  try {
    const {
      clienteNombre,
      clienteTelefono,
      clienteEmail,
      servicios,
      staffId,
      fecha,
      hora,
      notas,
    } = await request.json();

    if (!clienteNombre || !clienteTelefono || !servicios || servicios.length === 0 || !staffId || !fecha || !hora) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Verificar disponibilidad del estilista
    const staff = await db.staff.findUnique({
      where: { id: staffId },
    });

    if (!staff || !staff.active) {
      return NextResponse.json(
        { error: "Estilista no disponible" },
        { status: 400 }
      );
    }

    // Calcular duración total y precio
    const servicesData = await db.service.findMany({
      where: {
        id: {
          in: servicios,
        },
      },
    });

    const duracionTotal = servicesData.reduce(
      (sum: number, s: any) => sum + s.duration,
      0
    );
    const precioTotal = servicesData.reduce((sum: number, s: any) => sum + s.price, 0);

    // Verificar si hay conflictos de horario
    const fechaHora = new Date(`${fecha}T${hora}`);
    const fechaFin = new Date(fechaHora.getTime() + duracionTotal * 60000);

    const conflictos = await db.booking.findMany({
      where: {
        staffId,
        date: new Date(fecha),
        status: {
          in: ["pending", "confirmed"],
        },
      },
    });

    for (const conflicto of conflictos) {
      const conflictoInicio = new Date(`${conflicto.date.toISOString().split('T')[0]}T${conflicto.startTime}`);
      
      // Calcular duración del conflicto
      const serviciosConflicto = await db.bookingService.findMany({
        where: { bookingId: conflicto.id },
        include: { service: true },
      });
      
      const duracionConflicto = serviciosConflicto.reduce(
        (sum: number, bs: any) => sum + bs.service.duration,
        0
      );
      
      const conflictoFin = new Date(conflictoInicio.getTime() + duracionConflicto * 60000);

      // Verificar si hay solapamiento
      if (
        (fechaHora >= conflictoInicio && fechaHora < conflictoFin) ||
        (fechaFin > conflictoInicio && fechaFin <= conflictoFin) ||
        (fechaHora <= conflictoInicio && fechaFin >= conflictoFin)
      ) {
        return NextResponse.json(
          { 
            error: "El horario seleccionado no está disponible",
            disponible: false,
          },
          { status: 409 }
        );
      }
    }

    // Crear la reserva
    const booking = await db.booking.create({
      data: {
        clientName: clienteNombre,
        clientPhone: clienteTelefono,
        clientEmail: clienteEmail || "",
        staffId,
        date: new Date(fecha),
        startTime: hora,
        endTime: new Date(fechaFin).toTimeString().slice(0, 5),
        status: "pending",
        notes: notas || "",
        services: {
          create: servicios.map((serviceId: string) => ({
            serviceId: serviceId,
          })),
        },
      },
      include: {
        staff: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    // Enviar notificaciones (email y SMS)
    try {
      if (clienteEmail) {
        await sendBookingConfirmation({
          clienteNombre,
          clienteEmail,
          fecha: new Date(fecha).toLocaleDateString('es-MX'),
          hora,
          servicios: servicesData.map((s: any) => s.name),
          estilista: staff.name,
          total: precioTotal,
        });
      }

      await sendBookingSMS({
        clienteNombre,
        clienteTelefono,
        fecha: new Date(fecha).toLocaleDateString('es-MX'),
        hora,
        estilista: staff.name,
      });
    } catch (notificationError) {
      // Log error pero no fallar la reserva
      console.error('Error enviando notificaciones:', notificationError);
    }

    return NextResponse.json(
      { 
        booking,
        disponible: true,
        duracionTotal,
        precioTotal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Error al crear reserva" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get("estado");
    const fecha = searchParams.get("fecha");
    const staffId = searchParams.get("staffId");

    const where: any = {};

    if (estado && estado !== "all") {
      where.status = estado;
    }

    if (fecha) {
      where.date = new Date(fecha);
    }

    if (staffId) {
      where.staffId = staffId;
    }

    const bookings = await db.booking.findMany({
      where,
      include: {
        staff: true,
        services: {
          include: {
            service: true,
          },
        },
      },
      orderBy: [
        { date: "desc" },
        { startTime: "asc" },
      ],
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Error al obtener reservas" },
      { status: 500 }
    );
  }
}
