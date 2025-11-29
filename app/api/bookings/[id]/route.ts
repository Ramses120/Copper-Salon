import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        staff: true,
        services: {
          include: {
            service: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Reserva no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Error al obtener reserva" },
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
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const {
      clientName,
      clientPhone,
      clientEmail,
      date,
      startTime,
      staffId,
      serviceIds,
      notes,
      estado,
      notas,
    } = await request.json();

    const updateData: any = {};

    if (clientName) updateData.clientName = clientName;
    if (clientPhone) updateData.clientPhone = clientPhone;
    if (clientEmail !== undefined) updateData.clientEmail = clientEmail || "";
    if (date) updateData.date = new Date(date);
    if (startTime) updateData.startTime = startTime;
    if (staffId) updateData.staffId = staffId;
    if (notes !== undefined) updateData.notes = notes || "";
    if (estado) updateData.status = estado;
    if (notas !== undefined) updateData.notes = notas || "";

    const booking = await db.booking.update({
      where: { id },
      data: updateData,
      include: {
        staff: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    if (serviceIds && Array.isArray(serviceIds) && serviceIds.length > 0) {
      // Obtener y eliminar servicios existentes
      const existingServices = await db.bookingService.findMany({
        where: { bookingId: id },
      });

      // Eliminar cada uno individualmente
      for (const service of existingServices) {
        await db.bookingService.delete({
          where: { id: service.id },
        });
      }

      // Crear nuevos servicios
      for (const serviceId of serviceIds) {
        await db.bookingService.create({
          data: {
            bookingId: id,
            serviceId,
          },
        });
      }

      const updatedBooking = await db.booking.findUnique({
        where: { id },
        include: {
          staff: true,
          services: {
            include: {
              service: true,
            },
          },
        },
      });

      return NextResponse.json({ booking: updatedBooking });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Error al actualizar reserva" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { status, notes } = await request.json();

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const booking = await db.booking.update({
      where: { id },
      data: updateData,
      include: {
        staff: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Error al actualizar reserva" },
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
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await db.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Error al eliminar reserva" },
      { status: 500 }
    );
  }
}
