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
      text: "info@copperbeauty.com",
      href: "mailto:info@copperbeauty.com"
    },
  ];

  const socialLinks = [
    { 
      name: "Instagram", 
      icon: Instagram, 
      href: "https://www.instagram.com/copper_beauty_salon_spa",
      color: "hover:text-pink-600"
    },
    { 
      name: "TikTok", 
      icon: FaTiktok, 
      href: "https://www.tiktok.com/@copperbeautysalon",
      color: "hover:text-black"
    },
    { 
      name: "WhatsApp", 
      icon: FaWhatsapp, 
      href: "https://wa.me/17864092226",
      color: "hover:text-green-600"
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col items-start">
              <div className="flex items-baseline gap-0.5">
                <span className="font-times text-3xl font-bold text-copper-red tracking-wide">
                  Copper
                </span>
              </div>
              <div className="flex items-center gap-1 -mt-1">
                <span className="font-times text-sm tracking-wider text-white">
                  Beauty Salon
                </span>
                <span className="font-playfair italic text-sm text-white">&</span>
                <span className="font-times text-sm tracking-wider text-white">
                  Spa
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu destino de belleza en Miami. Especialistas en cabello, maquillaje, uñas y tratamientos de spa.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-4 pt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-gray-800 p-3 rounded-full transition-colors ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-times text-xl font-bold mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-copper-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-gray-500 transition-colors text-sm"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-times text-xl font-bold mb-6">Contacto</h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <li key={index}>
                    <a
                      href={info.href}
                      target={info.icon === MapPin ? "_blank" : undefined}
                      rel={info.icon === MapPin ? "noopener noreferrer" : undefined}
                      className="flex items-start gap-3 text-gray-400 hover:text-copper-red transition-colors"
                    >
                      <Icon size={20} className="mt-1 flex-shrink-0" />
                      <span className="text-sm">{info.text}</span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-400">
                <span className="font-semibold">Horario:</span>
                <br />
                Lunes - Sábado: 9:00 AM - 7:00 PM
                <br />
                <span className="text-xs text-gray-500">Última cita: 5:30 PM</span>
                <br />
                Domingo: Cerrado
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} Copper Beauty Salon & Spa. Todos los derechos reservados.
            </p>
            <p>
              Diseñado por{" "}
              <a
                href="https://versa-commerce.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-copper-red hover:underline"
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
