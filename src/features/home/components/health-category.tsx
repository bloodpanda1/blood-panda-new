import { Button } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { IconHandClick } from '@tabler/icons-react'
import { ScrollTextIcon } from 'lucide-react'

import { FallbackHealthCategory } from '#/features/common/fallback-loaders'
import { formattedCategoryName } from '#/lib/utils'
import { Await, getRouteApi, Link } from '@tanstack/react-router'

const baseUrl = import.meta.env.VITE_BETTER_AUTH_URL

const imageBaseUrl = `${baseUrl}/mini-packages`

const routeApi = getRouteApi('/')

export default function HealthCategory() {
  const { defferedMiniPackages } = routeApi.useLoaderData()

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
              Browse Tests by Health Category
            </h2>
          </CardTitle>
          <CardDescription className="row-start-2 sm:row-start-auto">
            <p className={'text-xs sm:text-sm md:text-base lg:text-lg'}>
              Find the right diagnostic tests based on your health concern.
            </p>
          </CardDescription>
          <CardAction
            className={
              'col-start-1 sm:col-start-2 row-start-3 sm:row-start-1 justify-self-start sm:justify-self-end mt-2 sm:mt-0 space-x-2'
            }
          >
            <Button variant={'default'} asChild>
              <Link to="/booking" viewTransition>
                Book Now
                <IconHandClick className={'size-4'} />
              </Link>
            </Button>
            <Button variant={'outline'} asChild>
              <Link
                to="/packages/mini-packages/$miniPackage"
                params={{ miniPackage: 'renal-pack' }}
                viewTransition
              >
                View All
                <ScrollTextIcon className={'size-4'} />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className={'px-0'}>
          <Await
            promise={defferedMiniPackages}
            fallback={<FallbackHealthCategory />}
          >
            {(data) => {
              return (
                <CardContent
                  className={
                    'px-0 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400/50 scrollbar-track-transparent flex gap-4 snap-x snap-mandatory scroll-smooth overflow-x-scroll scroll-fade-x snap-center'
                  }
                >
                  {data.map((item) => {
                    const slug = item.name.replace(/_/g, '-').toLowerCase()
                    return (
                      <Link
                        to={'/packages/mini-packages/$miniPackage'}
                        params={{ miniPackage: slug }}
                        className={
                          'space-y-2 text-center py-4 snap-center snap-always snap-mandatory block'
                        }
                        key={item.id}
                      >
                        <Card
                          className={
                            'border-0 bg-destructive/10 shadow-md ring-2 ring-transparent hover:ring-destructive/50 size-48 mx-auto transition-all duration-300 ease-in-out rounded-full'
                          }
                        >
                          <CardContent
                            className={'p-0 w-full h-full rounded-full'}
                          >
                            <img
                              src={`${imageBaseUrl}${item.cover}`}
                              alt={item.name}
                              width={'100%'}
                              height={'100%'}
                              className={
                                'rounded-full object-contain w-full h-full mix-blend-color-burn'
                              }
                            />
                          </CardContent>
                        </Card>
                        <CardDescription>
                          <p className={'text-base font-semibold'}>
                            {formattedCategoryName(item.name)}
                          </p>
                        </CardDescription>
                      </Link>
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
