"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import hero from "@/assets/hero.jpg";
import vector1 from "@/assets/vector1.png";
import vector2 from "@/assets/vector2.png";
import vector3 from "@/assets/vector3.png";

const slideInStyles = `
  @keyframes slideInLeft {
    from {
      opacity: 1.2;
      transform: translateX(-100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .slide-in-text {
    animation: slideInLeft 1s ease-out forwards;
  }

  @keyframes fadeInVector {
    from {
      opacity: 0;
    }
    to {
      opacity: 2;
    }
  }

  @keyframes fadeOutVector {
    from {
      opacity: 2;
    }
    to {
      opacity: 0;
    }
  }

  .vector-zoom-in {
    animation: fadeInVector 600ms ease-out forwards, fadeOutVector 900ms ease-in 192000ms forwards;
    will-change: opacity;
  }
`;

interface Promotion {
  id: string;
  name: string;
  description?: string;
  discount: number;
  active: boolean;
}

interface HeroSlide {
  vector: string;
  h2?: string;
  h3: string;
  h4?: string;
  showButton?: boolean;
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  const slides: HeroSlide[] = [
    {
      vector: vector1.src,
      h3: "Resalta tu belleza natural con un toque suave",
      h4: "Después de un día largo y agotador. Aquí puedes consentirte, renovar tu energía y disfrutar de los beneficios de un cuidado de belleza profesional y accesible.",
      showButton: true,
    },
    {
      vector: vector2.src,
      h3: "Vive la Experiencia",
      h4: "Te escuchamos, diseñamos tu look y trabajamos con productos top para que salgas con un glow impecable. Confía tu imagen a un equipo que realmente cuida cada detalle de tu estilo.",
      showButton: true,
    },
    {
      vector: vector3.src,
      h2: "Copper",
      h3: "En Copper ofrecemos servicios de calidad para ti. Nos especializamos en todos los tratamientos de belleza, y contamos con un equipo completamente profesional, creativo e innovador: desde maquillaje, cuidado del cabello, hasta cejas, pestañas y más.",
      h4: "Tu belleza es nuestro regalo para ti: déjate consentir por expertos que aman lo que hacen.",
      showButton: true,
    },
  ];

  // Asegurar que solo se ejecuta en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 20000); // 20 seconds per slide display

    return () => clearInterval(interval);
  }, [mounted, slides.length]);

  const slide = slides[currentSlide];

  return (
    <section
      suppressHydrationWarning
      className="relative overflow-hidden h-[885px] md:h-[995px] flex items-center"
      style={{
        backgroundImage: `url(${hero.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <style>{slideInStyles}</style>
      
      {/* Vector overlay con fade prolongado en entrada y rápido en salida */}
      <div
        key={`vector-${currentSlide}`}
        className="absolute inset-0 vector-zoom-in"
        style={{
          backgroundImage: `url(${slide.vector})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Content container */}
      <div className="container mx-auto px-4 pt-8 pb-8 md:pt-12 md:pb-12 relative z-10">
        <div className="w-full max-w-4xl">
          {/* Text content with slide-in animation */}
          <div
            key={`text-${currentSlide}`}
            className="space-y-4 sm:space-y-5 slide-in-text"
          >
            {/* Main heading with divider - inspired by Swiper style */}
            <div className="space-y-3">
              {slide.h2 ? (
                <div className="space-y-1">
                  <h2 className="font-times text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#d63d7a] leading-[1.08] max-w-3xl">
                    Copper
                  </h2>
                  <div className="flex items-baseline gap-1 max-w-3xl">
                    <h2 className="font-times text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-[1.08]">
                      Beauty Salon
                    </h2>
                    <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-[1.08]">
                      &
                    </h2>
                    <h2 className="font-times text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-[1.08]">
                      Spa
                    </h2>
                  </div>
                  {currentSlide === 2 && (
                    <div className="h-1.5 w-16 bg-gradient-to-r from-[#d63d7a] to-transparent mt-3 rounded-full"></div>
                  )}
                </div>
              ) : (
                <h3 className="font-serif text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-black leading-[1.08] max-w-3xl">
                  {slide.h3}
                  {currentSlide < 2 && (
                    <div className="h-1.5 w-16 bg-gradient-to-r from-[#d63d7a] to-transparent mt-3 rounded-full"></div>
                  )}
                </h3>
              )}
            </div>

            {/* Sub heading with full content */}
            <div className="space-y-2 max-w-2xl">
              {slide.h2 ? (
                <h3 className="text-base sm:text-lg md:text-lg lg:text-lg text-black font-normal leading-relaxed">
                  {slide.h3}
                </h3>
              ) : (
                <h4 className="text-base sm:text-lg md:text-lg lg:text-lg text-black font-normal leading-relaxed">
                  {slide.h4}
                </h4>
              )}

              {/* Optional h4 for third slide */}
              {slide.h2 && slide.h4 && (
                <h4 className="text-sm sm:text-base md:text-base lg:text-base text-black/80 font-normal leading-relaxed italic">
                  {slide.h4}
                </h4>
              )}
            </div>

            {/* Reserve button */}
            {slide.showButton && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full pt-1">
                <Link href="/servicios">
                  <Button className="text-sm sm:text-base md:text-lg px-5 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 lg:px-10 lg:py-6 rounded-full bg-white text-[#2c1e21] hover:bg-[#d63d7a] hover:text-white transition-all font-montserrat font-semibold">
                    Reserva tu cita
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide indicators - dots */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 left-8 z-20 text-white font-montserrat text-sm font-semibold">
        <span className="text-lg">{currentSlide + 1}</span>
        <span className="text-white/60"> \ {slides.length}</span>
      </div>

      {/* Navigation buttons */}
      {/* Previous button */}
      <button
        onClick={() => {
          setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        }}
        className="absolute bottom-8 right-24 z-20 flex items-center justify-center w-10 h-10 rounded-full border border-white/50 hover:border-white transition-all hover:bg-white/10 group"
        aria-label="Previous slide"
      >
        <svg
          className="w-5 h-5 text-white transform rotate-180 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <polyline points="15 18 9 12 15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Next button */}
      <button
        onClick={() => {
          setCurrentSlide((prev) => (prev + 1) % slides.length);
        }}
        className="absolute bottom-8 right-8 z-20 flex items-center justify-center w-10 h-10 rounded-full border border-white/50 hover:border-white transition-all hover:bg-white/10 group"
        aria-label="Next slide"
      >
        <svg
          className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <polyline points="9 18 15 12 9 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}
