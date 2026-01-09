
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAIL = "admin@yourdomain.com";
const ADMIN_PASSWORD = "admin123@";

async function setupAdmin() {
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
      // Don't throw, just continue
    }

    console.log("[SetupAdmin] Existing admin deleted (if any)");

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
    });
  } catch (error) {
    console.error("[SetupAdmin] Error:", error);
  }
}

setupAdmin();
