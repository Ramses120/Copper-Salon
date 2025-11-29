"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar as CalendarIcon,
} from "lucide-react";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";

interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  date: string;
  startTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  staff: {
    name: string;
  };
  services: Array<{
    service: {
      name: string;
    };
  }>;
}

interface BookingCalendarProps {
  initialBookings?: Booking[];
}

export default function BookingCalendar({
  initialBookings = [],
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [staffFilter, setStaffFilter] = useState<string>("all");
  const [staffList, setStaffList] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Cargar reservas
  useEffect(() => {
    fetchBookings();
    // Refrescar cada 30 segundos
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    applyFilters();
  }, [bookings, searchTerm, statusFilter, staffFilter, selectedDate]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      const data = await response.json();

      if (response.ok) {
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener lista de estilistas
  useEffect(() => {
    const uniqueStaff = Array.from(
      new Set(bookings.map((b) => JSON.stringify({ id: b.id, name: b.staff.name })))
    )
      .map((s) => JSON.parse(s))
      .slice(0, 20); // Limitar a 20 estilistas únicos

    const staffMap = new Map<string, string>();
    bookings.forEach((booking) => {
      staffMap.set(booking.staff.name, booking.staff.name);
    });

    setStaffList(
      Array.from(staffMap.entries()).map(([name]) => ({
        id: name,
        name: name,
      }))
    );
  }, [bookings]);

  const applyFilters = () => {
    let filtered = bookings.filter((booking) => {
      // Filtro de fecha
      const bookingDate = new Date(booking.date);
      const isDateMatch =
        bookingDate.toDateString() === selectedDate.toDateString();

      if (!isDateMatch) return false;

      // Filtro de búsqueda
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        booking.clientName.toLowerCase().includes(searchLower) ||
        booking.clientPhone.includes(searchLower) ||
        booking.clientEmail.toLowerCase().includes(searchLower) ||
        booking.staff.name.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Filtro de estado
      if (statusFilter !== "all" && booking.status !== statusFilter)
        return false;

      // Filtro de estilista
      if (
        staffFilter !== "all" &&
        booking.staff.name !== staffFilter
      )
        return false;

      return true;
    });

    setFilteredBookings(filtered);
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle2 size={14} className="mr-1" />
            Confirmada
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock size={14} className="mr-1" />
            Pendiente
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <CheckCircle2 size={14} className="mr-1" />
            Completada
          </Badge>
        );
      case "cancelled":
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

  const getBookingsByStatus = () => {
    return {
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };
  };

  // Contar reservas por día
  const tileContent = ({ date }: { date: Date }) => {
    const count = bookings.filter(
      (b) => new Date(b.date).toDateString() === date.toDateString()
    ).length;

    if (count === 0) return null;

    return (
      <div className="mt-1">
        <span className="flex items-center justify-center bg-copper-red text-white text-xs rounded-full w-5 h-5">
          {count}
        </span>
      </div>
    );
  };

  const stats = getBookingsByStatus();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-gray-500">Cargando reservas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen de estados */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="text-yellow-600" size={20} />
              <div>
                <p className="text-xs text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-600" size={20} />
              <div>
                <p className="text-xs text-gray-600">Confirmadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.confirmed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-blue-600" size={20} />
              <div>
                <p className="text-xs text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="text-red-600" size={20} />
              <div>
                <p className="text-xs text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.cancelled}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendario y Búsqueda */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Calendario</h3>
            <Calendar
              value={selectedDate}
              onChange={(value) => {
                if (value instanceof Date) {
                  setSelectedDate(value);
                }
              }}
              tileContent={tileContent}
              className="react-calendar-custom"
            />
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Fecha seleccionada:
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {selectedDate.toLocaleDateString("es-MX", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Búsqueda y Filtros */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Reservas del día
            </h3>

            {/* Búsqueda */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Buscar por cliente, teléfono o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Filter size={16} className="inline mr-2" />
                  Estado
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="confirmed">Confirmada</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estilista
                </label>
                <Select value={staffFilter} onValueChange={setStaffFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estilistas</SelectItem>
                    {staffList.map((staff) => (
                      <SelectItem key={staff.id} value={staff.name}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lista de reservas */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {booking.clientName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {booking.staff.name}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="space-y-2 mb-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Servicios:</span>{" "}
                        {booking.services
                          .map((s) => s.service.name)
                          .join(", ")}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <CalendarIcon size={16} />
                          {booking.startTime}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {booking.clientPhone && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 bg-white px-2 py-1 rounded">
                            <Phone size={14} />
                            <a
                              href={`tel:${booking.clientPhone}`}
                              className="hover:text-copper-red"
                            >
                              {booking.clientPhone}
                            </a>
                          </div>
                        )}
                        {booking.clientEmail && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 bg-white px-2 py-1 rounded">
                            <Mail size={14} />
                            <a
                              href={`mailto:${booking.clientEmail}`}
                              className="hover:text-copper-red"
                            >
                              {booking.clientEmail}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay reservas para esta fecha</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
