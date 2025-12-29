"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Tag, Sparkles, Loader } from "lucide-react";

interface Promotion {
  id: string;
  name: string;
  description?: string;
  discount: number;
  type: "percentage" | "fixed";
  start_date: string;
  end_date: string;
  active: boolean;
}

export default function AdminPromocionesPage() {
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount: "",
    type: "percentage",
    start_date: "",
    end_date: "",
  });

  // Cargar promociones
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch("/api/promotions");
        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (response.ok) {
          const data = await response.json();
          setPromotions(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [router]);

  const handleEdit = (promo: Promotion) => {
    setEditingPromotion(promo);
    setFormData({
      name: promo.name,
      description: promo.description || "",
      discount: promo.discount.toString(),
      type: promo.type,
      start_date: promo.start_date,
      end_date: promo.end_date,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta promoción?")) {
      try {
        const response = await fetch(`/api/promotions/${id}`, {
          method: "DELETE",
        });
        
        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }

        if (response.ok) {
          setPromotions(promotions.filter((p) => p.id !== id));
        }
      } catch (error) {
        console.error("Error deleting promotion:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        discount: parseFloat(formData.discount),
        type: formData.type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        active: true,
      };

      if (editingPromotion) {
        const response = await fetch(`/api/promotions/${editingPromotion.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }

        if (response.ok) {
          const updated = await response.json();
          setPromotions(
            promotions.map((p) => (p.id === updated.id ? updated : p))
          );
        }
      } else {
        const response = await fetch("/api/promotions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }

        if (response.ok) {
          const newPromo = await response.json();
          setPromotions([newPromo, ...promotions]);
        }
      }

      resetForm();
    } catch (error) {
      console.error("Error saving promotion:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      discount: "",
      type: "percentage",
      start_date: "",
      end_date: "",
    });
    setEditingPromotion(null);
    setShowForm(false);
  };

  const toggleActive = async (promo: Promotion) => {
    try {
      const response = await fetch(`/api/promotions/${promo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !promo.active }),
      });

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (response.ok) {
        const updated = await response.json();
        setPromotions(
          promotions.map((p) => (p.id === updated.id ? updated : p))
        );
      }
    } catch (error) {
      console.error("Error updating promotion:", error);
    }
  };

  const isActive = (promo: Promotion) => {
    if (!promo.active) return false;
    const now = new Date().toISOString().split("T")[0];
    return now >= promo.start_date && now <= promo.end_date;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader className="animate-spin mr-2" /> Cargando promociones...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-times text-3xl font-bold text-gray-900 mb-2">
            Promociones
          </h1>
          <p className="text-gray-600">Gestiona las promociones del salón</p>
        </div>
        <Button className="bg-[#d63d7a] hover:bg-[#c02d6a] text-white" onClick={() => setShowForm(true)}>
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
                <Label htmlFor="name">Título de la Promoción *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ej: Black Friday"
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe la promoción..."
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount">Descuento *</Label>
                  <Input
                    id="discount"
                    type="number"
                    step="0.01"
                    required
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: e.target.value })
                    }
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo de Descuento *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Cantidad Fija ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Fecha de Inicio *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">Fecha de Fin *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#d63d7a] hover:bg-[#c02d6a] text-white"
                >
                  {submitting ? "Guardando..." : editingPromotion ? "Actualizar" : "Crear"} Promoción
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
                !promo.active ? "opacity-60" : ""
              } ${active ? "border-2 border-[#d63d7a]" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-[#d63d7a]/10 p-2 rounded-lg">
                        {active ? (
                          <Sparkles className="text-[#d63d7a]" size={24} />
                        ) : (
                          <Tag className="text-[#d63d7a]" size={24} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {promo.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {active && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              Activa Ahora
                            </Badge>
                          )}
                          {!active && promo.active && (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                              Programada
                            </Badge>
                          )}
                          {!promo.active && (
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                              Inactiva
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{promo.description}</p>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 mb-1">Descuento</p>
                        <p className="text-lg font-bold text-[#d63d7a]">
                          {promo.type === "fixed"
                            ? `$${promo.discount}`
                            : `${promo.discount}%`}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 mb-1">Inicio</p>
                        <p className="text-sm font-semibold">{promo.start_date}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 mb-1">Fin</p>
                        <p className="text-sm font-semibold">{promo.end_date}</p>
                      </div>
                    </div>
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
                      promo.active
                        ? "text-orange-600 border-orange-600 hover:bg-orange-50"
                        : "text-green-600 border-green-600 hover:bg-green-50"
                    }
                    onClick={() => toggleActive(promo)}
                  >
                    {promo.active ? "Desactivar" : "Activar"}
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

      {promotions.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">No hay promociones creadas</p>
            <Button
              className="bg-[#d63d7a] hover:bg-[#c02d6a] text-white"
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-2" size={18} />
              Crear Primera Promoción
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
