import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ProductCard } from '@/components/product/ProductCard'
import { productService } from '@/services/productService'
import { useDebounce } from '@/hooks/useDebounce'
import { AdSlot, AD_SLOTS } from '@/components/ads/AdSlot'
import { useSEO } from '@/hooks/useSEO'
import { cn } from '@/utils/cn'

const CATEGORIES = [
  { label: 'All', href: '/shop' },
  { label: 'Club Jerseys', href: '/category/clubs' },
  { label: 'National Teams', href: '/category/countries' },
  { label: 'Retro', href: '/category/retro' },
  { label: 'World Cup', href: '/category/world-cup' },
  { label: 'Flags', href: '/category/flags' },
  { label: 'Accessories', href: '/category/accessories' },
]

export function ShopPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') ?? ''
  const debouncedQuery = useDebounce(query)

  useSEO({
    title: debouncedQuery ? `${debouncedQuery} — Search Results` : 'All Products',
    description: debouncedQuery
      ? `Search results for "${debouncedQuery}" on SPORTSEXE — premium football jerseys with fast delivery across India.`
      : 'Browse all products on SPORTSEXE — clubs, national teams, retro, World Cup editions and accessories.',
  })

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'shop', debouncedQuery],
    queryFn: () => productService.getAll(debouncedQuery ? { search: debouncedQuery } : undefined),
  })

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
        {debouncedQuery ? `Results for "${debouncedQuery}"` : 'All Products'}
      </h1>
      <p className="mb-5 text-text-muted">{products.length} products found</p>

      {/* Category chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = cat.href === '/shop' && !debouncedQuery
          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => navigate(cat.href)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'border-brand bg-brand text-black'
                  : 'border-border text-text-muted hover:border-brand hover:text-brand',
              )}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      <AdSlot slot={AD_SLOTS.shop} className="mb-8 px-0" />

      {isLoading ? (
        <p className="py-16 text-center text-text-muted">Loading…</p>
      ) : products.length === 0 ? (
        <p className="py-16 text-center text-text-muted">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
