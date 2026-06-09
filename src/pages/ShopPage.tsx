import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ProductCard } from '@/components/product/ProductCard'
import { productService } from '@/services/productService'
import { useDebounce } from '@/hooks/useDebounce'

export function ShopPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const debouncedQuery = useDebounce(query)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'shop', debouncedQuery],
    queryFn: () => productService.getAll(debouncedQuery ? { search: debouncedQuery } : undefined),
  })

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="mb-2 text-3xl font-bold">
        {debouncedQuery ? `Results for "${debouncedQuery}"` : 'All Jerseys'}
      </h1>
      <p className="mb-8 text-text-muted">{products.length} products found</p>

      {isLoading ? (
        <p className="text-center text-text-muted">Loading...</p>
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
