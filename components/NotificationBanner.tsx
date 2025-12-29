"use client";

import { useState, useEffect } from "react";
import { X, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount_percentage?: number | null;
  discount_amount?: number | null;
  valid_until?: string;
}

export default function NotificationBanner() {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cargar promociones después de montar
  useEffect(() => {
    if (!isMounted) return;

    // Esperar 1 segundo antes de mostrar la notificación
    const showTimer = setTimeout(async () => {
      try {
        console.log('[NotificationBanner] Fetching promotions...');
        const response = await fetch("/api/promotions/active");
        
        console.log('[NotificationBanner] Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('[NotificationBanner] Data received:', data);
          
          if (data.promotions && Array.isArray(data.promotions) && data.promotions.length > 0) {
            console.log('[NotificationBanner] Setting promotion:', data.promotions[0]);
            setPromotion(data.promotions[0]);
            setIsVisible(true);
          } else if (Array.isArray(data) && data.length > 0) {
            console.log('[NotificationBanner] Setting promotion (fallback):', data[0]);
            setPromotion(data[0]);
            setIsVisible(true);
          } else {
            console.log('[NotificationBanner] No promotions found');
            setPromotion(null);
          }
        } else {
          console.log('[NotificationBanner] Response not ok');
          setPromotion(null);
        }
      } catch (error) {
        console.error("[NotificationBanner] Error fetching active promotion:", error);
        setPromotion(null);
      }
    }, 1000);
    
    return () => clearTimeout(showTimer);
  }, [isMounted]);

  // Auto-hide después de 8 segundos
  useEffect(() => {
    if (!isVisible || !promotion) return;

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => clearTimeout(hideTimer);
  }, [isVisible, promotion]);

  // Renderizar siempre, pero el contenido depende del estado
  // Evitar retorno condicional que causa "rendered more hooks" error
  
  return (
    <>
      {/* Backdrop overlay - solo cuando está visible */}
      {isMounted && promotion && isVisible && (
        <div
          className="fixed inset-0 z-40 bg-black/20 animate-fade-in"
          onClick={() => setIsVisible(false)}
        />
      )}

      {/* Toast Notification */}
      {isMounted && promotion && (
      <div
        className={`fixed bottom-6 right-6 z-50 max-w-sm w-full sm:max-w-md transition-all duration-500 ease-out ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-pink-100 backdrop-blur-xl">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-[#d63d7a] via-[#e85d8a] to-[#d63d7a] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 animate-bounce">
                <Zap className="text-white" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm sm:text-base truncate">
                  ¡Promoción Activa!
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0 text-white hover:text-white/80 transition-colors p-1"
              aria-label="Cerrar notificación"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
            <div>
              <h3 className="text-gray-900 font-bold text-sm sm:text-base mb-1">
                {promotion.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {promotion.description}
              </p>
            </div>

            {/* Discount Badge */}
            {(promotion.discount_percentage || promotion.discount_amount) && (
              <div className="flex items-center gap-2">
                {promotion.discount_percentage && (
                  <span className="inline-block bg-[#d63d7a]/10 text-[#d63d7a] px-3 py-1 rounded-full text-xs font-bold">
                    {promotion.discount_percentage}% OFF
                  </span>
                )}
                {promotion.discount_amount && (
                  <span className="inline-block bg-[#d63d7a]/10 text-[#d63d7a] px-3 py-1 rounded-full text-xs font-bold">
                    ${promotion.discount_amount} OFF
                  </span>
                )}
              </div>
            )}

            {/* Expiration */}
            {promotion.valid_until && (
              <p className="text-gray-500 text-xs">
                Válido hasta: {new Date(promotion.valid_until).toLocaleDateString("es-ES")}
              </p>
            )}

            {/* Button */}
            <Link
              href="/reservar"
              className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-[#d63d7a] text-white hover:bg-[#c82d6a] transition-all font-semibold text-sm transform ${
                isHovered ? "scale-105" : "scale-100"
              }`}
            >
              Reservar Ahora
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
