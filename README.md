# Copper Beauty Salon & Spa - Website v2.0

Sitio web completo para Copper Beauty Salon & Spa con sistema de reservas, panel administrativo y portafolio dinámico.

## 🚀 Características Principales

### Frontend Público
- **Hero Section**: Diseño impactante con llamados a la acción
- **Sección Sobre Nosotros**: Historia, stats y razones para elegir Copper
- **Servicios**: Accordion interactivo con categorías (HairStyle, Makeup, Nails, Skincare, Wax, Lashes/Eyebrows)
- **Portafolio**: Galería con filtros por categoría
- **Sistema de Reservas**: Flujo completo de booking
- **Reseñas**: Testimonios de clientes
- **Multiidioma**: Español e Inglés (excepto panel admin)

### Panel Administrativo
- **Dashboard**: Resumen de reservas y KPIs
- **Gestión de Servicios**: CRUD completo
- **Gestión de Promociones**: Crear y administrar ofertas
- **Gestión de Reservas**: Ver, filtrar y modificar reservas
- **Gestión de Personal**: Administrar estilistas y horarios
- **Gestión de Portafolio**: Subir y categorizar imágenes

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

1. **Clonar o navegar al directorio del proyecto**

```bash
cd "/Volumes/WORK/Work/Trabajos de Web Sites/Copper.v2"
```

2. **Instalar dependencias** (ya realizado)

```bash
npm install
```

3. **Configurar base de datos**

Ejecutar el script SQL en el panel de Supabase.

4. **Crear usuario admin inicial**

El usuario admin se crea automáticamente con el script SQL.

5. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

El sitio estará disponible en: http://localhost:3000

## 📁 Estructura del Proyecto

```
Copper.v2/
├── app/                    # Páginas Next.js App Router
│   ├── admin/             # Panel administrativo
│   ├── servicios/         # Página de servicios
│   ├── portafolio/        # Galería de trabajos
│   ├── reservar/          # Sistema de reservas
│   ├── contacto/          # Página de contacto
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   └── ...
├── lib/                   # Utilidades y configuración
│   ├── db.ts             # Cliente Supabase (Wrapper)
│   └── utils.ts          # Funciones helper
└── public/               # Archivos estáticos
```

## 🎨 Paleta de Colores

- **Copper Red**: #E46768 (Color principal/acento)
- **Light Tranche**: #F5F3EF
- **Gradientes**:
  - Izquierda: #ECEDEA
  - Centro: #F8F8F6
  - Derecha: #DCDBD8

## 👤 Credenciales de Admin

**Admin Principal:**
- Email: rasmesperaza23@gmail.com
- Password: admin1992@copper2025@

**Admin Secundario:**
- Email: copperbeaty21@gmail.com
- Password: Copper21@Beaty2025@

## 📱 Información de Contacto

- **Dirección**: 5 SW 107th Ave, Miami, FL 33174
- **Teléfono**: (786) 409-2226
- **Horario**: 
  - Lunes - Sábado: 9:00 AM - 7:00 PM
  - Última cita: 5:30 PM
  - Domingo: Cerrado

## 🔗 Redes Sociales

- **Instagram**: https://www.instagram.com/copper_beauty_salon_spa
- **TikTok**: https://www.tiktok.com/@copperbeautysalon
- **WhatsApp**: https://wa.me/17864092226

## 🚀 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Iniciar servidor de producción
npm run lint     # Linter
```

## 📝 Notas de Desarrollo

- **Framework**: Next.js 15 con App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **ORM**: Supabase Client (Directo)
- **Autenticación**: Supabase Auth
- **Upload de imágenes**: Supabase Storage

## 🎯 Próximos Pasos

1. Completar páginas restantes (servicios, portafolio, reservar, contacto)
2. Implementar panel administrativo completo
3. Configurar API endpoints
4. Implementar sistema de autenticación
5. Agregar sistema de notificaciones por email/SMS
6. Optimizar SEO y performance
7. Testing y deployment

## 📄 Licencia

© 2025 Copper Beauty Salon & Spa. Todos los derechos reservados.

Diseñado y desarrollado por [versa-commerce.com](https://versa-commerce.com)
