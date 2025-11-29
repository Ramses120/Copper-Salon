"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BookingCalendar from "@/components/BookingCalendar";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  pendiente: "#FFA500",
  confirmada: "#22C55E",
  completada: "#3B82F6",
  cancelada: "#EF4444",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({});
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [bookingsByStatus, setBookingsByStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();
      
      if (response.ok) {
        setStats(data.stats);
        setRecentBookings(data.recentBookings);
        setBookingsByStatus(data.bookingsByStatus);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle2 size={14} className="mr-1" />
            Confirmada
          </Badge>
        );
      case "pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock size={14} className="mr-1" />
            Pendiente
          </Badge>
        );
      case "completada":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <CheckCircle2 size={14} className="mr-1" />
            Completada
          </Badge>
        );
      case "cancelada":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <XCircle size={14} className="mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200">
            {estado}
          </Badge>
        );
    }
  };

  // Preparar datos para el gráfico de pie
  const pieData = Object.entries(bookingsByStatus).map(([estado, count]) => ({
    name: estado.charAt(0).toUpperCase() + estado.slice(1),
    value: count as number,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-gray-500">Cargando estadísticas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-times text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Bienvenido al panel de administración de Copper Beauty Salon & Spa
        </p>
      </div>



      {/* Charts */}
      {pieData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Estado de Reservas
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[
                            entry.name.toLowerCase() as keyof typeof COLORS
                          ] || "#999"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Reservas por Estado
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pieData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#E46768" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Booking Calendar */}
      <BookingCalendar initialBookings={recentBookings} />

      {/* Recent Bookings Table - Kept for reference but can be removed */}
      {false && (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Reservas Recientes
            </h2>
            <a
              href="/admin/reservas"
              className="text-sm text-copper-red hover:underline"
            >
              Ver todas →
            </a>
          </div>

          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Cliente
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Servicio
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Estilista
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Fecha
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Hora
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">
                          {booking.cliente}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {booking.servicio}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {booking.estilista}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {booking.fecha}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{booking.hora}</td>
                      <td className="py-3 px-4">
                        {getStatusBadge(booking.estado)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No hay reservas recientes
            </p>
          )}
        </CardContent>
      </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <a href="/admin/reservas">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calendar className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gestionar Reservas</h3>
                  <p className="text-sm text-gray-600">Ver todas las reservas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </a>

        <a href="/admin/servicios">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Servicios</h3>
                  <p className="text-sm text-gray-600">Gestionar servicios</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </a>

        <a href="/admin/promociones">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <AlertCircle className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Promociones</h3>
                  <p className="text-sm text-gray-600">Crear promociones</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </a>
      </div>
    </div>
  );
}
