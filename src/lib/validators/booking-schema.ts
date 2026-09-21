import { AddressTypeEnums, GenderEnums, PaymentMethodEnums } from '#/constants'
import z from 'zod'
import { isToday, parse, isBefore } from 'date-fns'

export const testItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  originalPrice: z.number(),
  discountedPrice: z.number(),
  discountAmount: z.number().default(0),
  primaryCategory: z.string().optional().nullable(),
  secondaryCategory: z.string().optional().nullable(),
  isFastingRequired: z.boolean().optional().default(false),
})

const memberDetailsField = z.object({
  id: z.string().optional(),
  memberId: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  gender: z.enum(GenderEnums).default('OTHER'),
  age: z.string().default('0'),
  testItems: z.array(testItemSchema).optional(),
  isAssignedDoctor: z.boolean().default(false),
  assignedDoctor: z.enum(['yes', 'no']).default('no'),
  prescriptionUrl: z.string().optional().nullable(),
  doctorName: z.string().optional().nullable(),
})

export const memberDetailsFormSchema = z.object({
  memberDetails: memberDetailsField
    .array()
    .min(1, 'At least one member is required'),
})

export const addressFormSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  houseNo: z.string().optional(),
  pincode: z.string().min(6, 'Pincode is required'),
  landmark: z.string().optional(),
  isChecked: z.boolean().default(false), // this will excluded for db
  addressType: z.enum(AddressTypeEnums).default('HOME'),
})

export const scheduleFormSchema = z.object({
  scheduleDate: z.string().min(1, 'Please select a date'),
  slotTime: z.string().min(1, 'Please select a time slot'),
}).superRefine((data, ctx) => {
  if (data.scheduleDate && data.slotTime) {
    const selectedDate = new Date(data.scheduleDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const selectedDateOnly = new Date(selectedDate)
    selectedDateOnly.setHours(0, 0, 0, 0)
    
    if (selectedDateOnly < today) {
      ctx.addIssue({
        code: 'custom',
        path: ['scheduleDate'],
        message: 'Selected date cannot be in the past',
      })
      return
    }

    if (isToday(selectedDate)) {
      try {
        const slotTimeDate = parse(data.slotTime, 'hh:mm aaa', new Date())
        if (isBefore(slotTimeDate, new Date())) {
          ctx.addIssue({
            code: 'custom',
            path: ['slotTime'],
            message: 'Selected time slot has already passed',
          })
        }
      } catch (e) {
        // ignore format errors
      }
    }
  }
})

export const reviewOrderSchema = z.object({
  paymentMode: z.enum(PaymentMethodEnums).default('COD'),
})

export const bookingFormSchema = z.object({
  ...memberDetailsFormSchema.shape,
  address: addressFormSchema,
  schedule: scheduleFormSchema,
  reviewOrder: reviewOrderSchema,
})

export const instantBookingFormSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .max(100, 'Full name must be at most 100 characters'),
    mobileNumber: z.string().min(1, 'Mobile number is required'),
    address: z
      .string()
      .min(1, 'Address is required')
      .max(100, 'Address must be at most 200 characters'),
    city: z
      .string()
      .min(1, 'City is required')
      .max(30, 'City must be at most 100 characters'),
    zipcode: z.string().min(1, 'Pincode is required'),
    preferredTime: z.string().min(1, 'Preferred time is required'),
    preferredDate: z.date().min(new Date(), 'Preferred date is required'),
    testRequirement: z
      .string()
      .min(10, 'Test requirement is required')
      .max(500, 'Test requirement must be at most 500 characters'),
    agreeOfTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to our privacy policy',
    }),
  })
  .superRefine((data, ctx) => {
    // number look like this: +91 1234567890 +91 WITH SPACE 10 DIGITS
    function isValidMobileNumber(mobileNumber: string): boolean {
      return /^(\+91\s?)?[0-9]{10}$/.test(mobileNumber)
    }

    if (!isValidMobileNumber(data.mobileNumber)) {
      ctx.addIssue({
        code: 'custom',
        message:
          'Mobile number must be 10 digits and can optionally start with +91',
      })
    }

    // pincode validation for India (6 digits)
    if (!/^[0-9]{6}/.test(data.zipcode)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Pincode must be 6 digits',
      })
    }
  })

export type TestItem = z.infer<typeof testItemSchema>
export type MemberDetailsFormData = z.infer<typeof memberDetailsFormSchema>
export type AddressFormData = z.infer<typeof addressFormSchema>
export type ScheduleFormData = z.infer<typeof scheduleFormSchema>

export type BookingFormData = z.infer<typeof bookingFormSchema>

export type InstantBookingFormData = z.infer<typeof instantBookingFormSchema>
