import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FEATURED_COLLECTIONS } from '@/constants/categories'
import { ArrowRight } from 'lucide-react'

export function FeaturedCollections() {
  const [main, ...rest] = FEATURED_COLLECTIONS

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Shop by Category</h2>
            <p className="mt-1 text-sm text-text-muted">Everything a fan needs, all in one place</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Large card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="md:row-span-2"
          >
            <Link
              to={main.href}
              className="group relative flex aspect-[4/3] overflow-hidden rounded-2xl md:aspect-auto md:h-full"
            >
              <img
                src={main.image}
                alt={main.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 md:p-7">
                <span className="mb-2 inline-block rounded-full bg-brand/90 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-white">
                  Most Popular
                </span>
                <h3 className="text-2xl font-black text-white md:text-3xl">{main.title}</h3>
                <p className="mt-1 text-sm text-white/70">{main.subtitle}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand group-hover:underline">
                  {main.cta} <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Smaller cards */}
          {rest.map((col, i) => (
            <motion.div
              key={col.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i + 1) * 0.1 }}
            >
              <Link
                to={col.href}
                className="group relative flex aspect-[16/7] overflow-hidden rounded-2xl md:aspect-[16/9]"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 md:p-5">
                  <h3 className="text-lg font-black text-white md:text-xl">{col.title}</h3>
                  <p className="mt-0.5 text-xs text-white/70">{col.subtitle}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand group-hover:underline">
                    {col.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
