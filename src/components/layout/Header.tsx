import { Crown, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { user } = useAuth()
  return (
<div className="border-b border-border bg-surface px-4 h-18 flex items-center">
<div className="container mx-auto flex items-center justify-between">
  <Link to="/" className="inline-flex items-center">
    <img
      src="/Sportsexe.png"
      alt="SPORTSEXE"
      className="h-35 w-auto origin-left" 
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
)
}