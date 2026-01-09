"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Phone,
  Calendar,
  Loader2,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export default function AdminClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [togglingCustomerId, setTogglingCustomerId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: "",
    active: true,
  });

  // Cargar clientes
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      console.log("[Admin] Cargando clientes...");
      
      const response = await fetch("/api/customers");
      const data = await response.json();
      
      console.log("[Admin] Respuesta de /api/customers:", { status: response.status, data });
      
      // Las nuevas APIs devuelven un array directamente
      setCustomers(Array.isArray(data) ? data : []);
      console.log("[Admin] Clientes cargados:", Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error("[Admin] Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  const handleEditCustomer = (customer: Customer) => {
    setFormData({
      name: customer.name,
      phone: customer.phone,
      notes: customer.notes || "",
      active: customer.active,
    });
    setEditingCustomer(customer);
    setShowForm(true);
    setSelectedCustomer(null);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      alert("Por favor completa nombre y teléfono");
      return;
    }

    // Check for duplicate phone if creating new customer
    if (!editingCustomer) {
      const existing = customers.find(c => c.phone === formData.phone);
      if (existing) {
        alert(`El cliente ya existe: ${existing.name} (${existing.phone})`);
        return;
      }
    }

    try {
      const url = editingCustomer
        ? `/api/customers/${editingCustomer.id}`
        : "/api/customers";
      const method = editingCustomer ? "PATCH" : "POST";

      console.log("[Admin] Guardando cliente:", { method, url, formData });

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      console.log("[Admin] Respuesta del servidor:", { status: response.status, data: responseData });

      if (response.ok) {
        alert(editingCustomer ? "Cliente actualizado" : "Cliente creado");
        setShowForm(false);
        setEditingCustomer(null);
        setFormData({
          name: "",
          phone: "",
          notes: "",
          active: true,
        });
        fetchCustomers();
      } else {
        const errorMsg = responseData?.error || "Error desconocido";
        const errorDetails = responseData?.details || "";
        alert(`Error: ${errorMsg}${errorDetails ? " - " + errorDetails : ""}`);
      }
    } catch (error) {
      console.error("[Admin] Error saving customer:", error);
      alert(`Error al guardar cliente: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este cliente?")) return;

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Cliente eliminado");
        setSelectedCustomer(null);
        fetchCustomers();
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Error al eliminar cliente");
    }
  };

  const handleToggleActive = async (customer: Customer) => {
    if (!customer) return;
    setTogglingCustomerId(customer.id);
    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customer.name,
          phone: customer.phone,
          notes: customer.notes || "",
          active: !customer.active,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === customer.id ? { ...c, ...data } : c))
        );
        setSelectedCustomer((prev) =>
          prev && prev.id === customer.id ? { ...prev, ...data } : prev
        );
        alert(!customer.active ? "Cliente reactivado" : "Cliente desactivado");
      } else {
        const msg = data?.error || "No se pudo actualizar el estado del cliente";
        alert(msg);
      }
    } catch (error) {
      console.error("Error toggling customer state:", error);
      alert("Error al actualizar estado del cliente");
    } finally {
      setTogglingCustomerId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin mr-2" />
        <span>Cargando clientes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-1">Gestiona tu base de datos de clientes</p>
        </div>
        <Button
          onClick={() => {
            setEditingCustomer(null);
            setFormData({
              name: "",
              phone: "",
              notes: "",
              active: true,
            });
            setShowForm(true);
          }}
          className="bg-copper-red hover:bg-red-700"
        >
          <Plus size={18} className="mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Clientes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Búsqueda de Clientes</CardTitle>
              <div className="flex mt-4 gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    placeholder="Buscar por nombre o teléfono..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCustomers.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No se encontraron clientes
                  </p>
                ) : (
                  filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCustomer?.id === customer.id
                          ? "border-copper-red bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {customer.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                            <Phone size={14} />
                            {customer.phone}
                          </div>
                          {customer.notes && (
                            <p className="text-xs text-gray-500 mt-2 italic">
                              {customer.notes}
                            </p>
                          )}
                        </div>
                        <Badge className={customer.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}>
                          {customer.active ? "Activo" : "Desactivado"}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalles y Formulario */}
        <div className="space-y-4">
          {showForm ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingCustomer ? "Editar Cliente" : "Nuevo Cliente"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveCustomer} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1-305-555-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas
                    </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Notas adicionales del cliente..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    rows={3}
                  />
                </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="active"
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="active" className="text-sm text-gray-700">
                      Cliente activo
                    </label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-copper-red hover:bg-red-700"
                    >
                      {editingCustomer ? "Actualizar" : "Crear"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : selectedCustomer ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{selectedCustomer.name}</CardTitle>
                  <Badge className={selectedCustomer.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}>
                    {selectedCustomer.active ? "Activo" : "Desactivado"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className={selectedCustomer.active ? "border-red-300 text-red-700" : "border-green-300 text-green-700"}
                    onClick={() => handleToggleActive(selectedCustomer)}
                    disabled={togglingCustomerId === selectedCustomer.id}
                  >
                    {selectedCustomer.active ? "Desactivar" : "Reactivar"}
                  </Button>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-semibold">{selectedCustomer.phone}</p>
                </div>

                {selectedCustomer.notes && (
                  <div>
                    <p className="text-sm text-gray-600">Notas</p>
                    <p className="text-sm italic">{selectedCustomer.notes}</p>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <Button
                    onClick={() => {
                      window.location.href = `/admin/reservas?customerId=${selectedCustomer.id}`;
                    }}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!selectedCustomer.active}
                  >
                    <Calendar size={18} className="mr-2" />
                    Crear Reserva
                  </Button>
                  {!selectedCustomer.active && (
                    <p className="text-xs text-red-600">
                      Reactiva al cliente para poder crear nuevas reservas.
                    </p>
                  )}
                  <Button
                    onClick={() => handleEditCustomer(selectedCustomer)}
                    variant="outline"
                    className="w-full"
                  >
                    <Edit size={18} className="mr-2" />
                    Editar
                  </Button>
                  <Button
                    onClick={() =>
                      handleDeleteCustomer(selectedCustomer.id)
                    }
                    variant="outline"
                    className="w-full text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={18} className="mr-2" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
