import { createMiddleware } from '@tanstack/react-start'

import { ensureSession } from './auth.functions'

export const awesomeMiddleware = createMiddleware({ type: 'function' }).server(
  ({ next }) => {
    return next({
      context: {
        isAwesome: Math.random() > 0.5,
      },
    })
  },
)

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await ensureSession()

  return await next({
    context: { user: session.user },
  })
})

// Authorization (Middleware Factory) Example:
// type Permissions = Record<string, string[]>

export function adminAuthorizationMiddleware() {
  return createMiddleware({ type: 'function' })
    .middleware([authMiddleware])
    .server(async ({ next, context }) => {
      if (!['SUPER_ADMIN', 'ADMIN', 'COO', 'PHLEBOTOMIST'].includes(context.user.role)) {
        throw new Error('Forbidden')
      }
      return await next({ context: { user: context.user } })
    })
}

// type fn for serverFns
export const loggingMiddleware = createMiddleware({ type: 'function' })
  .client(({ next }) => {
    console.log('Client-side middleware executed')
    return next({
      sendContext: { some: 123 },
    })
  })
  .server(({ next }) => {
    console.log('Server-side middleware executed')
    return next({
      context: { some: 123 },
    })
  })
