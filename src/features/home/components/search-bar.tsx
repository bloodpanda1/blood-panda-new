import HeroSearch from './hero-search'

export default function SearchBar() {
  return (
    <section
      className="mx-auto max-w-(--breakpoint-md) space-y-8 px-4 mt-105 sm:mt-55 md:mt-48 lg:mt-32 xl:mt-32"
      // className={'space-y-4 mt-105 sm:mt-55 md:mt-48 lg:mt-32 xl:mt-32'}
    >
      <HeroSearch />
    </section>
  )
}
