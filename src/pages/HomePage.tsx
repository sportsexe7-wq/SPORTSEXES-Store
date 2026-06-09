import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, AlertTriangle } from 'lucide-react'
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
  const [searchQuery, setSearchQuery] = useState('')
  const { addItem } = useCart()
  const navigate = useNavigate()

  const { data: newArrivals = [] } = useQuery({
    queryKey: ['products', 'newArrivals'],
    queryFn: () => productService.getNewArrivals(),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <>
      {/* Fake-payment warning — continuous marquee */}
      <div className="overflow-hidden bg-orange-500 py-1.5 text-xs font-semibold text-white">
        <div className="animate-marquee flex w-max gap-0">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex shrink-0 items-center">
              {Array.from({ length: 6 }).map((_, j) => (
                <span key={j} className="flex items-center px-8">
                  <AlertTriangle className="mr-1.5 inline h-3 w-3 shrink-0" />
                  BEWARE of fake payment calls — we NEVER ask for OTPs, card details or bank info. Contact us only at support@sportsexe.com
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="border-b border-border bg-surface px-4 py-3">
        <div className="container mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jerseys, teams, countries…"
              className="h-10 w-full rounded-xl border border-border bg-surface-elevated pl-9 pr-4 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </form>
        </div>
      </div>

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
