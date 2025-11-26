"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Servicios", href: "/servicios" },
    { label: "Portafolio", href: "/portafolio" },
    { label: "Contacto", href: "/contacto" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass-effect backdrop-blur-2xl shadow-elegant border-b border-white/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Premium Style */}
          <Link href="/" className="group flex flex-col items-start transition-transform hover:scale-105">
            <div className="flex items-baseline">
              <span className={`font-playfair text-3xl font-bold tracking-wide transition-colors ${
                isScrolled ? "text-[#E46768]" : "text-white drop-shadow-lg"
              }`}>
                Copper
              </span>
            </div>
            <div className="flex items-center gap-1.5 -mt-1">
              <span className={`font-serif text-xs transition-colors ${
                isScrolled ? "text-gray-700" : "text-white/90 drop-shadow"
              }`}>
                Beauty Salon
              </span>
              <span className={`font-serif italic text-xs transition-colors ${
                isScrolled ? "text-gray-600" : "text-white/80"
              }`}>
                &
              </span>
              <span className={`font-serif text-xs transition-colors ${
                isScrolled ? "text-gray-700" : "text-white/90 drop-shadow"
              }`}>
                Spa
              </span>
            </div>
          </Link>

          {/* Desktop Menu - Premium Style */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-montserrat font-medium transition-all hover:scale-105 relative group ${
                  isScrolled 
                    ? "text-gray-700 hover:text-[#E46768]" 
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
              className={`rounded-full font-montserrat font-semibold shadow-copper hover:shadow-elegant transition-all hover:scale-105 ${
                isScrolled 
                  ? "bg-gradient-copper-primary text-white" 
                  : "glass-effect text-white border-white/30 hover:bg-white/20"
              }`}
            >
              <Link href="/reservar" className="flex items-center gap-2">
                <Phone size={16} />
                Reservar Cita
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden transition-colors p-2 rounded-lg ${
              isScrolled 
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
          <div className="md:hidden glass-effect backdrop-blur-2xl border-t border-white/10 py-6 animate-fade-in rounded-b-3xl shadow-elegant">
            <nav className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-montserrat font-medium transition-colors px-6 py-2 rounded-lg hover:bg-white/10 ${
                    isScrolled ? "text-gray-700" : "text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-6 pt-2">
                <Button 
                  asChild 
                  className="w-full rounded-full bg-gradient-copper-primary text-white font-montserrat font-semibold shadow-copper hover:shadow-elegant"
                >
                  <Link href="/reservar" className="flex items-center justify-center gap-2">
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
