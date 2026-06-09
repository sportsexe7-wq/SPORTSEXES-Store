import { useSyncExternalStore } from 'react'
import { cartStore } from '@/features/cart/cartStore'

export function useCart() {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getItems,
    () => [],
  )

  const count = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getItemCount,
    () => 0,
  )

  const coupon = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getCoupon,
    () => undefined,
  )

  return {
    items,
    count,
    coupon,
    addItem: cartStore.addItem,
    updateQuantity: cartStore.updateQuantity,
    removeItem: cartStore.removeItem,
    clear: cartStore.clear,
    setCoupon: cartStore.setCoupon,
  }
}
