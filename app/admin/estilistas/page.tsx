"use client";

import { useState, useEffect, useRef } from "react";
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
import { Plus, Edit, Trash2, User, Upload, Loader2 } from "lucide-react";

const specialties = [
  "Colorista & Estilista",
  "Maquilladora Profesional",
  "Especialista en Uñas",
  "Esteticista",
  "Técnico en Extensiones",
  "Estilista General",
];

interface Staff {
  id: number;
  nombre: string;
  especialidad: string;
  telefono: string;
  email: string;
  activo: boolean;
  foto?: string;
  horario?: any;
}

export default function AdminEstilistasPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    especialidad: "",
    telefono: "",
    email: "",
    activo: true,
    foto: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff');
      if (response.ok) {
        const data = await response.json();
        setStaff(data);
      }
    } catch (error) {
      console.error('Error al cargar estilistas:', error);
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

      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let photoUrl = formData.foto;

      // Si hay una foto nueva, subirla
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        uploadFormData.append('folder', 'copper/staff');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Error al subir imagen');
        }

        const { url } = await uploadResponse.json();
        photoUrl = url;
      }

      const staffData = {
        ...formData,
        foto: photoUrl,
      };

      const url = editingId ? `/api/staff/${editingId}` : '/api/staff';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffData),
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
      setUploading(false);
    }
  };

  const handleEdit = (s: Staff) => {
    setFormData({
      nombre: s.nombre,
      especialidad: s.especialidad,
      telefono: s.telefono,
      email: s.email,
      activo: s.activo,
      foto: s.foto || "",
    });
    setEditingId(s.id);
    setPreviewUrl(s.foto || "");
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
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
      especialidad: "",
      telefono: "",
      email: "",
      activo: true,
      foto: "",
    });
    setEditingId(null);
    setSelectedFile(null);
    setPreviewUrl("");
    setShowForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
              {/* Photo Upload */}
              <div>
                <Label htmlFor="foto">Foto de Perfil</Label>
                <div className="mt-2 flex items-center gap-4">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={40} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="foto"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={16} className="mr-2" />
                      Seleccionar Foto
                    </Button>
                    <p className="text-xs text-gray-600 mt-1">
                      Máximo 5MB • JPG, PNG, WEBP
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
                  <Label htmlFor="especialidad">Especialidad *</Label>
                  <Select
                    value={formData.especialidad}
                    onValueChange={(value) =>
                      setFormData({ ...formData, especialidad: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono *</Label>
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
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="estilista@copperbeauty.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="activo">Estado</Label>
                <Select
                  value={formData.activo.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, activo: value === "true" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activo</SelectItem>
                    <SelectItem value="false">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button type="submit" variant="copper" disabled={uploading}>
                  {uploading ? (
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
              <User size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No hay estilistas registrados</p>
            </CardContent>
          </Card>
        ) : (
          staff.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {s.foto ? (
                      <img
                        src={s.foto}
                        alt={s.nombre}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={32} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{s.nombre}</h3>
                      <p className="text-gray-600">{s.especialidad}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span>{s.telefono}</span>
                        <span>•</span>
                        <span>{s.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={s.activo ? "bg-green-500 text-white" : "bg-gray-400 text-white"}>
                      {s.activo ? "Activo" : "Inactivo"}
                    </Badge>
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
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
