import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// DELETE - Eliminar imagen del portafolio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    // Verificar autenticación
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const id = parseInt(idStr);

    // Eliminar imagen
    await db.portfolioImage.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Imagen eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    return NextResponse.json(
      { error: 'Error al eliminar imagen' },
      { status: 500 }
    );
  }
}
