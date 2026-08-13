import { Button } from '#/components/ui/button'
import { FieldDescription } from '#/components/ui/field'
import { Spinner } from '#/components/ui/spinner'
import { getSession } from '#/lib/auth.functions'
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouter,
} from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  staticData: { showNavbar: false },
  beforeLoad: async ({ location }) => {
    const session = await getSession()
    if (session) {
      throw redirect({
        to: '/',
        search: { redirect: location.href },
        headers: { 'x-redirect-reason': 'already-logged-in' },
      })
    }
    return null
  },
  component: AuthLayout,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
  wrapInSuspense: true,
  codeSplitGroupings: [
    ['component', 'pendingComponent', 'errorComponent', 'notFoundComponent'],
  ],
})

function AuthLayout() {
  return (
    <main
      className={
        'mx-auto my-auto flex h-dvh max-w-(--breakpoint-xl) flex-col justify-center space-y-4 px-4'
      }
    >
      <div className="">
        <Outlet />
      </div>

      <FieldDescription className="text-center">
        By clicking continue, you agree to our{' '}
        <Link to="/terms-and-condition" viewTransition>
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy-policy" viewTransition>
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </main>
  )
}

function PendingComponent() {
  return (
    <div
      className={
        'mx-auto max-w-(--breakpoint-lg) flex flex-col items-center justify-center h-[calc(100dvh-16rem)]'
      }
    >
      <Spinner className={'size-6'} />
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div className={'mx-auto max-w-(--breakpoint-lg) space-y-8 px-4 py-12'}>
      <h2 className={'text-center text-3xl font-bold'}>Page Not Found</h2>
    </div>
  )
}

function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter()
  return (
    <div className="error">
      <h2>An error occurred: {error.name}</h2>
      <p>{error.message}</p>
      <Button onClick={() => router.navigate({ to: '/', search: {} })}>
        Go Home
      </Button>
    </div>
  )
}
