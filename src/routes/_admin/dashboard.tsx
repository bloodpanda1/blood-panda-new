import { Button } from '#/components/ui/button'
import { Spinner } from '#/components/ui/spinner'
import { seo } from '#/constants/seo-details'
import { ChartAreaInteractive } from '#/features/admin/components/chart-area-interactive'
import { DataTable } from '#/features/admin/components/data-table'
import { SectionCards } from '#/features/admin/components/section-cards'
import { getSession } from '@/lib/auth.functions'
import {
  ClientOnly,
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router'

import { Skeleton } from '#/components/ui/skeleton'
import data from '#/dashboard/data.json'

export const Route = createFileRoute('/_admin/dashboard')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return { user: session.user }
  },
  head: () => seo({ path: '/dashboard' }),
  component: Dashboard,
  pendingComponent: PendingComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  wrapInSuspense: true,
  codeSplitGroupings: [
    ['component', 'pendingComponent', 'errorComponent', 'notFoundComponent'],
  ],
})

function Dashboard() {
  const { user } = Route.useRouteContext()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <h1 className="text-2xl font-bold md:text-3xl px-4 lg:px-6 text-muted-foreground">
          Welcome back,{' '}
          <span className="font-semibold text-blue-500">{user.name}</span>!
        </h1>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ClientOnly fallback={<Skeleton className={'h-72 w-full'} />}>
              <ChartAreaInteractive />
            </ClientOnly>
          </div>
          <DataTable data={data} />
        </div>
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
