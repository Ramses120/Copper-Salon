"use client";

import { useEffect, useRef, useState } from "react";

export default function AboutSection() {
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
      className="py-24 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#fcedf4] to-white"
      id="sobre-nosotros"
    >
      <div className="container mx-auto px-4 relative z-10 flex items-center justify-center">
        <div
          ref={sectionRef}
          className={`max-w-4xl w-full text-center transition-all duration-700 ease-out ${
            inView ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-6 opacity-0"
          }`}
        >
          <div>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-6xl lg:text-6xl font-bold text-[#1f1316] leading-tight mb-4">
              Somos expertas en realzar tu belleza con tacto delicado y resultados premium
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-[#2d1b1e] font-montserrat leading-relaxed max-w-3xl mx-auto">
              Te escuchamos, diseñamos tu look y trabajamos con productos top para que salgas con un glow impecable.
              Piel, cabello y uñas cuidadas por especialistas que aman los detalles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
