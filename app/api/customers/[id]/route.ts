import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

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

// GET - Obtener cliente por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await getAuthenticatedSupabase();

    const { data: customer, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    if (!customer) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Error al obtener cliente" },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar cliente + activar/desactivar
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, phone, notes, active } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Nombre y teléfono son requeridos" },
        { status: 400 }
      );
    }

    const supabase = await getAuthenticatedSupabase();

    // Traer cliente actual para saber si cambia estado
    const { data: existing, error: existingError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();
    if (existingError) throw existingError;
    if (!existing) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    const willDeactivate = active === false && existing.active !== false;
    const willReactivate = active === true && existing.active === false;

    const { data: updated, error } = await supabase
      .from("customers")
      .update({
        name,
        phone,
        notes: notes ?? "",
        active: active === undefined ? existing.active : active,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Bitácora: agregar o cerrar registro de desactivación
    if (willDeactivate) {
      await supabase.from("deactivated_customers").insert({
        customer_id: id,
        name: updated?.name,
        phone: updated?.phone,
        email: (updated as any)?.email || null,
        notes: updated?.notes || null,
        deactivated_at: new Date().toISOString(),
      });
    }

    if (willReactivate) {
      const { data: lastRow } = await supabase
        .from("deactivated_customers")
        .select("id")
        .eq("customer_id", id)
        .order("deactivated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastRow?.id) {
        await supabase
          .from("deactivated_customers")
          .update({ reactivated_at: new Date().toISOString() })
          .eq("id", lastRow.id);
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Error al actualizar cliente" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar cliente
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await getAuthenticatedSupabase();

    await supabase.from("customers").delete().eq("id", id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Error al eliminar cliente" },
      { status: 500 }
    );
  }
}
