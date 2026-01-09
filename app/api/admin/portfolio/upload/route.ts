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

export async function POST(request: Request) {
  try {
    const session = await getValidatedSession();
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor" },
        { status: 500 }
      );
    }
    const supabase = getSupabaseAdmin();

    const form = await request.formData();
    const file = form.get("file") as File | null;
    const category = (form.get("category") as string) || "sin-categoria";

    if (!file) {
      return NextResponse.json({ error: "Archivo no proporcionado" }, { status: 400 });
    }

    // Asegurar bucket público (crear si no existe)
    const { data: existingBucket, error: getBucketError } = await supabase.storage.getBucket(bucketName);
    if (getBucketError && String(getBucketError.message || "").toLowerCase().includes("not found")) {
      const { error: createError } = await supabase.storage.createBucket(bucketName, { public: true });
      if (createError) throw createError;
    } else if (getBucketError) {
      throw getBucketError;
    }

    const ext = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).slice(2)}-${Date.now()}.${ext || "jpg"}`;
    const filePath = `${category}/${fileName}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "image/jpeg",
      });

    if (uploadError) {
      throw new Error(uploadError.message || uploadError.name || JSON.stringify(uploadError));
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    if (!data?.publicUrl) {
      throw new Error("No se pudo obtener la URL pública");
    }

    return NextResponse.json({ publicUrl: data.publicUrl });
  } catch (error: any) {
    console.error("Error uploading portfolio image:", error);
    return NextResponse.json(
      {
        error: "Error al subir la imagen",
        details: error?.message || String(error),
        bucket: bucketName,
        supabaseUrl,
      },
      { status: 500 }
    );
  }
}
