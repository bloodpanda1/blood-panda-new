// @ts-nocheck
import { getClientEnv } from '#/config/client-env'
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { ac, SUPER_ADMIN, COO, PHLEBOTOMIST, USER } from './permissions'

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: getClientEnv().VITE_BETTER_AUTH_URL,
  plugins: [
    adminClient({
      ac,
      roles: {
        SUPER_ADMIN,
        COO,
        PHLEBOTOMIST,
        USER,
      },
    }),
    inferAdditionalFields(),
  ],
})

export const { signIn, signUp, signOut, useSession, getSession } = authClient

export type ClientSession = ReturnType<typeof useSession>['data']
