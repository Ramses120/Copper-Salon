import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { nombre, especialidad, telefono, email, foto, activo } =
      await request.json();

    const staff = await db.staff.update({
      where: { id: params.id },
      data: {
        name: nombre,
        specialty: especialidad,
        phone: telefono,
        email,
        photoUrl: foto,
        active: activo,
      },
    });

    return NextResponse.json({ staff });
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json(
      { error: "Error al actualizar estilista" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await db.staff.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting staff:", error);
    return NextResponse.json(
      { error: "Error al eliminar estilista" },
      { status: 500 }
    );
  }
}
