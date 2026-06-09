import { REVIEWS } from './reviews'

const PRODUCT_VIDEO =
  'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-dribbling-the-ball-2098-large.mp4'

export const HERO_SLIDES = [
  {
    id: 'wear-the-game',
    type: 'wear-the-game' as const,
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1600&q=80',
  },
  {
    id: 'review',
    type: 'review' as const,
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=80',
    review: REVIEWS[0],
  },
  {
    id: 'product-video',
    type: 'product-video' as const,
    video: PRODUCT_VIDEO,
    poster: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80',
  },
  {
    id: 'world-cup',
    type: 'world-cup' as const,
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1600&q=80',
  },
  {
    id: 'retro-collection',
    type: 'retro-collection' as const,
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1600&q=80',
  },
  {
    id: 'world-cup-flags',
    type: 'world-cup-flags' as const,
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1600&q=80',
  },
  {
    id: 'accessories',
    type: 'accessories' as const,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80',
  },
]

export type HeroSlide = (typeof HERO_SLIDES)[number]
