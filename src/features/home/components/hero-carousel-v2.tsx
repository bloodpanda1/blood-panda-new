import { useEffect, useState } from 'react'
import AutoPlay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '#/components/ui/carousel'

import { Card } from '#/components/ui/card'

// import { Progress } from '#/components/ui/progress'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '#/components/ui/item'
import { heroStats } from '#/constants'
import { cn } from '#/lib/utils'
import { ClientOnly } from '@tanstack/react-router'
import { FlaskConicalIcon, PackageOpenIcon } from 'lucide-react'
import OdometerExample from './odometer-example'


const heroSlides = [
  {
    id: crypto.randomUUID(),
    bg: '/carousel/1.png',
  },
  {
    id: crypto.randomUUID(),
    bg: '/carousel/2.png',
  },
  {
    id: crypto.randomUUID(),
    bg: '/carousel/3.png',
  },
  {
    id: crypto.randomUUID(),
    bg: '/carousel/4.png',
  },
]

export default function HeroCarouselV2() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section className="relative mt-4 w-full overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
        }}
        plugins={[
          AutoPlay({
            delay: 5000,
          }),
        ]}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-0">
          {heroSlides.map((item, index) => (
            <CarouselItem key={item.id} className="pl-0">
              <div className="w-full p-1 outline-none">
                <Card className="group/card relative overflow-hidden border-0 p-0">
                  <img
                    src={item.bg}
                    alt={`Slide ${index + 1}`}
                    width={800}
                    height={800}
                    className="w-full h-auto object-cover pointer-events-none select-none"
                    draggable={false}
                  />
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Pagination Bars */}
      <div className="flex justify-center gap-2 pt-4 pb-2 w-full px-6 z-20">
        {heroSlides.map((_, index) => (
          <button
            type="button"
            key={index}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 cursor-pointer block appearance-none border-none p-0 m-0",
              index === current ? "w-8 bg-[#0C1F70]" : "w-4 bg-[#0C1F70]/30"
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export function HeroStats() {
  return (
    <div className="z-10 w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {heroStats.map((stat) => {
          if (stat.description === 'Rating') {
            return (
              <Item key={stat.id} variant={'outline'} className="justify-center sm:justify-start px-4 sm:px-6">
                <ItemMedia
                  variant="image"
                  className={cn(
                    'my-auto p-0.5 rounded-full',
                    `${stat.bgColor}`,
                  )}
                >
                  {stat.icon}
                </ItemMedia>
                <ItemContent className="flex-none">
                  <ItemTitle className={'font-semibold text-base'}>
                    <ClientOnly
                      fallback={
                        <span className={'font-semibold! text-base!'}>
                          4.9 /5
                        </span>
                      }
                    >
                      <OdometerExample
                        target={'odometer-target-2'}
                        value={4.9}
                        duration={2.3}
                        lastDigitDelay={0}
                        float={true}
                        suffix={' /5'}
                        className={'font-semibold! text-base!'}
                      />
                    </ClientOnly>
                  </ItemTitle>
                  <ItemDescription className={'font-medium'}>
                    {stat.description}
                  </ItemDescription>
                </ItemContent>
              </Item>
            )
          }

          if (stat.description === 'Samples Collected') {
            return (
              <Item key={stat.id} variant={'outline'} className="justify-center sm:justify-start px-4 sm:px-6">
                <ItemMedia
                  variant="image"
                  className={cn(
                    'my-auto p-0.5 rounded-full',
                    `${stat.bgColor}`,
                  )}
                >
                  {stat.icon}
                </ItemMedia>
                <ItemContent className="flex-none">
                  <ItemTitle className={'font-semibold text-base gap-0'}>
                    <ClientOnly
                      fallback={
                        <span className={'font-semibold! text-base!'}>
                          10,000+
                        </span>
                      }
                    >
                      <OdometerExample
                        target={'odometer-target'}
                        value={10000}
                        duration={2.3}
                        lastDigitDelay={0}
                        className={'font-semibold! text-base!'}
                        suffix={undefined}
                      />
                      {''}+
                    </ClientOnly>
                  </ItemTitle>
                  <ItemDescription className={'font-medium'}>
                    {stat.description}
                  </ItemDescription>
                </ItemContent>
              </Item>
            )
          }

          return (
            <Item key={stat.id} variant={'outline'} className="justify-center sm:justify-start px-4 sm:px-6">
              <ItemMedia
                variant="image"
                className={cn('my-auto p-0.5 rounded-full', `${stat.bgColor}`)}
              >
                {stat.icon}
              </ItemMedia>
              <ItemContent className="flex-none">
                <ItemTitle className={'font-semibold text-base'}>
                  {stat.stat}
                </ItemTitle>
                <ItemDescription className={'font-medium'}>
                  {stat.description}
                </ItemDescription>
              </ItemContent>
            </Item>
          )
        })}
      </div>
    </div>
  )
}
