'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface GalleryImage {
  id: number;
  image_url: string;
  title: string;
  category: string;
  visible: boolean;
  is_featured: boolean;
  created_at: string;
}

export default function AdminPortafolioPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Instagram',
    category: 'cortes',
    visible: true,
    is_featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapear los datos de la tabla portfolio_images a la interfaz GalleryImage
      const mappedImages = (data || []).map((img: any) => {
        // Normalizar URL: si la url es relativa (empieza por /storage) concatenar el dominio público
        let imageUrl = img.url || '';
        if (typeof imageUrl === 'string' && imageUrl.startsWith('/storage')) {
          imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}${imageUrl}`;
        }

        return {
          id: img.id,
          image_url: imageUrl,
          title: img.caption || 'Sin título',
          category: img.category,
          visible: true,
          is_featured: false,
          created_at: img.created_at
        } as GalleryImage;
      }).filter((img: GalleryImage) =>
        typeof img.image_url === 'string' &&
        (img.image_url.startsWith('http://') || img.image_url.startsWith('https://') || img.image_url.startsWith('/'))
      );

      setImages(mappedImages);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida');
        return;
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar 5MB');
        return;
      }

      setImageFile(file);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("category", formData.category);

      const res = await fetch("/api/admin/portfolio/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        let err: any = {};
        let text = "";
        try {
          err = await res.json();
        } catch (_) {
          try {
            text = await res.text();
          } catch (_) {
            text = "";
          }
        }
        console.error("Upload error payload:", err || text);
        const msgParts = [
          err.error,
          err.details,
          err.message,
          err.bucket ? `Bucket: ${err.bucket}` : "",
          text,
          `HTTP ${res.status} ${res.statusText}`,
          Object.keys(err || {}).length ? JSON.stringify(err) : "",
        ].filter(Boolean);
        const msg = msgParts.join(" | ") || "Error al subir la imagen";
        throw new Error(msg);
      }

      const data = await res.json();
      return data.publicUrl as string;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(error?.message || "No se pudo subir la imagen. Verifica configuración de Supabase.");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert('Debes seleccionar una imagen para subir');
      return;
    }

    setUploading(true);

    try {
      const uploadedUrl = await uploadImage(imageFile);
      if (!uploadedUrl) {
        alert('Error al subir la imagen');
        return;
      }

      // No insertamos manualmente en la tabla porque tenemos un trigger en el servidor
      // que sincroniza storage -> portfolio_images. Añadimos optimistamente a la UI.
      const newImage: GalleryImage = {
        id: Date.now(),
        image_url: uploadedUrl,
        title: formData.title || 'Sin título',
        category: formData.category,
        visible: formData.visible,
        is_featured: formData.is_featured,
        created_at: new Date().toISOString()
      };

      setImages((prev) => [newImage, ...prev]);

      // Reset form
      setFormData({
        title: 'Instagram',
        category: 'cortes',
        visible: true,
        is_featured: false,
      });
      setImageFile(null);
      setPreviewUrl('');
      setShowForm(false);
      fetchImages();
    } catch (error) {
      console.error('Error adding image:', error);
      alert('Error al agregar imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;

    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err.error || err.details || "Error al eliminar imagen";
        throw new Error(msg);
      }
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert(error instanceof Error ? error.message : 'Error al eliminar imagen');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando galería...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Portafolio</h2>
          <p className="text-gray-600">Gestiona las imágenes del portafolio</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus size={20} />
          {showForm ? 'Cancelar' : 'Agregar Imagen'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Subir Nueva Imagen</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="cortes">Cortes</option>
                <option value="coloracion">Coloración</option>
                <option value="tratamientos">Tratamientos</option>
                <option value="peinados">Peinados</option>
                <option value="manicure">Manicure</option>
                <option value="cejas">Cejas y Pestañas</option>
              </select>
            </div>

            {/* Subir archivo desde teléfono/computadora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Imagen
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-amber-500 transition-colors">
                <div className="space-y-1 text-center">
                  {!previewUrl && (
                    <>
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none"
                        >
                          <span>Selecciona un archivo</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="sr-only"
                            onChange={handleFileChange}
                            required
                          />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP hasta 5MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* Preview de la imagen */}
              {previewUrl && (
                <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewUrl('');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Opciones de visibilidad */}
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="visible"
                  checked={formData.visible}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="visible" className="ml-2 text-sm text-gray-700">
                  Visible en galería pública
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700">
                  Destacada
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !imageFile}
              className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Subiendo imagen...
                </span>
              ) : (
                'Subir a Galería'
              )}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images
          .filter((img) =>
            typeof img.image_url === 'string' &&
            (img.image_url.startsWith('http://') || img.image_url.startsWith('https://') || img.image_url.startsWith('/'))
          )
          .map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-64">
              <Image
                src={image.image_url}
                alt={image.title}
                fill
                className="object-cover"
              />
              {image.is_featured && (
                <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  ⭐ Destacada
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{image.title}</h3>
              <p className="text-sm text-gray-600 capitalize">{image.category}</p>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs ${image.visible ? 'text-green-600' : 'text-gray-400'}`}>
                  {image.visible ? '✓ Visible' : '✗ Oculta'}
                </span>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-600">No hay imágenes en la galería</p>
          <p className="text-sm text-gray-500">Sube tu primera imagen desde tu teléfono o computadora</p>
        </div>
      )}
    </div>
  );
}
