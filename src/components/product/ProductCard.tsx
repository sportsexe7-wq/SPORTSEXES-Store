import { Link } from 'react-router-dom'
import { Heart, Eye, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, calculateDiscount } from '@/utils/format'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/utils/cn'

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
  className?: string
}

export function ProductCard({ product, onQuickView, className }: ProductCardProps) {
  const { has, toggle } = useWishlist()
  const { addItem } = useCart()
  const discount = calculateDiscount(product.price, product.salePrice)
  const displayPrice = product.salePrice ?? product.price
  const isWishlisted = has(product.id)
  const outOfStock = product.stock <= 0
  const lowStock = product.stock > 0 && product.stock <= 5

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (outOfStock) return
    addItem(product.id, product.sizes[0])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn('group relative', className)}
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-muted">
          <img
            src={product.images[0]}
            alt={product.title}
            className={cn(
              'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
              outOfStock && 'opacity-50',
            )}
            loading="lazy"
          />
          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-black/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                Out of Stock
              </span>
            </div>
          )}
          {!outOfStock && discount > 0 && (
            <Badge className="absolute left-3 top-3">-{discount}%</Badge>
          )}
          {lowStock && (
            <Badge variant="destructive" className="absolute right-3 top-3">
              Only {product.stock} left
            </Badge>
          )}
          {!outOfStock && (
            <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-2 p-3 transition-transform duration-300 group-hover:translate-y-0">
              <Button size="sm" className="flex-1" onClick={handleAddToCart}>
                <ShoppingBag className="h-4 w-4" />
                Add
              </Button>
              {onQuickView && (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={(e) => { e.preventDefault(); onQuickView(product) }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-xs uppercase tracking-wider text-text-muted">{product.category}</p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight group-hover:text-brand transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold">{formatCurrency(displayPrice)}</span>
            {product.salePrice && (
              <span className="text-sm text-text-muted line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => toggle(product.id)}
        className={cn(
          'absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-colors hover:bg-black/70',
          isWishlisted && 'text-red-500',
        )}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
      </button>
    </motion.div>
  )
}
