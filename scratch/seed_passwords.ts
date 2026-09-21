process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_diZAUa9XBGH6@ep-empty-mode-aogwj6x7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require';

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.js'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const { hashPassword } = await import('better-auth/crypto')
  const hashedPassword = await hashPassword('password123')

  const users = await prisma.user.findMany({
    where: { email: { in: ['superadmin@bloodpanda.com', 'coo@bloodpanda.com', 'phlebotomist@bloodpanda.com'] } }
  })

  for (const user of users) {
    const existingAccount = await prisma.account.findFirst({
      where: { userId: user.id, providerId: 'credential' }
    })

    if (!existingAccount) {
      await prisma.account.create({
        data: {
          userId: user.id,
          accountId: user.id,
          providerId: 'credential',
          password: hashedPassword,
        }
      })
      console.log(`Created credential account for ${user.email} with password: password123`)
    } else {
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: { password: hashedPassword }
      })
      console.log(`Updated password for ${user.email} to: password123`)
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
