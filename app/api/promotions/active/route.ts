import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET - Obtener promociones activas
export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];

    console.log('[API] Fetching active promotions for date:', today);

    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true)
      .eq('show_on_site', true)
      .lte('valid_from', today)
      .gte('valid_until', today)
      .order('priority', { ascending: false });

    if (error) {
      console.error('[API] Supabase error:', error);
      throw error;
    }

    console.log('[API] Raw data from DB:', data);

    // Mapear datos al formato esperado por la app
    const mappedData = (data || []).map((promo: any) => ({
      id: promo.id,
      title: promo.name,
      description: promo.description,
      discount_percentage: promo.discount_percentage || null,
      discount_amount: promo.special_price || null,
      valid_until: promo.valid_until,
    }));

    console.log('[API] Mapped data:', mappedData);

    return NextResponse.json({ promotions: mappedData });
  } catch (error) {
    console.error('[API] Error fetching active promotions:', error);
    return NextResponse.json([], { status: 200 }); // Retornar array vacío en lugar de error
  }
}
