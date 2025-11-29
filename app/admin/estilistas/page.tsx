"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";

const specialties = [
  "Colorista & Estilista",
  "Maquilladora Profesional",
  "Especialista en Uñas",
  "Esteticista",
  "Técnico en Extensiones",
  "Estilista General",
];

interface Staff {
  id: string;
  nombre: string;
  especialidades: string[];
  telefono: string;
  activo: boolean;
}

export default function AdminEstilistasPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    especialidades: [] as string[],
    telefono: "",
    activo: true,
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff');
      if (response.ok) {
        const data = await response.json();
        // Manejar tanto { staff: [...] } como [...]
        const staffList = Array.isArray(data) ? data : data.staff || [];
        setStaff(staffList);
      }
    } catch (error) {
      console.error('Error al cargar estilistas:', error);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Solo se aceptan imágenes');
        return;
      }
    }
  };

  const toggleEspecialidad = (especialidad: string) => {
    setFormData((prev) => ({
      ...prev,
      especialidades: prev.especialidades.includes(especialidad)
        ? prev.especialidades.filter((e) => e !== especialidad)
        : [...prev.especialidades, especialidad],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.especialidades.length === 0) {
        alert('Debes seleccionar al menos una especialidad');
        setLoading(false);
        return;
      }

      const url = editingId ? `/api/staff/${editingId}` : '/api/staff';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar estilista');
      }

      await fetchStaff();
      resetForm();
      alert(editingId ? 'Estilista actualizado exitosamente' : 'Estilista agregado exitosamente');
    } catch (error: any) {
      alert(error.message || 'Error al guardar estilista');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s: Staff) => {
    setFormData({
      nombre: s.nombre,
      especialidades: s.especialidades || [],
      telefono: s.telefono,
      activo: s.activo,
    });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este estilista?")) return;

    try {
      const response = await fetch(`/api/staff/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchStaff();
        alert('Estilista eliminado exitosamente');
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      alert('Error al eliminar estilista');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      especialidades: [],
      telefono: "",
      activo: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#E46768]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-times text-3xl font-bold text-gray-900 mb-2">
            Estilistas
          </h1>
          <p className="text-gray-600">Gestiona el equipo del salón</p>
        </div>
        <Button variant="copper" onClick={() => setShowForm(true)}>
          <Plus className="mr-2" size={18} />
          Agregar Estilista
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? "Editar Estilista" : "Agregar Nuevo Estilista"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <Input
                  id="nombre"
                  required
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  placeholder="Ej: María García"
                />
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono * (Solo para admin)</Label>
                <Input
                  id="telefono"
                  required
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  placeholder="(786) 555-0123"
                />
              </div>

              <div>
                <Label>Especialidades * (Selecciona al menos una)</Label>
                <div className="space-y-2 mt-2 p-3 border rounded bg-gray-50">
                  {specialties.map((specialty) => (
                    <label key={specialty} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.especialidades.includes(specialty)}
                        onChange={() => toggleEspecialidad(specialty)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Estado</Label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.activo === true}
                      onChange={() => setFormData({ ...formData, activo: true })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Activo</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.activo === false}
                      onChange={() => setFormData({ ...formData, activo: false })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Inactivo</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" variant="copper" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Guardando...
                    </>
                  ) : (
                    <>
                      {editingId ? "Actualizar" : "Agregar"} Estilista
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Staff List */}
      <div className="grid gap-4">
        {staff.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">No hay estilistas registrados</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Especialidades</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{s.nombre}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{s.telefono}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {s.especialidades && s.especialidades.length > 0 ? (
                          s.especialidades.map((esp) => (
                            <Badge key={esp} className="text-xs bg-pink-50 text-pink-700 border border-pink-200">
                              {esp}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">Sin especialidades</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={s.activo ? "bg-green-500 text-white" : "bg-gray-400 text-white"}>
                        {s.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(s)}
                        >
                          <Edit size={16} className="mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(s.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
