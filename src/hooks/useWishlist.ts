import { useSyncExternalStore } from 'react'
import { wishlistStore } from '@/features/cart/cartStore'

export function useWishlist() {
  const ids = useSyncExternalStore(
    wishlistStore.subscribe,
    wishlistStore.getIds,
    () => [],
  )

  return {
    ids,
    toggle: wishlistStore.toggle,
    has: wishlistStore.has,
  }
}
