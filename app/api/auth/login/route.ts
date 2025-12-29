import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log("[LoginAPI] Login attempt:", { email });

    if (!email || !password) {
      console.log("[LoginAPI] Missing email or password");
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Use Supabase Auth for authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error || !data.session) {
      console.log("[LoginAPI] Authentication failed for:", email, error?.message);
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    console.log("[LoginAPI] Authentication successful for:", email);

    // Set the session cookie
    const cookieStore = await cookies();
    cookieStore.set("sb-access-token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    cookieStore.set("sb-refresh-token", data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    console.log("[LoginAPI] Session cookies set");

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    console.error("[LoginAPI] Error:", error);
    return NextResponse.json(
      { 
        error: "Error al iniciar sesión",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
