import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAIL = "ramsesperaza23@gmail.com";
const ADMIN_PASSWORD = "admin123@";

export async function GET() {
  try {
    console.log("[SetupAuthAdmin] Verificando/creando admin en Supabase Auth...");

    // Check if user exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("[SetupAuthAdmin] Error listing users:", listError);
      throw listError;
    }

    const existingUser = users?.find((u) => u.email === ADMIN_EMAIL);

    if (existingUser) {
      console.log("[SetupAuthAdmin] Admin user already exists:", existingUser.id);
      return NextResponse.json({
        success: true,
        exists: true,
        user: {
          id: existingUser.id,
          email: existingUser.email,
        },
        message: "El admin ya existe en Supabase Auth",
      });
    }

    // Create admin user
    console.log("[SetupAuthAdmin] Creating admin user...");
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // Auto-confirm email
    });

    if (error) {
      console.error("[SetupAuthAdmin] Error creating user:", error);
      throw error;
    }

    console.log("[SetupAuthAdmin] Admin user created successfully:", data.user?.id);

    return NextResponse.json({
      success: true,
      created: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
      credentials: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
      message: "Admin creado exitosamente en Supabase Auth",
    });
  } catch (error) {
    console.error("[SetupAuthAdmin] Error:", error);
    return NextResponse.json(
      {
        error: "Error al crear admin en Supabase Auth",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
