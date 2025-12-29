"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface Promotion {
  id: string;
  name: string;
  description?: string;
  discount: number;
  active: boolean;
  type?: string;
}

export default function PromoBanner() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchPromotions = async () => {
      try {
        console.log("[PromoBanner] Fetching active promotions...");
        const response = await fetch("/api/promotions/active");
        
        if (response.ok) {
          const data = await response.json();
          console.log("[PromoBanner] Promotions response:", data);
          
          const activePromos = Array.isArray(data) ? data : data.data || [];
          console.log("[PromoBanner] Active promos found:", activePromos.length);
          
          const filteredPromos = activePromos.filter((p: Promotion) => p.active);
          console.log("[PromoBanner] Filtered (active=true):", filteredPromos.length);
          
          setPromotions(filteredPromos);
        } else {
          console.error("[PromoBanner] Response not ok:", response.status);
        }
      } catch (error) {
        console.error("[PromoBanner] Error fetching promotions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [mounted]);

  // Cambiar promoción cada 5 segundos
  useEffect(() => {
    if (promotions.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [promotions.length]);

  console.log("[PromoBanner] Render state:", { loading, count: promotions.length, mounted });

  // No retornar null - retornar siempre algo para evitar "rendered more hooks" error
  if (loading || promotions.length === 0) {
    return <></>;
  }

  const currentPromo = promotions[currentPromoIndex];

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-[#d63d7a] to-[#e84a8a] text-white py-3 md:py-4 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
          {/* Promotion content */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Zap size={20} className="flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-montserrat font-semibold text-sm md:text-base truncate">
                {currentPromo.name}
              </p>
              {currentPromo.description && (
                <p className="font-montserrat text-xs md:text-sm text-white/90 truncate">
                  {currentPromo.description}
                </p>
              )}
            </div>
            <div className="flex-shrink-0 bg-white/20 px-3 py-1 rounded-full">
              <span className="font-semibold text-sm">
                {currentPromo.discount}
                {currentPromo.type === "fixed" ? "$" : "%"} OFF
              </span>
            </div>
          </div>

          {/* Reserve Button */}
          <Button
            asChild
            className="flex-shrink-0 rounded-full bg-white text-[#d63d7a] hover:bg-gray-100 font-montserrat font-semibold text-xs md:text-sm px-4 md:px-6 py-2 md:py-2.5 transition-all"
          >
            <Link href="/reservar">Reserva Ahora</Link>
          </Button>

          {/* Indicators */}
          {promotions.length > 1 && (
            <div className="flex gap-1.5 flex-shrink-0">
              {promotions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPromoIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentPromoIndex
                      ? "bg-white w-6"
                      : "bg-white/50 w-2 hover:bg-white/75"
                  }`}
                  aria-label={`Promotion ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
