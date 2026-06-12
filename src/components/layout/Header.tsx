import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, AlertTriangle, Crown, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* Logo + VIP + Login */}
      <div className="border-b border-border bg-surface px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center overflow-visible">
            <img
              src="/Sportsexe.png"
              alt="SPORTSEXE"
              className="h-14 w-auto origin-left scale-[2.2]"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/vip"
              className="flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand hover:bg-brand/20 transition-colors"
            >
              <Crown className="h-3 w-3" /> VIP
            </Link>
            <Link
              to={user ? '/account' : '/login'}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold text-text hover:border-brand/40 hover:text-brand transition-colors"
            >
              <User className="h-3 w-3" />
              {user ? (user.displayName?.split(' ')[0] ?? 'Account') : 'Login'}
            </Link>
          </div>
        </div>
      </div>

      {/* Fake-payment warning marquee */}
      <div className="overflow-hidden bg-orange-500 py-1 text-[10px] font-semibold text-white md:text-[11px]">
        <div className="animate-marquee flex w-max gap-0">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex shrink-0 items-center">
              {Array.from({ length: 6 }).map((_, j) => (
                <span key={j} className="flex items-center px-8">
                  <AlertTriangle className="mr-1.5 inline h-2.5 w-2.5 shrink-0" />
                  BEWARE of fake payment calls — we NEVER ask for OTPs, card details or bank info. Contact us only at support@sportsexe.com
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="border-b border-border bg-surface px-4 py-3">
        <div className="container mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jerseys, teams, countries…"
              className="h-10 w-full rounded-xl border border-border bg-surface-elevated pl-9 pr-4 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </form>
        </div>
      </div>
    </>
  )
}
