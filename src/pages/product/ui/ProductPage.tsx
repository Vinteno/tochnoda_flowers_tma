import type { CarouselApi } from '@/components/ui/carousel'
import { useProduct } from '@entities/product'
import { AddToCartButton } from '@features/cart'
import { cn, formatPrice, useBackButton } from '@shared/lib'
import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { LuArrowLeft, LuFlower, LuMoveHorizontal, LuMoveVertical } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { BACK_BUTTON_SKIP_ROUTES } from '@/shared'
import { ProductPageSkeleton } from './ProductPageSkeleton'

interface ProductPageProps {
  slug: string
}

export function ProductPage({ slug }: ProductPageProps) {
  const navigate = useNavigate()
  const { data: product, isLoading, error } = useProduct(slug)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  useBackButton({
    navigate,
    skipRoutes: BACK_BUTTON_SKIP_ROUTES,
    fallbackTo: '/',
  })

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

  const images = product.images.length > 0 ? product.images : [{ id: 0, url: product.thumbnail || '', is_thumbnail: true }]
  const metadata = product.metadata as Record<string, unknown> | null

  return (
    <>
      <div className="mt-4 px-2">
        <div className="relative overflow-hidden rounded-xl">
          <Carousel setApi={setCarouselApi} opts={{ loop: true }}>
            <CarouselContent className="ml-0">
              {images.map((image, index) => (
                <CarouselItem
                  key={image.id || index}
                  className="pl-0"
                >
                  {image.url
                    ? (
                        <img
                          src={image.url}
                          alt={product.name}
                          className="h-96 w-full object-cover"
                        />
                      )
                    : (
                        <div className="h-96 w-full bg-secondary" />
                      )}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-2 px-2">
          <ScrollArea className="rounded-xl">
            <ul className="flex gap-1">
              {images.map((image, index) => (
                <li key={image.id}>
                  <button
                    className={cn(`
                      size-20 cursor-pointer overflow-hidden rounded-xl
                      transition-opacity
                    `, { 'opacity-50': index !== selectedImageIndex })}
                    onClick={() => carouselApi?.scrollTo(index)}
                  >
                    {image.url
                      ? (
                          <img
                            src={image.url}
                            alt={`${product.name} ${index + 1}`}
                            className="size-full object-contain"
                          />
                        )
                      : (
                          <div className="size-full bg-secondary" />
                        )}
                  </button>
                </li>
              ))}
            </ul>
            <ScrollBar
              orientation="horizontal"
              className="-mb-2.5 h-1.5"
            />
          </ScrollArea>
        </div>
      )}

      <section className="mt-5 flex flex-col px-2 pb-20">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <div className="mt-1.5 flex items-center justify-between">
            <div className="flex gap-2">
              <p className={cn('text-2xl font-medium', { 'text-primary': product.has_discount })}>
                {formatPrice(product.best_price)}
              </p>
              {product.has_discount && (
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
            <div className="mt-4 flex flex-col gap-2">
              <h4 className="font-medium">С этим покупают</h4>
              <ScrollArea>
                <ul className="flex gap-2">
                  {product.related_products.map(related => (
                    <li key={related.id}>
                      <Link
                        className="
                          min-w-32 cursor-pointer overflow-hidden rounded-xl
                          border border-border
                        "
                        to="/product/$slug"
                        params={{ slug: related.slug }}
                      >
                        <div className="h-24 w-full bg-secondary">
                          {related.thumbnail && (
                            <img
                              src={related.thumbnail}
                              alt={related.name}
                              className="h-24 w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="p-2">
                          <p className="line-clamp-1 text-sm">{related.name}</p>
                          <p className="font-bold">{formatPrice(related.best_price)}</p>
                        </div>
                      </Link>
                    </li>
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
        fixed right-0 bottom-0 left-0 w-full rounded-t-3xl bg-background px-2
        pt-2 safe-area-bottom
      "
      >
        <AddToCartButton
          product={product}
          className="h-11 w-full rounded-full text-base"
        />
      </footer>
    </>
  )
}
