"use client";

import { useState, useEffect, useRef } from "react";
import NextImage from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Upload, Image as ImageIcon, X, Loader2 } from "lucide-react";

const categories = [
  "HairStyle",
  "Makeup",
  "Nails",
  "Skincare",
  "Lashes/Brows",
  "Wax",
];

interface PortfolioImage {
  id: number;
  url: string;
  categoria: string;
  descripcion: string;
  fechaCreacion: string;
}

export default function AdminPortafolioPage() {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    categoria: "",
    descripcion: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(
    (img) => selectedCategory === "all" || img.categoria === selectedCategory
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Solo se aceptan imágenes');
        return;
      }

      setSelectedFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Por favor selecciona una imagen');
      return;
    }

    setUploading(true);

    try {
      // 1. Subir imagen a Cloudinary
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('folder', 'copper/portfolio');

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Error al subir imagen');
      }

      const { url } = await uploadResponse.json();

      // 2. Guardar en base de datos
      const saveResponse = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          categoria: formData.categoria,
          descripcion: formData.descripcion,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Error al guardar imagen');
      }

      // Recargar imágenes
      await fetchImages();
      resetForm();
      alert('Imagen agregada exitosamente');
    } catch (error: any) {
      alert(error.message || 'Error al agregar imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta imagen?")) return;

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImages(images.filter((img) => img.id !== id));
        alert('Imagen eliminada exitosamente');
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      alert('Error al eliminar la imagen');
    }
  };

  const resetForm = () => {
    setFormData({
      categoria: "",
      descripcion: "",
    });
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
            Portafolio
          </h1>
          <p className="text-gray-600">Gestiona las imágenes del portafolio</p>
        </div>
        <Button variant="copper" onClick={() => setShowForm(true)}>
          <Plus className="mr-2" size={18} />
          Agregar Imagen
        </Button>
      </div>

      {/* Category Filter */}
      <Card>
        <CardContent className="p-4">
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
        </CardContent>
      </Card>

      {/* Upload Form */}
      {showForm && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Agregar Nueva Imagen</h3>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X size={18} />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload */}
              <div>
                <Label htmlFor="file">Imagen *</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload size={16} className="mr-2" />
                    Seleccionar Imagen
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Máximo 5MB • JPG, PNG, WEBP
                </p>

                {/* Preview */}
                {previewUrl && (
                  <div className="mt-3 relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <NextImage
                      src={previewUrl}
                      alt="Preview"
                      fill
                      sizes="(min-width: 1024px) 360px, 90vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="categoria">Categoría *</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoria: value })
                  }
                  required
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

              <div>
                <Label htmlFor="descripcion">Descripción *</Label>
                <Input
                  id="descripcion"
                  required
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  placeholder="Ej: Balayage rubio platino"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  variant="copper" 
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="mr-2" />
                      Agregar Imagen
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                {selectedCategory === "all"
                  ? "No hay imágenes en el portafolio"
                  : "No hay imágenes en esta categoría"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredImages.map((img) => (
            <Card key={img.id} className="overflow-hidden group">
              <div className="relative h-64 bg-gray-100">
                <NextImage
                  src={img.url}
                  alt={img.descripcion}
                  fill
                  sizes="(min-width: 1024px) 360px, 90vw"
                  className="object-cover transition-transform group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(img.id)}
                  >
                    <Trash2 size={16} className="mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <Badge className="mb-2 border border-gray-300 bg-white text-gray-700">
                  {img.categoria}
                </Badge>
                <p className="text-sm text-gray-700">{img.descripcion}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(img.fechaCreacion).toLocaleDateString('es-MX')}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
