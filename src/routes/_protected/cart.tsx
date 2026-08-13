import { Button } from '#/components/ui/button'
import { Spinner } from '#/components/ui/spinner'
import { useCart } from '#/stores/useCart'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { seo } from '#/constants/seo-details'
import CartItemsSection from '#/features/cart/cart-items-section'
import CartOrderSummary from '#/features/cart/cart-order-summary'
import EmptyCartState from '#/features/cart/empty-cart-state'

export const Route = createFileRoute('/_protected/cart')({
  head: () => seo({ path: '/cart' }),
  component: RouteComponent,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
  wrapInSuspense: true,
  codeSplitGroupings: [
    ['component', 'pendingComponent', 'errorComponent', 'notFoundComponent'],
  ],
})

function RouteComponent() {
  const { items } = useCart()

  return (
    <main className={'mx-auto max-w-(--breakpoint-xl) space-y-8 px-4 py-12'}>
      <section>
        {items.length === 0 ? (
          <EmptyCartState />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Cart Section */}
            <CartItemsSection />

            {/* Order Summary */}
            <CartOrderSummary />
          </div>
        )}
      </section>
    </main>
  )
}

function PendingComponent() {
  return (
    <div
      className={
        'mx-auto max-w-(--breakpoint-lg) flex flex-col items-center justify-center h-[calc(100dvh-16rem)]'
      }
    >
      <Spinner className={'size-6'} />
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div className={'mx-auto max-w-(--breakpoint-lg) space-y-8 px-4 py-12'}>
      <h2 className={'text-center text-3xl font-bold'}>Page Not Found</h2>
    </div>
  )
}

function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter()
  return (
    <div className="error">
      <h2>An error occurred: {error.name}</h2>
      <p>{error.message}</p>
      <Button onClick={() => router.navigate({ to: '/', search: {} })}>
        Go Home
      </Button>
    </div>
  )
}
