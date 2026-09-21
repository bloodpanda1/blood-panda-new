import { useState } from 'react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Calendar } from '#/components/ui/calendar'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Separator } from '#/components/ui/separator'
import { Skeleton } from '#/components/ui/skeleton'
import { Spinner } from '#/components/ui/spinner'
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { seo } from '#/constants/seo-details'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  CalendarCheckIcon,
  CalendarIcon,
  ClockIcon,
  FilterIcon,
  MapPinIcon,
  PhoneIcon,
  SearchIcon,
  TestTubesIcon,
  UserIcon,
} from 'lucide-react'

export const Route = createFileRoute('/admin/calendar')({
  head: () => ({
    meta: [
      {
        title: 'Collection Calendar | Admin Dashboard',
      },
    ],
  }),
  component: RouteComponent,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
  wrapInSuspense: true,
  codeSplitGroupings: [
    ['component', 'pendingComponent', 'errorComponent', 'notFoundComponent'],
  ],
})

const statusBadgeVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  CONFIRMED: 'default',
  PENDING: 'secondary',
  COMPLETED: 'outline',
  CANCELLED: 'destructive',
}

function formatLocalDate(date: Date) {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().split('T')[0]
}

function RouteComponent() {
  const trpc = useTRPC()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const { data: schedules = [], isLoading } = useQuery(
    trpc.admin.schedules.queryOptions()
  )

  // Map of dates: YYYY-MM-DD -> list of schedules
  const schedulesByDate: Record<string, typeof schedules> = {}
  schedules.forEach((s: any) => {
    if (s.scheduleDate) {
      // s.scheduleDate from DB is typically Midnight UTC for the selected date.
      // E.g. "2026-09-11T18:30:00.000Z". To get local date string, we must format it.
      const dateObj = typeof s.scheduleDate === 'string' ? new Date(s.scheduleDate) : s.scheduleDate
      const dateKey = formatLocalDate(dateObj)

      if (!schedulesByDate[dateKey]) schedulesByDate[dateKey] = []
      schedulesByDate[dateKey].push(s)
    }
  })

  // Selected date key
  const selectedDateKey = selectedDate
    ? formatLocalDate(selectedDate)
    : ''

  const dateSchedules = schedulesByDate[selectedDateKey] || []

  // Filter by search & status
  const filteredSchedules = dateSchedules.filter((s: any) => {
    const booking = s.booking
    if (statusFilter !== 'ALL' && booking?.status !== statusFilter) return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchesId = booking?.id?.toLowerCase().includes(q)
      const matchesUser = booking?.user?.name?.toLowerCase().includes(q) || booking?.user?.email?.toLowerCase().includes(q)
      const matchesMember = booking?.members?.some((m: any) => m.name.toLowerCase().includes(q) || m.phone.includes(q))
      const matchesAddress = booking?.addresses?.some((a: any) => a.location?.toLowerCase().includes(q) || a.pinCode?.includes(q))
      return matchesId || matchesUser || matchesMember || matchesAddress
    }
    return true
  })

  // Quick stats
  const todayKey = formatLocalDate(new Date())
  const todayCount = schedulesByDate[todayKey]?.length || 0

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Sample Collection & Dispatch Calendar
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track phlebotomist home visit slots, patient appointments, and daily blood test dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedDate(new Date())}
          >
            Today ({todayCount})
          </Button>
          <Button asChild size="sm">
            <Link to="/admin/bookings">View Bookings</Link>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total Scheduled</p>
          <p className="text-2xl font-bold mt-1">{schedules.length}</p>
        </Card>
        <Card className="p-4 border-primary/40 bg-primary/5">
          <p className="text-xs font-medium text-primary">Today's Visits</p>
          <p className="text-2xl font-bold text-primary mt-1">{todayCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Selected Day</p>
          <p className="text-2xl font-bold mt-1">{dateSchedules.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {schedules.filter((s: any) => s.booking?.status === 'CONFIRMED').length}
          </p>
        </Card>
        <Card className="p-4 border-red-500/20 bg-red-500/5">
          <p className="text-xs font-medium text-red-600 dark:text-red-400">Canceled</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            {schedules.filter((s: any) => s.booking?.status === 'CANCELLED').length}
          </p>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Calendar Picker Panel */}
        <Card className="lg:col-span-4 h-fit border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarIcon className="size-4 text-primary" />
              Calendar Dispatch
            </CardTitle>
            <CardDescription>
              Select any highlighted date to view scheduled sample collections.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border p-3"
              modifiers={{
                scheduled: (date) => {
                  const key = formatLocalDate(date)
                  return !!schedulesByDate[key]?.length
                },
              }}
              modifiersClassNames={{
                scheduled:
                  'font-bold underline decoration-primary decoration-2 underline-offset-4 bg-primary/10 rounded-full',
              }}
            />
          </CardContent>
          <CardFooter className="bg-muted/20 px-4 py-3 text-xs text-muted-foreground border-t flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-primary" />
              <span>Has visits scheduled</span>
            </div>
            <span>{schedules.length} Total Visits</span>
          </CardFooter>
        </Card>

        {/* Schedule & Dispatch Roster */}
        <div className="lg:col-span-8 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search patient, phone, pin code, or booking ID..."
                className="pl-9 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="h-8">
                <TabsTrigger value="ALL" className="text-xs px-2.5">
                  All ({dateSchedules.length})
                </TabsTrigger>
                <TabsTrigger value="CONFIRMED" className="text-xs px-2.5">
                  Confirmed (
                  {dateSchedules.filter((s: any) => s.booking?.status === 'CONFIRMED').length}
                  )
                </TabsTrigger>
                <TabsTrigger value="PENDING" className="text-xs px-2.5">
                  Pending (
                  {dateSchedules.filter((s: any) => s.booking?.status === 'PENDING').length}
                  )
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Schedule List */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6 space-y-3">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </Card>
              ))}
            </div>
          ) : filteredSchedules.length > 0 ? (
            <div className="space-y-4">
              {filteredSchedules.map((schedule: any) => {
                const booking = schedule.booking
                const address = booking?.addresses?.[0]
                const user = booking?.user

                return (
                  <Card key={schedule.id} className="border shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 py-3 px-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold">
                            #{booking?.id?.slice(0, 8).toUpperCase() || 'BOOKING'}
                          </span>
                          <Badge
                            variant={statusBadgeVariant[booking?.status] || 'secondary'}
                            className="text-xs"
                          >
                            {booking?.status || 'PENDING'}
                          </Badge>
                          <Badge variant="outline" className="text-[11px]">
                            {booking?.type === 'ONLINE_PAYMENT' ? 'Online Paid' : 'COD / Desk'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                          <ClockIcon className="size-3.5" />
                          <span>Slot: {schedule.slot || 'Morning'}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 space-y-3 text-xs">
                      {/* Customer & Address details */}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {/* Address */}
                        <div className="flex items-start gap-2 rounded-md border p-2.5 bg-card">
                          <MapPinIcon className="size-4 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-foreground">
                              {address?.houseNo}, {address?.location}
                            </p>
                            <p className="text-muted-foreground">
                              {[address?.landmark, address?.pinCode, address?.type]
                                .filter(Boolean)
                                .join(' • ')}
                            </p>
                          </div>
                        </div>

                        {/* Account Owner */}
                        <div className="flex items-start gap-2 rounded-md border p-2.5 bg-card">
                          <UserIcon className="size-4 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-foreground">{user?.name || 'Customer'}</p>
                            <p className="text-muted-foreground">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Patients Roster & Test Vials Required */}
                      {booking?.members && booking.members.length > 0 && (
                        <div className="space-y-2 pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-muted-foreground flex items-center gap-1">
                              <TestTubesIcon className="size-3.5 text-primary" />
                              Patients & Tests ({booking.members.length}):
                            </span>
                          </div>

                          <div className="divide-y rounded-md border">
                            {booking.members.map((member: any) => (
                              <div key={member.id} className="p-2.5 space-y-1.5 bg-card">
                                <div className="flex items-center justify-between font-medium">
                                  <span>
                                    {member.name} ({member.age} yrs, {member.gender})
                                  </span>
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <PhoneIcon className="size-3" />
                                    {member.phone}
                                  </span>
                                </div>

                                {member.testItems && member.testItems.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {member.testItems.map((test: any) => (
                                      <Badge
                                        key={test.id}
                                        variant="secondary"
                                        className="text-[10px] font-normal"
                                      >
                                        {test.name}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">Standard diagnostics profile</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="bg-muted/10 px-4 py-2 flex items-center justify-between border-t text-xs">
                      <span className="text-muted-foreground">
                        Booked on{' '}
                        {booking?.createdAt
                          ? new Date(booking.createdAt).toLocaleDateString('en-IN')
                          : 'N/A'}
                      </span>
                      <Button asChild size="xs" variant="outline">
                        <Link to="/admin/bookings" search={{ bookingId: booking?.id }}>Manage Booking</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="border border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CalendarCheckIcon className="size-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {searchQuery ? 'No visits match your search' : 'No sample collection visits scheduled'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {searchQuery
                      ? 'Try adjusting your search keywords or status filter.'
                      : 'Select another date from the calendar to view scheduled appointments.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function PendingComponent() {
  return (
    <div className="mx-auto max-w-(--breakpoint-lg) flex flex-col items-center justify-center h-[calc(100dvh-16rem)]">
      <Spinner className="size-6 text-primary" />
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
    <div className="mx-auto max-w-(--breakpoint-lg) space-y-4 p-8 text-center">
      <h2 className="text-2xl font-bold">An error occurred</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={() => router.navigate({ to: '/admin/dashboard', search: {} })}>
        Return to Admin Dashboard
      </Button>
    </div>
  )
}
