// https://www.prisma.io/docs/orm/v6/prisma-client/type-safety#type-utilities

import type { prisma } from '#/db'
import type { Prisma } from '#/generated/prisma/client'

export type SelectUser = Prisma.Result<
  typeof prisma.user,
  'select',
  'findUniqueOrThrow'
>
export type InsertUser = Prisma.Args<typeof prisma.user, 'create'>['data']

export type UpdateuUser = Prisma.Args<typeof prisma.user, 'update'>['data']

export type SelectPost = Prisma.Result<
  typeof prisma.post,
  'select',
  'findUniqueOrThrow'
>

export type InsertPost = Prisma.Args<typeof prisma.post, 'create'>['data']

export type UpdatePost = Prisma.Args<typeof prisma.post, 'update'>['data']
