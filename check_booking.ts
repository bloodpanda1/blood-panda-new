import { PrismaClient } from './src/generated/prisma/client.js';

const prisma = new PrismaClient();

async function run() {
  const booking = await prisma.booking.findFirst({
    orderBy: { createdAt: 'desc' },
    include: { addresses: true, user: true }
  });
  console.log(JSON.stringify(booking, null, 2));
}

run().catch(console.error).finally(() => prisma.$disconnect());
