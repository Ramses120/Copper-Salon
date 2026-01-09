import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getValidatedSession } from "@/lib/serverAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const bucketName = (process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "imagenes").trim();

function getSupabaseAdmin() {
  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY no está configurada");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    global: { headers: { Authorization: `Bearer ${supabaseServiceKey}` } },
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getValidatedSession();
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supabase = getSupabaseAdmin();

    // Obtener registro para conocer la URL y path en storage
    const { data: row, error: fetchError } = await supabase
      .from("portfolio_images")
      .select("id, url")
      .eq("id", id)
      .single();
    if (fetchError) throw fetchError;
    if (!row) {
      return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 });
    }

    // Derivar path en storage a partir de la URL pública
    let storagePath = "";
    const url: string = row.url || "";
    const marker = `/storage/v1/object/public/${bucketName}/`;
    const idx = url.indexOf(marker);
    if (idx >= 0) {
      storagePath = url.substring(idx + marker.length);
    } else {
      // fallback: si la url ya es un path relativo
      storagePath = url.replace(/^\/+/, "");
      if (storagePath.startsWith(`${bucketName}/`)) {
        storagePath = storagePath.substring(bucketName.length + 1);
      }
    }

    if (storagePath) {
      await supabase.storage.from(bucketName).remove([storagePath]);
    }

    const { error: deleteDbError } = await supabase
      .from("portfolio_images")
      .delete()
      .eq("id", id);
    if (deleteDbError) throw deleteDbError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting portfolio image:", error);
    return NextResponse.json(
      {
        error: "Error al eliminar imagen",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
