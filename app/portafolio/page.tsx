"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// Mock data - en producción esto vendrá de la base de datos
const portfolioImages = [
  { id: 1, category: "hairstyle", url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069", caption: "Balayage Signature" },
  { id: 2, category: "hairstyle", url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=2070", caption: "Corte y Color" },
  { id: 3, category: "makeup", url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=2071", caption: "Makeup Novia" },
  { id: 4, category: "makeup", url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070", caption: "Makeup Social" },
  { id: 5, category: "nail-services", url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=2087", caption: "Nail Art" },
  { id: 6, category: "nail-services", url: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=2070", caption: "Manicure Spa" },
  { id: 7, category: "hairstyle", url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574", caption: "Hair Styling" },
  { id: 8, category: "skincare", url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070", caption: "Facial Treatment" },
  { id: 9, category: "lashes-eyebrows", url: "https://images.unsplash.com/photo-1583001800930-c2706ba05d7b?q=80&w=2070", caption: "Lash Extensions" },
  { id: 10, category: "hairstyle", url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069", caption: "Color Specialist" },
  { id: 11, category: "makeup", url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070", caption: "Evening Makeup" },
  { id: 12, category: "nail-services", url: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=2070", caption: "Gel Manicure" },
  { id: 13, category: "skincare", url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070", caption: "Hydrating Treatment" },
  { id: 14, category: "lashes-eyebrows", url: "https://images.unsplash.com/photo-1588161255381-e23e17b06c49?q=80&w=2070", caption: "Microblading" },
  { id: 15, category: "hairstyle", url: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?q=80&w=2070", caption: "Wedding Hair" },
  { id: 16, category: "makeup", url: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b1?q=80&w=2070", caption: "Natural Glow" },
];

const categories = [
  { id: "all", name: "Todos", nameEn: "All" },
  { id: "hairstyle", name: "HairStyle", nameEn: "HairStyle" },
  { id: "makeup", name: "Makeup", nameEn: "Makeup" },
  { id: "nail-services", name: "Uñas", nameEn: "Nails" },
  { id: "skincare", name: "Skincare", nameEn: "Skincare" },
  { id: "lashes-eyebrows", name: "Pestañas & Cejas", nameEn: "Lashes & Brows" },
  { id: "wax", name: "Wax", nameEn: "Wax" },
];

export default function PortafolioPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    <main className="min-h-screen bg-copper-gradient">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-times text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Nuestro Portafolio
            </h1>
            <p className="text-lg text-gray-600 mb-8 animate-fade-in">
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
                    variant={selectedCategory === category.id ? "copper" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`rounded-full transition-all ${
                      selectedCategory === category.id 
                        ? "shadow-lg" 
                        : "hover:border-copper-red hover:text-copper-red"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-semibold text-sm">{image.caption}</p>
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
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-6xl w-full p-0 bg-black/95 border-none">
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
            <div className="relative w-full h-[80vh] flex items-center justify-center">
              <img
                src={filteredImages[currentImageIndex]?.url}
                alt={filteredImages[currentImageIndex]?.caption}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-white text-center text-lg font-semibold">
                {filteredImages[currentImageIndex]?.caption}
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
