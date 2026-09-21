// @ts-nocheck
import { prisma } from '#/db'
import { betterAuth } from 'better-auth'

import { admin as adminPlugin, openAPI } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { Resend } from 'resend'

import { getServerEnv } from '#/config/server-env'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { ac, SUPER_ADMIN, COO, PHLEBOTOMIST, USER } from './permissions'

const isDev = process.env.NODE_ENV !== 'production'

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

  accountLinking: {
    enabled: true,
    trustedProviders: ['google'],
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true, // automatically sign in the user after registration
    sendResetPassword: async ({ user, url }, request) => {
      const resend = new Resend(getServerEnv().RESEND_API_KEY)
      await resend.emails.send({
        from: 'BloodPanda Admin <onboarding@resend.dev>', // Use a verified domain in production
        to: user.email,
        subject: `Reset your password for BloodPanda`,
        html: `
          <h2>BloodPanda</h2>
          <p>You have requested a password reset or are onboarding.</p>
          <p>Click the link below to set your password:</p>
          <p><a href="${url}" style="padding:10px 20px; background:#e11d48; color:white; border-radius:5px; text-decoration:none;">Set Password</a></p>
          <br/>
          <p>Or copy this link to your browser:</p>
          <p>${url}</p>
        `,
      })
    },
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
      phone: {
        type: 'string',
        input: true,
        required: false,
      },
      address: {
        type: 'string',
        input: true,
        required: false,
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
        SUPER_ADMIN,
        COO,
        PHLEBOTOMIST,
        USER,
      },
    }),
    tanstackStartCookies(),
    openAPI(),
  ],
})

export type Auth = typeof auth

export type ServerSession = (typeof auth.$Infer)['Session']
