import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

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

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  try {
    const supabase = await getAuthenticatedSupabase();
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("phone", phone)
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return NextResponse.json(data || null);
  } catch (error) {
    console.error("Error fetching customer by phone:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
