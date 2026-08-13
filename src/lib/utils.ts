import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { addMinutes, format, isBefore, isEqual, parse } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: string) {
  return new Intl.NumberFormat('en-In', {
    currency: 'inr',
    style: 'currency',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(Number(value))
}

export function formattedDate(value: string) {
  return new Intl.DateTimeFormat('en-In', {
    dateStyle: 'medium',
  }).format(Number(value))
}

export function formatPoliciesDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date(dateString))
}

export function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatSlug(params: string) {
  // some-text -> Some Text
  return params
    .split('-')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ')
}

export function formattedCategoryName(value: string) {
  // e.g. pregnancy_womens-health-tests
  // "_" remove it and use " ",
  // "-" remove it and use "&",
  // capitalize each word
  return value
    .replace(/_/g, ' ')
    .replace(/-/g, ' & ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * find last item in array
 * ```const arr = [1,2,3,4];```
 * ```
 * arr.map((item,idx)=>{
    const isLastItem = arr.lastIndexOf(arr.length) === idx
    console.log({isLastItem});
    return item;
  }) 
 * ```
 */

/**
 * Disable past dates, weekends, holidays and last timeslot of the day in a calendar component
 * @param date
 * @returns boolean
 */
export function disablePastDates(date: Date) {
  // 1st check if the date is in the past
  if (date < new Date()) {
    return true
  }

  // 2nd check if the date is a weekend (Saturday or Sunday)
  const day = date.getDay()
  if (day === 0 || day === 6) {
    return true
  }

  // 3rd check if the date is a holiday (for example, Jan 1st, Dec 25th)
  const holidays = [
    new Date(date.getFullYear(), 0, 1), // Jan 1st
    new Date(date.getFullYear(), 11, 25), // Dec 25th
  ]
  if (holidays.some((holiday) => holiday.getTime() === date.getTime())) {
    return true
  }

  // pick the last timeslot of the day, if the date is today and the current time is after 6:01pm then disable the date, otherwise allow it to be selected
  const now = new Date()
  if (date.toDateString() === now.toDateString()) {
    // const lastSlotTime = new Date(
    //   date.getFullYear(),
    //   date.getMonth(),
    //   date.getDate(),
    //   18,
    //   30
    // )
    const lastSlotTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      18,
      0,
    )
    if (now > lastSlotTime) {
      return true
    }
  }

  // If none of the above conditions are met, the date is valid
  return false
}

/**
 * Everyday morning 6am to evening 6pm, interval after time slot generate programatically
 * @param startTime `06:00`
 * @param endTime `18:00`
 * @param interval ex. `30` minutes
 * @returns `["06:00 am", "06:30 am", ... "17:30 pm", "18:00 pm"]`
 */
export function generateTimeSlots(
  startTime: string,
  endTime: string,
  interval: number,
): string[] {
  // const startTime = "06:00"
  // const endTime = "18:00"
  const slots: string[] = []
  let currentTime = parse(startTime, 'HH:mm', new Date())
  const endTimeParsed = parse(endTime, 'HH:mm', new Date())

  while (
    isBefore(currentTime, endTimeParsed) ||
    isEqual(currentTime, endTimeParsed)
  ) {
    // slots.push(format(currentTime, "HH:mm"))
    slots.push(format(currentTime, 'HH:mm aaa'))
    currentTime = addMinutes(currentTime, interval)
  }

  return slots
}

export function formatWithOffset(date = new Date()) {
  const dtf = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const parts = Object.fromEntries(
    dtf.formatToParts(date).map((p) => [p.type, p.value]),
  )
  const yyyy = parts.year
  const MM = parts.month
  const dd = parts.day
  const HH = parts.hour
  const mm = parts.minute
  const ss = parts.second

  // JS offset is minutes *behind* UTC; invert sign for ISO offset
  const offsetMinutes = -date.getTimezoneOffset()
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const abs = Math.abs(offsetMinutes)
  const offHH = String(Math.floor(abs / 60)).padStart(2, '0')
  const offMM = String(abs % 60).padStart(2, '0')

  return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}${sign}${offHH}:${offMM}`
}

export function generateCustomerID() {
  // Generates a 36-character string, then deletes all hyphens
  return crypto.randomUUID().replace(/-/g, '')
}

export function generateShortID(length = 10) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const randomBytes = new Uint8Array(length)
  crypto.getRandomValues(randomBytes)

  let result = ''
  for (let i = 0; i < length; i++) {
    // Map random bytes safely to the character array pool
    result += chars[randomBytes[i] % chars.length]
  }
  return result
}
