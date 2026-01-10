"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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
  Loader2,
  Trash2,
  Edit,
  Plus,
  ChevronDown,
  Check,
} from "lucide-react";

interface Booking {
  id: string;
  customerId?: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  staffId: string;
  staff: {
    id: string;
    name: string;
  };
  services: Array<{
    id?: string;
    service: {
      id: string;
      name: string;
      price: number;
    };
  }>;
}

interface Staff {
  id: string;
  name: string;
  nombre?: string; // Add optional nombre to handle API response
}

interface Service {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  category_id?: string; // Add optional category_id
  category?: Category;
}

interface Category {
  id: string;
  name: string;
  services?: Service[];
}

const TimeSelect = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  // value is "HH:mm"
  const [hours, minutes] = value ? value.split(':').map(Number) : [9, 0];

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes;

  const handleChange = (type: 'h' | 'm' | 'p', val: string) => {
    let newH = hours;
    let newM = minutes;

    if (type === 'h') {
      const h = parseInt(val);
      if (period === 'PM') {
        newH = h === 12 ? 12 : h + 12;
      } else {
        newH = h === 12 ? 0 : h;
      }
    } else if (type === 'm') {
      newM = parseInt(val);
    } else if (type === 'p') {
      if (val === 'AM' && hours >= 12) newH -= 12;
      if (val === 'PM' && hours < 12) newH += 12;
    }

    const strH = newH.toString().padStart(2, '0');
    const strM = newM.toString().padStart(2, '0');
    onChange(`${strH}:${strM}`);
  };

  return (
    <div className="flex gap-1 items-center">
      <select
        value={displayHours}
        onChange={(e) => handleChange('h', e.target.value)}
        className="border rounded p-1 text-sm bg-white h-10"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <span>:</span>
      <select
        value={displayMinutes}
        onChange={(e) => handleChange('m', e.target.value)}
        className="border rounded p-1 text-sm bg-white h-10"
      >
        {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
          <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
        ))}
      </select>
      <select
        value={period}
        onChange={(e) => handleChange('p', e.target.value)}
        className="border rounded p-1 text-sm bg-white h-10"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export default function AdminReservasPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin text-gray-500" />
        </div>
      }
    >
      <AdminReservasContent />
    </Suspense>
  );
}

