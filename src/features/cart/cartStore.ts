import type { CartItem, Coupon, ProductSize } from '@/types'

const CART_KEY = 'sportsexe_cart'
const WISHLIST_KEY = 'sportsexe_wishlist'
const CART_META_KEY = 'sportsexe_cart_meta'

const EMPTY_CART: CartItem[] = []
const EMPTY_WISHLIST: string[] = []

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

type CartListener = () => void
const listeners = new Set<CartListener>()

function notifyListeners() {
  listeners.forEach((l) => l())
}

function subscribe(listener: CartListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// In-memory snapshots — must keep stable references for useSyncExternalStore
let cartItems: CartItem[] = loadFromStorage(CART_KEY, EMPTY_CART)
let wishlistIds: string[] = loadFromStorage(WISHLIST_KEY, EMPTY_WISHLIST)
let coupon: Coupon | undefined = loadFromStorage<{ coupon?: Coupon }>(
  CART_META_KEY,
  {},
).coupon

function getItems(): CartItem[] {
  return cartItems
}

function getItemCount(): number {
  return cartItems.reduce((sum, i) => sum + i.quantity, 0)
}

function getCoupon(): Coupon | undefined {
  return coupon
}

function setCartItems(items: CartItem[]) {
  cartItems = items.length === 0 ? EMPTY_CART : items
  saveToStorage(CART_KEY, cartItems)
  notifyListeners()
}

function addItem(productId: string, size: ProductSize, quantity = 1): void {
  const items = [...cartItems]
  const existing = items.find((i) => i.productId === productId && i.size === size)
  if (existing) {
    existing.quantity += quantity
  } else {
    items.push({ productId, size, quantity })
  }
  setCartItems(items)
}

function updateQuantity(productId: string, size: ProductSize, quantity: number): void {
  const items = cartItems.map((item) =>
    item.productId === productId && item.size === size
      ? { ...item, quantity: Math.max(1, quantity) }
      : item,
  )
  setCartItems(items)
}

function removeItem(productId: string, size: ProductSize): void {
  setCartItems(cartItems.filter((i) => !(i.productId === productId && i.size === size)))
}

function clear(): void {
  cartItems = EMPTY_CART
  saveToStorage(CART_KEY, EMPTY_CART)
  notifyListeners()
}

function setCoupon(next: Coupon | undefined): void {
  coupon = next
  saveToStorage(CART_META_KEY, { coupon: next })
  notifyListeners()
}

export const cartStore = {
  getItems,
  getItemCount,
  getCoupon,
  subscribe,
  addItem,
  updateQuantity,
  removeItem,
  clear,
  setCoupon,
}

function getWishlistIds(): string[] {
  return wishlistIds
}

function setWishlistIds(ids: string[]) {
  wishlistIds = ids.length === 0 ? EMPTY_WISHLIST : ids
  saveToStorage(WISHLIST_KEY, wishlistIds)
  notifyListeners()
}

function toggleWishlist(productId: string): void {
  const ids = wishlistIds.includes(productId)
    ? wishlistIds.filter((id) => id !== productId)
    : [...wishlistIds, productId]
  setWishlistIds(ids)
}

function hasInWishlist(productId: string): boolean {
  return wishlistIds.includes(productId)
}

export const wishlistStore = {
  getIds: getWishlistIds,
  subscribe,
  toggle: toggleWishlist,
  has: hasInWishlist,
}
