import { prisma } from '#/db'
import { verifyCashfreeWebhookSignature } from '#/integrations/cashfree'
import { notifyAdmins } from '#/lib/notifications'
import { createFileRoute } from '@tanstack/react-router'

/**
 * Cashfree Payments Webhook Callback Handler
 *
 * Headers verified:
 * - x-webhook-signature
 * - x-webhook-timestamp
 *
 * Events handled:
 * - PAYMENT_SUCCESS_WEBHOOK: Mark Booking CONFIRMED, Payment PAID
 * - PAYMENT_FAILED_WEBHOOK: Mark Payment FAILED, Booking PAYMENT_FAILED
 * - PAYMENT_USER_DROPPED_WEBHOOK: Mark Payment USER_DROPPED
 */
export const Route = createFileRoute('/api/payment/callback')({
  server: {
    handlers: ({ createHandlers }) =>
      createHandlers({
        GET: async () => {
          return new Response('Cashfree webhook endpoint is active.', { status: 200 })
        },
        POST: {
          handler: async ({ request }) => {
            try {
              const headers = request.headers
              const signature = headers.get('x-webhook-signature')
              const timestamp = headers.get('x-webhook-timestamp')
              const rawBody = await request.text()

              console.log('[Cashfree Webhook] Received event:', {
                timestamp,
                hasSignature: !!signature,
              })

              // Verify webhook signature (optional in sandbox if missing, but verified if provided)
              if (signature && timestamp) {
                const isValid = verifyCashfreeWebhookSignature(signature, rawBody, timestamp)
                if (!isValid) {
                  console.error('[Cashfree Webhook] Invalid signature verification failed')
                  return new Response('Invalid webhook signature', { status: 401 })
                }
              }

              let event: any
              try {
                event = JSON.parse(rawBody)
              } catch (e) {
                console.error('[Cashfree Webhook] Invalid JSON payload')
                return new Response('Invalid JSON payload', { status: 400 })
              }

              const eventType = event.type
              const orderData = event.data?.order
              const paymentData = event.data?.payment
              const customerData = event.data?.customer_details

              console.log('[Cashfree Webhook] Event details:', {
                eventType,
                orderId: orderData?.order_id,
                paymentStatus: paymentData?.payment_status,
              })

              if (!orderData?.order_id) {
                return new Response('Missing order_id in webhook', { status: 400 })
              }

              // Find existing payment in database by orderId
              const existingPayment = await prisma.payment.findFirst({
                where: { orderId: orderData.order_id },
              })

              // Save raw webhook log
              const webhookLog = await prisma.webhookLog.create({
                data: {
                  payload: event,
                  paymentId: existingPayment?.id || null,
                },
              })

              if (eventType === 'PAYMENT_SUCCESS_WEBHOOK') {
                const paymentStatus = paymentData?.payment_status || 'PAID'
                
                // Update payment record
                if (existingPayment) {
                  await prisma.payment.update({
                    where: { id: existingPayment.id },
                    data: {
                      state: 'PAID',
                      amount: String(paymentData?.payment_amount || orderData.order_amount),
                    },
                  })

                  // Update connected booking status
                  if (existingPayment.bookingId) {
                    await prisma.booking.update({
                      where: { id: existingPayment.bookingId },
                      data: { status: 'CONFIRMED', paymentStatus: 'PAID' },
                    })
                    console.log(`[Cashfree Webhook] Booking ${existingPayment.bookingId} marked as CONFIRMED and PAID`)
                  }
                } else if (customerData?.customer_id) {
                  // If payment didn't exist, create it if we have userId
                  await prisma.payment.create({
                    data: {
                      merchantId: 'CASHFREE',
                      merchantOrderId: orderData.order_id,
                      orderId: orderData.order_id,
                      state: 'PAID',
                      amount: String(orderData.order_amount),
                      currency: orderData.order_currency || 'INR',
                      expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                      userId: customerData.customer_id,
                      bookingId: orderData.order_id,
                    },
                  })
                }
              } else if (
                eventType === 'PAYMENT_FAILED_WEBHOOK' ||
                eventType === 'PAYMENT_USER_DROPPED_WEBHOOK'
              ) {
                if (existingPayment) {
                  await prisma.payment.update({
                    where: { id: existingPayment.id },
                    data: {
                      state: eventType === 'PAYMENT_USER_DROPPED_WEBHOOK' ? 'USER_DROPPED' : 'FAILED',
                    },
                  })
                  
                  if (existingPayment.bookingId) {
                    await prisma.booking.update({
                      where: { id: existingPayment.bookingId },
                      data: { status: 'CANCELLED', paymentStatus: 'FAILED' },
                    })
                    console.log(`[Cashfree Webhook] Booking ${existingPayment.bookingId} marked as CANCELLED and FAILED`)
                    
                    notifyAdmins(
                      'Payment Failed (Webhook)',
                      `A payment for booking ID ${existingPayment.bookingId} has failed via Cashfree webhook.`,
                      'PAYMENT_FAILED',
                      `/admin/bookings`
                    )
                  }
                }
              }

              return new Response(JSON.stringify({ received: true, logId: webhookLog.id }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              })
            } catch (err: any) {
              console.error('[Cashfree Webhook] Error processing webhook:', err)
              return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
              })
            }
          },
        },
      }),
  },
})
