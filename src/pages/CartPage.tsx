import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { productService } from '@/services/productService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format'
import { useState } from 'react'

const SHIPPING_THRESHOLD = 2999
const SHIPPING_COST = 99

export function CartPage() {
  const { items, updateQuantity, removeItem, setCoupon, coupon } = useCart()
  const [couponInput, setCouponInput] = useState(coupon ?? '')
  const [couponError, setCouponError] = useState('')

  const productIds = items.map((i) => i.productId)

  const { data: products = [] } = useQuery({
    queryKey: ['cart-products', productIds],
    queryFn: async () => {
      const results = await Promise.all(productIds.map((id) => productService.getById(id)))
      return results.filter(Boolean)
    },
    enabled: productIds.length > 0,
  })

  const cartLines = useMemo(() => {
    return items.map((item) => {
      const product = products.find((p) => p?.id === item.productId)
      const price = product?.salePrice ?? product?.price ?? 0
      return { ...item, product, price, lineTotal: price * item.quantity }
    })
  }, [items, products])

  const subtotal = cartLines.reduce((sum, l) => sum + l.lineTotal, 0)
  const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST
  const discount = coupon === 'SPORT10' ? Math.round(subtotal * 0.1) : 0
  const total = subtotal + shipping - discount

  const applyCoupon = () => {
    if (couponInput.toUpperCase() === 'SPORT10') {
      setCoupon('SPORT10')
      setCouponError('')
    } else {
      setCouponError('Invalid coupon code')
      setCoupon(undefined)
    }
  }

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-text-muted" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-text-muted">Discover premium jerseys and gear up for match day.</p>
        <Button asChild className="mt-6">
          <Link to="/shop">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cartLines.map((line) => (
            <Card key={`${line.productId}-${line.size}`}>
              <CardContent className="flex gap-4 p-4">
                {line.product && (
                  <img
                    src={line.product.images[0]}
                    alt={line.product.title}
                    className="h-24 w-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      to={`/product/${line.product?.slug}`}
                      className="font-semibold hover:text-brand"
                    >
                      {line.product?.title}
                    </Link>
                    <p className="text-sm text-text-muted">Size: {line.size}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(line.productId, line.size, line.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{line.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(line.productId, line.size, line.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{formatCurrency(line.lineTotal)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(line.productId, line.size)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-bold">Order Summary</h2>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-brand">
                  <span>Discount (SPORT10)</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <Button variant="outline" onClick={applyCoupon}>Apply</Button>
                </div>
                {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                <p className="text-xs text-text-muted">Try: SPORT10 for 10% off</p>
              </div>

              <Button asChild className="w-full" size="lg">
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
