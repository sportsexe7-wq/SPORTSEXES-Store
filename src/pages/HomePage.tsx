import { useState } from 'react'

import { HeroSection } from '@/components/home/HeroSection'
import { TrustBar } from '@/components/home/TrustBar'
import { BestSellersSection } from '@/components/home/BestSellersSection'
import { ShopByCategorySection } from '@/components/home/ShopByCategorySection'
import { FeaturedCollections } from '@/components/home/FeaturedCollections'
import { ReviewsSection } from '@/components/home/ReviewsSection'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { AdSlot, AD_SLOTS } from '@/components/ads/AdSlot'
import { Modal } from '@/components/ui/modal'
import { productService } from '@/services/productService'
import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/types'
import { formatCurrency } from '@/utils/format'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { useSEO } from '@/hooks/useSEO'

export function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const { addItem } = useCart()

  useSEO({
    title: 'SPORTSEXE — Premium Football Jerseys for Clubs & Countries | Buy Online India',
    description: 'Shop premium football jerseys from SPORTSEXE — clubs, national teams, retro & World Cup editions. Free shipping across India over ₹2,999.',
  })

  const { data: trending = [] } = useQuery({
    queryKey: ['products', 'trending'],
    queryFn: () => productService.getTrending(),
  })

  return (
    <>
      <HeroSection />
      <TrustBar />

      {/* 1. Best Sellers */}
      <BestSellersSection onQuickView={setQuickViewProduct} />

      {/* 2. Shop by Country (FIFA flags) */}
      <ShopByCategorySection />

      {/* 3. Trending Now */}
      <ProductCarousel
        products={trending}
        title="Trending Now"
        subtitle="What fans are buying this week"
        onQuickView={setQuickViewProduct}
      />

      {/* Ad — between Trending and Category */}
      <AdSlot slot={AD_SLOTS.homepage} />

      {/* 4. Shop by Category (6 accessory cards) */}
      <FeaturedCollections />

      {/* Reviews */}
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
