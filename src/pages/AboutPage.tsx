import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-sm font-semibold uppercase tracking-widest text-brand">About SPORTSEXE</span>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
          Built for Fans Who Live the Game
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-text-muted">
          SPORTSEXE was founded in Mumbai with one mission: make premium sports jerseys accessible
          to every fan in India. We saw friends paying triple for average quality kits and knew
          there had to be a better way.
        </p>
        <p className="mt-4 leading-relaxed text-text-muted">
          Today we serve over 50,000 customers with imported-quality football, cricket, kabaddi
          and basketball jerseys — plus a full custom jersey builder where you pick team, colors,
          name and number with a live preview.
        </p>

        <div className="my-12 grid gap-6 sm:grid-cols-3">
          {[
            { title: 'Quality First', desc: 'Every jersey inspected before it ships. No compromises on fabric or print.' },
            { title: 'Fan Pricing', desc: 'Direct sourcing means fair prices without the retail markup.' },
            { title: 'Fast Delivery', desc: 'Express shipping across India. Most orders arrive in 3–5 days.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-surface-elevated p-6">
              <h3 className="font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/shop">Shop Jerseys</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
