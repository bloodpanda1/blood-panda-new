import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import { Spinner } from '#/components/ui/spinner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import { seo } from '#/constants/seo-details'
import { ChartAreaInteractive } from '#/features/admin/components/chart-area-interactive'
import { OperationalCards, FinancialCards } from '#/features/admin/components/section-cards'
import { getSession } from '#/lib/auth.functions'
import {
  ClientOnly,
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router'

export const Route = createFileRoute('/admin/dashboard')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return { user: session.user }
  },
  head: () => seo({ path: '/admin/dashboard' }),
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
  const [timeRange, setTimeRange] = useState('90d')
  const [selectedMetric, setSelectedMetric] = useState<'totalUsers' | 'totalBookings' | 'totalInstant' | 'totalCOD' | 'totalOnline' | 'totalCompleted' | 'totalPendingOrders' | 'totalCancelled'>('totalBookings')
  const [selectedFinancialMetric, setSelectedFinancialMetric] = useState<'revenue' | 'totalOnline' | 'totalCOD' | 'totalRefunds'>('revenue')

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col @[767px]/main:flex-row @[767px]/main:items-center justify-between px-4 lg:px-6 py-4 gap-4">
          <h1 className="text-2xl font-bold md:text-3xl text-muted-foreground">
            Welcome back,{' '}
            <span className="font-semibold text-blue-500">{user.name}</span>!
          </h1>
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(val) => val && setTimeRange(val)}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/main:flex bg-card rounded-md shadow-xs"
            >
              <ToggleGroupItem value="today">Today</ToggleGroupItem>
              <ToggleGroupItem value="yesterday">Yesterday</ToggleGroupItem>
              <ToggleGroupItem value="7d">7 Days</ToggleGroupItem>
              <ToggleGroupItem value="30d">30 Days</ToggleGroupItem>
              <ToggleGroupItem value="90d">90 Days</ToggleGroupItem>
              <ToggleGroupItem value="lifetime">Lifetime</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 @[767px]/main:hidden bg-card shadow-xs" size="sm">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="lifetime">Lifetime</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-4 pb-4 md:gap-6 md:pb-6">
          <ClientOnly fallback={<Skeleton className="h-32 w-full px-4 lg:px-6" />}>
            <OperationalCards timeRange={timeRange} selectedMetric={selectedMetric} onSelectMetric={setSelectedMetric as any} userRole={user.role} />
          </ClientOnly>
          <div className="px-4 lg:px-6">
            <ClientOnly fallback={<Skeleton className="h-72 w-full" />}>
              <ChartAreaInteractive timeRange={timeRange} selectedMetric={selectedMetric} />
            </ClientOnly>
          </div>

          <div className="mt-4 md:mt-6 px-4 lg:px-6">
            <h2 className="text-xl font-bold md:text-2xl text-muted-foreground mb-4">Financial Overview</h2>
          </div>
          
          <ClientOnly fallback={<Skeleton className="h-32 w-full px-4 lg:px-6" />}>
            <FinancialCards timeRange={timeRange} selectedMetric={selectedFinancialMetric} onSelectMetric={setSelectedFinancialMetric as any} />
          </ClientOnly>

          <div className="px-4 lg:px-6">
            <ClientOnly fallback={<Skeleton className="h-72 w-full" />}>
              <ChartAreaInteractive 
                timeRange={timeRange} 
                selectedMetric={selectedFinancialMetric}
                title="Financial Activity"
                description="Real financial data for the selected period"
                mobileDescription="Financial activity"
              />
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  )
}

function PendingComponent() {
  return (
    <div className="mx-auto max-w-(--breakpoint-lg) flex flex-col items-center justify-center h-[calc(100dvh-16rem)]">
      <Spinner className="size-6" />
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div className="mx-auto max-w-(--breakpoint-lg) space-y-8 px-4 py-12">
      <h2 className="text-center text-3xl font-bold">Page Not Found</h2>
    </div>
  )
}

function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter()
  return (
    <div className="error p-6">
      <h2 className="text-xl font-bold">An error occurred: {error.name}</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={() => router.navigate({ to: '/', search: {} })}>
        Go Home
      </Button>
    </div>
  )
}

