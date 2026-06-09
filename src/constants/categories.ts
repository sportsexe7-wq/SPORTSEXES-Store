export const NAV_CATEGORIES = [
  { label: 'Clubs', slug: 'clubs' },
  { label: 'Countries', slug: 'countries' },
  { label: 'Retro', slug: 'retro' },
  { label: 'World Cup', slug: 'world-cup' },
] as const

export const FEATURED_COLLECTIONS = [
  {
    title: 'Football Jerseys',
    subtitle: 'Clubs, nationals & retro kits',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
    href: '/shop',
    cta: 'Shop All Jerseys',
  },
  {
    title: 'IPL Jerseys',
    subtitle: 'Official-style cricket team kits',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    href: '/category/ipl',
    cta: 'Shop IPL',
  },
  {
    title: 'Accessories',
    subtitle: 'Socks, shin guards & fan flags',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    href: '/category/accessories',
    cta: 'Shop Accessories',
  },
] as const

export const TRUST_ITEMS = [
  'Imported Quality',
  'Secure Payments',
  'Premium Fabric',
] as const
