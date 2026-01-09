import { NextResponse } from "next/server";
import { createUserSupabaseClient, getValidatedSession } from "@/lib/serverAuth";

// Require a valid Supabase session for any booking detail operations.
async function getSupabaseForRequest() {
  const session = await getValidatedSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return createUserSupabaseClient(session.token);
}

function mapBooking(b: any) {
  if (!b) return null;
  return {
    id: b.id?.toString(),
    customerId: b.customer_id || b.customer?.id,
    clientName: b.customer?.name || "Cliente Desconocido",
    clientPhone: b.customer?.phone || "",
    clientEmail: b.customer?.email || "",
    date: b.booking_date,
    startTime: b.start_time,
    endTime: b.end_time,
    status: b.status,
    notes: b.notes,
    staffId: b.staff_id?.toString(),
    staff: b.staff
      ? { id: b.staff.id?.toString(), name: b.staff.name }
      : { id: "", name: "Sin asignar" },
    services:
      b.services?.map((s: any) => ({
        id: s.id?.toString(),
        service: s.service
          ? {
              id: s.service.id?.toString(),
              name: s.service.name,
              price: Number(s.service.price || 0),
            }
          : { id: "", name: "Servicio", price: 0 },
      })) || [],
  };
}

async function fetchBooking(id: string) {
  const supabase = await getSupabaseForRequest();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      customer:customer_id(*),
      staff:staff_id(*),
      services:booking_services(
        id,
        service:service_id(*)
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return mapBooking(data);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await fetchBooking(id);

    if (!booking) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    const details = (error as any)?.message || String(error);
    if (details === "UNAUTHORIZED") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    console.error("Error fetching booking:", error);
    return NextResponse.json({ error: "Error al obtener reserva" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      clientName,
      clientPhone,
      clientEmail,
      date,
      startTime,
      endTime,
      staffId,
      serviceIds,
      notes,
      estado,
      notas,
      status,
    } = body;

    const supabase = await getSupabaseForRequest();
    const updateData: any = {};

    if (date) updateData.booking_date = date;
    if (startTime) updateData.start_time = startTime;
    if (endTime) updateData.end_time = endTime;
    if (staffId) updateData.staff_id = staffId;
    if (notes !== undefined) updateData.notes = notes;
    if (notas !== undefined) updateData.notes = notas;
    if (estado) updateData.status = estado;
    if (status) updateData.status = status;

    // Update booking row
    const { error: updateError } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", id);
    if (updateError) throw updateError;

    // Update linked customer info if provided
    if (clientName || clientPhone || clientEmail !== undefined) {
      const { data: bookingRow } = await supabase
        .from("bookings")
        .select("customer_id")
        .eq("id", id)
        .single();
      if (bookingRow?.customer_id) {
        const customerUpdate: any = {};
        if (clientName) customerUpdate.name = clientName;
        if (clientPhone) customerUpdate.phone = clientPhone;
        if (clientEmail !== undefined) customerUpdate.email = clientEmail;
        await supabase
          .from("customers")
          .update(customerUpdate)
          .eq("id", bookingRow.customer_id);
      }
    }

    // Update services if provided
    if (Array.isArray(serviceIds)) {
      await supabase.from("booking_services").delete().eq("booking_id", id);
      if (serviceIds.length > 0) {
        const bookingServices = serviceIds.map((serviceId: string) => ({
          booking_id: id,
          service_id: serviceId,
        }));
        const { error: svcError } = await supabase
          .from("booking_services")
          .insert(bookingServices);
        if (svcError) throw svcError;
      }
    }

    const booking = await fetchBooking(id);
    return NextResponse.json({ booking });
  } catch (error) {
    const details = String((error as any)?.message || error);
    if (details === "UNAUTHORIZED") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Error al actualizar reserva", details },
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
    const body = await request.json().catch(() => ({}));
    const status = body.status;
    const notes = body.notes;

    const supabase = await getSupabaseForRequest();
    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const { error: updateError } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", id);
    if (updateError) throw updateError;

    const booking = await fetchBooking(id);
    return NextResponse.json({ booking });
  } catch (error) {
    const details = String((error as any)?.message || error);
    if (details === "UNAUTHORIZED") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Error al actualizar reserva", details },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await getSupabaseForRequest();

    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    const details = String((error as any)?.message || error);
    if (details === "UNAUTHORIZED") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Error al eliminar reserva", details },
      { status: 500 }
    );
  }
}
