import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { seo } from '#/constants/seo-details'
import { formatPoliciesDate } from '#/lib/utils'
import { MDXContent } from '@content-collections/mdx/react'
import { createFileRoute } from '@tanstack/react-router'
import { termsAndCondition } from 'content-collections'

export const Route = createFileRoute('/terms-and-condition')({
  head: () => {
    return seo({
      path: '/terms-and-condition',
      description: termsAndCondition.summary,
    })
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
      <Card>
        <CardHeader className={'text-center'}>
          <CardTitle className={'text-3xl font-semibold text-center'}>
            Terms and Conditions
          </CardTitle>
          <CardDescription>
            Last updated: {formatPoliciesDate(new Date().toISOString())}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <article className="prose prose-sm max-w-none md:prose-base lg:prose-lg dark:prose-invert prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-h6:text-base prose-hr:my-4 prose-hr:border-t-2">
            <MDXContent code={termsAndCondition.mdx} />
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
        Oops! Something went wrong while loading the terms-and-condition policy.
        Please try again later.
      </p>
    </div>
  )
}

function PendingComponent() {
  return (
    <div>
      <p>Loading terms-and-condition policy...</p>
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div>
      <p>Privacy terms-and-condition not found.</p>
    </div>
  )
}
