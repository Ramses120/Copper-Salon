import HeroSection from "@/components/HeroSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import PromotionsSection from "@/components/PromotionsSection";
import { supabase } from "@/lib/supabaseClient";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NextImage from "next/image";
import { Instagram } from "lucide-react";
import makeup from "@/assets/makeup.jpg";
import cejas from "@/assets/cejas.jpg";
import Depilacion from "@/assets/Depilacion.jpg";
import Faciales from "@/assets/Faciales.jpg";
import nails from "@/assets/nails.jpg";
import fondoCopper from "@/assets/fondo_copper.jpg";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import portfolio1 from "@/assets/Portfolio/Porfolio_1.png";
import portfolio2 from "@/assets/Portfolio/Portfolio_2.png";
import portfolio3 from "@/assets/Portfolio/Portfolio_3.png";
import portfolio4 from "@/assets/Portfolio/Portfolio_4.png";
import portfolio5 from "@/assets/Portfolio/Portfolio_5.png";
import portfolio6 from "@/assets/Portfolio/Portfolio_6.png";
import portfolio7 from "@/assets/Portfolio/Portfolio_7.png";
import portfolio8 from "@/assets/Portfolio/Portfolio_8.png";

export default async function HomePage() {
  const { data: promotions } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .eq("show_on_site", true)
    .order("priority", { ascending: false });

  const portfolioImages = [
    portfolio1,
    portfolio2,
    portfolio3,
    portfolio4,
    portfolio5,
    portfolio6,
    portfolio7,
    portfolio8,
  ];

  return (
    <main className="min-h-screen pt-24 lg:pt-32">
      <HeroSection />
      {/* <PromotionsSection promotions={promotions || []} /> */}
      <WhyChooseUsSection />

      {/* Services Preview Section */}
      <section
        className="py-12 sm:py-14 lg:py-16 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(252, 237, 244, 0.88), rgba(255, 245, 251, 0.92)), url(${fondoCopper.src})`,
        }}
        id="servicios-preview"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2c1e21] leading-tight mb-3 sm:mb-4">
              Explora nuestros servicios
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto font-montserrat text-xs sm:text-sm md:text-base lg:text-lg">
              Un espacio para consentirte con cuidado de uñas, faciales, piel y más. Inspirado en los detalles elegantes de nuestro catálogo.
            </p>
          </div>

          {/* Mobile-first block: show Nail care text, then images grid, then Otros servicios + button (mobile) */}
          <div className="lg:hidden max-w-5xl mx-auto space-y-4">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.2em] text-[#b88a3b] font-montserrat font-semibold">Nail care</span>
              <h3 className="font-playfair text-2xl text-[#2c1e21] font-bold">Nail Care</h3>
              <p className="text-gray-700 font-montserrat leading-relaxed text-sm">
                Relájate con manicure y pedicure spa, elige tu estilo en acrílico, gel o dips y luce nail art impecable con acabados duraderos. Nuestro equipo cuida cada detalle para que tus manos y pies se vean elegantes.
              </p>
              <ul className="space-y-2 text-gray-800 font-montserrat text-xs">
                {[
                  "Manicure & Pedicure",
                  "Acrylic & Gel Nails",
                  "Apres & Nail Art",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#b88a3b] flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Images: big image then 2x2 grid */}
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden shadow-elegant w-full aspect-[4/3]">
                <NextImage src={nails} alt="Nail care Copper" className="w-full h-full object-cover" fill />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[makeup, cejas, Depilacion, Faciales].map((image, idx) => (
                  <div key={idx} className="relative overflow-hidden rounded-xl shadow-soft aspect-[4/3]">
                    <NextImage src={image} alt={`Servicio ${idx + 1}`} className="w-full h-full object-cover" fill />
                  </div>
                ))}
              </div>
            </div>

            {/* Otros servicios block (mobile) */}
            <div className="space-y-3">
              <h3 className="font-playfair text-lg text-[#2c1e21] font-bold">Otros servicios</h3>
              <p className="text-gray-700 font-montserrat leading-relaxed text-sm">
                Combina tus citas de uñas con faciales, tratamientos de piel. Personalizamos cada sesión para que te sientas cuidada de pies a cabeza.
              </p>
              <ul className="space-y-1.5 text-gray-800 font-montserrat text-xs">
                {[
                  "Waxing services",
                  "Facial treatments",
                  "Hair treatments",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#b88a3b] flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Button asChild className="rounded-full bg-black text-white px-5 py-2 text-sm font-semibold">
                  <Link href="/servicios">Explorar más</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop / lg+ layout (side-by-side) */}
          <div className="hidden lg:block max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* Images column */}
              <div className="order-1 lg:order-2 space-y-4">
                <div className="relative rounded-2xl overflow-hidden shadow-elegant w-full aspect-[4/3]">
                  <NextImage src={nails} alt="Nail care Copper" className="w-full h-full object-cover" fill />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[makeup, cejas, Depilacion, Faciales].map((image, idx) => (
                    <div key={idx} className="relative overflow-hidden rounded-xl shadow-soft aspect-[4/3]">
                      <NextImage src={image} alt={`Servicio ${idx + 1}`} className="w-full h-full object-cover" fill />
                    </div>
                  ))}
                </div>
              </div>

              {/* Text column */}
              <div className="order-2 lg:order-1 space-y-3">
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#b88a3b] font-montserrat font-semibold">Nail care</span>
                  <h3 className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-[#2c1e21] font-bold">Nail Care</h3>
                  <p className="text-gray-700 font-montserrat leading-relaxed text-sm sm:text-base md:text-base">
                    Relájate con manicure y pedicure spa, elige tu estilo en acrílico, gel o dips y luce nail art impecable con acabados duraderos. Nuestro equipo cuida cada detalle para que tus manos y pies se vean elegantes.
                  </p>
                  <ul className="space-y-2 text-gray-800 font-montserrat text-xs sm:text-sm md:text-base">
                    {[
                      "Manicure & Pedicure",
                      "Acrylic & Gel Nails",
                      "Apres & Nail Art",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#b88a3b] flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <h3 className="font-playfair text-lg sm:text-xl lg:text-2xl text-[#2c1e21] font-bold">Otros servicios</h3>
                  <p className="text-gray-700 font-montserrat leading-relaxed text-xs sm:text-sm md:text-base">
                    Combina tus citas de uñas con faciales, tratamientos de piel. Personalizamos cada sesión para que te sientas cuidada de pies a cabeza.
                  </p>
                  <ul className="space-y-1.5 text-gray-800 font-montserrat text-xs sm:text-sm md:text-base">
                    {[
                      "Waxing services",
                      "Facial treatments",
                      "Hair treatments",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#b88a3b] flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="rounded-full bg-black text-white hover:bg-[#d63d7a] hover:text-white px-5 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-3 lg:px-9 lg:py-3.5 text-xs sm:text-sm md:text-base font-semibold w-fit"
                  >
                    <Link href="/servicios">Explorar más</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-20 sm:py-24 bg-gradient-to-b from-white via-[#fff7fb] to-white relative overflow-hidden">
        <div className="absolute top-[-120px] left-[-80px] w-[28rem] h-[28rem] bg-[#ffe6f2] rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-120px] right-[-100px] w-[28rem] h-[28rem] bg-[#ffeaf5] rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Resultados que hablan por sí mismos
            </h2>
            <p className="text-gray-600 mb-10 sm:mb-12 max-w-2xl mx-auto font-montserrat text-sm sm:text-base md:text-lg">
              Looks frescos, piel luminosa y peinados con movimiento natural creados por nuestro equipo.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {portfolioImages.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-3xl shadow-soft hover:shadow-elegant transition-all cursor-pointer hover:-translate-y-1"
              >
                <NextImage
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 45vw, (max-width: 1024px) 23vw, 260px"
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#ff9fc6]/85 via-[#ff9fc6]/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <Instagram className="text-white" size={32} />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <Button
              asChild
              className="rounded-full bg-black text-white hover:bg-[#d63d7a] hover:text-white px-8 py-4 md:px-12 md:py-6 text-base md:text-xl font-semibold"
            >
              <Link href="/portafolio">Ver Galería Completa</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-gradient-to-br from-[#fff6f8] via-[#f7dde5] to-[#f3cedb] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-[#2c1e21] mb-4">
              Testimonios
            </h2>
            <p className="text-gray-700 font-montserrat text-base md:text-lg">
              Lo que nuestras clientas cuentan de su experiencia en Copper.
            </p>
          </div>

          {/* Mobile: slider showing one testimonial; Desktop: grid of 3 */}
          <TestimonialsSlider
            reviews={[
              { name: "María González", comment: "Mi experiencia fue increíble. Salí con el cabello perfecto y súper relajada." },
              { name: "Deb Alison", comment: "Me encanta cómo se siente mi piel después del facial. Suave y luminosa." },
              { name: "María Soreno", comment: "El equipo es amable y los servicios de uñas son top." },
              { name: "Helen Trenton", comment: "Los servicios son impecables y el ambiente es muy tranquilo." },
              { name: "Julia Ferrano", comment: "El staff es muy talentoso y cercano. Siempre quedo feliz." },
              { name: "Celine De Noer", comment: "Recomiendo Copper para eventos. Maquillaje y peinado perfectos." },
            ]}
          />

          <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { name: "María González", comment: "Mi experiencia fue increíble. Salí con el cabello perfecto y súper relajada." },
              { name: "Deb Alison", comment: "Me encanta cómo se siente mi piel después del facial. Suave y luminosa." },
              { name: "María Soreno", comment: "El equipo es amable y los servicios de uñas son top." },
              { name: "Helen Trenton", comment: "Los servicios son impecables y el ambiente es muy tranquilo." },
              { name: "Julia Ferrano", comment: "El staff es muy talentoso y cercano. Siempre quedo feliz." },
              { name: "Celine De Noer", comment: "Recomiendo Copper para eventos. Maquillaje y peinado perfectos." },
            ].map((review, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-soft border border-[#f0dde4] hover:shadow-elegant transition-all"
              >
                <div className="flex gap-1 mb-4 text-[#d4a36f] text-lg">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M12 21s-6.716-4.44-9.567-9.01C.65 9.788.948 6.706 3.05 4.844c1.884-1.667 4.72-1.328 6.313.51L12 7.8l2.637-2.446c1.593-1.838 4.429-2.177 6.313-.51 2.102 1.862 2.4 4.944.617 7.146C18.716 16.56 12 21 12 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 font-montserrat text-sm leading-relaxed mb-4">
                  {review.comment}
                </p>
                <p className="font-montserrat font-semibold text-[#2c1e21] text-sm">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
