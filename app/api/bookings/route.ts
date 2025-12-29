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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Normalizar parámetros
    const staffId = body.staffId;
    const date = body.date || body.fecha;
    const startTime = body.startTime || body.hora;
    const endTime = body.endTime;
    const serviceIds = body.serviceIds || body.servicios;
    const customerName = body.customerName || body.clientName || body.clienteNombre;
    const customerPhone = body.customerPhone || body.clientPhone || body.clienteTelefono;
    const customerEmail = body.customerEmail || body.clientEmail || body.clienteEmail;
    const notes = body.notes || body.notas;
    const status = body.status || "pending";

    if (!staffId || !date || !startTime || !serviceIds || serviceIds.length === 0) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Usar cliente autenticado si hay sesión (para admin), sino anónimo (para web pública)
    // NOTA: Se requiere haber ejecutado el SQL 'ALLOW_PUBLIC_BOOKINGS.sql' para que funcione sin Service Role
    const supabase = await getAuthenticatedSupabase();

    // Calculate endTime if not provided
    let calculatedEndTime = endTime;
    if (!calculatedEndTime && serviceIds && serviceIds.length > 0) {
       try {
         // Use supabaseAnon to ensure we can read services even if auth fails or is weird
         const { data: servicesData, error: servicesError } = await supabaseAnon
           .from('services')
           .select('duration_minutes')
           .in('id', serviceIds);
         
         if (servicesError) {
            console.error("Error fetching services for duration:", servicesError);
         }

         if (servicesData && servicesData.length > 0) {
           const totalMinutes = servicesData.reduce((sum, s) => sum + (s.duration_minutes || 30), 0);
           const [h, m] = startTime.split(':').map(Number);
           const startMinutes = h * 60 + m;
           const endMinutes = startMinutes + totalMinutes;
           const endH = Math.floor(endMinutes / 60);
           const endM = endMinutes % 60;
           // Handle day overflow (optional, but good practice)
           const finalH = endH % 24; 
           calculatedEndTime = `${finalH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
         } else {
           // Default to 1 hour if services not found
           const [h, m] = startTime.split(':').map(Number);
           calculatedEndTime = `${((h + 1) % 24).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
         }
       } catch (e) {
         console.error("Error calculating end time:", e);
         // Fallback
         const [h, m] = startTime.split(':').map(Number);
         calculatedEndTime = `${((h + 1) % 24).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
       }
    } else if (!calculatedEndTime) {
        // No services selected? Default 1 hour
         const [h, m] = startTime.split(':').map(Number);
         calculatedEndTime = `${((h + 1) % 24).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
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
          endTime: calculatedEndTime,
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

    // 2. Obtener o crear cliente (Upsert para manejar duplicados automáticamente)
    let customer;
    if (customerPhone) {
      // Prepare customer data - EXCLUDING email as per user request to avoid schema errors
      const customerData: any = {
        name: customerName || "Cliente",
        phone: customerPhone,
      };

      // Only add email if it's explicitly provided and we are sure the column exists. 
      // Given the error "Could not find the 'email' column", we skip it to be safe.
      // if (customerEmail) customerData.email = customerEmail;

      const { data: upsertedCustomer, error: upsertError } = await supabase
        .from("customers")
        .upsert(
          customerData,
          { onConflict: "phone" }
        )
        .select()
        .single();

      if (upsertError) {
        console.error("Error upserting customer:", upsertError);
        throw new Error(`Error al guardar cliente: ${upsertError.message}`);
      }
      customer = upsertedCustomer;
    }

    if (!customer) {
      throw new Error("No se pudo identificar al cliente (falta teléfono)");
    }

    // 3. Crear reserva
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        customer_id: customer?.id || null,
        booking_date: date,
        start_time: startTime,
        end_time: calculatedEndTime,
        staff_id: staffId,
        status: status,
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
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { 
        error: "Error al crear reserva", 
        details: error.message || String(error),
        code: error.code 
      },
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

    const supabase = await getAuthenticatedSupabase();

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

    const mappedBookings = bookings?.map((b: any) => ({
      id: b.id,
      clientName: b.customer?.name || "Cliente Desconocido",
      clientPhone: b.customer?.phone || "",
      clientEmail: b.customer?.email || "",
      date: b.booking_date,
      startTime: b.start_time,
      endTime: b.end_time,
      status: b.status,
      notes: b.notes,
      staffId: b.staff_id,
      staff: b.staff ? { name: b.staff.name, id: b.staff.id } : { name: "Sin asignar" },
      services: b.services?.map((s: any) => ({
        service: s.service ? { name: s.service.name, price: s.service.price } : { name: "Servicio desconocido" }
      })) || []
    })) || [];

    return NextResponse.json({ bookings: mappedBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Error al obtener reservas", details: String(error) },
      { status: 500 }
    );
  }
}

