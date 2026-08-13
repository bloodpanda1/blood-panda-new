import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { Spinner } from '#/components/ui/spinner'
import { useBookingContext } from '#/contexts/booking-context.lazy'
import { createBookingRecord } from '#/lib/booking.functions'
import { formatCurrency } from '#/lib/utils'
import type { BookingFormData } from '#/lib/validators/booking-schema'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useFormContext, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

/*
Key Points

    useServerFn() — wraps the server function for safe use inside components (handles client-side invocation correctly).
    Direct call — works fine in event handlers without useServerFn.
    router.invalidate() — use this after a mutation if you want to re-run route loaders and refresh data.
    The server function is called with { data: ... } where data matches what your .validator() expects.

*/

export default function BookingFormSidebar() {
  const form = useFormContext<BookingFormData>()
  const {
    step,
    prevStep,
    nextStep,
    canGoToPreviousStep,
    totalPrice,
    originalPrice,
    discountPercentage,
    discountedPrice,
    canGoToNextStep,
    clearStorage,
  } = useBookingContext()

  const router = useRouter()

  const totalMembers = useWatch({
    control: form.control,
    name: `memberDetails`,
    defaultValue: [],
  })

  const watchedPaymentMode = useWatch({
    control: form.control,
    name: `reviewOrder.paymentMode`,
    defaultValue: 'COD',
  })

  const watchedMemberValues = useWatch({
    control: form.control,
    name: `memberDetails`,
  })

  const watchedAddressValues = useWatch({
    control: form.control,
    name: `address`,
  })

  const watchedScheduleValues = useWatch({
    control: form.control,
    name: `schedule`,
  })

  const watchedReviewOrderValues = useWatch({
    control: form.control,
    name: `reviewOrder`,
  })

  const isAnyMemberWithoutTestItems = watchedMemberValues.every(
    (member) => member.testItems && member.testItems.length > 0,
  )

  const bookingData = {
    memberDetails: watchedMemberValues,
    address: watchedAddressValues,
    schedule: watchedScheduleValues,
    reviewOrder: watchedReviewOrderValues,
    totalPrice: totalPrice,
  }

  const createbookingFn = useServerFn(createBookingRecord)
  // const createCheckOutFn = useServerFn(createCheckOutLink)

  const {
    mutateAsync: bookingMutation,
    isPending: isBookingPending,
    isPaused: isBookingPaused,
  } = useMutation({
    mutationFn: () => createbookingFn({ data: bookingData }),
  })

  // const {
  //   mutateAsync: checkOutMutation,
  //   isPending: isCheckOutPending,
  //   isPaused: isCheckOutPaused,
  // } = useMutation({
  //   mutationFn: (bookingId: string) =>
  //     createCheckOutFn({
  //       data: {
  //         bookingId: bookingId,
  //         totalPrice: totalPrice,
  //         memberDetails: watchedMemberValues,
  //         address: watchedAddressValues,
  //         schedule: watchedScheduleValues,
  //         reviewOrder: watchedReviewOrderValues,
  //       },
  //     }),
  // })

  function handleFinalSubmit() {
    // const fakePromise = new Promise((resolve) => setTimeout(resolve, 2000))

    if (step === 1 || step === 2 || step === 3) {
      return nextStep()
    } else {
      // then go for final submission
      if (watchedPaymentMode === 'COD') {
        // create the booking and show the success page
        toast.promise(bookingMutation, {
          loading: 'Creating booking...',
          success: () => {
            // cleared form data and reset the booking context
            clearStorage()
            router.navigate({ to: '/profile' }) // Navigate to the success page
            router.invalidate({
              filter: (route) => route.id === 'profile',
              sync: true,
            }) // Refresh route loaders to reflect the new booking
            return 'Booking created successfully!'
          },
          error: 'Failed to create booking.',
        })
      } else {
        toast.promise(bookingMutation, {
          loading: 'Redirecting to payment gateway...',
          success: () => {
            return 'Booking created successfully!'
          },
          error: 'Failed to create booking.',
        })
      }
    }
  }

  return (
    <Card className={'col-span-full grid h-fit content-start lg:col-span-1'}>
      <CardHeader>
        <CardTitle>{totalMembers.length || 0} Member added</CardTitle>
        <CardAction>{formatCurrency(String(totalPrice))}</CardAction>
      </CardHeader>

      <CardContent className={'space-y-4'}>
        <p className={'flex items-center justify-between'}>
          <span className={'font-medium'}>Total MRP</span>
          <span className={'font-semibold'}>
            {formatCurrency(String(originalPrice))}
          </span>
        </p>
        <Separator />
        <p className={'flex items-center justify-between'}>
          <span className={'font-medium'}>
            Discount on MRP
            <Badge className={'text-xs'}>{discountPercentage}%</Badge>
          </span>
          <span className={'font-semibold'}>
            {formatCurrency(String(discountedPrice))}
          </span>
        </p>
        <Separator />
        <p className={'flex items-center justify-between'}>
          <span className={'font-medium'}>Collection Charges</span>
          <span className={'font-semibold'}>{formatCurrency('0')}</span>
        </p>
      </CardContent>

      <CardFooter className={'flex-col gap-4'}>
        <Button
          type="button"
          className={'w-full'}
          onClick={() => prevStep()}
          disabled={!canGoToPreviousStep}
        >
          Previous
        </Button>
        <Button
          type="button"
          className={'w-full'}
          disabled={!isAnyMemberWithoutTestItems}
          onClick={() => handleFinalSubmit()}
        >
          {canGoToNextStep ? (
            <span>Continue</span>
          ) : isBookingPending ? (
            <span className={'inline-flex items-center gap-2'}>
              Loading... <Spinner />
            </span>
          ) : isBookingPaused ? (
            <span className={'inline-flex items-center gap-2'}>
              Redirecting... <Spinner />
            </span>
          ) : (
            <span>Book Now</span>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
