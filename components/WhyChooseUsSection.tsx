"use client";

import { useEffect, useRef, useState } from "react";
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
      className="py-12 md:py-16 relative overflow-hidden bg-white"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={sectionRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
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
              Nos eligen
            </h2>
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-[#2d1b1e] font-montserrat leading-relaxed">
                Nuestros clientes valoran y aprecian nuestro nivel de atención, la habilidad de nuestras estilistas y esteticistas, y nuestro enfoque profesional en cada detalle.
              </p>
              <p className="text-base sm:text-lg text-[#2d1b1e] font-montserrat leading-relaxed">
                En Copper, el trato es cálido, profesional y pensado para que salgas viéndote increíble… y sintiéndote aún mejor.
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
              <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-lg overflow-hidden shadow-lg mb-6">
                <img
                  src={salon.src}
                  alt="Salon"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Stats below image */}
              <div className="flex gap-8 md:gap-12 justify-center w-full">
                <div className="text-center">
                  <h3 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#d63d7a] mb-1">
                    3k+
                  </h3>
                  <p className="text-sm sm:text-base text-[#2d1b1e] font-montserrat">
                    Clientes satisfechos
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#d63d7a] mb-1">
                    7+
                  </h3>
                  <p className="text-sm sm:text-base text-[#2d1b1e] font-montserrat">
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
