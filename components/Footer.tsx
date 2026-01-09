"use client";

import Link from "next/link";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { FaTiktok, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const quickLinks = [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/servicios" },
    { label: "Reservas", href: "/reservar" },
    { label: "Promociones", href: "/promociones" },
    { label: "Contacto", href: "/contacto" },
  ];

  const contactInfo = [
    { 
      icon: MapPin, 
      text: "5 SW 107th Ave, Miami, FL 33174",
      href: "https://maps.google.com/?q=5+SW+107th+Ave,+Miami,+FL+33174"
    },
    { 
      icon: Phone, 
      text: "(786) 409-2226",
      href: "tel:+17864092226"
    },
    { 
      icon: Mail, 
      text: "copperbeauty21@gmail.com",
      href: "mailto:copperbeauty21@gmail.com"
    },
  ];

  const socialLinks = [
    { 
      name: "Instagram", 
      icon: Instagram, 
      href: "https://www.instagram.com/copper_beauty_salon_spa",
      color: "hover:bg-white/10"
    },
    { 
      name: "TikTok", 
      icon: FaTiktok, 
      href: "https://www.tiktok.com/@copperbeautysalon",
      color: "hover:bg-white/10"
    },
    { 
      name: "WhatsApp", 
      icon: FaWhatsapp, 
      href: "https://wa.me/17864092226",
      color: "hover:bg-white/10"
    },
  ];

  return (
    <footer className="bg-black text-white mt-10 relative z-10 w-full">
      <div className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 items-start">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col items-start">
              <div className="flex items-baseline gap-1">
                <span className="font-playfair text-3xl lg:text-4xl font-bold text-[#d63d7a] tracking-wide">
                  Copper
                </span>
              </div>
              <div className="flex items-center gap-1 -mt-1">
                <span className="font-times text-sm lg:text-base tracking-wider text-white">
                  Beauty Salon
                </span>
                <span className="font-playfair italic text-sm lg:text-base text-white/80">&</span>
                <span className="font-times text-sm lg:text-base tracking-wider text-white">
                  Spa
                </span>
              </div>
            </Link>
            <p className="text-white/70 text-sm lg:text-base leading-relaxed max-w-md">
              Tu destino de belleza en Miami. Especialistas en cabello, maquillaje, uñas y tratamientos faciales con un estilo femenino y elegante.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 lg:p-3.5 rounded-full border border-white/15 bg-white/5 text-white transition-colors ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-xl lg:text-2xl font-bold mb-6 text-white">Enlaces rápidos</h3>
            <ul className="space-y-3 text-base lg:text-lg">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors font-montserrat"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-playfair text-xl lg:text-2xl font-bold mb-6 text-white">Contacto</h3>
            <ul className="space-y-4 text-base lg:text-lg">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <li key={index}>
                    <a
                      href={info.href}
                      target={info.icon === MapPin ? "_blank" : undefined}
                      rel={info.icon === MapPin ? "noopener noreferrer" : undefined}
                      className="flex items-start gap-3 text-white/70 hover:text-white transition-colors"
                    >
                      <Icon size={20} className="mt-1 flex-shrink-0" />
                      <span className="text-sm lg:text-base font-montserrat">{info.text}</span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6">
              <Link
                href="/admin"
                className="inline-block text-white/60 hover:text-white font-montserrat font-semibold transition-colors text-sm lg:text-base"
              >
                Copper Beaty Salon
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-white/70 font-montserrat">
                <span className="font-semibold text-white">Horario:</span>
                <br />
                Lunes - Sábado: 9:00 AM - 7:00 PM
                <br />
                <span className="text-xs text-white/50">Última cita: 5:30 PM</span>
                <br />
                Domingo: Cerrado
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm lg:text-base text-white/60">
            <p className="font-montserrat">
              © {new Date().getFullYear()} Copper Beauty Salon & Spa. Todos los derechos reservados.
            </p>
            <p className="font-montserrat">
              Diseñado por{" "}
              <a
                href="https://versa-commerce.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                versa-commerce.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
