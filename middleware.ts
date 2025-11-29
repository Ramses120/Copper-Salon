// Middleware para proteger rutas de administración
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "copper-beauty-salon-secret-key-2025"
);

// Rutas públicas que no requieren autenticación
const PUBLIC_PATHS = [
  "/",
  "/servicios",
  "/portafolio",
  "/contacto",
  "/reservar",
  "/admin/login",
];

const PUBLIC_API_PATHS = [
  "/api/auth",
  "/api/bookings",
  "/api/availability",
  "/api/staff",
  "/api/services",
  "/api/categories",
];

function isPublicPath(pathname: string): boolean {
  // Rutas públicas exactas
  if (PUBLIC_PATHS.includes(pathname)) return true;
  
  // Next.js system files
  if (pathname.startsWith("/_next") || pathname.includes(".")) return true;
  
  // Rutas API públicas
  return PUBLIC_API_PATHS.some((path) => pathname.startsWith(path));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rutas públicas sin verificación
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Rutas de administración protegidas
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth-token");

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token.value, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("auth-token");
      return response;
    }
  }

  // APIs protegidas (excluyendo públicas)
  if (pathname.startsWith("/api")) {
    const token = request.cookies.get("auth-token");

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    try {
      await jwtVerify(token.value, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
