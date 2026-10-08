import { prisma } from '../src/db'

async function main() {
  try {
    const result = await prisma.booking.deleteMany({})
    console.log(`Deleted ${result.count} bookings successfully.`)
  } catch (error) {
    console.error('Error deleting bookings:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
