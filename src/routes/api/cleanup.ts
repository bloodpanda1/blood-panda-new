import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '#/db'

export const Route = createFileRoute('/api/cleanup')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const bookings = await prisma.booking.findMany({
            include: {
              members: {
                include: { testItems: true }
              }
            }
          })

          let deletedCount = 0

          for (const booking of bookings) {
            const hasAnyTests = booking.members.some((member: any) => member.testItems && member.testItems.length > 0)
            if (!hasAnyTests) {
              await prisma.$transaction([
                prisma.member.deleteMany({ where: { bookingId: booking.id } }),
                prisma.address.deleteMany({ where: { bookingId: booking.id } }),
                prisma.schedule.deleteMany({ where: { bookingId: booking.id } }),
                prisma.booking.delete({ where: { id: booking.id } })
              ])
              deletedCount++
            }
          }

          return new Response(JSON.stringify({ deletedCount, message: 'Cleanup complete' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e.message }), { status: 500 })
        }
      }
    }
  }
})
