"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import NextImage from "next/image";
import { createClient } from "@supabase/supabase-js";

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

const categoryMap: { [key: string]: { name: string; nameEn: string } } = {
  cortes: { name: "Cortes", nameEn: "Haircuts" },
  coloracion: { name: "Coloración", nameEn: "Coloring" },
  tratamientos: { name: "Tratamientos", nameEn: "Treatments" },
  peinados: { name: "Peinados", nameEn: "Hairstyles" },
  manicure: { name: "Manicure", nameEn: "Manicure" },
  cejas: { name: "Cejas & Pestañas", nameEn: "Lashes & Brows" },
};

const categories = [
  { id: "all", name: "Todos", nameEn: "All" },
  { id: "cortes", name: "Cortes", nameEn: "Haircuts" },
  { id: "coloracion", name: "Coloración", nameEn: "Coloring" },
  { id: "tratamientos", name: "Tratamientos", nameEn: "Treatments" },
  { id: "peinados", name: "Peinados", nameEn: "Hairstyles" },
  { id: "manicure", name: "Manicure", nameEn: "Manicure" },
  { id: "cejas", name: "Cejas & Pestañas", nameEn: "Lashes & Brows" },
];

export default function PortafolioPage() {
  const [portfolioImages, setPortfolioImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolio_images")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(32); // Traer hasta 32 imágenes (>15) para la galería completa

      if (error) throw error;

      // Mapear los datos de la tabla portfolio_images a la interfaz GalleryImage
      const mappedImages = (data || []).map((img: any) => {
        let imageUrl = img.url || "";
        if (typeof imageUrl === "string" && imageUrl.startsWith("/storage")) {
          imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}${imageUrl}`;
        }

        return {
          id: img.id,
          image_url: imageUrl,
          title: img.caption || "Sin título",
          category: img.category,
          visible: true,
          is_featured: false,
          created_at: img.created_at,
        };
      });

      setPortfolioImages(mappedImages);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedCategory === "all"
    ? portfolioImages
    : portfolioImages.filter(img => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  return (
    <main className="min-h-screen bg-copper-gradient pt-24 lg:pt-32">

      {/* Hero Section */}
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-times text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Nuestro Portafolio
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 animate-fade-in">
              Descubre la magia de nuestro trabajo. Cada imagen cuenta la historia de una transformación única.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`rounded-full transition-all ${selectedCategory === category.id
                        ? "bg-black text-white shadow-lg"
                        : "border-black text-black hover:bg-black/10"
                      }`}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
              <div className="text-center mt-4 text-sm text-gray-600">
                Mostrando {filteredImages.length} {filteredImages.length === 1 ? 'imagen' : 'imágenes'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="group relative h-36 sm:aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer animate-scale-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => openLightbox(index)}
                    >
                      <NextImage
                        src={image.image_url}
                        alt={image.title}
                        fill
                        sizes="(min-width: 1280px) 320px, (min-width: 768px) 33vw, 90vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                      {image.is_featured && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">
                            ⭐ Destacada
                          </Badge>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-semibold text-sm">{categoryMap[image.category]?.name || image.category}</p>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                          <svg className="w-5 h-5 text-copper-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredImages.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-gray-400 text-6xl mb-4">📸</div>
                    <p className="text-gray-600 text-lg">
                      No hay imágenes en esta categoría todavía
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-6xl w-full p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">
            {filteredImages[currentImageIndex]?.title || "Imagen de portafolio"}
          </DialogTitle>
          <div className="relative">
            {/* Close Button */}
            <DialogClose className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
              <X className="text-white" size={24} />
            </DialogClose>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            >
              <ChevronLeft className="text-white" size={32} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            >
              <ChevronRight className="text-white" size={32} />
            </button>

            {/* Image */}
            <div className="relative w-full h-[80vh]">
              <NextImage
                src={filteredImages[currentImageIndex]?.image_url || ""}
                alt={filteredImages[currentImageIndex]?.title || "Imagen de portafolio"}
                fill
                sizes="100vw"
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-white text-center text-lg font-semibold">
                {categoryMap[filteredImages[currentImageIndex]?.category]?.name || filteredImages[currentImageIndex]?.category}
              </p>
              <p className="text-white/70 text-center text-sm mt-1">
                {currentImageIndex + 1} / {filteredImages.length}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}
