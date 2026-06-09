import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Star, Minus, Plus, Heart, Truck, Shield, RotateCcw } from 'lucide-react'
import { productService } from '@/services/productService'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, calculateDiscount } from '@/utils/format'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import type { ProductSize } from '@/types'
import { cn } from '@/utils/cn'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [selectedSize, setSelectedSize] = useState<ProductSize>('M')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug!),
    enabled: !!slug,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-text-muted">
        Loading...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button asChild className="mt-4">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    )
  }

  const discount = calculateDiscount(product.price, product.salePrice)
  const displayPrice = product.salePrice ?? product.price
  const inStock = product.stock > 0

  const handleAddToCart = () => {
    addItem(product.id, selectedSize, quantity)
  }

  const handleBuyNow = () => {
    addItem(product.id, selectedSize, quantity)
    navigate('/checkout')
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-muted">
            <img
              src={product.images[activeImage]}
              alt={product.title}
              className="h-full w-full object-cover transition-transform hover:scale-110 duration-500"
            />
            {discount > 0 && (
              <Badge className="absolute left-4 top-4">-{discount}% OFF</Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2',
                    activeImage === i ? 'border-brand' : 'border-transparent',
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-wider text-text-muted">
              {product.category} · {product.team}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              {product.title}
            </h1>
            {product.rating && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i < Math.floor(product.rating!) ? 'fill-brand text-brand' : 'text-border',
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-text-muted">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatCurrency(displayPrice)}</span>
            {product.salePrice && (
              <span className="text-lg text-text-muted line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <p className="text-text-muted">{product.shortDescription}</p>

          <div>
            <p className="mb-3 text-sm font-semibold">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-md border text-sm font-semibold transition-colors',
                    selectedSize === size
                      ? 'border-brand bg-brand text-black'
                      : 'border-border hover:border-white',
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">Quantity</p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className={cn('text-sm font-medium', inStock ? 'text-brand' : 'text-red-500')}>
            {inStock ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" disabled={!inStock} onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="flex-1" disabled={!inStock} onClick={handleBuyNow}>
              Buy Now
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggle(product.id)}
              className={has(product.id) ? 'text-red-500' : ''}
            >
              <Heart className={cn('h-5 w-5', has(product.id) && 'fill-current')} />
            </Button>
          </div>

          <div className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-brand" />
              Fast Shipping
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-brand" />
              Secure Payment
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-4 w-4 text-brand" />
              Easy Returns
            </div>
          </div>

          <Tabs defaultValue="description">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
              <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
              <TabsTrigger value="shipping" className="flex-1">Shipping</TabsTrigger>
              <TabsTrigger value="size-guide" className="flex-1">Size Guide</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <p className="text-sm leading-relaxed text-text-muted">{product.description}</p>
            </TabsContent>
            <TabsContent value="details">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-text-muted">Team</dt><dd>{product.team}</dd></div>
                <div className="flex justify-between"><dt className="text-text-muted">League</dt><dd>{product.league}</dd></div>
                <div className="flex justify-between"><dt className="text-text-muted">Season</dt><dd>{product.season}</dd></div>
                <div className="flex justify-between"><dt className="text-text-muted">Country</dt><dd>{product.country}</dd></div>
              </dl>
            </TabsContent>
            <TabsContent value="shipping">
              <p className="text-sm text-text-muted">
                Free shipping on orders above ₹2,999. Standard delivery in 5-7 business days.
                Express delivery available at checkout.
              </p>
            </TabsContent>
            <TabsContent value="size-guide">
              <div className="overflow-x-auto text-sm">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 text-left">Size</th>
                      <th className="py-2 text-left">Chest (cm)</th>
                      <th className="py-2 text-left">Length (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="text-text-muted">
                    <tr className="border-b border-border"><td className="py-2">S</td><td>88-96</td><td>70</td></tr>
                    <tr className="border-b border-border"><td className="py-2">M</td><td>96-104</td><td>72</td></tr>
                    <tr className="border-b border-border"><td className="py-2">L</td><td>104-112</td><td>74</td></tr>
                    <tr><td className="py-2">XL</td><td>112-120</td><td>76</td></tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
