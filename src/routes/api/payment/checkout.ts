import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/payment/checkout')({
  server: {
    handlers: {
      GET: () => {
        return new Response('GET REQUEST NOT ALLOWED', { status: 200 })
      },
      POST: async ({ request }) => {
        const headers = request.headers
        const body = await request.json()
        console.log('Request Headers:', headers)
        console.log('Request Body:', body)
        return new Response('success', { status: 200 })
      },
    },
  },
})
