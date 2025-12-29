import { NextRequest, NextResponse } from "next/server";
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

// GET - Listar todos los clientes
export async function GET(req: NextRequest) {
  try {
    console.log("[GET /api/customers] Fetching all customers...");
    
    const supabase = await getAuthenticatedSupabase();
    
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    console.log("[GET /api/customers] Retrieved customers:", customers?.length);
    return NextResponse.json(customers);
  } catch (error) {
    console.error("[GET /api/customers] Error fetching customers:", error);
    
    let errorMessage = "Error desconocido";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: "Error al obtener clientes", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo cliente
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, notes } = body;

    console.log("[POST /api/customers] Creating customer:", { name, phone, notes });

    if (!name || !phone) {
      console.warn("[POST /api/customers] Missing required fields:", { name, phone });
      return NextResponse.json(
        { error: "Nombre y teléfono son requeridos" },
        { status: 400 }
      );
    }

    console.log("[POST /api/customers] Using authenticated Supabase client...");
    const supabase = await getAuthenticatedSupabase();
    
    const { data: newCustomer, error } = await supabase
      .from('customers')
      .insert({
        name,
        phone,
        notes: notes || "",
        active: true
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/customers] Supabase error:", error);
      throw error;
    }

    console.log("[POST /api/customers] Customer created successfully:", newCustomer);

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("[POST /api/customers] Error creating customer:", error);
    
    let errorMessage = "Error desconocido";
    let errorStack = "";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack || "";
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
    }
    
    console.error("[POST /api/customers] Error details:", { errorMessage, errorStack, fullError: error });
    
    return NextResponse.json(
      { 
        error: "Error al crear cliente", 
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}
