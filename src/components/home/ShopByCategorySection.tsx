import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FIFA_COUNTRIES } from '@/constants/countries'

export function ShopByCategorySection() {
  return (
    <section id="shop-by-category" className="border-y border-border bg-surface-elevated py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Shop by Category</h2>
          <p className="mt-2 text-text-muted">
            National team jerseys ranked by FIFA — tap a country to browse
          </p>
        </div>

        <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-2">
          {FIFA_COUNTRIES.slice(0, 10).map((country, i) => (
            <motion.div
              key={country.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="shrink-0"
            >
              <Link
                to={`/category/${country.slug}`}
                className="group flex flex-col items-center gap-2.5"
              >
                <div className="relative">
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-border bg-surface text-3xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:border-brand group-hover:shadow-brand/20 md:h-20 md:w-20 md:text-4xl">
                    {country.flag}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[10px] font-black text-black ring-2 ring-surface-elevated">
                    {country.rank}
                  </span>
                </div>
                <span className="w-[72px] truncate text-center text-xs font-medium text-text-muted transition-colors group-hover:text-white md:text-sm">
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
