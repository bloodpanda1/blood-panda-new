import { getServerEnv } from '#/config/server-env'
import { prisma } from '#/db'
import {
  createCashfreeOrder,
  fetchCashfreeOrder,
  fetchCashfreeOrderPayments,
} from '#/integrations/cashfree'
import { notifyAdmins } from './notifications'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { authMiddleware } from './middleware'
import { bookingFormSchema } from './validators/booking-schema'

const checkoutOrderPayload = z
  .object({
    bookingId: z.string(),
    totalPrice: z.number(),
  })
  .extend(bookingFormSchema.shape)

export const createCheckOutLink = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(checkoutOrderPayload)
  .handler(async ({ data, context }) => {
    const { user } = context
    const baseUrl = getServerEnv().BETTER_AUTH_URL

    // Generate unique Cashfree order ID (max 45 chars, alphanumeric with _ -)
    const cleanBookingId = data.bookingId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)
    const timestamp = Date.now().toString().slice(-6)
    const cfOrderId = `BP_${cleanBookingId}_${timestamp}`

    const primaryMember = data.memberDetails[0]

    try {
      const order = await createCashfreeOrder({
        orderId: cfOrderId,
        orderAmount: data.totalPrice,
        orderCurrency: 'INR',
        customer: {
          customerId: user.id,
          customerName: user.name || primaryMember?.name || 'Customer',
          customerEmail: user.email || primaryMember?.email || 'patient@bloodpanda.com',
          customerPhone: primaryMember?.phone || '9999999999',
        },
        returnUrl: `${baseUrl}/payment-status?order_id={order_id}&bookingId=${data.bookingId}`,
        notifyUrl: `${baseUrl}/api/payment/callback`,
        orderNote: `Blood Test Booking #${data.bookingId.slice(0, 8)}`,
      })

      // Create initial Payment entry in Prisma database
      await prisma.payment.create({
        data: {
          merchantId: getServerEnv().CASHFREE_APP_ID,
          merchantOrderId: data.bookingId,
          orderId: order.order_id,
          state: order.order_status || 'PENDING',
          amount: String(data.totalPrice),
          currency: 'INR',
          expireAt: order.order_expiry_time || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          userId: user.id,
          bookingId: data.bookingId,
        },
      })

      return {
        paymentSessionId: order.payment_session_id,
        orderId: order.order_id,
        bookingId: data.bookingId,
        // In sandbox or hosted redirect mode, Cashfree provides hosted payment URL or session ID
        paymentUrl: null,
      }
    } catch (error: any) {
      console.error('Error initiating Cashfree checkout:', error)
      throw new Error(error.message || 'Failed to initialize Cashfree payment checkout')
    }
  })

// Query payment status on verify / return page
const checkPaymentStatusPayload = z.object({
  orderId: z.string(),
  bookingId: z.string().optional(),
})

export const checkPaymentStatus = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(checkPaymentStatusPayload)
  .handler(async ({ data }) => {
    try {
      const order = await fetchCashfreeOrder(data.orderId)
      const payments = await fetchCashfreeOrderPayments(data.orderId).catch(() => [])

      const isPaid = order.order_status === 'PAID'
      const successfulPayment = payments.find((p) => p.payment_status === 'SUCCESS')

      const hasFailedPayment = payments.some((p: any) => p.payment_status === 'FAILED')
      const hasPendingPayment = payments.some((p: any) => p.payment_status === 'PENDING')

      const isFailed = 
        order.order_status === 'FAILED' || 
        order.order_status === 'USER_DROPPED' || 
        order.order_status === 'VOID' || 
        order.order_status === 'EXPIRED' ||
        order.order_status === 'CANCELLED' ||
        (!isPaid && !hasPendingPayment && hasFailedPayment)

      if (data.bookingId) {
        let bookingStatus: any = 'PENDING'
        let paymentStatus: any = 'PENDING'

        if (isPaid) {
          bookingStatus = 'CONFIRMED'
          paymentStatus = 'PAID'
        } else if (isFailed) {
          paymentStatus = 'FAILED'
          bookingStatus = 'CANCELLED' // Optionally cancel the booking or leave it pending, but user implies payment failed. Let's leave booking status PENDING or update it. Wait, standard is just updating paymentStatus to FAILED.
        }

        // Update booking and payment in DB
        await prisma.booking.update({
          where: { id: data.bookingId },
          data: { 
            status: isPaid ? 'CONFIRMED' : isFailed ? 'CANCELLED' : undefined,
            paymentStatus: isPaid ? 'PAID' : isFailed ? 'FAILED' : 'PENDING'
          },
        })

        if (isFailed) {
          notifyAdmins(
            'Payment Failed',
            `A payment for booking ID ${data.bookingId} has failed.`,
            'PAYMENT_FAILED',
            `/admin/bookings`
          )
        }

        await prisma.payment.updateMany({
          where: { orderId: data.orderId },
          data: {
            state: order.order_status,
          },
        })
      }

      return {
        order,
        payments,
        isPaid,
        isFailed,
        paymentDetails: successfulPayment || payments[0] || null,
      }
    } catch (error: any) {
      console.error('Error checking payment status:', error)
      throw new Error(error.message || 'Failed to check payment status')
    }
  })

// used under webhook
const createPaymentRecordPayload = z.object({
  merchantId: z.string(),
  merchantOrderId: z.string(),
  orderId: z.string(),
  state: z.string(),
  amount: z.string(),
  currency: z.string(),
  expireAt: z.string(),
  userId: z.string(),
  bookingId: z.string(),
})

export const createPaymentRecord = createServerFn({ method: 'POST' })
  .validator(createPaymentRecordPayload)
  .handler(async ({ data }) => {
    try {
      const result = await prisma.payment.create({
        data: {
          merchantId: data.merchantId,
          merchantOrderId: data.merchantOrderId,
          orderId: data.orderId,
          state: data.state,
          amount: data.amount,
          currency: data.currency,
          expireAt: data.expireAt,
          userId: data.userId,
          bookingId: data.bookingId,
        },
      })
      return result
    } catch (error) {
      console.error('Error creating payment record:', error)
      throw new Error('Failed to create payment record')
    }
  })

const createWebhookRecordSchema = z.object({
  payload: z.any(),
  paymentId: z.string().optional(),
})

export const createWebhookRecord = createServerFn({ method: 'POST' })
  .validator(createWebhookRecordSchema)
  .handler(async ({ data }) => {
    try {
      const result = await prisma.webhookLog.create({
        data: {
          payload: typeof data.payload === 'string' ? JSON.parse(data.payload) : data.payload,
          paymentId: data.paymentId || null,
        },
      })
      return result
    } catch (error) {
      console.error('Error creating webhook record:', error)
      throw new Error('Failed to create webhook record')
    }
  })
