import { buttonVariants } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { FlaskConicalIcon, PackageOpenIcon } from 'lucide-react'

import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import HeroSearch from './hero-search'
// import HeroStats from './hero-stats'

export default function Hero() {
  return (
    <section
      className={
        'grid grid-cols-1 lg:grid-cols-2 place-items-center gap-4 relative aspect-auto sm:aspect-14/9 md:aspect-video lg:aspect-20/9 xl:aspect-20/9 mt-4'
      }
    >
      <div className={'w-full h-full absolute top-0 left-0'}>
        {/* <img
          src="/hero-bg.png"
          alt="hero-bg"
          width={'100%'}
          height={'100%'}
          className={'w-full h-full object-cover rounded-3xl'}
        /> */}
        <Image
          src="/hero-bg.png"
          alt="hero-bg"
          layout="constrained"
          width={1469}
          height={691}
          className={'w-full h-full rounded-3xl'}
          priority={true}
        />
      </div>
      <Card className="z-10 bg-background/10 backdrop-blur-xs border-none ring-0 shadow-none border-0 h-full justify-center scroll-fade-e gap-4">
        <CardHeader>
          <CardDescription>
            <p className={'text-destructive font-semibold text-base'}>
              Bangalore's Trusted Partner for Diagnostic Care
            </p>
          </CardDescription>
          <CardTitle>
            <h1
              className={
                'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold'
              }
            >
              <span className={'text-foreground'}>Your Health.</span>{' '}
              <span className={'text-primary'}>Our Priority</span>
            </h1>
          </CardTitle>
        </CardHeader>
        <CardContent className={'space-y-4'}>
          <CardDescription>
            <p
              className={
                'text-sm md:text-base font-normal text-foreground lg:text-muted-foreground'
              }
            >
              With Blood Panda ,book trusted diagnostic tests and health
              packages from the comfort of your home. Fast sample collection,
              accurate reports, and expert care across Bangalore.
            </p>
          </CardDescription>

          <HeroSearch />

          <CardAction className={'space-x-2 justify-self-start space-y-2'}>
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

      <div className={'z-10 hidden lg:block'}>&nbsp;</div>

      {/* <HeroStats /> */}
    </section>
  )
}
