import { SHIPPING_THRESHOLD, SHIPPING_COST, COD_FEE } from '@/constants/checkout'

export function calculateShipping(
  subtotal: number,
  discount: number,
  freeShipping: boolean,
): number {
  if (freeShipping) return 0
  if (subtotal - discount >= SHIPPING_THRESHOLD) return 0
  return SHIPPING_COST
}

export function calculateCodFee(paymentMethod: 'online' | 'cod'): number {
  return paymentMethod === 'cod' ? COD_FEE : 0
}

export function calculateOrderTotal(
  subtotal: number,
  discount: number,
  freeShipping: boolean,
  paymentMethod: 'online' | 'cod',
) {
  const shipping = calculateShipping(subtotal, discount, freeShipping)
  const codFee = calculateCodFee(paymentMethod)
  const total = subtotal - discount + shipping + codFee
  return { shipping, codFee, total }
}
