import { useState } from 'react'
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

import { initiateCashfreePayment } from '#/lib/cashfree-checkout'
import { cartStore } from '#/stores/cart-store'

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
    collectionCharges,
    canGoToNextStep,
    clearStorage,
  } = useBookingContext()

  const router = useRouter()

  const watchedMemberValues = useWatch({
    control: form.control,
    name: `memberDetails`,
    defaultValue: [],
  }) || []

  const totalMembers = Array.isArray(watchedMemberValues) ? watchedMemberValues : []

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

  const watchedPaymentMode = watchedReviewOrderValues?.paymentMode || 'COD'

  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null)

  const isAnyMemberWithoutTestItems =
    totalMembers.length > 0 &&
    totalMembers.every((member) => member?.testItems && member.testItems.length > 0)

  const createbookingFn = useServerFn(createBookingRecord)

  const {
    mutateAsync: bookingMutation,
    isPending: isBookingPending,
    isPaused: isBookingPaused,
  } = useMutation({
    mutationFn: () =>
      createbookingFn({
        data: {
          memberDetails: watchedMemberValues,
          address: watchedAddressValues,
          schedule: watchedScheduleValues,
          reviewOrder: watchedReviewOrderValues,
          totalPrice: totalPrice,
          bookingId: createdBookingId || undefined,
        },
      }),
  })

  function handleFinalSubmit() {
    if (step === 1 || step === 2 || step === 3) {
      return nextStep()
    } else {
      // then go for final submission
      if (watchedPaymentMode === 'COD') {
        // create the booking and show the success page
        toast.promise(bookingMutation, {
          loading: 'Processing booking...',
          success: (data) => {
            clearStorage()
            cartStore.trigger.clearCart()
            setCreatedBookingId(null)
            router.navigate({
              to: '/payment-status',
              search: { bookingId: data?.booking?.id || '' },
            })
            router.invalidate({
              filter: (route) => route.id === 'profile',
              sync: true,
            })
            return 'Booking placed successfully!'
          },
          error: (err) => err?.message || 'Failed to create booking.',
        })
      } else {
        toast.promise(
          (async () => {
            const data = await bookingMutation()
            if (data?.booking?.id) {
              setCreatedBookingId(data.booking.id)
            }
            if (data.paymentSessionId) {
              await initiateCashfreePayment({
                paymentSessionId: data.paymentSessionId,
                mode: 'sandbox',
                redirectTarget: '_self',
              })
              clearStorage()
              cartStore.trigger.clearCart()
            } else if (data.paymentUrl) {
              clearStorage()
              cartStore.trigger.clearCart()
              window.location.href = data.paymentUrl
            } else {
              clearStorage()
              cartStore.trigger.clearCart()
              router.navigate({
                to: '/payment-status',
                search: { bookingId: data?.booking?.id || '' },
              })
            }
            return data
          })(),
          {
            loading: 'Initializing Cashfree Sandbox Checkout...',
            success: 'Opening Cashfree Payment Gateway...',
            error: (err) => err?.message || 'Failed to initialize payment gateway.',
          },
        )
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
          <span className={'font-semibold'}>
            {collectionCharges === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatCurrency(String(collectionCharges))
            )}
          </span>
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
