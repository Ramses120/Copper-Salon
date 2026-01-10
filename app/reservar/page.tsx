"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { formatPrice, formatTime } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  category: { name: string } | string;
  price: number;
  duration: number;
}

interface Promotion {
  id: number;
  name: string;
  description: string;
  special_price: number;
  duration_minutes: number;
  discount: number;
  type: string;
}

interface Staff {
  id: string;
  name: string;
  specialty?: string;
}

export default function ReservarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-copper-gradient pt-32 flex justify-center"><Loader2 className="animate-spin" /></div>}>
      <ReservarForm />
    </Suspense>
  );
}

function ReservarForm() {
  const searchParams = useSearchParams();
  const serviceIdParam = searchParams.get("serviceId");
  const servicesParam = searchParams.get("services");
  const promotionIdParam = searchParams.get("promotionId");
  const promotionsParam = searchParams.get("promotions");
  const [paramProcessed, setParamProcessed] = useState(false);

  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPromotions, setSelectedPromotions] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientInfo, setClientInfo] = useState({
    nombre: "",
    telefono: "",
    notas: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [promotionsData, setPromotionsData] = useState<Promotion[]>([]);
  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const topRef = useRef<HTMLDivElement | null>(null);
  const prevStepRef = useRef(step);

  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Customer check state
  const [customerStatus, setCustomerStatus] = useState<{ exists: boolean; name?: string } | null>(null);
  const [checkingCustomer, setCheckingCustomer] = useState(false);

  // Efectos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, staffRes, promotionsRes] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/staff"),
          fetch("/api/promotions/active"),
        ]);

        if (servicesRes.ok) {
          const servicesJson = await servicesRes.json();
          const mappedServices = (servicesJson.services || []).map((s: any) => ({
            ...s,
            duration: s.duration_minutes || s.duration || 0
          }));
          setServicesData(mappedServices);
        }

        if (staffRes.ok) {
          const staffJson = await staffRes.json();
          // Normalize staff shape: backend sometimes returns fields in Spanish (`nombre`, `especialidades`)
          const normalized = (staffJson.staff || []).map((s: any) => ({
            id: s.id,
            name: s.name || s.nombre || s.nombre_completo || "",
            specialty:
              s.specialty ||
              (s.especialidades
                ? Array.isArray(s.especialidades)
                  ? s.especialidades.join(", ")
                  : String(s.especialidades)
                : s.specialty) || undefined,
          }));
          setStaffData(normalized);
        }

        if (promotionsRes.ok) {
          const promotionsJson = await promotionsRes.json();
          const rawPromos = Array.isArray(promotionsJson)
            ? promotionsJson
            : promotionsJson.promotions || [];
          const normalizedPromos = rawPromos.map((promo: any) => ({
            id: promo.id,
            name: promo.name || promo.title || "",
            description: promo.description || "",
            special_price: promo.special_price ?? promo.discount_amount ?? null,
            duration_minutes: promo.duration_minutes ?? promo.duration ?? 0,
            discount: promo.discount ?? promo.discount_percentage ?? 0,
            type: promo.type || (promo.discount_percentage ? "percentage" : "fixed"),
          }));
          setPromotionsData(normalizedPromos);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Error cargando servicios y estilistas");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle pre-selected service or promotion from URL
  useEffect(() => {
    if (!paramProcessed && !loading) {
      let shouldAdvance = false;

      if (servicesParam) {
        const ids = servicesParam.split(',');
        const validIds = ids.filter(id => servicesData.some(s => String(s.id) === id));
        if (validIds.length > 0) {
          setSelectedServices(validIds);
          shouldAdvance = true;
        }
      } else if (serviceIdParam) {
        if (servicesData.length > 0) {
          const service = servicesData.find(s => String(s.id) === serviceIdParam);
          if (service) {
            setSelectedServices([serviceIdParam]);
            shouldAdvance = true;
          }
        }
      }

      if (promotionsParam) {
        const ids = promotionsParam.split(',');
        const validIds = ids.filter(id => promotionsData.some(p => String(p.id) === id));
        if (validIds.length > 0) {
          setSelectedPromotions(validIds);
          shouldAdvance = true;
        }
      } else if (promotionIdParam) {
        if (promotionsData.length > 0) {
          const promo = promotionsData.find(p => String(p.id) === promotionIdParam);
          if (promo) {
            setSelectedPromotions([String(promo.id)]);
            shouldAdvance = true;
          }
        }
      }

      if (shouldAdvance) {
        // setStep(2); // Removed auto-advance to step 2 since we merged steps
      }

      setParamProcessed(true);
    }
  }, [serviceIdParam, servicesParam, promotionIdParam, promotionsParam, servicesData, promotionsData, loading, paramProcessed]);



  // Check customer by phone
  // useEffect(() => {
  //   const checkCustomer = async (phone: string) => {
  //     setCheckingCustomer(true);
  //     try {
  //       const res = await fetch(`/api/customers/by-phone?phone=${encodeURIComponent(phone)}`);
  //       const data = await res.json();
  //       if (data) {
  //         setCustomerStatus({ exists: true, name: data.name });
  //         // Auto-fill name if empty
  //         setClientInfo(prev => {
  //           if (!prev.nombre) return { ...prev, nombre: data.name };
  //           return prev;
  //         });
  //       } else {
  //         setCustomerStatus({ exists: false });
  //       }
  //     } catch (error) {
  //       console.error("Error checking customer:", error);
  //     } finally {
  //       setCheckingCustomer(false);
  //     }
  //   };

  //   const timer = setTimeout(() => {
  //     if (clientInfo.telefono.length >= 7) { // Check if length is reasonable
  //       checkCustomer(clientInfo.telefono);
  //     } else {
  //       setCustomerStatus(null);
  //     }
  //   }, 800); // Debounce 800ms
  //   return () => clearTimeout(timer);
  // }, [clientInfo.telefono]);

  useEffect(() => {
    if (prevStepRef.current !== step) {
      scrollToTop();
      prevStepRef.current = step;
    }
  }, [step]);

  useEffect(() => {
    if (submitted) {
      scrollToTop();
    }
  }, [submitted]);

  // Cargar horarios disponibles
  useEffect(() => {
    if (selectedDate && selectedStaff) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
          const res = await fetch(`/api/availability?staffId=${selectedStaff}&fecha=${selectedDate}`);
          if (res.ok) {
            const data = await res.json();
            // Prefer availableSlots, fallback to slots, or empty array
            setAvailableSlots(data.availableSlots || data.slots || []);
          } else {
            setAvailableSlots([]);
          }
        } catch (e) {
          console.error("Error fetching slots", e);
          setAvailableSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, selectedStaff]);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const togglePromotion = (promoId: string) => {
    setSelectedPromotions((prev) =>
      prev.includes(promoId)
        ? prev.filter((id) => id !== promoId)
        : [...prev, promoId]
    );
  };

  const calculateTotal = () => {
    let total = 0;
    let duration = 0;
    servicesData.forEach((service) => {
      if (selectedServices.includes(String(service.id))) {
        total += service.price;
        duration += service.duration;
      }
    });
    return { total, duration };
  };

  const getSelectedServices = () => {
    return servicesData.filter((s) => selectedServices.includes(String(s.id)));
  };

  const getSelectedStaffInfo = () => {
    return staffData.find((s) => s.id === selectedStaff);
  };

  const { total, duration } = calculateTotal();

  const formatDisplayTime = (time: string) => (time ? formatTime(time) : "");

  const canProceedToStep = (stepNumber: number) => {
    if (stepNumber === 2) return selectedServices.length > 0 && selectedStaff !== "" && selectedDate !== "" && selectedTime !== "";
    return true;
  };

  const handleSubmit = async () => {
    if (!clientInfo.nombre || !clientInfo.telefono) {
      setError("Por favor completa nombre y teléfono");
      return;
    }

    if (selectedServices.length === 0) {
      setError("Selecciona al menos un servicio para reservar");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      let finalNotes = clientInfo.notas;
      if (selectedPromotions.length > 0) {
        const promoNames = selectedPromotions
          .map(id => promotionsData.find(p => String(p.id) === id)?.name)
          .filter(Boolean)
          .join(", ");

        if (promoNames) {
          finalNotes = `[PROMOCIONES: ${promoNames}] ${finalNotes || ''}`;
        }
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteNombre: clientInfo.nombre,
          clienteTelefono: clientInfo.telefono,
          servicios: selectedServices,
          staffId: selectedStaff,
          fecha: selectedDate,
          hora: selectedTime,
          notas: finalNotes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al crear la reserva");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error submitting booking:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
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

  // Show loading if we have params but haven't processed them yet (to avoid flash of Step 1)
  if ((serviceIdParam || promotionIdParam || servicesParam || promotionsParam) && !paramProcessed) {
    return (
      <div className="min-h-screen bg-copper-gradient pt-32 flex justify-center">
        <Loader2 className="animate-spin text-copper-red" size={48} />
      </div>
    );
  }

  if (loading) {
    return (
      <main ref={topRef} className="min-h-screen bg-copper-gradient pt-24 lg:pt-32">
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-2xl">
                <CardContent className="p-6 sm:p-10 text-center">
                  <Loader2 className="mx-auto mb-4 animate-spin text-copper-red" size={48} />
                  <p className="text-lg text-gray-600">Cargando servicios y estilistas...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (submitted) {
    return (
      <main ref={topRef} className="min-h-screen bg-copper-gradient pt-24 lg:pt-32">
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-2xl">
                <CardContent className="p-6 sm:p-10 text-center">
                  <div className="bg-green-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 flex items-center justify-center animate-scale-in">
                    <CheckCircle2 className="text-green-500" size={44} />
                  </div>
                  <h1 className="font-times text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    ¡Solicitud Recibida!
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Gracias por elegir Copper Salon, en breve revisaremos tu confirmación y te llamaremos.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded mb-6">
                    <p className="text-blue-900 font-semibold mb-1">
                      📞 Te llamaremos pronto para confirmar
                    </p>
                    <p className="text-blue-800 text-sm">
                      Nuestro equipo se comunicará contigo en las próximas horas para confirmar tu cita. El pago se realiza directamente en el salón.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-8 text-left">
                    <h3 className="font-semibold text-gray-900 mb-4">Resumen de tu reserva:</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Servicios:</span> {getSelectedServices().map(s => s.name).join(", ")}</p>
                      {selectedPromotions.length > 0 && (
                        <p><span className="font-semibold">Promociones:</span> {selectedPromotions.map((promoId, index) => {
                          const promo = promotionsData.find(p => String(p.id) === promoId);
                          return promo?.name || "Promoción seleccionada";
                        }).join(", ")}</p>
                      )}

                      <p><span className="font-semibold">Estilista:</span> {getSelectedStaffInfo()?.name}</p>
                      <p><span className="font-semibold">Fecha:</span> {selectedDate}</p>
                      <p><span className="font-semibold">Hora:</span> {formatDisplayTime(selectedTime)}</p>
                      <p><span className="font-semibold">Duración estimada:</span> {duration} minutos</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-5">
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
    <main ref={topRef} className="min-h-screen bg-copper-gradient pt-24 lg:pt-32">
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-2 md:gap-4">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold transition-all ${step >= s
                          ? "bg-copper-red text-white"
                          : "bg-gray-300 text-gray-600"
                        }`}
                    >
                      {s}
                    </div>
                    {s < 2 && (
                      <div
                        className={`w-6 sm:w-8 md:w-16 h-1 transition-all ${step > s ? "bg-copper-red" : "bg-gray-300"
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <h2 className="font-times text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  {step === 1 && "Detalles de la Cita"}
                  {step === 2 && "Tus datos y resumen"}
                </h2>
              </div>
            </div>

            {/* Step 1: Services Summary + Staff + Date & Time */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                {/* Services Summary Section */}
                <Card className="bg-white/85 backdrop-blur-sm border-copper-red/20">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                      <Sparkles className="text-copper-red" />
                      Servicios Seleccionados
                    </h3>

                    {selectedServices.length === 0 && selectedPromotions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No has seleccionado ningún servicio.</p>
                        <Link href="/servicios">
                          <Button variant="copper">Ir a Servicios</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedServices.length > 0 && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {getSelectedServices().map(s => (
                              <div key={s.id} className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                <span className="font-medium">{s.name}</span>
                                <span className="font-bold text-copper-red">{formatPrice(s.price)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {selectedPromotions.length > 0 && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {selectedPromotions.map((promoId, index) => {
                              const promo = promotionsData.find(p => String(p.id) === promoId);
                              const promoName = promo?.name || "Promoción seleccionada";
                              const promoDesc = promo?.description || "";
                              return (
                                <div key={promo?.id ?? `promo-${promoId}-${index}`} className="flex justify-between items-center p-2 sm:p-3 bg-pink-50 rounded-lg border border-pink-100 text-sm">
                                  <div>
                                    <span className="font-medium text-pink-900">{promoName}</span>
                                    {promoDesc && <p className="text-xs text-pink-700">{promoDesc}</p>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <div className="flex justify-end items-center gap-4 pt-2 border-t mt-2">
                          <div className="text-xs sm:text-sm text-gray-500">Duración aprox: {duration} min</div>
                          <div className="text-sm sm:text-base font-bold">Total: <span className="text-copper-red">{formatPrice(total)}</span></div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {(selectedServices.length > 0 || selectedPromotions.length > 0) && (
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <Card className="bg-white/85 backdrop-blur-sm">
                        <CardContent className="p-4 sm:p-6 space-y-6">
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg mb-3 flex items-center gap-2 justify-center lg:justify-start">
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
                                    className={`p-2 sm:p-3 md:p-4 rounded-xl text-center transition-all border ${isSelected
                                        ? "bg-copper-red text-white shadow-lg border-copper-red"
                                        : "bg-gray-50 hover:bg-gray-100 border-transparent"
                                      }`}
                                  >
                                    <div className="text-[10px] sm:text-xs font-semibold mb-1">
                                      {display.day}
                                    </div>
                                    <div className="text-lg sm:text-xl md:text-2xl font-bold">{display.date}</div>
                                    <div className="text-[10px] sm:text-xs mt-1">{display.month}</div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {selectedDate && (
                            <div className="space-y-3">
                              <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2 justify-center lg:justify-start">
                                <Clock className="text-copper-red" />
                                Selecciona una hora
                              </h3>
                              <p className="text-sm text-gray-600 text-center lg:text-left">
                                Horario: 9:00 AM - 5:30 PM
                              </p>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {loadingSlots ? (
                                  <div className="col-span-full flex justify-center py-4">
                                    <Loader2 className="animate-spin text-copper-red" />
                                  </div>
                                ) : availableSlots.length > 0 ? (
                                  availableSlots.map((time) => {
                                    const isSelected = selectedTime === time;
                                    return (
                                      <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`p-2 sm:p-3 rounded-lg text-center text-sm transition-all border ${isSelected
                                            ? "bg-copper-red text-white shadow-lg border-copper-red"
                                            : "bg-gray-50 hover:bg-gray-100 border-transparent"
                                          }`}
                                      >
                                        {formatDisplayTime(time)}
                                      </button>
                                    );
                                  })
                                ) : (
                                  <div className="col-span-full text-center text-gray-500 py-4">
                                    No hay horarios disponibles.
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="bg-white/85 backdrop-blur-sm">
                        <CardContent className="p-4 sm:p-6">
                          <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-center lg:text-left">
                            Elige tu estilista
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {staffData.map((staff) => {
                              const isSelected = selectedStaff === staff.id;
                              return (
                                <Card
                                  key={staff.id}
                                  className={`cursor-pointer transition-all ${isSelected
                                      ? "bg-copper-red/10 border-2 border-copper-red"
                                      : "bg-white/80 border-2 border-transparent hover:border-copper-red/50"
                                    }`}
                                  onClick={() => setSelectedStaff(staff.id)}
                                >
                                  <CardContent className="p-5 text-center lg:text-left space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <h3 className="font-semibold text-sm sm:text-base text-[#1f1a1c]">
                                        {staff.name}
                                      </h3>
                                      {isSelected && (
                                        <CheckCircle2 className="text-copper-red" size={18} />
                                      )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600">{staff.specialty || 'Especialista'}</p>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                      <Card className="bg-white/90 backdrop-blur-sm sticky top-24 border-copper-red/20 shadow-lg">
                        <CardContent className="p-4 sm:p-6 space-y-4">
                          <h3 className="font-semibold text-base sm:text-lg border-b pb-2">Resumen</h3>

                          {/* Selected Services */}
                          {selectedServices.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Servicios</p>
                              <ul className="space-y-2">
                                {getSelectedServices().map(s => (
                                  <li key={s.id} className="text-sm flex justify-between">
                                    <span>{s.name}</span>
                                    <span className="font-semibold">{formatPrice(s.price)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Selected Promotion */}
                          {selectedPromotions.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Promociones</p>
                              <div className="space-y-2">
                                {selectedPromotions.map(promoId => {
                                  const promo = promotionsData.find(p => String(p.id) === promoId);
                                  return promo ? (
                                    <div key={promo.id} className="bg-pink-50 p-3 rounded-lg border border-pink-100">
                                      <p className="font-bold text-copper-red">{promo.name}</p>
                                      <p className="text-xs text-gray-600 mt-1">{promo.description}</p>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}

                          <div className="border-t pt-3 mt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Duración:</span>
                              <span>{duration} min</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                              <span>Total:</span>
                              <span className="text-copper-red">{formatPrice(total)}</span>
                            </div>
                            {selectedPromotions.length > 0 && (
                              <p className="text-xs text-gray-400 mt-1 italic">
                                * Las promociones no afectan el total calculado aquí.
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <Link href="/servicios" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full">
                      <ChevronLeft className="mr-2" />
                      Atrás
                    </Button>
                  </Link>
                  <Button
                    variant="copper"
                    className="w-full sm:w-auto"
                    disabled={!canProceedToStep(2)}
                    onClick={() => setStep(2)}
                  >
                    Continuar
                    <ChevronRight className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Client Info + Summary */}
            {step === 2 && (
              <div className="animate-fade-in">
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <p className="font-semibold">Error:</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm order-2 lg:order-1">
                    <CardContent className="p-5 sm:p-8">
                      <h3 className="font-semibold text-lg sm:text-xl mb-4 sm:mb-6">
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
                        {/* Email field removed */}
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

                  <Card className="bg-white/80 backdrop-blur-sm order-1 lg:order-2">
                    <CardContent className="p-5 sm:p-8">
                      <h3 className="font-semibold text-lg sm:text-xl mb-4 sm:mb-6">
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
                            {getSelectedServices().length === 0 && selectedPromotions.length === 0 && (
                              <p className="text-sm text-gray-400 italic">Ningún servicio seleccionado</p>
                            )}
                          </div>
                        </div>

                        {selectedPromotions.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">
                              PROMOCIONES
                            </h4>
                            <div className="space-y-3">
                              {selectedPromotions.map((promoId, index) => {
                                const promo = promotionsData.find(p => String(p.id) === promoId);
                                const promoName = promo?.name || "Promoción seleccionada";
                                const promoDesc = promo?.description || "";
                                return (
                                  <div key={promo?.id ?? `promo-${promoId}-${index}`} className="text-sm">
                                    <div className="flex justify-between">
                                      <span className="font-semibold text-copper-red">{promoName}</span>
                                    </div>
                                    {promoDesc && <p className="text-xs text-gray-500 mt-1">{promoDesc}</p>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

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
                          <p className="text-sm">{formatDisplayTime(selectedTime)}</p>
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
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ChevronLeft className="mr-2" />
                    Atrás
                  </Button>
                  <Button
                    variant="copper"
                    size="lg"
                    disabled={!clientInfo.nombre || !clientInfo.telefono || submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={18} />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2" />
                        Confirmar Reserva
                      </>
                    )}
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
