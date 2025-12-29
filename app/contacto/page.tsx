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
      content: "info@copperbeauty.com",
      link: "mailto:info@copperbeauty.com",
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
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-times text-3xl font-bold text-gray-900 mb-6">
                    Información de Contacto
                  </h2>
                  <div className="space-y-4">
                    {contactInfo.map((info, index) => {
                      const Icon = info.icon;
                      return (
                        <Card
                          key={index}
                          className="bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-shadow"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="bg-copper-red/10 p-3 rounded-full">
                                <Icon className="text-copper-red" size={24} />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                  {info.title}
                                </h3>
                                {info.link ? (
                                  <a
                                    href={info.link}
                                    target={info.external ? "_blank" : undefined}
                                    rel={info.external ? "noopener noreferrer" : undefined}
                                    className="text-copper-red hover:underline block"
                                  >
                                    {info.content}
                                  </a>
                                ) : (
                                  <p className="text-gray-700">{info.content}</p>
                                )}
                                {info.subtitle && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    {info.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="font-times text-2xl font-bold text-gray-900 mb-4">
                    Síguenos en Redes Sociales
                  </h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-lg hover:shadow-xl transition-all ${social.color}`}
                          aria-label={social.name}
                        >
                          <Icon size={24} />
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Map */}
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3593.0!2d-80.3656!3d25.7617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDQ1JzQyLjEiTiA4MMKwMjEnNTYuMiJX!5e0!3m2!1sen!2sus!4v1234567890"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card className="bg-white/80 backdrop-blur-sm border-none shadow-2xl">
                  <CardContent className="p-8">
                    <h2 className="font-times text-3xl font-bold text-gray-900 mb-6">
                      Envíanos un Mensaje
                    </h2>

                    {/* Form Type Selector */}
                    <div className="flex gap-4 mb-6">
                      <Button
                        variant={formType === "info" ? "copper" : "outline"}
                        onClick={() => setFormType("info")}
                        className="flex-1"
                      >
                        Más Información
                      </Button>
                      <Button
                        variant={formType === "trabajo" ? "copper" : "outline"}
                        onClick={() => setFormType("trabajo")}
                        className="flex-1"
                      >
                        Busco Trabajo
                      </Button>
                    </div>

                    {submitted ? (
                      <div className="text-center py-12 animate-scale-in">
                        <div className="bg-green-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                          <CheckCircle2 className="text-green-500" size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          ¡Mensaje Recibido!
                        </h3>
                        <p className="text-gray-600">
                          {formType === "trabajo"
                            ? "Revisaremos tu información y nos comunicaremos lo antes posible para una entrevista. ¡Gracias por elegirnos!"
                            : "Gracias por tu tiempo. En breve responderemos cualquier duda que tengas."}
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Common Fields */}
                        <div className="space-y-2">
                          <Label htmlFor="nombre">Nombre Completo *</Label>
                          <Input
                            id="nombre"
                            required
                            value={formData.nombre}
                            onChange={(e) =>
                              setFormData({ ...formData, nombre: e.target.value })
                            }
                            placeholder="Tu nombre completo"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder="tu@email.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="telefono">
                            Teléfono {formType === "trabajo" && "*"}
                          </Label>
                          <Input
                            id="telefono"
                            type="tel"
                            required={formType === "trabajo"}
                            value={formData.telefono}
                            onChange={(e) =>
                              setFormData({ ...formData, telefono: e.target.value })
                            }
                            placeholder="(786) 123-4567"
                          />
                        </div>

                        {/* Job Application Fields */}
                        {formType === "trabajo" && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="especialidad">Especialidad *</Label>
                              <Input
                                id="especialidad"
                                required
                                value={formData.especialidad}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    especialidad: e.target.value,
                                  })
                                }
                                placeholder="Ej: Colorista, Estilista, Manicurista"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="experiencia">
                                Años de Experiencia *
                              </Label>
                              <Input
                                id="experiencia"
                                required
                                value={formData.experiencia}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    experiencia: e.target.value,
                                  })
                                }
                                placeholder="Ej: 5 años"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="tipoTrabajo">Tipo de Trabajo *</Label>
                              <Select
                                value={formData.tipoTrabajo}
                                onValueChange={(value) =>
                                  setFormData({ ...formData, tipoTrabajo: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="full-time">
                                    Full Time (Tiempo Completo)
                                  </SelectItem>
                                  <SelectItem value="part-time">
                                    Part Time (Medio Tiempo)
                                  </SelectItem>
                                  <SelectItem value="flexible">Flexible</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="licencia">
                                ¿Tienes licencia profesional? *
                              </Label>
                              <Select
                                value={formData.licencia}
                                onValueChange={(value) =>
                                  setFormData({ ...formData, licencia: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="si">Sí, tengo licencia</SelectItem>
                                  <SelectItem value="estudiante">
                                    Soy estudiante
                                  </SelectItem>
                                  <SelectItem value="no">No tengo licencia</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="descripcion">
                                Descripción / Experiencia *
                              </Label>
                              <Textarea
                                id="descripcion"
                                required
                                value={formData.descripcion}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    descripcion: e.target.value,
                                  })
                                }
                                placeholder="Cuéntanos sobre tu experiencia, habilidades y por qué quieres unirte a nuestro equipo..."
                                rows={4}
                              />
                            </div>
                          </>
                        )}

                        {/* Info Request Fields */}
                        {formType === "info" && (
                          <div className="space-y-2">
                            <Label htmlFor="mensaje">Mensaje *</Label>
                            <Textarea
                              id="mensaje"
                              required
                              value={formData.mensaje}
                              onChange={(e) =>
                                setFormData({ ...formData, mensaje: e.target.value })
                              }
                              placeholder="¿En qué podemos ayudarte?"
                              rows={5}
                            />
                          </div>
                        )}

                        <Button
                          type="submit"
                          variant="copper"
                          size="lg"
                          className="w-full"
                        >
                          <Send className="mr-2" size={20} />
                          Enviar Mensaje
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
