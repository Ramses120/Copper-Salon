"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Tag, Calendar, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";

// Mock data
const mockPromotions = [
  {
    id: "1",
    titulo: "Black Friday",
    descripcion: "30% de descuento en todos los servicios de color",
    descuento: 30,
    tipo: "porcentaje",
    fechaInicio: "2025-11-29",
    fechaFin: "2025-11-30",
    activa: true,
    servicios: ["Color Completo", "Balayage Signature", "Highlights"],
  },
  {
    id: "2",
    titulo: "Especial Novias",
    descripcion: "Paquete completo para novias con 20% off",
    descuento: 20,
    tipo: "porcentaje",
    fechaInicio: "2025-12-01",
    fechaFin: "2025-12-31",
    activa: true,
    servicios: ["Makeup de Novia", "Peinado Elegante", "Tratamiento Facial"],
  },
  {
    id: "3",
    titulo: "Promo Uñas",
    descripcion: "$15 de descuento en Manicure + Pedicure",
    descuento: 15,
    tipo: "fijo",
    fechaInicio: "2025-11-25",
    fechaFin: "2025-11-30",
    activa: false,
    servicios: ["Manicure Gel", "Pedicure Spa"],
  },
];

export default function AdminPromocionesPage() {
  const [promotions, setPromotions] = useState(mockPromotions);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<any>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    descuento: "",
    tipo: "porcentaje",
    fechaInicio: "",
    fechaFin: "",
  });

  const handleEdit = (promo: any) => {
    setEditingPromotion(promo);
    setFormData({
      titulo: promo.titulo,
      descripcion: promo.descripcion,
      descuento: promo.descuento.toString(),
      tipo: promo.tipo,
      fechaInicio: promo.fechaInicio,
      fechaFin: promo.fechaFin,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta promoción?")) {
      setPromotions(promotions.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPromotion) {
      setPromotions(
        promotions.map((p) =>
          p.id === editingPromotion.id
            ? {
                ...p,
                ...formData,
                descuento: parseFloat(formData.descuento),
              }
            : p
        )
      );
    } else {
      const newPromotion = {
        id: Date.now().toString(),
        ...formData,
        descuento: parseFloat(formData.descuento),
        activa: true,
        servicios: [],
      };
      setPromotions([...promotions, newPromotion]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      descuento: "",
      tipo: "porcentaje",
      fechaInicio: "",
      fechaFin: "",
    });
    setEditingPromotion(null);
    setShowForm(false);
  };

  const toggleActive = (id: string) => {
    setPromotions(
      promotions.map((p) => (p.id === id ? { ...p, activa: !p.activa } : p))
    );
  };

  const isActive = (promo: any) => {
    if (!promo.activa) return false;
    const now = new Date().toISOString().split("T")[0];
    return now >= promo.fechaInicio && now <= promo.fechaFin;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-times text-3xl font-bold text-gray-900 mb-2">
            Promociones
          </h1>
          <p className="text-gray-600">Gestiona las promociones del salón</p>
        </div>
        <Button variant="copper" onClick={() => setShowForm(true)}>
          <Plus className="mr-2" size={18} />
          Nueva Promoción
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">
              {editingPromotion ? "Editar Promoción" : "Nueva Promoción"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título de la Promoción *</Label>
                <Input
                  id="titulo"
                  required
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  placeholder="Ej: Black Friday"
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  placeholder="Describe la promoción..."
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="descuento">Descuento *</Label>
                  <Input
                    id="descuento"
                    type="number"
                    step="0.01"
                    required
                    value={formData.descuento}
                    onChange={(e) =>
                      setFormData({ ...formData, descuento: e.target.value })
                    }
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo de Descuento *</Label>
                  <select
                    id="tipo"
                    value={formData.tipo}
                    onChange={(e) =>
                      setFormData({ ...formData, tipo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="porcentaje">Porcentaje (%)</option>
                    <option value="fijo">Cantidad Fija ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    required
                    value={formData.fechaInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, fechaInicio: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="fechaFin">Fecha de Fin *</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    required
                    value={formData.fechaFin}
                    onChange={(e) =>
                      setFormData({ ...formData, fechaFin: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" variant="copper">
                  {editingPromotion ? "Actualizar" : "Crear"} Promoción
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Promotions Grid */}
      <div className="grid gap-6">
        {promotions.map((promo) => {
          const active = isActive(promo);
          return (
            <Card
              key={promo.id}
              className={`hover:shadow-lg transition-shadow ${
                !promo.activa ? "opacity-60" : ""
              } ${active ? "border-2 border-copper-red" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-copper-red/10 p-2 rounded-lg">
                        {active ? (
                          <Sparkles className="text-copper-red" size={24} />
                        ) : (
                          <Tag className="text-copper-red" size={24} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {promo.titulo}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {active && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              Activa Ahora
                            </Badge>
                          )}
                          {!active && promo.activa && (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                              Programada
                            </Badge>
                          )}
                          {!promo.activa && (
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                              Inactiva
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{promo.descripcion}</p>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 mb-1">Descuento</p>
                        <p className="text-lg font-bold text-copper-red">
                          {promo.tipo === "porcentaje"
                            ? `${promo.descuento}%`
                            : formatPrice(promo.descuento)}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 mb-1">Inicio</p>
                        <p className="text-sm font-semibold">
                          {promo.fechaInicio}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 mb-1">Fin</p>
                        <p className="text-sm font-semibold">{promo.fechaFin}</p>
                      </div>
                    </div>

                    {promo.servicios.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Servicios incluidos:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {promo.servicios.map((servicio, i) => (
                            <Badge
                              key={i}
                              className="bg-gray-100 text-gray-700 border-gray-200"
                            >
                              {servicio}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(promo)}
                  >
                    <Edit size={16} className="mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={
                      promo.activa
                        ? "text-orange-600 border-orange-600 hover:bg-orange-50"
                        : "text-green-600 border-green-600 hover:bg-green-50"
                    }
                    onClick={() => toggleActive(promo.id)}
                  >
                    {promo.activa ? "Desactivar" : "Activar"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(promo.id)}
                  >
                    <Trash2 size={16} className="mr-1" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {promotions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No hay promociones creadas</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
