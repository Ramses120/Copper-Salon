"use client";

import { Promotion } from "@/types";
import NextImage from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PromotionsSectionProps {
  promotions: Promotion[];
}

export default function PromotionsSection({ promotions }: PromotionsSectionProps) {
  if (!promotions || promotions.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-[#fff5f8]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-[#b88a3b] font-montserrat text-sm font-bold tracking-widest uppercase">
            Ofertas Especiales
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#2c1e21] mt-3 mb-4">
            Promociones del Mes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-montserrat">
            Aprovecha nuestros paquetes exclusivos y descuentos por tiempo limitado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-pink-50 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                {promo.image_url ? (
                  <NextImage
                    src={promo.image_url}
                    alt={promo.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                    <Tag className="w-16 h-16 text-pink-300" />
                  </div>
                )}
                {promo.discount && (
                  <div className="absolute top-4 right-4 bg-[#b88a3b] text-white px-3 py-1 rounded-full font-bold font-montserrat text-sm shadow-md">
                    {promo.type === 'percentage' ? `-${promo.discount}%` : `$${promo.discount} OFF`}
                  </div>
                )}
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-playfair text-2xl font-bold text-[#2c1e21] mb-2">
                  {promo.name}
                </h3>
                <p className="text-gray-600 font-montserrat text-sm mb-4 flex-grow">
                  {promo.description}
                </p>

                <div className="space-y-3 mb-6">
                  {promo.special_price && (
                    <div className="flex items-center gap-2 text-[#b88a3b] font-bold text-xl">
                      <span>${promo.special_price}</span>
                      {/* Logic for original price could be added if we had it, for now just show special price */}
                    </div>
                  )}
                  
                  {promo.duration_minutes && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-montserrat">
                      <Clock className="w-4 h-4" />
                      <span>{promo.duration_minutes} min</span>
                    </div>
                  )}

                  {promo.valid_until && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-montserrat">
                      <Calendar className="w-4 h-4" />
                      <span>Válido hasta {new Date(promo.valid_until).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <Link href={`/reservar?promotionId=${promo.id}`} className="w-full">
                  <Button className="w-full bg-[#2c1e21] hover:bg-[#4a3338] text-white font-montserrat">
                    Reservar Ahora
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
