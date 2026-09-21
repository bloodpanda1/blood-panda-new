import { createAccessControl } from 'better-auth/plugins/access'
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access'

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const baseStatement = {
  ...defaultStatements,
  booking: ['create', 'share', 'update', 'delete'],
  report: ['submit', 'view'],
} as const

export type Permissions = typeof baseStatement

export const ac = createAccessControl(baseStatement)

export const USER = ac.newRole({
  booking: ['create'],
  user: [
    'create',
    'list',
    'delete',
    'set-password',
    'set-email',
    'get',
    'update',
  ],
  report: ['view'],
})

export const PHLEBOTOMIST = ac.newRole({
  booking: ['create', 'update', 'share'],
  report: ['view'],
})

export const COO = ac.newRole({
  ...defaultStatements,
  booking: ['create', 'update', 'delete', 'share'],
  user: ['ban'],
  report: ['submit', 'view'],
})

export const SUPER_ADMIN = ac.newRole({
  ...adminAc.statements,
  booking: ['create', 'update', 'delete', 'share'],
  report: ['submit', 'view'],
})
