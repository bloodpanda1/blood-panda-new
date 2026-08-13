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
import { cn, formatCurrency } from '#/lib/utils'
import { IconHandClick } from '@tabler/icons-react'
import {
  CheckIcon,
  ChevronRight,
  FlaskConicalIcon,
  StarIcon,
} from 'lucide-react'

import { FallbackPopularCategory } from '#/features/common/fallback-loaders'
import { Await, getRouteApi, Link } from '@tanstack/react-router'

const routeApi = getRouteApi('/')

export default function PopularPackages() {
  const { defferedPackages } = routeApi.useLoaderData()

  function returnStyles(idx: number, path: 'title' | 'icon') {
    switch (path) {
      case 'title':
        return idx + 1 === 1
          ? 'text-silver'
          : idx + 1 === 2
            ? 'text-gold'
            : idx + 1 === 3
              ? 'text-diamond'
              : idx + 1 === 4
                ? 'text-platinum'
                : idx + 1 === 5
                  ? 'text-destructive'
                  : ''

      case 'icon':
        return idx + 1 === 1
          ? 'bg-silver'
          : idx + 1 === 2
            ? 'bg-gold'
            : idx + 1 === 3
              ? 'bg-diamond'
              : idx + 1 === 4
                ? 'bg-platinum'
                : idx + 1 === 5
                  ? 'bg-destructive'
                  : ''

      default:
        break
    }
  }

  return (
    <section>
      <Card
        className={'rounded-none border-0 bg-transparent shadow-none ring-0'}
      >
        <CardHeader className={'px-0'}>
          <CardTitle>
            <h2
              className={
                'text:xl md:text-2xl lg:text-3xl xl:text-4xl font-medium lg:font-semibold'
              }
            >
              Popular Health Packages
            </h2>
          </CardTitle>
          <CardDescription className="row-start-2 sm:row-start-auto">
            <p className={'text-xs sm:text-sm md:text-base lg:text-lg'}>
              Preventive health checkups designed for every stage of life
            </p>
          </CardDescription>
          {/* col-start-2 row-span-2 row-start-1 self-start justify-self-end */}
          <CardAction
            className={
              'col-start-1 sm:col-start-2 row-start-3 sm:row-start-1 justify-self-start sm:justify-self-end mt-2 sm:mt-0'
            }
          >
            <Button variant={'link'} className={'text-destructive'} asChild>
              <Link
                to={'/packages/$package'}
                params={{ package: 'silver' }}
                viewTransition
              >
                View all Packages
                <ChevronRight className={'size-4'} />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className={'px-0'}>
          <Await
            promise={defferedPackages}
            fallback={<FallbackPopularCategory />}
          >
            {(data) => {
              return (
                <CardContent
                  className={
                    'px-0 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400/50 scrollbar-track-transparent flex gap-4 snap-x snap-mandatory scroll-smooth overflow-x-scroll scroll-fade-x snap-center'
                  }
                >
                  {data.map((item, idx) => {
                    const isPopular =
                      item.name.toLocaleLowerCase() === 'diamond'
                    return (
                      <Card
                        key={item.id}
                        className={cn(
                          'relative w-full min-w-xs snap-center my-4 pt-6 pb-0',
                          isPopular
                            ? 'ring-2 ring-primary'
                            : 'ring-2 ring-primary/50',
                          'bg-transparent',
                        )}
                      >
                        {isPopular ? (
                          <Badge
                            className={
                              'absolute top-0 left-0 z-10 w-full rounded-t-lg rounded-b-none'
                            }
                          >
                            <StarIcon
                              className={
                                'size-3 stroke-amber-200 fill-yellow-500'
                              }
                            />
                            Most Popular
                          </Badge>
                        ) : null}

                        <CardHeader className={'relative'}>
                          <CardAction
                            className={cn(
                              'absolute top-px left-0 col-start-1 rounded-lg p-2',
                              returnStyles(idx, 'icon'),
                            )}
                          >
                            <FlaskConicalIcon
                              className={'size-5 stroke-amber-50'}
                            />
                          </CardAction>
                          <CardTitle className={'ml-12 capitalize'}>
                            <h3
                              className={cn(
                                'text-xl font-semibold',
                                returnStyles(idx, 'title'),
                              )}
                            >
                              {item.name}
                            </h3>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className={'list-inside space-y-2'}>
                            {item.extraFeatures.map((feat) => {
                              return (
                                <li
                                  key={crypto.randomUUID()}
                                  className={'flex items-center gap-2'}
                                >
                                  <CheckIcon
                                    className={'size-4 stroke-destructive'}
                                  />
                                  {feat}
                                </li>
                              )
                            })}
                          </ul>
                        </CardContent>
                        <CardFooter
                          className={
                            'relative flex items-center justify-between space-y-4 border-t-2 border-border/50'
                          }
                        >
                          <Badge
                            variant={'ghost'}
                            className={
                              'absolute top-0 left-4 line-through text-xs font-semibold text-muted-foreground'
                            }
                          >
                            {formatCurrency(item.originalAmount)}
                          </Badge>
                          <h4 className={'mt-6 text-lg font-semibold'}>
                            {formatCurrency(item.discountedAmount)}
                          </h4>

                          <Button
                            type="button"
                            size={'sm'}
                            asChild
                            variant={
                              item.name === 'diamond' ? 'default' : 'outline'
                            }
                          >
                            <Link
                              to="/packages/$package"
                              params={{ package: item.name.toLowerCase() }}
                              viewTransition
                            >
                              Book <IconHandClick className={'size-4'} />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </CardContent>
              )
            }}
          </Await>
        </CardContent>
      </Card>
    </section>
  )
}
