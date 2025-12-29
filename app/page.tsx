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

export default async function HomePage() {
  const { data: promotions } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .eq("show_on_site", true)
    .order("priority", { ascending: false });

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

          {/* Nail highlight */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center max-w-5xl mx-auto">
            <div className="space-y-3 hidden md:block">
              <span className="text-xs uppercase tracking-[0.2em] text-[#b88a3b] font-montserrat font-semibold">Nail care</span>
              <h3 className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-[#2c1e21] font-bold">Nail Care</h3>
              <p className="text-gray-700 font-montserrat leading-relaxed text-xs sm:text-sm md:text-base">
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
            <div className="relative rounded-2xl overflow-hidden shadow-elegant aspect-[4/5] max-h-[380px] w-full max-w-sm mx-auto lg:max-w-none">
              <NextImage
                src={nails}
                alt="Nail care Copper"
                className="w-full h-full object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>

          {/* Other services collage */}
          <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-6 lg:gap-8 mt-8 sm:mt-10 items-start max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
              {[
                makeup,
                cejas,
                Depilacion,
                Faciales,
              ].map((image, idx) => (
                <div
                  key={idx}
                  className={`relative overflow-hidden rounded-xl shadow-soft ${idx === 0 ? "aspect-[4/3]" : "aspect-[4/3]"}`}
                >
                  <NextImage
                    src={image}
                    alt={`Servicio ${idx + 1}`}
                    className="w-full h-full object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}
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
            {[
              "https://images.unsplash.com/photo-1560066984-138dadb4c035",
              "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e",
              "https://images.unsplash.com/photo-1562322140-8baeececf3df",
              "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2",
              "https://images.unsplash.com/photo-1604654894610-df63bc536371",
              "https://images.unsplash.com/photo-1515688594390-b649af70d282",
              "https://images.unsplash.com/photo-1522337094846-8a818192de1f",
              "https://images.unsplash.com/photo-1519699047748-de8e457a634e",
            ].map((image, index) => (
              <div
                key={index}
                className="group aspect-square relative overflow-hidden rounded-3xl shadow-soft hover:shadow-elegant transition-all cursor-pointer hover:-translate-y-1"
              >
                <NextImage
                  src={`${image}?q=80&w=400`}
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

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
