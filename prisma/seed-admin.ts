import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.js'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  console.log('Seeding roles...')

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@bloodpanda.com' },
    update: {
      role: 'SUPER_ADMIN',
    },
    create: {
      name: 'Super Admin',
      email: 'superadmin@bloodpanda.com',
      role: 'SUPER_ADMIN',
    },
  })

  const coo = await prisma.user.upsert({
    where: { email: 'coo@bloodpanda.com' },
    update: {
      role: 'COO',
    },
    create: {
      name: 'Chief Operating Officer',
      email: 'coo@bloodpanda.com',
      role: 'COO',
    },
  })

  const phlebotomist = await prisma.user.upsert({
    where: { email: 'phlebotomist@bloodpanda.com' },
    update: {
      role: 'PHLEBOTOMIST',
    },
    create: {
      name: 'Phlebotomist',
      email: 'phlebotomist@bloodpanda.com',
      role: 'PHLEBOTOMIST',
    },
  })

  console.log({ superAdmin, coo, phlebotomist })
  
  console.log('Cleaning up empty bookings...')
  const bookings = await prisma.booking.findMany({
    include: {
      members: {
        include: { testItems: true }
      }
    }
  })

  console.log(`Total bookings: ${bookings.length}`)
  let deletedCount = 0

  for (const booking of bookings) {
    const hasAnyTests = booking.members.some((member: any) => member.testItems && member.testItems.length > 0)
    if (!hasAnyTests) {
      await prisma.$transaction([
        prisma.member.deleteMany({ where: { bookingId: booking.id } }),
        prisma.address.deleteMany({ where: { bookingId: booking.id } }),
        prisma.schedule.deleteMany({ where: { bookingId: booking.id } }),
        prisma.payment.deleteMany({ where: { bookingId: booking.id } }),
        prisma.booking.delete({ where: { id: booking.id } })
      ])
      deletedCount++
    }
  }

  console.log(`Successfully deleted ${deletedCount} empty bookings.`)
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
