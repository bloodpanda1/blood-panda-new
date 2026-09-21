import { getServerEnv } from '#/config/server-env'
import crypto from 'node:crypto'

export interface CashfreeCustomerDetails {
  customerId: string
  customerName?: string
  customerEmail?: string
  customerPhone: string
}

export interface CreateOrderParams {
  orderId: string
  orderAmount: number
  orderCurrency?: string
  customer: CashfreeCustomerDetails
  returnUrl?: string
  notifyUrl?: string
  orderNote?: string
}

export interface CashfreeOrderResponse {
  cf_order_id: string
  order_id: string
  entity: string
  order_currency: string
  order_amount: number
  order_status: string
  payment_session_id: string
  order_expiry_time: string
  order_note?: string | null
  created_at: string
  customer_details: {
    customer_id: string
    customer_name?: string | null
    customer_email?: string | null
    customer_phone: string
  }
  order_meta?: {
    return_url?: string | null
    notify_url?: string | null
    payment_methods?: string | null
  }
}

export interface CashfreePaymentEntity {
  cf_payment_id: number
  order_id: string
  entity: string
  payment_currency: string
  payment_amount: number
  payment_time: string
  payment_service_charge?: number
  payment_service_tax?: number
  payment_status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'USER_DROPPED' | 'CANCELLED' | string
  payment_message?: string
  bank_reference?: string
  auth_id?: string
  authorization?: any
  payment_method?: any
  payment_group?: string
}

function getBaseUrl(): string {
  let envMode = 'SANDBOX'
  try {
    envMode = getServerEnv().CASHFREE_ENV || process.env.CASHFREE_ENV || 'SANDBOX'
  } catch {
    envMode = process.env.CASHFREE_ENV || 'SANDBOX'
  }
  return envMode === 'PRODUCTION'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg'
}

function getHeaders(): HeadersInit {
  let appId = ''
  let secretKey = ''
  let apiVersion = '2023-08-01'

  try {
    const env = getServerEnv()
    appId = env.CASHFREE_APP_ID
    secretKey = env.CASHFREE_SECRET_KEY
    apiVersion = env.CASHFREE_API_VERSION || '2023-08-01'
  } catch {
    appId = process.env.CASHFREE_APP_ID || ''
    secretKey = process.env.CASHFREE_SECRET_KEY || ''
    apiVersion = process.env.CASHFREE_API_VERSION || '2023-08-01'
  }

  return {
    'x-client-id': appId,
    'x-client-secret': secretKey,
    'x-api-version': apiVersion,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}

/**
 * Creates an order in Cashfree Sandbox / Production
 */
export async function createCashfreeOrder(params: CreateOrderParams): Promise<CashfreeOrderResponse> {
  const baseUrl = getBaseUrl()
  const headers = getHeaders()

  // Format and sanitize phone number (ensure 10 digits without +91 prefix or special chars)
  let sanitizedPhone = params.customer.customerPhone.replace(/\D/g, '').slice(-10)
  if (!sanitizedPhone || sanitizedPhone.length !== 10) {
    sanitizedPhone = '9999999999'
  }

  let sanitizedName = (params.customer.customerName || 'Valued Customer').substring(0, 100)
  if (sanitizedName.length < 3) {
    sanitizedName = 'Valued Customer'
  }

  const finalAmount = Math.max(1, Math.round(params.orderAmount * 100) / 100)

  const body = {
    order_id: params.orderId,
    order_amount: finalAmount,
    order_currency: params.orderCurrency || 'INR',
    customer_details: {
      customer_id: params.customer.customerId,
      customer_name: sanitizedName,
      customer_email: params.customer.customerEmail || 'customer@bloodpanda.com',
      customer_phone: sanitizedPhone,
    },
    order_meta: {
      return_url: params.returnUrl,
      notify_url: params.notifyUrl,
    },
    order_note: params.orderNote || 'BloodPanda Test Booking',
  }

  const response = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('Cashfree Create Order Error:', JSON.stringify(errorData, null, 2))
    throw new Error(errorData.message || `Failed to create Cashfree order: ${response.statusText}`)
  }

  const data: CashfreeOrderResponse = await response.json()
  return data
}

/**
 * Fetches order details from Cashfree
 */
export async function fetchCashfreeOrder(orderId: string): Promise<CashfreeOrderResponse> {
  const baseUrl = getBaseUrl()
  const headers = getHeaders()

  const response = await fetch(`${baseUrl}/orders/${encodeURIComponent(orderId)}`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('Cashfree Fetch Order Error:', errorData)
    throw new Error(errorData.message || `Failed to fetch Cashfree order: ${response.statusText}`)
  }

  const data: CashfreeOrderResponse = await response.json()
  return data
}

/**
 * Fetches all payments for an order from Cashfree
 */
export async function fetchCashfreeOrderPayments(orderId: string): Promise<CashfreePaymentEntity[]> {
  const baseUrl = getBaseUrl()
  const headers = getHeaders()

  const response = await fetch(`${baseUrl}/orders/${encodeURIComponent(orderId)}/payments`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('Cashfree Fetch Payments Error:', errorData)
    throw new Error(errorData.message || `Failed to fetch Cashfree payments: ${response.statusText}`)
  }

  const data: CashfreePaymentEntity[] = await response.json()
  return data
}

/**
 * Verifies Cashfree webhook signature
 */
export function verifyCashfreeWebhookSignature(
  signature: string | null,
  rawBody: string,
  timestamp: string | null,
): boolean {
  if (!signature || !timestamp) return false

  try {
    const secretKey = getServerEnv().CASHFREE_SECRET_KEY
    const payload = `${timestamp}${rawBody}`
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('base64')

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(expectedSignature, 'utf8'),
    )
  } catch (err) {
    console.error('Error verifying Cashfree webhook signature:', err)
    return false
  }
}
