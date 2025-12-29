import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = "admin@copperbeauty.com";
const ADMIN_PASSWORD = "admin123@";

export async function GET() {
  try {
    console.log("[CheckAdmin] Verificando si el admin existe...");

    // Check if admin exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from("admins")
      .select("id, email, rol, activo")
      .eq("email", ADMIN_EMAIL)
      .maybeSingle();

    if (checkError) {
      console.error("[CheckAdmin] Error verificando admin:", checkError);
      throw checkError;
    }

    if (existingAdmin) {
      console.log("[CheckAdmin] Admin ya existe:", existingAdmin);
      return NextResponse.json({
        exists: true,
        admin: existingAdmin,
        message: "El admin ya existe en la base de datos",
      });
    }

    // Admin doesn't exist, create it
    console.log("[CheckAdmin] Admin no existe, creando...");
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const { data: newAdmin, error: createError } = await supabase
      .from("admins")
      .insert({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: "Administrador Principal",
        rol: "superadmin",
        activo: true,
      })
      .select("id, email, rol, activo")
      .single();

    if (createError) {
      console.error("[CheckAdmin] Error creando admin:", createError);
      throw createError;
    }

    console.log("[CheckAdmin] Admin creado exitosamente:", newAdmin);

    return NextResponse.json({
      exists: false,
      created: true,
      admin: newAdmin,
      credentials: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
      message: "Admin creado exitosamente",
    });
  } catch (error) {
    console.error("[CheckAdmin] Error:", error);
    return NextResponse.json(
      {
        error: "Error al verificar/crear admin",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
