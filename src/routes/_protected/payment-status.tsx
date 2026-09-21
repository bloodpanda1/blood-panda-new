import { useEffect } from 'react'
import { cartStore } from '#/stores/cart-store'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Spinner } from '#/components/ui/spinner'
import { seo } from '#/constants/seo-details'
import { checkPaymentStatus } from '#/lib/payments.functions'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { z } from 'zod'

export const Route = createFileRoute('/_protected/payment-status')({
  head: () => seo({ path: '/payment-status' }),
  validateSearch: z.object({
    bookingId: z.string().optional().catch(''),
    order_id: z.string().optional().catch(''),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { bookingId, order_id } = Route.useSearch()
  const checkStatusFn = useServerFn(checkPaymentStatus)

  const { data: paymentResult, isLoading } = useQuery({
    queryKey: ['cashfree-payment-status', order_id, bookingId],
    queryFn: () => checkStatusFn({ data: { orderId: order_id || '', bookingId } }),
    enabled: !!order_id,
    refetchInterval: (query) => {
      const data = query.state.data
      // Poll every 3 seconds if not paid yet (up to a few times)
      return data?.isPaid ? false : 3000
    },
    retry: 2,
  })

  const isOnlinePayment = !!order_id
  const isPaid = paymentResult?.isPaid || !isOnlinePayment
  
  const isFailed = isOnlinePayment && paymentResult && paymentResult.isFailed
  
  const isPending = isOnlinePayment && paymentResult && !isPaid && !isFailed

  useEffect(() => {
    if (isPaid) {
      cartStore.trigger.clearCart()
    }
  }, [isPaid])

  if (isOnlinePayment && (isLoading || isPending)) {
    return (
      <main className="mx-auto flex min-h-[calc(100dvh-16rem)] max-w-lg flex-col items-center justify-center p-4">
        <Card className="w-full text-center shadow-lg border-primary/20 p-8 space-y-4">
          <div className="flex justify-center">
            <Spinner className="size-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Verifying Payment...</CardTitle>
          <CardDescription>
            Please wait while we confirm your payment with Cashfree.
          </CardDescription>
        </Card>
      </main>
    )
  }

  if (isFailed) {
    return (
      <main className="mx-auto flex min-h-[calc(100dvh-16rem)] max-w-lg flex-col items-center justify-center p-4">
        <Card className="w-full text-center shadow-lg border-destructive/20">
          <CardHeader className="pt-8">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-3xl font-bold text-destructive">
              Payment Incomplete
            </CardTitle>
            <CardDescription className="text-base mt-2">
              We couldn't confirm your payment. If money was deducted, it will be refunded automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium text-muted-foreground">Order ID</p>
              <p className="font-mono text-base font-bold">{order_id}</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pb-8">
            <Button asChild className="w-full text-lg h-12" variant="default">
              <Link to="/booking">Try Again</Link>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link to="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-16rem)] max-w-lg flex-col items-center justify-center p-4">
      <Card className="w-full text-center shadow-lg border-primary/20">
        <CardHeader className="pt-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-500">
            {isOnlinePayment ? 'Payment Successful!' : 'Booking Confirmed!'}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {isOnlinePayment
              ? 'Your payment was received and your lab test booking is confirmed.'
              : 'Your booking has been placed. You can pay cash/UPI during sample collection.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-2">
            {bookingId && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Booking Reference ID</p>
                <p className="font-mono text-base font-bold">{bookingId}</p>
              </div>
            )}
            {order_id && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Cashfree Order ID</p>
                <p className="font-mono text-sm font-semibold text-muted-foreground">{order_id}</p>
              </div>
            )}
            {paymentResult?.order?.order_amount && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Amount Paid</p>
                <p className="text-lg font-bold text-primary">₹{paymentResult.order.order_amount}</p>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            A confirmation with schedule details has been registered for home sample collection.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pb-8">
          <Button asChild className="w-full text-lg h-12" variant="default">
            <Link to="/profile">View My Bookings</Link>
          </Button>
          <Button asChild className="w-full" variant="outline">
            <Link to="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
