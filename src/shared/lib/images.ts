export type ImageVariantKey = 'original' | 'thumb' | 'preview' | 'small'

export type ImageWebpVariants = Partial<Record<ImageVariantKey, string>>

export type ImageVariants = Partial<Record<ImageVariantKey, string>> & {
  webp?: ImageWebpVariants
}

export interface ImageSet {
  original: string
  thumb: string
  webp?: {
    original: string
    thumb: string
  }
}

export interface ImageWithPreview extends ImageSet {
  preview: string
  webp?: {
    original: string
    thumb: string
    preview: string
  }
}

export type ImageMode = 'main' | 'thumb' | 'card' | 'banner'

export interface ImageSources {
  webpSrc?: string
  webpSrcSet?: string
  fallbackSrc?: string
  fallbackSrcSet?: string
}

interface ImageModeConfig {
  fallbackOrder: ImageVariantKey[]
  fallbackSrcSet?: [ImageVariantKey, ImageVariantKey]
  webpOrder: ImageVariantKey[]
  webpSrcSet?: [ImageVariantKey, ImageVariantKey]
}

const IMAGE_MODE_CONFIG: Record<ImageMode, ImageModeConfig> = {
  main: {
    fallbackOrder: ['original', 'preview', 'thumb'],
    fallbackSrcSet: ['preview', 'original'],
    webpOrder: ['original', 'preview', 'thumb'],
    webpSrcSet: ['preview', 'original'],
  },
  thumb: {
    fallbackOrder: ['thumb', 'preview', 'original'],
    fallbackSrcSet: ['thumb', 'preview'],
    webpOrder: ['thumb', 'preview', 'original'],
    webpSrcSet: ['thumb', 'preview'],
  },
  card: {
    fallbackOrder: ['thumb', 'original'],
    fallbackSrcSet: ['thumb', 'original'],
    webpOrder: ['thumb', 'original'],
    webpSrcSet: ['thumb', 'original'],
  },
  banner: {
    fallbackOrder: ['small', 'original'],
    fallbackSrcSet: ['small', 'original'],
    webpOrder: ['small', 'original'],
    webpSrcSet: ['small', 'original'],
  },
}

const pickFirst = (values: Array<string | null | undefined>) =>
  values.find((value): value is string => Boolean(value))

const buildSrcSet = (one?: string, two?: string) => {
  if (!one || !two) {
    return undefined
  }
  return `${one} 1x, ${two} 2x`
}

export const getImageSources = (
  image: ImageVariants | null | undefined,
  mode: ImageMode,
): ImageSources => {
  if (!image) {
    return {}
  }

  const config = IMAGE_MODE_CONFIG[mode]
  const fallbackSrc = pickFirst(config.fallbackOrder.map(key => image[key]))
  const webpSrc = pickFirst(config.webpOrder.map(key => image.webp?.[key]))
  const fallbackSrcSet = config.fallbackSrcSet
    ? buildSrcSet(image[config.fallbackSrcSet[0]], image[config.fallbackSrcSet[1]])
    : undefined
  const webpSrcSet = config.webpSrcSet
    ? buildSrcSet(image.webp?.[config.webpSrcSet[0]], image.webp?.[config.webpSrcSet[1]])
    : undefined

  return {
    webpSrc,
    webpSrcSet,
    fallbackSrc,
    fallbackSrcSet,
  }
}
