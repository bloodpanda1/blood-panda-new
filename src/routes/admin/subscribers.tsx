import { Spinner } from '#/components/ui/spinner'
import { seo } from '#/constants/seo-details'
import { useTRPC } from '#/integrations/trpc/react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/admin/subscribers')({
  head: () => seo({ path: '/admin/subscribers' }),
  component: RouteComponent,
  pendingComponent: PendingComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  wrapInSuspense: true,
  codeSplitGroupings: [
    ['component', 'pendingComponent', 'errorComponent', 'notFoundComponent'],
  ],
})

function RouteComponent() {
  const trpc = useTRPC()
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center h-[calc(100dvh-16rem)]">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 mb-6">
        <span className="text-4xl">🚀</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Subscribers Management</h1>
      <p className="text-lg text-muted-foreground mt-4 max-w-md">
        This feature is <strong>Coming Soon</strong>. You will be able to manage newsletter subscribers, send mass emails, and view engagement metrics here.
      </p>
    </div>
  )
}

function PendingComponent() {
  return (
    <div className="mx-auto max-w-(--breakpoint-lg) flex flex-col items-center justify-center h-[calc(100dvh-16rem)]">
      <Spinner className="size-6" />
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div className="mx-auto max-w-(--breakpoint-lg) space-y-8 px-4 py-12">
      <h2 className="text-center text-3xl font-bold">Page Not Found</h2>
    </div>
  )
}

function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter()
  return (
    <div className="error p-6">
      <h2>An error occurred: {error.name}</h2>
      <p>{error.message}</p>
      <Button onClick={() => router.navigate({ to: '/', search: {} })}>Go Home</Button>
    </div>
  )
}

