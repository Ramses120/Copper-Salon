import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const bodyData = await request.json();
    
    // Extraer datos del request
    const staffId = bodyData.staffId;
    const bookingDate = bodyData.date;
    const startTime = bodyData.startTime;
    const serviceIds = bodyData.serviceIds || [];
    const notes = bodyData.notes || "";
    const status = bodyData.status || "confirmed";
    const clientName = bodyData.clientName || "";
    const clientPhone = bodyData.clientPhone || "";
    const clientEmail = bodyData.clientEmail || "";

    if (!staffId || !bookingDate || !startTime || serviceIds.length === 0) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Obtener servicios para calcular duración
    const services = await db.service.findMany({
      where: {
        id: {
          in: serviceIds
        }
      }
    });

    if (!services || services.length === 0) {
      throw new Error("Error al obtener servicios");
    }

    const duracionTotal = services.reduce(
      (sum: number, s: any) => sum + (s.duration || 60),
      0
    );
    const precioTotal = services.reduce((sum: number, s: any) => sum + s.price, 0);

    // Calcular hora de fin
    const startDateTime = new Date(`${bookingDate}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + duracionTotal * 60000);
    const endTime = endDateTime.toTimeString().slice(0, 5);

    // Crear reserva
    const booking = await db.booking.create({
      data: {
        clientName: clientName,
        clientPhone: clientPhone,
        clientEmail: clientEmail,
        date: new Date(bookingDate),
        startTime: startTime,
        endTime: endTime,
        status: status,
        notes: notes,
        staffId: staffId,
        services: {
          create: serviceIds.map((serviceId: string) => ({
            serviceId: serviceId
          }))
        }
      },
      include: {
        services: {
          include: {
            service: true
          }
        }
      }
    });

    return NextResponse.json(
      {
        booking,
        duracionTotal,
        precioTotal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Error al crear reserva", details: String(error) },
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

    let whereClause: any = {};

    if (estado && estado !== "all") {
      whereClause.status = estado;
    }

    if (fecha) {
      const startOfDay = new Date(fecha);
      const endOfDay = new Date(fecha);
      endOfDay.setDate(endOfDay.getDate() + 1);
      whereClause.date = {
        gte: startOfDay,
        lt: endOfDay
      };
    }

    if (staffId) {
      whereClause.staffId = staffId;
    }

    const bookings = await db.booking.findMany({
      where: whereClause,
      include: {
        staff: true,
        services: {
          include: {
            service: true
          }
        }
      },
      orderBy: {
        date: "desc"
      }
    });

    return NextResponse.json({ bookings: bookings || [] });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Error al obtener reservas", details: String(error) },
      { status: 500 }
    );
  }
}
