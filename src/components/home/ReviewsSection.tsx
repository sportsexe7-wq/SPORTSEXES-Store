import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { REVIEWS } from '@/constants/reviews'
import { cn } from '@/utils/cn'

export function ReviewsSection() {
  return (
    <section className="border-t border-border bg-surface-elevated py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-2 text-text-muted">Real reviews from real fans across India</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl border border-border bg-surface p-6"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-brand/20" />
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={cn(
                      'h-4 w-4',
                      j < review.rating ? 'fill-brand text-brand' : 'text-border',
                    )}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="font-semibold">{review.name}</p>
                <p className="text-xs text-text-muted">{review.location} · {review.product}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
