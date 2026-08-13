import { getServerEnv } from '#/config/server-env'
import { Env, StandardCheckoutClient } from '@phonepe-pg/pg-sdk-node'
import { createServerOnlyFn } from '@tanstack/react-start'

export const getPaymentClient = createServerOnlyFn(() => {
  const CLIENT_ID = getServerEnv().PHONEPAY_CLIENT_ID
  const CLIENT_SECRET = getServerEnv().PHONEPAY_CLIENT_SECRET
  const CLIENT_VERSION = 1

  const staging =
    getServerEnv().NODE_ENV === 'development' ? Env.SANDBOX : Env.PRODUCTION
  return StandardCheckoutClient.getInstance(
    CLIENT_ID,
    CLIENT_SECRET,
    CLIENT_VERSION,
    staging,
  )
})