function AdminReservasContent() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Customer check states
  const [customerStatus, setCustomerStatus] = useState<{ exists: boolean; customer?: any } | null>(null);
  const [checkingCustomer, setCheckingCustomer] = useState(false);
  const [savingCustomer, setSavingCustomer] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    date: "",
    startTime: "",
    staffId: "",
    serviceIds: [] as string[],
    notes: "",
    customerId: "",
  });

  const normalizeTime = (time?: string | null) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    return `${(h || "00").padStart(2, "0")}:${(m || "00").padStart(2, "0")}`;
  };

  const formatTime12Hour = (time24: string) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  // Check customer when selectedBooking changes
  useEffect(() => {
    if (selectedBooking) {
      checkCustomer(selectedBooking.clientPhone);
    } else {
      setCustomerStatus(null);
    }
  }, [selectedBooking]);

  const checkCustomer = async (phone: string) => {
    setCheckingCustomer(true);
    try {
      const res = await fetch(`/api/customers/by-phone?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (data) {
        setCustomerStatus({ exists: true, customer: data });
      } else {
        setCustomerStatus({ exists: false });
      }
    } catch (error) {
      console.error("Error checking customer:", error);
    } finally {
      setCheckingCustomer(false);
    }
  };

  const saveCustomer = async () => {
    if (!selectedBooking) return;
    setSavingCustomer(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedBooking.clientName,
          phone: selectedBooking.clientPhone,
          notes: `Cliente creado desde reserva`,
        }),
      });

      if (res.ok) {
        const newCustomer = await res.json();
        setCustomerStatus({ exists: true, customer: newCustomer });
        // Optional: Show a toast or alert
      } else {
        const error = await res.json();
        console.error("Error saving customer:", error);
        alert(`Error: ${error.error || "No se pudo guardar el cliente"}`);
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Error al guardar cliente");
    } finally {
      setSavingCustomer(false);
    }
  };


  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookings");
      const data = (await response.json()) as { bookings: Booking[] };

      if (response.ok) {
        const normalized = (data.bookings || []).map((b) => ({
          ...b,
          startTime: normalizeTime(b.startTime),
          endTime: normalizeTime(b.endTime),
        }));
        setBookings(normalized);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setBookings]);

  const fetchStaffAndServices = useCallback(async () => {
    try {
      const [staffRes, categoriesRes, servicesRes] = await Promise.all([
        fetch("/api/staff"),
        fetch("/api/categories"),
        fetch("/api/services"),
      ]);

      if (staffRes.ok) {
        const staffData = await staffRes.json();
        const staffList = Array.isArray(staffData) ? staffData : staffData.staff || [];
        // Map nombre to name if needed
        setStaff(staffList.map((s: any) => ({
          ...s,
          name: s.name || s.nombre || "Sin nombre"
        })));
      }

      let cats: Category[] = [];
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        cats = Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || [];
      }

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        const servicesList = servicesData.services || [];

        // Nest services into categories
        cats = cats.map((cat) => ({
          ...cat,
          services: servicesList.filter((s: any) =>
            (s.category?.id === cat.id) ||
            (s.categoryId === cat.id) ||
            (s.category_id === cat.id) ||
            (s.categoryId === cat.id.toString()) // Handle string/number mismatch
          )
        }));
      }

      setCategories(cats);

      // Expandir primera categoría
      if (cats.length > 0) {
        setExpandedCategories({ [cats[0].id]: true });
      }
    } catch (error) {
      console.error("Error fetching staff and categories:", error);
    }
  }, [setStaff, setCategories, setExpandedCategories]);

  // Cargar reservas y datos iniciales
  useEffect(() => {
    fetchBookings();
    fetchStaffAndServices();
  }, [fetchBookings, fetchStaffAndServices]);

  const prefillCustomer = async (customerId: string) => {
    try {
      const res = await fetch(`/api/customers/${customerId}`);
      if (!res.ok) return;
      const customer = await res.json();
      setFormData((prev) => ({
        ...prev,
        customerId,
        clientName: customer.name || "",
        clientPhone: customer.phone || "",
        clientEmail: customer.email || "",
        notes: customer.notes || "",
      }));
      setSelectedBooking(null);
      setEditingBooking(null);
      setShowCreateForm(true);
    } catch (error) {
      console.error("Error prefilling customer:", error);
    }
  };

  useEffect(() => {
    const customerIdParam = searchParams?.get("customerId");
    if (customerIdParam) {
      prefillCustomer(customerIdParam);
    }
  }, [searchParams]);

  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch =
        booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.clientPhone.includes(searchTerm);
      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;
      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today" && new Date(booking.date).toDateString() === new Date().toDateString()) ||
        (dateFilter === "tomorrow" && new Date(booking.date).toDateString() === new Date(new Date().setDate(new Date().getDate() + 1)).toDateString()) ||
        (dateFilter === "pending" && booking.status === "pending");
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      // Pending bookings first
      if (a.status === b.status) {
        // same status -> sort by date then startTime
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return a.startTime.localeCompare(b.startTime);
      }
      if (a.status === "pending") return -1;
      if (b.status === "pending") return 1;
      // otherwise keep original relative order (confirmed/completed/cancelled)
      return 0;
    });

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
        return <Badge>{estado}</Badge>;
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      // try to parse JSON body, fallback to raw text for better error messages
      let payload: any = {};
      let rawText: string | null = null;
      try {
        payload = await response.json();
      } catch (e) {
        try {
          rawText = await response.text();
        } catch (e2) {
          rawText = null;
        }
        payload = rawText ? { raw: rawText } : {};
      }

      if (response.ok) {
        // API returns updated booking in payload.booking
        const updated = payload.booking || { id, status: newStatus };
        setBookings(
          bookings.map((b) => (b.id === id ? { ...b, status: updated.status as any } : b))
        );
        if (selectedBooking?.id === id) {
          setSelectedBooking({ ...selectedBooking, status: updated.status as any });
        }

        // Notify other admin components (dashboard, calendar, alerts) to refresh immediately
        try {
          if (typeof window !== "undefined") {
            try {
              const bc = new BroadcastChannel("bookings");
              bc.postMessage({ type: "updated", id, status: updated.status });
              bc.close();
            } catch (e) {
              // Ignore if BroadcastChannel not available
            }
            window.dispatchEvent(new CustomEvent("bookings-updated", { detail: { id, status: updated.status } }));
          }
        } catch (e) {
          console.warn("Could not broadcast booking update", e);
        }
      } else {
        // Show API-provided error message when available; include raw text or statusText if present
        const errMsg = payload?.error || payload?.message || payload?.details || payload?.raw || response.statusText || `Error al actualizar estado (status ${response.status})`;
        if (response.status === 401) {
          alert(errMsg + " Por favor inicia sesión como administrador.");
        } else {
          alert(errMsg);
        }
        // Avoid passing null into console.error because some console interceptors
        // assume arguments have a stack property and choke on null/undefined.
        const logRawText = rawText ?? "[no raw response body]";
        console.error("Update status error:", response.status, payload, logRawText);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Error de conexión al servidor. Intenta de nuevo.");
    } finally {
      setUpdating(false);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta reserva?")) return;

    try {
      setUpdating(true);
      const response = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        setBookings(bookings.filter((b) => b.id !== id));
        setSelectedBooking(null);
        // notify other components
        try {
          if (typeof window !== "undefined") {
            try {
              const bc = new BroadcastChannel("bookings");
              bc.postMessage({ type: "deleted", id });
              bc.close();
            } catch (e) { }
            window.dispatchEvent(new CustomEvent("bookings-updated", { detail: { id, action: "deleted" } }));
          }
        } catch (e) { }
        alert("Reserva eliminada exitosamente");
      } else {
        const errMsg = payload?.error || payload?.message || "Error al eliminar la reserva";
        if (response.status === 401) {
          alert("No autorizado. Por favor inicia sesión como administrador.");
        } else {
          alert(errMsg);
        }
        console.error("Delete booking error:", response.status, payload);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Error de conexión al servidor. Intenta de nuevo.");
    } finally {
      setUpdating(false);
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setFormData({
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      clientEmail: booking.clientEmail || "",
      date: booking.date,
      startTime: booking.startTime,
      staffId: booking.staffId ? String(booking.staffId) : "",
      serviceIds: booking.services.map((s) => String(s.service.id)),
      notes: booking.notes || "",
      customerId: booking.customerId || "",
    });
    setEditingBooking(booking);
    setShowCreateForm(true);
    setSelectedBooking(null);
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName || !formData.clientPhone || !formData.date || !formData.startTime || !formData.staffId || formData.serviceIds.length === 0) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setUpdating(true);
      const url = editingBooking
        ? `/api/bookings/${editingBooking.id}`
        : "/api/bookings";
      const method = editingBooking ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: formData.clientName,
          clientPhone: formData.clientPhone,
          clientEmail: formData.clientEmail || null,
          date: formData.date,
          startTime: formData.startTime,
          staffId: formData.staffId,
          serviceIds: formData.serviceIds,
          notes: formData.notes || null,
          customerId: formData.customerId || undefined,
          status: "confirmed", // Admin siempre crea como confirmado
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        alert(editingBooking ? "Reserva actualizada exitosamente" : "Reserva creada exitosamente (confirmada)");
        setShowCreateForm(false);
        setEditingBooking(null);
        setFormData({
          clientName: "",
          clientPhone: "",
          clientEmail: "",
          date: "",
          startTime: "",
          staffId: "",
          serviceIds: [],
          notes: "",
          customerId: "",
        });
        // Notify other components
        try {
          if (typeof window !== "undefined") {
            try {
              const bc = new BroadcastChannel("bookings");
              bc.postMessage({ type: editingBooking ? "updated" : "created", booking: payload.booking || null });
              bc.close();
            } catch (e) { }
            window.dispatchEvent(new CustomEvent("bookings-updated", { detail: { action: editingBooking ? "updated" : "created", booking: payload.booking || null } }));
          }
        } catch (e) { }
        fetchBookings();
      } else {
        const errMsg = payload?.error || payload?.message || "Error al guardar la reserva";
        if (response.status === 401) {
          alert("No autorizado. Por favor inicia sesión como administrador.");
        } else {
          alert(errMsg);
        }
        console.error("Error response:", response.status, payload);
      }
    } catch (error) {
      console.error("Error saving booking:", error);
      alert(`Error al guardar la reserva: ${String(error)}`);
    } finally {
      setUpdating(false);
    }
  };

  const toggleService = (serviceId: string) => {
    const idStr = String(serviceId);
    setFormData((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(idStr)
        ? prev.serviceIds.filter((id) => id !== idStr)
        : [...prev.serviceIds, idStr],
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Reservas</h1>
        <Button
          onClick={() => {
            setEditingBooking(null);
            setFormData({
              clientName: "",
              clientPhone: "",
              clientEmail: "",
              date: "",
              startTime: "",
              staffId: "",
              serviceIds: [],
              notes: "",
              customerId: "",
            });
            setShowCreateForm(true);
          }}
          className="bg-pink-600 hover:bg-pink-700"
        >
          <Plus size={20} className="mr-2" />
          Crear Reserva
        </Button>
      </div>

      {/* Formulario Crear/Editar */}
      {showCreateForm && (
        <Card className="bg-white border-pink-200">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingBooking ? "Editar Reserva" : "Nueva Reserva"}
            </h2>
            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Cliente *
                  </label>
                  <Input
                    placeholder="Nombre completo"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <Input
                    type="tel"
                    placeholder="Teléfono"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    required
                  />
                </div>

                {/* Email field removed as per user request */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estilista *
                  </label>
                  <Select value={formData.staffId} onValueChange={(value) => setFormData({ ...formData, staffId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona estilista" />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha *
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora *
                  </label>
                  <TimeSelect
                    value={formData.startTime}
                    onChange={(value) => setFormData({ ...formData, startTime: value })}
                  />
                </div>
              </div>

              {/* Servicios por Categorías */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servicios {formData.serviceIds.length > 0 && `(${formData.serviceIds.length} seleccionados)`} *
                </label>
                <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
                  {categories.length === 0 ? (
                    <p className="text-sm text-gray-500">Cargando categorías...</p>
                  ) : (
                    categories.map((category) => (
                      <div key={category.id} className="border rounded bg-white">
                        <button
                          type="button"
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition"
                        >
                          <span className="font-medium text-gray-700">{category.name}</span>
                          <ChevronDown
                            size={18}
                            className={`transition ${expandedCategories[category.id] ? "rotate-180" : ""
                              }`}
                          />
                        </button>

                        {expandedCategories[category.id] && category.services && (
                          <div className="border-t p-3 space-y-2 bg-gray-50">
                            {category.services.length === 0 ? (
                              <p className="text-sm text-gray-500">Sin servicios</p>
                            ) : (
                              category.services.map((service) => (
                                <label
                                  key={service.id}
                                  className="flex items-center space-x-3 p-2 rounded hover:bg-white cursor-pointer transition"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.serviceIds.includes(String(service.id))}
                                    onChange={() => toggleService(String(service.id))}
                                    className="w-4 h-4 cursor-pointer"
                                  />
                                  <span className="flex-1 text-sm">
                                    <span className="font-medium">{service.name}</span>
                                    <span className="text-gray-500 ml-2">${service.price}</span>
                                  </span>
                                  {formData.serviceIds.includes(service.id) && (
                                    <Check size={16} className="text-green-600" />
                                  )}
                                </label>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                {formData.serviceIds.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.serviceIds.length} servicio(s) seleccionado(s)
                  </p>
                )}
              </div>


              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas
                </label>
                <textarea
                  placeholder="Notas adicionales (opcional)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingBooking(null);
                  }}
                  disabled={updating}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    editingBooking ? "Actualizar" : "Crear"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card className="bg-white border-gray-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Nombre o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="confirmed">Confirmada</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="tomorrow">Mañana</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="text-sm font-medium text-gray-600">
                {filteredBookings.length} reservas
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 size={32} className="animate-spin text-pink-600" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="py-12 text-center">
            <Calendar size={32} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No hay reservas que coincidan con los filtros</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{booking.clientName}</h3>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2 text-pink-600" />
                    {booking.clientPhone}
                  </div>
                  {booking.clientEmail && (
                    <div className="flex items-center">
                      <Mail size={16} className="mr-2 text-pink-600" />
                      {booking.clientEmail}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-pink-600" />
                    {new Date(booking.date).toLocaleDateString("es-ES")} - {formatTime12Hour(booking.startTime)}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Servicios</p>
                  <div className="flex flex-wrap gap-1">
                    {booking.services.map((s, idx) => (
                      <Badge key={idx} className="bg-pink-100 text-pink-700 border-pink-200 text-xs">
                        {s.service.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Estilista:</span> {booking.staff.name}
                </p>

                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <Eye size={16} className="mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditBooking(booking)}
                  >
                    <Edit size={16} className="mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => deleteBooking(booking.id)}
                    disabled={updating}
                  >
                    <Trash2 size={16} className="mr-1" />
                    Borrar
                  </Button>
                </div>

                {booking.status === "pending" && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => updateStatus(booking.id, "confirmed")}
                      disabled={updating}
                    >
                      <CheckCircle2 size={14} className="mr-1" />
                      Confirmar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-red-600"
                      onClick={() => updateStatus(booking.id, "cancelled")}
                      disabled={updating}
                    >
                      <XCircle size={14} className="mr-1" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Detalle */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-2xl w-full max-h-96 overflow-y-auto">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Detalles de la Reserva</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-semibold text-gray-900">{selectedBooking.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-gray-900">{selectedBooking.clientPhone}</p>
                    {checkingCustomer ? (
                      <Loader2 size={14} className="animate-spin text-gray-400" />
                    ) : customerStatus?.exists ? (
                      <Badge className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 h-6">
                        <CheckCircle2 size={12} />
                        Registrado
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-pink-600 hover:text-pink-700 hover:bg-pink-50 text-xs"
                        onClick={saveCustomer}
                        disabled={savingCustomer}
                        title="Guardar cliente en base de datos"
                      >
                        {savingCustomer ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <>
                            <Plus size={12} className="mr-1" />
                            Guardar Cliente
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                {selectedBooking.clientEmail && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedBooking.clientEmail}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="text-gray-900">
                    {new Date(selectedBooking.date).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hora</p>
                  <p className="text-gray-900">
                    {formatTime12Hour(selectedBooking.startTime)} - {formatTime12Hour(selectedBooking.endTime)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estilista</p>
                  <p className="text-gray-900">{selectedBooking.staff.name}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Servicios</p>
                <div className="space-y-2">
                  {selectedBooking.services.map((s, idx) => (
                    <div key={idx} className="flex justify-between text-gray-900">
                      <span>{s.service.name}</span>
                      <span className="font-semibold">${s.service.price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-bold text-lg text-pink-600">
                    ${selectedBooking.services.reduce((sum, s) => sum + s.service.price, 0)}
                  </span>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500 mb-2">Notas</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedBooking(null)}
                >
                  Cerrar
                </Button>
                {selectedBooking.status === "pending" && (
                  <>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        updateStatus(selectedBooking.id, "confirmed");
                        setSelectedBooking(null);
                      }}
                      disabled={updating}
                    >
                      Confirmar
                    </Button>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        updateStatus(selectedBooking.id, "cancelled");
                        setSelectedBooking(null);
                      }}
                      disabled={updating}
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
