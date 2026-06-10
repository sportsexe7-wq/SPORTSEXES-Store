import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, AlertTriangle, Crown, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { HeroSection } from '@/components/home/HeroSection'
import { TrustBar } from '@/components/home/TrustBar'
import { BestSellersSection } from '@/components/home/BestSellersSection'
import { ShopByCategorySection } from '@/components/home/ShopByCategorySection'
import { FeaturedCollections } from '@/components/home/FeaturedCollections'
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
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: trending = [] } = useQuery({
    queryKey: ['products', 'trending'],
    queryFn: () => productService.getTrending(),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <>
      {/* Top header — site name + VIP + Login */}
      <div className="border-b border-border bg-surface px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center overflow-visible">
            <img
              src="/Sportsexe.png"
              alt="SPORTSEXE"
              className="h-8 w-auto origin-left scale-[1.9] md:h-10 md:scale-[1.7]"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/vip"
              className="flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand hover:bg-brand/20 transition-colors"
            >
              <Crown className="h-3 w-3" /> VIP
            </Link>
            <Link
              to={user ? '/account' : '/login'}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold text-text hover:border-brand/40 hover:text-brand transition-colors"
            >
              <User className="h-3 w-3" />
              {user ? (user.displayName?.split(' ')[0] ?? 'Account') : 'Login'}
            </Link>
          </div>
        </div>
      </div>

      {/* Fake-payment warning — continuous marquee */}
      <div className="overflow-hidden bg-orange-500 py-1 text-[10px] font-semibold text-white md:text-[11px]">
        <div className="animate-marquee flex w-max gap-0">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex shrink-0 items-center">
              {Array.from({ length: 6 }).map((_, j) => (
                <span key={j} className="flex items-center px-8">
                  <AlertTriangle className="mr-1.5 inline h-2.5 w-2.5 shrink-0" />
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
