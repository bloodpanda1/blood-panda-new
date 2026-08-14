import { capitalizeFirstLetter, formatSlug } from '#/lib/utils'
import type { FileRouteTypes } from '#/routeTree.gen'

const BASE_URL = import.meta.env.VITE_BETTER_AUTH_URL as string

type Path = FileRouteTypes['fullPaths']

type SeoDetails = {
  path: Path
  slug?: string
  title?: string
  description?: string
  keywords?: string
  image?: string
  type?: string
  url?: string
}

export function seo(props: SeoDetails) {
  const { path, slug, title, description, keywords } = props

  const titlePath =
    path === '/' ? 'Home' : `${capitalizeFirstLetter(path.split('/')[1])}`

  // few cases
  // 1. /blogs/ => need to remove trailing slash and add canonical url as /blogs
  // 2. /blogs/$blogId/ => need to remove $blogId and add canonical url as /blogs/post-2
  // 3. /packages/$package => need to remove $package and add canonical url as /packages/package-name
  // 4. /packages/mini-packages/$miniPackage => need to remove $miniPackage and add canonical url as /packages/mini-packages/mini-package-name

  // extra take care /blogs/$blogId/ extra trailing slash means /blogs/$blogId/ => /blogs/post-2

  // Clean the path by removing any trailing slash first
  const cleanedPath = path.replace(/\/$/, '')

  // Check if the cleaned path contains a dynamic parameter (starts with $)
  const canonicalPath = cleanedPath.includes('$')
    ? cleanedPath.substring(0, cleanedPath.lastIndexOf('/')) +
      (slug ? `/${slug}` : '')
    : cleanedPath

  // console.log('canonicalPath', canonicalPath)

  const defaultTitle = `Blood & Lab Tests in Bengaluru | BloodPanda - ${titlePath} ${slug ? `| ${formatSlug(slug)}` : ''}`

  const defaultDescription =
    'Book home blood tests in Bengaluru with BloodPanda. NABL-accredited partner labs, doorstep sample collection, affordable health packages, and fast, accurate reports online.'

  const defaultKeywords =
    'BloodPanda, BloodPanda Diagnostics, Blood Test, Home Blood Test, Home Sample Collection, Diagnostic Lab, Health Checkup, Full Body Checkup, Lab Tests, Blood Tests, NABL Lab, Medical Laboratory, Preventive Health Checkup, Diagnostic Services, Home Diagnostics, Online Blood Test Booking, Bengaluru Diagnostics, Bangalore Blood Tests, Affordable Health Packages, Accurate Test Results, Health Screening, Lab Test Packages, Blood Test at Home, Medical Testing Services, Health Monitoring, Wellness Checkup, Blood Test Reports Online, Home Health Services, Diagnostic Testing in Bengaluru'

  return {
    meta: [
      {
        title: `Blood & Lab Tests in Bengaluru | BloodPanda - ${titlePath} ${slug ? `| ${formatSlug(slug)}` : ''}`,
      },
      {
        name: 'description',
        content: description || defaultDescription,
      },
      {
        name: 'keywords',
        content: keywords || defaultKeywords,
      },
      // Open Graph
      {
        property: 'og:title',
        content: title || defaultTitle,
      },
      {
        property: 'og:description',
        content: description || defaultDescription,
      },
      { property: 'og:image', content: '/packages/packages-bg.png' },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `${BASE_URL}${path}` },
      // Twitter Card
      {
        name: 'twitter:card',
        content:
          'Blood Tests & Lab Tests in Bengaluru | Home Sample Collection | BloodPanda',
      },
      { name: 'twitter:url', content: `${BASE_URL}${path}` },
      {
        name: 'twitter:title',
        content: title || defaultTitle,
      },
      {
        name: 'twitter:description',
        content: description || defaultDescription,
      },
      {
        name: 'twitter:image',
        content: '/packages/packages-bg.png',
      },
      {
        name: 'google-site-verification',
        content: '4uPUnRNCMEh9V7rLYPCGf3pznyY8Dk5EVsbRrxYpw28',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: `${BASE_URL}${canonicalPath}`,
        // href: `https://myapp.com/posts/${params.postId}`,
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicons/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicons/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '64x64',
        href: '/favicons/favicon-64x64.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '128x128',
        href: '/favicons/favicon-128x128.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '256x256',
        href: '/favicons/favicon-256x256.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicons/apple-touch-icon.png',
      },
      {
        name: 'msapplication-TileImage',
        content: '/favicons/mstile-144x144.png',
      },
      {
        rel: 'shortcut icon',
        href: '/favicons/favicon.ico',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }
}
