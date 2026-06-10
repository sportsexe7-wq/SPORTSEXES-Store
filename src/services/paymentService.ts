declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill: { name: string; email: string; contact: string }
  theme: { color: string }
  handler: (response: RazorpayResponse) => void
  modal?: { ondismiss?: () => void }
}

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface RazorpayInstance {
  open(): void
}

const BASE = import.meta.env.VITE_FUNCTIONS_BASE_URL as string

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'))
    document.body.appendChild(script)
  })
}

export async function createRazorpayOrder(amount: number, orderId: string) {
  const res = await fetch(`${BASE}/createRazorpayOrder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: Math.round(amount * 100), orderId }),
  })
  if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to create payment order')
  return res.json() as Promise<{ razorpayOrderId: string; amount: number; currency: string }>
}

export async function verifyPayment(payload: {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
  orderId: string
}) {
  const res = await fetch(`${BASE}/verifyPayment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error((await res.json()).error ?? 'Payment verification failed')
  return res.json() as Promise<{ success: boolean }>
}

export async function triggerCreateShipment(orderId: string) {
  const res = await fetch(`${BASE}/createShipment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error('createShipment failed:', err)
  }
}

export async function openRazorpayCheckout(opts: {
  amount: number
  razorpayOrderId: string
  currency: string
  prefill: { name: string; email: string; contact: string }
}): Promise<RazorpayResponse> {
  await loadRazorpayScript()
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID as string,
      amount: opts.amount,
      currency: opts.currency,
      name: 'SPORTSEXE',
      description: 'Football Jersey Order',
      order_id: opts.razorpayOrderId,
      prefill: opts.prefill,
      theme: { color: '#d4f53c' },
      handler: resolve,
      modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
    })
    rzp.open()
  })
}
