import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { servicios, clienteNombre, clienteEmail } = body;

    if (!servicios || servicios.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un servicio' },
        { status: 400 }
      );
    }

    // Calcular precio total
    const servicesData = await db.service.findMany({
      where: {
        id: {
          in: servicios,
        },
      },
    });

    const precioTotal = servicesData.reduce((sum: number, s: any) => sum + s.precio, 0);

    // Crear Payment Intent en Stripe
    const paymentIntent = await createPaymentIntent({
      amount: precioTotal,
      currency: 'usd',
      description: `Reserva Copper Beauty - ${clienteNombre}`,
      metadata: {
        clienteNombre,
        clienteEmail: clienteEmail || '',
        servicios: JSON.stringify(servicesData.map((s: any) => s.nombre)),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: precioTotal,
    });
  } catch (error) {
    console.error('Error creando payment intent:', error);
    return NextResponse.json(
      { error: 'Error al crear intención de pago' },
      { status: 500 }
    );
  }
}
