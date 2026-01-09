import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createUserSupabaseClient, getValidatedSession } from "@/lib/serverAuth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// Cliente solo para acciones protegidas.
async function getProtectedSupabase() {
  const session = await getValidatedSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return createUserSupabaseClient(session.token);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = supabaseAnon;
    
    const { data: service, error } = await supabase
      .from('services')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single();

    if (error || !service) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ service });
  } catch (error) {
    const details = (error as any)?.message || String(error);
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Error al obtener servicio", details },
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
    const supabase = await getProtectedSupabase();

    const { nombre, descripcion, precio, duracion, categoriaId, activo } =
      await request.json();

    const { data: service, error } = await supabase
      .from('services')
      .update({
        name: nombre,
        description: descripcion,
        price: parseFloat(precio),
        duration_minutes: parseInt(duracion),
        category_id: categoriaId,
        active: activo,
      })
      .eq('id', id)
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;

    return NextResponse.json({ service });
  } catch (error) {
    const details = (error as any)?.message || String(error);
    if (details === "UNAUTHORIZED") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Error al actualizar servicio", details },
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
    const supabase = await getProtectedSupabase();

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    const details = (error as any)?.message || String(error);
    if (details === "UNAUTHORIZED") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Error al eliminar servicio", details },
      { status: 500 }
    );
  }
}
