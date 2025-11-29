import { NextRequest, NextResponse } from "next/server";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// GET - Listar clientes (con búsqueda opcional)
export async function GET(req: NextRequest) {
  try {
    const searchQuery = req.nextUrl.searchParams.get("search") || "";

    // Simulamos búsqueda - en producción usaremos Supabase
    let customers: Customer[] = [
      {
        id: "1",
        name: "María González",
        phone: "+1-305-555-1234",
        email: "maria@email.com",
        address: "123 Calle Principal",
        city: "Miami",
        notes: "Cliente frecuente",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Sofia Martínez",
        phone: "+1-305-555-5678",
        email: "sofia@email.com",
        address: "456 Avenida Central",
        city: "Miami",
        notes: "Prefiere servicios de cabello",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Filtrar por búsqueda
    if (searchQuery) {
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone.includes(searchQuery)
      );
    }

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo cliente
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, address, city, notes } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Nombre y teléfono son requeridos" },
        { status: 400 }
      );
    }

    // En producción: guardar en Supabase
    const newCustomer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phone,
      email,
      address,
      city,
      notes,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Error al crear cliente" },
      { status: 500 }
    );
  }
}
