import { getServerEnv } from '#/config/server-env'
import { prisma } from '#/db'
import { getPaymentClient } from '#/integrations/phonepay'
import type { PhonePeException } from '@phonepe-pg/pg-sdk-node'
import { CreateSdkOrderRequest, MetaInfo } from '@phonepe-pg/pg-sdk-node'
import { redirect } from '@tanstack/react-router'
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

// type CheckoutOrderPayload = z.infer<typeof checkoutOrderPayload>

export const createCheckOutLink = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(checkoutOrderPayload)
  .handler(async ({ data, context }) => {
    const { user } = context

    const redirectUrl = getServerEnv().BETTER_AUTH_URL

    const merchantOrderId = crypto.randomUUID()
    // const prefillUserLoginDetails =
    //   PrefillUserLoginDetails.builder().phoneNumber('')

    const metaInfo = MetaInfo.builder()
      .udf1(user.id)
      .udf2(data.bookingId)
      .udf3(data.memberDetails[0].name)
      .udf4(data.memberDetails[0].email)
      .udf5(data.memberDetails[0].phone)
      .udf6(data.totalPrice.toString())
      .udf7(data.address.location)
      .udf8(data.schedule.scheduleDate)
      .udf9(data.schedule.slotTime)
      .udf10(data.address.pincode)
      .build()

    // Amount in paise (100 = ₹1.00)
    const amountInPaisa = Math.round(data.totalPrice * 100)

    const orderRequest = CreateSdkOrderRequest.StandardCheckoutBuilder()
      .merchantOrderId(merchantOrderId)
      .amount(amountInPaisa)
      // .prefillUserLoginDetails(prefillUserLoginDetails)
      .metaInfo(metaInfo)
      .redirectUrl(`${redirectUrl}/payment-success?bookingId=${data.bookingId}`)
      .expireAfter(3600) // Expire after 1 hour
      .message('Message that will be shown for UPI collect transaction') // TODO: Add a proper message here
      .build()

    try {
      const result = await getPaymentClient().pay(orderRequest)
      throw redirect({
        href: result.redirectUrl,
        code: 302,
      })
    } catch (error) {
      const err = error as PhonePeException
      console.log(err.message)
      throw new Error(
        `Failed to create checkout order: ${err.message || 'Internal Server Error'}`,
      )
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

// type CreatePaymentRecordPayload = z.infer<typeof createPaymentRecordPayload>

// when the payment is successful, we will create a payment record in the database
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
  paymentId: z.string(),
})

// type CreateWebhookRecordPayload = z.infer<typeof createWebhookRecordSchema>

export const createWebhookRecord = createServerFn({ method: 'POST' })
  .validator(createWebhookRecordSchema)
  .handler(async ({ data }) => {
    try {
      const result = await prisma.webhookLog.create({
        data: {
          payload: JSON.parse(data.payload),
          paymentId: data.paymentId,
        },
      })
      return result
    } catch (error) {
      console.error('Error creating webhook record:', error)
      throw new Error('Failed to create webhook record')
    }
  })
