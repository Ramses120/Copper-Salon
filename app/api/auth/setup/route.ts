import { NextResponse } from "next/server";

const response = NextResponse.json(
  { error: "Endpoint deshabilitado por seguridad" },
  { status: 403 }
);

export async function GET() {
  return response;
}

export async function POST() {
  return response;
}
