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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await getAuthenticatedSupabase();

    const { nombre, especialidades, telefono, activo } =
      await request.json();

    if (!nombre || !telefono) {
      return NextResponse.json(
        { error: "Nombre y teléfono son requeridos" },
        { status: 400 }
      );
    }

    if (!especialidades || especialidades.length === 0) {
      return NextResponse.json(
        { error: "Debes seleccionar al menos una especialidad" },
        { status: 400 }
      );
    }

    const { data: staff, error } = await supabase
      .from("staff")
      .update({
        name: nombre,
        specialty: JSON.stringify(especialidades),
        phone: telefono,
        active: activo !== false,
      })
      .eq("id", id)
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

    return NextResponse.json({ staff: transformedStaff });
  } catch (error: any) {
    console.error("Error updating staff:", error);

    if (error?.code === 'PGRST303') {
      return NextResponse.json(
        { error: "Tu sesión ha expirado. Por favor inicia sesión nuevamente.", details: error },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar estilista", details: String(error) },
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
    const supabase = await getAuthenticatedSupabase();

    const { error } = await supabase
      .from("staff")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting staff:", error);
    return NextResponse.json(
      { error: "Error al eliminar estilista", details: String(error) },
      { status: 500 }
    );
  }
}
