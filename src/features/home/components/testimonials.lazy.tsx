import { IconStarFilled } from '@tabler/icons-react'

// Import Swiper React components
import { A11y, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/a11y'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
// import "swiper/css/keyboard"
// import "swiper/css/navigation"
// import "swiper/css/thumbs"

import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { testimonies } from '#/constants'

const isDev = import.meta.env.DEV

export default function Testimonials() {
  const doubleItems = [...testimonies, ...testimonies, ...testimonies]

  return (
    <section>
      <Card
        className={'rounded-none border-0 bg-transparent shadow-none ring-0'}
      >
        <CardHeader>
          <CardTitle>
            <h3
              className={
                'text-center text-base md:text-xl lg:text-2xl xl:text-3xl'
              }
            >
              What Our Patients Say
            </h3>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Swiper
            modules={[A11y, Autoplay]}
            grabCursor={true}
            navigation={true}
            a11y={{ enabled: true }}
            loop={true}
            rewind={true}
            autoplay={
              isDev ? undefined : { delay: 3000, pauseOnMouseEnter: true }
            }
            spaceBetween={30}
            slidesPerView={3}
            // onSlideChange={() => console.log('slide change')}
            // onSwiper={(swiper) => console.log(swiper)}
            breakpoints={{
              '320': {
                spaceBetween: 25,
                slidesPerView: 1.5,
              },
              '480': {
                spaceBetween: 25,
                slidesPerView: 1.9,
              },
              '576': {
                spaceBetween: 25,
                slidesPerView: 2.1,
              },
              '640': {
                spaceBetween: 25,
                slidesPerView: 2.5,
              },
              '720': {
                spaceBetween: 25,
                slidesPerView: 3.2,
              },
              '1190': {
                spaceBetween: 25,
                slidesPerView: 4.1,
              },
              // '1236': {
              //   spaceBetween: 25,
              //   slidesPerView: 6.1,
              // },
              '1280': {
                spaceBetween: 25,
                slidesPerView: 4.5,
              },
              // '1366': {
              //   spaceBetween: 25,
              //   slidesPerView: 6.5,
              // },
              // '1440': {
              //   spaceBetween: 25,
              //   slidesPerView: 6.5,
              // },
              // '1536': {
              //   spaceBetween: 25,
              //   slidesPerView: 6.5,
              // },
            }}
          >
            {doubleItems.map((item) => {
              return (
                <SwiperSlide key={crypto.randomUUID()} className={'py-4'}>
                  <Card className={'h-full w-full'}>
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

                    <CardContent>{item.msg}</CardContent>

                    <CardFooter className={'mt-auto gap-2'}>
                      <Avatar size="lg">
                        <AvatarImage
                          src={item.author.avatar}
                          alt={item.author.name}
                        />
                        <AvatarFallback
                          className={'bg-destructive text-background'}
                        >
                          {item.author.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <CardDescription className={'flex flex-col gap-px'}>
                        <span>{item.author.name}</span>
                        <span>{item.author.location}</span>
                      </CardDescription>
                    </CardFooter>
                  </Card>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </CardContent>
      </Card>
    </section>
  )
}
