"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import NextImage from "next/image";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import fondo_1_1 from "@/assets/fondo_1.1.jpg";

interface Promotion {
  id: string;
  name: string;
  description?: string;
  discount: number;
  active: boolean;
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
        const promotionsList = Array.isArray(data) ? data : data.promotions || [];
        setPromotions(promotionsList);
      }
    } catch (error) {
      console.error('Error al cargar promociones:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentPromotion = promotions[currentPromoIndex];

  return (
    <section
      className="relative overflow-hidden bg-center bg-cover min-h-screen flex items-center"
      style={{
        backgroundImage: `url(${fondo_1_1.src})`,
        backgroundSize: "cover",
        backgroundPosition: "right",
      }}
    >
      <div className="absolute -left-24 top-[-140px] w-[22rem] h-[22rem] sm:w-[26rem] sm:h-[26rem] bg-white/30 rounded-full blur-3xl max-sm:opacity-60"></div>
      <div className="absolute bottom-[-240px] right-[-180px] w-[28rem] h-[28rem] sm:w-[36rem] sm:h-[36rem] bg-[#ffdcea]/30 rounded-full blur-3xl max-sm:opacity-60"></div>
      <div className="absolute inset-x-0 top-16 h-24 bg-gradient-to-b from-white/50 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 pt-24 pb-16 md:pt-36 md:pb-28 lg:pt-40 relative">
        <div className="w-full max-w-4xl">
          {/* Text content left-aligned */}
          <div className="order-2 lg:order-1 space-y-6 sm:space-y-8 animate-fade-in-up">

            <div className="flex items-center gap-4 text-[#d89f6b] font-montserrat text-sm sm:text-base uppercase tracking-[0.28em]">
              <span className="h-px w-12 bg-[#d89f6b]/60"></span>
              Beauty salon · Nails · Facial · Hair
              <span className="h-px w-12 bg-[#d89f6b]/60"></span>
            </div>

            <div className="space-y-3 sm:space-y-5">
              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-[1.08] max-w-3xl">
                Resalta tu belleza natural con un toque suave
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-black/95 font-montserrat leading-relaxed max-w-2xl">
                Faciales, cabello, uñas y spa en un ambiente rosado y cálido. Personalizamos cada cita para que te sientas relajada y luzcas impecable.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
              <Link href="/servicios">
                <Button className="text-base sm:text-lg md:text-xl px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 lg:px-12 lg:py-7 rounded-full bg-white text-[#2c1e21] hover:bg-[#d63d7a] hover:text-white shadow-md hover:shadow-lg transition-all font-montserrat font-semibold">
                  Reserva tu cita
                </Button>
              </Link>
            </div>

            {!loading && currentPromotion && (
              <div className="flex items-start sm:items-center gap-3 px-5 py-4 bg-white/95 border border-pink-100 rounded-2xl shadow-soft w-full max-w-xl">
                <Sparkles size={18} className="text-[#d63d7a]" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#d63d7a] font-montserrat">Promoción activa</p>
                  <p className="text-gray-600 text-sm font-montserrat leading-relaxed">
                    {currentPromotion.description}
                  </p>
                </div>
              </div>
            )}

            {/* Our Story */}
            <div className="bg-white/90 border border-white rounded-2xl shadow-soft p-6 max-w-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-[#b88a3b] font-montserrat font-semibold mb-2">Nuestra historia</p>
              <h3 className="font-playfair text-2xl text-[#2c1e21] font-bold mb-3">Copper Beauty Salon & Spa</h3>
              <p className="text-gray-700 font-montserrat leading-relaxed sm:hidden">
                Citas personalizadas, cero estrés y un equipo que te acompaña en cada paso. Ven a Copper y vive una experiencia cálida para tu piel, cabello y uñas.
              </p>
              <p className="text-gray-700 font-montserrat leading-relaxed hidden sm:block">
                En Copper Beauty Salon & Spa cada cita es un momento de cuidado real: te escuchamos, entendemos tu estilo y creamos un look que te haga sentir cómoda y segura desde el primer minuto.
                <br /><br />
                Nuestra firma es la personalización. Elegimos técnicas y productos de calidad según tu cabello, piel y uñas para lograr un acabado limpio, elegante y duradero.
                <br /><br />
                En Copper, el trato es cálido, profesional y pensado para que salgas viéndote increíble… y sintiéndote aún mejor.
              </p>
            </div>

            {/* Stats strip - Left aligned */}
            <div className="mt-3 sm:mt-6 bg-white/85 border border-white/60 rounded-3xl shadow-soft px-5 py-6 sm:px-8 sm:py-8 flex items-center justify-between gap-6 sm:gap-8 backdrop-blur max-w-xl">
              {/* Left: 3K+ clientas felices */}
              <div className="flex-1 text-center">
                <p className="font-playfair text-2xl sm:text-3xl text-[#2c1e21] font-bold">3K+</p>
                <p className="text-xs sm:text-sm text-gray-600 font-montserrat whitespace-nowrap">Clientas felices</p>
              </div>

              {/* Center: Logo/Divider */}
              <div className="h-12 sm:h-16 w-px bg-gradient-to-b from-transparent via-[#ecdce3] to-transparent"></div>

              {/* Right: 7+ años de experiencia */}
              <div className="flex-1 text-center">
                <p className="font-playfair text-2xl sm:text-3xl text-[#2c1e21] font-bold">7+</p>
                <p className="text-xs sm:text-sm text-gray-600 font-montserrat whitespace-nowrap">Años de experiencia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
