import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const supabase = await getAuthenticatedSupabase();
    
    let query = supabase
      .from('services')
      .select('*, category:categories(*)')
      .order('name', { ascending: true });

    if (categoryId && categoryId !== "all") {
      query = query.eq('category_id', categoryId);
    }

    const { data: services, error } = await query;

    if (error) throw error;

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Error al obtener servicios" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await getAuthenticatedSupabase();
    
    const { nombre, descripcion, precio, duracion, categoriaId } =
      await request.json();

    if (!nombre || !precio || !duracion || !categoriaId) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const { data: service, error } = await supabase
      .from('services')
      .insert({
        name: nombre,
        description: descripcion || "",
        price: parseFloat(precio),
        duration_minutes: parseInt(duracion),
        category_id: categoriaId,
        active: true,
      })
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Error al crear servicio" },
      { status: 500 }
    );
  }
}
