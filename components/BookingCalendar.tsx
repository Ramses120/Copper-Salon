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
import { formatTime } from "@/lib/utils";
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
const ACTIVE_STATUSES = ["pending", "confirmed"];
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [staffFilter, setStaffFilter] = useState<string>("all");
  const [staffList, setStaffList] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Helper to format date to YYYY-MM-DD in local time
  const formatDateToLocalISO = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      if (response.ok) {
        const result = await response.json();
        // La API devuelve { bookings: [...] }
        const rawBookings = result.bookings || [];

        // Mapear los datos de Supabase o API al formato interno
        const mappedBookings = rawBookings.map((b: any) => ({
          id: b.id,
          clientName: b.clientName || b.cliente || b.customer?.name || "Cliente Desconocido",
          clientPhone: b.clientPhone || b.telefono || b.customer?.phone || "",
          clientEmail: b.clientEmail || b.customer?.email || "",
          date: b.date || b.booking_date || "",
          startTime: b.startTime || b.start_time || "",
          status: b.status,
          staff: {
            name: b.staff?.name || b.staff?.nombre || b.estilista || "Sin asignar",
          },
          services: (b.services || []).map((s: any) => ({
            service: {
              name: s.service?.name || s.name || "Servicio",
            },
          })),
        }));

        setBookings(mappedBookings);

        // Actualizar lista de estilistas basada en las reservas
        const uniqueStaff = Array.from(
          new Set(mappedBookings.map((b: Booking) => b.staff.name))
        ).map((name, index) => ({ id: `staff-${index}`, name: name as string }));
        setStaffList(uniqueStaff);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]); // Fallback a array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Cargar reservas
  useEffect(() => {
    fetchBookings();
    // Refrescar cada 10 segundos para mantener la información actualizada
    const interval = setInterval(fetchBookings, 10000);

    // Escuchar notificaciones de actualización para refrescar inmediatamente
    let bc: BroadcastChannel | null = null;
    const onMsg = (e: any) => {
      // soporte para BroadcastChannel: mensaje en e.data
      if ((e && e.data && e.data.type === "updated") || (e && e.detail)) {
        fetchBookings();
      }
    };
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("bookings");
        bc.addEventListener("message", onMsg as EventListener);
      }
    } catch (err) {
      // ignore
    }
    window.addEventListener("bookings-updated", onMsg as EventListener);

    return () => {
      clearInterval(interval);
      if (bc) {
        try { bc.close(); } catch (e) { }
      }
      window.removeEventListener("bookings-updated", onMsg as EventListener);
    };
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    const applyFilters = () => {
      let filtered = bookings.filter((booking) => {
        // Filtro de fecha
        // Comparar strings YYYY-MM-DD directamente para evitar problemas de zona horaria
        const formattedSelectedDate = formatDateToLocalISO(selectedDate);
        const isDateMatch = booking.date === formattedSelectedDate;

        if (!isDateMatch) return false;

        // Filtro de búsqueda
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          booking.clientName.toLowerCase().includes(searchLower) ||
          booking.clientPhone.includes(searchLower) ||
          booking.clientEmail.toLowerCase().includes(searchLower) ||
          booking.staff.name.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;

        // Filtro de estado: por defecto sólo pendientes/confirmadas, o el valor elegido
        const matchesStatus =
          statusFilter === "all"
            ? ACTIVE_STATUSES.includes(booking.status)
            : booking.status === statusFilter;
        if (!matchesStatus) return false;

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

    applyFilters();
  }, [bookings, searchTerm, statusFilter, staffFilter, selectedDate]);

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

  const createLocalDate = (dateStr: string) => {
    const [y, m, d] = (dateStr || "").split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = createLocalDate(dateStr);
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${d.getDate()} / ${months[d.getMonth()]}/${d.getFullYear()}`;
  };

  const formatDisplayTime = (timeStr: string) => {
    if (!timeStr) return "";
    return formatTime(timeStr);
  };

  // Contar reservas por día
  const tileContent = ({ date }: { date: Date }) => {
    const formattedDate = formatDateToLocalISO(date);
    const count = bookings.filter(
      (b) => b.date === formattedDate && ACTIVE_STATUSES.includes(b.status)
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

  // Renderizar siempre el contenido, pero con loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-gray-500">Cargando reservas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendario y Reservas lado a lado */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendario */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 lg:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Calendario</h3>
            <Calendar
              locale="es-ES"
              showNeighboringMonth
              formatMonthYear={(_, date) =>
                date.toLocaleDateString("es-ES", { month: "long", year: "numeric" })
              }
              formatShortWeekday={(_, date) =>
                date.toLocaleDateString("es-ES", { weekday: "short" })
              }
              formatDay={(_, date) => date.getDate().toString()}
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

        {/* Reservas del día */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 h-full flex flex-col">
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
            <div className="space-y-3 max-h-[32rem] overflow-y-auto flex-1">
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
                          {formatDisplayDate(booking.date)} · {formatDisplayTime(booking.startTime)}
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
