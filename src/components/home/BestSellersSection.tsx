import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'
import { ProductCarousel } from '@/components/product/ProductCarousel'
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

  if (isLoading) return null

  return (
    <ProductCarousel
      products={products}
      title="Best Sellers"
      subtitle="Our most popular football jerseys"
      onQuickView={onQuickView}
    />
  )
}
