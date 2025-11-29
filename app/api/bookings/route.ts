import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const {
      staffId,
      date,
      startTime,
      endTime,
      serviceIds,
      customerName,
      customerPhone,
      customerEmail,
      notes,
    } = await request.json();

    if (!staffId || !date || !startTime || !serviceIds || serviceIds.length === 0) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // 1. Validar disponibilidad
    const availabilityResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/availability/validate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId,
          date,
          startTime,
          endTime,
        }),
      }
    );

    const availabilityData = await availabilityResponse.json();

    if (!availabilityData.available) {
      return NextResponse.json(
        {
          error: "Horario no disponible",
          reason: availabilityData.reason,
          conflict: availabilityData.conflict,
        },
        { status: 409 }
      );
    }

    // 2. Obtener o crear cliente
    let customer;
    if (customerPhone) {
      const { data: existingCustomer } = await supabase
        .from("customers")
        .select("*")
        .eq("phone", customerPhone)
        .single();

      if (existingCustomer) {
        customer = existingCustomer;
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from("customers")
          .insert({
            name: customerName || "Cliente",
            phone: customerPhone,
            email: customerEmail || null,
          })
          .select()
          .single();

        if (customerError) throw customerError;
        customer = newCustomer;
      }
    }

    // 3. Crear reserva
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        customer_id: customer?.id || null,
        booking_date: date,
        start_time: startTime,
        end_time: endTime,
        staff_id: staffId,
        status: "confirmed",
        notes: notes || "",
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // 4. Agregar servicios a la reserva
    if (serviceIds.length > 0) {
      const bookingServices = serviceIds.map((serviceId: string) => ({
        booking_id: booking.id,
        service_id: serviceId,
      }));

      const { error: servicesError } = await supabase
        .from("booking_services")
        .insert(bookingServices);

      if (servicesError) throw servicesError;
    }

    // 5. Obtener datos completos de la reserva
    const { data: completeBooking } = await supabase
      .from("bookings")
      .select(
        `
        *,
        customer:customer_id(*),
        staff:staff_id(*),
        services:booking_services(service:service_id(*))
      `
      )
      .eq("id", booking.id)
      .single();

    return NextResponse.json(
      {
        booking: completeBooking,
        message: "Reserva creada exitosamente",
        staffAuthCode: (completeBooking?.staff as any)?.auth_code,
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
    const staffId = searchParams.get("staffId");
    const date = searchParams.get("date");
    const status = searchParams.get("status");

    let query = supabase
      .from("bookings")
      .select(
        `
        *,
        customer:customer_id(*),
        staff:staff_id(*),
        services:booking_services(service:service_id(*))
      `
      );

    if (staffId) {
      query = query.eq("staff_id", staffId);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (date) {
      query = query.eq("booking_date", date);
    }

    const { data: bookings, error } = await query.order("booking_date", {
      ascending: false,
    });

    if (error) throw error;

    return NextResponse.json({ bookings: bookings || [] });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Error al obtener reservas", details: String(error) },
      { status: 500 }
    );
  }
}

