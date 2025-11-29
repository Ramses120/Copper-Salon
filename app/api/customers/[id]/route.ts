import { NextRequest, NextResponse } from "next/server";

// PATCH - Actualizar cliente
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, phone, email, address, city, notes } = body;

    // En producción: actualizar en Supabase
    return NextResponse.json({
      id,
      name,
      phone,
      email,
      address,
      city,
      notes,
      active: true,
      updated_at: new Date().toISOString(),
    });
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
    // En producción: eliminar de Supabase
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Error al eliminar cliente" },
      { status: 500 }
    );
  }
}
