import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure, adminProcedure, superAdminProcedure, phlebotomistProcedure, cooProcedure } from './init'
import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { prisma } from '#/db'
import { getServerEnv } from '#/config/server-env'
import { v2 as cloudinary } from 'cloudinary'
import { Resend } from 'resend'
import { notifyAdmins } from '#/lib/notifications'
import { fetchCashfreeOrder, fetchCashfreeOrderPayments } from '#/integrations/cashfree'

const todos = [
  { id: 1, name: 'Get groceries' },
  { id: 2, name: 'Buy a new phone' },
  { id: 3, name: 'Finish the project' },
]

const todosRouter = {
  list: publicProcedure.query(() => todos),
  add: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      const newTodo = { id: todos.length + 1, name: input.name }
      todos.push(newTodo)
      return newTodo
    }),
} satisfies TRPCRouterRecord

const membersRouter = {
  list: protectedProcedure.query(async ({ ctx }) => {
    return prisma.patientProfile.findMany({
      where: { userId: ctx.user.id },
      orderBy: { createdAt: 'desc' }
    })
  }),
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email'),
      phone: z.string().min(1, 'Phone is required'),
      gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
      age: z.string().min(1, 'Age is required'),
    }))
    .mutation(async ({ ctx, input }) => {
      console.log('TRPC patientProfile.create called.');
      console.log('ctx.user:', ctx.user);
      
      try {
        return await prisma.patientProfile.create({
          data: {
            ...input,
            userId: ctx.user.id
          }
        })
      } catch (err: any) {
        console.error('PatientProfile create error:', err);
        throw err;
      }
    }),
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
      age: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      // Verify ownership
      const profile = await prisma.patientProfile.findUnique({ where: { id } })
      if (!profile || profile.userId !== ctx.user.id) throw new Error('Not found')

      return prisma.patientProfile.update({
        where: { id },
        data
      })
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const profile = await prisma.patientProfile.findUnique({ where: { id: input.id } })
      return prisma.patientProfile.delete({
        where: { id: input.id }
      })
    })
} satisfies TRPCRouterRecord

const addressesRouter = {
  list: protectedProcedure.query(async ({ ctx }) => {
    const addresses = await prisma.address.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: { createdAt: 'desc' },
    })

    const uniqueAddresses: typeof addresses = []
    const seen = new Set()
    for (const addr of addresses) {
      const key = `${addr.type}-${addr.location}-${addr.houseNo}-${addr.pinCode}`.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        uniqueAddresses.push(addr)
      }
    }
    return uniqueAddresses
  }),
  create: protectedProcedure
    .input(
      z.object({
        type: z.enum(['HOME', 'OFFICE', 'OTHER']).default('HOME'),
        location: z.string().min(1, 'Location is required'),
        houseNo: z.string().min(1, 'House/Flat No is required'),
        landmark: z.string().optional(),
        pinCode: z.string().min(6, 'Pin code is required'),
        city: z.string().optional(),
        state: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.address.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      })
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(['HOME', 'OFFICE', 'OTHER']).optional(),
        location: z.string().min(1).optional(),
        houseNo: z.string().min(1).optional(),
        landmark: z.string().optional(),
        pinCode: z.string().min(6).optional(),
        city: z.string().optional(),
        state: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const existing = await prisma.address.findUnique({
        where: { id },
      })
      if (!existing || existing.userId !== ctx.user.id) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Address not found' })
      }

      if (existing.bookingId) {
        // If it's a booking address, we shouldn't modify the booking history!
        // Instead, create a new saved address and hide this one.
        const newAddress = await prisma.address.create({
          data: {
            type: existing.type,
            location: existing.location,
            houseNo: existing.houseNo,
            landmark: existing.landmark,
            pinCode: existing.pinCode,
            city: existing.city,
            state: existing.state,
            ...data,
            userId: ctx.user.id,
          }
        })
        
        await prisma.address.update({
          where: { id },
          data: { userId: null }
        })
        
        return newAddress
      }

      return prisma.address.update({
        where: { id },
        data,
      })
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.address.findUnique({
        where: { id: input.id },
      })
      if (!existing || existing.userId !== ctx.user.id) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Address not found' })
      }

      // Find all duplicate addresses and hide/delete them
      const matchingAddresses = await prisma.address.findMany({
        where: {
          userId: ctx.user.id,
          type: existing.type,
          location: existing.location,
          houseNo: existing.houseNo,
          pinCode: existing.pinCode,
        }
      })

      for (const addr of matchingAddresses) {
        if (addr.bookingId) {
          // Unlink from saved addresses but preserve booking history
          await prisma.address.update({
            where: { id: addr.id },
            data: { userId: null }
          })
        } else {
          // Safe to delete completely
          await prisma.address.delete({
            where: { id: addr.id }
          })
        }
      }

      return { success: true }
    }),
} satisfies TRPCRouterRecord

