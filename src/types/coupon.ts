export type CouponType = 'percentage' | 'fixed' | 'free-shipping'

export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number
  minOrder?: number
  active: boolean
  usageCount: number
  expiresAt?: string
}
