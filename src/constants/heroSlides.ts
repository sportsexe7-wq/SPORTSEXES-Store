import { REVIEWS } from './reviews'

const PRODUCT_VIDEO =
  'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-dribbling-the-ball-2098-large.mp4'

export const HERO_SLIDES = [
  {
    id: 'asmr',
    type: 'asmr' as const,
    video: PRODUCT_VIDEO,
    poster: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80',
  },
  {
    id: 'portugal',
    type: 'portugal' as const,
    image: '/portugal-jerseys.jpeg',
  },
  {
    id: 'flags',
    type: 'flags' as const,
    image: '/Flags.jpeg',
  },
  {
    id: 'review',
    type: 'review' as const,
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=80',
    review: REVIEWS[0],
  },
  {
    id: 'latest-launches',
    type: 'latest-launches' as const,
    image: '/club-jerseys.jpeg',
  },
]

export type HeroSlide = (typeof HERO_SLIDES)[number]
