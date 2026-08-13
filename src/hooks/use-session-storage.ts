import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

const isBrowser =
  typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'

type UseSessionStoragePropsType<T> = {
  key: string
  initialValue?: T
  raw?: boolean
  timeout?: number
}
type UseSessionStorageReturnType<T> = [T, Dispatch<SetStateAction<T>>]

/**
 *
 * @param params as T
 * @returns
 */
const useSessionStorage = <T>({
  key,
  initialValue,
  raw = false,
  timeout,
}: UseSessionStoragePropsType<T>): UseSessionStorageReturnType<T> => {
  const [state, setState] = useState<T>(() => {
    if (!isBrowser) {
      return initialValue as T
    }

    try {
      const sessionStorageValue = sessionStorage.getItem(key)
      if (typeof sessionStorageValue !== 'string') {
        let serializedInitialValue: string

        if (raw) {
          serializedInitialValue = String(initialValue)
        } else {
          serializedInitialValue = JSON.stringify(initialValue)
        }

        sessionStorage.setItem(key, serializedInitialValue)
        return initialValue
      } else {
        if (raw) {
          return sessionStorageValue
        }

        let parsedSessionStorageValue = sessionStorageValue

        if (parsedSessionStorageValue === '') {
          parsedSessionStorageValue = 'null'
        }

        return JSON.parse(parsedSessionStorageValue)
      }
    } catch {
      // If user is in private mode or has storage restriction
      // sessionStorage can throw. JSON.parse and JSON.stringify
      // can throw, too.
      return initialValue
    }
  })

  const defaultTimeout = timeout ?? 24 * 60 * 60 * 1000 // Default to 24 hours

  // Update session storage whenever the state changes
  useEffect(() => {
    if (!isBrowser) {
      return
    }

    try {
      let serializedState: string

      if (raw) {
        serializedState = String(state)
      } else {
        serializedState = JSON.stringify(state)
      }

      sessionStorage.setItem(key, serializedState)
    } catch {
      // If user is in private mode or has storage restriction
      // sessionStorage can throw. Also JSON.stringify can throw.
    }
  }, [key, state, raw])

  // Clear the session storage item after the specified timeout
  useEffect(() => {
    if (!isBrowser) {
      return
    }
    const timeoutId = setTimeout(() => {
      sessionStorage.removeItem(key)
    }, defaultTimeout)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [key, defaultTimeout])

  return [state, setState]
}

// prev version of useSessionStorage
// const useSessionStorage = <T>(
//   key: string,
//   initialValue?: T,
//   raw?: boolean
// ): [T, Dispatch<SetStateAction<T>>] => {
//   const [state, setState] = useState<T>(() => {
//     if (!isBrowser) {
//       return initialValue as T
//     }

//     try {
//       const sessionStorageValue = sessionStorage.getItem(key)
//       if (typeof sessionStorageValue !== "string") {
//         let serializedInitialValue: string

//         if (raw) {
//           serializedInitialValue = String(initialValue)
//         } else {
//           serializedInitialValue = JSON.stringify(initialValue)
//         }

//         sessionStorage.setItem(key, serializedInitialValue)
//         return initialValue
//       } else {
//         if (raw) {
//           return sessionStorageValue
//         }

//         let parsedSessionStorageValue = sessionStorageValue

//         if (parsedSessionStorageValue === "") {
//           parsedSessionStorageValue = "null"
//         }

//         return JSON.parse(parsedSessionStorageValue)
//       }
//     } catch {
//       // If user is in private mode or has storage restriction
//       // sessionStorage can throw. JSON.parse and JSON.stringify
//       // can throw, too.
//       return initialValue
//     }
//   })

//   useEffect(() => {
//     if (!isBrowser) {
//       return
//     }

//     try {
//       let serializedState: string

//       if (raw) {
//         serializedState = String(state)
//       } else {
//         serializedState = JSON.stringify(state)
//       }

//       sessionStorage.setItem(key, serializedState)
//     } catch {
//       // If user is in private mode or has storage restriction
//       // sessionStorage can throw. Also JSON.stringify can throw.
//     }
//   }, [key, state, raw])

//   return [state, setState]
// }

export default useSessionStorage
