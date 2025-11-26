import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      
      {/* Services Preview Section */}
      <section className="py-24 bg-white relative overflow-hidden" id="servicios-preview">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-0 w-72 h-72 bg-[#E46768]/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Descubre Nuestros{" "}
              <span className="text-gradient-copper bg-gradient-to-r from-[#E46768] to-[#BE5A5B] bg-clip-text text-transparent">
                Servicios
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-montserrat text-lg">
              Profesionalidad, calidad y atención personalizada en cada servicio
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                title: "HairStyle",
                image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069",
                description: "Cortes, color, balayage y peinados profesionales",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                title: "Makeup",
                image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=2071",
                description: "Maquillaje para eventos, bodas y sesiones",
                gradient: "from-pink-500 to-rose-500"
              },
              {
                title: "Nail Services",
                image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=2087",
                description: "Manicure, pedicure y diseños de uñas",
                gradient: "from-rose-500 to-orange-500"
              }
            ].map((service, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-3xl shadow-elegant hover:shadow-copper transition-all duration-500 hover-lift"
              >
                <div className="aspect-[4/5] relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <div className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                      <h3 className="font-playfair text-3xl font-bold mb-3 text-white drop-shadow-lg">
                        {service.title}
                      </h3>
                      <p className="text-white/95 font-montserrat text-sm leading-relaxed mb-4 drop-shadow">
                        {service.description}
                      </p>
                      <button className="glass-effect backdrop-blur-xl px-6 py-2.5 rounded-full text-white text-sm font-montserrat font-medium border border-white/30 hover:bg-white/20 transition-all inline-flex items-center gap-2">
                        Ver más
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <a
              href="/servicios"
              className="inline-flex items-center gap-3 bg-gradient-copper-primary text-white px-10 py-5 rounded-full font-montserrat font-semibold hover:shadow-copper transition-all hover-lift text-lg"
            >
              Ver Todos los Servicios
              <span className="text-2xl">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden" id="portafolio-preview">
        {/* Decorative Elements */}
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="px-4 py-2 bg-gray-900 text-white text-sm font-montserrat font-semibold rounded-full shadow-elegant inline-block mb-6">
              Portafolio
            </span>
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Nuestro Trabajo Habla{" "}
              <span className="text-gradient-copper bg-gradient-to-r from-[#E46768] to-[#BE5A5B] bg-clip-text text-transparent">
                Por Sí Solo
              </span>
            </h2>
            <p className="text-gray-600 mb-12 max-w-2xl mx-auto font-montserrat text-lg">
              Descubre los resultados excepcionales que hemos logrado con nuestras clientas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
                className="group aspect-square relative overflow-hidden rounded-2xl shadow-soft hover:shadow-elegant transition-all cursor-pointer hover-lift"
              >
                <img
                  src={`${image}?q=80&w=400`}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#E46768]/90 via-[#E46768]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-6">
                  <div className="glass-effect backdrop-blur-xl px-5 py-2 rounded-full border border-white/30">
                    <span className="text-white font-montserrat text-sm font-medium">Ver detalles</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <a
              href="/portafolio"
              className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-full font-montserrat font-semibold hover:bg-gray-800 transition-all hover-lift shadow-elegant text-lg"
            >
              Ver Portafolio Completo
              <span className="text-2xl">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E46768]/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="px-4 py-2 bg-gradient-copper-primary text-white text-sm font-montserrat font-semibold rounded-full shadow-copper inline-block mb-6">
              Testimonios
            </span>
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Lo Que Dicen{" "}
              <span className="text-gradient-copper bg-gradient-to-r from-[#E46768] to-[#BE5A5B] bg-clip-text text-transparent">
                Nuestras Clientas
              </span>
            </h2>
            <p className="text-gray-600 font-montserrat text-lg">
              Experiencias reales de clientas satisfechas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                name: "María González",
                rating: 5,
                comment: "¡Excelente servicio! Me encantó el resultado de mi balayage. El equipo es muy profesional y el ambiente es super acogedor.",
                date: "Hace 2 semanas",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200"
              },
              {
                name: "Ana Rodríguez",
                rating: 5,
                comment: "Siempre salgo feliz de Copper. Las chicas son súper talentosas y me hacen sentir como en casa. Definitivamente mi salón favorito en Miami.",
                date: "Hace 1 mes",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
              },
              {
                name: "Sofía Martínez",
                rating: 5,
                comment: "El maquillaje para mi boda fue perfecto. Lucí espectacular gracias al equipo de Copper. 100% recomendado para eventos especiales.",
                date: "Hace 3 semanas",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200"
              }
            ].map((review, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-soft hover:shadow-elegant transition-all hover-lift border border-gray-100"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current drop-shadow"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                
                {/* Comment */}
                <p className="text-gray-700 mb-6 leading-relaxed font-montserrat italic">
                  "{review.comment}"
                </p>
                
                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <img 
                    src={review.avatar} 
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover shadow-md"
                  />
                  <div className="flex-1">
                    <p className="font-playfair font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500 font-montserrat">{review.date}</p>
                  </div>
                  {/* Quote Icon */}
                  <div className="text-[#E46768]/20 group-hover:text-[#E46768]/40 transition-colors">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
              {[
                { value: "4.9/5", label: "Calificación promedio", icon: "⭐" },
                { value: "500+", label: "Reviews positivas", icon: "💬" },
                { value: "98%", label: "Clientas satisfechas", icon: "❤️" },
                { value: "3000+", label: "Servicios realizados", icon: "✨" }
              ].map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="font-playfair text-3xl font-bold text-[#E46768]">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-montserrat">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
