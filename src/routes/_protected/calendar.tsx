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
import { Separator } from '#/components/ui/separator'
import { Skeleton } from '#/components/ui/skeleton'
import { Spinner } from '#/components/ui/spinner'
import { seo } from '#/constants/seo-details'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  CalendarCheck2Icon,
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  HeartPulseIcon,
  MapPinIcon,
  PlusIcon,
  UserIcon,
} from 'lucide-react'

export const Route = createFileRoute('/_protected/calendar')({
  head: () => seo({ path: '/calendar' }),
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

  const { data: schedules = [], isLoading } = useQuery(
    trpc.users.mySchedules.queryOptions()
  )

  // Map of dates that have appointments: YYYY-MM-DD -> list of schedules
  const schedulesByDate: Record<string, typeof schedules> = {}
  schedules.forEach((s: any) => {
    if (s.scheduleDate) {
      const dateKey = formatLocalDate(new Date(s.scheduleDate))
      if (!schedulesByDate[dateKey]) schedulesByDate[dateKey] = []
      schedulesByDate[dateKey].push(s)
    }
  })

  // Selected date key
  const selectedDateKey = selectedDate
    ? formatLocalDate(selectedDate)
    : ''

  const selectedDateSchedules = schedulesByDate[selectedDateKey] || []

  // Upcoming schedules (all future or today)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const upcomingSchedules = schedules.filter((s: any) => {
    return new Date(s.scheduleDate) >= now
  })

  return (
    <main className="mx-auto max-w-(--breakpoint-xl) space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link to="/profile" className="hover:underline flex items-center gap-1">
              <ArrowLeftIcon className="size-4" />
              Profile
            </Link>
            <span>/</span>
            <span>Test Calendar</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Test Calendar & Schedule
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your scheduled home blood collection slots, appointment dates, and patient rosters.
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/my-orders">View All Orders</Link>
          </Button>
          <Button asChild>
            <Link to="/booking">
              <PlusIcon className="size-4 mr-1.5" /> Book Test
            </Link>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Calendar Picker Card */}
        <Card className="lg:col-span-4 h-fit border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarIcon className="size-4 text-primary" />
              Select Date
            </CardTitle>
            <CardDescription>
              Dates with scheduled tests are highlighted below.
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
              <span>Has scheduled appointment</span>
            </div>
            <span>{schedules.length} Total appointments</span>
          </CardFooter>
        </Card>

        {/* Schedule Details View */}
        <div className="lg:col-span-8 space-y-6">
          {/* Selected Date Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CalendarCheck2Icon className="size-5 text-primary" />
                {selectedDate
                  ? selectedDate.toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Select a date'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {selectedDateSchedules.length}{' '}
                {selectedDateSchedules.length === 1 ? 'appointment' : 'appointments'} scheduled on this day
              </p>
            </div>

            {selectedDateSchedules.length > 0 && (
              <Badge variant="default" className="text-xs">
                {selectedDateSchedules.length} Scheduled
              </Badge>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="p-6 space-y-3">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-24 w-full" />
                </Card>
              ))}
            </div>
          ) : selectedDateSchedules.length > 0 ? (
            <div className="space-y-4">
              {selectedDateSchedules.map((schedule: any) => {
                const booking = schedule.booking
                const address = booking?.addresses?.[0]

                return (
                  <Card key={schedule.id} className="border shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            #{booking?.id?.slice(0, 8).toUpperCase() || 'BOOKING'}
                          </Badge>
                          <Badge variant={statusBadgeVariant[booking?.status] || 'secondary'}>
                            {booking?.status || 'PENDING'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {booking?.type === 'ONLINE_PAYMENT' ? 'Online' : 'COD / Desk'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                          <ClockIcon className="size-3.5" />
                          <span>{schedule.slot || 'Morning Slot'}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 space-y-4">
                      {/* Collection Address */}
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <MapPinIcon className="size-4 text-primary shrink-0 mt-0.5" />
                        <span>
                          {[
                            address?.houseNo,
                            address?.location,
                            address?.landmark,
                            address?.pinCode,
                          ]
                            .filter(Boolean)
                            .join(', ') || 'Home Collection Address'}
                        </span>
                      </div>

                      {/* Patient & Test Items */}
                      {booking?.members && booking.members.length > 0 && (
                        <div className="space-y-2 pt-1 border-t">
                          <p className="text-xs font-medium text-muted-foreground">
                            Patients ({booking.members.length}):
                          </p>
                          <div className="divide-y rounded-md border">
                            {booking.members.map((member: any) => (
                              <div key={member.id} className="p-2.5 space-y-1.5 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-foreground">
                                    {member.name} ({member.age} yrs, {member.gender})
                                  </span>
                                  <span className="text-muted-foreground">{member.phone}</span>
                                </div>
                                {member.testItems && member.testItems.length > 0 && (
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
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fasting Tip */}
                      <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
                        <HeartPulseIcon className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                        <span>
                          <strong>Fasting Guidelines:</strong> 10-12 hours overnight fasting (water allowed) is recommended for accurate blood glucose and lipid panel results.
                        </span>
                      </div>
                    </CardContent>

                    <CardFooter className="bg-muted/10 px-4 py-2.5 flex justify-end gap-2 border-t text-xs">
                      <Button asChild size="sm" variant="ghost">
                        <Link to="/my-orders">View Order Receipt</Link>
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
                  <CalendarIcon className="size-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">No tests scheduled for this date</p>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Select another highlighted date from the calendar or book a new blood test with free home collection.
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link to="/booking">Book Home Collection</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Appointments Summary */}
          {upcomingSchedules.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                All Upcoming Appointments ({upcomingSchedules.length})
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {upcomingSchedules.map((s: any) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedDate(new Date(s.scheduleDate))}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedDateKey === formatLocalDate(new Date(s.scheduleDate))
                        ? 'border-primary bg-primary/5 shadow-xs'
                        : 'hover:border-primary/40 bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">
                        {new Date(s.scheduleDate).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                      <Badge variant={statusBadgeVariant[s.booking?.status] || 'secondary'} className="text-[10px]">
                        {s.booking?.status || 'SCHEDULED'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <ClockIcon className="size-3" />
                      {s.slot || 'Morning Slot'}
                    </p>
                    <p className="text-xs font-medium text-foreground truncate mt-1">
                      {s.booking?.members?.[0]?.name || 'Patient'}
                      {s.booking?.members?.length > 1 ? ` +${s.booking.members.length - 1} more` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
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
      <Button onClick={() => router.navigate({ to: '/', search: {} })}>
        Return to Home
      </Button>
    </div>
  )
}
