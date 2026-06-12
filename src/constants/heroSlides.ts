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
    id: 'argentina',
    type: 'argentina' as const,
    href: '/category/argentina',
    video: '/Argentina.mp4',
    image: '/argentina-jerseys.jpeg',
  },
  {
    id: 'latest-launches',
    type: 'latest-launches' as const,
    href: '/shop',
    video: 'ClubJersey.mp4',
    image: '/club-jerseys.jpeg',
  },
]

export type HeroSlide = (typeof HERO_SLIDES)[number]
