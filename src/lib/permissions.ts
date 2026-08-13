import { createAccessControl } from 'better-auth/plugins/access'
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access'

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const baseStatement = {
  ...defaultStatements,
  booking: ['create', 'share', 'update', 'delete'],
} as const

export type Permissions = typeof baseStatement

/*
type Permissions = {
    booking: readonly ["create", "share", "update", "delete"];
    readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "set-email", "get", "update"];
    readonly session: readonly ["list", "revoke", "delete"];
}
type Permissions = {
    readonly booking: readonly ["create", "share", "update", "delete"];
    readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "set-email", "get", "update"];
    readonly session: readonly ["list", "revoke", "delete"];
}
*/

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
})

export const ADMIN = ac.newRole({
  booking: ['create', 'update', 'delete', 'share'],
  ...adminAc.statements,
})

export const MODERATOR = ac.newRole({
  ...defaultStatements,
  booking: ['create', 'update', 'delete'],
  user: ['ban'],
})
