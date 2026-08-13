import { getServerEnv } from '#/config/server-env'
import { getPaymentClient } from '#/integrations/phonepay'
import { updateBookingStatus } from '#/lib/booking.functions'
import {
  createPaymentRecord,
  createWebhookRecord,
} from '#/lib/payments.functions'
import { createFileRoute } from '@tanstack/react-router'

/**
 * **Recommendations for handling webhooks:**
 * - Return 2xx only when you have successfully processed the event.
 * - Return 4xx for issues caused by the sender (bad payload, missing required headers) so the provider usually stops retrying.
 * - Return 5xx when you want the provider to retry (temporary failure like downtime/timeouts).
 */

export const Route = createFileRoute('/api/payment/callback')({
  server: {
    // middleware: [authMiddleware], // Runs first for all handlers
    handlers: ({ createHandlers }) =>
      createHandlers({
        GET: async () => {
          return new Response('Not implemented', { status: 501 })
        },
        POST: {
          // middleware: [validMiddleware], // Runs after authMiddleware, only for POST
          handler: async ({ request }) => {
            const headers = request.headers
            const payload = await request.text()

            const usernameConfigured = getServerEnv().PHONEPAY_USERNAME
            const passwordConfigured = getServerEnv().PHONEPAY_PASSWORD

            const phonepeS2SCallbackResponseBodyString = payload

            const authorizationHeaderData = headers.get('authorization')
            if (!authorizationHeaderData) {
              console.error('Missing authorization header')
              return new Response('Missing authorization header', {
                status: 400,
                statusText: 'Bad Request',
              })
            }

            const callbackResponse = getPaymentClient().validateCallback(
              usernameConfigured,
              passwordConfigured,
              authorizationHeaderData,
              phonepeS2SCallbackResponseBodyString,
            )

            if (
              callbackResponse.type.toString() === 'CHECKOUT_ORDER_COMPLETED'
            ) {
              const userId = callbackResponse.payload.metaInfo?.udf1 // userId
              const bookingId = callbackResponse.payload.metaInfo?.udf2 // bookingId

              if (bookingId && userId) {
                const newPaymentPayload = {
                  merchantId: callbackResponse.payload.merchantId,
                  merchantOrderId:
                    callbackResponse.payload.merchantOrderId ?? '',
                  orderId: callbackResponse.payload.orderId,
                  state: callbackResponse.payload.state,
                  amount: String(callbackResponse.payload.amount),
                  currency:
                    'currency' in callbackResponse.payload
                      ? (callbackResponse.payload.currency as string)
                      : 'INR',
                  expireAt: String(callbackResponse.payload.expireAt),
                  userId: userId,
                  bookingId: bookingId,
                }
                console.log(
                  'Creating payment record with payload:',
                  newPaymentPayload,
                )

                try {
                  const newPayment = await createPaymentRecord({
                    data: newPaymentPayload,
                  })

                  await Promise.all([
                    updateBookingStatus({
                      data: { bookingId, status: 'CONFIRMED' },
                    }),
                    createWebhookRecord({
                      data: {
                        payload: JSON.stringify(callbackResponse),
                        paymentId: newPayment.id,
                      },
                    }),
                  ])

                  return new Response('Webhook received successfully', {
                    status: 200,
                    statusText: 'OK',
                  })
                } catch (error) {
                  console.error('Error deleting booking:', error)
                  return new Response('Error deleting booking', {
                    status: 400,
                    statusText: 'Bad Request',
                  })
                }
              }
            }

            return new Response('Webhook received successfully', {
              status: 200,
              statusText: 'OK',
            })
          },
        },
      }),
  },
})
