import { getClientEnv } from '#/config/client-env'
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { Auth } from './auth'
import { ac, ADMIN, MODERATOR, USER } from './permissions'

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: getClientEnv().VITE_BETTER_AUTH_URL,
  plugins: [
    adminClient({
      ac,
      roles: {
        ADMIN: ADMIN,
        MODERATOR: MODERATOR,
        USER: USER,
      },
    }),
    inferAdditionalFields<Auth>(),
  ],
})

export const { signIn, signUp, signOut, useSession, getSession } = authClient

export type ClientSession = ReturnType<typeof useSession>['data']
