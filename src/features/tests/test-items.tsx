import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { FallbackTestItems } from '#/features/common/fallback-loaders'
import { formatCurrency, formattedCategoryName } from '#/lib/utils'
import { useCart } from '#/stores/useCart'
import { IconBasket } from '@tabler/icons-react'
import { Await, getRouteApi } from '@tanstack/react-router'
import NoItems from './no-items'

const routeApi = getRouteApi('/tests')

export default function TestItems() {
  const { primary } = routeApi.useSearch()

  const { addItem } = useCart()

  const { primaryCategories, deferredTests } = routeApi.useLoaderData()

  // approach 1: useAwaited
  // const data = useAwaited({ promise: deferredPromise })

  const findPrimaryCategoryName = (primaryId: string) => {
    const result = primaryCategories.find(
      (category) => category.value === primaryId,
    )
    // return category ? category.label : 'health_checks_essential_tests'
    return result ? result.label : ''
  }
  return (
    <section className={'space-y-4'}>
      <h2
        className={
          'text-center text-base md:text-xl lg:text-2xl xl:text-3xl font-semibold'
        }
      >
        {formattedCategoryName(
          findPrimaryCategoryName(
            primary || '754513c0-4454-4fa0-83fc-c31bfd3c0e17',
          ),
        )}
      </h2>

      <div className={'bg-blue-500/20 p-4 rounded-xl'}>
        <Await promise={deferredTests} fallback={<FallbackTestItems />}>
          {(data) => {
            return (
              <div>
                {data.length <= 0 ? (
                  <NoItems />
                ) : (
                  <div
                    className={
                      'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                    }
                  >
                    {data.map((test) => (
                      <Card key={test.id} className={'py-0 gap-2 sm:gap-4'}>
                        <CardHeader
                          className={
                            'min-h-12 h-auto sm:h-18 bg-primary py-2 text-accent content-center'
                          }
                        >
                          <CardTitle>
                            <h4 className={'text-sm'}>{test.name}</h4>
                          </CardTitle>
                        </CardHeader>

                        <CardContent className={'space-y-1 sm:space-y-2'}>
                          <p className={'space-x-2 text-xs sm:text-sm'}>
                            <span>Fasting Required:</span>
                            <Badge
                              variant={
                                test.isFastingRequired
                                  ? 'destructive'
                                  : 'outline'
                              }
                              className={'px-1 py-0 text-[10px] sm:text-xs sm:px-2 sm:py-0.5'}
                            >
                              {test.isFastingRequired ? 'Yes' : 'No'}
                            </Badge>
                          </p>
                          <span className="block text-xs sm:text-sm">
                            Original Price:{' '}
                            <Badge
                              variant={'outline'}
                              className={
                                'text-muted-foreground line-through font-semibold px-1 py-0 text-[10px] sm:text-xs sm:px-2 sm:py-0.5'
                              }
                            >
                              {formatCurrency(test.originalPrice)}
                            </Badge>
                          </span>{' '}
                          <span className="block text-xs sm:text-sm">
                            Discounted Price:{' '}
                            <span className={'text-base sm:text-xl font-bold text-primary '}>
                              {formatCurrency(test.discountedPrice)}
                            </span>
                          </span>
                        </CardContent>

                        <CardFooter className={'pb-4 pt-0 sm:py-4'}>
                          <Button
                            variant={'destructive'}
                            className={
                              'w-full bg-transparent ring-1 ring-destructive hover:bg-destructive hover:ring-destructive focus-visible:ring-destructive/40 hover:text-accent transition-colors duration-150 ease-in-out'
                            }
                            type="button"
                            onClick={() =>
                              addItem({
                                item: {
                                  id: test.id,
                                  name: test.name,
                                  price: Number(test.discountedPrice),
                                  quantity: 1,
                                  image: 'https://avatar.vercel.sh/rauchg.png',
                                },
                              })
                            }
                          >
                            Add to cart
                            <IconBasket className="size-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )
          }}
        </Await>
      </div>
    </section>
  )
}
