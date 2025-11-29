"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import hero_imagen from "@/assets/hero_imagen.jpg";
import hero_imagen2 from "@/assets/hero_imagen2.jpg";
import hero_imagen3 from "@/assets/hero_imagen3.jpg";

interface Promotion {
  id: string;
  name: string;
  description?: string;
  discount: number;
  active: boolean;
}

interface HeroSlide {
  image: string;
  h2: string;
  h3: string;
  h4?: string;
  showButton?: boolean;
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);
  const [mounted, setMounted] = useState(false);

  const slides: HeroSlide[] = [
    {
      image: hero_imagen.src,
      h2: "Resalta tu belleza natural con un toque suave",
      h3: "Después de un día largo y agotador. Aquí puedes consentirte, renovar tu energía y disfrutar de los beneficios de un cuidado de belleza profesional y accesible.",
      showButton: true,
    },
    {
      image: hero_imagen2.src,
      h2: "Vive la Experiencia",
      h3: "Te escuchamos, diseñamos tu look y trabajamos con productos top para que salgas con un glow impecable. Confía tu imagen a un equipo que realmente cuida cada detalle de tu estilo.",
      showButton: true,
    },
    {
      image: hero_imagen3.src,
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
      setFade(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 800);
    }, 6000);

    return () => clearInterval(interval);
  }, [mounted]);

  const slide = slides[currentSlide];

  // Renderizar el primer slide inicialmente para evitar hydration mismatch
  if (!mounted) {
    return (
      <section
        suppressHydrationWarning
        className="relative overflow-hidden min-h-screen flex items-center transition-all duration-800"
        style={{
          backgroundImage: `url(${slides[0].image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-500"></div>
        <div className="absolute -left-24 top-[-140px] w-[22rem] h-[22rem] sm:w-[26rem] sm:h-[26rem] bg-white/10 rounded-full blur-3xl max-sm:opacity-60"></div>
        <div className="absolute bottom-[-240px] right-[-180px] w-[28rem] h-[28rem] sm:w-[36rem] sm:h-[36rem] bg-white/10 rounded-full blur-3xl max-sm:opacity-60"></div>
        <div className="container mx-auto px-4 pt-24 pb-16 md:pt-36 md:pb-28 lg:pt-40 relative z-10">
          <div className="w-full max-w-4xl">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-[1.08] max-w-3xl">
                  {slides[0].h2}
                </h2>
                <h3 className="text-base sm:text-lg md:text-xl text-black font-normal leading-relaxed max-w-2xl">
                  {slides[0].h3}
                </h3>
              </div>
              {slides[0].showButton && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full pt-4">
                  <Link href="/reservar">
                    <Button className="text-base sm:text-lg md:text-xl px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 lg:px-12 lg:py-7 rounded-full bg-white text-[#2c1e21] hover:bg-[#d63d7a] hover:text-white shadow-md hover:shadow-lg transition-all font-montserrat font-semibold">
                      Reserva tu cita
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      suppressHydrationWarning
      className="relative overflow-hidden min-h-screen flex items-center transition-all duration-800"
      style={{
        backgroundImage: `url(${slide.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay opcional para mejorar legibilidad del texto */}
      <div className="absolute inset-0 bg-black/20 transition-opacity duration-800"></div>

      {/* Decorative blurs */}
      <div className="absolute -left-24 top-[-140px] w-[22rem] h-[22rem] sm:w-[26rem] sm:h-[26rem] bg-white/10 rounded-full blur-3xl max-sm:opacity-60"></div>
      <div className="absolute bottom-[-240px] right-[-180px] w-[28rem] h-[28rem] sm:w-[36rem] sm:h-[36rem] bg-white/10 rounded-full blur-3xl max-sm:opacity-60"></div>

      {/* Content container */}
      <div className="container mx-auto px-4 pt-24 pb-16 md:pt-36 md:pb-28 lg:pt-40 relative z-10">
        <div className="w-full max-w-4xl">
          {/* Text content left-aligned with fade transition */}
          <div
            className={`space-y-6 sm:space-y-8 transition-all duration-800 ease-in-out ${
              fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Main heading - h2 with Times font, black color */}
            <div className="space-y-4">
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-[1.08] max-w-3xl">
                {slide.h2}
              </h2>

              {/* Sub heading - h3 with normal format, black color */}
              <h3 className="text-base sm:text-lg md:text-xl text-black font-normal leading-relaxed max-w-2xl">
                {slide.h3}
              </h3>

              {/* Optional h4 for third slide */}
              {slide.h4 && (
                <h4 className="text-sm sm:text-base md:text-lg text-black font-normal leading-relaxed max-w-2xl italic">
                  {slide.h4}
                </h4>
              )}
            </div>

            {/* Reserve button */}
            {slide.showButton && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full pt-4">
                <Link href="/reservar">
                  <Button className="text-base sm:text-lg md:text-xl px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 lg:px-12 lg:py-7 rounded-full bg-white text-[#2c1e21] hover:bg-[#d63d7a] hover:text-white shadow-md hover:shadow-lg transition-all font-montserrat font-semibold">
                    Reserva tu cita
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide indicators - dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setCurrentSlide(index);
                setFade(true);
              }, 300);
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
    </section>
  );
}
