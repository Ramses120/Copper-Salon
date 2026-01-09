import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createUserSupabaseClient, getValidatedSession } from "@/lib/serverAuth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// Helper para crear cliente autenticado
async function getSupabaseWithSession(required = false) {
  const session = await getValidatedSession();
  if (session) {
    return createUserSupabaseClient(session.token);
  }
  if (required) {
    throw new Error("UNAUTHORIZED");
  }
  return supabaseAnon;
}

// Función para generar código único de autenticación
function generateAuthCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ST-${timestamp}-${random}`;
}

export async function GET() {
  try {
    const supabase = await getSupabaseWithSession();
    
    // Si es admin (tiene token), mostrar todos. Si no, solo activos.
    // Pero por ahora mantenemos la lógica original de mostrar solo activos para la lista pública
    // O mejor, si es admin dashboard, deberíamos ver todos.
    // Como este endpoint se usa en el admin dashboard, vamos a intentar traer todos
    // y dejar que el frontend filtre o muestre el estado.
    
    let query = supabase.from("staff").select("*").eq("active", true).order("name", { ascending: true });
    
    // Si no hay token (público), filtrar solo activos
    // (Aunque RLS ya protege, es bueno filtrar explícitamente para la UI pública)
    // Pero aquí asumimos que si se llama desde admin, queremos ver todos.
    // Para simplificar y arreglar el error de guardado, en GET usaremos el cliente autenticado
    // que permitirá ver todo si es admin.
    
    const { data: staffList, error } = await query;

    if (error) throw error;

    // Transformar al formato que espera el frontend
    const staff = (staffList || []).map((s: any) => {
      let parsedSpecialties = [];
      try {
        // Intentar parsear si es JSON
        if (s.specialty && (s.specialty.startsWith('[') || s.specialty.startsWith('{'))) {
          parsedSpecialties = JSON.parse(s.specialty);
        } else if (s.specialty) {
          // Si es texto plano, ponerlo en un array
          parsedSpecialties = [s.specialty];
        }
      } catch (e) {
        console.warn("Error parsing specialties for staff:", s.id, e);
        parsedSpecialties = s.specialty ? [s.specialty] : [];
      }

      return {
        id: s.id,
        nombre: s.name,
        telefono: s.phone || "",
        especialidades: parsedSpecialties,
        activo: s.active,
        auth_code: s.auth_code,
      };
    });

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
    const supabase = await getSupabaseWithSession(true);

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
        specialty: JSON.stringify(especialidades),
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
  } catch (error: any) {
    console.error("Error creating staff:", error);
    
    if ((error as any)?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    if (error?.code === 'PGRST303') {
      return NextResponse.json(
        { error: "Tu sesión ha expirado. Por favor inicia sesión nuevamente.", details: error },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: "Error al crear estilista", 
        details: error instanceof Error ? error.message : JSON.stringify(error) 
      },
      { status: 500 }
    );
  }
}
