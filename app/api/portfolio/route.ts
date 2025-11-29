import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET - Listar todas las imágenes del portafolio
export async function GET() {
  try {
    const images = await db.portfolioImage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ portfolio: images });
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    return NextResponse.json(
      { error: 'Error al obtener imágenes' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva imagen en portafolio
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url, categoria, descripcion } = body;

    // Validar campos requeridos
    if (!url || !categoria || !descripcion) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Crear imagen
    const image = await db.portfolioImage.create({
      data: {
        url,
        category: categoria,
        caption: descripcion,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error al crear imagen:', error);
    return NextResponse.json(
      { error: 'Error al crear imagen' },
      { status: 500 }
    );
  }
}
