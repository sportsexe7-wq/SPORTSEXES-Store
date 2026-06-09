import type { ProductSize } from './product'

export interface CartItem {
  productId: string
  size: ProductSize
  quantity: number
}

export interface CartState {
  items: CartItem[]
  couponCode?: string
}
