"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import NextImage from "next/image";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import fondo1 from "@/assets/fondo1.jpg";
import salon from "@/assets/salon.jpg";

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
    <section
      className="relative overflow-hidden bg-center bg-cover"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(253, 231, 239, 0.85), rgba(255, 245, 251, 0.92), rgba(255, 255, 255, 0.96)), url(${fondo1.src})`,
      }}
    >
      <div className="absolute -left-24 top-[-140px] w-[22rem] h-[22rem] sm:w-[26rem] sm:h-[26rem] bg-white/30 rounded-full blur-3xl max-sm:opacity-60"></div>
      <div className="absolute bottom-[-240px] right-[-180px] w-[28rem] h-[28rem] sm:w-[36rem] sm:h-[36rem] bg-[#ffdcea]/30 rounded-full blur-3xl max-sm:opacity-60"></div>
      <div className="absolute inset-x-0 top-16 h-24 bg-gradient-to-b from-white/50 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 pt-24 pb-16 md:pt-36 md:pb-28 lg:pt-40 relative">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-12 lg:gap-16 items-center">
          {/* Text + story */}
          <div className="order-2 lg:order-1 space-y-6 sm:space-y-8 animate-fade-in-up">

            <div className="flex items-center gap-4 text-[#d89f6b] font-montserrat text-xs uppercase tracking-[0.28em]">
              <span className="h-px w-10 bg-[#d89f6b]/60"></span>
              Beauty salon · Nails · Facial · Hair
              <span className="h-px w-10 bg-[#d89f6b]/60"></span>
            </div>

            <div className="space-y-3 sm:space-y-5">
              <h1 className="font-playfair text-3xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-[#2c1e21] leading-[1.08] max-w-3xl">
                Resalta tu belleza natural con un toque suave
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[#3f2e31] font-montserrat leading-relaxed max-w-2xl">
                Faciales, cabello, uñas y spa en un ambiente rosado y cálido. Personalizamos cada cita para que te sientas relajada y luzcas impecable.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
              <Link href="/servicios">
                <Button className="w-full sm:w-auto text-base sm:text-lg md:text-xl px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 lg:px-12 lg:py-7 rounded-full bg-black text-white hover:bg-[#d63d7a] shadow-md hover:shadow-lg transition-all font-montserrat font-semibold">
                  Reserva tu cita
                </Button>
              </Link>
            </div>

            {!loading && currentPromotion && (
              <div className="flex items-start sm:items-center gap-3 px-5 py-4 bg-white/90 border border-pink-100 rounded-2xl shadow-soft w-full max-w-xl">
                <Sparkles size={18} className="text-[#d63d7a]" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#d63d7a] font-montserrat">Promoción activa</p>
                  <p className="text-gray-600 text-sm font-montserrat leading-relaxed">
                    {currentPromotion.descripcion}
                  </p>
                </div>
              </div>
            )}

            {/* Our Story */}
            <div className="bg-white/85 border border-white rounded-2xl shadow-soft p-6 max-w-xl">
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
          </div>

          {/* Imagery */}
          <div className="relative order-1 lg:order-2 space-y-4 sm:space-y-6">
            <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-elegant bg-white/70 backdrop-blur-sm border border-white/40 p-2 sm:p-3 max-h-[340px] sm:max-h-none">
              <div className="absolute top-4 left-4 z-10 px-3 py-2 rounded-full bg-white/90 text-xs font-montserrat font-semibold text-[#2c1e21] shadow-soft">
                Agenda hoy · ¡sin filas!
              </div>
              <div className="relative overflow-hidden rounded-[22px] sm:rounded-[28px] aspect-[3/4] sm:aspect-[4/5] bg-white">
                <NextImage
                  src={salon}
                  alt="Copper Beauty Salon"
                  fill
                  sizes="(min-width: 1280px) 520px, (min-width: 768px) 60vw, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#ffe0ed]/30 via-transparent to-transparent"></div>
              </div>

              {/* Decorative stars */}
              <div className="absolute top-6 left-6 text-[#d89f6b] opacity-70">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M12 3v4M12 17v4M4.2 7.2l2.8 2.8M17 14l2.8 2.8M3 12h4M17 12h4M7 17l-2.8 2.8M16.2 6.2l2.8-2.8" />
                </svg>
              </div>
            </div>

            {/* Stats strip */}
            <div className="mt-3 sm:mt-6 bg-white/85 border border-white/60 rounded-3xl shadow-soft px-3 py-2.5 sm:px-5 sm:py-4 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-0 items-center justify-between backdrop-blur">
              {[
                { label: "Clientas felices", value: "15+" },
                { label: "Expertas en belleza", value: "15+" },
                { label: "Años de experiencia", value: "10+" },
              ].map((stat, idx) => (
                <div key={stat.label} className="text-center relative">
                  <p className="font-playfair text-xl sm:text-2xl text-[#2c1e21] font-bold">{stat.value}</p>
                  <p className="text-[11px] sm:text-xs text-gray-600 font-montserrat">{stat.label}</p>
                  {idx < 2 && <span className="absolute right-0 top-2/4 -translate-y-1/2 h-10 w-px bg-[#ecdce3] hidden sm:block"></span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
