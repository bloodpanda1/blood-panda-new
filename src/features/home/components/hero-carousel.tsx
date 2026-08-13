import AutoPlay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect, useState } from 'react'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '#/components/ui/carousel'

// import { buttonVariants } from '#/components/ui/button'
import { buttonVariants } from '#/components/ui/button'
import type { CarouselApi } from '#/components/ui/carousel'
import { Progress } from '#/components/ui/progress'
import { Link } from '@tanstack/react-router'
import { FlaskConicalIcon, PackageOpenIcon } from 'lucide-react'
import HeroSearch from './hero-search'
// import { Link } from '@tanstack/react-router'
// import { FlaskConicalIcon, PackageOpenIcon } from 'lucide-react'
// import HeroSearch from './hero-search'

const isDev = import.meta.env.DEV

const heroSlides = [
  {
    id: crypto.randomUUID(),
    bg: '/hero-1.jpg',
  },
  {
    id: crypto.randomUUID(),
    bg: '/hero-2.jpg',
  },
  {
    id: crypto.randomUUID(),
    bg: '/hero-3.jpg',
  },
]

export default function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      skipSnaps: true,
      axis: 'x',
      dragFree: true,
      dragThreshold: 10,
    },
    [
      ...(!isDev
        ? [
            AutoPlay({
              delay: 5000,
              stopOnInteraction: false,
            }),
          ]
        : []),
    ],
  )

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1
        if (newProgress >= 100 && !isDev) {
          if (api.selectedScrollSnap() === api.scrollSnapList().length - 1) {
            api.scrollTo(0)
          } else {
            api.scrollNext()
          }
          return 0
        }
        return newProgress
      })
    }, 1200)

    return () => clearInterval(interval)
  }, [api])

  return (
    <Carousel
      ref={emblaRef}
      setApi={setApi}
      className="w-full h-full overflow-x-hidden"
    >
      <CarouselContent>
        {heroSlides.map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card
                className="group/card relative aspect-square sm:aspect-video md:aspect-14/9 lg:aspect-20/9 overflow-hidden border-0 p-0"
                // className="group/card relative aspect-square xs:aspect-15/9 sm:aspect-video md:aspect-20/9 lg:aspect-26/9 overflow-hidden border-0 p-0"
              >
                <img
                  // src={`https://picsum.photos/800/800?grayscale&random=${index + 45}`}
                  // alt={`Slide ${index + 1}`}
                  src={heroSlides[index].bg}
                  alt={`Slide ${index + 1}`}
                  width={800}
                  height={800}
                  className="absolute inset-0 size-full scale-100 transition-transform duration-500 ease-in-out group-hover/card:scale-105"
                />
                {/* Background fade effects */}
                {/* <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" /> */}

                {/* Content */}
                {/* <div className="absolute inset-0 top-auto flex flex-col justify-end bg-black/20 p-4">
                  <h3 className="text-xl font-bold text-white">
                    Slide {index + 1}
                  </h3>
                  <p className="text-sm text-white/90">
                    Feature description for slide {index + 1}.
                  </p>
                </div> */}

                <div
                  className={
                    'absolute top-0 left-0 h-full bg-linear-to-r from-black/80 to-transparent backdrop-blur-2x scroll-fade-e w-auto md:w-6/12'
                  }
                >
                  <Card className="bg-background/10 backdrop-blur-xs border-none ring-0 shadow-none border-0 h-full justify-center scroll-fade-e gap-4">
                    <CardHeader>
                      <CardDescription>
                        <p
                          className={'text-destructive font-semibold text-base'}
                        >
                          Bangalore's Trusted Partner for Diagnostic Care
                        </p>
                      </CardDescription>
                      <CardTitle>
                        <h1
                          className={
                            'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold'
                          }
                        >
                          <span className={'text-background'}>
                            Your Health.
                          </span>{' '}
                          <span className={'text-background'}>
                            Our Priority
                          </span>
                        </h1>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={'space-y-4'}>
                      <CardDescription>
                        <p
                          className={
                            'text-sm md:text-base font-normal text-background'
                          }
                        >
                          With Blood Panda ,book trusted diagnostic tests and
                          health packages from the comfort of your home. Fast
                          sample collection, accurate reports, and expert care
                          across Bangalore.
                        </p>
                      </CardDescription>

                      <HeroSearch />

                      <CardAction className={'space-x-2 justify-self-start'}>
                        <Link
                          to="/booking"
                          viewTransition
                          className={buttonVariants({
                            className:
                              'bg-destructive! text-accent hover:bg-destructive/90',
                          })}
                        >
                          <FlaskConicalIcon className="size-4" /> Book a Test
                        </Link>
                        <Link
                          to="/tests"
                          viewTransition
                          className={buttonVariants({
                            variant: 'outline',
                            className:
                              'border-blue-600! border-2 text-blue-600 hover:bg-blue-600 hover:text-accent',
                          })}
                        >
                          <PackageOpenIcon className="size-4" />
                          Explore Packages
                        </Link>
                      </CardAction>
                    </CardContent>
                  </Card>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Dots Navigation */}
      {/* <div className="flex justify-center gap-2 py-3 w-full bg-red-50">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={cn(
              'h-2 cursor-pointer rounded-full transition-all duration-500 ease-in-out',
              index === current
                ? 'bg-primary w-full opacity-100'
                : 'bg-muted-foreground w-2 opacity-30 hover:opacity-50',
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}
      {/* Progress Bar */}
      <div className="flex justify-center gap-2 py-3 w-full px-6">
        {Array.from({ length: count }).map((_, index) => (
          <Progress
            key={index}
            value={index === current ? progress : 0}
            className="h-1 w-full bg-muted-foreground! text-background!"
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </Carousel>
  )
}
