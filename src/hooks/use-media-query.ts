import * as React from 'react'

// const MOBILE_BREAKPOINT = 768

type Props = {
  query: `min-width: ${number}px` | `max-width: ${number}px`
}

export function useMediaQuery(props: Props) {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(${props.query})`)
    const onChange = () => {
      setMatches(mql.matches)
    }
    mql.addEventListener('change', onChange)
    setMatches(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [props.query])

  return matches

  // const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  // React.useEffect(() => {
  //   const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  //   const onChange = () => {
  //     setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
  //   }
  //   mql.addEventListener('change', onChange)
  //   setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
  //   return () => mql.removeEventListener('change', onChange)
  // }, [])

  // return !!isMobile
}

// usage:

// const isMobile = useMediaQuery({ query: `max-width: 768px` })
