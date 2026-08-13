import { getServerEnv } from '#/config/server-env'
import { createServerOnlyFn } from '@tanstack/react-start'
import { v2 as cloudinary } from 'cloudinary'

export const getCloudinaryClient = createServerOnlyFn(() => {
  const cloudName = getServerEnv().CLOUDINARY_CLOUD_NAME
  const apiKey = getServerEnv().CLOUDINARY_API_KEY
  const apiSecret = getServerEnv().CLOUDINARY_API_SECRET

  const isDev = getServerEnv().NODE_ENV === 'development'

  // Configuration
  return cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true, // Use HTTPS for secure connections
    debug: isDev, // Enable debug mode for detailed logging
  })
})
