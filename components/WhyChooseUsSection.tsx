"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import salon from "@/assets/salon.jpg";

export default function WhyChooseUsSection() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setInView(entry.isIntersecting));
      },
      { threshold: 0.25 }
    );

    const current = sectionRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <section 
      className="py-16 md:py-24 relative overflow-hidden bg-white"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={sectionRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
        >
          {/* Left side - Text content */}
          <div
            className={`transition-all duration-700 ease-out ${
              inView ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}
          >
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#1f1316] leading-tight mb-6">
              Por Qué Nuestros Clientes
              <br />
              Nos Eligen Siempre
            </h2>
            <div className="space-y-6 md:space-y-8">
              <p className="text-sm sm:text-base md:text-lg text-[#2d1b1e] font-montserrat leading-relaxed">
                Nuestros clientes valoran profundamente nuestro incomparable nivel de atención personalizada, la excepcional habilidad de nuestras estilistas y esteticistas altamente capacitadas, y nuestro enfoque meticulosamente profesional en cada detalle de su experiencia.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-[#2d1b1e] font-montserrat leading-relaxed">
                En Copper Beauty Salon & Spa, el trato que recibirás es genuinamente cálido, impecablemente profesional y cuidadosamente pensado para que salgas viéndote absolutamente increíble… y sintiéndote aún mejor de lo que imaginas.
              </p>
            </div>
          </div>

          {/* Right side - Image with stats */}
          <div
            className={`transition-all duration-700 ease-out ${
              inView ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
            }`}
          >
            <div className="flex flex-col items-center">
              {/* Square image */}
              <div className="relative w-96 h-96 md:w-[28rem] md:h-[28rem] rounded-lg overflow-hidden shadow-2xl mb-8">
                <Image
                  src={salon}
                  alt="Salon"
                  className="w-full h-full object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Stats below image */}
              <div className="flex gap-12 md:gap-16 justify-center w-full">
                <div className="text-center">
                  <h3 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#d63d7a] mb-1">
                    3k+
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-[#2d1b1e] font-montserrat">
                    Clientes satisfechos
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#d63d7a] mb-1">
                    7+
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-[#2d1b1e] font-montserrat">
                    Años de experiencia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
