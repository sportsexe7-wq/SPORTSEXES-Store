export const MAIN_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const

export const SOCIAL_LINKS = [
  { platform: 'Instagram', url: 'https://www.instagram.com/sport_exa?igsh=MXN4a3k4MmVueWo5aw==', label: 'IG' },
  { platform: 'YouTube', url: 'https://youtube.com/@koustav1111?si=gDRHFs8wO9Q6_owC', label: 'YT' },
] as const

export const CONTACT_INFO = {
  email: 'sportsexe7@gmail.com',
  address: 'Mumbai, Maharashtra, India',
  hours: 'Mon–Sat, 10am – 8pm IST',
} as const
