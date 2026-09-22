import { prisma } from '#/db'
import { BookingStatus } from '#/generated/prisma/enums'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { authMiddleware } from './middleware'
import { isRedirect } from '@tanstack/react-router'
import { createCheckOutLink } from './payments.functions'
import { notifyAdmins } from './notifications'
import {
  bookingFormSchema,
  instantBookingFormSchema,
} from './validators/booking-schema'

const createBookingRecordSchema = z
  .object({
    bookingId: z.string().optional(),
    totalPrice: z.number(),
  })
  .extend(bookingFormSchema.shape)

export const createBookingRecord = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(createBookingRecordSchema)
  .handler(async ({ data, context }) => {
    const { user } = context
    const { memberDetails, address, schedule, reviewOrder, totalPrice, bookingId: requestedBookingId } = data

    try {
      let existingBooking = null

      if (requestedBookingId) {
        existingBooking = await prisma.booking.findFirst({
          where: {
            id: requestedBookingId,
            userId: user.id,
            status: 'PENDING',
          },
          include: {
            members: true,
            addresses: true,
            schedules: true,
          },
        })
      }

      if (existingBooking) {
        // Reuse and update the existing pending booking
        const updatedBooking = await prisma.booking.update({
          where: { id: existingBooking.id },
          data: {
            type: reviewOrder.paymentMode,
          },
        })

        // Update schedule if exists
        if (existingBooking.schedules?.[0]) {
          await prisma.schedule.update({
            where: { id: existingBooking.schedules[0].id },
            data: {
              scheduleDate: schedule.scheduleDate,
              slot: schedule.slotTime,
            },
          })
        }

        // Update address if exists
        if (existingBooking.addresses?.[0]) {
          await prisma.address.update({
            where: { id: existingBooking.addresses[0].id },
            data: {
              type: address.addressType,
              location: address.location,
              houseNo: address.houseNo ?? 'n/a',
              landmark: address.landmark,
              pinCode: address.pincode,
            },
          })
        }

        if (reviewOrder.paymentMode === 'ONLINE_PAYMENT') {
          const checkoutResponse = await createCheckOutLink({
            data: {
              bookingId: updatedBooking.id,
              totalPrice: totalPrice,
              memberDetails,
              address,
              schedule,
              reviewOrder,
            },
          })
          return {
            booking: updatedBooking,
            paymentSessionId: checkoutResponse.paymentSessionId,
            orderId: checkoutResponse.orderId,
            paymentUrl: checkoutResponse.paymentUrl,
            envMode: (checkoutResponse as any).envMode,
          }
        } else {
          return {
            booking: updatedBooking,
            paymentSessionId: null,
            orderId: null,
            paymentUrl: null,
          }
        }
      }

      // If no existing booking, create new records:
      // Find all IDs that exist in the BloodTest relation
      const allItemIds = memberDetails.flatMap((m) => m.testItems?.map((t) => t.id) || [])
      const existingBloodTests = await prisma.bloodTest.findMany({
        where: { id: { in: allItemIds } },
        select: { id: true },
      })
      const validBloodTestIds = new Set(existingBloodTests.map((t) => t.id))

      // Task 1: Create members in parallel
      const memberCreationPromises = memberDetails.map((member) => {
        const connectableTests = (member.testItems || [])
          .filter((t) => validBloodTestIds.has(t.id))
          .map((t) => ({ id: t.id }))

        return prisma.member.create({
          data: {
            name: member.name,
            age: member.age,
            gender: member.gender,
            phone: member.phone,
            email: member.email,
            prescriptionUrl: member.prescriptionUrl || null,
            testItems: connectableTests.length > 0 ? { connect: connectableTests } : undefined,
          },
        })
      })
      const createdMembers = await Promise.all(memberCreationPromises)

      // Task 2: Create address and schedule in parallel
      const createAddress = prisma.address.create({
        data: {
          type: address.addressType,
          location: address.location,
          houseNo: address.houseNo ?? 'n/a',
          landmark: address.landmark,
          pinCode: address.pincode,
          userId: user.id,
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
            connect: [{ id: createdAddress.id }],
          },
          schedules: {
            connect: [{ id: createdSchedule.id }],
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

      // Link prescriptions to members and booking
      const updatePrescriptionsPromises = memberDetails.map((member, idx) => {
        if (member.prescriptionUrl) {
          return prisma.prescription.updateMany({
            where: {
              fileUrl: member.prescriptionUrl,
              userId: user.id,
            },
            data: {
              memberId: createdMembers[idx].id,
              bookingId: createBooking.id,
            }
          })
        }
        return Promise.resolve()
      })

      await Promise.all([updateMembers, updateAddress, updateSchedule, ...updatePrescriptionsPromises])

      if (reviewOrder.paymentMode === 'ONLINE_PAYMENT') {
        const checkoutResponse = await createCheckOutLink({
          data: {
            bookingId: createBooking.id,
            totalPrice: totalPrice,
            memberDetails,
            address,
            schedule,
            reviewOrder,
          },
        })
        await notifyAdmins('New Booking', `A new booking has been placed via checkout.`, 'NEW_BOOKING', '/admin/bookings')
        return {
          booking: createBooking,
          paymentSessionId: checkoutResponse.paymentSessionId,
          orderId: checkoutResponse.orderId,
          paymentUrl: checkoutResponse.paymentUrl,
          envMode: (checkoutResponse as any).envMode,
        }
      } else {
        await notifyAdmins('New Booking', `A new COD booking has been placed via checkout.`, 'NEW_BOOKING', '/admin/bookings')
        return {
          booking: createBooking,
          paymentSessionId: null,
          orderId: null,
          paymentUrl: null,
        }
      }
    } catch (error) {
      if (isRedirect(error)) {
        throw error
      }
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
      if (status === 'CANCELLED') {
        await notifyAdmins('Booking Cancelled', `Booking ${bookingId.slice(0, 8)} has been cancelled.`, 'BOOKING_CANCELLED', '/admin/bookings')
      }
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
      
      await notifyAdmins('New Instant Booking', `A new instant booking request was received from ${data.fullName}.`, 'NEW_BOOKING', '/admin/bookings')

      return newBooking
    } catch (error) {
      console.error('Error creating instant booking:', error)
      throw new Error('Failed to create instant booking')
    }
  })
