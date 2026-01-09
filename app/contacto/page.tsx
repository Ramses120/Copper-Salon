"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Send,
  CheckCircle2,
} from "lucide-react";
import { FaTiktok, FaWhatsapp } from "react-icons/fa";

export default function ContactoPage() {
  const [formType, setFormType] = useState<"trabajo" | "info">("info");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    especialidad: "",
    experiencia: "",
    descripcion: "",
    diasTrabajo: "",
    tipoTrabajo: "",
    licencia: "",
    mensaje: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se enviaría el formulario al backend
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        especialidad: "",
        experiencia: "",
        descripcion: "",
        diasTrabajo: "",
        tipoTrabajo: "",
        licencia: "",
        mensaje: "",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Ubicación",
      content: "5 SW 107th Ave, Miami, FL 33174",
      link: "https://maps.google.com/?q=5+SW+107th+Ave,+Miami,+FL+33174",
      external: true,
    },
    {
      icon: Phone,
      title: "Teléfono",
      content: "(786) 409-2226",
      link: "tel:+17864092226",
    },
    {
      icon: Mail,
      title: "Email",
      content: "copperbeauty21@gmail.com",
      link: "mailto:copperbeauty21@gmail.com",
    },
    {
      icon: Clock,
      title: "Horario",
      content: "Lun - Sáb: 9:00 AM - 7:00 PM",
      subtitle: "Última cita: 5:30 PM | Domingo: Cerrado",
    },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/copper_beauty_salon_spa",
      color: "hover:text-pink-600",
    },
    {
      name: "TikTok",
      icon: FaTiktok,
      url: "https://www.tiktok.com/@copperbeautysalon",
      color: "hover:text-black",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      url: "https://wa.me/17864092226",
      color: "hover:text-green-600",
    },
  ];

  return (
    <main className="min-h-screen bg-copper-gradient pt-24 lg:pt-32">

      {/* Hero Section */}
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-times text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Contáctanos
            </h1>
            <p className="text-lg text-gray-600 mb-8 animate-fade-in">
              Estamos aquí para responder tus preguntas y ayudarte en lo que necesites
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information (simplified) */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-times text-3xl font-bold text-gray-900 mb-4">
                    Contáctanos — Llámanos
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <div className="bg-copper-red/10 p-3 rounded-full">
                        <Phone className="text-copper-red" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Teléfono</h3>
                        <a href="tel:+17864092226" className="text-copper-red hover:underline">
                          (786) 409-2226
                        </a>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-4">
                      <div className="bg-copper-red/10 p-3 rounded-full">
                        <MapPin className="text-copper-red" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Ubicación</h3>
                        <a href="https://maps.google.com/?q=5+SW+107th+Ave,+Miami,+FL+33174" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline">
                          5 SW 107th Ave, Miami, FL 33174
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="bg-copper-red/10 p-3 rounded-full">
                        <Mail className="text-copper-red" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Email</h3>
                        <a href="mailto:copperbeauty21@gmail.com" className="text-gray-700 hover:underline">copperbeauty21@gmail.com</a>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start gap-4">
                      <div className="bg-copper-red/10 p-3 rounded-full">
                        <Clock className="text-copper-red" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Horario</h3>
                        <p className="text-gray-700">Lun - Sáb: 9:00 AM - 7:00 PM (Última cita: 5:30 PM)</p>
                      </div>
                    </div>

                    {/* Socials */}
                    <div className="flex items-start gap-4">
                      <div className="bg-copper-red/10 p-3 rounded-full">
                        <Instagram className="text-copper-red" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Redes Sociales</h3>
                        <div className="flex gap-3 mt-2">
                          {socialLinks.map((social) => {
                            const Icon = social.icon;
                            return (
                              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-full bg-white/80 shadow ${social.color}`} aria-label={social.name}>
                                <Icon size={18} />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map column */}
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <h3 className="sr-only">Mapa - Ubicación</h3>
                <div className="w-full h-96">
                  <iframe
                    src="https://www.google.com/maps?q=5+SW+107th+Ave,+Miami,+FL+33174&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
