import type { Banner } from '@/types'

export const mockBanners: Banner[] = [
  {
    id: '1',
    title: 'World Cup 2026',
    subtitle: 'Get ready for the biggest tournament. Shop national team kits now.',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1600&q=80',
    buttonText: 'Shop Now',
    buttonLink: '/category/world-cup',
    priority: 1,
    active: true,
  },
  {
    id: '2',
    title: 'Retro Collection',
    subtitle: 'Relive football history with authentic vintage jerseys.',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=80',
    buttonText: 'Explore Now',
    buttonLink: '/category/retro',
    priority: 2,
    active: true,
  },
  {
    id: '3',
    title: 'Argentina Collection',
    subtitle: 'Celebrate La Albiceleste with premium home and away kits.',
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1600&q=80',
    buttonText: 'View Jerseys',
    buttonLink: '/category/argentina',
    priority: 3,
    active: true,
  },
]
