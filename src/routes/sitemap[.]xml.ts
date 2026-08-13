// src/routes/sitemap[.]xml.ts
import type { FileRouteTypes } from '#/routeTree.gen'
import { createFileRoute } from '@tanstack/react-router'
import { allPosts } from 'content-collections'

const BASE_URL = import.meta.env.VITE_BETTER_AUTH_URL as string

type Path = FileRouteTypes['fullPaths']

type LinkOption = {
  name: string
  to: Path
  href?: string
  frequency:
    'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

const links: LinkOption[] = [
  {
    name: 'Home',
    to: '/',
    href: `${BASE_URL}`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'Tests',
    to: '/tests',
    href: `${BASE_URL}/tests`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'Silver Pack',
    to: '/packages/$package',
    href: `${BASE_URL}/packages/silver`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'Gold Pack',
    to: '/packages/$package',
    href: `${BASE_URL}/packages/gold`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'Diamond Pack',
    to: '/packages/$package',
    href: `${BASE_URL}/packages/diamond`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'Platinum Pack',
    to: '/packages/$package',
    href: `${BASE_URL}/packages/platinum`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'Signature Pack',
    to: '/packages/$package',
    href: `${BASE_URL}/packages/signature`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'Renal Pack',
    to: '/packages/mini-packages/$miniPackage',
    href: `${BASE_URL}/packages/mini-packages/renal-pack`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'Obesity Pack',
    to: '/packages/mini-packages/$miniPackage',
    href: `${BASE_URL}/packages/mini-packages/obesity-pack`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'Liver Pack',
    to: '/packages/mini-packages/$miniPackage',
    href: `${BASE_URL}/packages/mini-packages/liver-pack`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'Hypertension Pack',
    to: '/packages/mini-packages/$miniPackage',
    href: `${BASE_URL}/packages/mini-packages/hypertension-pack`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'Gut Pack',
    to: '/packages/mini-packages/$miniPackage',
    href: `${BASE_URL}/packages/mini-packages/gut-pack`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'Fever Pack',
    to: '/packages/mini-packages/$miniPackage',
    href: `${BASE_URL}/packages/mini-packages/fever-pack`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'Diabetic Pack',
    to: '/packages/mini-packages/$miniPackage',
    href: `${BASE_URL}/packages/mini-packages/diabetic-pack`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'Cardiac Pack',
    to: '/packages/mini-packages/$miniPackage',
    href: `${BASE_URL}/packages/mini-packages/cardiac-pack`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'Bone Pack',
    to: '/packages/mini-packages/$miniPackage',
    href: `${BASE_URL}/packages/mini-packages/bone-pack`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'home',
    to: '/blogs/',
    href: `${BASE_URL}/blogs`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'home',
    to: '/contact-us',
    href: `${BASE_URL}/contact-us`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'home',
    to: '/privacy-policy',
    href: `${BASE_URL}/privacy-policy`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'home',
    to: '/refund-policy',
    href: `${BASE_URL}/refund-policy`,
    frequency: 'daily',
    priority: 1.0,
  },
  {
    name: 'home',
    to: '/terms-and-condition',
    href: `${BASE_URL}/terms-and-condition`,
    frequency: 'daily',
    priority: 1.0,
  },
]

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const posts = allPosts

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

              ${links.map((link) => {
                // if to have $ in it then we need to replace it with the actual value from href
                // const to = link.to.includes('$')
                //   ? link.href || link.to
                //   : link.to
                return `
                <url>
                  <loc>${link.href}</loc>
                  <changefreq>${link.frequency}</changefreq>
                  <priority>${link.priority.toString()}</priority>
                </url>
              `
              })}
              
              ${posts
                .map(
                  (post) => `
                        <url>
                          <loc>${BASE_URL}/blogs/${post._meta.path}</loc>
                          <lastmod>${post.createdAt}</lastmod>
                          <changefreq>weekly</changefreq>
                        </url>`,
                )
                .join('')}
            </urlset>
        `

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml',
          },
        })
      },
    },
  },
})
