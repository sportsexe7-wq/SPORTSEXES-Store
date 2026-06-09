import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FEATURED_COLLECTIONS } from '@/constants/categories'

export function FeaturedCollections() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">
          Featured Collections
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURED_COLLECTIONS.map((collection, i) => (
            <motion.div
              key={collection.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/category/${collection.slug}`}
                className="group relative block aspect-[16/9] overflow-hidden rounded-2xl"
              >
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <h3 className="text-xl font-bold md:text-2xl">{collection.title}</h3>
                  <p className="mt-1 text-sm text-white/70">{collection.subtitle}</p>
                  <span className="mt-3 inline-block text-sm font-semibold text-brand group-hover:underline">
                    Explore →
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
