"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Sparkles, Minus, X, Loader2 } from "lucide-react";
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
  const [openCategory, setOpenCategory] = useState<string>("");
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
        const [{ data: catData, error: catError }, { data: svcData, error: svcError }] = await Promise.all([
          supabase
            .from("service_categories")
            .select("id,name,description,display_order,active")
            .eq("active", true)
            .order("display_order", { ascending: true }),
          supabase
            .from("services")
            .select("id,category,name,description,duration_minutes,price,active")
            .eq("active", true)
            .order("category", { ascending: true })
            .order("name", { ascending: true }),
        ]);

        if (catError) throw catError;
        if (svcError) throw svcError;

        const grouped = new Map<string, typeof servicesData[number]["services"]>();
        (svcData || []).forEach((svc) => {
          const key = svc.category || "Otros";
          const current = grouped.get(key) || [];
          current.push({
            id: String(svc.id),
            name: svc.name || "",
            description: svc.description || "",
            price: Number(svc.price || 0),
            duration: svc.duration_minutes || 0,
          });
          grouped.set(key, current);
        });

        const normalizedCats =
          (catData || []).map((cat) => ({
            id: String(cat.id),
            name: cat.name || "Sin categoría",
            description: cat.description || "",
            image: "",
            services: grouped.get(cat.name) || [],
          })) || [];

        // Add categories from services not present in service_categories
        grouped.forEach((services, name) => {
          const exists = normalizedCats.find((c) => c.name === name);
          if (!exists) {
            normalizedCats.push({
              id: name,
              name,
              description: "",
              image: "",
              services,
            });
          }
        });

        setCategories(normalizedCats.length ? normalizedCats : servicesData);
        if (normalizedCats.length) {
          setOpenCategory(normalizedCats[0].id);
        } else {
          setOpenCategory(servicesData[0].id);
        }
      } catch (err: any) {
        console.error("Error cargando servicios:", err);
        setError("No pudimos cargar los servicios. Intenta nuevamente.");
        setCategories(servicesData);
        setOpenCategory(servicesData[0].id);
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
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute top-10 -left-16 w-64 h-64 bg-[#ffe6f2] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 right-0 w-72 h-72 bg-[#ffeaf5] rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-8 sm:p-10">
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-[#1f1a1c] mb-4">
              Nuestros Servicios
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-montserrat">
              Elige tus tratamientos favoritos, combínalos y agenda en un solo flujo.
            </p>
          </div>
        </div>
      </section>

      {/* Category Accordions */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[2fr,1fr] gap-6 lg:gap-10">
            <div className="space-y-5">
              {loading && (
                <div className="flex items-center gap-3 text-[#1f1a1c] font-montserrat">
                  <Loader2 className="animate-spin" size={18} />
                  Cargando servicios...
                </div>
            )}
            {error && (
              <div className="text-red-600 font-montserrat text-sm">
                {error}
              </div>
            )}
            {!loading && categories.map((category) => {
              const isOpen = openCategory === category.id;
              return (
                <div
                  key={category.id}
                  className="rounded-3xl overflow-hidden shadow-elegant border border-[#f7dce9] bg-white/90 backdrop-blur-sm transition-transform hover:-translate-y-1"
                >
                  <button
                    className="w-full flex items-center justify-between bg-[#fde5f0] px-5 sm:px-6 py-4 text-left"
                    onClick={() => setOpenCategory(isOpen ? "" : category.id)}
                  >
                    <div>
                      <p className="font-playfair text-xl sm:text-2xl text-[#1f1a1c] font-bold">
                        {category.name}
                      </p>
                      <p className="text-sm text-[#1f1a1c]/70 font-montserrat">
                        {category.description}
                      </p>
                    </div>
                    {isOpen ? (
                      <Minus className="text-[#1f1a1c]" />
                    ) : (
                      <X className="text-[#1f1a1c]" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="bg-[#fcf9fb] px-4 sm:px-6 py-5 space-y-3">
                      {category.services.map((service) => {
                        const isSelected = selectedServices.includes(service.id);
                        return (
                          <div
                            key={service.id}
                            className="flex items-center gap-3 sm:gap-4 rounded-xl px-3 sm:px-4 py-3 bg-white border border-[#f1e4e9] shadow-soft"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                <span className="font-playfair text-lg text-[#1f1a1c] font-semibold whitespace-nowrap">
                                  {service.name}
                                </span>
                                <div className="border-b border-dotted border-[#0d2b17]/40 flex-1"></div>
                                <span className="font-playfair text-lg text-[#1f1a1c] font-semibold whitespace-nowrap">
                                  {formatPrice(service.price)}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-[#1f1a1c]/70 mt-2 font-montserrat">
                                <div className="flex items-center gap-1">
                                  <Clock size={14} />
                                  <span>{service.duration} min</span>
                                </div>
                                {service.note && (
                                  <Badge className="bg-[#e7f5ed] text-[#0d2b17] border-none">
                                    {service.note}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              onClick={() => toggleService(service.id)}
                              className={`whitespace-nowrap font-semibold rounded-xl shadow-soft px-4 ${
                                isSelected
                                  ? "bg-[#e46768] text-white hover:bg-[#d55b5c]"
                                  : "bg-[#0d2b17] text-white hover:bg-[#0b2514]"
                              }`}
                            >
                              {isSelected ? "Quitar" : "Agregar"}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-28 rounded-3xl bg-white/90 backdrop-blur-sm border border-white/60 shadow-elegant p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-playfair text-2xl font-bold text-[#1f1a1c]">
                    Tu selección
                  </h3>
                  <Badge className="bg-[#e7f5ed] text-[#0d2b17] border-none">
                    {selectedServices.length} servicios
                  </Badge>
                </div>
                {selectedDetails.length === 0 ? (
                  <p className="text-sm text-gray-600 font-montserrat">
                    Agrega servicios para ver el resumen aquí.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedDetails.map((svc) => (
                      <div
                        key={svc.id}
                        className="flex items-center justify-between text-sm font-montserrat border-b border-[#f1e4e9] pb-2"
                      >
                        <div>
                          <p className="font-semibold text-[#1f1a1c]">{svc.name}</p>
                          <p className="text-xs text-gray-500">{svc.duration} min</p>
                        </div>
                        <span className="font-semibold text-[#1f1a1c]">
                          {formatPrice(svc.price)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 space-y-1 text-sm font-montserrat">
                      <div className="flex justify-between text-gray-600">
                        <span>Duración total</span>
                        <span className="font-semibold text-[#1f1a1c]">{duration} min</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-[#e46768]">
                        <span>Total estimado</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-[#e46768] text-white hover:bg-[#d55b5c]"
                      size="lg"
                      onClick={handleReserve}
                      disabled={!selectedServices.length}
                    >
                      Continuar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Booking Summary */}
      {/* Banner fijo solo en mobile se mantiene; removido en desktop */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1f1a1c] text-white py-4 shadow-2xl z-40 lg:hidden">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-gray-400">Servicios</div>
                <div className="font-semibold text-sm">{selectedServices.length} seleccionados</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Total</div>
                <div className="font-bold text-lg text-[#E46768]">{formatPrice(total)}</div>
              </div>
              <Button
                className="bg-[#e46768] text-white hover:bg-[#d55b5c]"
                size="sm"
                onClick={handleReserve}
                disabled={!selectedServices.length}
              >
                Reservar
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
