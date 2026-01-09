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
      .order('priority', { ascending: false });

    if (error) {
      console.error('[API] Supabase error:', error);
      throw error;
    }

    console.log('[API] Raw data from DB:', data);

    const isWithinRange = (start?: string | null, end?: string | null) => {
      if (!start && !end) return true;
      if (start && start > today) return false;
      if (end && end < today) return false;
      return true;
    };

    // Mapear datos al formato esperado por la app
    const mappedData = (data || [])
      .filter((promo: any) => {
        const start = promo.valid_from || promo.start_date || null;
        const end = promo.valid_until || promo.end_date || null;
        return isWithinRange(start, end);
      })
      .map((promo: any) => {
        const discountPercentage =
          promo.type === 'percentage'
            ? promo.discount ?? promo.discount_percentage ?? null
            : null;
        const discountAmount =
          promo.type === 'fixed'
            ? promo.discount ?? promo.special_price ?? null
            : promo.special_price ?? null;

        return {
          id: promo.id,
          title: promo.name,
          description: promo.description,
          discount_percentage: discountPercentage,
          discount_amount: discountAmount,
          valid_until: promo.valid_until || promo.end_date || null,
        };
      });

    console.log('[API] Mapped data:', mappedData);

    return NextResponse.json({ promotions: mappedData });
  } catch (error) {
    console.error('[API] Error fetching active promotions:', error);
    return NextResponse.json([], { status: 200 }); // Retornar array vacío en lugar de error
  }
}
