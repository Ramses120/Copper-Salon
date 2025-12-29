// Middleware para proteger rutas de administración
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  "/api/auth/login",
  "/api/auth/setup",
  "/api/bookings",
  "/api/availability",
  "/api/staff",
  "/api/services",
  "/api/categories",
  "/api/promotions/active",
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
    const accessToken = request.cookies.get("sb-access-token");

    if (!accessToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  // APIs protegidas (excluyendo públicas)
  if (pathname.startsWith("/api")) {
    const accessToken = request.cookies.get("sb-access-token");

    if (!accessToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
