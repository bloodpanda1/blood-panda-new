import { prisma } from '#/db'
import { BookingStatus } from '#/generated/prisma/enums'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { authMiddleware } from './middleware'
import { createCheckOutLink } from './payments.functions'
import {
  bookingFormSchema,
  instantBookingFormSchema,
} from './validators/booking-schema'

const createBookingRecordSchema = z
  .object({
    totalPrice: z.number(),
  })
  .extend(bookingFormSchema.shape)

export const createBookingRecord = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(createBookingRecordSchema)
  .handler(async ({ data, context }) => {
    const { user } = context
    const { memberDetails, address, schedule, reviewOrder, totalPrice } = data

    try {
      // Task 1: Create members in parallel
      const memberCreationPromises = memberDetails.map((member) =>
        prisma.member.create({
          data: {
            name: member.name,
            age: member.age,
            gender: member.gender,
            phone: member.phone,
            email: member.email,
            testItems: member.testItems
              ? {
                  connect: member.testItems.map((pkg) => ({ id: pkg.id })),
                }
              : undefined,
          },
        }),
      )
      const createdMembers = await Promise.all(memberCreationPromises)

      // Task 2: Create address and schedule in parallel
      const createAddress = prisma.address.create({
        data: {
          type: address.addressType,
          location: address.location,
          houseNo: address.houseNo ?? 'n/a',
          landmark: address.landmark,
          pinCode: address.pincode,
        },
      })
      const createSchedule = prisma.schedule.create({
        data: {
          scheduleDate: schedule.scheduleDate,
          slot: schedule.slotTime,
        },
      })
      const [createdAddress, createdSchedule] = await Promise.all([
        createAddress,
        createSchedule,
      ])

      // Task 3: Create booking after members, address, and schedule are created
      const createBooking = await prisma.booking.create({
        data: {
          type: reviewOrder.paymentMode,
          status: 'PENDING',
          userId: user.id,
          members: {
            connect: createdMembers.map((member) => ({ id: member.id })),
          },
          addresses: {
            connect: { id: createdAddress.id },
          },
          schedules: {
            connect: { id: createdSchedule.id },
          },
        },
      })

      // Task 4: Update members, address, and schedule with the bookingId in parallel
      const updateMembers = prisma.member.updateMany({
        where: {
          id: {
            in: createdMembers.map((member) => member.id),
          },
        },
        data: {
          bookingId: createBooking.id,
        },
      })
      const updateAddress = prisma.address.update({
        where: {
          id: createdAddress.id,
        },
        data: {
          bookingId: createBooking.id,
        },
      })
      const updateSchedule = prisma.schedule.update({
        where: {
          id: createdSchedule.id,
        },
        data: {
          bookingId: createBooking.id,
        },
      })
      await Promise.all([updateMembers, updateAddress, updateSchedule])

      if (reviewOrder.paymentMode === 'ONLINE_PAYMENT') {
        await createCheckOutLink({
          data: {
            bookingId: createBooking.id,
            totalPrice: totalPrice,
            memberDetails,
            address,
            schedule,
            reviewOrder,
          },
        })
      } else {
        return createBooking
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      throw new Error('Failed to create booking')
    }
  })

const updateBookingStatusSchema = z.object({
  bookingId: z.string(),
  status: z.enum(BookingStatus),
})

// type UpdateBookingStatusPayload = z.infer<typeof updateBookingStatusSchema>

export const updateBookingStatus = createServerFn({ method: 'POST' })
  .validator(updateBookingStatusSchema)
  .handler(async ({ data }) => {
    const { bookingId, status } = data
    try {
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status },
      })
      return updatedBooking
    } catch (error) {
      console.error('Error updating booking:', error)
      throw new Error('Failed to update booking')
    }
  })

export const createInstanstBookingRecord = createServerFn({ method: 'POST' })
  .validator(instantBookingFormSchema)
  .handler(async ({ data }) => {
    try {
      const newBooking = await prisma.booking.create({
        data: {
          type: 'INSTANT_BOOKING',
          status: 'PENDING',
          fullName: data.fullName,
          mobileNumber: data.mobileNumber,
          address: data.address,
          city: data.city,
          zipcode: data.zipcode,
          preferredTime: data.preferredTime,
          preferredDate: data.preferredDate,
          testRequirement: data.testRequirement,
          agreeOfTerms: data.agreeOfTerms,
        },
      })
      return newBooking
    } catch (error) {
      console.error('Error creating instant booking:', error)
      throw new Error('Failed to create instant booking')
    }
  })
