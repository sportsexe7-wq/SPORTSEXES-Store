import { useState } from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { TrustBar } from '@/components/home/TrustBar'
import { BestSellersSection } from '@/components/home/BestSellersSection'
import { ShopByCategorySection } from '@/components/home/ShopByCategorySection'
import { StorySection } from '@/components/home/StorySection'
import { ReviewsSection } from '@/components/home/ReviewsSection'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { Modal } from '@/components/ui/modal'
import { productService } from '@/services/productService'
import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/types'
import { formatCurrency } from '@/utils/format'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'

export function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const { addItem } = useCart()

  const { data: newArrivals = [] } = useQuery({
    queryKey: ['products', 'newArrivals'],
    queryFn: () => productService.getNewArrivals(),
  })

  return (
    <>
      <HeroSection />
      <TrustBar />
      <BestSellersSection onQuickView={setQuickViewProduct} />
      <ShopByCategorySection />
      <StorySection />
      <ProductCarousel
        products={newArrivals}
        title="New Arrivals"
        subtitle="Fresh drops just landed"
        onQuickView={setQuickViewProduct}
        className="bg-surface-elevated"
      />
      <ReviewsSection />

      <Modal
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
        title={quickViewProduct?.title}
      >
        {quickViewProduct && (
          <div className="grid gap-4 sm:grid-cols-2">
            <img
              src={quickViewProduct.images[0]}
              alt={quickViewProduct.title}
              className="aspect-square rounded-lg object-cover"
            />
            <div className="space-y-4">
              <p className="text-sm text-text-muted">{quickViewProduct.shortDescription}</p>
              <p className="text-2xl font-bold">
                {formatCurrency(quickViewProduct.salePrice ?? quickViewProduct.price)}
              </p>
              <Button
                className="w-full"
                onClick={() => {
                  addItem(quickViewProduct.id, quickViewProduct.sizes[0])
                  setQuickViewProduct(null)
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
