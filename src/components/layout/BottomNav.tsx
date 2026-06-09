import { Link, useLocation } from 'react-router-dom'
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/utils/cn'

const NAV = [
  { to: '/', icon: Home, label: 'Home', exact: true },
  { to: '/shop', icon: ShoppingBag, label: 'Shop', exact: false },
  { to: '/cart', icon: ShoppingCart, label: 'Cart', exact: false },
  { to: '/account', icon: User, label: 'Profile', exact: false },
]

export function BottomNav() {
  const location = useLocation()
  const { count } = useCart()

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-2xl border border-border bg-surface/90 px-2 py-1.5 shadow-lg shadow-black/10 backdrop-blur-md">
        {NAV.map(({ to, icon: Icon, label, exact }) => {
          const active = exact ? location.pathname === to : location.pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'relative flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-[10px] font-semibold transition-colors',
                active ? 'bg-brand text-white' : 'text-text-muted hover:text-text',
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
              {to === '/cart' && count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-black text-white ring-2 ring-surface">
                  {count}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
