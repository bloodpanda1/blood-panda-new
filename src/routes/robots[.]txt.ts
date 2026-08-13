// src/routes/robots[.]txt.ts
import { createFileRoute } from '@tanstack/react-router'

const BASE_URL = import.meta.env.VITE_BETTER_AUTH_URL as string

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async () => {
        const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml`

        return new Response(robots, {
          headers: {
            'Content-Type': 'text/plain',
          },
        })
      },
    },
  },
})
