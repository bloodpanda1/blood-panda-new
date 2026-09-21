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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '#/components/ui/item'
import { Separator } from '#/components/ui/separator'
import { Spinner } from '#/components/ui/spinner'
import { BookingStatus } from '#/generated/prisma/enums'
import { IconDownload, IconLogout } from '@tabler/icons-react'
import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { ChevronRight, FileTextIcon } from 'lucide-react'
import { authClient } from '#/lib/auth-client'

import { seo } from '#/constants/seo-details'
import ChangeUserPasswordDialog from '#/features/profile/change-user-password-dialog'
import DeleteUserPrescriptionDialog from '#/features/profile/delete-user-prescription-dialog'
import EditUserProfileDialog from '#/features/profile/edit-user-profile-dialog'
import UpdateAddressDialog from '#/features/profile/update-address-dialog'
import UploadUserPrescriptionDialog from '#/features/profile/upload-user-prescription-dialog'
import ViewPrescriptionDialog from '#/features/profile/view-prescription-dialog'
import ViewReportDialog from '#/features/profile/view-report-dialog'

import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_protected/profile')({
  head: () => seo({ path: '/profile' }),
  loader: ({ context }) => {
    const { user } = context

    return { user }
  },
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

// make enum values as array of items
const bookingStatusItems = Object.values(BookingStatus).map((status) => ({
  value: status,
  label: status,
}))

