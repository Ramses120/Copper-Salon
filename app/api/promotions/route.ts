import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabase } from '@/lib/supabaseClient';

// Helper para crear cliente autenticado
async function getAuthenticatedSupabase() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token")?.value;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    token
      ? { global: { headers: { Authorization: `Bearer ${token}` } } }
      : {}
  );
}

// GET - Obtener todas las promociones
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('priority', { ascending: false });

    if (error) throw error;

    // Mapear datos al formato esperado
    const mappedData = (data || []).map((promo: any) => {
      const promoType = promo.type || 'percentage';
      const discountValue =
        promoType === 'fixed'
          ? promo.special_price
          : promo.discount;

      return {
        id: promo.id,
        name: promo.name,
        description: promo.description,
        discount: discountValue || 0,
        type: promoType,
        active: promo.is_active,
        start_date: promo.valid_from || promo.start_date,
        end_date: promo.valid_until || promo.end_date,
        image_url: promo.image_url,
      };
    });

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST - Crear nueva promoción
export async function POST(request: Request) {
  try {
    const authClient = await getAuthenticatedSupabase();
    const body = await request.json();

    const promoType = body.type || 'percentage';
    const rawDiscount = parseFloat(body.discount ?? body.special_price ?? 0);
    const discountValue = Number.isFinite(rawDiscount) ? rawDiscount : 0;

    const { data, error } = await authClient
      .from('promotions')
      .insert([{
        name: body.name,
        description: body.description,
        special_price: promoType === 'fixed' ? discountValue : null,
        discount: promoType === 'percentage' ? discountValue : null,
        type: promoType,
        valid_from: body.start_date || body.valid_from,
        valid_until: body.end_date || body.valid_until,
        start_date: body.start_date || body.valid_from,
        end_date: body.end_date || body.valid_until,
        is_active: body.active !== false,
        show_on_site: body.show_on_site !== false,
        priority: body.priority || 0,
      }])
      .select()
      .single();

    if (error) throw error;

    // Mapear respuesta
    const responseType = data.type || 'percentage';
    const responseDiscount =
      responseType === 'fixed'
        ? data.special_price
        : data.discount;

    const mappedData = {
      id: data.id,
      name: data.name,
      description: data.description,
      discount: responseDiscount || 0,
      type: responseType,
      active: data.is_active,
      start_date: data.valid_from || data.start_date,
      end_date: data.valid_until || data.end_date,
    };

    return NextResponse.json(mappedData, { status: 201 });
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json(
      { error: 'Error creating promotion' },
      { status: 500 }
    );
  }
}
