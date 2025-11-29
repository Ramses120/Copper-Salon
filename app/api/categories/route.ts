import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      include: {
        services: {
          where: { active: true },
          orderBy: { name: 'asc' }
        }
      }
    });

    const response = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      order: cat.order,
      services: cat.services || []
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error al obtener categorías", details: String(error) },
      { status: 500 }
    );
  }
}
