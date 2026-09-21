import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.js'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  console.log('Fixing existing roles...')
  // Force update any existing roles to 'USER' to allow enum alteration
  await prisma.$executeRawUnsafe(`UPDATE "user" SET role = 'USER' WHERE role = 'ADMIN' OR role = 'MODERATOR'`);
  console.log('Fixed.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
