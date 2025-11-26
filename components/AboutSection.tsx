"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Heart, Shield, Sparkles, Award, Users, Star, TrendingUp } from "lucide-react";

export default function AboutSection() {
  const stats = [
    { value: "5+", label: "Años de experiencia", icon: Award },
    { value: "3K", label: "Servicios realizados", icon: Users },
    { value: "4.9", label: "Puntuación promedio", icon: Star },
  ];

  const reasons = [
    {
      icon: CheckCircle,
      title: "Profesionales Certificados",
      description: "Nuestro equipo cuenta con más de 10 años de experiencia y certificaciones internacionales.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Heart,
      title: "Experiencia Agradable",
      description: "Ambiente relajante y acogedor diseñado para que disfrutes cada momento de tu visita.",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: Sparkles,
      title: "Productos de Calidad",
      description: "Utilizamos solo productos premium de las mejores marcas para garantizar resultados excepcionales.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Shield,
      title: "Higiene y Seguridad",
      description: "Protocolos estrictos de limpieza y desinfección para tu tranquilidad y bienestar.",
      color: "from-green-500 to-emerald-600"
    },
  ];

  return (
    <section className="py-24 bg-copper-gradient relative overflow-hidden" id="sobre-nosotros">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#E46768]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          {/* Text Content */}
          <div className="space-y-8 animate-slide-in-left">
            <div>
              <span className="text-sm font-montserrat font-medium text-[#E46768] uppercase tracking-wider">
                Sobre Nosotros
              </span>
            </div>
            
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Copper Beauty Salon{" "}
              <span className="text-gradient-copper bg-gradient-to-r from-[#E46768] to-[#BE5A5B] bg-clip-text text-transparent">
                & Spa
              </span>
            </h2>
            
            <div className="space-y-5 text-gray-700 leading-relaxed font-montserrat">
              <p className="text-lg">
                En <span className="font-bold text-[#E46768]">Copper Beauty Salon & Spa</span> cada cita es un momento de cuidado real: te escuchamos, entendemos tu estilo y creamos un look que te haga sentir cómoda y segura desde el primer minuto.
              </p>
              <p className="text-lg">
                Nuestra firma es la <span className="font-semibold">personalización</span>. Elegimos técnicas y productos premium según tu cabello, piel y uñas para lograr un acabado limpio, elegante y duradero.
              </p>
              <p className="text-lg">
                En Copper, el trato es <span className="font-semibold text-[#E46768]">cálido, profesional</span> y pensado para que salgas viéndote increíble… y sintiéndote aún mejor.
              </p>
            </div>
          </div>

          {/* Image and Stats */}
          <div className="space-y-4 animate-slide-in-right">
            <div className="relative rounded-3xl overflow-hidden shadow-elegant hover-lift">
              <img
                src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069"
                alt="Copper Salon Interior"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-dark backdrop-blur-xl p-4 rounded-2xl border border-white/20">
                  <p className="text-white font-playfair text-lg italic">
                    "Tu belleza, nuestra pasión"
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards - Compact squares below image */}
            <div className="flex justify-center gap-2">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-white/90 backdrop-blur-sm border border-white shadow-sm hover:shadow-md transition-all rounded-lg p-3 w-24 h-24 flex flex-col items-center justify-center"
                  >
                    <div className="w-6 h-6 bg-[#E46768]/10 rounded-md flex items-center justify-center mb-1.5">
                      <Icon size={12} className="text-[#E46768]" />
                    </div>
                    <div className="font-montserrat text-base font-semibold text-gray-800">
                      {stat.value}
                    </div>
                    <div className="text-[8px] text-gray-500 font-montserrat leading-tight text-center">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Why Choose Copper - Minimalist Cards */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              ¿Por Qué Elegir Copper?
            </h3>
            <div className="w-16 h-0.5 bg-[#E46768] mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <Card 
                  key={index} 
                  className="group bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Subtle Top Border */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${reason.color} opacity-60`}></div>
                  
                  <CardContent className="p-5 text-center space-y-3 relative">
                    <div className="flex justify-center">
                      <div className={`bg-gradient-to-br ${reason.color} p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                        <Icon className="text-white" size={18} />
                      </div>
                    </div>
                    <h4 className="font-playfair text-base font-bold text-gray-900">
                      {reason.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-montserrat">
                      {reason.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
