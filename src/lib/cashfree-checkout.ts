/**
 * Cashfree Client Checkout Helper
 * Uses the official Cashfree Web SDK v3 with Sandbox / Production support
 */

declare global {
  interface Window {
    Cashfree?: (options: { mode: 'sandbox' | 'production' }) => {
      checkout: (options: {
        paymentSessionId: string
        redirectTarget?: '_self' | '_modal' | '_blank' | HTMLElement
        appearance?: {
          width?: string
          height?: string
          theme?: 'light' | 'dark'
        }
      }) => Promise<{
        error?: { message: string; code?: string }
        redirect?: boolean
        paymentDetails?: { paymentMessage: string }
      }>
    }
  }
}

let sdkPromise: Promise<void> | null = null

function loadCashfreeScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()

  if (window.Cashfree) {
    return Promise.resolve()
  }

  if (sdkPromise) {
    return sdkPromise
  }

  sdkPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector('script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Cashfree SDK')))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      sdkPromise = null
      reject(new Error('Failed to load Cashfree SDK'))
    }
    document.head.appendChild(script)
  })

  return sdkPromise
}

export interface CheckoutOptions {
  paymentSessionId: string
  mode?: 'sandbox' | 'production'
  redirectTarget?: '_self' | '_modal' | '_blank'
}

export async function initiateCashfreePayment({
  paymentSessionId,
  mode = 'sandbox',
  redirectTarget = '_self',
}: CheckoutOptions) {
  await loadCashfreeScript()

  if (!window.Cashfree) {
    throw new Error('Cashfree SDK could not be initialized')
  }

  const cashfree = window.Cashfree({ mode })
  return cashfree.checkout({
    paymentSessionId,
    redirectTarget,
  })
}
