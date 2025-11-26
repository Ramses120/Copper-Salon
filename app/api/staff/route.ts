import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const staff = await db.staff.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: "asc",
      },
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
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { nombre, especialidad, telefono, email, foto } = await request.json();

    if (!nombre || !especialidad || !telefono) {
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

    const staff = await db.staff.create({
      data: {
        name: nombre,
        specialty: especialidad,
        phone: telefono,
        email: email || "",
        photoUrl: foto || "",
        active: true,
        workSchedule: JSON.stringify(defaultSchedule),
      },
    });

    return NextResponse.json({ staff }, { status: 201 });
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json(
      { error: "Error al crear estilista" },
      { status: 500 }
    );
  }
}
