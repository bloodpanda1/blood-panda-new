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
import { seo } from '#/constants/seo-details'
import UpdateAddressDialog from '#/features/profile/update-address-dialog'
import { useTRPC } from '#/integrations/trpc/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  BuildingIcon,
  HomeIcon,
  MapPinIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_protected/saved-addresses')({
  head: () => seo({ path: '/saved-addresses' }),
  component: RouteComponent,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
  wrapInSuspense: true,
  codeSplitGroupings: [
    ['component', 'pendingComponent', 'errorComponent', 'notFoundComponent'],
  ],
})

const addressTypeIcon: Record<string, typeof HomeIcon> = {
  HOME: HomeIcon,
  OFFICE: BuildingIcon,
  OTHER: MapPinIcon,
}

function RouteComponent() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { data: addresses = [], isLoading } = useQuery(
    trpc.addresses.list.queryOptions()
  )

  const deleteMutation = useMutation({
    ...trpc.addresses.delete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.addresses.list.queryKey() })
      toast.success('Address removed successfully')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete address')
    },
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
            <span>Saved Addresses</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Saved Addresses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your saved delivery and home sample collection addresses.
          </p>
        </div>

        <UpdateAddressDialog />
      </div>

      <Separator />

      {/* Addresses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6 space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
              <MapPinIcon className="size-7 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">No saved addresses</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Add an address to make your blood test bookings and home sample collections quick and seamless.
              </p>
            </div>
            <UpdateAddressDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {addresses.map((addr: any) => {
            const Icon = addressTypeIcon[addr.type] || MapPinIcon

            return (
              <Card key={addr.id} className="flex flex-col justify-between border shadow-sm hover:border-primary/40 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="size-3.5" />
                      </div>
                      <Badge variant="outline" className="text-xs font-semibold">
                        {addr.type}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1">
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
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-muted-foreground hover:text-destructive"
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this address?')) {
                            deleteMutation.mutate({ id: addr.id })
                          }
                        }}
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-1 text-sm pb-4">
                  <p className="font-semibold text-foreground">{addr.houseNo}</p>
                  <p className="text-muted-foreground">{addr.location}</p>
                  {addr.landmark && (
                    <p className="text-xs text-muted-foreground">Landmark: {addr.landmark}</p>
                  )}
                  <p className="text-xs font-medium text-foreground pt-1">
                    {[addr.city || 'Bengaluru', addr.pinCode, addr.state || 'Karnataka', 'India']
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </CardContent>

                <CardFooter className="bg-muted/20 px-6 py-2.5 text-xs text-muted-foreground border-t">
                  <span>Used for Home Sample Collection</span>
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
