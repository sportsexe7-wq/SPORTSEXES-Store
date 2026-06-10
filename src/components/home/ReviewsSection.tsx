import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Star, MessageSquare } from 'lucide-react'
import { reviewService } from '@/services/reviewService'
import { ReviewCard } from '@/components/review/ReviewCard'

export function ReviewsSection() {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', 'recent'],
    queryFn: () => reviewService.getRecent(8),
  })

  if (!isLoading && reviews.length === 0) return null

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0

  return (
    <section className="relative overflow-hidden border-t border-border bg-gradient-to-b from-surface-elevated to-surface py-16 md:py-20">
      <div className="pointer-events-none absolute -top-32 right-0 h-80 w-[600px] rounded-full bg-brand/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="inline-block rounded-full border border-brand/30 bg-brand/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-brand">
              <MessageSquare className="mr-1 inline h-3 w-3" /> Real Reviews
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              What Fans Are <span className="text-brand">Saying</span>
            </h2>
            {avg > 0 && (
              <div className="mt-2 flex items-center gap-2 text-sm text-text-muted">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(avg) ? 'fill-brand text-brand' : 'text-border'}`}
                    />
                  ))}
                </div>
                <span>
                  {avg.toFixed(1)} avg · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
          <Link
            to="/shop"
            className="hidden shrink-0 text-sm font-semibold text-brand hover:underline md:block"
          >
            Browse jerseys →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-52 animate-pulse rounded-2xl bg-surface" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reviews.slice(0, 8).map((review) => (
              <ReviewCard key={review.id} review={review} showProduct />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
