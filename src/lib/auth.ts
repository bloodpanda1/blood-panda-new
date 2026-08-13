import { prisma } from '#/db'
import { betterAuth } from 'better-auth'
import { admin as adminPlugin, openAPI } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { getServerEnv } from '#/config/server-env'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { ac, ADMIN, MODERATOR, USER } from './permissions'

const isDev = import.meta.env.DEV

export const auth = betterAuth({
  appName: 'Blood Panda',
  advanced: {
    database: {
      generateId: 'uuid',
    },
    useSecureCookies: isDev ? false : true,
  },
  baseURL: getServerEnv().BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
    transaction: true,
  }),

  experimental: { joins: true },
  // ...other options
  emailAndPassword: {
    enabled: true,
    autoSignIn: true, // automatically sign in the user after registration
  },
  socialProviders: {
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID as string,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    // },
    google: {
      accessType: 'offline',
      clientId: getServerEnv().GOOGLE_CLIENT_ID,
      clientSecret: getServerEnv().GOOGLE_CLIENT_SECRET,
      prompt: 'select_account consent',
      mapProfileToUser: (profile) => {
        return {
          name: profile.name || profile.given_name || profile.family_name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified,
          role: 'USER',
        }
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        input: false,
        defaultValue: 'USER',
      },
      prescriptions: {
        type: 'string[]',
        input: false,
        required: false,
        defaultValue: [],
      },
      testReports: {
        type: 'string[]',
        input: false,
        required: false,
        defaultValue: [],
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Modify the user object before it is created
          return {
            data: {
              ...user,
              role: 'USER',
            },
          }
        },
      },
    },
  },

  session: {
    storeSessionInDatabase: true,
    preserveSessionInDatabase: true,
    cookieCache: {
      maxAge: 60 * 60 * 24, // 1 day
      enabled: true,
      // refreshCache: {
      //   updateAge: 60, // Refresh when 60 seconds remain before expiry
      // },
    },
  },

  trustedOrigins: [
    getServerEnv().BETTER_AUTH_URL,
    'https://blood-panda-v1.vercel.app',
  ],
  plugins: [
    adminPlugin({
      ac,
      roles: {
        ADMIN: ADMIN,
        MODERATOR: MODERATOR,
        USER: USER,
      },
    }),
    tanstackStartCookies(),
    openAPI(),
  ],
})

export type Auth = typeof auth

export type ServerSession = (typeof auth.$Infer)['Session']
