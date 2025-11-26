import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Obtener promociones activas
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const promociones = await db.promotion.findMany({
      where: {
        activa: true,
        fechaInicio: {
          lte: today,
        },
        fechaFin: {
          gte: today,
        },
      },
      include: {
        servicios: {
          include: {
            servicio: true,
          },
        },
      },
      orderBy: {
        fechaInicio: 'desc',
      },
    });

    return NextResponse.json(promociones);
  } catch (error) {
    console.error('Error al obtener promociones activas:', error);
    return NextResponse.json(
      { error: 'Error al obtener promociones' },
      { status: 500 }
    );
  }
}
