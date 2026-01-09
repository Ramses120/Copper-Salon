import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createUserSupabaseClient, getValidatedSession } from "@/lib/serverAuth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente sin sesión usa únicamente la anon key (respeta RLS).
function getPublicSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryFilter = searchParams.get("category");

    const supabase = getPublicSupabase();

    const [{ data: categories, error: catError }, { data: services, error: svcError }] =
      await Promise.all([
        supabase
          .from("categories")
          .select("id,name,description,display_order,active")
          .eq("active", true)
          .order("display_order", { ascending: true }),
        supabase
          .from("services")
          .select("id,category_id,name,description,duration_minutes,price,active,featured, categories(name)")
          .eq("active", true)
          .order("category_id", { ascending: true })
          .order("name", { ascending: true }),
      ]);

    if (catError) throw catError;
    if (svcError) throw svcError;

    const normalize = (str?: string | null) =>
      (str || "").toString().trim().toLowerCase();

    const catById = new Map<number | string, any>();
    (categories || []).forEach((c) => {
      if (c.id) catById.set(String(c.id), c);
    });

    let filteredServices = services || [];
    if (categoryFilter && categoryFilter !== "all") {
      filteredServices = filteredServices.filter(
        (s) =>
          String(s.category_id) === categoryFilter ||
          normalize(s.categories?.name) === normalize(categoryFilter)
      );
    }

    const normalized = filteredServices.map((s) => {
      const cat = catById.get(String(s.category_id));
      return {
        id: s.id,
        name: s.name,
        description: s.description || "",
        price: Number(s.price || 0),
        duration_minutes: s.duration_minutes || 0,
        active: s.active,
        featured: s.featured,
        category_id: s.category_id || null,
        category: cat?.name || s.categories?.name || "",
      };
    });

    return NextResponse.json({ services: normalized });
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
    const session = await getValidatedSession();
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const supabase = createUserSupabaseClient(session.token);
    
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
