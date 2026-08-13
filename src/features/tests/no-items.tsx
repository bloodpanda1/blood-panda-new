export default function NoItems() {
  return (
    <p
      className={
        'text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-center'
      }
    >
      No tests found for the selected categories. <br /> Please select different
      categories to see available tests.
    </p>
  )
}
