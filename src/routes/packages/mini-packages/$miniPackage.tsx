import { createFileRoute, Link, useRouter } from '@tanstack/react-router'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { CheckCircle2Icon } from 'lucide-react'
// import { capitalizeFirstLetter, formatCurrency, formatSlug } from '#/lib/utils'
import { seo } from '#/constants/seo-details'
import { getMiniPackageDetailsByName } from '#/lib/mini-package.functions'
import { formatCurrency, formatSlug } from '#/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { Image } from '@unpic/react'
import { Skeleton } from 'boneyard-js/react'

export const Route = createFileRoute('/packages/mini-packages/$miniPackage')({
  loader: async ({ params }) => {
    const defferedMiniPackageDetails = getMiniPackageDetailsByName({
      data: { name: params.miniPackage },
    })
    return { defferedMiniPackageDetails }
  },
  head(ctx) {
    const { params } = ctx
    const slug = params.miniPackage
    return seo({ path: `/packages/mini-packages/$miniPackage`, slug })
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

const baseUrl = import.meta.env.VITE_BETTER_AUTH_URL

const imageBaseUrl = `${baseUrl}/mini-packages`

function RouteComponent() {
  const params = Route.useParams()
  const packageSlug = params.miniPackage

  const { data, isLoading } = useQuery({
    queryKey: ['miniPackageDetails', packageSlug],
    queryFn: () => getMiniPackageDetailsByName({ data: { name: packageSlug } }),
    refetchOnWindowFocus: true,
  })

  return (
    <main className={'mx-auto max-w-(--breakpoint-xl) space-y-8 px-4 py-12'}>
      <section className={''}>
        <div
          className={
            'relative aspect-video h-full w-full sm:aspect-video md:aspect-18/9 lg:aspect-22/9'
          }
        >
          {/* <img
            src="/packages/packages-bg.png"
            alt="packages-bg"
            width={'100%'}
            height={'100%'}
            className={
              'absolute top-0 left-0 -z-10 h-full w-full object-cover rounded-3xl'
            }
          /> */}
          <Image
            src="/packages/packages-bg.png"
            alt="packages-bg"
            layout="constrained"
            width={1282}
            height={488}
            className={'absolute top-0 left-0 -z-10 h-full w-full rounded-3xl'}
          />
          {/* <Image
            src="/packages/packages-bg.png"
            alt="packages-bg"
            layout="constrained"
            width={1282}
            height={488}
            className={
              'absolute top-0 left-0 -z-10 h-full w-full object-cover rounded-3xl'
            }
            // priority={true}
          /> */}
          <div
            className={
              'flex h-full w-full flex-col items-start justify-center gap-4 px-4 md:px-8 lg:px-12'
            }
          >
            <h1 className={'space-y-2'}>
              <span className={'block text-4xl font-bold text-primary'}>
                {formatSlug(packageSlug)}
              </span>
            </h1>
            <p className={'text-lg text-muted-foreground'}>
              A Complete Health Check for You & Your Family
            </p>
          </div>
        </div>
      </section>

      <Skeleton
        name={`mini-package-details-${packageSlug}`}
        loading={isLoading}
      >
        <div className={'grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6'}>
          <section className={'col-span-full lg:col-span-9'}>
            <Card>
              <CardHeader>
                <CardTitle className={'flex items-center gap-2'}>
                  <div className={'size-16'}>
                    <img
                      src={`${imageBaseUrl}${data?.cover}`}
                      alt={data?.name}
                      width={'100%'}
                      height={'100%'}
                      className={'rounded-full object-contain w-full h-full'}
                    />
                  </div>
                  <h2 className={'text-lg font-semibold'}>
                    {formatSlug(packageSlug)}
                  </h2>
                </CardTitle>
              </CardHeader>

              <CardContent className={'space-y-4'}>
                {data?.benefits.map((benefit, idx) => (
                  <Card
                    key={crypto.randomUUID()}
                    className={'bg-blue-100 py-4 ring-blue-500/50'}
                  >
                    <CardHeader>
                      <CardTitle>
                        <p>
                          {idx + 1}. {benefit}
                        </p>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </section>

          <aside className={'col-span-full lg:col-span-3'}>
            <Card>
              <CardHeader>
                <CardTitle>
                  <h3 className={'text-xl font-semibold'}>
                    {formatSlug(packageSlug)} Package
                  </h3>
                </CardTitle>
                <CardDescription className={'space-y-2'}>
                  <p className={'text-2xl font-semibold text-destructive'}>
                    {formatCurrency(data?.discountedAmount || '0')}
                  </p>
                  <div className={'inline-flex items-center gap-2'}>
                    <span
                      className={
                        'text-sm text-muted-foreground line-through font-medium'
                      }
                    >
                      {formatCurrency(data?.originalAmount || '0')}
                    </span>
                    <Badge className={'bg-destructive'}>
                      {data?.offerAmount} % Off
                    </Badge>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className={'space-y-2'}>
                  {data?.extraFeatures.map((feature) => (
                    <li
                      key={crypto.randomUUID()}
                      className={'flex items-center gap-2'}
                    >
                      <CheckCircle2Icon className={'size-4 stroke-green-500'} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button
                  className={
                    'w-full bg-destructive hover:bg-accent hover:text-destructive focus:ring-destructive'
                  }
                  asChild
                >
                  <Link to="/" viewTransition>
                    <IconChevronLeft className={'size-4'} />
                    Go Back
                  </Link>
                </Button>
                <Button
                  className={
                    'w-full bg-destructive hover:bg-accent hover:text-destructive transition-all duration-300 ease-in-out'
                  }
                >
                  Book Now <IconChevronRight className={'size-4'} />
                </Button>
              </CardFooter>
            </Card>
          </aside>
        </div>
      </Skeleton>
    </main>
  )
}

function PendingComponent() {
  return <div>Loading...</div>
}

function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter()
  return (
    <div className="error">
      <h2>Error loading mini package: {error.message}</h2>
      <p>{error.message}</p>
      <button onClick={() => router.navigate({ to: '/', search: {} })}>
        Go back to homepage
      </button>
    </div>
  )
}

function NotFoundComponent() {
  const router = useRouter()
  return (
    <div className="error">
      <h2>Mini Package Not Found</h2>
      <p>The package you are looking for does not exist.</p>
      <button onClick={() => router.navigate({ to: '/', search: {} })}>
        Go back to homepage
      </button>
    </div>
  )
}
