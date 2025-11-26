"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";

// Mock data
const mockBookings = [
  {
    id: "1",
    cliente: { nombre: "María González", telefono: "(786) 555-0101", email: "maria@email.com" },
    servicios: ["Corte + Color", "Tratamiento Keratina"],
    estilista: "Ana Rodríguez",
    fecha: "2025-11-25",
    hora: "10:00",
    duracion: 150,
    total: 165,
    estado: "confirmada",
    notas: "Cliente regular, prefiere café",
  },
  {
    id: "2",
    cliente: { nombre: "Laura Martínez", telefono: "(786) 555-0102", email: "laura@email.com" },
    servicios: ["Makeup de Novia"],
    estilista: "María García",
    fecha: "2025-11-25",
    hora: "14:00",
    duracion: 120,
    total: 180,
    estado: "pendiente",
    notas: "Prueba de maquillaje para boda del 15 de diciembre",
  },
  {
    id: "3",
    cliente: { nombre: "Carmen Ruiz", telefono: "(786) 555-0103", email: "carmen@email.com" },
    servicios: ["Manicure Gel", "Pedicure Spa"],
    estilista: "Sofia Martínez",
    fecha: "2025-11-25",
    hora: "11:30",
    duracion: 105,
    total: 105,
    estado: "completada",
    notas: "",
  },
  {
    id: "4",
    cliente: { nombre: "Isabel Torres", telefono: "(786) 555-0104", email: "isabel@email.com" },
    servicios: ["Balayage Signature"],
    estilista: "Ana Rodríguez",
    fecha: "2025-11-26",
    hora: "09:00",
    duracion: 180,
    total: 220,
    estado: "confirmada",
    notas: "Primera vez con balayage",
  },
  {
    id: "5",
    cliente: { nombre: "Andrea López", telefono: "(786) 555-0105", email: "andrea@email.com" },
    servicios: ["Extensiones de Pestañas"],
    estilista: "María García",
    fecha: "2025-11-26",
    hora: "15:00",
    duracion: 90,
    total: 150,
    estado: "cancelada",
    notas: "Canceló por enfermedad",
  },
];

export default function AdminReservasPage() {
  const [bookings, setBookings] = useState(mockBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.cliente.telefono.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || booking.estado === statusFilter;
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && booking.fecha === "2025-11-25") ||
      (dateFilter === "tomorrow" && booking.fecha === "2025-11-26");
    return matchesSearch && matchesStatus && matchesDate;
  });

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
        return <Badge>{estado}</Badge>;
    }
  };

  const updateStatus = (id: string, newStatus: string) => {
    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, estado: newStatus } : b))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-times text-3xl font-bold text-gray-900 mb-2">
          Reservas
        </h1>
        <p className="text-gray-600">Gestiona las reservas del salón</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Buscar por nombre o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Fecha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fechas</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="tomorrow">Mañana</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="grid gap-4">
        {filteredBookings.map((booking) => (
          <Card
            key={booking.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedBooking(booking)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {booking.cliente.nombre}
                    </h3>
                    {getStatusBadge(booking.estado)}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {booking.fecha} a las {booking.hora}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone size={14} />
                      {booking.cliente.telefono}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye size={16} className="mr-2" />
                  Ver Detalle
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Servicios:
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.servicios.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Estilista:
                  </p>
                  <p className="text-sm text-gray-600">{booking.estilista}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Duración:
                  </p>
                  <p className="text-sm text-gray-600">{booking.duracion} min</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Total:
                  </p>
                  <p className="text-sm font-bold text-copper-red">
                    ${booking.total}
                  </p>
                </div>
              </div>

              {booking.notas && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Notas:
                  </p>
                  <p className="text-sm text-gray-600">{booking.notas}</p>
                </div>
              )}

              {booking.estado === "pendiente" && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(booking.id, "confirmada");
                    }}
                  >
                    <CheckCircle2 size={16} className="mr-1" />
                    Confirmar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(booking.id, "cancelada");
                    }}
                  >
                    <XCircle size={16} className="mr-1" />
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No se encontraron reservas</p>
          </CardContent>
        </Card>
      )}

      {/* Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-times text-2xl font-bold">
                  Detalle de Reserva
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBooking(null)}
                >
                  Cerrar
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cliente</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="font-medium">{selectedBooking.cliente.nombre}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} />
                      {selectedBooking.cliente.telefono}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} />
                      {selectedBooking.cliente.email}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Información de la Cita
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">Fecha:</span>{" "}
                      {selectedBooking.fecha}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Hora:</span>{" "}
                      {selectedBooking.hora}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Duración:</span>{" "}
                      {selectedBooking.duracion} minutos
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Estilista:</span>{" "}
                      {selectedBooking.estilista}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Servicios</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-1">
                      {selectedBooking.servicios.map((servicio: string, i: number) => (
                        <li key={i} className="text-sm">
                          • {servicio}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="font-bold text-lg">
                        Total: ${selectedBooking.total}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedBooking.notas && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Notas</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm">{selectedBooking.notas}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Estado</h3>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(selectedBooking.estado)}
                    {selectedBooking.estado === "pendiente" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-600"
                          onClick={() => {
                            updateStatus(selectedBooking.id, "confirmada");
                            setSelectedBooking(null);
                          }}
                        >
                          Confirmar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600"
                          onClick={() => {
                            updateStatus(selectedBooking.id, "cancelada");
                            setSelectedBooking(null);
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