function RouteComponent() {
  const { user } = Route.useLoaderData()
  const router = useRouter()
  const trpc = useTRPC()

  const { data: myBookings = [], isLoading: isBookingsLoading } = useQuery(
    trpc.users.myBookings.queryOptions()
  )
  const { data: members = [] } = useQuery(
    trpc.members.list.queryOptions()
  )
  const { data: addresses = [] } = useQuery(
    trpc.addresses.list.queryOptions()
  )
  const { data: prescriptions = [] } = useQuery(
    trpc.users.getPrescriptions.queryOptions()
  )

  const handleLogout = async () => {
    await authClient.signOut()
    router.navigate({ to: '/' })
  }

  return (
    <main className={'mx-auto max-w-(--breakpoint-xl) space-y-8 px-4 py-4'}>
      <section>
        <Card className={'rounded-none shadow-none ring-0 bg-transparent pb-0'}>
          <CardHeader>
            <CardTitle>
              <h1
                className={
                  'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl  font-medium md:font-semibold lg:font-bold'
                }
              >
                <span>Welcome Back, </span>
                <span className={'text-blue-500'}>{user.name}</span>
              </h1>
            </CardTitle>
            <CardDescription>
              <p>
                Take charge of your health. View your orders, reports and manage
                your profile.
              </p>
            </CardDescription>
          </CardHeader>
          <Separator />
        </Card>
      </section>

      <section>
        <Card>
          <CardContent>
            <div className={'grid grid-cols-12 gap-4'}>
              <Card
                className={'col-span-full md:col-span-6 lg:col-span-4 gap-4'}
              >
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                  <CardDescription
                    className={'col-span-2 w-full flex items-center gap-2'}
                  >
                    {bookingStatusItems.map((item) => (
                      <Badge
                        key={item.value}
                        variant={'outline'}
                        className={'text-[10px]'}
                      >
                        {item.label}
                      </Badge>
                    ))}
                  </CardDescription>
                  <CardAction>
                    <Button size={'xs'} variant={'link'} asChild>
                      <Link to="/my-orders">
                        View all <ChevronRight className={'size-4'} />
                      </Link>
                    </Button>
                  </CardAction>
                </CardHeader>
                <Separator />
                <CardContent className={'space-y-2'}>
                  {isBookingsLoading ? (
                    <div className="flex justify-center py-6">
                      <Spinner className="size-6 text-primary" />
                    </div>
                  ) : myBookings.length > 0 ? (
                    <div className="space-y-3">
                      {myBookings.slice(0, 3).map((booking: any) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                          <div>
                            <p className="text-sm font-semibold">Booking #{booking.id.slice(0, 8)}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {booking.type}
                            </p>
                          </div>
                          <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'} className="text-xs">
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <p className="text-sm text-muted-foreground">No orders yet.</p>
                      <Button asChild size="sm" variant="outline" className="mt-3">
                        <Link to="/booking">Book a Test</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card
                className={'col-span-full md:col-span-6 lg:col-span-4 gap-4'}
              >
                <CardHeader>
                  <CardTitle>My Reports</CardTitle>
                  <CardDescription></CardDescription>
                  <CardAction>
                    <Button size={'xs'} variant={'link'} asChild>
                      <Link to="/my-reports">
                        View all <ChevronRight className={'size-4'} />
                      </Link>
                    </Button>
                  </CardAction>
                </CardHeader>
                <Separator className={'mt-6'} />
                <CardContent className={'space-y-2'}>
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-sm text-muted-foreground">No reports yet.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className={'col-span-full lg:col-span-4 gap-4'}>
                <CardHeader>
                  <CardTitle>Uploaded Prescriptions</CardTitle>
                  <CardAction>
                    <Button size={'xs'} variant={'link'} asChild>
                      <Link to="/my-prescriptions">
                        View all <ChevronRight className={'size-4'} />
                      </Link>
                    </Button>
                  </CardAction>
                </CardHeader>
                <Separator className={'mt-6'} />
                <CardContent className={'space-y-4'}>
                  {prescriptions.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {prescriptions.slice(0, 3).map((presc: any, index: number) => (
                        <div
                          key={index}
                          className="group relative aspect-square rounded-md overflow-hidden bg-muted/20 border flex flex-col"
                        >
                          <a
                            href={presc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 w-full relative overflow-hidden"
                          >
                            {presc.url.endsWith('.pdf') ? (
                              <div className="flex h-full flex-col items-center justify-center p-2 text-center bg-muted/40 group-hover:bg-muted/60 transition-colors">
                                <FileTextIcon className="size-6 text-primary mb-1" />
                                <span className="text-[10px] font-medium text-muted-foreground">PDF</span>
                              </div>
                            ) : (
                              <img
                                src={presc.url}
                                alt={`Prescription ${index + 1}`}
                                className="object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200"
                              />
                            )}
                          </a>
                          {presc.memberName && (
                            <div className="bg-muted px-1 py-0.5 text-center text-[9px] font-medium border-t w-full truncate text-muted-foreground">
                              {presc.memberName}
                            </div>
                          )}
                          <div className="absolute top-1 right-1 z-10 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <DeleteUserPrescriptionDialog url={presc.url} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <p className="text-sm text-muted-foreground">No prescriptions uploaded.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <UploadUserPrescriptionDialog />
                </CardFooter>
              </Card>
            </div>
          </CardContent>

          <CardContent>
            <div className={'grid grid-cols-12 gap-4'}>
              <Card className={'col-span-full lg:col-span-4'}>
                <CardHeader>
                  <CardTitle>Saved Address</CardTitle>
                  <CardAction>
                    <Button size={'xs'} variant={'link'} asChild>
                      <Link to="/saved-addresses">
                        View all <ChevronRight className={'size-4'} />
                      </Link>
                    </Button>
                  </CardAction>
                </CardHeader>
                <Separator />
                <CardContent className={'space-y-3 pt-4'}>
                  {addresses.length > 0 ? (
                    <div className="space-y-3">
                      {addresses.slice(0, 2).map((addr: any) => (
                        <div key={addr.id} className="p-3 rounded-lg border bg-muted/20 space-y-1">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs font-semibold">
                              {addr.type}
                            </Badge>
                            <UpdateAddressDialog
                              address={{
                                id: addr.id,
                                type: addr.type,
                                houseNo: addr.houseNo,
                                location: addr.location,
                                landmark: addr.landmark,
                                pinCode: addr.pinCode,
                                city: addr.city,
                                state: addr.state,
                              }}
                            />
                          </div>
                          <p className="text-sm font-semibold text-foreground pt-1">{addr.houseNo}</p>
                          <p className="text-xs text-muted-foreground">{addr.location}</p>
                          <p className="text-xs text-muted-foreground">
                            {[addr.city || 'Bengaluru', addr.pinCode].filter(Boolean).join(' - ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                      <p className="text-sm text-muted-foreground">No address saved.</p>
                      <UpdateAddressDialog />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className={'col-span-full md:col-span-6 lg:col-span-4'}>
                <CardHeader>
                  <CardTitle>Family Members</CardTitle>
                  <CardAction>
                    <Button size={'xs'} variant={'link'} asChild>
                      <Link to="/family-members">
                        View all <ChevronRight className={'size-4'} />
                      </Link>
                    </Button>
                  </CardAction>
                </CardHeader>
                <Separator className={'-my-2'} />
                <CardContent className={'space-y-2'}>
                  {members.length > 0 ? (
                    <div className="space-y-2">
                      {members.slice(0, 3).map((member: any) => (
                        <div key={member.id} className="flex items-center justify-between p-2 rounded-md border text-sm">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-xs text-muted-foreground">{member.age} yrs • {member.gender}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <p className="text-sm text-muted-foreground">No family members added.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className={'col-span-full md:col-span-6 lg:col-span-4'}>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className={'space-y-2'}>
                  <EditUserProfileDialog />
                  <ChangeUserPasswordDialog />
                  <Button className={'w-full'} variant={'destructive'} onClick={handleLogout}>
                    Logout
                    <IconLogout className={'size-4'} />
                  </Button>
                </CardContent>
              </Card>
            </div>
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
