import { prisma } from './src/db'

async function checkAndFix() {
  const user = await prisma.user.findUnique({
    where: { email: 'krajeevrao@gmail.com' },
  })

  if (!user) {
    console.log('User krajeevrao@gmail.com not found')
    return
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      payments: true,
      members: true,
      addresses: true,
      schedules: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  console.log(`Found ${bookings.length} bookings for krajeevrao@gmail.com:`)
  for (const b of bookings) {
    console.log({
      id: b.id,
      type: b.type,
      status: b.status,
      createdAt: b.createdAt,
      paymentsCount: b.payments.length,
      paymentStates: b.payments.map((p) => p.state),
    })
  }

  // Find orphaned ONLINE_PAYMENT bookings that were never paid
  const orphanedBookings = bookings.filter(
    (b) =>
      b.type === 'ONLINE_PAYMENT' &&
      b.status === 'PENDING' &&
      (!b.payments.length || b.payments.every((p) => p.state === 'PENDING' || p.state === 'FAILED'))
  )

  if (orphanedBookings.length > 0) {
    console.log(`\nFound ${orphanedBookings.length} orphaned failed/unpaid online bookings to clean up:`)
    for (const ob of orphanedBookings) {
      console.log(`Cleaning up orphaned booking: ${ob.id}`)
      // Delete orphaned payments
      await prisma.payment.deleteMany({ where: { bookingId: ob.id } })
      // Delete members, addresses, schedules associated with this orphaned booking
      await prisma.member.deleteMany({ where: { bookingId: ob.id } })
      await prisma.address.deleteMany({ where: { bookingId: ob.id } })
      await prisma.schedule.deleteMany({ where: { bookingId: ob.id } })
      // Delete booking
      await prisma.booking.delete({ where: { id: ob.id } })
      console.log(`✅ Deleted orphaned booking ${ob.id}`)
    }
  } else {
    console.log('No orphaned bookings found')
  }
}

checkAndFix()
