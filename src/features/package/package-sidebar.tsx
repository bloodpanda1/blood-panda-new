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
import { Skeleton } from '#/components/ui/skeleton'
import { capitalizeFirstLetter, formatCurrency } from '#/lib/utils'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { Await, getRouteApi, Link } from '@tanstack/react-router'
import { CheckCircle2Icon } from 'lucide-react'

const routeApi = getRouteApi('/packages/$package')

export default function PackageSidebar() {
  const params = routeApi.useParams()
  const { defferdPackageDetails } = routeApi.useLoaderData()

  const packageSlug = params.package

  return (
    <Await
      promise={defferdPackageDetails}
      fallback={
        <aside className={'col-span-full lg:col-span-3'}>
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className={'h-6 w-32'} />
              </CardTitle>
              <CardDescription className={'space-y-2'}>
                <Skeleton className={'h-3 w-16'} />
              </CardDescription>
            </CardHeader>
            <CardContent className={'space-y-2'}>
              <Skeleton className={'h-3 w-full'} />
              <Skeleton className={'h-3 w-full'} />
              <Skeleton className={'h-3 w-full'} />
              <Skeleton className={'h-3 w-full'} />
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Skeleton className={'h-10 w-full'} />
              <Skeleton className={'h-10 w-full'} />
            </CardFooter>
          </Card>
        </aside>
      }
    >
      {(data) => (
        <aside className={'col-span-full lg:col-span-3'}>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={'text-xl font-semibold'}>
                  {capitalizeFirstLetter(packageSlug)} Package
                </h3>
              </CardTitle>
              <CardDescription className={'space-y-2'}>
                <p className={'text-2xl font-semibold'}>
                  {formatCurrency(data.discountedAmount)}
                </p>
                <div className={'inline-flex items-center gap-2'}>
                  <span
                    className={'text-sm text-muted-foreground line-through'}
                  >
                    {formatCurrency(data.originalAmount)}
                  </span>
                  <Badge>{data.offerAmount} % Off</Badge>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                {data.extraFeatures.map((feature) => (
                  <li
                    key={crypto.randomUUID()}
                    className={'flex items-center gap-2'}
                  >
                    <CheckCircle2Icon className={'size-4'} />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button className={'w-full'} asChild>
                <Link to="/" viewTransition>
                  <IconChevronLeft className={'size-4'} />
                  Go Back
                </Link>
              </Button>
              <Button className={'w-full'}>
                Book Now <IconChevronRight className={'size-4'} />
              </Button>
            </CardFooter>
          </Card>
        </aside>
      )}
    </Await>
  )
}
