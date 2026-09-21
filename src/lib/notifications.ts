import { prisma } from '#/db'

export async function notifyAdmins(title: string, message: string, type: string, link?: string) {
  try {
    const admins = await prisma.user.findMany({
      where: { role: { in: ['SUPER_ADMIN', 'COO'] } },
      select: { id: true }
    })

    if (admins.length === 0) return

    await prisma.notification.createMany({
      data: admins.map(admin => ({
        userId: admin.id,
        title,
        message,
        type,
        link,
      }))
    })
  } catch (error) {
    console.error('Failed to send admin notification:', error)
  }
}
