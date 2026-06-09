import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product } from '@/types'

const NON_FOOTBALL_CATEGORIES = ['Cricket', 'Kabaddi', 'Basketball', 'Hockey']

function isFootballJersey(product: Product): boolean {
  return !NON_FOOTBALL_CATEGORIES.includes(product.category)
}

interface BestSellersSectionProps {
  onQuickView?: (product: Product) => void
}

export function BestSellersSection({ onQuickView }: BestSellersSectionProps) {
  const { data: allBestSellers = [], isLoading } = useQuery({
    queryKey: ['products', 'bestSellers'],
    queryFn: () => productService.getBestSellers(),
  })

  const products = allBestSellers.filter(isFootballJersey)

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center md:mb-10">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Best Sellers</h2>
          <p className="mt-2 text-text-muted">Our most popular football jerseys</p>
        </div>

        {isLoading ? (
          <p className="text-center text-text-muted">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
