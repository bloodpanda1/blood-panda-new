import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { seo } from '#/constants/seo-details'
import { formatPoliciesDate } from '#/lib/utils'
import { MDXContent } from '@content-collections/mdx/react'
import { createFileRoute } from '@tanstack/react-router'
import { privacyPolicy } from 'content-collections'

export const Route = createFileRoute('/privacy-policy')({
  head: () => {
    return seo({ path: '/privacy-policy', description: privacyPolicy.summary })
  },
  wrapInSuspense: true,
  component: RouteComponent,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
  codeSplitGroupings: [
    ['component', 'pendingComponent', 'errorComponent', 'notFoundComponent'],
  ],
})

function RouteComponent() {
  return (
    <main className={'mx-auto max-w-(--breakpoint-lg) space-y-8 px-4 py-12'}>
      <Card className={''}>
        <CardHeader className={'text-center'}>
          <CardTitle className={'text-3xl font-semibold text-center'}>
            Privacy Policy
          </CardTitle>
          <CardDescription>
            Last updated: {formatPoliciesDate(new Date().toISOString())}
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent>
          <article className="prose prose-sm max-w-none md:prose-base lg:prose-lg dark:prose-invert prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-h6:text-base prose-hr:my-4 prose-hr:border-t-2">
            <MDXContent code={privacyPolicy.mdx} />
          </article>
        </CardContent>
      </Card>
    </main>
  )
}

function ErrorComponent() {
  return (
    <div>
      <p>
        Oops! Something went wrong while loading the privacy policy. Please try
        again later.
      </p>
    </div>
  )
}

function PendingComponent() {
  return (
    <div>
      <p>Loading privacy policy...</p>
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div>
      <p>Privacy policy not found.</p>
    </div>
  )
}
