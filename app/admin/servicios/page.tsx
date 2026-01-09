"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Edit, Trash2, Search, DollarSign, Clock, Loader2, FolderPlus } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  description?: string;
  order?: number;
  display_order?: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category_id: string;
  active: boolean;
  category?: Category;
}

export default function AdminServiciosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form states
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [serviceFormData, setServiceFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
    categoriaId: "",
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catsRes, servsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/services"),
      ]);

      if (catsRes.ok) {
        const catsData = await catsRes.json();
        setCategories(catsData);
      }

      if (servsRes.ok) {
        const servsData = await servsRes.json();
        setServices(servsData.services || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceFormData({
      nombre: service.name,
      descripcion: service.description || "",
      precio: service.price.toString(),
      duracion: service.duration_minutes.toString(),
      categoriaId: service.category_id,
    });
    setShowServiceForm(true);
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este servicio?")) return;

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setServices(services.filter((s) => s.id !== id));
      } else {
        alert("Error al eliminar el servicio");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingService 
        ? `/api/services/${editingService.id}` 
        : "/api/services";
      
      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...serviceFormData,
          activo: true
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (editingService) {
          setServices(services.map(s => s.id === editingService.id ? data.service : s));
        } else {
          setServices([...services, data.service]);
        }
        resetServiceForm();
      } else {
        const error = await res.json();
        alert(error.error || "Error al guardar servicio");
      }
    } catch (error) {
      console.error("Error submitting service:", error);
      alert("Error al guardar servicio");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const isEditing = Boolean(editingCategory);
      const url = isEditing ? `/api/categories/${editingCategory?.id}` : "/api/categories";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryFormData),
      });

      if (res.ok) {
        const savedCategory = await res.json();
        if (isEditing) {
          setCategories(categories.map((c) => (c.id === savedCategory.id ? savedCategory : c)));
        } else {
          setCategories([...categories, savedCategory]);
        }
        resetCategoryForm();
      } else {
        const error = await res.json();
        alert(error.error || "Error al guardar categoría");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error al guardar categoría");
    } finally {
      setSubmitting(false);
    }
  };

  const resetServiceForm = () => {
    setServiceFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      duracion: "",
      categoriaId: "",
    });
    setEditingService(null);
    setShowServiceForm(false);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({ name: "", description: "" });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría? Los servicios ligados a ella dejarán de mostrarse.")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Error al eliminar la categoría");
        return;
      }
      setCategories(categories.filter((c) => c.id !== id));
      setServices(services.filter((s) => s.category_id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("No se pudo eliminar la categoría");
    }
  };

  const openNewServiceModal = (categoryId?: string) => {
    setServiceFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      duracion: "",
      categoriaId: categoryId || (categories[0]?.id || ""),
    });
    setEditingService(null);
    setShowServiceForm(true);
  };

  // Group services by category
  const servicesByCategory = categories.map(cat => ({
    ...cat,
    services: services.filter(s => s.category_id === cat.id && 
      (searchTerm === "" || s.name.toLowerCase().includes(searchTerm.toLowerCase())))
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-pink-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-times text-3xl font-bold text-gray-900 mb-2">
            Servicios y Categorías
          </h1>
          <p className="text-gray-600">Gestiona el menú de servicios del salón</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setEditingCategory(null);
              setCategoryFormData({ name: "", description: "" });
              setShowCategoryForm(true);
            }}
          >
            <FolderPlus className="mr-2" size={18} />
            Nueva Categoría
          </Button>
          <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => openNewServiceModal()}>
            <Plus className="mr-2" size={18} />
            Nuevo Servicio
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
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
        </CardContent>
      </Card>

      {/* Categories List */}
      <div className="space-y-8">
        {servicesByCategory.map((category) => (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-2xl font-semibold text-gray-800">{category.name}</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-blue-600"
                  onClick={() => {
                    setEditingCategory(category);
                    setCategoryFormData({
                      name: category.name,
                      description: category.description || "",
                    });
                    setShowCategoryForm(true);
                  }}
                >
                  <Edit size={16} className="mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-red-600"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash2 size={16} className="mr-1" />
                  Eliminar
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                  onClick={() => openNewServiceModal(category.id)}
                >
                  <Plus size={16} className="mr-1" />
                  Agregar a {category.name}
                </Button>
              </div>
            </div>

            {category.services.length === 0 ? (
              <p className="text-gray-500 italic py-4">No hay servicios en esta categoría.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.services.map((service) => (
                  <Card key={service.id} className="hover:shadow-md transition-shadow border-gray-200">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{service.name}</h3>
                        <Badge className="text-gray-500 border-gray-300">
                          {service.duration_minutes} min
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xl font-bold text-pink-600">
                          ${service.price}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-blue-600"
                            onClick={() => handleEditService(service)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}

        {categories.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <FolderPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No hay categorías</h3>
            <p className="text-gray-500 mb-4">Comienza creando una categoría para tus servicios.</p>
            <Button onClick={() => setShowCategoryForm(true)}>
              Crear Primera Categoría
            </Button>
          </div>
        )}
      </div>

      {/* Service Form Modal */}
      {showServiceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingService ? "Editar Servicio" : "Nuevo Servicio"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Servicio *</Label>
                  <Input
                    id="nombre"
                    required
                    value={serviceFormData.nombre}
                    onChange={(e) =>
                      setServiceFormData({ ...serviceFormData, nombre: e.target.value })
                    }
                  />
                </div>
                
                <div>
                  <Label htmlFor="categoria">Categoría *</Label>
                  <Select
                    value={serviceFormData.categoriaId}
                    onValueChange={(value) =>
                      setServiceFormData({ ...serviceFormData, categoriaId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={serviceFormData.descripcion}
                    onChange={(e) =>
                      setServiceFormData({ ...serviceFormData, descripcion: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="precio">Precio ($) *</Label>
                    <Input
                      id="precio"
                      type="number"
                      step="0.01"
                      required
                      value={serviceFormData.precio}
                      onChange={(e) =>
                        setServiceFormData({ ...serviceFormData, precio: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="duracion">Duración (min) *</Label>
                    <Input
                      id="duracion"
                      type="number"
                      required
                      value={serviceFormData.duracion}
                      onChange={(e) =>
                        setServiceFormData({ ...serviceFormData, duracion: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={resetServiceForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-pink-600 hover:bg-pink-700" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingService ? "Actualizar" : "Crear"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <Label htmlFor="catName">Nombre de la Categoría *</Label>
                  <Input
                    id="catName"
                    required
                    value={categoryFormData.name}
                    onChange={(e) =>
                      setCategoryFormData({ ...categoryFormData, name: e.target.value })
                    }
                    placeholder="Ej: Cortes de Cabello"
                  />
                </div>
                
                <div>
                  <Label htmlFor="catDesc">Descripción (Opcional)</Label>
                  <Textarea
                    id="catDesc"
                    value={categoryFormData.description}
                    onChange={(e) =>
                      setCategoryFormData({ ...categoryFormData, description: e.target.value })
                    }
                    placeholder="Breve descripción de la categoría"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={resetCategoryForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-pink-600 hover:bg-pink-700" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingCategory ? "Guardar" : "Crear Categoría"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
