import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

interface ProductCarouselProps {
  products: Product[]
  title?: string
  subtitle?: string
  onQuickView?: (product: Product) => void
  className?: string
}

export function ProductCarousel({
  products,
  title,
  subtitle,
  onQuickView,
  className,
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (!products.length) return null

  return (
    <section className={cn('py-12', className)}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="mb-8 flex items-end justify-between">
            <div>
              {title && (
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
              )}
              {subtitle && (
                <p className="mt-1 text-text-muted">{subtitle}</p>
              )}
            </div>
            <div className="hidden gap-2 sm:flex">
              <Button variant="outline" size="icon" onClick={scrollPrev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={scrollNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-0 flex-[0_0_45%] sm:flex-[0_0_35%] md:flex-[0_0_28%] lg:flex-[0_0_22%]"
              >
                <ProductCard product={product} onQuickView={onQuickView} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
