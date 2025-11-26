"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, DollarSign, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

// Mock data
const mockServices = [
  {
    id: "1",
    nombre: "Corte + Estilo",
    descripcion: "Corte personalizado con estilo profesional",
    precio: 45,
    duracion: 45,
    categoria: "HairStyle",
    activo: true,
  },
  {
    id: "2",
    nombre: "Color Completo",
    descripcion: "Coloración completa del cabello",
    precio: 120,
    duracion: 120,
    categoria: "HairStyle",
    activo: true,
  },
  {
    id: "3",
    nombre: "Balayage Signature",
    descripcion: "Técnica de coloración balayage premium",
    precio: 220,
    duracion: 180,
    categoria: "HairStyle",
    activo: true,
  },
  {
    id: "5",
    nombre: "Makeup Social",
    descripcion: "Maquillaje para eventos sociales",
    precio: 85,
    duracion: 60,
    categoria: "Makeup",
    activo: true,
  },
  {
    id: "6",
    nombre: "Makeup de Novia",
    descripcion: "Maquillaje nupcial con prueba previa",
    precio: 180,
    duracion: 120,
    categoria: "Makeup",
    activo: true,
  },
];

const categories = [
  "HairStyle",
  "Makeup",
  "Nail Services",
  "Skincare",
  "Wax",
  "Lashes & Eyebrows",
];

export default function AdminServiciosPage() {
  const [services, setServices] = useState(mockServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
    categoria: "",
  });

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      nombre: service.nombre,
      descripcion: service.descripcion,
      precio: service.precio.toString(),
      duracion: service.duracion.toString(),
      categoria: service.categoria,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este servicio?")) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se enviaría al backend
    if (editingService) {
      setServices(
        services.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                ...formData,
                precio: parseFloat(formData.precio),
                duracion: parseInt(formData.duracion),
              }
            : s
        )
      );
    } else {
      const newService = {
        id: Date.now().toString(),
        ...formData,
        precio: parseFloat(formData.precio),
        duracion: parseInt(formData.duracion),
        activo: true,
      };
      setServices([...services, newService]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      duracion: "",
      categoria: "",
    });
    setEditingService(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-times text-3xl font-bold text-gray-900 mb-2">
            Servicios
          </h1>
          <p className="text-gray-600">Gestiona los servicios del salón</p>
        </div>
        <Button variant="copper" onClick={() => setShowForm(true)}>
          <Plus className="mr-2" size={18} />
          Nuevo Servicio
        </Button>
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
                  placeholder="Buscar servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">
              {editingService ? "Editar Servicio" : "Nuevo Servicio"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Servicio *</Label>
                  <Input
                    id="nombre"
                    required
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Ej: Corte + Estilo"
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoría *</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoria: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  placeholder="Describe el servicio..."
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="precio">Precio ($) *</Label>
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    required
                    value={formData.precio}
                    onChange={(e) =>
                      setFormData({ ...formData, precio: e.target.value })
                    }
                    placeholder="45.00"
                  />
                </div>
                <div>
                  <Label htmlFor="duracion">Duración (minutos) *</Label>
                  <Input
                    id="duracion"
                    type="number"
                    required
                    value={formData.duracion}
                    onChange={(e) =>
                      setFormData({ ...formData, duracion: e.target.value })
                    }
                    placeholder="45"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" variant="copper">
                  {editingService ? "Actualizar" : "Crear"} Servicio
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Services List */}
      <div className="grid gap-4">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {service.nombre}
                    </h3>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                      {service.categoria}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{service.descripcion}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-copper-red font-semibold">
                      <DollarSign size={16} />
                      {formatPrice(service.precio)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      {service.duracion} min
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No se encontraron servicios</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
