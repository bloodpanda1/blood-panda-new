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
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

import { seo } from '#/constants/seo-details'
import ChangeUserPasswordDialog from '#/features/profile/change-user-password-dialog'
import DeleteUserPrescriptionDialog from '#/features/profile/delete-user-prescription-dialog'
import EditUserProfileDialog from '#/features/profile/edit-user-profile-dialog'
import UpdateAddressDialog from '#/features/profile/update-address-dialog'
import UploadUserPrescriptionDialog from '#/features/profile/upload-user-prescription-dialog'
import ViewPrescriptionDialog from '#/features/profile/view-prescription-dialog'
import ViewReportDialog from '#/features/profile/view-report-dialog'

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
                    <Button size={'xs'} variant={'link'}>
                      View all <ChevronRight className={'size-4'} />
                    </Button>
                  </CardAction>
                </CardHeader>
                <Separator />
                <CardContent className={'space-y-2'}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Item variant="outline" size={'xs'} key={index}>
                      <ItemContent>
                        <ItemTitle>Basic Item</ItemTitle>
                        <ItemDescription>
                          A simple item with title and description.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
                </CardContent>
              </Card>

              <Card
                className={'col-span-full md:col-span-6 lg:col-span-4 gap-4'}
              >
                <CardHeader>
                  <CardTitle>My Reports</CardTitle>
                  <CardDescription></CardDescription>
                  <CardAction>
                    <Button size={'xs'} variant={'link'}>
                      View all <ChevronRight className={'size-4'} />
                    </Button>
                  </CardAction>
                </CardHeader>
                <Separator className={'mt-6'} />
                <CardContent className={'space-y-2'}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Item variant="outline" size={'xs'} key={index}>
                      <ItemContent>
                        <ItemTitle>Basic Item</ItemTitle>
                      </ItemContent>
                      <ItemActions>
                        <ViewReportDialog />
                        <Button variant="outline" size="icon-xs">
                          <IconDownload className={'size-4'} />
                        </Button>
                      </ItemActions>
                    </Item>
                  ))}
                </CardContent>
              </Card>

              <Card className={'col-span-full lg:col-span-4 gap-4'}>
                <CardHeader>
                  <CardTitle>Uploaded Prescriptions</CardTitle>
                  <CardAction>
                    <Button size={'xs'} variant={'link'}>
                      View all <ChevronRight className={'size-4'} />
                    </Button>
                  </CardAction>
                </CardHeader>
                <Separator className={'mt-6'} />
                <CardContent className={'space-y-2'}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Item variant="outline" size={'xs'} key={index}>
                      <ItemContent>
                        <ItemTitle>Basic Item</ItemTitle>
                        {/* <ItemDescription>
                        A simple item with title and description.
                      </ItemDescription> */}
                      </ItemContent>
                      <ItemActions>
                        <ViewPrescriptionDialog />
                        <DeleteUserPrescriptionDialog />
                      </ItemActions>
                    </Item>
                  ))}
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
                </CardHeader>
                <Separator />
                <CardContent className={'space-y-2'}>
                  <Item variant="outline" size={'sm'}>
                    <ItemContent>
                      <ItemTitle>Basic Item</ItemTitle>
                      <ItemDescription>
                        A simple item with title and description.
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <UpdateAddressDialog />
                    </ItemActions>
                  </Item>
                </CardContent>
              </Card>

              <Card className={'col-span-full md:col-span-6 lg:col-span-4'}>
                <CardHeader>
                  <CardTitle>Family Members</CardTitle>
                  <CardAction>
                    <Button size={'xs'} variant={'link'}>
                      View all <ChevronRight className={'size-4'} />
                    </Button>
                  </CardAction>
                </CardHeader>
                <Separator className={'-my-2'} />
                <CardContent className={'space-y-2'}>
                  <Item variant="outline" size={'sm'}>
                    <ItemContent>
                      <ItemTitle>Basic Item</ItemTitle>
                      <ItemDescription>
                        A simple item with title and description.
                      </ItemDescription>
                    </ItemContent>
                  </Item>
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
                  <Button className={'w-full'} variant={'destructive'}>
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
