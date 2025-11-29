import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Función para generar código único de autenticación
function generateAuthCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ST-${timestamp}-${random}`;
}

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
      auth_code: s.auth_code,
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

    // Generar código de autenticación único
    const authCode = generateAuthCode();

    // Horario por defecto: Lunes a Sábado 9:00-17:30
    const defaultSchedule = {
      lunes: { activo: true, inicio: "09:00", fin: "17:30" },
      martes: { activo: true, inicio: "09:00", fin: "17:30" },
      miercoles: { activo: true, inicio: "09:00", fin: "17:30" },
      jueves: { activo: true, inicio: "09:00", fin: "17:30" },
      viernes: { activo: true, inicio: "09:00", fin: "17:30" },
      sabado: { activo: true, inicio: "09:00", fin: "17:30" },
      domingo: { activo: false, inicio: "09:00", fin: "17:30" },
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
        auth_code: authCode,
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
      auth_code: staff.auth_code,
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
