"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Sparkles, X, Loader2, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { formatPrice } from "@/lib/utils";

// Mock data - esto se cargará de la base de datos en producción
const servicesData = [
  {
    id: "hairstyle",
    name: "CABELLO",
    description: "Cortes, color, balayage y tratamientos profesionales",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069",
    services: [
      {
        id: "1",
        name: "Corte + Estilo",
        description: "Corte profesional con blowout incluido para un acabado perfecto",
        price: 45,
        duration: 45,
        note: "Incluye blowout",
      },
      {
        id: "2",
        name: "Color Completo",
        description: "Coloración completa del cabello con productos premium",
        price: 120,
        duration: 120,
      },
      {
        id: "3",
        name: "Balayage Signature",
        description: "Técnica de balayage pintado a mano con tonalizante incluido",
        price: 220,
        duration: 180,
        note: "Tonalizante incluido",
      },
      {
        id: "4",
        name: "Keratina / Alisado",
        description: "Tratamiento de keratina para cabello liso y manejable",
        price: 260,
        duration: 150,
      },
    ],
  },
  {
    id: "nails",
    name: "UÑAS",
    description: "Manicure, pedicure y diseños de uñas",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=2087",
    services: [
      {
        id: "5",
        name: "Manicure Clásico",
        description: "Manicure tradicional con esmaltado regular",
        price: 30,
        duration: 35,
      },
      {
        id: "6",
        name: "Pedicure Spa",
        description: "Pedicure con tratamiento spa relajante",
        price: 50,
        duration: 50,
      },
      {
        id: "7",
        name: "Gel Set",
        description: "Esmaltado en gel de larga duración",
        price: 55,
        duration: 55,
        note: "Duración premium",
      },
      {
        id: "8",
        name: "Uñas Acrílicas",
        description: "Aplicación de uñas acrílicas con diseño",
        price: 75,
        duration: 75,
      },
    ],
  },
  {
    id: "cejas",
    name: "CEJAS",
    description: "Pestañas y cejas perfectas",
    image: "https://images.unsplash.com/photo-1587876931567-564ce588a903?q=80&w=2070",
    services: [
      {
        id: "9",
        name: "Extensiones de Pestañas",
        description: "Extensiones de pestañas pelo por pelo",
        price: 150,
        duration: 90,
      },
      {
        id: "10",
        name: "Lash Lift",
        description: "Permanente de pestañas naturales",
        price: 80,
        duration: 60,
      },
      {
        id: "11",
        name: "Microblading Cejas",
        description: "Diseño y microblading de cejas",
        price: 300,
        duration: 120,
      },
      {
        id: "12",
        name: "Diseño de Cejas",
        description: "Diseño y perfilado de cejas",
        price: 25,
        duration: 25,
      },
    ],
  },
  {
    id: "facial",
    name: "FACIAL",
    description: "Faciales y tratamientos para la piel",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070",
    services: [
      {
        id: "13",
        name: "Limpieza Profunda",
        description: "Limpieza facial profunda para todo tipo de piel",
        price: 95,
        duration: 60,
      },
      {
        id: "14",
        name: "Hidratación Glow",
        description: "Tratamiento hidratante para piel radiante",
        price: 110,
        duration: 70,
      },
      {
        id: "15",
        name: "Anti-Age Firming",
        description: "Tratamiento anti-edad con efecto lifting",
        price: 130,
        duration: 75,
      },
    ],
  },
  {
    id: "makeup",
    name: "MAQUILLAJE",
    description: "Maquillaje profesional para toda ocasión",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=2071",
    services: [
      {
        id: "16",
        name: "Makeup Social",
        description: "Maquillaje perfecto para eventos sociales y fiestas",
        price: 85,
        duration: 60,
      },
      {
        id: "17",
        name: "Makeup de Novia",
        description: "Maquillaje profesional para el día más especial",
        price: 180,
        duration: 120,
        note: "Prueba opcional disponible",
      },
      {
        id: "18",
        name: "Prep de Piel",
        description: "Preparación de piel antes del maquillaje",
        price: 35,
        duration: 25,
        note: "Antes del maquillaje",
      },
    ],
  },
  {
    id: "wax",
    name: "DEPILACIÓN",
    description: "Depilación con cera profesional",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070",
    services: [
      {
        id: "19",
        name: "Wax Facial",
        description: "Depilación facial (cejas, labio, mentón)",
        price: 20,
        duration: 20,
      },
      {
        id: "20",
        name: "Wax Piernas Completas",
        description: "Depilación de piernas completas",
        price: 60,
        duration: 45,
      },
      {
        id: "21",
        name: "Wax Brasileño",
        description: "Depilación brasileña completa",
        price: 65,
        duration: 30,
      },
    ],
  },
];

