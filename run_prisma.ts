import { PrismaClient } from './src/generated/prisma/client.js';

const prisma = new PrismaClient();

async function run() {
  await prisma.$executeRawUnsafe(`ALTER TABLE "member" ALTER COLUMN "sampleStatus" DROP DEFAULT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "member" ALTER COLUMN "sampleStatus" TYPE VARCHAR(255) USING "sampleStatus"::text;`);
  
  await prisma.$executeRawUnsafe(`UPDATE "member" SET "sampleStatus" = 'BOOKED' WHERE "sampleStatus" = 'PENDING';`);
  await prisma.$executeRawUnsafe(`UPDATE "member" SET "sampleStatus" = 'REPORT_RELEASED' WHERE "sampleStatus" = 'REPORT_READY';`);
  console.log("Updated values!");
}

run().catch(console.error).finally(() => prisma.$disconnect());
