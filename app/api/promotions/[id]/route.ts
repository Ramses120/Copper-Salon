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

// GET - Obtener una promoción por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('id', id)
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

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error('Error fetching promotion:', error);
    return NextResponse.json(
      { error: 'Promotion not found' },
      { status: 404 }
    );
  }
}

// PATCH - Actualizar promoción
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authClient = await getAuthenticatedSupabase();
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    
    if (body.name) updateData.name = body.name;
    if (body.description) updateData.description = body.description;
    if (body.discount !== undefined) {
      const promoType = body.type || 'percentage';
      const rawDiscount = parseFloat(body.discount);
      const discountValue = Number.isFinite(rawDiscount) ? rawDiscount : 0;

      if (promoType === 'fixed') {
        updateData.special_price = discountValue;
        updateData.discount = null;
      } else {
        updateData.discount = discountValue;
        updateData.special_price = null;
      }
    }
    if (body.type) updateData.type = body.type;
    if (body.start_date) {
      updateData.valid_from = body.start_date;
      updateData.start_date = body.start_date;
    }
    if (body.end_date) {
      updateData.valid_until = body.end_date;
      updateData.end_date = body.end_date;
    }
    if (body.active !== undefined) updateData.is_active = body.active;
    if (body.show_on_site !== undefined) updateData.show_on_site = body.show_on_site;
    if (body.priority !== undefined) updateData.priority = body.priority;

    const { data, error } = await authClient
      .from('promotions')
      .update(updateData)
      .eq('id', id)
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

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json(
      { error: 'Error updating promotion' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar promoción
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authClient = await getAuthenticatedSupabase();
    const { id } = await params;

    const { error } = await authClient
      .from('promotions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json(
      { error: 'Error deleting promotion' },
      { status: 500 }
    );
  }
}