export default function ServiciosPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const router = useRouter();
  const [expandedCategory, setExpandedCategory] = useState<string>("");
  const [categories, setCategories] = useState<typeof servicesData>(servicesData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    let total = 0;
    let duration = 0;
    servicesData.forEach((category) => {
      category.services.forEach((service) => {
        if (selectedServices.includes(service.id)) {
          total += service.price;
          duration += service.duration;
        }
      });
    });
    return { total, duration };
  };

  const { total, duration } = calculateTotal();

  const handleReserve = () => {
    if (!selectedServices.length) return;
    const query = new URLSearchParams({
      services: selectedServices.join(","),
      step: "2",
    }).toString();
    router.push(`/reservar?${query}`);
  };

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      setError("");
      try {
        const [catResult, svcResult] = await Promise.all([
          supabase
            .from("Category")
            .select("id,name,description,order,active")
            .eq("active", true)
            .order("order", { ascending: true }),
          supabase
            .from("Service")
            .select("id,categoryId,name,description,duration,price,active")
            .eq("active", true)
            .order("categoryId", { ascending: true })
            .order("name", { ascending: true }),
        ]);

        const { data: catData, error: catError } = catResult;
        const { data: svcData, error: svcError } = svcResult;

        // Si hay error en categorías o servicios, usar datos por defecto
        if (catError || svcError) {
          console.warn("Error cargando de Supabase, usando datos por defecto", { catError, svcError });
          setCategories(servicesData);
          setExpandedCategory(servicesData[0].id);
          setLoading(false);
          return;
        }

        // Si no hay datos, usar datos por defecto
        if (!catData || !svcData) {
          console.warn("Sin datos de Supabase, usando datos por defecto");
          setCategories(servicesData);
          setExpandedCategory(servicesData[0].id);
          setLoading(false);
          return;
        }

        const grouped = new Map<string, typeof servicesData[number]["services"]>();
        (svcData || []).forEach((svc) => {
          const key = svc.categoryId || "Otros";
          const current = grouped.get(key) || [];
          current.push({
            id: String(svc.id),
            name: svc.name || "",
            description: svc.description || "",
            price: Number(svc.price || 0),
            duration: svc.duration || 0,
          });
          grouped.set(key, current);
        });

        const normalizedCats =
          (catData || []).map((cat) => ({
            id: String(cat.id),
            name: cat.name || "Sin categoría",
            description: cat.description || "",
            image: "",
            services: grouped.get(cat.id) || [],
          })) || [];

        // Add categories from services not present in service_categories
        grouped.forEach((services, catId) => {
          const exists = normalizedCats.find((c) => c.id === catId);
          if (!exists) {
            normalizedCats.push({
              id: catId,
              name: catId,
              description: "",
              image: "",
              services,
            });
          }
        });

        setCategories(normalizedCats.length ? normalizedCats : servicesData);
        if (normalizedCats.length) {
          setExpandedCategory(normalizedCats[0].id);
        } else {
          setExpandedCategory(servicesData[0].id);
        }
      } catch (err: any) {
        console.error("Error cargando servicios:", err?.message || err);
        // En caso de error, usar datos por defecto sin mostrar error
        setCategories(servicesData);
        setExpandedCategory(servicesData[0].id);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const selectedDetails = useMemo(() => {
    const list: { id: string; name: string; price: number; duration: number }[] = [];
    categories.forEach((cat) => {
      cat.services.forEach((svc) => {
        if (selectedServices.includes(svc.id)) {
          list.push({
            id: svc.id,
            name: svc.name,
            price: svc.price,
            duration: svc.duration,
          });
        }
      });
    });
    return list;
  }, [categories, selectedServices]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#fff7fb] to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-10 md:pt-32 md:pb-12 relative overflow-hidden">
        <div className="absolute top-10 -left-16 w-64 h-64 bg-[#ffe6f2] rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-24 right-0 w-72 h-72 bg-[#ffeaf5] rounded-full blur-3xl opacity-60"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#1f1a1c] mb-3">
              Nuestros Servicios
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 font-montserrat">
              Elige tus tratamientos favoritos y agenda tu cita hoy
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            
            {/* Services Grid */}
            <div className="md:col-span-2 lg:col-span-3 space-y-4">
              {loading && (
                <div className="flex items-center justify-center gap-3 text-[#1f1a1c] font-montserrat py-8">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Cargando servicios...</span>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl font-montserrat text-sm">
                  {error}
                </div>
              )}
              
              {!loading && categories.map((category) => {
                const isExpanded = expandedCategory === category.id;
                return (
                  <div key={category.id} className="rounded-2xl overflow-hidden bg-white/90 border border-[#f7dce9] shadow-soft">
                    {/* Category Header */}
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? "" : category.id)}
                      className="w-full flex items-center justify-between bg-gradient-to-r from-[#fde5f0] to-[#fcf0f6] px-4 sm:px-6 py-4 hover:from-[#fcd8ec] hover:to-[#fbe8f3] transition-colors"
                    >
                      <div className="text-left">
                        <p className="font-playfair text-lg sm:text-xl font-bold text-[#1f1a1c]">
                          {category.name}
                        </p>
                        <p className="text-xs sm:text-sm text-[#1f1a1c]/70 font-montserrat mt-1">
                          {category.description}
                        </p>
                      </div>
                      <ChevronDown 
                        className={`flex-shrink-0 text-[#1f1a1c] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        size={20}
                      />
                    </button>

                    {/* Services List */}
                    {isExpanded && (
                      <div className="bg-white px-4 sm:px-6 py-4 space-y-3 max-h-96 overflow-y-auto">
                        {category.services.map((service) => {
                          const isSelected = selectedServices.includes(service.id);
                          return (
                            <div
                              key={service.id}
                              className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-[#f1e4e9] hover:border-[#e46768]/50 hover:bg-[#fef8fa] transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className="font-playfair font-semibold text-[#1f1a1c] text-sm sm:text-base">
                                  {service.name}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 font-montserrat mt-1 line-clamp-2">
                                  {service.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-montserrat">
                                    <Clock size={12} />
                                    {service.duration}m
                                  </span>
                                  {service.note && (
                                    <Badge className="bg-[#e7f5ed] text-[#0d2b17] border-none text-xs">
                                      {service.note}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <span className="font-playfair font-bold text-[#1f1a1c] text-base sm:text-lg">
                                  {formatPrice(service.price)}
                                </span>
                                <Button
                                  onClick={() => toggleService(service.id)}
                                  size="sm"
                                  className={`text-xs sm:text-sm rounded-lg font-semibold transition-all ${
                                    isSelected
                                      ? "bg-[#e46768] text-white hover:bg-[#d55b5c]"
                                      : "bg-[#0d2b17] text-white hover:bg-[#0b2514]"
                                  }`}
                                >
                                  {isSelected ? "Quitar" : "Agregar"}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sidebar Summary - Desktop */}
            <div className="hidden md:block md:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-white/95 border border-[#f7dce9] shadow-soft p-5 space-y-4">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-[#1f1a1c]">
                    Tu Selección
                  </h3>
                  {selectedServices.length > 0 && (
                    <Badge className="bg-[#e46768] text-white border-none mt-2">
                      {selectedServices.length} servicio{selectedServices.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                {selectedDetails.length === 0 ? (
                  <p className="text-xs sm:text-sm text-gray-500 font-montserrat py-4 text-center">
                    Agrega servicios para ver el resumen
                  </p>
                ) : (
                  <>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedDetails.map((svc) => (
                        <div
                          key={svc.id}
                          className="flex items-start justify-between gap-2 text-xs sm:text-sm font-montserrat border-b border-[#f1e4e9] pb-2"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#1f1a1c] truncate">
                              {svc.name}
                            </p>
                            <p className="text-gray-500 text-xs">{svc.duration}m</p>
                          </div>
                          <span className="font-semibold text-[#1f1a1c] flex-shrink-0">
                            {formatPrice(svc.price)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#f1e4e9] pt-3 space-y-2 text-sm font-montserrat">
                      <div className="flex justify-between text-gray-600">
                        <span>Duración total</span>
                        <span className="font-semibold text-[#1f1a1c]">{duration}m</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-[#e46768]">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-[#e46768] text-white hover:bg-[#d55b5c] font-semibold"
                      onClick={handleReserve}
                      disabled={!selectedServices.length}
                    >
                      Reservar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Bottom Bar */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1f1a1c] text-white shadow-2xl z-40 md:hidden">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="text-xs text-gray-400 font-montserrat">Total</div>
                <div className="font-bold text-lg text-[#e46768]">{formatPrice(total)}</div>
              </div>
              <Button
                className="bg-[#e46768] text-white hover:bg-[#d55b5c] font-semibold"
                onClick={handleReserve}
                disabled={!selectedServices.length}
              >
                Reservar ({selectedServices.length})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Padding for mobile bar */}
      {selectedServices.length > 0 && <div className="h-20 md:h-0"></div>}

      <Footer />
    </main>
  );
}
