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
import { formatCurrency } from '#/lib/utils'
import { useCart } from '#/stores/useCart'
import { IconArrowUpRight } from '@tabler/icons-react'
import { Await, getRouteApi, Link } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'
import { FallbackIndividials } from '../../common/fallback-loaders'

const routeApi = getRouteApi('/')

export default function IndividualCategory() {
  const { deferredTests } = routeApi.useLoaderData()

  const { addItem } = useCart()

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
              Browse Tests by Individual Category
            </h2>
          </CardTitle>
          <CardDescription className="row-start-2 sm:row-start-auto">
            <p className={'text-xs sm:text-sm md:text-base lg:text-lg'}>
              Find the right diagnostic tests based on your health concern.
            </p>
          </CardDescription>
          <CardAction
            className={
              'col-start-1 sm:col-start-2 row-start-3 sm:row-start-1 justify-self-start sm:justify-self-end mt-2 sm:mt-0'
            }
          >
            <Button asChild variant={'outline'}>
              <Link to="/tests" viewTransition>
                View All
                <IconArrowUpRight className={'size-4'} />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>

        {/* <CardContent>
          <CardDescription className={'text-center'}>
            <p className={'text-lg font-semibold text-muted-foreground'}>
              No individual categories found.
            </p>
          </CardDescription>
        </CardContent> */}

        <CardContent className={'px-0'}>
          <Await promise={deferredTests} fallback={<FallbackIndividials />}>
            {(data) => {
              // split data total 2 parts
              const half = Math.ceil(data.length / 2)
              const firstHalf = data.slice(0, half)
              const secondHalf = data.slice(half)

              return (
                <CardContent
                  // className={
                  //   'px-0 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400/50 scrollbar-track-transparent flex gap-4 snap-x snap-mandatory scroll-smooth overflow-x-scroll scroll-fade-x'
                  // }
                  className={'px-0 space-y-4'}
                >
                  <div
                    className={
                      'px-0 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400/50 scrollbar-track-transparent flex gap-4 snap-x snap-mandatory scroll-smooth overflow-x-scroll scroll-fade-x'
                    }
                  >
                    {firstHalf.map((item) => {
                      return (
                        <Card
                          className={
                            'w-full min-w-xs md:min-w-sm snap-center my-4 gap-4'
                          }
                          key={item.id}
                        >
                          <CardHeader>
                            <CardTitle>
                              <h4>{item.name}</h4>
                            </CardTitle>
                            <CardDescription className={'space-y-2'}>
                              <p>{'N/a'}</p>
                              <p className={'space-x-2'}>
                                <span>Fasting Required:</span>
                                <Badge>
                                  {item.isFastingRequired ? 'Yes' : 'No'}
                                </Badge>
                              </p>
                            </CardDescription>
                          </CardHeader>

                          <CardContent>
                            <Badge variant={'ghost'} className={'line-through'}>
                              {formatCurrency(item.originalPrice)}
                            </Badge>
                            <h5 className={'text-lg font-semibold'}>
                              {formatCurrency(item.discountedPrice)}
                            </h5>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant={'destructive'}
                              className={
                                'w-full rounded-full bg-transparent border-destructive hover:border-destructive hover:bg-destructive/10 text-destructive hover:text-destructive'
                              }
                              onClick={() =>
                                addItem({
                                  item: {
                                    id: item.id,
                                    name: item.name,
                                    price: Number(item.discountedPrice),
                                    quantity: 1,
                                    image:
                                      'https://avatar.vercel.sh/rauchg.png',
                                  },
                                })
                              }
                            >
                              Add <PlusCircle className={'size-4'} />
                            </Button>
                          </CardFooter>
                        </Card>
                      )
                    })}
                  </div>

                  <div
                    className={
                      'px-0 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400/50 scrollbar-track-transparent flex gap-4 snap-x snap-mandatory scroll-smooth overflow-x-scroll scroll-fade-x'
                    }
                  >
                    {secondHalf.map((item) => {
                      return (
                        <Card
                          className={
                            'w-full min-w-xs md:min-w-sm snap-center my-4 gap-4'
                          }
                          key={item.id}
                        >
                          <CardHeader>
                            <CardTitle>
                              <h4>{item.name}</h4>
                            </CardTitle>
                            <CardDescription className={'space-y-2'}>
                              <p>{'N/a'}</p>
                              <p className={'space-x-2'}>
                                <span>Fasting Required:</span>
                                <Badge>
                                  {item.isFastingRequired ? 'Yes' : 'No'}
                                </Badge>
                              </p>
                            </CardDescription>
                          </CardHeader>

                          <CardContent>
                            <Badge variant={'ghost'} className={'line-through'}>
                              {formatCurrency(item.originalPrice)}
                            </Badge>
                            <h5 className={'text-lg font-semibold'}>
                              {formatCurrency(item.discountedPrice)}
                            </h5>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant={'destructive'}
                              className={
                                'w-full rounded-full bg-transparent border-destructive hover:border-destructive hover:bg-destructive/10 text-destructive hover:text-destructive'
                              }
                              onClick={() =>
                                addItem({
                                  item: {
                                    id: item.id,
                                    name: item.name,
                                    price: Number(item.discountedPrice),
                                    quantity: 1,
                                    image:
                                      'https://avatar.vercel.sh/rauchg.png',
                                  },
                                })
                              }
                            >
                              Add <PlusCircle className={'size-4'} />
                            </Button>
                          </CardFooter>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              )
            }}
          </Await>
        </CardContent>
      </Card>
    </section>
  )
}