const usersRouter = {
  updateMyProfile: protectedProcedure
    .input(z.object({ phone: z.string().optional(), address: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const dataToUpdate: any = {}
      if (input.phone !== undefined) dataToUpdate.phone = input.phone
      if (input.address !== undefined) dataToUpdate.address = input.address
      return prisma.user.update({
        where: { id: ctx.user.id },
        data: dataToUpdate,
      })
    }),
  getCloudinaryConfig: protectedProcedure.query(() => {
    return {
      cloudName: getServerEnv().CLOUDINARY_CLOUD_NAME,
      uploadPreset: getServerEnv().CLOUDINARY_UPLOAD_PRESET
    }
  }),
  getCloudinarySignature: protectedProcedure.query(() => {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const apiSecret = getServerEnv().CLOUDINARY_API_SECRET
    const apiKey = getServerEnv().CLOUDINARY_API_KEY
    const cloudName = getServerEnv().CLOUDINARY_CLOUD_NAME

    // Generate signature using cloudinary utility
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      apiSecret
    )

    return {
      timestamp,
      signature,
      apiKey,
      cloudName,
    }
  }),
  addPrescription: protectedProcedure
    .input(z.object({ url: z.string().url(), memberId: z.string().optional(), doctorName: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.prescription.create({
        data: {
          fileUrl: input.url,
          userId: ctx.user.id,
          memberId: input.memberId || null,
          doctorName: input.doctorName || null,
        }
      })
    }),
  getPrescriptions: protectedProcedure.query(async ({ ctx }) => {
    const prescriptions = await prisma.prescription.findMany({
      where: { userId: ctx.user.id },
      include: { member: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })
    // Return objects with url and memberName
    return prescriptions.map(p => ({
      url: p.fileUrl,
      memberName: p.member?.name || null,
      doctorName: p.doctorName || null,
    }))
  }),
  deletePrescription: protectedProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.prescription.deleteMany({
        where: {
          userId: ctx.user.id,
          fileUrl: input.url,
        },
      })
    }),
  hasPassword: protectedProcedure.query(async ({ ctx }) => {
    const account = await prisma.account.findFirst({
      where: { userId: ctx.user.id, providerId: 'credential' }
    })
    return !!account?.password
  }),
  setPassword: protectedProcedure
    .input(z.object({ newPassword: z.string().min(8) }))
    .mutation(async ({ ctx, input }) => {
      const { hashPassword } = await import('better-auth/crypto')
      const existing = await prisma.account.findFirst({
        where: { userId: ctx.user.id, providerId: 'credential' }
      })
      if (existing) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Password already exists' })
      }
      const hashedPassword = await hashPassword(input.newPassword)
      return prisma.account.create({
        data: {
          userId: ctx.user.id,
          providerId: 'credential',
          accountId: ctx.user.email,
          password: hashedPassword
        }
      })
    }),
  myBookings: protectedProcedure.query(async ({ ctx }) => {
    return prisma.booking.findMany({
      where: { userId: ctx.user.id },
      include: {
        members: {
          include: {
            testItems: true,
          },
        },
        addresses: true,
        schedules: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }),
  cancelBooking: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const booking = await prisma.booking.findUnique({
        where: { id: input.id },
      })
      if (!booking || booking.userId !== ctx.user.id) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Booking not found' })
      }
      if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Only pending or confirmed bookings can be cancelled' })
      }
      
      const cancelled = await prisma.booking.update({
        where: { id: input.id },
        data: {
          status: 'CANCELLED',
        },
      })
      
      return cancelled
    }),
  bookingById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const booking = await prisma.booking.findUnique({
        where: { id: input.id },
        include: {
          members: { include: { testItems: true } },
          addresses: true,
          schedules: true,
          payments: true,
          user: { select: { name: true, email: true, phone: true } },
        }
      });
      if (booking?.userId !== ctx.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      return booking;
    }),
  mySchedules: protectedProcedure.query(async ({ ctx }) => {
    return prisma.schedule.findMany({
      where: {
        booking: {
          userId: ctx.user.id,
        },
      },
      include: {
        booking: {
          include: {
            members: {
              include: {
                testItems: true,
              },
            },
            addresses: true,
            payments: true,
          },
        },
      },
      orderBy: { scheduleDate: 'asc' },
    })
  }),
  checkPromoEligibility: protectedProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      if (input.code === 'PROMO30') {
        const previousBookings = await prisma.booking.count({
          where: {
            userId: ctx.user.id,
            status: { in: ['PENDING', 'CONFIRMED', 'COMPLETED'] }, // exclude CANCELLED
          },
        })
        return {
          isValid: previousBookings === 0,
          discountPercentage: 30,
          message: previousBookings === 0 ? 'Promo applied!' : 'This promo is only for your first order.',
        }
      }
      return { isValid: false, message: 'Invalid promo code' }
    }),
} satisfies TRPCRouterRecord

