import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Link } from '@tanstack/react-router'
import { PackageOpenIcon } from 'lucide-react'

export default function CTA() {
  return (
    <section>
      <Card
        className={
          'relative aspect-video sm:aspect-video md:aspect-20/9 lg:aspect-24/9 w-full h-full gap-4 ring-0 shadow-none'
        }
      >
        <img
          src="/cta.png"
          alt="cta-bg"
          width={'100%'}
          height={'100%'}
          className={'w-full h-full object-center absolute top-0 left-0'}
        />
        <CardHeader className={'z-10 mt-auto'}>
          <CardTitle>
            <h3
              className={
                'text-base md:text-xl lg:text-2xl xl:text-3xl text-destructive'
              }
            >
              Women's Health, First
            </h3>
          </CardTitle>
          <CardDescription className={'max-w-xs md:max-w-sm'}>
            <p className={'text-xs sm:text-sm md:text-base lg:text-lg'}>
              Comprehensive health screenings designed for every stage of life.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className={'z-10 mb-auto'}>
          <Button type="button" asChild>
            <Link to="/tests" viewTransition>
              <PackageOpenIcon className="size-4" />
              Explore Women's Packages
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
