import { createFileRoute } from '@tanstack/react-router'
import { auth } from '#/lib/auth'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => {
        console.log('GET API AUTH:', request.url)
        return auth.handler(request)
      },
      POST: async ({ request }) => {
        console.log('POST API AUTH:', request.url)
        try {
          const res = await auth.handler(request)
          console.log('POST RES:', res.status)
          return res
        } catch (e) {
          console.error('POST ERR:', e)
          return new Response('error', { status: 500 })
        }
      },
    },
  },
})
