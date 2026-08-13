import { createFileRoute, Link } from '@tanstack/react-router'
import { allPosts } from 'content-collections'

import { Badge } from '#/components/ui/badge'
import { buttonVariants } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { seo } from '#/constants/seo-details'
import { Image } from '@unpic/react'
import { format } from 'date-fns'
import { ArrowRightIcon } from 'lucide-react'

export const Route = createFileRoute('/blogs/')({
  head: () => seo({ path: '/blogs/' }),
  component: RouteComponent,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
  wrapInSuspense: true,
  codeSplitGroupings: [
    ['component', 'pendingComponent', 'errorComponent', 'notFoundComponent'],
  ],
})

function RouteComponent() {
  return (
    <main className={'mx-auto max-w-(--breakpoint-xl) space-y-8 px-4 py-12'}>
      <Card
        className={'space-y-8 rounded-none bg-transparent shadow-none ring-0'}
      >
        <CardHeader className={'rounded-none bg-accent py-6'}>
          <CardTitle>
            <h1 className={'text-center text-3xl font-semibold'}>
              Health & fitness insights for a healthier you
            </h1>
          </CardTitle>
        </CardHeader>

        <CardContent className={'grid grid-cols-3 gap-4'}>
          {allPosts.map((post) => (
            <Card key={post._meta.path} className={'gap-4 pt-0 pb-2'}>
              <CardContent className={'scroll-fade-b px-0'}>
                {/* <img
                  src={post.image}
                  alt={post.title}
                  width={'100%'}
                  height={'100%'}
                  className={'h-full w-full'}
                /> */}
                <Image
                  src={post.image}
                  alt={post.title}
                  layout="constrained"
                  height={500}
                  width={500}
                  className={'h-full w-full'}
                />
              </CardContent>

              <CardHeader className={'rounded-none'}>
                <CardDescription>
                  <Badge variant={'outline'}>
                    {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
                  </Badge>
                </CardDescription>
                <CardTitle>
                  <h2 className={'text-2xl font-medium'}>{post.title}</h2>
                </CardTitle>

                <CardDescription>
                  <p className={'line-clamp-3'}>{post.summary}</p>
                </CardDescription>

                <CardDescription
                  className={'flex flex-wrap items-center gap-2'}
                >
                  {post.categories.map((category) => (
                    <Badge key={crypto.randomUUID()}>{category}</Badge>
                  ))}
                </CardDescription>
              </CardHeader>
              <CardFooter className={'flex justify-end rounded-none'}>
                <Link
                  // to={`/blogs/${post._meta.path}`}
                  to={'/blogs/$blogId'}
                  params={{ blogId: post._meta.path }}
                  className={buttonVariants({ variant: 'link' })}
                  viewTransition
                >
                  Read more <ArrowRightIcon className={'size-4'} />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </main>
  )
}

function ErrorComponent() {
  return (
    <div>
      <p>
        Oops! Something went wrong while loading the blogs. Please try again
        later.
      </p>
    </div>
  )
}

function PendingComponent() {
  return (
    <div>
      <p>Loading blogs...</p>
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div>
      <p>Blogs not found.</p>
    </div>
  )
}
