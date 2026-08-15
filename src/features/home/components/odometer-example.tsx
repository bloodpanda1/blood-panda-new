import { cn } from '#/lib/utils'
import { CountUp } from 'countup.js'
import { Odometer } from 'odometer_countup'
import { useEffect, useRef } from 'react'

type OdometerExampleProps = {
  target: string
  value: number
  duration?: number
  lastDigitDelay?: number
  float?: boolean
  prefix?: string
  suffix?: string
  className?: string
}

export default function OdometerExample(props: OdometerExampleProps) {
  const {
    target = 'odometer-target',
    value = 100,
    duration = 2.3,
    lastDigitDelay = 0,
    float = false,
    prefix = '',
    suffix = '',
    className: c = '',
  } = props

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let counter: CountUp | null = null;

    if (ref.current) {
      // remove the existing fallback text
      ref.current.textContent = ''
      counter = new CountUp(ref.current, value, {
        plugin: new Odometer({ duration, lastDigitDelay }),
        duration: 3.0,
        useEasing: true,
        useIndianSeparators: true,
        decimalPlaces: float ? 1 : 0,
        decimal: float ? '.' : '',
        // startVal: value,
        useGrouping: true,
        autoAnimate: true,
        autoAnimateDelay: 1000, // delay before starting the animation
        autoAnimateOnce: false, // repeat the animation
        prefix: prefix,
        suffix: suffix,
        separator: float ? undefined : ',',
      })
      counter.start()
    }

    return () => {
      if (counter) {
        // Pause/stop the animation loop to prevent multiple instances
        // running simultaneously on the same DOM element.
        counter.pauseResume();
        counter.reset();
      }
    }
  }, [value, duration, lastDigitDelay, float, prefix, suffix])

  return (
    <span
      ref={ref}
      id={target}
      className={cn(c ? c : '', 'text-4xl font-semibold')}
    ></span>
  )
}
