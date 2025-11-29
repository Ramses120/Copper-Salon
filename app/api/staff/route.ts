import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data: staffList, error } = await supabase
      .from("staff")
      .select("*")
      .eq("active", true)
      .order("name", { ascending: true });

    if (error) throw error;

    // Transformar al formato que espera el frontend
    const staff = (staffList || []).map((s: any) => ({
      id: s.id,
      nombre: s.name,
      telefono: s.phone || "",
      especialidades: s.specialties ? (typeof s.specialties === 'string' ? JSON.parse(s.specialties) : s.specialties) : [],
      activo: s.active,
    }));

    return NextResponse.json({ staff });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { error: "Error al obtener estilistas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, especialidades, telefono, activo } = await request.json();

    if (!nombre || !especialidades || especialidades.length === 0 || !telefono) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Horario por defecto: Lunes a Sábado 9:00-19:00
    const defaultSchedule = {
      lunes: { activo: true, inicio: "09:00", fin: "19:00" },
      martes: { activo: true, inicio: "09:00", fin: "19:00" },
      miercoles: { activo: true, inicio: "09:00", fin: "19:00" },
      jueves: { activo: true, inicio: "09:00", fin: "19:00" },
      viernes: { activo: true, inicio: "09:00", fin: "19:00" },
      sabado: { activo: true, inicio: "09:00", fin: "19:00" },
      domingo: { activo: false, inicio: "09:00", fin: "19:00" },
    };

    const { data: staff, error } = await supabase
      .from("staff")
      .insert({
        name: nombre,
        specialties: JSON.stringify(especialidades),
        phone: telefono,
        email: "",
        photo_url: "",
        active: activo !== false,
        work_schedule: JSON.stringify(defaultSchedule),
      })
      .select()
      .single();

    if (error) throw error;

    // Transformar la respuesta al formato esperado por el frontend
    const transformedStaff = {
      id: staff.id,
      nombre: staff.name,
      telefono: staff.phone,
      especialidades: especialidades,
      activo: staff.active,
    };

    return NextResponse.json({ staff: transformedStaff }, { status: 201 });
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json(
      { error: "Error al crear estilista", details: String(error) },
      { status: 500 }
    );
  }
}