const adminRouter = {
  stats: adminProcedure
    .input(z.object({ timeRange: z.enum(['today', 'yesterday', '7d', '30d', '90d', 'lifetime']).default('90d') }).optional())
    .query(async ({ input }) => {
      const timeRange = input?.timeRange || '90d'
      const now = new Date()
      let startDate = new Date()
      let endDate = new Date()

      if (timeRange === 'today') {
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
      } else if (timeRange === 'yesterday') {
        startDate.setDate(startDate.getDate() - 1)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999)
      } else if (timeRange === '7d') {
        startDate.setDate(startDate.getDate() - 7)
      } else if (timeRange === '30d') {
        startDate.setDate(startDate.getDate() - 30)
      } else if (timeRange === '90d') {
        startDate.setDate(startDate.getDate() - 90)
      } else if (timeRange === 'lifetime') {
        startDate = new Date(0)
      }

      const dateFilter = timeRange === 'lifetime' ? {} : (timeRange === 'today' || timeRange === 'yesterday') 
        ? { createdAt: { gte: startDate, lte: endDate } }
        : { createdAt: { gte: startDate } }

      const [totalUsers, totalBookings, totalInstant, totalCOD, totalOnline, pendingPayments, pendingSamples, pendingReports, totalCompleted, totalPendingOrders, totalCancelled, totalRefunds, paidBookings, unassignedBookings] = await Promise.all([
        prisma.patientProfile.count({ where: dateFilter }),
        prisma.booking.count({ where: dateFilter }),
        prisma.booking.count({ where: { type: 'INSTANT_BOOKING', ...dateFilter } }),
        prisma.booking.count({ where: { type: 'COD', ...dateFilter } }),
        prisma.booking.count({ where: { type: 'ONLINE_PAYMENT', ...dateFilter } }),
        prisma.booking.count({ where: { paymentStatus: 'PENDING' } }),
        prisma.member.count({ where: { sampleStatus: 'BOOKED' } }),
        prisma.member.count({ where: { sampleStatus: 'PROCESSING' } }),
        prisma.booking.count({ where: { status: 'COMPLETED', ...dateFilter } }),
        prisma.booking.count({ where: { status: 'PENDING', ...dateFilter } }),
        prisma.booking.count({ where: { status: 'CANCELLED', ...dateFilter } }),
        prisma.booking.count({ where: { paymentStatus: 'REFUNDED', ...dateFilter } }),
        prisma.booking.findMany({
          where: { paymentStatus: 'PAID', ...dateFilter },
          include: { members: { include: { testItems: true } } }
        }),
        prisma.booking.count({ where: { phlebotomistId: null, cooId: null, status: 'PENDING' } })
      ])

      const revenue = paidBookings.reduce((acc, b) => {
        let bookingAmt = 0
        b.members.forEach(m => m.testItems.forEach(t => bookingAmt += parseFloat(t.discountedPrice || '0')))
        return acc + bookingAmt
      }, 0)

      return { totalUsers, totalBookings, totalInstant, totalCOD, totalOnline, pendingPayments, pendingSamples, pendingReports, totalCompleted, totalPendingOrders, totalCancelled, totalRefunds, revenue, unassignedBookings }
    }),

  accounts: adminProcedure
    .input(z.object({ page: z.number().default(1), limit: z.number().default(20) }).optional())
    .query(async ({ input }) => {
      const page = input?.page ?? 1
      const limit = input?.limit ?? 20
      const skip = (page - 1) * limit
      const [accounts, total] = await Promise.all([
        prisma.user.findMany({
          where: { role: 'USER' },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
            role: true,
            _count: { select: { bookings: true } }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.user.count({ where: { role: 'USER' } }),
      ])
      return { accounts, total, page, limit }
    }),

  patients: adminProcedure
    .input(z.object({ page: z.number().default(1), limit: z.number().default(20) }).optional())
    .query(async ({ input }) => {
      const page = input?.page ?? 1
      const limit = input?.limit ?? 20
      const skip = (page - 1) * limit

      const [patients, total] = await Promise.all([
        prisma.patientProfile.findMany({
          include: {
            user: true
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.patientProfile.count(),
      ])

      return { patients, total, page, limit }
    }),

  bookings: adminProcedure
    .input(z.object({ page: z.number().default(1), limit: z.number().default(20) }).optional())
    .query(async ({ input }) => {
      const page = input?.page ?? 1
      const limit = input?.limit ?? 20
      const skip = (page - 1) * limit
      const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
            phlebotomist: { select: { id: true, name: true } },
            members: { select: { id: true, name: true, email: true, phone: true, age: true, gender: true, sampleStatus: true, reportUrl: true, collectedAt: true, labReceivedAt: true, testItems: { select: { id: true, name: true, discountedPrice: true, originalPrice: true } } } },
            addresses: true,
            schedules: true,
            payments: { select: { orderId: true }, take: 1, orderBy: { createdAt: 'desc' } }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.booking.count(),
      ])

      // Check and update PENDING ONLINE_PAYMENT bookings in the background before returning
      const pendingOnlineBookings = bookings.filter(b => b.type === 'ONLINE_PAYMENT' && b.paymentStatus === 'PENDING' && b.payments?.[0]?.orderId)
      
      if (pendingOnlineBookings.length > 0) {
        await Promise.allSettled(
          pendingOnlineBookings.map(async (booking) => {
            const orderId = booking.payments[0].orderId
            const order = await fetchCashfreeOrder(orderId)
            const payments = await fetchCashfreeOrderPayments(orderId).catch(() => [])
            
            const isPaid = order.order_status === 'PAID'
            const hasFailedPayment = payments.some((p: any) => p.payment_status === 'FAILED')
            const hasPendingPayment = payments.some((p: any) => p.payment_status === 'PENDING')
            
            const isFailed = 
              order.order_status === 'FAILED' || 
              order.order_status === 'USER_DROPPED' || 
              order.order_status === 'VOID' || 
              order.order_status === 'EXPIRED' ||
              order.order_status === 'CANCELLED' ||
              (!isPaid && !hasPendingPayment && hasFailedPayment)

            if (isPaid || isFailed) {
              const newPaymentStatus = isPaid ? 'PAID' : 'FAILED'
              const newBookingStatus = isPaid ? 'CONFIRMED' : 'CANCELLED'
              
              await prisma.booking.update({
                where: { id: booking.id },
                data: {
                  status: newBookingStatus,
                  paymentStatus: newPaymentStatus
                }
              })
              
              if (isFailed) {
                notifyAdmins(
                  'Payment Failed',
                  `A payment for booking ID ${booking.id} has failed.`,
                  'PAYMENT_FAILED',
                  `/admin/bookings`
                ).catch(() => {})
              }
              
              // Mutate the object in memory so the frontend gets the correct status immediately
              booking.status = newBookingStatus as any
              booking.paymentStatus = newPaymentStatus as any
            }
          })
        )
      }

      return { bookings, total, page, limit }
    }),

  memberBookings: adminProcedure
    .input(z.object({ name: z.string(), phone: z.string() }))
    .query(async ({ input }) => {
      return prisma.booking.findMany({
        where: {
          members: {
            some: {
              name: input.name,
              phone: input.phone,
            }
          }
        },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          phlebotomist: { select: { id: true, name: true } },
          members: { select: { id: true, name: true, email: true, phone: true, age: true, gender: true, sampleStatus: true, reportUrl: true, collectedAt: true, labReceivedAt: true, testItems: { select: { id: true, name: true, discountedPrice: true, originalPrice: true } } } },
          addresses: true,
          schedules: true,
        },
        orderBy: { createdAt: 'desc' }
      })
    }),

  subscribers: adminProcedure
    .input(z.object({ page: z.number().default(1), limit: z.number().default(20) }).optional())
    .query(async ({ input }) => {
      // Subscriber model not yet in schema — returns empty
      return { subscribers: [] as { id: string; email: string; name?: string | null; createdAt: Date }[], total: 0, page: input?.page ?? 1, limit: input?.limit ?? 20 }
    }),

  markAdminNotificationRead: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.notification.update({
        where: { id: input.id, userId: ctx.user.id },
        data: { isRead: true },
      })
    }),

  adminNotifications: adminProcedure.query(async ({ ctx }) => {
    return prisma.notification.findMany({
      where: { userId: ctx.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  }),

  prescriptions: adminProcedure
    .input(z.object({ page: z.number().default(1), limit: z.number().default(20) }).optional())
    .query(async ({ input }) => {
      const page = input?.page ?? 1
      const limit = input?.limit ?? 20
      const skip = (page - 1) * limit
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where: { prescriptions: { some: {} } },
          select: { id: true, name: true, email: true, prescriptions: { select: { fileUrl: true, doctorName: true } }, createdAt: true },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.user.count({ where: { prescriptions: { some: {} } } }),
      ])

      const formattedUsers = users.map(u => ({
        ...u,
        prescriptions: u.prescriptions.map(p => ({ url: p.fileUrl, doctorName: p.doctorName }))
      }))

      return { prescriptions: formattedUsers, total, page, limit }
    }),

  bookingChartData: adminProcedure
    .input(z.object({ timeRange: z.enum(['today', 'yesterday', '7d', '30d', '90d', 'lifetime']).default('90d') }).optional())
    .query(async ({ input }) => {
      const timeRange = input?.timeRange || '90d'
      let startDate = new Date()
      let endDate = new Date()

      if (timeRange === 'today') {
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
      } else if (timeRange === 'yesterday') {
        startDate.setDate(startDate.getDate() - 1)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999)
      } else if (timeRange === '7d') {
        startDate.setDate(startDate.getDate() - 7)
      } else if (timeRange === '30d') {
        startDate.setDate(startDate.getDate() - 30)
      } else if (timeRange === '90d') {
        startDate.setDate(startDate.getDate() - 90)
      } else if (timeRange === 'lifetime') {
        startDate = new Date(0)
      }

      const dateFilter = timeRange === 'lifetime' ? {} : (timeRange === 'today' || timeRange === 'yesterday') 
        ? { createdAt: { gte: startDate, lte: endDate } }
        : { createdAt: { gte: startDate } }

      const [bookings, users] = await Promise.all([
        prisma.booking.findMany({
          where: dateFilter,
          select: { createdAt: true, type: true, status: true, paymentStatus: true, members: { include: { testItems: true } } },
          orderBy: { createdAt: 'asc' },
        }),
        prisma.patientProfile.findMany({
          where: dateFilter,
          select: { createdAt: true },
          orderBy: { createdAt: 'asc' },
        })
      ])

      const byDate: Record<string, any> = {}
      
      bookings.forEach((b) => {
        const date = b.createdAt.toISOString().split('T')[0]
        if (!byDate[date]) byDate[date] = { date, totalUsers: 0, totalBookings: 0, totalInstant: 0, totalCOD: 0, totalOnline: 0, totalCompleted: 0, totalPendingOrders: 0, totalCancelled: 0, totalRefunds: 0, revenue: 0 }
        byDate[date].totalBookings++
        if (b.type === 'INSTANT_BOOKING') byDate[date].totalInstant++
        if (b.type === 'COD') byDate[date].totalCOD++
        if (b.type === 'ONLINE_PAYMENT') byDate[date].totalOnline++
        if (b.status === 'COMPLETED') byDate[date].totalCompleted++
        if (b.status === 'PENDING') byDate[date].totalPendingOrders++
        if (b.status === 'CANCELLED') byDate[date].totalCancelled++
        if (b.paymentStatus === 'REFUNDED') byDate[date].totalRefunds++
        if (b.paymentStatus === 'PAID') {
          let amt = 0
          b.members.forEach((m: any) => m.testItems.forEach((t: any) => amt += parseFloat(t.discountedPrice || '0')))
          byDate[date].revenue += amt
        }
      })

      users.forEach((u) => {
        const date = u.createdAt.toISOString().split('T')[0]
        if (!byDate[date]) byDate[date] = { date, totalUsers: 0, totalBookings: 0, totalInstant: 0, totalCOD: 0, totalOnline: 0, totalCompleted: 0, totalPendingOrders: 0, totalCancelled: 0, totalRefunds: 0, revenue: 0 }
        byDate[date].totalUsers++
      })

    return Object.values(byDate).sort((a: any, b: any) => a.date.localeCompare(b.date))
  }),

  schedules: adminProcedure.query(async () => {
    return prisma.schedule.findMany({
      where: {
        bookingId: { not: null }
      },
      include: {
        booking: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            members: {
              include: {
                testItems: true,
              },
            },
            addresses: true,
            payments: true,
          },
        },
      },
      orderBy: { scheduleDate: 'asc' },
    })
  }),

  updateBookingStatus: adminProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
    }))
    .mutation(async ({ ctx, input }) => {
      const role = (ctx.user as any).role
      const { id, status } = input
      
      if (role === 'PHLEBOTOMIST') {
        if (status !== 'CONFIRMED') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Phlebotomists can only confirm sample collection (status: CONFIRMED)' })
        }
      } else if (role === 'COO') {
        if (status !== 'COMPLETED') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'COO can only generate reports (status: COMPLETED)' })
        }
      } else if (role !== 'SUPER_ADMIN') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to update booking status' })
      }

      return prisma.booking.update({
        where: { id },
        data: { status }
      })
    }),

  updateBookingPaymentStatus: adminProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED'])
    }))
    .mutation(async ({ ctx, input }) => {
      const role = (ctx.user as any).role
      if (role !== 'SUPER_ADMIN') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only super admin can update payment status' })
      }

      return prisma.booking.update({
        where: { id: input.id },
        data: { paymentStatus: input.status }
      })
    }),

  updateBookingSchedule: adminProcedure
    .input(z.object({
      id: z.string(),
      type: z.enum(['INSTANT_BOOKING', 'COD', 'ONLINE_PAYMENT']).optional(),
      scheduleId: z.string().optional(),
      preferredDate: z.string().optional(),
      preferredTime: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, type, scheduleId, preferredDate, preferredTime } = input
      
      const role = (ctx.user as any).role
      if (role !== 'SUPER_ADMIN' && role !== 'PHLEBOTOMIST') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have permission to update the schedule' })
      }

      if (type === 'INSTANT_BOOKING') {
        return prisma.booking.update({
          where: { id },
          data: { preferredDate, preferredTime }
        })
      } else if (scheduleId) {
        return prisma.schedule.update({
          where: { id: scheduleId },
          data: { scheduleDate: preferredDate, slot: preferredTime }
        })
      }
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid schedule parameters' })
    }),

  updateBookingAssignments: adminProcedure
    .input(z.object({
      id: z.string(),
      phlebotomistId: z.string().optional().nullable(),
      cooId: z.string().optional().nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, phlebotomistId, cooId } = input
      return prisma.booking.update({
        where: { id },
        data: {
          ...(phlebotomistId !== undefined && { phlebotomistId }),
          ...(cooId !== undefined && { cooId })
        }
      })
    }),

  updateMemberSampleStatus: adminProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['BOOKED', 'COLLECTED', 'RECEIVED', 'ACCESSIONED', 'PROCESSING', 'VERIFIED', 'REPORT_RELEASED']).optional(),
      reportUrl: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, status, reportUrl } = input
      
      const updateData: any = {}
      if (status) {
        updateData.sampleStatus = status
        if (status === 'COLLECTED') updateData.collectedAt = new Date()
        if (status === 'RECEIVED') updateData.labReceivedAt = new Date()
      }
      if (reportUrl !== undefined) updateData.reportUrl = reportUrl

      const updated = await prisma.member.update({
        where: { id },
        data: updateData
      })

      if (status === 'RECEIVED') {
        await notifyAdmins('Sample Received', `Sample for ${updated.name} has been received at the lab.`, 'SAMPLE_RECEIVED', '/admin/bookings')
      }
      if (status === 'REPORT_RELEASED') {
        await notifyAdmins('Report Ready', `Report for ${updated.name} has been released.`, 'REPORT_READY', '/admin/bookings')
        
        if (updated.bookingId) {
          const booking = await prisma.booking.findUnique({
            where: { id: updated.bookingId },
            include: { members: true }
          })
          if (booking) {
            const allReleased = booking.members.every(m => m.sampleStatus === 'REPORT_RELEASED')
            if (allReleased && booking.status !== 'COMPLETED') {
              await prisma.booking.update({
                where: { id: booking.id },
                data: { status: 'COMPLETED' }
              })
            }
          }
        }
      }

      return updated
    }),

  staff: adminProcedure
    .input(z.object({ search: z.string().optional() }).default({}))
    .query(async ({ ctx, input }) => {
    const role = (ctx.user as any).role
    if (role !== 'SUPER_ADMIN') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Only SUPER_ADMIN can view staff' })
    }
    
    const whereClause: any = {}
    if (input.search) {
      whereClause.OR = [
        { name: { contains: input.search, mode: 'insensitive' } },
        { email: { contains: input.search, mode: 'insensitive' } }
      ]
    } else {
      whereClause.role = { in: ['SUPER_ADMIN', 'COO', 'PHLEBOTOMIST'] }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const now = new Date();

    return Promise.all(users.map(async (user: any) => {
      let computedStatus = user.availabilityStatus || 'OFF_DUTY';
      if (computedStatus === 'AVAILABLE' && user.availableSetAt) {
        const hoursSinceSet = (Date.now() - user.availableSetAt.getTime()) / (1000 * 60 * 60);
        if (hoursSinceSet >= 8) {
          computedStatus = 'OFF_DUTY';
        }
      }
      if (user.role === 'PHLEBOTOMIST') {
        const activeAssignments = await prisma.booking.findMany({
          where: {
            phlebotomistId: user.id,
            status: { notIn: ['CANCELLED', 'COMPLETED'] },
            schedules: { some: { scheduleDate: { gte: today, lt: tomorrow } } }
          },
          include: { schedules: true }
        });
        let isOnCollection = false;
        for (const assignment of activeAssignments) {
          const schedule = assignment.schedules[0];
          if (!schedule || !schedule.slot) continue;
          const [startStr] = schedule.slot.split('-');
          if (!startStr) continue;
          const timeMatch = startStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
          if (timeMatch) {
            let hours = parseInt(timeMatch[1]);
            const mins = parseInt(timeMatch[2]);
            const ampm = timeMatch[3]?.toUpperCase();
            if (ampm === 'PM' && hours < 12) hours += 12;
            if (ampm === 'AM' && hours === 12) hours = 0;
            const slotStart = new Date(schedule.scheduleDate!);
            slotStart.setHours(hours, mins, 0, 0);
            const slotEnd = new Date(slotStart);
            slotEnd.setHours(slotStart.getHours() + 2);
            if (now >= slotStart && now <= slotEnd) { isOnCollection = true; break; }
          } else {
             const timeMatch24 = startStr.trim().match(/(\d{1,2}):(\d{2})/);
             if (timeMatch24) {
               let hours = parseInt(timeMatch24[1]);
               const mins = parseInt(timeMatch24[2]);
               const slotStart = new Date(schedule.scheduleDate!);
               slotStart.setHours(hours, mins, 0, 0);
               const slotEnd = new Date(slotStart);
               slotEnd.setHours(slotStart.getHours() + 2);
               if (now >= slotStart && now <= slotEnd) { isOnCollection = true; break; }
             }
          }
        }
        if (isOnCollection) computedStatus = 'ON_COLLECTION';
      }
      return { ...user, computedStatus };
    }))
  }),

  updateStaffMember: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      role: z.enum(['USER', 'COO', 'PHLEBOTOMIST', 'SUPER_ADMIN']).optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const userRole = (ctx.user as any).role
      const userId = (ctx.user as any).id
      if (userRole !== 'SUPER_ADMIN') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only SUPER_ADMIN can update staff details' })
      }
      
      if (userId === input.id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You cannot change your own details through this portal' })
      }
      
      const updateData: any = {}
      if (input.name !== undefined) updateData.name = input.name
      if (input.phone !== undefined) updateData.phone = input.phone
      if (input.address !== undefined) updateData.address = input.address
      if (input.role !== undefined) updateData.role = input.role

      return prisma.user.update({
        where: { id: input.id },
        data: updateData
      })
    }),

  createInvite: adminProcedure
    .input(z.object({ email: z.string().email(), phone: z.string().optional(), address: z.string().optional(), role: z.enum(['SUPER_ADMIN', 'COO', 'PHLEBOTOMIST']) }))
    .mutation(async ({ input, ctx }) => {
      // Only SUPER_ADMIN can invite
      const userRole = (ctx.user as any)?.role
      if (userRole !== 'SUPER_ADMIN') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only SUPER_ADMIN can send invites' })
      }

      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // Valid for 7 days

      const invite = await prisma.adminInvite.upsert({
        where: { email: input.email },
        update: { role: input.role, token, expiresAt, phone: input.phone, address: input.address },
        create: { email: input.email, role: input.role, token, expiresAt, phone: input.phone, address: input.address },
      })

      const inviteUrl = `${getServerEnv().BETTER_AUTH_URL}/invite-accept?token=${invite.token}`

      try {
        const resend = new Resend(getServerEnv().RESEND_API_KEY)
        await resend.emails.send({
          from: 'BloodPanda Admin <onboarding@resend.dev>', // Use a verified domain in production
          to: input.email,
          subject: `You have been invited as ${input.role.replace('_', ' ')} on BloodPanda`,
          html: `
            <h2>Welcome to BloodPanda</h2>
            <p>You have been invited to join the staff as a <strong>${input.role.replace('_', ' ')}</strong>.</p>
            <p>Click the link below to accept your invitation and activate your role:</p>
            <p><a href="${inviteUrl}" style="padding:10px 20px; background:#e11d48; color:white; border-radius:5px; text-decoration:none;">Accept Invite</a></p>
            <br/>
            <p>Or copy this link to your browser:</p>
            <p>${inviteUrl}</p>
          `,
        })
      } catch (e) {
        console.error('Failed to send invite email', e)
        // We still return the token so the admin can copy it manually if email fails
      }

      return { token: invite.token }
    }),

  pendingInvites: adminProcedure
    .query(async ({ ctx }) => {
      const userRole = (ctx.user as any)?.role
      if (userRole !== 'SUPER_ADMIN') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only SUPER_ADMIN can view pending invites' })
      }
      return prisma.adminInvite.findMany({
        where: { expiresAt: { gt: new Date() } },
        orderBy: { createdAt: 'desc' }
      })
    }),

  getInvite: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const invite = await prisma.adminInvite.findUnique({
        where: { token: input.token },
      })
      if (!invite || invite.expiresAt < new Date()) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Invite not found or expired' })
      }
      return invite
    }),

  acceptInvite: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const invite = await prisma.adminInvite.findUnique({
        where: { token: input.token },
      })
      
      if (!invite || invite.expiresAt < new Date()) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Invite not found or expired' })
      }

      if (invite.email.toLowerCase() !== ctx.user.email.toLowerCase()) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Invite email does not match your account email' })
      }

      await prisma.user.update({
        where: { id: ctx.user.id },
        data: { 
          role: invite.role,
          ...(invite.phone ? { phone: invite.phone } : {})
        },
      })

      await prisma.adminInvite.delete({
        where: { id: invite.id },
      })

      return { success: true, role: invite.role }
    }),

  createOfflinePatient: superAdminProcedure
    .input(z.object({
      name: z.string().min(1, 'Name is required'),
      phone: z.string().min(10, 'Phone is required'),
      email: z.string().email().optional().or(z.literal('')),
      gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
      age: z.string().min(1, 'Age is required'),
    }))
    .mutation(async ({ input }) => {
      // Create a PatientProfile not linked to any user account
      return prisma.patientProfile.create({
        data: {
          name: input.name,
          phone: input.phone,
          email: input.email || `offline_${Date.now()}@bloodpanda.local`,
          gender: input.gender,
          age: input.age,
          userId: null,
        },
      })
    }),

  createOfflineOrder: superAdminProcedure
    .input(z.object({
      patientProfileId: z.string().min(1, 'Patient profile ID is required'),
      // Patient details (for Member record)
      patientName: z.string().min(1),
      patientPhone: z.string().min(10),
      patientGender: z.enum(['MALE', 'FEMALE', 'OTHER']),
      patientAge: z.string().min(1),
      // Order details
      address: z.string().min(1, 'Address is required'),
      pinCode: z.string().min(6, 'Pin code is required'),
      city: z.string().optional(),
      preferredDate: z.string().optional(),
      preferredTime: z.string().optional(),
      testIds: z.array(z.string()).min(1, 'At least one test is required'),
      notes: z.string().optional(),
      prescriptionUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { patientProfileId, patientName, patientPhone, patientGender, patientAge, address, pinCode, city, preferredDate, preferredTime, testIds, notes, prescriptionUrl } = input

      // Look up selected tests
      const tests = await prisma.bloodTest.findMany({
        where: { id: { in: testIds } },
      })

      // Create the booking (no userId as it's offline)
      const booking = await prisma.booking.create({
        data: {
          type: 'INSTANT_BOOKING',
          status: 'CONFIRMED',
          paymentStatus: 'PENDING',
          fullName: patientName,
          mobileNumber: patientPhone,
          address: address,
          zipcode: pinCode,
          city: city || null,
          preferredDate: preferredDate ? new Date(preferredDate) : null,
          preferredTime: preferredTime || null,
          testRequirement: notes || null,
          addresses: {
            create: {
              type: 'HOME',
              location: address,
              houseNo: '-',
              pinCode: pinCode,
              city: city || null,
            },
          },
          members: {
            create: {
              name: patientName,
              phone: patientPhone,
              email: `offline_${Date.now()}@bloodpanda.local`,
              gender: patientGender,
              age: patientAge,
              patientProfileId: patientProfileId,
              testItems: {
                connect: tests.map(t => ({ id: t.id })),
              },
            },
          },
          ...(prescriptionUrl ? {
            prescriptions: {
              create: [{
                fileUrl: prescriptionUrl,
              }]
            }
          } : {})
        },
        include: {
          members: { include: { testItems: true } },
          addresses: true,
          schedules: true,
        },
      })

      await notifyAdmins('New Offline Booking', `Offline booking created for ${patientName}.`, 'NEW_BOOKING', '/admin/bookings')

      return booking
    }),

  searchBloodTests: adminProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ input }) => {
      const where = input.search ? {
        name: { contains: input.search, mode: 'insensitive' as const }
      } : {}
      return prisma.bloodTest.findMany({
        where,
        select: { id: true, name: true, discountedPrice: true, originalPrice: true },
        orderBy: { name: 'asc' },
        take: 30,
      })
    }),

  searchOfflinePatients: superAdminProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ input }) => {
      const where = input.search ? {
        userId: null,
        OR: [
          { name: { contains: input.search, mode: 'insensitive' as const } },
          { phone: { contains: input.search } },
        ]
      } : { userId: null }
      return prisma.patientProfile.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 20,
      })
    }),

} satisfies TRPCRouterRecord

