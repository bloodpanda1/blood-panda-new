import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Skeleton } from '#/components/ui/skeleton'

export function BaseLoader() {
  return (
    <CardContent
      className={
        'scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400/50 scrollbar-track-transparent flex gap-4 snap-x snap-mandatory scroll-smooth scroll-fade-x p-4 overflow-x-auto'
      }
    >
      {Array.from({ length: 12 }).map((_, loadingIdx) => (
        <Card className={'w-full min-w-sm snap-start'} key={loadingIdx}>
          <CardHeader>
            <CardTitle>
              <Skeleton className={'h-4 w-32'} />
            </CardTitle>
            <CardDescription>
              <Skeleton className={'h-3 w-24'} />
            </CardDescription>
          </CardHeader>
          <CardContent className={'space-y-2'}>
            <Skeleton className={'h-4 w-16'} />
            <Skeleton className={'h-5 w-20'} />
          </CardContent>
          <CardFooter>
            <Skeleton className={'h-8 w-full'} />
          </CardFooter>
        </Card>
      ))}
    </CardContent>
  )
}

export function FallbackTestimonials() {
  return <BaseLoader />
}
export function FallbackIndividials() {
  return <BaseLoader />
}
export function FallbackHealthCategories() {
  return <BaseLoader />
}
export function FallbackPopularCategory() {
  return (
    <CardContent
      className={
        'px-0 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400/50 scrollbar-track-transparent flex gap-4 snap-x snap-mandatory scroll-smooth overflow-x-scroll scroll-fade-x snap-center'
      }
    >
      {Array.from({ length: 5 }).map((_, idx) => {
        return (
          <Card
            key={idx}
            className={'w-full min-w-xs md:min-w-sm snap-center my-4 pt-6 pb-0'}
          >
            <CardHeader>
              <CardTitle className={'flex items-center gap-2'}>
                <Skeleton className={'size-10'} />
                <Skeleton className={'h-4 w-32'} />
              </CardTitle>
            </CardHeader>

            <CardContent className={'space-y-2'}>
              <Skeleton className={'h-3 w-16'} />
              <Skeleton className={'h-3 w-20'} />
              <Skeleton className={'h-3 w-16'} />
            </CardContent>
            <CardFooter
              className={
                'relative flex items-center justify-between space-y-4 border-t-2 border-border/50 py-4'
              }
            >
              <Skeleton className={'h-5 w-20'} />
              <Skeleton className={'h-8 w-16'} />
            </CardFooter>
          </Card>
        )
      })}
    </CardContent>
  )
}
export function FallbackHealthCategory() {
  return (
    <CardContent
      className={
        'px-0 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400/50 scrollbar-track-transparent flex gap-4 snap-x snap-mandatory scroll-smooth overflow-x-scroll scroll-fade-x snap-center'
      }
    >
      {Array.from({ length: 7 }).map((_, idx) => {
        return (
          <div key={idx} className={'space-y-3 text-center py-4'}>
            <Card
              className={
                'border-0 bg-destructive/10 shadow-md ring-2 ring-transparent hover:ring-destructive/50 rounded-full size-48 mx-auto'
              }
            >
              <CardContent className={'px-0 w-full h-full'}>
                <Skeleton className={'size-36 mx-auto rounded-full'} />
              </CardContent>
            </Card>
            <CardDescription>
              <Skeleton className={'h-3 w-32 mx-auto'} />
            </CardDescription>
          </div>
        )
      })}
    </CardContent>
  )
}

export function FallbackTestItems() {
  return (
    <div
      className={
        'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
      }
    >
      {[...Array(5)].map((_, testIdx) => (
        <Card key={testIdx} className={'py-0 gap-4'}>
          <CardHeader
            className={'h-18 bg-primary py-2 text-accent content-center'}
          >
            <CardTitle>
              <Skeleton className={'h-4 w-32'} />
            </CardTitle>
          </CardHeader>

          <CardContent className={'space-y-4'}>
            <span className="block">
              Original Price: <Skeleton className={'h-4 w-16'} />
            </span>{' '}
            <span className="block">
              Discounted Price: <Skeleton className={'h-4 w-16'} />
            </span>
          </CardContent>

          <CardFooter className={'py-4'}>
            <Skeleton className={'h-10 w-full'} />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
