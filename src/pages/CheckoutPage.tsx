import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/utils/cn'

const shippingSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Valid pincode required'),
})

const paymentSchema = z.object({
  cardNumber: z.string().min(16, 'Valid card number required'),
  expiry: z.string().min(5, 'MM/YY required'),
  cvv: z.string().min(3, 'CVV required'),
})

type ShippingForm = z.infer<typeof shippingSchema>
type PaymentForm = z.infer<typeof paymentSchema>

const STEPS = ['Shipping', 'Payment', 'Review'] as const

export function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [shippingData, setShippingData] = useState<ShippingForm | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentForm | null>(null)
  const { clear } = useCart()
  const navigate = useNavigate()

  const shippingForm = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
  })

  const paymentForm = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
  })

  const onShippingSubmit = (data: ShippingForm) => {
    setShippingData(data)
    setStep(1)
  }

  const onPaymentSubmit = (data: PaymentForm) => {
    setPaymentData(data)
    setStep(2)
  }

  const placeOrder = () => {
    clear()
    navigate('/account/orders')
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

      <div className="mx-auto max-w-xl">
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

        {step === 1 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-6 text-lg font-bold">Payment Details</h2>
              <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="4242 4242 4242 4242" className="mt-1" {...paymentForm.register('cardNumber')} />
                  {paymentForm.formState.errors.cardNumber && (
                    <p className="mt-1 text-xs text-red-500">{paymentForm.formState.errors.cardNumber.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input id="expiry" placeholder="MM/YY" className="mt-1" {...paymentForm.register('expiry')} />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" className="mt-1" {...paymentForm.register('cvv')} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(0)}>Back</Button>
                  <Button type="submit" className="flex-1" size="lg">Review Order</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && shippingData && (
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-bold">Review Your Order</h2>
              <div>
                <p className="text-sm font-semibold">Shipping to</p>
                <p className="text-sm text-text-muted">
                  {shippingData.fullName}<br />
                  {shippingData.address}, {shippingData.city}<br />
                  {shippingData.state} - {shippingData.pincode}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-semibold">Payment</p>
                <p className="text-sm text-text-muted">
                  Card ending in {paymentData?.cardNumber.slice(-4)}
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1" size="lg" onClick={placeOrder}>
                  Place Order
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
