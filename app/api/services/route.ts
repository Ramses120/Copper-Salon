import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where = category && category !== "all" 
      ? { category: { name: category } }
      : {};

    const services = await db.service.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Error al obtener servicios" },
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

    const { nombre, descripcion, precio, duracion, categoriaId } =
      await request.json();

    if (!nombre || !precio || !duracion || !categoriaId) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const service = await db.service.create({
      data: {
        name: nombre,
        description: descripcion || "",
        price: parseFloat(precio),
        duration: parseInt(duracion),
        categoryId: categoriaId,
        active: true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Error al crear servicio" },
      { status: 500 }
    );
  }
}
