"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader2, ChevronDown, Sparkles, Tag } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  name: string;
  description?: string;
  display_order?: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category_id: string;
  active: boolean;
}

interface Promotion {
  id: number;
  title: string;
  description: string;
  discount_percentage?: number;
  discount_amount?: number;
  valid_until?: string;
}

interface CategoryWithServices extends Category {
  services: Service[];
}

export default function ServicesPage() {
  const [categories, setCategories] = useState<CategoryWithServices[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPromotions, setSelectedPromotions] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catsRes, servsRes, promosRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/services"),
        fetch("/api/promotions/active"),
      ]);

      if (catsRes.ok && servsRes.ok) {
        const catsData: Category[] = await catsRes.json();
        const servsData: { services: Service[] } = await servsRes.json();
        
        const servicesList = servsData.services || [];

        // Group services by category
        const grouped = catsData.map(cat => ({
          ...cat,
          services: servicesList.filter(s => String(s.category_id) === String(cat.id) && s.active)
        })).filter(cat => cat.services.length > 0); // Only show categories with services

        setCategories(grouped);
        
        // Set initial expanded category
        if (promosRes.ok) {
            const promosData = await promosRes.json();
            const activePromos = promosData.promotions || [];
            setPromotions(activePromos);
            
            // If there are promotions, expand the promotions section by default (we'll use 'promotions' as ID)
            // Otherwise expand the first category
            if (activePromos.length > 0) {
                setExpandedCategory('promotions');
            } else if (grouped.length > 0) {
                setExpandedCategory(grouped[0].id);
            }
        } else if (grouped.length > 0) {
            setExpandedCategory(grouped[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const togglePromotion = (promoId: string) => {
    setSelectedPromotions(prev => 
      prev.includes(promoId) 
        ? prev.filter(id => id !== promoId)
        : [...prev, promoId]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574"
            alt="Salon Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-times text-5xl md:text-7xl mb-6"
          >
            Nuestros Servicios
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto font-light"
          >
            Experiencias de belleza diseñadas para resaltar tu estilo único
          </motion.p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-pink-600" size={48} />
          </div>
        ) : categories.length === 0 && promotions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay servicios disponibles en este momento.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Promotions Section */}
            {promotions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-pink-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-pink-50/30"
              >
                <button
                  onClick={() => toggleCategory('promotions')}
                  className="w-full flex items-center justify-between p-6 hover:bg-pink-50/50 transition-colors text-left"
                >
                  <div>
                    <h2 className="text-2xl font-times font-bold text-pink-800 flex items-center gap-3">
                      <Sparkles className="text-pink-600" size={24} />
                      Promociones Especiales
                      <Badge className="text-xs font-normal bg-pink-600 text-white hover:bg-pink-700 border-none">
                        {promotions.length} ofertas
                      </Badge>
                    </h2>
                    <p className="text-pink-600/80 mt-1 text-sm">Ofertas por tiempo limitado</p>
                  </div>
                  <ChevronDown
                    className={`text-pink-400 transition-transform duration-300 ${
                      expandedCategory === 'promotions' ? "rotate-180" : ""
                    }`}
                    size={24}
                  />
                </button>

                <AnimatePresence>
                  {expandedCategory === 'promotions' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 border-t border-pink-100">
                        <div className="grid gap-4 mt-4">
                          {promotions.map((promo) => (
                            <div
                              key={promo.id}
                              className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-lg border border-pink-100 hover:border-pink-300 transition-colors group shadow-sm"
                            >
                              <div className="flex-1 pr-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-gray-900 group-hover:text-pink-700 transition-colors flex items-center gap-2">
                                    {promo.title}
                                    <Tag size={14} className="text-pink-500" />
                                  </h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">
                                  {promo.description}
                                </p>
                                {promo.valid_until && (
                                  <p className="text-xs text-pink-500 font-medium">
                                    Válido hasta: {new Date(promo.valid_until).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0 min-w-[140px]">
                                <div className="text-right">
                                  {promo.discount_amount && (
                                    <span className="text-lg font-bold text-pink-600 block">
                                      -${promo.discount_amount}
                                    </span>
                                  )}
                                  {promo.discount_percentage && (
                                    <span className="text-lg font-bold text-pink-600 block">
                                      -{promo.discount_percentage}%
                                    </span>
                                  )}
                                </div>
                                <Button 
                                  size="sm" 
                                  className={`${
                                    selectedPromotions.includes(String(promo.id))
                                      ? "bg-pink-600 hover:bg-pink-700 text-white"
                                      : "bg-white text-pink-600 border border-pink-200 hover:bg-pink-50"
                                  }`}
                                  onClick={() => togglePromotion(String(promo.id))}
                                >
                                  {selectedPromotions.includes(String(promo.id)) ? "Seleccionada" : "Seleccionar"}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <h2 className="text-2xl font-times font-bold text-gray-900 flex items-center gap-3">
                      {category.name}
                      <Badge className="text-xs font-normal bg-pink-50 text-pink-700 hover:bg-pink-100">
                        {category.services.length} servicios
                      </Badge>
                    </h2>
                    {category.description && (
                      <p className="text-gray-500 mt-1 text-sm">{category.description}</p>
                    )}
                  </div>
                  <ChevronDown
                    className={`text-gray-400 transition-transform duration-300 ${
                      expandedCategory === category.id ? "rotate-180" : ""
                    }`}
                    size={24}
                  />
                </button>

                <AnimatePresence>
                  {expandedCategory === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50/30">
                        <div className="grid gap-4 mt-4">
                          {category.services.map((service) => (
                            <div
                              key={service.id}
                              className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:border-pink-200 transition-colors group"
                            >
                              <div className="flex-1 pr-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-gray-900 group-hover:text-pink-700 transition-colors">
                                    {service.name}
                                  </h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">
                                  {service.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {service.duration_minutes} min
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0 min-w-[140px]">
                                <span className="text-lg font-bold text-gray-900">
                                  ${service.price}
                                </span>
                                <Button 
                                  size="sm" 
                                  className={`${
                                    selectedServices.includes(service.id)
                                      ? "bg-pink-600 hover:bg-pink-700 text-white"
                                      : "bg-white text-black border border-gray-300 hover:bg-gray-50"
                                  }`}
                                  onClick={() => toggleService(service.id)}
                                >
                                  {selectedServices.includes(service.id) ? "Seleccionado" : "Seleccionar"}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Booking Bar */}
      <AnimatePresence>
        {(selectedServices.length > 0 || selectedPromotions.length > 0) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 p-4 pb-8 md:pb-4"
          >
            <div className="container mx-auto flex items-center justify-between max-w-4xl">
              <div>
                <p className="font-bold text-gray-900 text-lg">
                  {selectedServices.length + selectedPromotions.length} item{(selectedServices.length + selectedPromotions.length) !== 1 ? 's' : ''} seleccionado{(selectedServices.length + selectedPromotions.length) !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Continúa para elegir fecha y hora
                </p>
              </div>
              <Link href={`/reservar?services=${selectedServices.join(',')}&promotions=${selectedPromotions.join(',')}`}>
                <Button className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                  Reservar Cita
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
