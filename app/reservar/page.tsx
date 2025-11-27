"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

// Mock data
const servicesData = [
  { id: "1", name: "Corte + Estilo", category: "HairStyle", price: 45, duration: 45 },
  { id: "2", name: "Color Completo", category: "HairStyle", price: 120, duration: 120 },
  { id: "3", name: "Balayage Signature", category: "HairStyle", price: 220, duration: 180 },
  { id: "5", name: "Makeup Social", category: "Makeup", price: 85, duration: 60 },
  { id: "6", name: "Makeup de Novia", category: "Makeup", price: 180, duration: 120 },
  { id: "8", name: "Manicure Clásico", category: "Nail Services", price: 30, duration: 35 },
  { id: "9", name: "Pedicure Spa", category: "Nail Services", price: 50, duration: 50 },
  { id: "10", name: "Gel Set", category: "Nail Services", price: 55, duration: 55 },
  { id: "12", name: "Limpieza Profunda", category: "Skincare", price: 95, duration: 60 },
  { id: "18", name: "Extensiones de Pestañas", category: "Lashes & Eyebrows", price: 150, duration: 90 },
];

const staffData = [
  { id: "1", name: "María García", specialty: "Colorista & Estilista", photo: "https://i.pravatar.cc/150?img=1" },
  { id: "2", name: "Ana Rodríguez", specialty: "Maquilladora Profesional", photo: "https://i.pravatar.cc/150?img=5" },
  { id: "3", name: "Sofia Martínez", specialty: "Especialista en Uñas", photo: "https://i.pravatar.cc/150?img=9" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

export default function ReservarPage() {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientInfo, setClientInfo] = useState({
    nombre: "",
    telefono: "",
    email: "",
    notas: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const searchParams = useSearchParams();

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    let total = 0;
    let duration = 0;
    servicesData.forEach((service) => {
      if (selectedServices.includes(service.id)) {
        total += service.price;
        duration += service.duration;
      }
    });
    return { total, duration };
  };

  const getSelectedServices = () => {
    return servicesData.filter((s) => selectedServices.includes(s.id));
  };

  const getSelectedStaffInfo = () => {
    return staffData.find((s) => s.id === selectedStaff);
  };

  const { total, duration } = calculateTotal();

  const canProceedToStep = (stepNumber: number) => {
    if (stepNumber === 2) return selectedServices.length > 0;
    if (stepNumber === 3) return selectedStaff !== "" && selectedDate !== "" && selectedTime !== "";
    return true;
  };

  // Pre-seleccionar servicios si vienen de /servicios
  useEffect(() => {
    const servicesParam = searchParams.get("services");
    const stepParam = searchParams.get("step");

    if (servicesParam) {
      const ids = servicesParam.split(",").map((id) => id.trim()).filter(Boolean);
      const validIds = servicesData
        .filter((service) => ids.includes(service.id))
        .map((s) => s.id);

      if (validIds.length) {
        setSelectedServices(validIds);
        if (stepParam === "2") {
          setStep(2);
        }
      }
    }
  }, [searchParams]);

  const handleSubmit = () => {
    // Aquí se enviaría la reserva al backend
    setSubmitted(true);
  };

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip Sundays (day 0)
      if (date.getDay() !== 0) {
        dates.push(date);
      }
    }
    return dates;
  };

  const formatDateDisplay = (date: Date) => {
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
    };
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-copper-gradient">
        <Header />
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-2xl">
                <CardContent className="p-12 text-center">
                  <div className="bg-green-50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center animate-scale-in">
                    <CheckCircle2 className="text-green-500" size={64} />
                  </div>
                  <h1 className="font-times text-4xl font-bold text-gray-900 mb-4">
                    ¡Solicitud Recibida!
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    Hemos recibido tu solicitud de reserva exitosamente.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8">
                    <p className="text-blue-900 font-semibold mb-1">
                      📞 Te llamaremos pronto para confirmar
                    </p>
                    <p className="text-blue-800 text-sm">
                      Nuestro equipo se comunicará contigo en las próximas horas para confirmar tu cita. 
                      El pago se realiza directamente en el salón.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                    <h3 className="font-semibold text-gray-900 mb-4">Resumen de tu reserva:</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Servicios:</span> {getSelectedServices().map(s => s.name).join(", ")}</p>
                      <p><span className="font-semibold">Estilista:</span> {getSelectedStaffInfo()?.name}</p>
                      <p><span className="font-semibold">Fecha:</span> {selectedDate}</p>
                      <p><span className="font-semibold">Hora:</span> {selectedTime}</p>
                      <p><span className="font-semibold">Duración estimada:</span> {duration} minutos</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">
                    Te llamaremos al <span className="font-semibold">{clientInfo.telefono}</span> para confirmar tu cita.
                  </p>
                  <Button variant="copper" asChild>
                    <Link href="/">Volver al Inicio</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-copper-gradient">
      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-2 md:gap-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        step >= s
                          ? "bg-copper-red text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`w-8 md:w-16 h-1 transition-all ${
                          step > s ? "bg-copper-red" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <h2 className="font-times text-2xl md:text-3xl font-bold text-gray-900">
                  {step === 1 && "Selecciona tus servicios"}
                  {step === 2 && "Elige estilista y agenda"}
                  {step === 3 && "Tus datos y resumen"}
                </h2>
              </div>
            </div>

            {/* Step 1: Services */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                {servicesData.map((service) => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? "bg-copper-red/10 border-2 border-copper-red"
                          : "bg-white/80 border-2 border-transparent hover:border-copper-red/50"
                      }`}
                      onClick={() => toggleService(service.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  isSelected
                                    ? "border-copper-red bg-copper-red"
                                    : "border-gray-300"
                                }`}
                              >
                                {isSelected && (
                                  <CheckCircle2 className="text-white" size={16} />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{service.name}</h3>
                                <Badge className="mt-1 bg-gray-100 text-gray-700 border-gray-200">
                                  {service.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-copper-red">
                              {formatPrice(service.price)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {service.duration} min
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {selectedServices.length > 0 && (
                  <Card className="bg-gray-900 text-white sticky bottom-4">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">
                            {selectedServices.length} servicio(s) seleccionado(s)
                          </p>
                          <p className="text-2xl font-bold">{formatPrice(total)}</p>
                          <p className="text-sm text-gray-400">{duration} minutos</p>
                        </div>
                        <Button
                          variant="copper"
                          size="lg"
                          onClick={() => setStep(2)}
                        >
                          Continuar
                          <ChevronRight className="ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Step 2: Staff + Date & Time */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Calendario y horas */}
                  <Card className="bg-white/85 backdrop-blur-sm">
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 justify-center lg:justify-start">
                          <Calendar className="text-copper-red" />
                          Selecciona una fecha
                        </h3>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 lg:grid-cols-3 xl:grid-cols-4">
                          {getAvailableDates().map((date, index) => {
                            const dateStr = date.toISOString().split("T")[0];
                            const isSelected = selectedDate === dateStr;
                            const display = formatDateDisplay(date);
                            return (
                              <button
                                key={index}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`p-4 rounded-xl text-center transition-all border ${
                                  isSelected
                                    ? "bg-copper-red text-white shadow-lg border-copper-red"
                                    : "bg-gray-50 hover:bg-gray-100 border-transparent"
                                }`}
                              >
                                <div className="text-xs font-semibold mb-1">
                                  {display.day}
                                </div>
                                <div className="text-2xl font-bold">{display.date}</div>
                                <div className="text-xs mt-1">{display.month}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {selectedDate && (
                        <div className="space-y-3">
                          <h3 className="font-semibold text-lg flex items-center gap-2 justify-center lg:justify-start">
                            <Clock className="text-copper-red" />
                            Selecciona una hora
                          </h3>
                          <p className="text-sm text-gray-600 text-center lg:text-left">
                            Horario: 9:00 AM - 5:30 PM
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {timeSlots.map((time) => {
                              const isSelected = selectedTime === time;
                              return (
                                <button
                                  key={time}
                                  onClick={() => setSelectedTime(time)}
                                  className={`p-3 rounded-lg text-center transition-all border ${
                                    isSelected
                                      ? "bg-copper-red text-white shadow-lg border-copper-red"
                                      : "bg-gray-50 hover:bg-gray-100 border-transparent"
                                  }`}
                                >
                                  {time}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Estilistas */}
                  <Card className="bg-white/85 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4 text-center lg:text-left">
                        Elige tu estilista
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {staffData.map((staff) => {
                          const isSelected = selectedStaff === staff.id;
                          return (
                            <Card
                              key={staff.id}
                              className={`cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-copper-red/10 border-2 border-copper-red"
                                  : "bg-white/80 border-2 border-transparent hover:border-copper-red/50"
                              }`}
                              onClick={() => setSelectedStaff(staff.id)}
                            >
                              <CardContent className="p-5 text-center lg:text-left space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <h3 className="font-semibold text-base text-[#1f1a1c]">
                                    {staff.name}
                                  </h3>
                                  {isSelected && (
                                    <CheckCircle2 className="text-copper-red" size={18} />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{staff.specialty}</p>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <Button variant="outline" onClick={() => setStep(1)} className="w-full sm:w-auto">
                    <ChevronLeft className="mr-2" />
                    Atrás
                  </Button>
                  <Button
                    variant="copper"
                    className="w-full sm:w-auto"
                    disabled={!canProceedToStep(3)}
                    onClick={() => setStep(3)}
                  >
                    Continuar
                    <ChevronRight className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Client Info + Summary */}
            {step === 3 && (
              <div className="animate-fade-in">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <h3 className="font-semibold text-xl mb-6">
                        Información de Contacto
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="nombre">Nombre Completo *</Label>
                          <Input
                            id="nombre"
                            required
                            value={clientInfo.nombre}
                            onChange={(e) =>
                              setClientInfo({ ...clientInfo, nombre: e.target.value })
                            }
                            placeholder="Tu nombre completo"
                          />
                        </div>
                        <div>
                          <Label htmlFor="telefono">Teléfono *</Label>
                          <Input
                            id="telefono"
                            type="tel"
                            required
                            value={clientInfo.telefono}
                            onChange={(e) =>
                              setClientInfo({
                                ...clientInfo,
                                telefono: e.target.value,
                              })
                            }
                            placeholder="(786) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email (opcional)</Label>
                          <Input
                            id="email"
                            type="email"
                            value={clientInfo.email}
                            onChange={(e) =>
                              setClientInfo({ ...clientInfo, email: e.target.value })
                            }
                            placeholder="tu@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="notas">Notas Adicionales (opcional)</Label>
                          <Textarea
                            id="notas"
                            value={clientInfo.notas}
                            onChange={(e) =>
                              setClientInfo({ ...clientInfo, notas: e.target.value })
                            }
                            placeholder="Tipo de cabello, alergias, preferencias especiales..."
                            rows={4}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <h3 className="font-semibold text-xl mb-6">
                        Resumen de tu Reserva
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-600 mb-2">
                            SERVICIOS
                          </h4>
                          <div className="space-y-2">
                            {getSelectedServices().map((service) => (
                              <div
                                key={service.id}
                                className="flex justify-between text-sm"
                              >
                                <span>{service.name}</span>
                                <span className="font-semibold">
                                  {formatPrice(service.price)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="text-sm font-semibold text-gray-600 mb-2">
                            ESTILISTA
                          </h4>
                          <p className="text-sm">{getSelectedStaffInfo()?.name}</p>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="text-sm font-semibold text-gray-600 mb-2">
                            FECHA Y HORA
                          </h4>
                          <p className="text-sm">{selectedDate}</p>
                          <p className="text-sm">{selectedTime}</p>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Duración estimada:</span>
                            <span className="font-semibold">{duration} min</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-copper-red">
                              {formatPrice(total)}
                            </span>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-900">
                            <strong>Nota:</strong> Esta es una solicitud de reserva.
                            Te llamaremos para confirmar tu cita.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-4 justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    <ChevronLeft className="mr-2" />
                    Atrás
                  </Button>
                  <Button
                    variant="copper"
                    size="lg"
                    disabled={!clientInfo.nombre || !clientInfo.telefono}
                    onClick={handleSubmit}
                  >
                    <Sparkles className="mr-2" />
                    Confirmar Reserva
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
