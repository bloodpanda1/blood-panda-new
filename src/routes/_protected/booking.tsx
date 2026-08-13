import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import { Spinner } from '#/components/ui/spinner'
import { seo } from '#/constants/seo-details'
import { BookingContextProvider } from '#/contexts/booking-context.lazy'
import BookingForm from '#/features/booking/booking-form'
import { getAllTests } from '#/lib/tests.functions'
import { ClientOnly, createFileRoute, useRouter } from '@tanstack/react-router'

// const requestLogger = createMiddleware({ type: 'function' })
//   .middleware([authMiddleware])
//   .client(async ({ next, context }) => {
//     return next({
//       sendContext: {
//         workspaceId: '123',
//       },
//     })
//   })
//   // .middleware([authMiddleware]) // session loaded server-side, NOT from sendContext
//   .server(async ({ next, context }) => {
//     // 1. Validate shape
//     // const workspaceId = z.string().uuid().parse(context.workspaceId)
//     // 2. Validate access — does this session principal have membership?
//     // const member = await db.memberships.find({
//     //   userId: context.session.userId,
//     //   workspaceId,
//     // })
//     // if (!member) throw new Error('Not a member of this workspace')
//     // 3. Now safe to use as a query key.
//     return next({ context: { workspaceId: 123 } })
//   })

// export const validationMiddleware = createMiddleware().server(
//   async ({ next, request }) => {
//     const body = await request.json()

//     const parsed = bookingFormSchema.safeParse(body)
//     if (!parsed.success) {
//       throw new Error('Invalid booking form data')
//     }

//     return await next({
//       context: { parsedData: parsed.data },
//     })
//   },
// )

// const validMiddleware = createMiddleware({ type: 'function' })
//   .middleware([authMiddleware])
//   .client(async ({ next, context, data }) => {
//     console.log('Client-side middleware: validMiddleware', { context, data })
//     return next({
//       sendContext: {
//         name: data?.name || 'Unknown',
//       },
//     })
//   })
//   .server(async ({ next, context }) => {
//     // 1. Validate shape
//     const validData = z.string().parse(context.name)

//     if (!validData) {
//       throw new Error('Invalid data received in server-side middleware')
//     }

//     return next({ context: { data:validData },})
//   })

export const Route = createFileRoute('/_protected/booking')({
  head: () => seo({ path: '/booking' }),
  loader: ({ context }) => {
    const deferred = getAllTests({ data: { limit: undefined } })
    return { deferred, user: context.user }
  },
  // server: {
  //   middleware: [authMiddleware], // Runs first for all handlers
  //   handlers: ({ createHandlers }) =>
  //     createHandlers({
  //       // GET: async () => {
  //       //   return new Response('Not implemented', { status: 501 })
  //       // },
  //       POST: {
  //         middleware: [validMiddleware], // Runs after authMiddleware, only for POST
  //         handler: async ({ request, context }) => {
  //           console.log('POST request received at /_protected/booking', context)
  //           const body = await request.json()
  //           return new Response(`Hello, ${body.name}!`)
  //         },
  //       },
  //     }),
  // },
  component: RouteComponent,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
  wrapInSuspense: true,
  codeSplitGroupings: [
    [
      'loader',
      'component',
      'pendingComponent',
      'errorComponent',
      'notFoundComponent',
    ],
  ],
})

function RouteComponent() {
  return (
    <main className={'mx-auto max-w-(--breakpoint-xl) space-y-8 px-4 py-4'}>
      {/* <div>
        <Button
          onClick={() => {
            fetch('/hello', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name: 'Abhijit' }),
            })
              .then((res) => res.json())
              .then((data) => console.log('Response from server:', data))
              .catch((error) => console.error('Error:', error))
          }}
        >
          Say Hello
        </Button>
      </div> */}
      <ClientOnly fallback={<SuspenseFallback />}>
        <BookingContextProvider>
          <BookingForm />
        </BookingContextProvider>
      </ClientOnly>
    </main>
  )
}

function SuspenseFallback() {
  return (
    <div className={'grid grid-cols-3 gap-4'}>
      <div className={'col-span-full lg:col-span-2 h-96 w-full space-y-4'}>
        <Skeleton className={'h-10 w-full'} />
        <Skeleton className={'h-10 w-full'} />
        <Skeleton className={'h-10 w-full'} />
        <Skeleton className={'h-10 w-full'} />
        <Skeleton className={'h-10 w-full'} />
      </div>
      <div className={'col-span-full lg:col-span-1 h-96 w-full space-y-4'}>
        <Skeleton className={'h-10 w-full'} />
        <Skeleton className={'h-10 w-full'} />
        <Skeleton className={'h-10 w-full'} />
        <Skeleton className={'h-10 w-full'} />
        <Skeleton className={'h-10 w-full'} />
      </div>
    </div>
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
