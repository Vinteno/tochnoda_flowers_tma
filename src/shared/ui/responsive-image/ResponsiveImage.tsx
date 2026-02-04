import type { ImageMode, ImageSources, ImageVariants } from '@shared/lib'
import type { ComponentPropsWithoutRef } from 'react'
import { getImageSources } from '@shared/lib'

interface ResponsiveImageProps extends Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'srcSet' | 'alt'> {
  image?: ImageVariants | null
  mode: ImageMode
  sources?: ImageSources
  pictureClassName?: string
  alt: string
}

export function ResponsiveImage({
  image,
  mode,
  sources,
  pictureClassName,
  alt,
  loading = 'lazy',
  decoding = 'async',
  ...imgProps
}: ResponsiveImageProps) {
  const resolvedSources = sources ?? getImageSources(image, mode)

  if (!resolvedSources.fallbackSrc) {
    return null
  }

  return (
    <picture className={pictureClassName}>
      {resolvedSources.webpSrc && (
        <source
          srcSet={resolvedSources.webpSrcSet || resolvedSources.webpSrc}
          type="image/webp"
        />
      )}
      <img
        {...imgProps}
        src={resolvedSources.fallbackSrc}
        srcSet={resolvedSources.fallbackSrcSet}
        alt={alt}
        loading={loading}
        decoding={decoding}
      />
    </picture>
  )
}
