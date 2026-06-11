import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Footprints, Shield, Flag, Clock, Trophy, Star, ShoppingBag } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface CategoryCard {
  title: string
  subtitle: string
  href: string
  icon: LucideIcon
  image: string
  accent: string
}

const CATEGORY_CARDS: CategoryCard[] = [
  {
    title: 'Football Long Socks',
    subtitle: 'Match-grade comfort',
    href: '/shop?q=long+socks',
    icon: Footprints,
    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80',
    accent: 'from-emerald-500/20 to-emerald-500/0',
  },
  {
    title: 'Shin Guards',
    subtitle: 'Lightweight protection',
    href: '/shop?q=shin+guards',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&q=80',
    accent: 'from-sky-500/20 to-sky-500/0',
  },
  {
    title: 'Country Flags',
    subtitle: 'Rep your nation',
    href: '/category/flags',
    icon: Flag,
    image: '/Flags.jpeg',
    accent: 'from-rose-500/20 to-rose-500/0',
  },
  {
    title: 'Retro Collection',
    subtitle: 'Iconic kits from the past',
    href: '/category/retro',
    icon: Clock,
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80',
    accent: 'from-amber-500/20 to-amber-500/0',
  },
  {
    title: 'Club Jersey',
    subtitle: 'Your favourite clubs',
    href: '/category/clubs',
    icon: Trophy,
    image: '/club-jerseys.jpeg',
    accent: 'from-purple-500/20 to-purple-500/0',
  },
  {
    title: 'Fan Edition Kits',
    subtitle: 'Wear your player\'s number',
    href: '/category/player-edition',
    icon: Star,
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80',
    accent: 'from-cyan-500/20 to-cyan-500/0',
  },
]

export function FeaturedCollections() {
  return (
    <section id="shop-by-category" className="relative overflow-hidden py-16 md:py-20">
      <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-[600px] rounded-full bg-brand/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="inline-block rounded-full border border-brand/30 bg-brand/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-brand">
              <ShoppingBag className="mr-1 inline h-3 w-3" /> Complete Your Kit
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              Shop by <span className="text-brand">Category</span>
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Jerseys, accessories &amp; fan gear — all in one place
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden shrink-0 text-sm font-semibold text-brand hover:underline md:block"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {CATEGORY_CARDS.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to={card.href}
                  className="group relative flex aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface-elevated transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-2xl hover:shadow-brand/10 md:aspect-[5/6]"
                >
                  {/* Image */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Colored accent gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-tr ${card.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

                  {/* Dark gradient for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                  {/* Icon badge */}
                  <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-black md:h-11 md:w-11">
                    <Icon className="h-4 w-4 md:h-5 md:w-5" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-3 md:p-5">
                    <h3 className="text-base font-black leading-tight text-white md:text-xl">
                      {card.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-white/70 md:text-xs">
                      {card.subtitle}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand opacity-0 transition-all duration-300 group-hover:opacity-100 md:text-xs">
                      Shop now <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
