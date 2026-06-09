export const NAV_CATEGORIES = [
  { label: 'Clubs', slug: 'clubs' },
  { label: 'Countries', slug: 'countries' },
  { label: 'Retro', slug: 'retro' },
  { label: 'World Cup', slug: 'world-cup' },
] as const

export const FEATURED_COLLECTIONS = [
  {
    title: 'Club Collection',
    subtitle: 'Elite club jerseys from top leagues',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    slug: 'clubs',
  },
  {
    title: 'World Cup Collection',
    subtitle: 'National team kits for the biggest stage',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
    slug: 'world-cup',
  },
  {
    title: 'Retro Collection',
    subtitle: 'Classic jerseys from football history',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
    slug: 'retro',
  },
  {
    title: 'Training Collection',
    subtitle: 'Performance training kits',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80',
    slug: 'training-kits',
  },
] as const

export const TRUST_ITEMS = [
  'Imported Quality',
  'Secure Payments',
  'Fast Shipping',
  'Easy Returns',
] as const
