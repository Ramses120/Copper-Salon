import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = "admin@copperbeauty.com";
const ADMIN_PASSWORD = "admin123@";

export async function GET() {
  try {
    console.log("[SetupAdmin] Starting admin setup...");

    // Hash the password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    console.log("[SetupAdmin] Password hashed");

    // Delete existing admin if exists
    const { error: deleteError } = await supabase
      .from("admins")
      .delete()
      .eq("email", ADMIN_EMAIL);

    if (deleteError && deleteError.code !== "PGRST116") {
      console.error("[SetupAdmin] Delete error:", deleteError);
      throw deleteError;
    }

    console.log("[SetupAdmin] Existing admin deleted");

    // Insert new admin
    const { data, error } = await supabase
      .from("admins")
      .insert({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: "Administrador Principal",
        rol: "superadmin",
        activo: true,
      })
      .select()
      .single();

    if (error) {
      console.error("[SetupAdmin] Insert error:", error);
      throw error;
    }

    console.log("[SetupAdmin] Admin created successfully:", {
      id: data.id,
      email: data.email,
      rol: data.rol,
      activo: data.activo,
    });

    // Verify the admin was created
    const { data: verifyData, error: verifyError } = await supabase
      .from("admins")
      .select("*")
      .eq("email", ADMIN_EMAIL)
      .single();

    if (verifyError) {
      console.error("[SetupAdmin] Verify error:", verifyError);
      throw verifyError;
    }

    console.log("[SetupAdmin] Admin verified in database");

    return NextResponse.json({
      success: true,
      message: "Admin creado exitosamente",
      admin: {
        id: verifyData.id,
        email: verifyData.email,
        name: verifyData.name,
        rol: verifyData.rol,
        activo: verifyData.activo,
      },
      credentials: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
    });
  } catch (error) {
    console.error("[SetupAdmin] Error:", error);
    return NextResponse.json(
      {
        error: "Error al crear el admin",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  // Also support POST
  return GET();
}
