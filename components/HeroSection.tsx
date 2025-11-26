"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowDown, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface Promotion {
  id: number;
  titulo: string;
  descripcion: string;
  descuento: number;
  activa: boolean;
}

export default function HeroSection() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (promotions.length > 1) {
      const interval = setInterval(() => {
        setCurrentPromoIndex((prev) => (prev + 1) % promotions.length);
      }, 5000); // Cambiar cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [promotions.length]);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/promotions/active');
      if (response.ok) {
        const data = await response.json();
        setPromotions(data);
      }
    } catch (error) {
      console.error('Error al cargar promociones:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentPromotion = promotions[currentPromoIndex];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transform scale-105"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574)',
          filter: 'blur(1px) brightness(0.7)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
      </div>

      {/* Promotion Banner - Glassmorphism Style */}
      {!loading && currentPromotion && (
        <div className="absolute top-24 left-0 right-0 z-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div 
              className="glass-dark backdrop-blur-2xl text-white py-5 px-8 rounded-3xl shadow-elegant border border-white/10 animate-scale-in"
              key={currentPromotion.id}
            >
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Sparkles className="text-yellow-300 animate-pulse drop-shadow-lg" size={28} />
                <div className="text-center">
                  <span className="font-playfair text-xl font-bold tracking-wide">
                    {currentPromotion.titulo}
                  </span>
                  <span className="mx-3 text-white/50">•</span>
                  <span className="font-montserrat text-sm opacity-90">
                    {currentPromotion.descripcion}
                  </span>
                  <span className="ml-4 bg-gradient-copper-primary px-4 py-1.5 rounded-full text-sm font-bold shadow-copper animate-glow">
                    {currentPromotion.descuento}% OFF
                  </span>
                </div>
                <Sparkles className="text-yellow-300 animate-pulse drop-shadow-lg" size={28} />
              </div>
              
              {/* Indicator dots - Elegant */}
              {promotions.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {promotions.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === currentPromoIndex
                          ? 'bg-white w-8 shadow-lg'
                          : 'bg-white/30 w-2'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up">

          {/* Main Title - Ultra Premium */}
          <h1 className="font-playfair text-6xl md:text-8xl font-bold text-white leading-tight drop-shadow-2xl">
            <span className="font-bold text-[#E46768] font-playfair">Belleza</span>
            <div>que se ve y se siente.</div>
          </h1>

          {/* Subtitle - Elegant */}
          <p className="font-cormorant text-2xl md:text-3xl text-white/95 font-light leading-relaxed max-w-3xl mx-auto">
           Luce impecable.{" "}
            <span className="font-bold text-[#E46768] font-playfair">  Siéntete increíble.</span>
          </p>

          {/* CTAs - Modern Design */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-10">
            <Link href="/reservar">
              <Button
                variant="copper"
                size="lg"
                className="text-lg px-10 py-7 rounded-full shadow-copper hover:shadow-elegant transition-all hover:scale-105 font-montserrat font-semibold bg-gradient-copper-primary border-0 hover-glow"
              >
                Reservar Cita Ahora
              </Button>
            </Link>
            <Link href="/servicios">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-7 rounded-full glass-effect backdrop-blur-xl border-white/30 text-white hover:bg-white/20 transition-all font-montserrat font-medium hover-lift"
              >
                Explorar Servicios
              </Button>
            </Link>
          </div>
                    {/* Subtitle - Elegant */}
          <p className="font-cormorant text-2xl md:text-2xl text-white/95 font-light leading-relaxed max-w-3xl mx-auto">
            Hair, makeup & nails con sello{" "}
            <span className="font-bold text-[#E46768] font-playfair">Copper</span>.
          </p>

          {/* Scroll Indicator - Elegant */}
          <div className="pt-16 animate-bounce">
            <div className="flex flex-col items-center gap-2 text-white/70 hover:text-white/90 transition-colors cursor-pointer">
              <span className="text-xs font-montserrat uppercase tracking-widest">Descubre más</span>
              <ArrowDown size={28} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 to-transparent z-0"></div>
    </section>
  );
}
