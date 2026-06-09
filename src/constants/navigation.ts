export const MAIN_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const

export const SOCIAL_LINKS = [
  { platform: 'Instagram', url: 'https://instagram.com/sportsexe', label: 'IG' },
  { platform: 'YouTube', url: 'https://youtube.com/sportsexe', label: 'YT' },
] as const

export const CONTACT_INFO = {
  email: 'support@sportsexe.com',
  phone: '+91 98765 43210',
  address: 'Mumbai, Maharashtra, India',
  hours: 'Mon–Sat, 10am – 8pm IST',
} as const
