// Middleware para proteger rutas de administración
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "copper-beauty-salon-secret-key-2025"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicPaths = [
    "/",
    "/servicios",
    "/portafolio",
    "/contacto",
    "/reservar",
    "/admin/login",
  ];

  // Si es una ruta pública, permitir acceso
  if (
    publicPaths.some((path) => pathname === path) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Verificar token para rutas de admin
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth-token");

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token.value, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      // Token inválido o expirado
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("auth-token");
      return response;
    }
  }

  // Verificar token para APIs protegidas
  if (
    pathname.startsWith("/api") &&
    !pathname.startsWith("/api/auth") &&
    !pathname.startsWith("/api/bookings") &&
    !pathname.startsWith("/api/availability") &&
    !pathname.startsWith("/api/staff") &&
    !pathname.startsWith("/api/services") &&
    !pathname.startsWith("/api/categories")
  ) {
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
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
