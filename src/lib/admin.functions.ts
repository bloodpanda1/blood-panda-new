import { prisma } from '#/db'
import { createServerFn } from '@tanstack/react-start'
import { adminAuthorizationMiddleware } from './middleware'

export const adminDasboardStats = createServerFn({ method: 'GET' })
  .middleware([adminAuthorizationMiddleware()])
  .handler(async () => {
    const registeredPatients = await prisma.user.count({
      where: {
        role: 'USER',
      },
    })

    const nonRegisteredPatients = await prisma.booking.count({
      where: {
        userId: null,
      },
    })

    const totalInstantBookings = await prisma.booking.count({
      where: {
        type: 'INSTANT_BOOKING',
      },
    })

    const totalCodBookings = await prisma.booking.count({
      where: {
        type: 'COD',
      },
    })

    const totalOnlineBookings = await prisma.booking.count({
      where: {
        type: 'ONLINE_PAYMENT',
      },
    })

    return {
      Patients: registeredPatients + nonRegisteredPatients,
      Bookings: totalInstantBookings + totalCodBookings + totalOnlineBookings,
      'COD-Bookings': totalCodBookings,
      'Online-Bookings': totalOnlineBookings,
      'Instant-Bookings': totalInstantBookings,
      'Registered-Patients': registeredPatients,
      'Non-Registered-Patients': nonRegisteredPatients,
    }
  })

export const getTotalBookings = createServerFn({ method: 'GET' })
  .middleware([adminAuthorizationMiddleware()])
  .handler(async () => {
    const totalBookings = await prisma.booking.findMany({})
    return totalBookings
  })

export const getTotalPatients = createServerFn({ method: 'GET' })
  .middleware([adminAuthorizationMiddleware()])
  .handler(async () => {
    // join the tables

    // get all registered patients with their bookings
    const totalRegisteredPatients = await prisma.user.findMany({
      where: {
        role: 'USER',
      },
      include: {
        bookings: true,
      },
    })

    // actual bookings records with userId null, which means they are not registered users
    const totalNonRegisteredPatients = await prisma.booking.findMany({
      where: {
        userId: null,
      },
    })

    // mapped with registered patients included-bookings and totalNonRegisteredPatients records
    // merger
    // const totalPatients = [
    //   ...totalNonRegisteredPatients,
    //   // return the bookings not the patient details, because we already have the patient details in the registered patients records
    //   ...totalRegisteredPatients.map((patient) => {
    //     return patient.bookings.map((booking) => {
    //       return {
    //         ...booking,
    //       }
    //     })
    //   }),
    // ]

    return totalRegisteredPatients
  })
