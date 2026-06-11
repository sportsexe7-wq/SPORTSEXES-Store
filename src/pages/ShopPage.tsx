import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ProductCard } from '@/components/product/ProductCard'
import { productService } from '@/services/productService'
import { useDebounce } from '@/hooks/useDebounce'
import { AdSlot, AD_SLOTS } from '@/components/ads/AdSlot'
import { useSEO } from '@/hooks/useSEO'

export function ShopPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const debouncedQuery = useDebounce(query)

  useSEO({
    title: debouncedQuery ? `${debouncedQuery} jerseys` : 'Shop All Football Jerseys',
    description: debouncedQuery
      ? `Search results for "${debouncedQuery}" on SPORTSEXE — premium football jerseys with fast delivery across India.`
      : 'Browse all football jerseys on SPORTSEXE — clubs, national teams, retro, World Cup editions and accessories.',
  })

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'shop', debouncedQuery],
    queryFn: () => productService.getAll(debouncedQuery ? { search: debouncedQuery } : undefined),
  })

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
        {debouncedQuery ? `Results for "${debouncedQuery}"` : 'All Jerseys'}
      </h1>
      <p className="mb-8 text-text-muted">{products.length} products found</p>

      <AdSlot slot={AD_SLOTS.shop} className="mb-8 px-0" />

      {isLoading ? (
        <p className="py-16 text-center text-text-muted">Loading…</p>
      ) : products.length === 0 ? (
        <p className="py-16 text-center text-text-muted">No jerseys match your search.</p>
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
