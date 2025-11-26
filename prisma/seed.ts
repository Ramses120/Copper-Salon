import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin users
  const hashedPassword1 = await bcrypt.hash('admin123@', 10);
  const hashedPassword2 = await bcrypt.hash('Copper21@Beaty2025@', 10);

  const admin1 = await prisma.admin.upsert({
    where: { email: 'ramsesperaza23@gmail.com' },
    update: {},
    create: {
      email: 'ramsesperaza23@gmail.com',
      password: hashedPassword1,
      name: 'Admin Principal',
      rol: 'superadmin',
      activo: true,
    },
  });

  const admin2 = await prisma.admin.upsert({
    where: { email: 'copperbeaty21@gmail.com' },
    update: {},
    create: {
      email: 'copperbeaty21@gmail.com',
      password: hashedPassword2,
      name: 'Admin Secundario',
      rol: 'admin',
      activo: true,
    },
  });

  console.log('✅ Admin users created:', { admin1, admin2 });

  // Create categories
  const categories = [
    { name: 'HairStyle', nameEn: 'HairStyle', slug: 'hairstyle', order: 1 },
    { name: 'Makeup', nameEn: 'Makeup', slug: 'makeup', order: 2 },
    { name: 'Manicure/Pedicure', nameEn: 'Nail Services', slug: 'nail-services', order: 3 },
    { name: 'Skincare', nameEn: 'Skincare', slug: 'skincare', order: 4 },
    { name: 'Wax', nameEn: 'Wax', slug: 'wax', order: 5 },
    { name: 'Lashes & Eyebrows', nameEn: 'Lashes & Eyebrows', slug: 'lashes-eyebrows', order: 6 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('✅ Categories created');

  // Create sample services
  const hairCategory = await prisma.category.findUnique({ where: { slug: 'hairstyle' } });
  const makeupCategory = await prisma.category.findUnique({ where: { slug: 'makeup' } });
  const nailCategory = await prisma.category.findUnique({ where: { slug: 'nail-services' } });

  if (hairCategory) {
    await prisma.service.createMany({
      data: [
        {
          name: 'Corte + Estilo',
          nameEn: 'Haircut + Style',
          description: 'Corte profesional con blowout incluido',
          descriptionEn: 'Professional haircut with blowout included',
          price: 45,
          duration: 45,
          categoryId: hairCategory.id,
          note: 'Incluye blowout',
        },
        {
          name: 'Color Completo',
          nameEn: 'Full Color',
          description: 'Coloración completa del cabello',
          descriptionEn: 'Full hair coloring',
          price: 120,
          duration: 120,
          categoryId: hairCategory.id,
        },
        {
          name: 'Balayage Signature',
          nameEn: 'Signature Balayage',
          description: 'Técnica de balayage con tonalizante incluido',
          descriptionEn: 'Balayage technique with toner included',
          price: 220,
          duration: 180,
          categoryId: hairCategory.id,
          note: 'Tonalizante incluido',
        },
      ],
    });
  }

  if (makeupCategory) {
    await prisma.service.createMany({
      data: [
        {
          name: 'Makeup Social',
          nameEn: 'Social Makeup',
          description: 'Maquillaje para eventos sociales',
          descriptionEn: 'Makeup for social events',
          price: 85,
          duration: 60,
          categoryId: makeupCategory.id,
        },
        {
          name: 'Makeup de Novia',
          nameEn: 'Bridal Makeup',
          description: 'Maquillaje profesional para novias',
          descriptionEn: 'Professional bridal makeup',
          price: 180,
          duration: 120,
          categoryId: makeupCategory.id,
          note: 'Prueba opcional',
        },
      ],
    });
  }

  if (nailCategory) {
    await prisma.service.createMany({
      data: [
        {
          name: 'Manicure Clásico',
          nameEn: 'Classic Manicure',
          description: 'Manicure tradicional',
          descriptionEn: 'Traditional manicure',
          price: 30,
          duration: 35,
          categoryId: nailCategory.id,
        },
        {
          name: 'Pedicure Spa',
          nameEn: 'Spa Pedicure',
          description: 'Pedicure con tratamiento spa',
          descriptionEn: 'Pedicure with spa treatment',
          price: 50,
          duration: 50,
          categoryId: nailCategory.id,
        },
      ],
    });
  }

  console.log('✅ Sample services created');

  // Create sample staff
  const defaultSchedule = JSON.stringify({
    monday: { start: '09:00', end: '19:00', enabled: true },
    tuesday: { start: '09:00', end: '19:00', enabled: true },
    wednesday: { start: '09:00', end: '19:00', enabled: true },
    thursday: { start: '09:00', end: '19:00', enabled: true },
    friday: { start: '09:00', end: '19:00', enabled: true },
    saturday: { start: '09:00', end: '19:00', enabled: true },
    sunday: { start: '09:00', end: '19:00', enabled: false },
  });

  await prisma.staff.createMany({
    data: [
      {
        name: 'María García',
        specialty: 'Colorista & Estilista',
        phone: '7864092226',
        workSchedule: defaultSchedule,
      },
      {
        name: 'Ana Rodríguez',
        specialty: 'Maquilladora Profesional',
        phone: '7864092226',
        workSchedule: defaultSchedule,
      },
      {
        name: 'Sofia Martínez',
        specialty: 'Especialista en Uñas',
        phone: '7864092226',
        workSchedule: defaultSchedule,
      },
    ],
  });

  console.log('✅ Sample staff created');

  // Create sample reviews
  await prisma.review.createMany({
    data: [
      {
        clientName: 'María González',
        rating: 5,
        comment:
          '¡Excelente servicio! Me encantó el resultado de mi balayage. El equipo es muy profesional y el ambiente es super acogedor.',
      },
      {
        clientName: 'Ana Rodríguez',
        rating: 5,
        comment:
          'Siempre salgo feliz de Copper. Las chicas son súper talentosas y me hacen sentir como en casa. Definitivamente mi salón favorito en Miami.',
      },
      {
        clientName: 'Sofía Martínez',
        rating: 5,
        comment:
          'El maquillaje para mi boda fue perfecto. Lucí espectacular gracias al equipo de Copper. 100% recomendado para eventos especiales.',
      },
    ],
  });

  console.log('✅ Sample reviews created');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
