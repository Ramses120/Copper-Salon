export interface Service {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  categoriaId: string;
  activo: boolean;
  categoria?: Category;
}

export interface Category {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface Staff {
  id: string;
  nombre: string;
  especialidad: string;
  telefono: string;
  email: string;
  foto: string;
  activo: boolean;
  workSchedule: string;
}

export interface Booking {
  id: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail: string;
  staffId: string;
  fecha: Date | string;
  hora: string;
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";
  notas: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  staff?: Staff;
  servicios?: BookingService[];
}

export interface BookingService {
  id: string;
  bookingId: string;
  servicioId: string;
  servicio?: Service;
}

export interface Promotion {
  id: string;
  titulo: string;
  descripcion: string;
  descuento: number;
  tipo: "porcentaje" | "fijo";
  fechaInicio: Date | string;
  fechaFin: Date | string;
  activa: boolean;
  servicios?: PromotionService[];
}

export interface PromotionService {
  id: string;
  promocionId: string;
  servicioId: string;
}

export interface PortfolioImage {
  id: string;
  url: string;
  categoria: string;
  descripcion: string;
  fechaCreacion: Date;
}

export interface Review {
  id: string;
  clienteNombre: string;
  calificacion: number;
  comentario: string;
  fecha: Date;
  servicio: string;
}

export interface DashboardStats {
  todayBookings: number;
  weekRevenue: number;
  activeClients: number;
  monthGrowth: number;
}

export interface AvailabilityResponse {
  fecha: string;
  staffId: string;
  availableSlots: string[];
  totalSlots: number;
  availableCount: number;
  ocupadas: string[];
}
