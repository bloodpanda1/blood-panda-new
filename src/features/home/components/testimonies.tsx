import type { EmblaCarouselType } from 'embla-carousel'
import type { CarouselApi } from '@/components/ui/carousel'
import { Badge } from '#/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '#/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { useCallback, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '#/components/ui/item'
import { testimonies } from '#/constants'
import { IconStarFilled } from '@tabler/icons-react'
import AutoPlay from 'embla-carousel-autoplay'

type UseDotButtonType = {
  selectedIndex: number
  scrollSnaps: number[]
  onDotButtonClick: (index: number) => void
}

export const useDotButton = (
  emblaApi: EmblaCarouselType | undefined,
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi],
  )

  const onInit = useCallback((emblaCarouselApi: EmblaCarouselType) => {
    setScrollSnaps(emblaCarouselApi.scrollSnapList())
  }, [])

  const onSelect = useCallback((emblaCarouselApi: EmblaCarouselType) => {
    setSelectedIndex(emblaCarouselApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    onSelect(emblaApi)

    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onInit, onSelect])

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  }
}

export default function Testimonies() {
  const [api, setApi] = useState<CarouselApi>()
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api)

  return (
    <div>
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
          dragFree: true,
        }}
        plugins={[AutoPlay({ delay: 3000 })]}
        className="w-full"
      >
        <CarouselContent>
          {testimonies.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-1/1 sm:basis-1.5/3 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Card>
                  <CardHeader>
                    <CardDescription
                      className={'flex flex-row items-center gap-0.5'}
                    >
                      <IconStarFilled
                        className={'size-3 fill-amber-300 stroke-amber-300'}
                      />
                      <IconStarFilled
                        className={'size-3 fill-amber-300 stroke-amber-300'}
                      />
                      <IconStarFilled
                        className={'size-3 fill-amber-300 stroke-amber-300'}
                      />
                      <IconStarFilled
                        className={'size-3 fill-amber-300 stroke-amber-300'}
                      />
                      <IconStarFilled
                        className={'size-3 fill-amber-300 stroke-amber-300'}
                      />
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex items-center p-6 sm:h-28 md:h-24 lg:h-12">
                    &quot;{item.msg}&quot;
                  </CardContent>

                  <CardFooter>
                    <Item
                      variant="outline"
                      size={'sm'}
                      className="p-2 border-0 rounded-none"
                    >
                      <ItemMedia variant={'image'}>
                        <Avatar>
                          <AvatarImage
                            src={item.author.avatar}
                            alt={item.author.name}
                            className="grayscale"
                          />
                          <AvatarFallback>
                            {item.author.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{item.author.name}</ItemTitle>
                        <ItemDescription>
                          {item.author.location}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center items-center gap-2 py-4">
          {scrollSnaps.map((_, index) => (
            <Badge
              variant={selectedIndex === index ? 'default' : 'outline'}
              onClick={() => onDotButtonClick(index)}
              key={index}
              className="w-2 h-2 hover:cursor-pointer"
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}
