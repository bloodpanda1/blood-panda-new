import { Button } from '#/components/ui/button'
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar'
import { Spinner } from '#/components/ui/spinner'
import { AppSidebar } from '#/features/admin/components/app-sidebar'
import { SiteHeader } from '#/features/admin/components/site-header'
import { getAdminSession } from '#/lib/auth.functions'
import {
  createFileRoute,
  Outlet,
  redirect,
  useRouter,
} from '@tanstack/react-router'

export const Route = createFileRoute('/_admin')({
  staticData: { showNavbar: false },
  // beforeLoad: async ({ location }) => {
  //   const session = await getSession()
  //   if (!session) {
  //     throw redirect({
  //       to: '/login',
  //       search: { redirect: location.href },
  //     })
  //   }
  //   return { user: session.user }
  // },
  beforeLoad: async ({ location }) => {
    try {
      await getAdminSession() // throws 'Forbidden' if no permission
    } catch (e) {
      throw redirect({
        to: '/',
        search: { redirect: location.href },
      })
    }
  },
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
    <div>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
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
