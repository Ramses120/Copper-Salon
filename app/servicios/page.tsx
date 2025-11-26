"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

// Mock data - esto se cargará de la base de datos en producción
const servicesData = [
  {
    id: "hairstyle",
    name: "HairStyle",
    description: "Cortes, color, balayage y tratamientos profesionales",
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
    id: "makeup",
    name: "Makeup",
    description: "Maquillaje profesional para toda ocasión",
    services: [
      {
        id: "5",
        name: "Makeup Social",
        description: "Maquillaje perfecto para eventos sociales y fiestas",
        price: 85,
        duration: 60,
      },
      {
        id: "6",
        name: "Makeup de Novia",
        description: "Maquillaje profesional para el día más especial",
        price: 180,
        duration: 120,
        note: "Prueba opcional disponible",
      },
      {
        id: "7",
        name: "Prep de Piel",
        description: "Preparación de piel antes del maquillaje",
        price: 35,
        duration: 25,
        note: "Antes del maquillaje",
      },
    ],
  },
  {
    id: "nail-services",
    name: "Nail Services",
    description: "Manicure, pedicure y diseños de uñas",
    services: [
      {
        id: "8",
        name: "Manicure Clásico",
        description: "Manicure tradicional con esmaltado regular",
        price: 30,
        duration: 35,
      },
      {
        id: "9",
        name: "Pedicure Spa",
        description: "Pedicure con tratamiento spa relajante",
        price: 50,
        duration: 50,
      },
      {
        id: "10",
        name: "Gel Set",
        description: "Esmaltado en gel de larga duración",
        price: 55,
        duration: 55,
        note: "Duración premium",
      },
      {
        id: "11",
        name: "Uñas Acrílicas",
        description: "Aplicación de uñas acrílicas con diseño",
        price: 75,
        duration: 75,
      },
    ],
  },
  {
    id: "skincare",
    name: "Skincare",
    description: "Faciales y tratamientos para la piel",
    services: [
      {
        id: "12",
        name: "Limpieza Profunda",
        description: "Limpieza facial profunda para todo tipo de piel",
        price: 95,
        duration: 60,
      },
      {
        id: "13",
        name: "Hidratación Glow",
        description: "Tratamiento hidratante para piel radiante",
        price: 110,
        duration: 70,
      },
      {
        id: "14",
        name: "Anti-Age Firming",
        description: "Tratamiento anti-edad con efecto lifting",
        price: 130,
        duration: 75,
      },
    ],
  },
  {
    id: "wax",
    name: "Wax",
    description: "Depilación con cera profesional",
    services: [
      {
        id: "15",
        name: "Wax Facial",
        description: "Depilación facial (cejas, labio, mentón)",
        price: 20,
        duration: 20,
      },
      {
        id: "16",
        name: "Wax Piernas Completas",
        description: "Depilación de piernas completas",
        price: 60,
        duration: 45,
      },
      {
        id: "17",
        name: "Wax Brasileño",
        description: "Depilación brasileña completa",
        price: 65,
        duration: 30,
      },
    ],
  },
  {
    id: "lashes-eyebrows",
    name: "Lashes & Eyebrows",
    description: "Pestañas y cejas perfectas",
    services: [
      {
        id: "18",
        name: "Extensiones de Pestañas",
        description: "Extensiones de pestañas pelo por pelo",
        price: 150,
        duration: 90,
      },
      {
        id: "19",
        name: "Lash Lift",
        description: "Permanente de pestañas naturales",
        price: 80,
        duration: 60,
      },
      {
        id: "20",
        name: "Microblading Cejas",
        description: "Diseño y microblading de cejas",
        price: 300,
        duration: 120,
      },
      {
        id: "21",
        name: "Diseño de Cejas",
        description: "Diseño y perfilado de cejas",
        price: 25,
        duration: 25,
      },
    ],
  },
];

export default function ServiciosPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

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

  return (
    <main className="min-h-screen bg-copper-gradient">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-times text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Nuestros Servicios
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Descubre nuestra gama completa de servicios de belleza diseñados para realzar tu belleza natural
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Accordion type="single" collapsible className="space-y-6">
              {servicesData.map((category) => (
                <AccordionItem
                  key={category.id}
                  value={category.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border-none shadow-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-6 hover:no-underline">
                    <div className="flex items-center justify-between w-full text-left">
                      <div>
                        <h2 className="font-times text-2xl md:text-3xl font-bold text-gray-900">
                          {category.name}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          {category.services.length} opciones disponibles
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <Badge className="bg-copper-red/10 text-copper-red border-copper-red/20">
                          Ver servicios
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4 pt-4">
                      {category.services.map((service) => {
                        const isSelected = selectedServices.includes(service.id);
                        return (
                          <div
                            key={service.id}
                            className={`rounded-xl border-2 p-5 transition-all ${
                              isSelected
                                ? "border-copper-red bg-copper-red/5"
                                : "border-gray-200 bg-white hover:border-copper-red/50"
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-3">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-900">
                                      {service.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {service.description}
                                    </p>
                                    {service.note && (
                                      <Badge className="mt-2 bg-gray-100 text-gray-700 border-gray-200 text-xs">
                                        {service.note}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Clock size={16} />
                                    <span>{service.duration} min</span>
                                  </div>
                                  <div className="font-semibold text-copper-red text-lg">
                                    {formatPrice(service.price)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant={isSelected ? "outline" : "default"}
                                  onClick={() => toggleService(service.id)}
                                  className={
                                    isSelected
                                      ? "border-copper-red text-copper-red hover:bg-copper-red/10"
                                      : ""
                                  }
                                >
                                  {isSelected ? "Remover" : "Agregar"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Floating Booking Summary */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white py-4 shadow-2xl z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-sm text-gray-400">Servicios seleccionados</div>
                  <div className="font-semibold">{selectedServices.length} servicios</div>
                </div>
                <div className="h-10 w-px bg-gray-700"></div>
                <div>
                  <div className="text-sm text-gray-400">Tiempo total</div>
                  <div className="font-semibold">{duration} min</div>
                </div>
                <div className="h-10 w-px bg-gray-700"></div>
                <div>
                  <div className="text-sm text-gray-400">Total estimado</div>
                  <div className="font-bold text-xl text-copper-red">
                    {formatPrice(total)}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedServices([])}
                  className="border-white text-white hover:bg-white/10"
                >
                  Limpiar
                </Button>
                <Button variant="copper" size="lg" asChild>
                  <Link href="/reservar">
                    <Sparkles className="mr-2" size={20} />
                    Reservar Ahora
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
