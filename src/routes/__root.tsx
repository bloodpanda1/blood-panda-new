import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useMatches,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import Footer from '../components/Footer'
import Header from '../components/Header'

import '../bones/registry'

import StoreDevtools from '../lib/demo-store-devtools'

import PostHogProvider from '../integrations/posthog/provider'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

import { ThemeProvider } from '#/components/theme-provider'
import { Toaster } from '#/components/ui/sonner'
import { TooltipProvider } from '#/components/ui/tooltip'
import type { TRPCRouter } from '#/integrations/trpc/router'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    showNavbar?: boolean
  }
}

interface MyRouterContext {
  queryClient: QueryClient

  trpc: TRPCOptionsProxy<TRPCRouter>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Blood Tests & Lab Tests in Bengaluru | BloodPanda',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: RootNotFound,
  errorComponent: RootError,
  codeSplitGroupings: [['component', 'notFoundComponent', 'errorComponent']],
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const showNavbar = useMatches({
    select: (matches) =>
      !matches.some((m) => m.staticData.showNavbar === false),
  })
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased [wrap:anywhere] selection:bg-destructive/10 selection:text-destructive">
        <ThemeProvider defaultTheme="light" storageKey="theme">
          <PostHogProvider>
            <TooltipProvider>
              {showNavbar ? (
                <>
                  <Header />
                  {children}
                  <Footer />
                </>
              ) : (
                <>{children}</>
              )}
            </TooltipProvider>
            <Toaster
              position="top-center"
              closeButton
              richColors
              theme="system"
            />
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                StoreDevtools,
                TanStackQueryDevtools,
              ]}
            />
          </PostHogProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}

function RootNotFound() {
  return (
    <main className="mx-auto max-w-(--breakpoint-lg) space-y-8 px-4 py-12">
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </main>
  )
}

function RootError({ error }: { error: Error }) {
  return (
    <main className="mx-auto max-w-(--breakpoint-lg) space-y-8 px-4 py-12">
      <h1>500 - Internal Server Error</h1>
      <p>{error.message}</p>
    </main>
  )
}
