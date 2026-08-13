import { getPackageDeatilsByName } from '#/lib/package.functions'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'
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
import { packageIcons } from '#/constants'
import { seo } from '#/constants/seo-details'
import {
  capitalizeFirstLetter,
  cn,
  formatCurrency,
  formattedCategoryName,
} from '#/lib/utils'
import {
  IconCalendarCheck,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { Image } from '@unpic/react'
import { Skeleton } from 'boneyard-js/react'
import { CheckCircle2Icon } from 'lucide-react'

const baseUrl = import.meta.env.VITE_BETTER_AUTH_URL || 'http://localhost:3000'

const imageUrl = `${baseUrl}/packages`

export const Route = createFileRoute('/packages/$package')({
  loader: async ({ params }) => {
    const defferdPackageDetails = getPackageDeatilsByName({
      data: { name: params.package },
    })
    return { defferdPackageDetails }
  },
  head(ctx) {
    const { params } = ctx
    const slug = params.package
    return seo({ path: `/packages/$package`, slug })
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

function RouteComponent() {
  const params = Route.useParams()
  const { defferdPackageDetails } = Route.useLoaderData()

  const { data, isLoading } = useQuery({
    queryKey: ['packageDetails', params.package],
    queryFn: () => defferdPackageDetails,
  })

  const packageSlug = params.package

  const headingClass = cn(
    packageSlug === 'silver'
      ? 'text-silver'
      : packageSlug === 'gold'
        ? 'text-gold'
        : packageSlug === 'diamond'
          ? 'text-diamond'
          : packageSlug === 'platinum'
            ? 'text-platinum'
            : packageSlug === 'signature'
              ? 'text-signature'
              : '',
    'text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold lg:font-bold',
  )

  const buttonBg = cn(
    packageSlug === 'silver'
      ? 'bg-silver hover:bg-silver/80 focus:ring-silver'
      : packageSlug === 'gold'
        ? 'bg-gold hover:bg-gold/80 focus:ring-gold'
        : packageSlug === 'diamond'
          ? 'bg-diamond hover:bg-diamond/80 focus:ring-diamond'
          : packageSlug === 'platinum'
            ? 'bg-platinum hover:bg-platinum/80 focus:ring-platinum'
            : packageSlug === 'signature'
              ? 'bg-signature hover:bg-signature/80 focus:ring-signature'
              : '',
    'text-white',
  )

  return (
    <main className={'mx-auto max-w-(--breakpoint-xl) px-4 py-12'}>
      <Skeleton name={`package-details-${packageSlug}`} loading={isLoading}>
        <div className={'space-y-8'}>
          <section className={''}>
            <div
              className={
                'relative aspect-video h-full w-full sm:aspect-video md:aspect-18/9 lg:aspect-22/9'
              }
            >
              {/* <img
                src={`${imageUrl}/${data?.cover}`}
                alt={`Cover image for ${capitalizeFirstLetter(packageSlug)} package`}
                width={'100%'}
                height={'100%'}
                className={
                  'absolute top-0 left-0 -z-10 h-full w-full object-cover rounded-3xl'
                }
              /> */}
              <Image
                src={`${imageUrl}/${data?.cover}`}
                alt={`Cover image for ${capitalizeFirstLetter(packageSlug)} package`}
                layout="constrained"
                width={1282}
                height={488}
                className={
                  'absolute top-0 left-0 -z-10 h-full w-full rounded-3xl'
                }
              />
              {/* <Image
                src={`${imageUrl}/${data?.cover}`}
                alt={`Cover image for ${capitalizeFirstLetter(packageSlug)} package`}
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
                  <span className={cn('block', headingClass)}>
                    {capitalizeFirstLetter(packageSlug)}
                  </span>
                  <span
                    className={
                      'block text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-muted-foreground'
                    }
                  >
                    Health Package
                  </span>
                </h1>
                <p
                  className={
                    'text-sm md:text-base lg:text-lg text-muted-foreground'
                  }
                >
                  A Complete Health Check for You & Your Family
                </p>

                <div
                  className={
                    'space-y-2 bg-accent/50 backdrop-blur-md px-2 rounded-xl'
                  }
                >
                  <div className={'inline-flex items-center gap-2'}>
                    <p className={'text-2xl font-semibold text-destructive'}>
                      {formatCurrency(data?.discountedAmount || '0')}
                    </p>
                    <span
                      className={
                        'text-sm text-muted-foreground line-through font-semibold'
                      }
                    >
                      {formatCurrency(data?.originalAmount || '0')}
                    </span>
                    <Badge variant={'destructive'}>
                      {data?.offerAmount} % Off
                    </Badge>
                  </div>
                </div>

                <Button className={buttonBg}>
                  <IconCalendarCheck className={'size-4'} />
                  {`Book ${capitalizeFirstLetter(packageSlug)} Package Now`}
                </Button>
              </div>
            </div>
          </section>

          <div className={'grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6'}>
            <section className={'col-span-full lg:col-span-9'}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h2 className={'text-xl font-semibold'}>
                      Tests Included (
                      {data?.packageCategories.reduce(
                        (acc, category) => acc + category.features.length,
                        0,
                      )}
                      )
                    </h2>
                  </CardTitle>
                  <CardDescription>
                    <p className={'text-sm text-muted-foreground'}>
                      {data?.description}
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue={data?.packageCategories[0].id}
                    className="w-full"
                  >
                    {data?.packageCategories.map((category, idx) => {
                      const findIconBasedOnIndex = packageIcons[idx]
                      return (
                        <AccordionItem value={category.id} key={category.id}>
                          <AccordionTrigger className={'gap-3 items-center'}>
                            <span
                              className={'p-1.5 rounded-full bg-destructive/10'}
                            >
                              <img
                                src={findIconBasedOnIndex}
                                alt={category.name}
                                className={'h-6 w-auto'}
                              />
                            </span>
                            {idx + 1}. {formattedCategoryName(category.name)}
                          </AccordionTrigger>
                          <AccordionContent className={'h-fit'}>
                            <ul
                              className={
                                'in-even:grid in-even:grid-cols-2 pl-4'
                              }
                            >
                              {category.features.map((feature) => (
                                <li
                                  key={crypto.randomUUID()}
                                  className={'flex items-center gap-2'}
                                >
                                  <CheckCircle2Icon
                                    className={'size-4 stroke-green-500'}
                                  />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </CardContent>
              </Card>
            </section>

            <aside className={'col-span-full lg:col-span-3'}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h3 className={'text-xl font-semibold'}>
                      {capitalizeFirstLetter(packageSlug)} Package
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
                        <CheckCircle2Icon
                          className={'size-4 stroke-green-500'}
                        />
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
      <h2>Invalid Search Parameters</h2>
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
      <h2>Package Not Found</h2>
      <p>The package you are looking for does not exist.</p>
      <button onClick={() => router.navigate({ to: '/', search: {} })}>
        Go back to homepage
      </button>
    </div>
  )
}
