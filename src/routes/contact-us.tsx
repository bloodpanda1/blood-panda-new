import { Card, CardContent } from '#/components/ui/card'
import { Spinner } from '#/components/ui/spinner'
import { seo } from '#/constants/seo-details'
import ContactBookingForm from '#/features/contact/contact-booking-form'
import ContactInfo from '#/features/contact/contact-info'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Image } from '@unpic/react'

export const Route = createFileRoute('/contact-us')({
  head: () => seo({ path: '/contact-us' }),
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
  return (
    <main className={'mx-auto max-w-(--breakpoint-xl) space-y-8 py-12 px-4'}>
      <section>
        <Card className={'rounded-none py-0 shadow-none ring-0'}>
          <CardContent className={'grid grid-cols-1 lg:grid-cols-2 gap-4 px-0'}>
            <ContactInfo />

            <ContactBookingForm />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function PendingComponent() {
  return (
    <div
      className={
        'mx-auto max-w-(--breakpoint-lg) flex flex-col items-center justify-center h-dvh'
      }
    >
      <Spinner className={'size-6'} />
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div className={'mx-auto max-w-(--breakpoint-lg) space-y-8 px-4 py-12'}>
      <h1 className={'text-2xl font-semibold'}>Page not found</h1>
      <Image
        src="/not-found.avif"
        alt="not-found"
        layout="constrained"
        width={500}
        height={500}
        className={'mx-auto max-w-(--breakpoint-sm)'}
      />
    </div>
  )
}

function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter()
  return (
    <div className="error">
      <h2>Something went wrong!!!</h2>
      <p>{error.message}</p>
      <button onClick={() => router.navigate({ to: '/tests', search: {} })}>
        Reset Search
      </button>
    </div>
  )
}
