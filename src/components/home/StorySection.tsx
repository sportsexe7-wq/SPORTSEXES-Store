import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function StorySection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* World Cup Edition */}
        <div className="relative mb-16 overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1400&q=80"
            alt="World Cup edition"
            className="aspect-[21/9] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center p-8 md:p-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-lg"
            >
              <span className="text-sm font-semibold uppercase tracking-widest text-brand">
                World Cup 2026 Edition
              </span>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                The Biggest Stage Deserves the Best Kits
              </h2>
              <p className="mt-3 text-white/75">
                Official-style national team jerseys for Argentina, Brazil, France, Germany
                and more. Imported quality, fan-first pricing.
              </p>
              <Button asChild className="mt-6">
                <Link to="/category/world-cup">Shop World Cup</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Brand Story */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">
              Our Story
            </span>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Born from a Love of the Beautiful Game
            </h2>
            <p className="mt-4 leading-relaxed text-text-muted">
              SPORTSEXE started with a simple idea: every fan deserves access to premium jerseys
              without the premium markup. What began as a small collection of imported football kits
              has grown into India&apos;s go-to destination for football, cricket, kabaddi and custom sportswear.
            </p>
            <p className="mt-4 leading-relaxed text-text-muted">
              We source directly from trusted manufacturers, obsess over stitch quality and fit,
              and ship fast across India. From World Cup editions to fully custom kits with your
              name on the back — we&apos;re here for every match day moment.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/about">Read Our Full Story</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '500+', label: 'Jersey Designs' },
              { value: '4.8★', label: 'Average Rating' },
              { value: '48hr', label: 'Express Shipping' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-surface-elevated p-6 text-center"
              >
                <p className="text-2xl font-black text-brand md:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm text-text-muted">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
