import type { CarouselApi } from '@/components/ui/carousel'
import { ProductCard, useProduct } from '@entities/product'
import { AddToCartButton } from '@features/cart'
import { cn, formatPrice, getImageSources, useBackButton } from '@shared/lib'
import { ResponsiveImage } from '@shared/ui'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { LuArrowLeft, LuFlower, LuMoveHorizontal, LuMoveVertical } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ProductPageSkeleton } from './ProductPageSkeleton'

interface ProductPageProps {
  slug: string
}

export function ProductPage({ slug }: ProductPageProps) {
  const navigate = useNavigate()
  const { data: product, isLoading, error } = useProduct(slug)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  const handleBack = useCallback(() => {
    navigate({ to: '/' })
  }, [navigate])

  useBackButton(handleBack)

  useEffect(() => {
    if (!carouselApi) {
      return
    }

    const onSelect = () => {
      setSelectedImageIndex(carouselApi.selectedScrollSnap())
    }

    carouselApi.on('select', onSelect)

    return () => {
      carouselApi.off('select', onSelect)
    }
  }, [carouselApi])

  if (isLoading) {
    return (
      <ProductPageSkeleton />
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Товар не найден</p>
        <Button onClick={() => navigate({ to: '/' })}>
          <LuArrowLeft className="mr-2" />
          На главную
        </Button>
      </div>
    )
  }

  const images = product.images.length > 0
    ? product.images
    : [{
        id: 0,
        original: product.thumbnail?.original || '',
        thumb: product.thumbnail?.thumb || '',
        preview: product.thumbnail?.original || '',
        webp: product.thumbnail?.webp
          ? { original: product.thumbnail.webp.original, thumb: product.thumbnail.webp.thumb, preview: product.thumbnail.webp.original }
          : undefined,
        is_thumbnail: true,
      }]
  const metadata = product.metadata as Record<string, unknown> | null
  const totalImages = images.length
  const isActiveOrNeighbor = (index: number) => {
    if (totalImages <= 1) {
      return true
    }

    const prevIndex = (selectedImageIndex - 1 + totalImages) % totalImages
    const nextIndex = (selectedImageIndex + 1) % totalImages

    return index === selectedImageIndex || index === prevIndex || index === nextIndex
  }

  return (
    <>
      <div className="mt-4 px-2">
        <div className="relative overflow-hidden rounded-md">
          <Carousel setApi={setCarouselApi} opts={{ loop: true }}>
            <CarouselContent className="ml-0">
              {images.map((image, index) => {
                const mainSources = getImageSources(image, 'main')
                return (
                  <CarouselItem
                    key={image.id || index}
                    className="pl-0"
                  >
                    {mainSources.fallbackSrc && isActiveOrNeighbor(index)
                      ? (
                          <ResponsiveImage
                            image={image}
                            mode="main"
                            sources={mainSources}
                            alt={product.name}
                            loading={index === selectedImageIndex ? 'eager' : 'lazy'}
                            decoding="async"
                            fetchPriority={index === selectedImageIndex ? 'high' : 'auto'}
                            className="h-96 w-full rounded-xl object-cover"
                            sizes="100vw"
                          />
                        )
                      : (
                          <div className="h-96 w-full bg-secondary" />
                        )}
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-2 px-2">
          <ScrollArea className="rounded-md">
            <ul className="flex gap-1">
              {images.map((image, index) => {
                const thumbSources = getImageSources(image, 'thumb')
                return (
                  <li key={image.id}>
                    <button
                      className={cn(`
                        size-20 cursor-pointer overflow-hidden rounded-xl
                        transition-opacity
                      `, { 'opacity-50': index !== selectedImageIndex })}
                      onClick={() => carouselApi?.scrollTo(index)}
                    >
                      {thumbSources.fallbackSrc
                        ? (
                            <ResponsiveImage
                              image={image}
                              mode="thumb"
                              sources={thumbSources}
                              alt={`${product.name} ${index + 1}`}
                              loading={index === selectedImageIndex ? 'eager' : 'lazy'}
                              decoding="async"
                              className="size-full object-contain"
                              height={80}
                              width={80}
                              sizes="80px"
                            />
                          )
                        : (
                            <div className="size-full bg-secondary" />
                          )}
                    </button>
                  </li>
                )
              })}
            </ul>
            <ScrollBar
              orientation="horizontal"
              className="-mb-2.5 h-1.5"
            />
          </ScrollArea>
        </div>
      )}

      <section className="mt-5 flex flex-col px-2 pb-28">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <div className="mt-1.5 flex items-center justify-between">
            <div className="flex gap-2">
              <p className={cn('text-2xl font-medium', { 'text-primary': product.has_discount })}>
                {formatPrice(product.best_price)}
              </p>
              {product.best_price < product.price && (
                <p className="
                  self-end pb-0.5 text-muted-foreground line-through
                "
                >
                  {formatPrice(product.price)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col">
          {metadata && (metadata.width as string || metadata.height as string) && (
            <div className="flex flex-col gap-1">
              <h4 className="font-medium">Характеристики</h4>
              <ul className="flex flex-col text-sm text-muted-foreground">
                {metadata.width as string && (
                  <li className="flex items-center gap-2">
                    <LuMoveHorizontal strokeWidth={1.5} />
                    Ширина -
                    {' '}
                    {String(metadata.width)}
                  </li>
                )}
                {metadata.height as string && (
                  <li className="flex items-center gap-2">
                    <LuMoveVertical strokeWidth={1.5} />
                    Высота -
                    {' '}
                    {String(metadata.height as string)}
                  </li>
                )}
              </ul>
            </div>
          )}

          {metadata && Array.isArray(metadata.composition) && metadata.composition.length > 0 && (
            <div className="flex flex-col gap-1">
              <h4 className="font-medium">Состав</h4>
              <ul className="flex flex-col text-sm text-muted-foreground">
                {(metadata.composition as Array<{ name: string, quantity: number }>).map(item => (
                  <li
                    key={item.name}
                    className="flex items-center gap-2"
                  >
                    <LuFlower strokeWidth={1.5} />
                    {item.name}
                    {' '}
                    -
                    {item.quantity}
                    {' '}
                    шт.
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.description && (
            <div className="mt-2 flex flex-col gap-1">
              <h4 className="font-medium">Описание</h4>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>
          )}

          {product.related_products && product.related_products.length > 0 && (
            <div className="mt-4 flex flex-col gap-2.5">
              <h4 className="font-medium">С этим покупают</h4>
              <ScrollArea className="rounded-md">
                <ul className="flex gap-2">
                  {product.related_products.map(related => (
                    <ProductCard
                      key={related.id}
                      product={related}
                      className="w-1/2 shrink-0"
                    />
                  ))}
                </ul>
                <ScrollBar
                  orientation="horizontal"
                  className="-mb-2.5 h-1.5"
                />
              </ScrollArea>
            </div>
          )}
        </div>
      </section>

      <footer className="
        fixed right-0 bottom-0 left-0 w-full rounded-t-lg bg-background px-2
        pt-2 safe-area-bottom
      "
      >
        <AddToCartButton
          product={product}
          className="h-10 w-full text-base"
        />
      </footer>
    </>
  )
}
