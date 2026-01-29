import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@renovationconcierge.com' },
    update: {},
    create: {
      email: 'admin@renovationconcierge.com',
      password: hashedAdminPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create client user
  const hashedClientPassword = await bcrypt.hash('client123', 10);
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      password: hashedClientPassword,
      name: 'John Doe',
      role: 'client',
    },
  });

  console.log('✅ Created client user:', client.email);

  // Create demo project
  const project = await prisma.project.create({
    data: {
      name: 'Apartment Renovation - Marszałkowska St.',
      address: 'ul. Marszałkowska 123, Warsaw',
      description: 'Complete renovation of 85m² apartment including kitchen, bathroom, and living areas',
      status: 'in_progress',
      package: 'premium',
      startDate: new Date('2026-01-15'),
      endDate: new Date('2026-04-15'),
      clientId: client.id,
    },
  });

  console.log('✅ Created demo project:', project.name);

  // Create milestones
  const milestones = await Promise.all([
    prisma.milestone.create({
      data: {
        title: 'Demolition & Cleanup',
        description: 'Remove old fixtures, flooring, and prepare space',
        dueDate: new Date('2026-02-01'),
        status: 'completed',
        order: 1,
        projectId: project.id,
      },
    }),
    prisma.milestone.create({
      data: {
        title: 'Plumbing & Electrical',
        description: 'Install new plumbing and electrical systems',
        dueDate: new Date('2026-02-20'),
        status: 'in_progress',
        order: 2,
        projectId: project.id,
      },
    }),
    prisma.milestone.create({
      data: {
        title: 'Flooring & Tiling',
        description: 'Install hardwood floors and bathroom tiles',
        dueDate: new Date('2026-03-10'),
        status: 'pending',
        order: 3,
        projectId: project.id,
      },
    }),
    prisma.milestone.create({
      data: {
        title: 'Kitchen Installation',
        description: 'Install kitchen cabinets and appliances',
        dueDate: new Date('2026-03-25'),
        status: 'pending',
        order: 4,
        projectId: project.id,
      },
    }),
    prisma.milestone.create({
      data: {
        title: 'Final Touches & Inspection',
        description: 'Painting, fixtures, final walkthrough',
        dueDate: new Date('2026-04-15'),
        status: 'pending',
        order: 5,
        projectId: project.id,
      },
    }),
  ]);

  console.log(`✅ Created ${milestones.length} milestones`);

  // Create site visits
  const siteVisit = await prisma.siteVisit.create({
    data: {
      visitDate: new Date('2026-01-20'),
      notes: 'Initial site inspection completed. Demolition phase progressing well. All safety measures in place.',
      projectId: project.id,
      inspectorId: admin.id,
    },
  });

  console.log('✅ Created site visit');

  // Create defects
  const defects = await Promise.all([
    prisma.defect.create({
      data: {
        title: 'Uneven bathroom floor',
        description: 'Floor tiles in bathroom are not level in the corner near the shower',
        location: 'Bathroom',
        severity: 'medium',
        status: 'open',
        projectId: project.id,
      },
    }),
    prisma.defect.create({
      data: {
        title: 'Paint touch-up needed',
        description: 'Small paint scratches on living room wall',
        location: 'Living Room',
        severity: 'low',
        status: 'fixed',
        fixedDate: new Date('2026-01-28'),
        projectId: project.id,
      },
    }),
  ]);

  console.log(`✅ Created ${defects.length} defects`);

  // Create deliveries
  const deliveries = await Promise.all([
    prisma.delivery.create({
      data: {
        itemName: 'Kitchen Cabinets',
        supplier: 'IKEA',
        expectedDate: new Date('2026-03-15'),
        status: 'pending',
        notes: 'Custom order, white matte finish',
        projectId: project.id,
      },
    }),
    prisma.delivery.create({
      data: {
        itemName: 'Hardwood Flooring',
        supplier: 'Wood Masters',
        expectedDate: new Date('2026-02-28'),
        deliveredDate: new Date('2026-02-27'),
        status: 'delivered',
        projectId: project.id,
      },
    }),
  ]);

  console.log(`✅ Created ${deliveries.length} deliveries`);

  // Create report
  const report = await prisma.report.create({
    data: {
      title: 'January 2026 Progress Report',
      content: JSON.stringify({
        summary: 'Project is progressing on schedule. Demolition phase completed successfully.',
        completedTasks: ['Demolition', 'Wall preparation', 'Initial plumbing work'],
        upcomingTasks: ['Electrical installation', 'Floor preparation'],
        issues: ['Minor delay in material delivery, resolved'],
      }),
      reportType: 'progress',
      projectId: project.id,
    },
  });

  console.log('✅ Created progress report');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📧 Login credentials:');
  console.log('Admin: admin@renovationconcierge.com / admin123');
  console.log('Client: client@example.com / client123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
