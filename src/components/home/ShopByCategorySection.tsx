import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { FIFA_COUNTRIES, FIFA_RANKINGS_URL } from '@/constants/countries'

export function ShopByCategorySection() {
  return (
    <section id="shop-by-country" className="relative overflow-hidden border-y border-border bg-gradient-to-b from-surface-elevated via-surface-elevated to-surface py-16 md:py-20">
      {/* Decorative blurred glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[800px] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-brand/30 bg-brand/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-brand">
            FIFA Top 5 Nations
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            Shop by <span className="text-brand">Country</span>
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            National team jerseys ranked by FIFA — tap a country to browse
          </p>
        </div>

        <div className="flex flex-wrap items-start justify-center gap-5 md:gap-10">
          {FIFA_COUNTRIES.map((country, i) => (
            <motion.div
              key={country.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/category/${country.slug}`}
                className="group flex flex-col items-center gap-2.5"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-brand/0 blur-xl transition-all duration-500 group-hover:bg-brand/40" />
                  <div className="relative flex h-[78px] w-[78px] items-center justify-center rounded-full border-2 border-border bg-gradient-to-br from-surface to-surface-elevated text-3xl shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:border-brand group-hover:shadow-brand/30 md:h-[96px] md:w-[96px] md:text-4xl">
                    {country.flag}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[11px] font-black text-black ring-2 ring-surface-elevated">
                    #{country.rank}
                  </span>
                </div>
                <span className="w-[78px] truncate text-center text-xs font-semibold text-text-muted transition-colors group-hover:text-white md:w-[96px] md:text-sm">
                  {country.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-[11px] text-text-muted">
          Rankings source:{' '}
          <a
            href={FIFA_RANKINGS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-semibold text-brand hover:underline"
          >
            fifa.com/world-rankings <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </p>
      </div>
    </section>
  )
}