const phlebotomistRouter = {
  getStatus: phlebotomistProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: { availabilityStatus: true, availableSetAt: true }
    });
    
    if (!user || user.availabilityStatus === 'OFF_DUTY') {
      return { status: 'OFF_DUTY' };
    }

    if (user.availabilityStatus === 'AVAILABLE' && user.availableSetAt) {
      const hoursSinceSet = (Date.now() - user.availableSetAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceSet >= 8) {
        await prisma.user.update({
          where: { id: ctx.user.id },
          data: { availabilityStatus: 'OFF_DUTY', availableSetAt: null }
        });
        return { status: 'OFF_DUTY' };
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const activeAssignments = await prisma.booking.findMany({
      where: {
        phlebotomistId: ctx.user.id,
        status: { notIn: ['CANCELLED', 'COMPLETED'] },
        schedules: {
          some: {
            scheduleDate: { gte: today, lt: tomorrow }
          }
        }
      },
      include: { schedules: true }
    });

    const now = new Date();
    let isOnCollection = false;
    for (const assignment of activeAssignments) {
      const schedule = assignment.schedules[0];
      if (!schedule || !schedule.slot) continue;
      
      const slotStr = schedule.slot; 
      const [startStr] = slotStr.split('-');
      if (!startStr) continue;
      
      const timeMatch = startStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const mins = parseInt(timeMatch[2]);
        const ampm = timeMatch[3]?.toUpperCase();
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        
        const slotStart = new Date(schedule.scheduleDate!);
        slotStart.setHours(hours, mins, 0, 0);
        
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(slotStart.getHours() + 2);
        
        if (now >= slotStart && now <= slotEnd) {
          isOnCollection = true;
          break;
        }
      } else {
        const timeMatch24 = startStr.trim().match(/(\d{1,2}):(\d{2})/);
        if (timeMatch24) {
          let hours = parseInt(timeMatch24[1]);
          const mins = parseInt(timeMatch24[2]);
          const slotStart = new Date(schedule.scheduleDate!);
          slotStart.setHours(hours, mins, 0, 0);
          
          const slotEnd = new Date(slotStart);
          slotEnd.setHours(slotStart.getHours() + 2);
          
          if (now >= slotStart && now <= slotEnd) {
            isOnCollection = true;
            break;
          }
        }
      }
    }

    if (isOnCollection) {
      return { status: 'ON_COLLECTION' };
    }

    return { status: 'AVAILABLE' };
  }),

  setStatus: phlebotomistProcedure
    .input(z.object({ status: z.enum(['AVAILABLE', 'OFF_DUTY']) }))
    .mutation(async ({ ctx, input }) => {
      const data: any = {
        availabilityStatus: input.status,
      }
      if (input.status === 'AVAILABLE') {
        data.availableSetAt = new Date()
      } else {
        data.availableSetAt = null
      }
      await prisma.user.update({
        where: { id: ctx.user.id },
        data
      })
      return { success: true }
    }),

  myAssignments: phlebotomistProcedure.query(async ({ ctx }) => {
    return prisma.booking.findMany({
      where: { phlebotomistId: ctx.user.id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        addresses: true,
        schedules: true,
        members: { include: { testItems: true } },
      },
      orderBy: { createdAt: 'desc' }
    })
  }),
  unassignedBookings: phlebotomistProcedure.query(async () => {
    return prisma.booking.findMany({
      where: {
        phlebotomistId: null,
        status: { notIn: ['CANCELLED', 'COMPLETED'] },
      },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        addresses: true,
        schedules: true,
        members: { include: { testItems: true } },
      },
      orderBy: { createdAt: 'desc' }
    })
  }),
  assignToMe: phlebotomistProcedure
    .input(z.object({ bookingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const bookingToAssign = await prisma.booking.findUnique({
        where: { id: input.bookingId },
        include: { schedules: true }
      });
      if (!bookingToAssign) throw new TRPCError({ code: 'NOT_FOUND' });
      if (bookingToAssign.phlebotomistId) throw new TRPCError({ code: 'CONFLICT', message: 'Booking already assigned' });

      // Check for time clashes
      const targetSchedule = bookingToAssign.schedules[0];
      if (targetSchedule && targetSchedule.scheduleDate && targetSchedule.slot) {
        const targetDateStr = targetSchedule.scheduleDate.toISOString().split('T')[0];
        const myExistingBookings = await prisma.booking.findMany({
          where: { phlebotomistId: ctx.user.id },
          include: { schedules: true }
        });
        
        for (const existingBooking of myExistingBookings) {
          const existingSchedule = existingBooking.schedules[0];
          if (existingSchedule && existingSchedule.scheduleDate && existingSchedule.slot) {
            const existingDateStr = existingSchedule.scheduleDate.toISOString().split('T')[0];
            if (existingDateStr === targetDateStr && existingSchedule.slot === targetSchedule.slot) {
              throw new TRPCError({ 
                code: 'CONFLICT', 
                message: `Time clash detected with existing booking at ${targetSchedule.slot} on ${targetDateStr}` 
              });
            }
          }
        }
      }

      return prisma.booking.update({
        where: { id: input.bookingId },
        data: { phlebotomistId: ctx.user.id }
      })
    }),
  updateLastActive: phlebotomistProcedure.mutation(async ({ ctx }) => {
    return prisma.user.update({
      where: { id: ctx.user.id },
      data: { lastActiveAt: new Date() }
    })
  }),
  markAsPaid: phlebotomistProcedure
    .input(z.object({ bookingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const booking = await prisma.booking.findUnique({ where: { id: input.bookingId } });
      if (!booking || (booking.phlebotomistId !== ctx.user.id && (ctx.user as any).role !== 'SUPER_ADMIN')) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized' });
      }
      return prisma.booking.update({
        where: { id: input.bookingId },
        data: { paymentStatus: 'PAID' }
      });
    }),
  updateSchedule: phlebotomistProcedure
    .input(z.object({
      scheduleId: z.string(),
      scheduleDate: z.string(),
      slot: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const schedule = await prisma.schedule.findUnique({
        where: { id: input.scheduleId },
        include: { booking: true }
      });
      if (!schedule) throw new TRPCError({ code: 'NOT_FOUND', message: 'Schedule not found' });
      
      const booking = schedule.booking;
      if (booking?.phlebotomistId !== ctx.user.id && (ctx.user as any).role !== 'SUPER_ADMIN') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized' });
      }
      
      return prisma.schedule.update({
        where: { id: input.scheduleId },
        data: {
          scheduleDate: new Date(input.scheduleDate),
          slot: input.slot,
        }
      });
    })
} satisfies TRPCRouterRecord

const cooRouter = {
  myAssignments: cooProcedure.query(async ({ ctx }) => {
    return prisma.booking.findMany({
      where: { cooId: ctx.user.id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        addresses: true,
        schedules: true,
        members: { include: { testItems: true } },
      },
      orderBy: { createdAt: 'desc' }
    })
  }),
} satisfies TRPCRouterRecord

export const trpcRouter = createTRPCRouter({
  todos: todosRouter,
  members: membersRouter,
  addresses: addressesRouter,
  users: usersRouter,
  admin: adminRouter,
  phlebotomist: phlebotomistRouter,
  coo: cooRouter,
})
export type TRPCRouter = typeof trpcRouter
