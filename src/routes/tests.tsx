import { Spinner } from '#/components/ui/spinner'
import { seo } from '#/constants/seo-details'
import FilterItems from '#/features/tests/filter-items'
import SearchItems from '#/features/tests/search-items'
import TestItems from '#/features/tests/test-items'
import {
  getPrimaryCategoryList,
  loadTestsBasedOnSearch,
  secondaryCategoryList,
} from '#/lib/tests.functions'
import { selectCategorySchema } from '#/lib/validators/tests-schema'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Image } from '@unpic/react'

export const Route = createFileRoute('/tests')({
  head: () => seo({ path: '/tests' }),
  validateSearch: selectCategorySchema,
  // Declare which search params the loader depends on
  loaderDeps: ({ search: { primary, secondary, q } }) => ({
    primary,
    secondary,
    q,
  }),
  loader: async ({ deps: { primary, secondary, q } }) => {
    const primaryCategories = await getPrimaryCategoryList()
    const secondaryCategories = secondaryCategoryList()

    const primaryCategoryExists = primaryCategories.some(
      (category) => category.value === primary,
    )
    if (primary && !primaryCategoryExists) {
      throw new Error(`Invalid primary category: ${primary}`)
    }

    const secondaryCategoryExists = await secondaryCategories.then(
      (categories) =>
        categories.some((category) => category.value === secondary),
    )
    if (secondary && !secondaryCategoryExists) {
      throw new Error(`Invalid secondary category: ${secondary}`)
    }

    const loadedTests = loadTestsBasedOnSearch({
      data: {
        primary,
        secondary,
        q,
      },
    })

    return {
      primaryCategories,
      deferredPromise: secondaryCategories,
      deferredTests: loadedTests,
    }
  },
  wrapInSuspense: true,
  component: RouteComponent,
  errorComponent: ({ error }) => ErrorComponent({ error }),
  notFoundComponent: NotFoundComponent,
  pendingComponent: PendingComponent,
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

function RouteComponent() {
  return (
    <main className={'mx-auto max-w-(--breakpoint-xl) space-y-8 px-4 py-12'}>
      <section className={'flex flex-col lg:block'}>
        {/* Mobile text, only visible on small screens */}
        <div
          className={
            'flex flex-col items-start justify-center gap-2 px-4 py-4 md:px-8 lg:hidden'
          }
        >
          <h1
            className={
              'text-xl sm:text-2xl md:text-3xl font-bold text-primary'
            }
          >
            Blood Test at Home in Bangalore
          </h1>
          <p
            className={
              'text-sm sm:text-base text-foreground'
            }
          >
            With Blood Panda, book a blood or urine lab test at home & get the
            fastest blood sample collection from home from a Certified lab
            near you in Bangalore.
          </p>
        </div>

        {/* The Original Container (Text hidden on mobile, image full opacity) */}
        <div
          className={
            'relative aspect-14/9 h-full w-full sm:aspect-video md:aspect-20/9 lg:aspect-26/9'
          }
        >
          <Image
            src="/tests-bg.jpg"
            alt="tests background"
            layout="constrained"
            width={1280}
            height={932}
            className={
              'absolute top-0 left-0 -z-10 h-full w-full object-contain object-bottom-right opacity-100 lg:opacity-100'
            }
            priority={true}
          />
          <div
            className={
              'hidden lg:flex h-full w-full lg:max-w-lg flex-col items-start justify-center gap-2 lg:gap-4 px-4 md:px-8 lg:px-12 bg-transparent'
            }
          >
            <h1
              className={
                'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary'
              }
            >
              Blood Test at Home in Bangalore
            </h1>
            <p
              className={
                'text-sm sm:text-base lg:text-lg text-foreground lg:text-muted-foreground'
              }
            >
              With Blood Panda, book a blood or urine lab test at home & get the
              fastest blood sample collection from home from a Certified lab
              near you in Bangalore.
            </p>
          </div>
        </div>
      </section>

      <SearchItems />

      <FilterItems />

      <TestItems />
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
