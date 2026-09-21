import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { auth } from '#/lib/auth'

export type Context = {
  user?: (typeof auth.$Infer.Session)["user"] | null
  session?: (typeof auth.$Infer.Session)["session"] | null
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    },
  })
})

export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  const role = (ctx.user as any).role
  if (!['SUPER_ADMIN', 'ADMIN', 'COO', 'PHLEBOTOMIST'].includes(role)) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' })
  }
  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    },
  })
})

export const superAdminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  const role = (ctx.user as any).role
  if (role !== 'SUPER_ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Super Admin access required' })
  }
  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    },
  })
})

export const phlebotomistProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  const role = (ctx.user as any).role
  if (role !== 'PHLEBOTOMIST' && role !== 'SUPER_ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Phlebotomist access required' })
  }
  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    },
  })
})

export const cooProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  const role = (ctx.user as any).role
  if (role !== 'COO' && role !== 'SUPER_ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'COO access required' })
  }
  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    },
  })
})
