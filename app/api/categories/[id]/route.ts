import { NextResponse } from "next/server";
import { createUserSupabaseClient, getValidatedSession } from "@/lib/serverAuth";

async function getSupabaseForRequest() {
  const session = await getValidatedSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return createUserSupabaseClient(session.token);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, display_order, active } = body;

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseForRequest();

    const updateData: any = { name };
    if (description !== undefined) updateData.description = description;
    if (display_order !== undefined) updateData.display_order = display_order;
    if (active !== undefined) updateData.active = active;

    const { data: category, error } = await supabase
      .from("categories")
      .update(updateData)
      .eq("id", id)
      .select("id,name,description,display_order,active")
      .single();

    if (error) throw error;

    return NextResponse.json(category);
  } catch (error) {
    const details = (error as any)?.message || String(error);
    if (details === "UNAUTHORIZED") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Error al actualizar categoría" },
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

    // Soft delete to avoid cascade on services
    const { error } = await supabase
      .from("categories")
      .update({ active: false })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    const details = (error as any)?.message || String(error);
    if (details === "UNAUTHORIZED") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Error al eliminar categoría" },
      { status: 500 }
    );
  }
}
