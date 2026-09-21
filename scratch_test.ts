import { prisma } from './src/db.ts';

async function main() {
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        phlebotomist: { select: { id: true, name: true } },
        members: { select: { id: true, name: true, sampleStatus: true, reportUrl: true, collectedAt: true, labReceivedAt: true, testItems: { select: { id: true, name: true, discountedPrice: true, originalPrice: true } } } },
        addresses: true,
        schedules: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 20,
    }),
    prisma.booking.count(),
  ])
  console.log('Total bookings:', total);
  console.log('Bookings:', JSON.stringify(bookings, null, 2));
}

main().catch(console.error).finally(() => process.exit(0));
