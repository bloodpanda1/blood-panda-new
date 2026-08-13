import { Spinner } from '#/components/ui/spinner'
import { seo } from '#/constants/seo-details'
// import { FallbackTestimonials } from '#/features/common/fallback-loaders'
import Blogs from '#/features/home/components/blogs'
import BookingSteps from '#/features/home/components/booking-steps'
import CTA from '#/features/home/components/cta'
import FAQs from '#/features/home/components/faqs'
import Features from '#/features/home/components/features'
import HealthCategory from '#/features/home/components/health-category'
import Hero from '#/features/home/components/hero'
// import HeroCarousel from '#/features/home/components/hero-carousel'
import HeroCarouselV2 from '#/features/home/components/hero-carousel-v2'
import HowItWorks from '#/features/home/components/how-it-works'
import IndividualCategory from '#/features/home/components/individual-category'
import PopularPackages from '#/features/home/components/popular-packages'
import SearchBar from '#/features/home/components/search-bar'
// import Testimonials from '#/features/home/components/testimonials.lazy'
import Testimonies from '#/features/home/components/testimonies'
import WhyChooseUs from '#/features/home/components/why-choose-us'
import { getMiniPackages } from '#/lib/mini-package.functions'
import { getAllPackages } from '#/lib/package.functions'
import { getAllTests } from '#/lib/tests.functions'
import { createFileRoute, useRouter } from '@tanstack/react-router'
// const BASE_URL = import.meta.env.VITE_BETTER_AUTH_URL as string

export const Route = createFileRoute('/')({
  head: () => seo({ path: '/' }),
  loader: () => {
    const deferredTests = getAllTests({ data: { limit: 12 } })
    // const defferedPackages = import('#/features/home/components/popular-packages.lazy')
    const defferedPackages = getAllPackages()

    const defferedMiniPackages = getMiniPackages()

    return {
      deferredTests,
      defferedPackages,
      defferedMiniPackages,
    }
  },
  component: App,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
  wrapInSuspense: true,
  codeSplitGroupings: [
    [
      'loader',
      'component',
      'pendingComponent',
      'errorComponent',
      'notFoundComponent',
    ],
  ],
})

function App() {
  return (
    <main className={'mx-auto max-w-(--breakpoint-xl) space-y-8 px-4'}>
      <Hero />
      <HeroCarouselV2 />
      {/* <HeroCarousel /> */}
      <SearchBar />

      <Features />

      <PopularPackages />

      <HealthCategory />

      <IndividualCategory />

      <BookingSteps />
      <WhyChooseUs />
      <Testimonies />
      {/* <ClientOnly fallback={<FallbackTestimonials />}>
        <Testimonials />
      </ClientOnly> */}
      <HowItWorks />
      <Blogs />
      <CTA />
      <FAQs />
    </main>
  )
}

function PendingComponent() {
  return (
    <div
      className={
        'mx-auto max-w-(--breakpoint-lg) flex flex-col items-center justify-center h-dvh'
      }
    >
      <Spinner className={'size-6'} />
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div className={'mx-auto max-w-(--breakpoint-lg) space-y-8 px-4 py-12'}>
      Tests Not Found
    </div>
  )
}

function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter()
  return (
    <div className="error">
      <h2>Invalid Search Parameters</h2>
      <p>{error.message}</p>
      <button onClick={() => router.navigate({ to: '/tests', search: {} })}>
        Reset Search
      </button>
    </div>
  )
}
