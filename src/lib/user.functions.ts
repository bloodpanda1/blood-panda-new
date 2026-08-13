import { prisma } from '#/db'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

export const createUserFn = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      name: z.string().min(1),
      email: z.email(),
    }),
  )
  .handler(async ({ data }) => {
    // Here you would typically call your user creation logic, e.g., saving to a database

    try {
      const newUser = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
        },
      })

      return newUser
    } catch (error) {
      throw new Error('Failed to create user')
    }
  })
