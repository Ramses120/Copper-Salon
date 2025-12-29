"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeaderVariant = "default" | "light";

interface HeaderProps {
  variant?: HeaderVariant;
}

export default function Header({ variant = "default" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  const menuItems = [
    { label: "Servicios", href: "/servicios" },
    { label: "Portafolio", href: "/portafolio" },
    { label: "Contacto", href: "/contacto" },
  ];

  const isLightMode = variant === "light";

  const headerBackground =
    variant === "light"
      ? "bg-white/90 backdrop-blur-xl shadow-soft border-b border-pink-50"
      : "bg-[#1f191b]/95 backdrop-blur-md shadow-elegant border-b border-[#2f262a]";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${headerBackground}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24 lg:h-32">
          {/* Logo - Premium Style */}
          <Link href="/" className="group flex flex-col items-start transition-transform hover:scale-105">
            <div className="flex items-baseline">
              <span className="font-playfair text-4xl lg:text-5xl font-bold tracking-wide text-[#d63d7a] drop-shadow-sm">
                Copper
              </span>
            </div>
            <div className="flex items-center gap-1.5 -mt-1">
              <span className={`font-serif text-sm lg:text-base ${isLightMode ? "text-gray-700" : "text-gray-100"}`}>
                Beauty Salon
              </span>
              <span className={`font-serif italic text-sm lg:text-base ${isLightMode ? "text-gray-600" : "text-gray-200"}`}>
                &
              </span>
              <span className={`font-serif text-sm lg:text-base ${isLightMode ? "text-gray-700" : "text-gray-100"}`}>
                Spa
              </span>
            </div>
          </Link>

          {/* Desktop Menu - Premium Style */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10 absolute left-1/2 -translate-x-1/2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-montserrat font-medium text-sm lg:text-base transition-all hover:scale-105 relative group ${
                  isLightMode 
                    ? "text-gray-800 hover:text-[#E46768]" 
                    : "text-white/95 hover:text-white drop-shadow"
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-copper-primary transition-all group-hover:w-full rounded-full`}></span>
              </Link>
            ))}
            
          </nav>

          {/* Reservar Button - Right Side */}
          <div className="hidden md:block">
            <Button 
              asChild 
              className="rounded-full font-montserrat font-semibold bg-black text-white hover:bg-[#d63d7a] shadow-md transition-all hover:scale-105 px-7 py-4 text-lg lg:px-10 lg:py-5 lg:text-xl"
            >
              <Link href="/servicios" className="flex items-center gap-2">
                <Phone size={16} />
                Reservar Cita
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden transition-colors p-2 rounded-lg ${
              isLightMode 
                ? "text-gray-700 hover:bg-gray-100" 
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu - Premium Style */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden py-6 animate-fade-in rounded-b-3xl shadow-elegant ${
              isLightMode
                ? "bg-white border-t border-gray-100"
                : "glass-effect backdrop-blur-2xl border-t border-white/10"
            }`}
          >
            <nav className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-montserrat font-medium transition-colors px-6 py-2 rounded-lg ${
                    isLightMode
                      ? "text-gray-800 hover:bg-gray-50"
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-6 pt-2">
                <Button 
                  asChild 
                  className="w-full rounded-full bg-black text-white font-montserrat font-semibold shadow-md hover:bg-[#d63d7a] px-6 py-3 text-base"
                >
                  <Link href="/servicios" className="flex items-center justify-center gap-2">
                    <Phone size={16} />
                    Reservar Cita
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
