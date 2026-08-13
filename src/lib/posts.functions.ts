// Protecting Server Functions
// Use ensureSession helper to protect server functions:

import { createServerFn } from '@tanstack/react-start'
import { ensureSession } from './auth.functions'

export const createPost = createServerFn({ method: 'POST' })
  .validator((data: { title: string }) => data)
  .handler(async ({ data }) => {
    const session = await ensureSession()
    // const post = await db.posts.create({
    //   title: data.title,
    //   authorId: session.user.id,
    // })

    // return post as of now
    return { title: data.title, authorId: session.user.id }
  })
