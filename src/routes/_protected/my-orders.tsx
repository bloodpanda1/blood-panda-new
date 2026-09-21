import { useState } from 'react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
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
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '#/components/ui/alert-dialog'
import { seo } from '#/constants/seo-details'
import { useTRPC } from '#/integrations/trpc/react'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  CreditCardIcon,
  FileTextIcon,
  HomeIcon,
  MapPinIcon,
  UserIcon,
} from 'lucide-react'
import { SampleJourneyTracker } from '#/features/profile/sample-journey-tracker'

export const Route = createFileRoute('/_protected/my-orders')({
  head: () => seo({ path: '/my-orders' }),
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

function RouteComponent() {
  const trpc = useTRPC()
  const [selectedTab, setSelectedTab] = useState('ALL')

  const { data: bookings = [], isLoading } = useQuery(
    trpc.users.myBookings.queryOptions()
  )
  
  const queryClient = useQueryClient()
  const cancelMutation = useMutation({
    ...trpc.users.cancelBooking.mutationOptions(),
    onSuccess: () => {
      toast.success('Booking cancelled successfully')
      queryClient.invalidateQueries({ queryKey: trpc.users.myBookings.queryKey() })
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to cancel booking')
    }
  })

  const filteredBookings = bookings.filter((b: any) => {
    if (selectedTab === 'ALL') return true
    return b.status === selectedTab
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
            <span>My Orders</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Orders & Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View your upcoming lab appointments, booking status, and sample collection details.
          </p>
        </div>

        <Button asChild variant="default">
          <Link to="/booking">Book New Test</Link>
        </Button>
      </div>

      <Separator />

      {/* Tabs Filter */}
      <div className="flex items-center justify-between">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="ALL">All ({bookings.length})</TabsTrigger>
            <TabsTrigger value="CONFIRMED">
              Confirmed ({bookings.filter((b: any) => b.status === 'CONFIRMED').length})
            </TabsTrigger>
            <TabsTrigger value="PENDING">
              Pending ({bookings.filter((b: any) => b.status === 'PENDING').length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
              <FileTextIcon className="size-7 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">No bookings found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {selectedTab === 'ALL'
                  ? "You haven't placed any lab test bookings yet. Book blood tests with free home sample collection."
                  : `You don't have any ${selectedTab.toLowerCase()} bookings.`}
              </p>
            </div>
            <Button asChild className="mt-2">
              <Link to="/booking">Book a Blood Test</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking: any) => {
            const primarySchedule = booking.schedules?.[0]
            const primaryAddress = booking.addresses?.[0]
            const payment = booking.payments?.[0]

            return (
              <Card key={booking.id} className="overflow-hidden border shadow-sm">
                <CardHeader className="bg-muted/40 pb-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold">
                          #{booking.id.slice(0, 8).toUpperCase()}
                        </span>
                        <Badge variant={statusBadgeVariant[booking.status] || 'secondary'}>
                          {booking.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {booking.type === 'ONLINE_PAYMENT' ? 'Online Paid' : booking.type === 'COD' ? 'Pay on Collection' : 'Instant'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <CardAction>
                      <Button asChild size="sm" variant="outline">
                        <Link to="/profile">View in Profile</Link>
                      </Button>
                    </CardAction>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Schedule */}
                    <div className="flex items-start gap-3 rounded-lg border p-3 bg-card">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <CalendarIcon className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Sample Collection Date</p>
                        <p className="text-sm font-semibold">
                          {primarySchedule?.scheduleDate
                            ? new Date(primarySchedule.scheduleDate).toLocaleDateString('en-IN', {
                                weekday: 'short',
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'Not scheduled'}
                        </p>
                        {primarySchedule?.slot && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <ClockIcon className="size-3" />
                            <span>{primarySchedule.slot}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3 rounded-lg border p-3 bg-card">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <MapPinIcon className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Collection Address</p>
                        <p className="text-sm font-semibold truncate max-w-[200px]">
                          {primaryAddress?.location || booking.address || 'Address provided'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {[primaryAddress?.houseNo, primaryAddress?.landmark, primaryAddress?.pinCode]
                            .filter(Boolean)
                            .join(', ') || booking.city || 'Home Collection'}
                        </p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="flex items-start gap-3 rounded-lg border p-3 bg-card sm:col-span-2 lg:col-span-1">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <CreditCardIcon className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Payment Summary</p>
                        <p className="text-sm font-semibold">
                          {payment?.amount ? `₹${payment.amount}` : booking.type === 'COD' ? 'Cash/UPI on collection' : 'Online'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          State: {payment?.state || (booking.status === 'CONFIRMED' ? 'PAID' : 'PENDING')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sample Journey Tracker */}
                  <div className="rounded-lg border bg-card/50 p-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                      Sample Tracking Journey
                    </h4>
                    <SampleJourneyTracker 
                      status={booking.status as any} 
                      scheduleDate={primarySchedule?.scheduleDate} 
                    />
                  </div>

                  {/* Patient & Test Details */}
                  {booking.members && booking.members.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Patients & Selected Tests ({booking.members.length})
                      </h4>
                      <div className="divide-y rounded-lg border">
                        {booking.members.map((member: any) => (
                          <div key={member.id} className="p-3 sm:p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <UserIcon className="size-4 text-primary" />
                                <span className="font-semibold text-sm">{member.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({member.age} yrs, {member.gender})
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">{member.phone}</span>
                            </div>

                            {member.testItems && member.testItems.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5 pl-6">
                                {member.testItems.map((test: any) => (
                                  <Badge key={test.id} variant="secondary" className="text-xs font-normal">
                                    {test.name}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground pl-6">General Diagnostics Profile</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="bg-muted/20 px-6 py-3 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-4">
                  <span>Home sample collection with NABL & ICMR accredited lab reports.</span>
                  <div className="flex gap-2">
                    {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-white" disabled={cancelMutation.isPending}>
                            Cancel Booking
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel booking #{booking.id.slice(0, 8).toUpperCase()}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No, keep it</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => cancelMutation.mutate({ id: booking.id })}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Yes, cancel booking
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    {booking.status === 'COMPLETED' && (
                      <Button asChild size="sm" variant="default">
                        <Link to="/my-reports">View Report</Link>
                      </Button>
                    )}
                    <Button asChild size="sm" variant="outline">
                      <a href={`/invoice/${booking.id}`} target="_blank" rel="noopener noreferrer">
                        Download Invoice
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/booking">Book Again</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
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
