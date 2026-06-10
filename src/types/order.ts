import type { ProductSize } from './product'

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  productId: string
  title: string
  image: string
  size: ProductSize
  quantity: number
  price: number
}

export interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  status: OrderStatus
  paymentMethod: 'online' | 'cod'
  paymentStatus: 'pending' | 'paid' | 'failed'
  subtotal: number
  shipping: number
  discount: number
  total: number
  couponCode?: string
  shippingAddress: ShippingAddress
  trackingNumber?: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  createdAt: string
  updatedAt: string
}
