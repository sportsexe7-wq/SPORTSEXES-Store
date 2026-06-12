import { REVIEWS } from './reviews'

const PRODUCT_VIDEO =
  '/Fabric.mp4'

export const HERO_SLIDES = [
  {
    id: 'asmr',
    type: 'asmr' as const,
    href: '/shop',
    video: PRODUCT_VIDEO,
    poster: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80',
  },
  {
    id: 'portugal',
    type: 'portugal' as const,
    href: '/category/portugal',
    video: '/Portugal.mp4', 
    image: '/portugal-jerseys.jpeg',
  },
  {
    id: 'flags',
    type: 'flags' as const,
    href: '/category/flags',
    image: '/Flags.jpeg',
  },
  {
    id: 'review',
    type: 'review' as const,
    href: '/shop',
    video: '/Argentina.mp4',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=80',
    review: REVIEWS[0],
  },
  {
    id: 'latest-launches',
    type: 'latest-launches' as const,
    href: '/shop',
    image: '/club-jerseys.jpeg',
  },
]

export type HeroSlide = (typeof HERO_SLIDES)[number]
