"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Scissors,
  Calendar,
  Users,
  Tag,
  Image,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      
      if (!data.user && pathname !== "/admin/login") {
        router.push("/admin/login");
      } else {
        setUser(data.user);
      }
    } catch (error) {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Don't show layout on login page
  if (pathname === "/admin/login" || loading) {
    return <>{children}</>;
  }

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Servicios", icon: Scissors, path: "/admin/servicios" },
    { name: "Reservas", icon: Calendar, path: "/admin/reservas" },
    { name: "Estilistas", icon: Users, path: "/admin/estilistas" },
    { name: "Promociones", icon: Tag, path: "/admin/promociones" },
    { name: "Portafolio", icon: Image, path: "/admin/portafolio" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
        <h1 className="font-times text-xl font-bold">Copper Admin</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-800">
          <h1 className="font-times text-2xl font-bold text-copper-red">
            Copper Admin
          </h1>
          {user && (
            <p className="text-sm text-gray-400 mt-2">{user.nombre}</p>
          )}
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      router.push(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-copper-red text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Button
            variant="outline"
            className="w-full bg-transparent border-gray-700 text-white hover:bg-gray-800"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
