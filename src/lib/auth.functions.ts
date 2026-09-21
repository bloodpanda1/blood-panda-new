import { auth } from '@/lib/auth'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { adminAuthorizationMiddleware } from './middleware'

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    return session
  },
)
export const ensureSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) {
      throw new Error('Unauthorized')
    }
    return session
  },
)
export const getAdminSession = createServerFn({ method: 'GET' })
  .middleware([adminAuthorizationMiddleware()])
  .handler(async ({ context }) => {
    if (!['SUPER_ADMIN', 'ADMIN'].includes(context.user.role)) {
      throw new Error('Forbidden')
    }

    return context.user
  })

export const getStaffSession = createServerFn({ method: 'GET' })
  .middleware([adminAuthorizationMiddleware()])
  .handler(async ({ context }) => {
    if (!['SUPER_ADMIN', 'ADMIN', 'COO', 'PHLEBOTOMIST'].includes(context.user.role)) {
      throw new Error('Forbidden')
    }

    return context.user
  })
