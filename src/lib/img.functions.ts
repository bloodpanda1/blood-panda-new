import { createServerFn } from '@tanstack/react-start'
import { getPixels } from '@unpic/pixels'
import { getDominantColor } from '@unpic/placeholder'
import { encode } from 'blurhash'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import z from 'zod'

interface ImageData {
  width: number
  height: number
  data: Uint8ClampedArray
}

const dominantColorschema = z.object({
  filePath: z.string(),
})

const blurHashchema = z.object({
  filePath: z.string(),
})

export const getDominantColorFromImageFile = createServerFn()
  .validator(dominantColorschema)
  .handler(async ({ data }) => {
    const { filePath } = data
    // Read the image data from a file
    const pngData = await fs.readFile(join(process.cwd(), 'public', filePath))

    // Decode the image data into raw pixel data
    const result = (await getPixels(pngData)) as unknown as ImageData

    // Get the dominant color
    return getDominantColor(result.data)
  })

export const generateBlurHash = createServerFn()
  .validator(blurHashchema)
  .handler(async ({ data }) => {
    const { filePath } = data

    // const jpgData = await getPixels(
    //   'https://res.cloudinary.com/demo/image/upload/c_lfill,w_200,h_100/dog.jpg',
    // )
    const jpgData = await getPixels(filePath)
    const res = Uint8ClampedArray.from(jpgData.data)
    const blurhash = encode(res, jpgData.width, jpgData.height, 4, 4)

    return blurhash
  })
