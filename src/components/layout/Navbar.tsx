import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, User, Menu, Crown } from 'lucide-react'
import { MAIN_NAV } from '@/constants/navigation'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { cn } from '@/utils/cn'

export function Navbar() {
  const location = useLocation()
  const { count } = useCart()
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('sportsexe_auth') === 'true'

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-4 md:h-18">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="mt-8 flex flex-col gap-1">
                <Link to="/" className="mb-4 text-xl font-black tracking-tighter">
                  SPORT<span className="text-brand">SEXE</span>
                </Link>
                {MAIN_NAV.map((item) => (
                  <SheetClose asChild key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        'rounded-lg px-3 py-2.5 text-base font-medium transition-colors',
                        isActive(item.to) ? 'bg-brand text-black' : 'hover:text-brand',
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link to="/vip" className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 font-medium text-brand">
                    <Crown className="h-4 w-4" /> Join VIP
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to={isLoggedIn ? '/account' : '/login'}
                    className="mt-2 rounded-lg px-3 py-2.5 font-medium hover:text-brand"
                  >
                    {isLoggedIn ? 'My Profile' : 'Login'}
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="shrink-0 text-xl font-black tracking-tighter md:text-2xl">
            SPORT<span className="text-brand">SEXE</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive(item.to)
                    ? 'text-white'
                    : 'text-text-muted hover:text-white',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link to="/vip">
              <Button
                size="sm"
                className="gap-1.5 bg-brand text-black hover:bg-brand-dark font-bold"
              >
                <Crown className="h-3.5 w-3.5" />
                VIP
              </Button>
            </Link>
            <Link to={isLoggedIn ? '/account' : '/login'}>
              <Button variant="ghost" size="icon" title={isLoggedIn ? 'My Profile' : 'Login'}>
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
              </Button>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-black">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
