import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useWishlist } from '@/hooks/useWishlist'
import { productService } from '@/services/productService'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

export function WishlistPage() {
  const { ids } = useWishlist()

  const { data: products = [] } = useQuery({
    queryKey: ['wishlist', ids],
    queryFn: async () => {
      const results = await Promise.all(ids.map((id) => productService.getById(id)))
      return results.filter(Boolean)
    },
    enabled: ids.length > 0,
  })

  if (!ids.length) {
    return (
      <div className="rounded-xl border border-border p-12 text-center">
        <Heart className="mx-auto h-12 w-12 text-text-muted" />
        <p className="mt-4 text-lg font-semibold">Your wishlist is empty</p>
        <p className="mt-1 text-text-muted">Save jerseys you love for later.</p>
        <Button asChild className="mt-6">
          <Link to="/shop">Browse Jerseys</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
      {products.map((product) => product && (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
