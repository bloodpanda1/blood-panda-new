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
    <div className="z-10 w-full my-4 lg:my-6">
      <div className="w-full bg-background rounded-2xl border shadow-sm py-4 lg:py-6 overflow-hidden">
        <div className="grid grid-cols-4 items-stretch divide-x divide-border/50">
          {heroStats.map((stat) => {
            const isRating = stat.description === 'Customer Rating'
            const isSamples = stat.description === 'Samples Collected'

            return (
              <div
                key={stat.id}
                className={cn(
                  'flex flex-col justify-start items-center text-center px-1 sm:px-4 py-2'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center size-10 md:size-14 lg:size-16 rounded-full shrink-0 mb-1 lg:mb-2',
                    stat.bgColor
                  )}
                >
                  <div className="[&>svg]:size-5 lg:[&>svg]:size-7">
                    {stat.icon}
                  </div>
                </div>

                <div className="flex flex-col gap-0.5 lg:gap-1 items-center">
                  <h3 className="text-[11px] sm:text-base lg:text-[22px] font-bold text-foreground flex items-center justify-center">
                    {isRating ? (
                      <ClientOnly
                        fallback={<span>4.9/5</span>}
                      >
                        <OdometerExample
                          target={'odometer-target-2'}
                          value={4.9}
                          duration={2.3}
                          lastDigitDelay={0}
                          float={true}
                          suffix={'/5'}
                          className="font-bold! text-[11px]! sm:text-base! lg:text-[22px]!"
                        />
                      </ClientOnly>
                    ) : isSamples ? (
                      <ClientOnly
                        fallback={<span>10,000+</span>}
                      >
                        <OdometerExample
                          target={'odometer-target'}
                          value={10000}
                          duration={2.3}
                          lastDigitDelay={0}
                          suffix={undefined}
                          className="font-bold! text-[11px]! sm:text-base! lg:text-[22px]!"
                        />
                        <span>+</span>
                      </ClientOnly>
                    ) : (
                      stat.stat
                    )}
                  </h3>
                  <p className="text-[9px] sm:text-sm lg:text-[15px] font-medium text-muted-foreground whitespace-pre-line leading-tight lg:leading-snug">
                    {stat.description.includes(' ')
                      ? stat.description.replace(' ', '\n')
                      : stat.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
