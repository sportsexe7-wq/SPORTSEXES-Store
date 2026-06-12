import { Link } from 'react-router-dom'
import { Crown, Truck, Tag, Zap, Star, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSEO } from '@/hooks/useSEO'

const PERKS = [
  { icon: Zap, title: 'Early Access', desc: 'First dibs on World Cup drops and limited editions' },
  { icon: Truck, title: 'Free Shipping', desc: 'Free delivery on every order, no minimum' },
  { icon: Tag, title: 'VIP Discounts', desc: 'Extra 15% off all jerseys, year-round' },
  { icon: Star, title: 'Priority Support', desc: 'Dedicated support line for VIP members' },
]

export function VipPage() {
  useSEO({
    title: 'VIP Membership — Coming Soon',
    description: 'SPORTSEXE VIP is launching soon. Exclusive perks, early access, and member-only discounts for true fans.',
    canonical: 'https://www.sportsexe.in/vip',
  })

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 ring-1 ring-brand/20">
          <Crown className="h-8 w-8 text-brand" />
        </div>

        <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
          <Clock className="h-3 w-3" /> Coming Soon
        </span>

        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          SPORTSEXE VIP
        </h1>
        <p className="mt-4 text-lg text-text-muted">
          The ultimate fan membership is almost here. Exclusive perks, early drops, and rewards
          built for fans who live the game.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {PERKS.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="relative overflow-hidden opacity-80">
              <CardContent className="p-6 text-left">
                <Icon className="h-6 w-6 text-brand" />
                <h3 className="mt-3 font-bold">{title}</h3>
                <p className="mt-1 text-sm text-text-muted">{desc}</p>
              </CardContent>
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-surface/90 via-surface/40 to-transparent pb-4">
                <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Coming Soon
                </span>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-brand/30 bg-brand/5 p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Launching Soon
          </p>
          <p className="mt-2 text-2xl font-black md:text-3xl">
            ₹499<span className="text-base font-normal text-text-muted">/year</span>
          </p>
          <p className="mt-2 text-sm text-text-muted">
            We&apos;re putting the finishing touches on VIP. Check back soon or shop jerseys in the meantime.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/shop">Shop Jerseys</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Get Notified</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
