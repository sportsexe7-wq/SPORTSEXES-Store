import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Coupon } from '@/types'

export interface CouponValidation {
  coupon?: Coupon
  discount: number
  freeShipping: boolean
  error?: string
}

export const couponService = {
  async findByCode(code: string): Promise<Coupon | null> {
    const normalized = code.trim().toUpperCase()
    if (!normalized) return null

    const q = query(collection(db, 'coupons'), where('code', '==', normalized))
    const snap = await getDocs(q)
    if (snap.empty) return null

    const d = snap.docs[0]
    return { id: d.id, ...d.data() } as Coupon
  },

  validate(coupon: Coupon | undefined, subtotal: number): CouponValidation {
    if (!coupon) return { discount: 0, freeShipping: false }

    if (!coupon.active) {
      return { coupon, discount: 0, freeShipping: false, error: 'This coupon is inactive' }
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      return { coupon, discount: 0, freeShipping: false, error: 'This coupon has expired' }
    }
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return {
        coupon,
        discount: 0,
        freeShipping: false,
        error: `Minimum order ₹${coupon.minOrder} required`,
      }
    }

    switch (coupon.type) {
      case 'percentage':
        return {
          coupon,
          discount: Math.round((subtotal * coupon.value) / 100),
          freeShipping: false,
        }
      case 'fixed':
        return {
          coupon,
          discount: Math.min(coupon.value, subtotal),
          freeShipping: false,
        }
      case 'free-shipping':
        return { coupon, discount: 0, freeShipping: true }
    }
  },
}
