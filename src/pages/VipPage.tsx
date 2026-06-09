import { Link } from 'react-router-dom'
import { Crown, Truck, Tag, Zap, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const PERKS = [
  { icon: Zap, title: 'Early Access', desc: 'First dibs on World Cup drops and limited editions' },
  { icon: Truck, title: 'Free Shipping', desc: 'Free delivery on every order, no minimum' },
  { icon: Tag, title: 'VIP Discounts', desc: 'Extra 15% off all jerseys, year-round' },
  { icon: Star, title: 'Priority Support', desc: 'Dedicated support line for VIP members' },
]

export function VipPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
          <Crown className="h-8 w-8 text-brand" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
          Join SPORTSEXE VIP
        </h1>
        <p className="mt-4 text-lg text-text-muted">
          Unlock exclusive perks for ₹499/year. The ultimate fan membership.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {PERKS.map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardContent className="p-6 text-left">
                <Icon className="h-6 w-6 text-brand" />
                <h3 className="mt-3 font-bold">{title}</h3>
                <p className="mt-1 text-sm text-text-muted">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-brand/30 bg-brand/5 p-8">
          <p className="text-3xl font-black">
            ₹499<span className="text-base font-normal text-text-muted">/year</span>
          </p>
          <p className="mt-2 text-sm text-text-muted">Cancel anytime. Pays for itself on your first order.</p>
          <Button asChild size="lg" className="mt-6">
            <Link to="/login">Join VIP Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
