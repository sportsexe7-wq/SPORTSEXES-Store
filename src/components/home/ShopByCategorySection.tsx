import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FIFA_COUNTRIES } from '@/constants/countries'

export function ShopByCategorySection() {
  return (
    <section id="shop-by-country" className="relative overflow-hidden border-y border-border bg-gradient-to-b from-surface-elevated via-surface-elevated to-surface py-16 md:py-20">
      {/* Decorative blurred glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[800px] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="inline-block rounded-full border border-brand/30 bg-brand/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-brand">
              FIFA Top Nations
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              Shop by <span className="text-brand">Country</span>
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              National team jerseys ranked by FIFA — tap a country to browse
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden shrink-0 text-sm font-semibold text-brand hover:underline md:block"
          >
            View all →
          </Link>
        </div>

        <div className="scrollbar-hide -mx-4 flex gap-5 overflow-x-auto px-4 pb-3 md:gap-6">
          {FIFA_COUNTRIES.slice(0, 12).map((country, i) => (
            <motion.div
              key={country.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="shrink-0"
            >
              <Link
                to={`/category/${country.slug}`}
                className="group flex flex-col items-center gap-2.5"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-brand/0 blur-xl transition-all duration-500 group-hover:bg-brand/40" />
                  <div className="relative flex h-[78px] w-[78px] items-center justify-center rounded-full border-2 border-border bg-gradient-to-br from-surface to-surface-elevated text-3xl shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:border-brand group-hover:shadow-brand/30 md:h-[88px] md:w-[88px] md:text-4xl">
                    {country.flag}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[10px] font-black text-black ring-2 ring-surface-elevated">
                    {country.rank}
                  </span>
                </div>
                <span className="w-[78px] truncate text-center text-xs font-semibold text-text-muted transition-colors group-hover:text-white md:w-[88px] md:text-sm">
                  {country.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
