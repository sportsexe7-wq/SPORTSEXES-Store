import { Link, Outlet, useLocation } from 'react-router-dom'
import { User, Package, Heart, MailWarning } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuth } from '@/contexts/AuthContext'

const NAV = [
  { to: '/account', label: 'Profile', icon: User, exact: true },
  { to: '/account/orders', label: 'Orders', icon: Package },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
]

export function AccountLayout() {
  const location = useLocation()
  const { user, resendVerification } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {user && !user.emailVerified && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-orange-400">
            <MailWarning className="h-4 w-4 shrink-0" />
            Your email is not verified. Check your inbox (or Spam folder) for the verification link.
          </div>
          <button
            type="button"
            onClick={resendVerification}
            className="text-xs font-semibold text-orange-400 underline underline-offset-2 hover:text-orange-300"
          >
            Resend email
          </button>
        </div>
      )}
      <h1 className="mb-8 text-3xl font-bold tracking-tight md:text-4xl">My Account</h1>
      <div className="grid gap-8 lg:grid-cols-4">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
          {NAV.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? location.pathname === to : location.pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
                  active ? 'bg-brand text-black' : 'text-text-muted hover:bg-surface-muted hover:text-white',
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="lg:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
