import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, CreditCard, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/utils/cn'
import { orderService } from '@/services/orderService'
import { productService } from '@/services/productService'
import { formatCurrency } from '@/utils/format'
import type { Product } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import {
  createRazorpayOrder,
  verifyPayment,
  openRazorpayCheckout,
  triggerCreateShipment,
} from '@/services/paymentService'

const shippingSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Valid pincode required'),
})

type ShippingForm = z.infer<typeof shippingSchema>

const STEPS = ['Shipping', 'Payment', 'Review'] as const

export function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [shippingData, setShippingData] = useState<ShippingForm | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [cartProducts, setCartProducts] = useState<Record<string, Product>>({})
  const { items, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all(items.map((i) => productService.getById(i.productId))).then((results) => {
      const map: Record<string, Product> = {}
      results.forEach((p) => { if (p) map[p.id] = p })
      setCartProducts(map)
    })
  }, [items])

  const shippingForm = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: user?.displayName ?? '',
      email: user?.email ?? '',
    },
  })

  const onShippingSubmit = (data: ShippingForm) => {
    setShippingData(data)
    setStep(1)
  }

  const buildOrderItems = async () => {
    return Promise.all(
      items.map(async (item) => {
        const product = cartProducts[item.productId] ?? await productService.getById(item.productId)
        return {
          productId: item.productId,
          title: product?.title ?? 'Product',
          image: product?.images[0] ?? '',
          size: item.size,
          quantity: item.quantity,
          price: product?.salePrice ?? product?.price ?? 0,
        }
      }),
    )
  }

  const placeOrder = async () => {
    if (!shippingData) return
    setPlacing(true)
    setError('')

    try {
      const orderItems = await buildOrderItems()
      const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0)
      const shipping = subtotal >= 2000 ? 0 : 99
      const total = subtotal + shipping
      const now = new Date().toISOString()

      if (paymentMethod === 'online') {
        // 1. Create a Firestore order (pending/unpaid)
        const order = await orderService.create({
          userId: user?.uid ?? 'guest',
          items: orderItems,
          status: 'pending',
          paymentMethod: 'online',
          paymentStatus: 'pending',
          subtotal,
          shipping,
          discount: 0,
          total,
          shippingAddress: shippingData,
          createdAt: now,
          updatedAt: now,
        })

        // 2. Create Razorpay order via cloud function
        const { razorpayOrderId, amount, currency } = await createRazorpayOrder(total, order.id)

        // 3. Open Razorpay checkout
        const paymentResponse = await openRazorpayCheckout({
          amount,
          razorpayOrderId,
          currency,
          prefill: {
            name: shippingData.fullName,
            email: shippingData.email,
            contact: shippingData.phone,
          },
        })

        // 4. Verify HMAC on server → marks order as paid
        await verifyPayment({
          razorpayOrderId: paymentResponse.razorpay_order_id,
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpaySignature: paymentResponse.razorpay_signature,
          orderId: order.id,
        })

        // 5. Create Shiprocket shipment (fire & forget)
        triggerCreateShipment(order.id)

        clear()
        navigate(`/account/orders?new=${order.id}`)
      } else {
        // COD flow: just create order
        const order = await orderService.create({
          userId: user?.uid ?? 'guest',
          items: orderItems,
          status: 'pending',
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          subtotal,
          shipping,
          discount: 0,
          total,
          shippingAddress: shippingData,
          createdAt: now,
          updatedAt: now,
        })

        triggerCreateShipment(order.id)
        clear()
        navigate(`/account/orders?new=${order.id}`)
      }
    } catch (err: any) {
      if (err?.message !== 'Payment cancelled') {
        setError(err?.message ?? 'Something went wrong. Please try again.')
      }
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      {/* Steps */}
      <div className="mb-10 flex items-center justify-center gap-4">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                i <= step ? 'bg-brand text-black' : 'bg-surface-muted text-text-muted',
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn('hidden text-sm font-medium sm:block', i <= step ? 'text-white' : 'text-text-muted')}>
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div className={cn('h-px w-8 sm:w-16', i < step ? 'bg-brand' : 'bg-border')} />
            )}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-xl space-y-4">

        {/* ── Step 0: Shipping ── */}
        {step === 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-6 text-lg font-bold">Shipping Information</h2>
              <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-4">
                {(['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'] as const).map((field) => (
                  <div key={field}>
                    <Label htmlFor={field} className="capitalize">
                      {field === 'pincode' ? 'PIN Code' : field.replace(/([A-Z])/g, ' $1')}
                    </Label>
                    <Input
                      id={field}
                      className="mt-1"
                      type={field === 'email' ? 'email' : 'text'}
                      {...shippingForm.register(field)}
                    />
                    {shippingForm.formState.errors[field] && (
                      <p className="mt-1 text-xs text-red-500">
                        {shippingForm.formState.errors[field]?.message}
                      </p>
                    )}
                  </div>
                ))}
                <Button type="submit" className="w-full" size="lg">
                  Continue to Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ── Step 1: Payment method ── */}
        {step === 1 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-6 text-lg font-bold">Payment Method</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors',
                    paymentMethod === 'online' ? 'border-brand bg-brand/5' : 'border-border hover:border-brand/40',
                  )}
                >
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', paymentMethod === 'online' ? 'bg-brand text-black' : 'bg-surface-muted text-text-muted')}>
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Pay Online</p>
                    <p className="text-xs text-text-muted">UPI · Cards · Net Banking · Wallets via Razorpay</p>
                  </div>
                  <div className={cn('ml-auto h-5 w-5 rounded-full border-2 flex items-center justify-center', paymentMethod === 'online' ? 'border-brand' : 'border-border')}>
                    {paymentMethod === 'online' && <div className="h-2.5 w-2.5 rounded-full bg-brand" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors',
                    paymentMethod === 'cod' ? 'border-brand bg-brand/5' : 'border-border hover:border-brand/40',
                  )}
                >
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', paymentMethod === 'cod' ? 'bg-brand text-black' : 'bg-surface-muted text-text-muted')}>
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-xs text-text-muted">Pay when your order arrives</p>
                  </div>
                  <div className={cn('ml-auto h-5 w-5 rounded-full border-2 flex items-center justify-center', paymentMethod === 'cod' ? 'border-brand' : 'border-border')}>
                    {paymentMethod === 'cod' && <div className="h-2.5 w-2.5 rounded-full bg-brand" />}
                  </div>
                </button>
              </div>

              <div className="mt-6 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button className="flex-1" size="lg" onClick={() => setStep(2)}>Review Order</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Step 2: Review ── */}
        {step === 2 && shippingData && (
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-bold">Review Your Order</h2>

              <div>
                <p className="text-sm font-semibold">Shipping to</p>
                <p className="mt-1 text-sm text-text-muted">
                  {shippingData.fullName}<br />
                  {shippingData.address}, {shippingData.city}<br />
                  {shippingData.state} — {shippingData.pincode}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-semibold">Payment</p>
                <p className="mt-1 text-sm text-text-muted">
                  {paymentMethod === 'online' ? 'Online Payment (Razorpay)' : 'Cash on Delivery'}
                </p>
              </div>
              <Separator />
              <div className="space-y-3">
                {items.map((item) => {
                  const p = cartProducts[item.productId]
                  const price = p?.salePrice ?? p?.price ?? 0
                  return (
                    <div key={`${item.productId}-${item.size}`} className="flex items-center gap-3">
                      {p?.images[0] && (
                        <img src={p.images[0]} alt="" className="h-12 w-10 rounded object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p?.title ?? '—'}</p>
                        <p className="text-xs text-text-muted">Size {item.size} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">{formatCurrency(price * item.quantity)}</p>
                    </div>
                  )
                })}
              </div>

              {error && (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1" size="lg" onClick={placeOrder} disabled={placing}>
                  {placing
                    ? paymentMethod === 'online' ? 'Opening payment…' : 'Placing order…'
                    : paymentMethod === 'online' ? 'Pay Now' : 'Place Order (COD)'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
