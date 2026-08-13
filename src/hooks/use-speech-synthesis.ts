import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type UseSpeechSynthesis = {
  isSupported: boolean
  isSpeaking: boolean
  error: string | null

  speak: (
    input: string | HTMLElement,
    options?: {
      rate?: number
      pitch?: number
      volume?: number
      voiceURI?: string
    }
  ) => void
  stop: () => void
  pause: () => void
  resume: () => void
}

// const supportsSpeechSynthesis = (): boolean => {
//   if (typeof window === "undefined") return false
//   const hasUtterance = typeof window.SpeechSynthesisUtterance !== "undefined"
//   const hasSynth =
//     typeof window.speechSynthesis !== "undefined" &&
//     typeof window.speechSynthesis.speak === "function"
//   return Boolean(hasUtterance && hasSynth)
// }

export function useSpeechSynthesis(): UseSpeechSynthesis {
  const isSupported = useMemo(() => {
    if (typeof window === "undefined") return false
    const hasUtterance = typeof window.SpeechSynthesisUtterance !== "undefined"
    const hasSynth =
      typeof window.speechSynthesis !== "undefined" &&
      typeof window.speechSynthesis.speak === "function"
    return Boolean(hasUtterance && hasSynth)
  }, [])

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const extractText = useCallback((input: string | HTMLElement) => {
    if (typeof input === "string") return input
    // Prefer readable text; remove script/style
    const clone = input.cloneNode(true) as HTMLElement
    clone
      .querySelectorAll("script, style, noscript")
      .forEach((el) => el.remove())
    return (clone.textContent || "").replace(/\s+/g, " ").trim()
  }, [])

  const stop = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    utteranceRef.current = null
    setIsSpeaking(false)
  }, [isSupported])

  const pause = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.pause()
  }, [isSupported])

  const resume = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.resume()
  }, [isSupported])

  const speak = useCallback(
    (
      input: string | HTMLElement,
      options?: {
        rate?: number
        pitch?: number
        volume?: number
        voiceURI?: string
      }
    ) => {
      if (!isSupported) {
        setError("Speech synthesis is not supported in this browser.")
        return
      }

      const text = extractText(input)
      if (!text) {
        setError("No readable text found to speak.")
        return
      }

      setError(null)

      // Stop anything currently speaking
      window.speechSynthesis.cancel()

      const u = new SpeechSynthesisUtterance(text)

      if (typeof options?.rate === "number") u.rate = options.rate
      if (typeof options?.pitch === "number") u.pitch = options.pitch
      if (typeof options?.volume === "number") u.volume = options.volume

      if (options?.voiceURI) {
        const voices = window.speechSynthesis.getVoices?.() || []
        const v = voices.find((vv) => vv.voiceURI === options.voiceURI)
        if (v) u.voice = v
      }

      u.onstart = () => setIsSpeaking(true)
      u.onend = () => {
        setIsSpeaking(false)
        utteranceRef.current = null
      }
      u.onerror = () => {
        setIsSpeaking(false)
        utteranceRef.current = null
        setError("Speech synthesis failed while speaking.")
      }

      utteranceRef.current = u
      window.speechSynthesis.speak(u)
    },
    [extractText, isSupported]
  )

  // Some browsers load voices asynchronously
  useEffect(() => {
    if (!isSupported) return
    const synth = window.speechSynthesis

    const handleVoicesChanged = () => {
      // No-op here; keeping hook stable and letting speak pick voices when available.
    }

    // // @ts-expect-error voiceschanged exists in browsers that support it
    synth.addEventListener?.("voiceschanged", handleVoicesChanged)

    return () => {
      // // @ts-expect-error voiceschanged exists in browsers that support it
      synth.removeEventListener?.("voiceschanged", handleVoicesChanged)
    }
  }, [isSupported])

  // Cleanup on unmount
  useEffect(() => stop, [stop])

  return { isSupported, isSpeaking, error, speak, stop, pause, resume }
}
