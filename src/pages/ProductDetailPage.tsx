import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Star, Minus, Plus, Heart, Truck, Shield, RotateCcw, MessageSquare, Share2, Check } from 'lucide-react'
import { productService } from '@/services/productService'
import { reviewService } from '@/services/reviewService'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, calculateDiscount } from '@/utils/format'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { ReviewCard } from '@/components/review/ReviewCard'
import { ReviewForm } from '@/components/review/ReviewForm'
import { useSEO } from '@/hooks/useSEO'
import type { ProductSize } from '@/types'
import { cn } from '@/utils/cn'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedSize, setSelectedSize] = useState<ProductSize>('M')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug!),
    enabled: !!slug,
  })

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', 'product', product?.id],
    queryFn: () => reviewService.getByProduct(product!.id),
    enabled: !!product?.id,
  })

  useSEO({
    title: product ? `${product.title} — Buy Online India` : 'Product',
    description: product?.shortDescription,
    ogImage: product?.images[0],
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

  const getSizeStock = (size: ProductSize): number => {
    if (product.sizeStock && size in product.sizeStock) return product.sizeStock[size] ?? 0
    return product.stock
  }
  const selectedSizeStock = getSizeStock(selectedSize)
  const inStock = selectedSizeStock > 0
  const lowStock = selectedSizeStock > 0 && selectedSizeStock <= 5

  const handleAddToCart = () => {
    addItem(product.id, selectedSize, quantity)
  }

  const handleBuyNow = () => {
    addItem(product.id, selectedSize, quantity)
    navigate('/checkout')
  }

  const shareProduct = async () => {
    const url = `${window.location.origin}/product/${product.slug}`
    const shareData = {
      title: product.title,
      text: product.shortDescription,
      url,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
    }

    try {
      await navigator.clipboard.writeText(url)
      setShareStatus('copied')
      window.setTimeout(() => setShareStatus('idle'), 2000)
    } catch {
      window.prompt('Copy this product link:', url)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-muted">
            <img
              key={activeImage}
              src={product.images[activeImage]}
              alt={product.title}
              className="h-full w-full object-cover transition-opacity duration-300"
            />
            {discount > 0 && (
              <Badge className="absolute left-4 top-4">-{discount}% OFF</Badge>
            )}
            {/* Prev / Next arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImage((activeImage - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImage((activeImage + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
                >
                  ›
                </button>
                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        i === activeImage ? 'w-5 bg-brand' : 'w-1.5 bg-white/60',
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                    activeImage === i ? 'border-brand' : 'border-transparent opacity-60 hover:opacity-100',
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

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatCurrency(displayPrice)}</span>
              {product.salePrice && (
                <span className="text-lg text-text-muted line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            <div className="flex gap-2 pr-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggle(product.id)}
                className={has(product.id) ? 'text-red-500' : ''}
                aria-label="Add to wishlist"
              >
                <Heart className={cn('h-5 w-5', has(product.id) && 'fill-current')} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={shareProduct}
                aria-label="Share product"
              >
                {shareStatus === 'copied' ? (
                  <Check className="h-5 w-5 text-brand" />
                ) : (
                  <Share2 className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          <p className="text-text-muted">{product.shortDescription}</p>

          <div>
            <p className="mb-3 text-sm font-semibold">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const stock = getSizeStock(size)
                const oos = stock <= 0
                const low = stock > 0 && stock <= 5
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={oos}
                    onClick={() => !oos && setSelectedSize(size)}
                    className={cn(
                      'relative flex h-11 w-11 items-center justify-center rounded-md border text-sm font-semibold transition-colors',
                      oos
                        ? 'cursor-not-allowed border-border text-text-muted opacity-40'
                        : selectedSize === size
                          ? 'border-brand bg-brand text-black'
                          : 'border-border hover:border-white',
                    )}
                    title={oos ? 'Out of stock' : low ? `Only ${stock} left` : undefined}
                  >
                    {size}
                    {oos && (
                      <span className="absolute inset-x-1 top-1/2 h-px -rotate-45 bg-text-muted/50" />
                    )}
                    {low && !oos && (
                      <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-500 text-[8px] font-bold text-white">
                        {stock}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            {lowStock && (
              <p className="text-xs text-orange-400">Only {selectedSizeStock} left in size {selectedSize}</p>
            )}
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
                onClick={() => setQuantity(Math.min(selectedSizeStock, quantity + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className={cn('text-sm font-medium', inStock ? (lowStock ? 'text-orange-400' : 'text-brand') : 'text-red-500')}>
            {!inStock ? `Out of stock in size ${selectedSize}` : lowStock ? `Only ${selectedSizeStock} left — order soon!` : 'In stock'}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <Button size="lg" className="flex-1" disabled={!inStock} onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1" disabled={!inStock} onClick={handleBuyNow}>
                Buy Now
              </Button>
            </div>
          </div>
          {shareStatus === 'copied' && (
            <p className="text-xs text-brand">Product link copied!</p>
          )}

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

      {/* Reviews */}
      <section className="mt-16 border-t border-border pt-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-brand">
              <MessageSquare className="h-3 w-3" /> Reviews
            </span>
            <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">
              Customer Reviews
            </h2>
            {reviews.length > 0 && (
              <div className="mt-2 flex items-center gap-2 text-sm text-text-muted">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
                    return (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < Math.round(avg) ? 'fill-brand text-brand' : 'text-border',
                        )}
                      />
                    )
                  })}
                </div>
                <span>
                  {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)} avg
                  · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Reviews list */}
          <div className="lg:col-span-2">
            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface-elevated p-8 text-center">
                <MessageSquare className="mx-auto h-8 w-8 text-text-muted" />
                <p className="mt-3 text-sm font-semibold">No reviews yet</p>
                <p className="mt-1 text-xs text-text-muted">Be the first to review this jersey!</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>

          {/* Write a review */}
          <div className="lg:col-span-1">
            <ReviewForm
              product={product}
              onSubmitted={() => {
                queryClient.invalidateQueries({ queryKey: ['reviews', 'product', product.id] })
                queryClient.invalidateQueries({ queryKey: ['reviews', 'recent'] })
              }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
