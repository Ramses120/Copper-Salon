import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Obtener promociones activas
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const promotions = await db.promotion.findMany({
      where: {
        active: true,
        startDate: {
          lte: today,
        },
        endDate: {
          gte: today,
        },
      },
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return NextResponse.json({ promotions });
  } catch (error) {
    console.error('Error al obtener promociones activas:', error);
    return NextResponse.json(
      { error: 'Error al obtener promociones' },
      { status: 500 }
    );
  }
}
